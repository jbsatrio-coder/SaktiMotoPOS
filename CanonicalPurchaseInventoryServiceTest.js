/** Canonical Purchase P4 executor regressions. */
function assertCanonicalPurchaseP4_(condition, message){
    if(!condition){ throw new Error("Canonical Purchase P4 gagal: " + message); }
}

function getCanonicalPurchaseP4BarangIds_(count){
    const ids = BarangRepository.findAll().map(function(row){
        return String(row[COL_BARANG.ID] || "").trim();
    }).filter(function(id){ return id; });
    const unique = ids.filter(function(id, index){ return ids.indexOf(id) === index; });
    if(unique.length < count){ throw new Error("Fixture Barang P4 tidak mencukupi."); }
    return unique.slice(0, count);
}

function createCanonicalPurchaseP4Plan_(label, items){
    const token = String(label);
    return planCanonicalPurchaseIn({
        submissionId : "SUB-P4-" + token,
        purchaseDocument : {
            header : {
                nomor : "PO-P4-" + token,
                supplier : "P4 Supplier", noFaktur : "P4-" + token,
                admin : "P4_TEST", keterangan : "Canonical P4 test"
            },
            items : items
        }
    }, { validateBarang : true });
}

function snapshotCanonicalPurchaseP4_(barangIds, plan){
    return {
        stocks : barangIds.reduce(function(result, id){
            result[id] = BarangRepository.getStock(id); return result;
        }, {}),
        ledgerRows : StockLedgerRepository.sheet().getLastRow(),
        index : PropertiesService.getScriptProperties().getProperty(
            CanonicalPurchaseInventoryService.getPropertyKey_(plan.idempotencyKey)
        )
    };
}

function cleanupCanonicalPurchaseP4Stock_(plan){
    plan.perBarangSummary.forEach(function(summary){
        InventoryService.moveStock({
            kodeBarang : summary.barangId,
            movementType : MovementType.SALE,
            qty : summary.totalQuantity,
            reference : "P4_TEST_CLEANUP:" + plan.purchaseNumber,
            note : "Canonical Purchase P4 stock cleanup",
            performedBy : "P4_TEST"
        });
    });
}

function assertCanonicalPurchaseP4Ledger_(plan, expectedCount){
    const rows = plan.lines.map(function(line){
        return StockLedgerRepository.findByReferensiFresh(line.sourceLineId);
    });
    assertCanonicalPurchaseP4_(rows.length === expectedCount && rows.every(function(lineRows){
        return lineRows.length === 1 &&
            String(lineRows[0][COL_STOK.JENISMUTASI]) === MovementType.PURCHASE;
    }), "Ledger canonical line-level tidak lengkap.");
    return rows.map(function(lineRows){ return lineRows[0]; });
}

