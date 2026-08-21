/**
 * Canonical Purchase IN executor.
 * Isolated from PurchaseService until an explicit caller migration is approved.
 */
const CanonicalPurchaseInventoryService = {

    testHooks_ : null,

    setTestHooksForTest_(hooks){
        this.testHooks_ = hooks || null;
    },

    getPropertyKey_(idempotencyKey){
        return "CANONICAL_PURCHASE:IN:" + String(idempotencyKey || "").trim();
    },

    validatePlan_(plan){
        if(!plan || !plan.canExecuteCanonicalPurchase){
            throw new Error("Canonical Purchase plan tidak dapat dieksekusi.");
        }

        const purchaseNumber = String(plan.purchaseNumber || "").trim();
        const submissionId = String(plan.submissionId || "").trim();
        const expectedTransactionId = "PURCHASE:" + purchaseNumber + ":IN";
        const expectedIdempotencyKey = "PURCHASE_SUBMIT:" + submissionId;

        if(!purchaseNumber || !submissionId ||
            plan.transactionId !== expectedTransactionId ||
            plan.transactionType !== "PURCHASE_IN" ||
            plan.sourceDocumentType !== "PURCHASE" ||
            plan.sourceDocumentId !== purchaseNumber ||
            plan.idempotencyKey !== expectedIdempotencyKey ||
            typeof plan.payloadFingerprint !== "string" ||
            !Array.isArray(plan.lines) || plan.lines.length === 0 ||
            !Array.isArray(plan.perBarangSummary)){
            throw new Error("Canonical Purchase plan identity tidak valid.");
        }

        const parsedFingerprint = JSON.parse(plan.payloadFingerprint);
        const seenLineIds = {};
        const expectedSummary = {};
        const lines = plan.lines.slice().sort(function(left, right){
            return String(left.sourceLineId).localeCompare(String(right.sourceLineId));
        });

        lines.forEach(function(line, index){
            const expectedLineId = purchaseNumber + ":L" +
                String(index + 1).padStart(3, "0");
            const barangId = String(line && line.barangId || "").trim();
            const quantity = Number(line && line.quantity);
            const unitCost = Number(line && line.unitCost);

            if(!line || line.sourceLineId !== expectedLineId ||
                seenLineIds[line.sourceLineId] || !barangId ||
                !Number.isFinite(quantity) || quantity <= 0 ||
                line.direction !== "IN" || !Number.isFinite(unitCost)){
                throw new Error("Canonical Purchase line tidak valid.");
            }

            seenLineIds[line.sourceLineId] = true;
            expectedSummary[barangId] = (expectedSummary[barangId] || 0) + quantity;
        });

        if(!parsedFingerprint || !Array.isArray(parsedFingerprint.items) ||
            parsedFingerprint.items.length !== lines.length){
            throw new Error("Canonical Purchase payload fingerprint tidak valid.");
        }

        lines.forEach(function(line, index){
            const fingerprintItem = parsedFingerprint.items[index] || {};
            if(String(fingerprintItem.barangId || "").trim() !== line.barangId ||
                Number(fingerprintItem.quantity) !== Number(line.quantity) ||
                Number(fingerprintItem.unitCost) !== Number(line.unitCost)){
                throw new Error("Canonical Purchase line tidak sesuai payload fingerprint.");
            }
        });

        const summaryByBarang = {};
        plan.perBarangSummary.forEach(function(summary){
            const barangId = String(summary && summary.barangId || "").trim();
            const total = Number(summary && summary.totalQuantity);
            if(!barangId || !Number.isFinite(total) || total <= 0 || summaryByBarang[barangId]){
                throw new Error("Canonical Purchase summary tidak valid.");
            }
            summaryByBarang[barangId] = total;
        });

        if(JSON.stringify(summaryByBarang) !== JSON.stringify(expectedSummary)){
            throw new Error("Canonical Purchase summary tidak sesuai dengan line.");
        }

        return lines;
    },

    getLedgerEvidence_(lines){
        const evidence = [];

        lines.forEach(function(line){
            const rows = StockLedgerRepository.findByReferensiFresh(line.sourceLineId);
            const matching = rows.filter(function(row){
                return String(row[COL_STOK.JENISMUTASI] || "").trim() === MovementType.PURCHASE &&
                    String(row[COL_STOK.BARANG_ID] || "").trim() === line.barangId &&
                    Number(row[COL_STOK.QTYMASUK] || 0) === Number(line.quantity) &&
                    Number(row[COL_STOK.QTYKELUAR] || 0) === 0;
            });

            evidence.push({
                line : line,
                rows : rows,
                matching : matching
            });
        });

        const anyRows = evidence.some(function(item){ return item.rows.length > 0; });
        const complete = evidence.every(function(item){ return item.rows.length === 1 && item.matching.length === 1; });

        if(complete){
            const perBarangLastStock = {};
            evidence.forEach(function(item){
                const row = item.matching[0];
                const expectedStart = perBarangLastStock[item.line.barangId];
                const stokAwal = Number(row[COL_STOK.STOKAWAL]);
                const stokAkhir = Number(row[COL_STOK.STOKAKHIR]);
                if(expectedStart !== undefined && stokAwal !== expectedStart ||
                    stokAkhir !== stokAwal + Number(item.line.quantity)){
                    throw new Error("Canonical Purchase ledger existing tidak memiliki stock chain valid.");
                }
                perBarangLastStock[item.line.barangId] = stokAkhir;
            });
        }

        return { anyRows : anyRows, complete : complete, evidence : evidence };
    },

    buildReceiptFromEvidence_(plan, evidence, alreadyRecorded){
        const lines = evidence.evidence.map(function(item){
            const row = item.matching[0];
            return {
                sourceLineId : item.line.sourceLineId,
                barangId : item.line.barangId,
                qty : item.line.quantity,
                stokAwal : Number(row[COL_STOK.STOKAWAL]),
                stokAkhir : Number(row[COL_STOK.STOKAKHIR]),
                ledgerId : row[COL_STOK.ID]
            };
        });

        return {
            success : true,
            transactionId : plan.transactionId,
            idempotencyKey : plan.idempotencyKey,
            alreadyRecorded : alreadyRecorded === true,
            ledgerIds : lines.map(function(line){ return line.ledgerId; }),
            lines : lines
        };
    },

    writeIndex_(plan, receipt){
        if(this.testHooks_ && typeof this.testHooks_.beforePropertyWrite === "function"){
            this.testHooks_.beforePropertyWrite(plan, receipt);
        }

        PropertiesService.getScriptProperties().setProperty(
            this.getPropertyKey_(plan.idempotencyKey),
            JSON.stringify({
                transactionId : plan.transactionId,
                purchaseNumber : plan.purchaseNumber,
                payloadFingerprint : plan.payloadFingerprint,
                ledgerIds : receipt.ledgerIds
            })
        );
    },

    recordPurchaseInBatchAtomic(plan){
        const lock = LockService.getScriptLock();
        lock.waitLock(30000);

        const createdLedgerIds = [];
        const stockSnapshots = [];
        let committedLedger = false;

        try{
            const lines = this.validatePlan_(plan);
            const propertyKey = this.getPropertyKey_(plan.idempotencyKey);
            const propertyStore = PropertiesService.getScriptProperties();
            const rawIndex = propertyStore.getProperty(propertyKey);
            const index = rawIndex ? JSON.parse(rawIndex) : null;

            if(index && index.payloadFingerprint !== plan.payloadFingerprint){
                throw new Error("Conflict canonical Purchase submission: idempotencyKey memiliki payload berbeda.");
            }

            const evidence = this.getLedgerEvidence_(lines);

            if(index){
                if(!evidence.complete){
                    throw new Error("Canonical Purchase recovery diperlukan: idempotency index ada tetapi ledger tidak lengkap.");
                }
                return this.buildReceiptFromEvidence_(plan, evidence, true);
            }

            if(evidence.complete){
                const recovered = this.buildReceiptFromEvidence_(plan, evidence, true);
                this.writeIndex_(plan, recovered);
                SpreadsheetApp.flush();
                return recovered;
            }

            if(evidence.anyRows){
                throw new Error("Canonical Purchase recovery diperlukan: ditemukan ledger line-level tidak lengkap atau konflik.");
            }

            const stockState = {};
            lines.forEach(function(line){
                const barang = BarangRepository.findById(line.barangId);
                if(!barang){
                    throw new Error("Barang canonical Purchase tidak ditemukan: " + line.barangId);
                }

                if(!stockState[line.barangId]){
                    stockState[line.barangId] = {
                        barangId : line.barangId,
                        namaBarang : barang[COL_BARANG.NAMA] || "",
                        stokAwal : Number(barang[COL_BARANG.STOK] || 0),
                        stokAkhir : Number(barang[COL_BARANG.STOK] || 0)
                    };
                }
                stockState[line.barangId].stokAkhir += line.quantity;
            });

            Object.keys(stockState).sort().forEach(function(barangId){
                stockSnapshots.push(stockState[barangId]);
                if(this.testHooks_ && typeof this.testHooks_.beforeStockUpdate === "function"){
                    this.testHooks_.beforeStockUpdate(stockState[barangId]);
                }
                BarangRepository.updateStockAbsolute(barangId, stockState[barangId].stokAkhir);
            }, this);

            const runningStock = {};
            const receiptLines = [];
            lines.forEach(function(line){
                const state = stockState[line.barangId];
                const stokAwal = runningStock[line.barangId] === undefined ?
                    state.stokAwal : runningStock[line.barangId];
                const stokAkhir = stokAwal + line.quantity;
                const ledgerId = RunningNumberService.generate(DocumentType.STOCK_LEDGER);

                if(this.testHooks_ && typeof this.testHooks_.beforeLedgerWrite === "function"){
                    this.testHooks_.beforeLedgerWrite(line, createdLedgerIds.length);
                }
                StockLedgerRepository.addHistory({
                    id : ledgerId,
                    tanggal : new Date(),
                    jam : new Date(),
                    barangId : line.barangId,
                    namaBarang : state.namaBarang,
                    jenisMutasi : MovementType.PURCHASE,
                    referensi : line.sourceLineId,
                    stokAwal : stokAwal,
                    qtyMasuk : line.quantity,
                    qtyKeluar : 0,
                    stokAkhir : stokAkhir,
                    keterangan : "Canonical Purchase IN",
                    admin : "SYSTEM",
                    createdAt : new Date()
                });
                createdLedgerIds.push(ledgerId);
                runningStock[line.barangId] = stokAkhir;
                receiptLines.push({
                    sourceLineId : line.sourceLineId,
                    barangId : line.barangId,
                    qty : line.quantity,
                    stokAwal : stokAwal,
                    stokAkhir : stokAkhir,
                    ledgerId : ledgerId
                });
            }, this);

            committedLedger = true;
            const receipt = {
                success : true,
                transactionId : plan.transactionId,
                idempotencyKey : plan.idempotencyKey,
                alreadyRecorded : false,
                ledgerIds : createdLedgerIds.slice(),
                lines : receiptLines
            };

            this.writeIndex_(plan, receipt);
            SpreadsheetApp.flush();
            return receipt;
        }
        catch(error){
            if(committedLedger){
                throw new Error("Canonical Purchase sudah committed; idempotency index perlu recovery pada retry. " + error.message);
            }

            for(let i = createdLedgerIds.length - 1; i >= 0; i--){
                StockLedgerService.deleteLedgerById_(createdLedgerIds[i]);
            }
            stockSnapshots.forEach(function(snapshot){
                BarangRepository.updateStockAbsolute(snapshot.barangId, snapshot.stokAwal);
            });
            SpreadsheetApp.flush();
            throw new Error("Canonical Purchase IN gagal dan rollback dilakukan. " + error.message);
        }
        finally{
            lock.releaseLock();
        }
    }
};
