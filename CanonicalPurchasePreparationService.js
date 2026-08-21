const CanonicalPurchasePreparationService = {
    testHooks_ : null,
    setTestHooksForTest_(hooks){ this.testHooks_ = hooks || null; },
    getPropertyKey_(submissionId){ return "CANONICAL_PURCHASE:PREPARE:" + String(submissionId || "").trim(); },
    writeProperty_(key, value){
        if(this.testHooks_ && typeof this.testHooks_.beforePropertyWrite === "function") this.testHooks_.beforePropertyWrite(value);
        PropertiesService.getScriptProperties().setProperty(key, JSON.stringify(value));
    },
    fingerprint_(purchase){ return JSON.stringify(normalizeCanonicalPurchasePayload_({header:purchase || {},items:purchase && purchase.items || []})); },
    prepareCanonicalPurchaseSubmission(purchase){
        if(!purchase || !String(purchase.submissionId || "").trim()) throw new Error("submissionId canonical Purchase wajib diisi.");
        const submissionId=String(purchase.submissionId).trim(), fingerprint=this.fingerprint_(purchase), key=this.getPropertyKey_(submissionId), lock=LockService.getScriptLock();
        lock.waitLock(30000);
        try{
            const headers=PurchaseRepository.findAllBySubmissionId(submissionId), raw=PropertiesService.getScriptProperties().getProperty(key), property=raw?JSON.parse(raw):null;
            if(headers.length>1) throw new Error("AUDIT_ANOMALY: lebih dari satu Purchase canonical untuk submissionId.");
            if(property && property.payloadFingerprint!==fingerprint) throw new Error("Canonical Purchase persisted identity conflict.");
            if(headers.length===1){
                const existing=headers[0];
                if(existing.payloadFingerprint!==fingerprint || existing.transactionId!=="PURCHASE:"+existing.purchaseNumber+":IN" || existing.idempotencyKey!=="PURCHASE_SUBMIT:"+submissionId) throw new Error("Canonical Purchase persisted identity conflict.");
                const document={header:{nomor:existing.purchaseNumber,supplier:existing.row[2],noFaktur:existing.row[3],admin:existing.row[7],keterangan:existing.row[8]},items:PurchaseRepository.findItemsByPurchaseNumber(existing.purchaseNumber)};
                const plan=planCanonicalPurchaseIn({submissionId:submissionId,purchaseDocument:document},{validateBarang:true});
                this.writeProperty_(key,{submissionId:submissionId,payloadFingerprint:fingerprint,purchaseNumber:existing.purchaseNumber,transactionId:plan.transactionId,state:"PREPARED",updatedAt:new Date().toISOString()});
                return {success:true,alreadyPrepared:true,purchaseNumber:existing.purchaseNumber,plan:plan};
            }
            if(property && property.state==="PREPARED") throw new Error("RECOVERY_REQUIRED: PREPARED property tanpa Purchase header.");
            const purchaseNumber=property ? property.purchaseNumber : RunningNumberService.generateNoLock_(DocumentType.PURCHASE), document=PurchaseService.createPurchaseDocument(purchase,{purchaseNumber:purchaseNumber}), plan=planCanonicalPurchaseIn({submissionId:submissionId,purchaseDocument:document},{validateBarang:true});
            if(!property) this.writeProperty_(key,{submissionId:submissionId,payloadFingerprint:fingerprint,purchaseNumber:purchaseNumber,transactionId:plan.transactionId,state:"RESERVED",recordedAt:new Date().toISOString()});
            if(this.testHooks_&&typeof this.testHooks_.beforeHeaderWrite==="function") this.testHooks_.beforeHeaderWrite();
            document.header.submissionId=submissionId;document.header.idempotencyKey=plan.idempotencyKey;document.header.transactionId=plan.transactionId;document.header.payloadFingerprint=plan.payloadFingerprint;document.items=plan.lines.map(function(line){return {kodeBarang:line.barangId,qty:line.quantity,hargaBeli:line.unitCost,lineId:line.sourceLineId};});
            PurchaseRepository.saveHeader(document);PurchaseRepository.saveItems(document);SpreadsheetApp.flush();
            if(PurchaseRepository.findAllBySubmissionId(submissionId).length!==1) throw new Error("AUDIT_ANOMALY: canonical Purchase tidak terverifikasi unik.");
            this.writeProperty_(key,{submissionId:submissionId,payloadFingerprint:fingerprint,purchaseNumber:purchaseNumber,transactionId:plan.transactionId,state:"PREPARED",recordedAt:property&&property.recordedAt||new Date().toISOString(),updatedAt:new Date().toISOString()});SpreadsheetApp.flush();
            return {success:true,alreadyPrepared:false,purchaseNumber:purchaseNumber,plan:plan};
        }finally{lock.releaseLock();}
    }
};
function prepareCanonicalPurchaseSubmission(purchase){return CanonicalPurchasePreparationService.prepareCanonicalPurchaseSubmission(purchase);}