function runCanonicalPurchaseP4ExecutorRegression_(){
    const barangIds = getCanonicalPurchaseP4BarangIds_(2);

    // One line, identical retry, conflict, and different submission.
    const one = createCanonicalPurchaseP4Plan_("ONE-" + Date.now(), [
        { kodeBarang : barangIds[0], qty : 2, hargaBeli : 10000 }
    ]);
    const oneBaseline = snapshotCanonicalPurchaseP4_([barangIds[0]], one);
    const first = CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(one);
    const retry = CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(one);
    assertCanonicalPurchaseP4_(first.alreadyRecorded === false && retry.alreadyRecorded === true &&
        BarangRepository.getStock(barangIds[0]) === oneBaseline.stocks[barangIds[0]] + 2,
        "One-line/retry tidak idempotent.");
    assertCanonicalPurchaseP4Ledger_(one, 1);
    const changed = planCanonicalPurchaseIn({
        submissionId : one.submissionId,
        purchaseDocument : {
            header : {
                nomor : one.purchaseNumber,
                supplier : "P4 Supplier", noFaktur : "P4 changed",
                admin : "P4_TEST", keterangan : "Canonical P4 test"
            },
            items : [{ kodeBarang : barangIds[0], qty : 9, hargaBeli : 10000 }]
        }
    }, { validateBarang : true });
    let conflict = false;
    try{ CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(changed); }
    catch(error){ conflict = String(error.message).indexOf("Conflict canonical Purchase") >= 0; }
    assertCanonicalPurchaseP4_(conflict, "Payload conflict tidak ditolak.");
    cleanupCanonicalPurchaseP4Stock_(one);

    const different = createCanonicalPurchaseP4Plan_("DIFF-" + Date.now(), [
        { kodeBarang : barangIds[0], qty : 2, hargaBeli : 10000 }
    ]);
    CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(different);
    assertCanonicalPurchaseP4_(BarangRepository.getStock(barangIds[0]) === oneBaseline.stocks[barangIds[0]] + 2,
        "Submission berbeda dengan payload sama tidak dieksekusi.");
    cleanupCanonicalPurchaseP4Stock_(different);

    // Multiple Barang and duplicate Barang chain.
    const multi = createCanonicalPurchaseP4Plan_("MULTI-" + Date.now(), [
        { kodeBarang : barangIds[1], qty : 3, hargaBeli : 20000 },
        { kodeBarang : barangIds[0], qty : 2, hargaBeli : 10000 }
    ]);
    const multiBaseline = snapshotCanonicalPurchaseP4_(barangIds, multi);
    CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(multi);
    assertCanonicalPurchaseP4_(BarangRepository.getStock(barangIds[0]) === multiBaseline.stocks[barangIds[0]] + 2 &&
        BarangRepository.getStock(barangIds[1]) === multiBaseline.stocks[barangIds[1]] + 3,
        "Multiple Barang tidak teragregasi benar.");
    cleanupCanonicalPurchaseP4Stock_(multi);

    const duplicate = createCanonicalPurchaseP4Plan_("DUP-" + Date.now(), [
        { kodeBarang : barangIds[0], qty : 3, hargaBeli : 10000 },
        { kodeBarang : barangIds[0], qty : 2, hargaBeli : 10000 }
    ]);
    const duplicateBaseline = BarangRepository.getStock(barangIds[0]);
    const duplicateReceipt = CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(duplicate);
    assertCanonicalPurchaseP4_(duplicateReceipt.lines.length === 2 &&
        duplicateReceipt.lines[0].stokAwal === duplicateBaseline &&
        duplicateReceipt.lines[0].stokAkhir === duplicateBaseline + 2 &&
        duplicateReceipt.lines[1].stokAwal === duplicateBaseline + 2 &&
        duplicateReceipt.lines[1].stokAkhir === duplicateBaseline + 5,
        "Duplicate Barang tidak memiliki snapshot chain deterministik.");
    assertCanonicalPurchaseP4Ledger_(duplicate, 2);
    cleanupCanonicalPurchaseP4Stock_(duplicate);

    // Invalid plan remains zero mutation.
    const invalid = createCanonicalPurchaseP4Plan_("INVALID-" + Date.now(), [
        { kodeBarang : "P4_MISSING_BARANG", qty : 1, hargaBeli : 10000 }
    ]);
    const invalidSnapshot = snapshotCanonicalPurchaseP4_([barangIds[0]], invalid);
    let invalidRejected = false;
    try{ CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(invalid); }
    catch(error){ invalidRejected = true; }
    assertCanonicalPurchaseP4_(invalidRejected &&
        StockLedgerRepository.sheet().getLastRow() === invalidSnapshot.ledgerRows &&
        BarangRepository.getStock(barangIds[0]) === invalidSnapshot.stocks[barangIds[0]],
        "Invalid Barang/qty harus zero mutation.");

    const invalidQty = createCanonicalPurchaseP4Plan_("INVALID-QTY-" + Date.now(), [
        { kodeBarang : barangIds[0], qty : 0, hargaBeli : 10000 }
    ]);
    let invalidQtyRejected = false;
    try{ CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(invalidQty); }
    catch(error){ invalidQtyRejected = true; }
    assertCanonicalPurchaseP4_(invalidQtyRejected, "Invalid qty harus zero mutation.");

    const stockRollback = createCanonicalPurchaseP4Plan_("STOCK-ROLLBACK-" + Date.now(), [
        { kodeBarang : barangIds[0], qty : 1, hargaBeli : 10000 },
        { kodeBarang : barangIds[1], qty : 1, hargaBeli : 10000 }
    ]);
    const stockRollbackSnapshot = snapshotCanonicalPurchaseP4_(barangIds, stockRollback);
    let stockUpdateCount = 0;
    CanonicalPurchaseInventoryService.setTestHooksForTest_({
        beforeStockUpdate : function(){
            stockUpdateCount++;
            if(stockUpdateCount === 2){ throw new Error("P4 forced stock update failure"); }
        }
    });
    let stockRolledBack = false;
    try{ CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(stockRollback); }
    catch(error){ stockRolledBack = String(error.message).indexOf("rollback") >= 0; }
    finally{ CanonicalPurchaseInventoryService.setTestHooksForTest_(null); }
    assertCanonicalPurchaseP4_(stockRolledBack &&
        BarangRepository.getStock(barangIds[0]) === stockRollbackSnapshot.stocks[barangIds[0]] &&
        BarangRepository.getStock(barangIds[1]) === stockRollbackSnapshot.stocks[barangIds[1]] &&
        StockLedgerRepository.sheet().getLastRow() === stockRollbackSnapshot.ledgerRows,
        "Second stock update failure harus rollback seluruh batch.");

    // First/second ledger failure and duplicate-Barang rollback.
    [0, 1].forEach(function(failAt){
        const rollback = createCanonicalPurchaseP4Plan_("ROLLBACK-" + failAt + "-" + Date.now(), [
            { kodeBarang : barangIds[0], qty : 2, hargaBeli : 10000 },
            { kodeBarang : barangIds[0], qty : 3, hargaBeli : 10000 }
        ]);
        const snapshot = snapshotCanonicalPurchaseP4_([barangIds[0]], rollback);
        CanonicalPurchaseInventoryService.setTestHooksForTest_({
            beforeLedgerWrite : function(line, index){
                if(index === failAt){ throw new Error("P4 forced ledger failure"); }
            }
        });
        let rolledBack = false;
        try{ CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(rollback); }
        catch(error){ rolledBack = String(error.message).indexOf("rollback") >= 0; }
        finally{ CanonicalPurchaseInventoryService.setTestHooksForTest_(null); }
        assertCanonicalPurchaseP4_(rolledBack &&
            BarangRepository.getStock(barangIds[0]) === snapshot.stocks[barangIds[0]] &&
            StockLedgerRepository.sheet().getLastRow() === snapshot.ledgerRows,
            "Ledger failure harus rollback seluruh duplicate Barang.");
    });

    // Missing index recovers from complete ledger. Property-without-ledger blocks.
    const recovery = createCanonicalPurchaseP4Plan_("RECOVER-" + Date.now(), [
        { kodeBarang : barangIds[0], qty : 1, hargaBeli : 10000 }
    ]);
    CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(recovery);
    const recoveryKey = CanonicalPurchaseInventoryService.getPropertyKey_(recovery.idempotencyKey);
    PropertiesService.getScriptProperties().deleteProperty(recoveryKey);
    const recovered = CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(recovery);
    assertCanonicalPurchaseP4_(recovered.alreadyRecorded === true &&
        !!PropertiesService.getScriptProperties().getProperty(recoveryKey),
        "Ledger complete tanpa property harus membangun ulang index.");
    cleanupCanonicalPurchaseP4Stock_(recovery);

    const blocked = createCanonicalPurchaseP4Plan_("BLOCK-" + Date.now(), [
        { kodeBarang : barangIds[0], qty : 1, hargaBeli : 10000 }
    ]);
    const blockedKey = CanonicalPurchaseInventoryService.getPropertyKey_(blocked.idempotencyKey);
    PropertiesService.getScriptProperties().setProperty(blockedKey, JSON.stringify({
        payloadFingerprint : blocked.payloadFingerprint
    }));
    let blockedRejected = false;
    try{ CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(blocked); }
    catch(error){ blockedRejected = String(error.message).indexOf("recovery diperlukan") >= 0; }
    finally{ PropertiesService.getScriptProperties().deleteProperty(blockedKey); }
    assertCanonicalPurchaseP4_(blockedRejected, "Property tanpa ledger harus diblokir.");

    // Ledger commit survives a technical property-write failure and retry recovers it.
    const propertyFailure = createCanonicalPurchaseP4Plan_("PROPERTY-" + Date.now(), [
        { kodeBarang : barangIds[0], qty : 1, hargaBeli : 10000 }
    ]);
    CanonicalPurchaseInventoryService.setTestHooksForTest_({
        beforePropertyWrite : function(){ throw new Error("P4 forced property failure"); }
    });
    let propertyFailed = false;
    try{ CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(propertyFailure); }
    catch(error){ propertyFailed = String(error.message).indexOf("committed") >= 0; }
    finally{ CanonicalPurchaseInventoryService.setTestHooksForTest_(null); }
    const propertyRecovered = CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(propertyFailure);
    assertCanonicalPurchaseP4_(propertyFailed && propertyRecovered.alreadyRecorded === true,
        "Property failure harus pulih dari ledger tanpa duplicate mutation.");
    cleanupCanonicalPurchaseP4Stock_(propertyFailure);

    return { success : true, test : "CANONICAL_PURCHASE_P4_EXECUTOR", message : "PASS" };
}

