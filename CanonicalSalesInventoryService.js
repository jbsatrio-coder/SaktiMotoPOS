/**
 * Canonical Sales SALE_OUT executor.
 *
 * Isolated from SalesService until an explicit production migration is
 * approved. Ledger is the committed line-level evidence; this service does
 * not use ScriptProperties or mutate Sales header/detail.
 */
const CanonicalSalesInventoryService = {

    testHooks_ : null,

    setTestHooksForTest_ : function(hooks){
        this.testHooks_ = hooks || null;
    },

    buildLedgerNote_ : function(plan){
        return JSON.stringify({
            canonicalSales : true,
            transactionId : plan.transactionId,
            idempotencyKey : plan.idempotencyKey,
            payloadFingerprint : plan.payloadFingerprint
        });
    },

    parseLedgerNote_ : function(row){
        try{
            const parsed = JSON.parse(String(row[COL_STOK.KETERANGAN] || ""));
            return parsed && parsed.canonicalSales === true ? parsed : null;
        }
        catch(error){
            return null;
        }
    },

    validatePlan_ : function(plan){
        if(!plan || plan.canExecuteCanonicalSale !== true){
            throw new Error("Canonical Sales plan tidak dapat dieksekusi.");
        }

        const salesNumber = String(plan.salesNumber || plan.sourceDocumentId || "").trim();
        const submissionId = String(plan.submissionId || "").trim();
        const expectedTransactionId = "SALE:" + salesNumber + ":OUT";
        const expectedIdempotencyKey = "SALE_SUBMIT:" + submissionId;

        if(!salesNumber || !submissionId ||
            plan.transactionId !== expectedTransactionId ||
            plan.transactionType !== "SALE_OUT" ||
            plan.sourceDocumentType !== "SALES" ||
            plan.sourceDocumentId !== salesNumber ||
            plan.idempotencyKey !== expectedIdempotencyKey ||
            typeof plan.payloadFingerprint !== "string" ||
            !Array.isArray(plan.lines) || !Array.isArray(plan.inventoryLines)){
            throw new Error("Canonical Sales plan identity tidak valid.");
        }

        let fingerprint;
        try{ fingerprint = JSON.parse(plan.payloadFingerprint); }
        catch(error){ throw new Error("Canonical Sales payload fingerprint tidak valid."); }
        const settlementExecution = plan.executionContext === "WORK_ORDER_SETTLEMENT";
        const validFingerprint = settlementExecution ?
            !!fingerprint && String(fingerprint.settlementIdentity || "").trim() !== "" &&
                String(fingerprint.workOrderId || "").trim() !== "" &&
                Array.isArray(fingerprint.directSaleLines) :
            !!fingerprint && Array.isArray(fingerprint.items);
        if(!validFingerprint || JSON.stringify(fingerprint) !== plan.payloadFingerprint){
            throw new Error("Canonical Sales payload fingerprint tidak kanonis.");
        }

        const lineById = {};
        const expectedInventoryIds = [];
        const allLines = plan.lines.slice().sort(function(left, right){
            return String(left.sourceLineId || "").localeCompare(String(right.sourceLineId || ""));
        });

        allLines.forEach(function(line, index){
            const sourceLineId = String(line && line.sourceLineId || "").trim();
            const expectedLineId = salesNumber + ":L" + String(index + 1).padStart(3, "0");
            if(!line || sourceLineId !== expectedLineId || lineById[sourceLineId]){
                throw new Error("Canonical Sales sourceLineId tidak valid atau duplicate.");
            }
            lineById[sourceLineId] = line;
            if(line.requiresInventoryMovement === true){ expectedInventoryIds.push(sourceLineId); }
        });

        const inventoryIds = [];
        const lines = plan.inventoryLines.slice().sort(function(left, right){
            return String(left.sourceLineId || "").localeCompare(String(right.sourceLineId || ""));
        });
        lines.forEach(function(line){
            const sourceLineId = String(line && line.sourceLineId || "").trim();
            const barangId = String(line && line.barangId || "").trim();
            const quantity = Number(line && line.quantity);
            const original = lineById[sourceLineId];
            if(!line || !original || inventoryIds.indexOf(sourceLineId) >= 0 ||
                !barangId || !Number.isFinite(quantity) || quantity <= 0 ||
                line.itemType !== "BARANG" || line.requiresInventoryMovement !== true ||
                line.fulfillmentSource !== "DIRECT_SALE" || line.direction !== "OUT" ||
                original.itemType !== line.itemType ||
                String(original.barangId || "").trim() !== barangId ||
                Number(original.quantity) !== quantity ||
                original.requiresInventoryMovement !== true ||
                original.fulfillmentSource !== "DIRECT_SALE" ||
                original.direction !== "OUT"){
                throw new Error("Canonical Sales inventory line tidak valid: " + sourceLineId);
            }
            inventoryIds.push(sourceLineId);
        });

        if(inventoryIds.join("|") !== expectedInventoryIds.sort().join("|")){
            throw new Error("Canonical Sales inventoryLines tidak sesuai dengan plan lines.");
        }

        return lines;
    },

    getLedgerEvidence_ : function(plan, lines){
        const evidence = lines.map(function(line){
            const rows = StockLedgerRepository.findByReferensiFresh(line.sourceLineId);
            const matching = rows.filter(function(row){
                const note = CanonicalSalesInventoryService.parseLedgerNote_(row);
                return String(row[COL_STOK.JENISMUTASI] || "").trim() === MovementType.SALE &&
                    String(row[COL_STOK.BARANG_ID] || "").trim() === line.barangId &&
                    Number(row[COL_STOK.QTYKELUAR] || 0) === Number(line.quantity) &&
                    Number(row[COL_STOK.QTYMASUK] || 0) === 0 &&
                    Number(row[COL_STOK.STOKAKHIR]) === Number(row[COL_STOK.STOKAWAL]) - Number(line.quantity) &&
                    note && note.transactionId === plan.transactionId &&
                    note.idempotencyKey === plan.idempotencyKey &&
                    note.payloadFingerprint === plan.payloadFingerprint;
            });
            return { line : line, rows : rows, matching : matching };
        });

        evidence.forEach(function(item){
            if(item.rows.length > 0 && item.matching.length !== 1){
                throw new Error("Canonical Sales ledger conflict atau legacy ambiguous: " + item.line.sourceLineId);
            }
            if(item.rows.length > 1){
                throw new Error("Canonical Sales duplicate ledger source line: " + item.line.sourceLineId);
            }
        });

        return evidence;
    },

    buildReceipt_ : function(plan, evidence, newBySourceLineId){
        const items = evidence.map(function(item){
            const created = newBySourceLineId[item.line.sourceLineId];
            const row = created ? null : item.matching[0];
            return created || {
                sourceLineId : item.line.sourceLineId,
                barangId : item.line.barangId,
                qty : item.line.quantity,
                ledgerId : row[COL_STOK.ID],
                stokAwal : Number(row[COL_STOK.STOKAWAL]),
                stokAkhir : Number(row[COL_STOK.STOKAKHIR]),
                alreadyRecorded : true
            };
        });
        const existingItemCount = items.filter(function(item){ return item.alreadyRecorded; }).length;
        return {
            success : true,
            transactionId : plan.transactionId,
            sourceDocumentId : plan.sourceDocumentId,
            idempotencyKey : plan.idempotencyKey,
            totalInventoryLines : items.length,
            newItemCount : items.length - existingItemCount,
            existingItemCount : existingItemCount,
            alreadyRecorded : items.length > 0 && existingItemCount === items.length,
            items : items
        };
    },

    verifySaleOutEvidence : function(plan){
        const lock = LockService.getScriptLock();
        lock.waitLock(30000);
        try{
            const lines=this.validatePlan_(plan), evidence=this.getLedgerEvidence_(plan,lines);
            if(evidence.some(function(item){return item.matching.length!==1;})){
                throw new Error("Canonical Sales inventory evidence belum lengkap.");
            }
            return this.buildReceipt_(plan,evidence,{});
        }
        finally{ lock.releaseLock(); }
    },

    recordSaleOutBatchAtomic : function(plan){
        const lock = LockService.getScriptLock();
        lock.waitLock(30000);

        const createdLedgerIds = [];
        const stockSnapshots = [];
        let ledgerCommitted = false;

        try{
            const lines = this.validatePlan_(plan);
            const evidence = this.getLedgerEvidence_(plan, lines);
            const newEvidence = evidence.filter(function(item){ return item.rows.length === 0; });

            if(newEvidence.length === 0){
                return this.buildReceipt_(plan, evidence, {});
            }

            const stateByBarang = {};
            newEvidence.forEach(function(item){
                const line = item.line;
                const barang = BarangRepository.findById(line.barangId);
                if(!barang){ throw new Error("Barang canonical Sales tidak ditemukan: " + line.barangId); }
                const status = String(barang[COL_BARANG.STATUS] || "").trim().toUpperCase();
                if(status === "NONAKTIF"){
                    throw new Error("Barang canonical Sales tidak aktif: " + line.barangId);
                }
                if(!stateByBarang[line.barangId]){
                    stateByBarang[line.barangId] = {
                        barangId : line.barangId,
                        namaBarang : barang[COL_BARANG.NAMA] || "",
                        stokAwal : Number(barang[COL_BARANG.STOK] || 0),
                        qtyRequired : 0,
                        stokAkhir : 0,
                        runningStock : 0
                    };
                }
                stateByBarang[line.barangId].qtyRequired += Number(line.quantity);
            });

            const barangIds = Object.keys(stateByBarang).sort();
            barangIds.forEach(function(barangId){
                const state = stateByBarang[barangId];
                if(!Number.isFinite(state.stokAwal) || state.stokAwal < state.qtyRequired){
                    throw new Error("Stok tidak mencukupi untuk canonical Sales. Barang: " + barangId);
                }
                state.stokAkhir = state.stokAwal - state.qtyRequired;
                state.runningStock = state.stokAwal;
                stockSnapshots.push({ barangId : barangId, stokAwal : state.stokAwal });
            });

            const ledgerPlans = newEvidence.map(function(item){
                const line = item.line;
                const state = stateByBarang[line.barangId];
                const stokAwal = state.runningStock;
                const stokAkhir = stokAwal - Number(line.quantity);
                state.runningStock = stokAkhir;
                return { line : line, state : state, stokAwal : stokAwal, stokAkhir : stokAkhir };
            });

            barangIds.forEach(function(barangId){
                const state = stateByBarang[barangId];
                if(this.testHooks_ && typeof this.testHooks_.beforeStockUpdate === "function"){
                    this.testHooks_.beforeStockUpdate(state);
                }
                BarangRepository.updateStockAbsolute(barangId, state.stokAkhir);
            }, this);

            const newBySourceLineId = {};
            ledgerPlans.forEach(function(ledgerPlan, index){
                const line = ledgerPlan.line;
                if(this.testHooks_ && typeof this.testHooks_.beforeLedgerWrite === "function"){
                    this.testHooks_.beforeLedgerWrite(line, index);
                }
                const ledgerId = RunningNumberService.generateNoLock_(DocumentType.STOCK_LEDGER);
                createdLedgerIds.push(ledgerId);
                StockLedgerRepository.addHistory({
                    id : ledgerId,
                    tanggal : new Date(),
                    jam : new Date(),
                    barangId : line.barangId,
                    namaBarang : ledgerPlan.state.namaBarang,
                    jenisMutasi : MovementType.SALE,
                    referensi : line.sourceLineId,
                    stokAwal : ledgerPlan.stokAwal,
                    qtyMasuk : 0,
                    qtyKeluar : line.quantity,
                    stokAkhir : ledgerPlan.stokAkhir,
                    keterangan : this.buildLedgerNote_(plan),
                    admin : "SYSTEM",
                    createdAt : new Date()
                });
                newBySourceLineId[line.sourceLineId] = {
                    sourceLineId : line.sourceLineId,
                    barangId : line.barangId,
                    qty : line.quantity,
                    ledgerId : ledgerId,
                    stokAwal : ledgerPlan.stokAwal,
                    stokAkhir : ledgerPlan.stokAkhir,
                    alreadyRecorded : false
                };
            }, this);

            SpreadsheetApp.flush();
            ledgerCommitted = true;
            return this.buildReceipt_(plan, evidence, newBySourceLineId);
        }
        catch(error){
            if(!ledgerCommitted){
                for(let i = createdLedgerIds.length - 1; i >= 0; i--){
                    StockLedgerService.deleteLedgerById_(createdLedgerIds[i]);
                }
                stockSnapshots.forEach(function(snapshot){
                    BarangRepository.updateStockAbsolute(snapshot.barangId, snapshot.stokAwal);
                });
                SpreadsheetApp.flush();
                throw new Error("Canonical Sales SALE_OUT gagal dan rollback dilakukan. " + error.message);
            }
            throw error;
        }
        finally{
            lock.releaseLock();
        }
    }
};
