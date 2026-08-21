/**
 * Canonical Sales preparation only.
 *
 * This service persists a DRAFT canonical Sales document and never invokes
 * CanonicalSalesInventoryService, SalesService, InventoryService, or a Work
 * Order settlement path. It remains isolated until a later Product Owner
 * decision wires a production caller.
 */
const CanonicalSalesPreparationService = {

    testHooks_ : null,

    setTestHooksForTest_ : function(hooks){
        this.testHooks_ = hooks || null;
    },

    getPropertyKey_ : function(submissionId){
        return "CANONICAL_SALES:PREPARE:" + String(submissionId || "").trim();
    },

    readProperty_ : function(key){
        const raw = PropertiesService.getScriptProperties().getProperty(key);
        return raw ? JSON.parse(raw) : null;
    },

    writeProperty_ : function(key, value){
        if(this.testHooks_ && typeof this.testHooks_.beforePropertyWrite === "function"){
            this.testHooks_.beforePropertyWrite(value);
        }
        PropertiesService.getScriptProperties().setProperty(key, JSON.stringify(value));
    },

    createPlan_ : function(request, salesNumber){
        const input = Object.assign({}, request || {}, {salesNumber:salesNumber});
        const plan = CanonicalSalesPlanner.planCanonicalSale(input, {
            validateAuthorities : !!(request && request.validateAuthorities)
        });
        if(!plan.canExecuteCanonicalSale){
            throw new Error("Canonical Sales preparation ditolak: " + plan.validationErrors.concat(plan.invalidLines.map(function(line){ return line.reason; })).join(" "));
        }
        return plan;
    },

    buildProperty_ : function(plan, state, recordedAt){
        return {
            submissionId : plan.submissionId,
            payloadFingerprint : plan.payloadFingerprint,
            salesNumber : plan.salesNumber,
            transactionId : plan.transactionId,
            state : state,
            recordedAt : recordedAt || new Date().toISOString(),
            updatedAt : new Date().toISOString()
        };
    },

    assertSingleExisting_ : function(existing){
        if(existing.length > 1){
            throw new Error("AUDIT_ANOMALY: lebih dari satu Sales canonical untuk submissionId.");
        }
    },

    assertPersistedIdentity_ : function(existing, plan){
        if(existing.payloadFingerprint !== plan.payloadFingerprint ||
            existing.transactionId !== plan.transactionId ||
            existing.idempotencyKey !== plan.idempotencyKey){
            throw new Error("Canonical Sales persisted identity conflict.");
        }
        const items = PenjualanRepository.findItemsBySalesNumber(existing.salesNumber);
        if(items.length !== plan.lines.length){
            throw new Error("AUDIT_ANOMALY: jumlah detail canonical Sales tidak konsisten.");
        }
        plan.lines.forEach(function(line, index){
            const item = items[index];
            if(!item || item.lineId !== line.sourceLineId || item.itemType !== line.itemType ||
                item.itemId !== line.itemId || Number(item.quantity) !== Number(line.quantity) ||
                Number(item.unitPrice) !== Number(line.unitPriceIntent) ||
                Number(item.lineDiscount) !== Number(line.lineDiscountIntent) ||
                item.fulfillmentSource !== line.fulfillmentSource ||
                item.workOrderPartId !== line.workOrderPartId){
                throw new Error("Canonical Sales persisted line conflict.");
            }
        });
    },

    buildHeader_ : function(request, plan, now){
        const header = request && (request.header || request.transaksi) || {};
        const pelanggan = request && (request.pelanggan || request.customer) || {};
        const kendaraan = request && (request.kendaraan || request.vehicle) || {};
        return {
            noTransaksi : plan.salesNumber,
            tanggal : header.tanggal || now,
            jam : header.jam || now,
            idPelanggan : plan.normalizedHeaderIntent.customerId,
            namaPelanggan : pelanggan.nama || pelanggan.name || "",
            idKendaraan : plan.normalizedHeaderIntent.vehicleId,
            platNomor : kendaraan.platNomor || kendaraan.plateNumber || "",
            mekanikUtama : plan.normalizedHeaderIntent.mechanicId,
            subtotal : plan.calculatedSubtotal,
            diskonNota : plan.calculatedDiscount,
            grandTotal : plan.calculatedTotal,
            bayar : plan.paymentIntent.amountPaid,
            kembalian : plan.paymentIntent.change === null ? 0 : plan.paymentIntent.change,
            metodeBayar : plan.paymentIntent.paymentMethod,
            admin : request && (request.admin || header.admin) || "",
            status : SalesStatus.DRAFT,
            createdAt : now,
            workOrder : plan.normalizedHeaderIntent.workOrderId,
            updatedAt : now,
            submissionId : plan.submissionId,
            idempotencyKey : plan.idempotencyKey,
            transactionId : plan.transactionId,
            payloadFingerprint : plan.payloadFingerprint
        };
    },

    buildPersistedLines_ : function(request, plan){
        const names = {};
        (request && Array.isArray(request.items) ? request.items : []).forEach(function(item){
            const type = String(item.itemType || item.jenis || "").trim().toUpperCase();
            const id = String(item.itemId || item.kode || (type === "BARANG" ? item.barangId : item.jasaId) || "").trim();
            names[type + ":" + id] = item.nama || item.name || "";
        });
        return plan.lines.map(function(line){
            return Object.assign({}, line, {
                lineId : line.sourceLineId,
                // S2 records commercial price intent. Authority validation only
                // verifies active/existing master data; it does not authorize a
                // pricing-rule change in this preparation step.
                nameSnapshot : names[line.itemType + ":" + line.itemId] || ""
            });
        });
    },

    prepareCanonicalSalesSubmission : function(request){
        const submissionId = String(request && request.submissionId || "").trim();
        if(!submissionId){ throw new Error("submissionId canonical Sales wajib diisi."); }

        const lock = LockService.getScriptLock();
        lock.waitLock(30000);
        try{
            const propertyKey = this.getPropertyKey_(submissionId);
            const property = this.readProperty_(propertyKey);
            const existing = PenjualanRepository.findAllBySubmissionId(submissionId);
            this.assertSingleExisting_(existing);

            if(existing.length === 1){
                const plan = this.createPlan_(request, existing[0].salesNumber);
                if(property && property.payloadFingerprint !== plan.payloadFingerprint){
                    throw new Error("Canonical Sales persisted identity conflict.");
                }
                this.assertPersistedIdentity_(existing[0], plan);
                this.writeProperty_(propertyKey, this.buildProperty_(plan, "PREPARED", property && property.recordedAt));
                return {success:true, alreadyPrepared:true, state:"RESUMED", salesNumber:plan.salesNumber, plan:plan};
            }

            if(property && property.state === "PREPARED"){
                throw new Error("RECOVERY_REQUIRED: PREPARED property tanpa Sales header.");
            }

            let salesNumber;
            if(property){
                // RESERVED + no document is a recoverable reservation only when
                // the incoming logical submission still has the same payload.
                const reservedPlan = this.createPlan_(request, property.salesNumber);
                if(property.payloadFingerprint !== reservedPlan.payloadFingerprint || property.state !== "RESERVED"){
                    throw new Error("Canonical Sales persisted identity conflict.");
                }
                salesNumber = property.salesNumber;
            }else{
                salesNumber = RunningNumberService.generateNoLock_(DocumentType.SALES);
            }

            const plan = this.createPlan_(request, salesNumber);
            if(!property){
                this.writeProperty_(propertyKey, this.buildProperty_(plan, "RESERVED"));
            }
            if(this.testHooks_ && typeof this.testHooks_.beforeHeaderWrite === "function"){
                this.testHooks_.beforeHeaderWrite();
            }
            const now = new Date();
            PenjualanRepository.saveCanonicalHeader(this.buildHeader_(request, plan, now));
            PenjualanRepository.saveCanonicalDetails({
                noTransaksi : plan.salesNumber,
                items : this.buildPersistedLines_(request, plan),
                createdAt : now
            });
            SpreadsheetApp.flush();
            const verified = PenjualanRepository.findAllBySubmissionId(submissionId);
            if(verified.length !== 1){
                throw new Error("AUDIT_ANOMALY: canonical Sales tidak terverifikasi unik.");
            }
            this.assertPersistedIdentity_(verified[0], plan);
            this.writeProperty_(propertyKey, this.buildProperty_(plan, "PREPARED", property && property.recordedAt));
            SpreadsheetApp.flush();
            return {success:true, alreadyPrepared:false, state:"PREPARED", salesNumber:plan.salesNumber, plan:plan};
        }finally{
            lock.releaseLock();
        }
    }
};

function prepareCanonicalSalesSubmission(request){
    return CanonicalSalesPreparationService.prepareCanonicalSalesSubmission(request);
}