function runCanonicalPurchaseP4ExecutorRegressionCli(){
    const key = "CANONICAL_PURCHASE:P4:EXECUTOR";
    const properties = PropertiesService.getScriptProperties();
    properties.setProperty(key, JSON.stringify({ status : "RUNNING", startedAt : new Date().toISOString() }));
    try{
        const result = runCanonicalPurchaseP4ExecutorRegression_();
        properties.setProperty(key, JSON.stringify({ status : "PASS", finishedAt : new Date().toISOString() }));
        return result;
    }
    catch(error){
        properties.setProperty(key, JSON.stringify({ status : "FAIL", error : String(error.message || error) }));
        throw error;
    }
}

function getCanonicalPurchaseP4ExecutorStatusCli(){
    const value = PropertiesService.getScriptProperties().getProperty("CANONICAL_PURCHASE:P4:EXECUTOR");
    return value ? JSON.parse(value) : { status : "NOT_RUN" };
}

function runCanonicalPurchaseP4ConcurrencyWorkerCli(purchaseNumber, submissionId, barangId, quantity){
    const plan = planCanonicalPurchaseIn({
        submissionId : submissionId,
        purchaseDocument : {
            header : {
                nomor : purchaseNumber,
                supplier : "P4 Concurrent", noFaktur : purchaseNumber,
                admin : "P4_TEST", keterangan : "Canonical P4 concurrency"
            },
            items : [{ kodeBarang : barangId, qty : Number(quantity), hargaBeli : 10000 }]
        }
    }, { validateBarang : true });

    return CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(plan);
}

function inspectCanonicalPurchaseP4ConcurrencyCli(purchaseNumber, submissionId, barangId){
    const sourceLineId = String(purchaseNumber) + ":L001";
    const rows = StockLedgerRepository.findByReferensiFresh(sourceLineId);
    return {
        stock : BarangRepository.getStock(barangId),
        index : PropertiesService.getScriptProperties().getProperty(
            CanonicalPurchaseInventoryService.getPropertyKey_("PURCHASE_SUBMIT:" + submissionId)
        ),
        ledgers : rows.map(function(row){
            return {
                id : row[COL_STOK.ID], stokAwal : row[COL_STOK.STOKAWAL],
                qtyMasuk : row[COL_STOK.QTYMASUK], stokAkhir : row[COL_STOK.STOKAKHIR],
                movementType : row[COL_STOK.JENISMUTASI]
            };
        })
    };
}

function cleanupCanonicalPurchaseP4ConcurrencyCli(purchaseNumber, barangId, quantity){
    InventoryService.moveStock({
        kodeBarang : barangId, movementType : MovementType.SALE, qty : Number(quantity),
        reference : "P4_TEST_CLEANUP:" + purchaseNumber,
        note : "Canonical Purchase P4 concurrency cleanup", performedBy : "P4_TEST"
    });
    return { success : true };
}
