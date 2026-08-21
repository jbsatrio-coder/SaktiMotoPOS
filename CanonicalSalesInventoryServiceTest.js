/** Canonical Sales S3 atomic executor regressions. */

function canonicalSalesS3Assert_(condition, message){
    if(!condition){ throw new Error("Canonical Sales S3 gagal: " + message); }
}

function canonicalSalesS3BarangIds_(count){
    const ids = BarangRepository.findAll().filter(function(row){
        return String(row[COL_BARANG.ID] || "").trim() !== "BRG000001" &&
            String(row[COL_BARANG.STATUS] || "").trim().toUpperCase() !== "NONAKTIF" &&
            Number(row[COL_BARANG.STOK] || 0) >= 20;
    }).map(function(row){ return String(row[COL_BARANG.ID]).trim(); });
    if(ids.length < count){ throw new Error("Fixture Barang S3 aktif/stok cukup tidak tersedia."); }
    return ids.slice(0, count);
}

function canonicalSalesS3Plan_(label, items, fields){
    const data = fields || {};
    const token = String(label) + "-" + Date.now();
    return CanonicalSalesPlanner.planCanonicalSale({
        salesNumber : "SO-S3-" + token,
        submissionId : "SUB-S3-" + token,
        customerId : "CUS-S3", vehicleId : "VEH-S3", workOrderId : data.workOrderId || "",
        mechanicId : "MKN-S3", paymentMethod : data.paymentMethod || "TUNAI",
        amountPaid : data.amountPaid === undefined ? 999999 : data.amountPaid,
        transactionDiscount : data.transactionDiscount || 0, items : items
    });
}

function canonicalSalesS3Snapshot_(barangIds){
    return {
        stocks : barangIds.reduce(function(result, id){ result[id] = BarangRepository.getStock(id); return result; }, {}),
        ledgerRows : StockLedgerRepository.sheet().getLastRow(),
        salesRows : getSheet_(CONFIG.SHEET.PENJUALAN).getLastRow(),
        detailRows : getSheet_(CONFIG.SHEET.DETAIL_PENJUALAN).getLastRow(),
        wopRows : getSheet_(CONFIG.SHEET.WORK_ORDER_PART).getLastRow()
    };
}

function canonicalSalesS3AssertProductionUntouched_(snapshot, barangIds){
    canonicalSalesS3Assert_(getSheet_(CONFIG.SHEET.PENJUALAN).getLastRow() === snapshot.salesRows, "Penjualan berubah.");
    canonicalSalesS3Assert_(getSheet_(CONFIG.SHEET.DETAIL_PENJUALAN).getLastRow() === snapshot.detailRows, "DetailPenjualan berubah.");
    canonicalSalesS3Assert_(getSheet_(CONFIG.SHEET.WORK_ORDER_PART).getLastRow() === snapshot.wopRows, "WorkOrderPart berubah.");
    barangIds.forEach(function(id){ canonicalSalesS3Assert_(Number(BarangRepository.getStock(id)) === Number(snapshot.stocks[id]), "Stok cleanup tidak kembali: " + id); });
}

function canonicalSalesS3Cleanup_(plan){
    plan.perBarangSummary.forEach(function(summary){
        InventoryService.moveStock({
            kodeBarang : summary.barangId, movementType : MovementType.PURCHASE,
            qty : summary.totalQuantity, reference : "S3_TEST_CLEANUP:" + plan.salesNumber,
            note : "Canonical Sales S3 test compensating stock IN", performedBy : "S3_TEST"
        });
    });
}

function canonicalSalesS3AssertLedgers_(plan, expected){
    const rows = plan.inventoryLines.map(function(line){ return StockLedgerRepository.findByReferensiFresh(line.sourceLineId); });
    canonicalSalesS3Assert_(rows.every(function(lineRows){ return lineRows.length === 1 && String(lineRows[0][COL_STOK.JENISMUTASI]) === MovementType.SALE; }), "Ledger SALE canonical tidak lengkap.");
    if(expected !== undefined){ canonicalSalesS3Assert_(rows.length === expected, "Jumlah ledger tidak sesuai."); }
    return rows.map(function(lineRows){ return lineRows[0]; });
}

function canonicalSalesS3RunFunctional_(){
    const ids = canonicalSalesS3BarangIds_(2);
    const base = canonicalSalesS3Snapshot_(ids);

    const one = canonicalSalesS3Plan_("ONE", [{ jenis:"BARANG", kode:ids[0], qty:2, harga:10000 }]);
    const first = CanonicalSalesInventoryService.recordSaleOutBatchAtomic(one);
    const retry = CanonicalSalesInventoryService.recordSaleOutBatchAtomic(one);
    canonicalSalesS3Assert_(first.newItemCount === 1 && retry.alreadyRecorded && Number(BarangRepository.getStock(ids[0])) === Number(base.stocks[ids[0]]) - 2, "One-line/retry tidak idempotent.");
    canonicalSalesS3AssertLedgers_(one, 1);
    canonicalSalesS3Cleanup_(one);

    const different = canonicalSalesS3Plan_("DIFFERENT", [{ jenis:"BARANG", kode:ids[0], qty:2, harga:10000 }, { jenis:"BARANG", kode:ids[1], qty:3, harga:12000 }]);
    CanonicalSalesInventoryService.recordSaleOutBatchAtomic(different);
    canonicalSalesS3Assert_(Number(BarangRepository.getStock(ids[0])) === Number(base.stocks[ids[0]]) - 2 && Number(BarangRepository.getStock(ids[1])) === Number(base.stocks[ids[1]]) - 3, "Two different Barang gagal.");
    canonicalSalesS3AssertLedgers_(different, 2);
    canonicalSalesS3Cleanup_(different);

    const duplicate = canonicalSalesS3Plan_("DUP", [{ jenis:"BARANG", kode:ids[0], qty:2, harga:10000 }, { jenis:"BARANG", kode:ids[0], qty:3, harga:10000 }]);
    const duplicateBefore = Number(BarangRepository.getStock(ids[0]));
    CanonicalSalesInventoryService.recordSaleOutBatchAtomic(duplicate);
    const duplicateLedgers = canonicalSalesS3AssertLedgers_(duplicate, 2);
    canonicalSalesS3Assert_(Number(BarangRepository.getStock(ids[0])) === duplicateBefore - 5 && Number(duplicateLedgers[0][COL_STOK.STOKAWAL]) === duplicateBefore && Number(duplicateLedgers[0][COL_STOK.STOKAKHIR]) === duplicateBefore - 2 && Number(duplicateLedgers[1][COL_STOK.STOKAWAL]) === duplicateBefore - 2 && Number(duplicateLedgers[1][COL_STOK.STOKAKHIR]) === duplicateBefore - 5, "Duplicate Barang chain tidak deterministik.");
    canonicalSalesS3Cleanup_(duplicate);

    const mixed = canonicalSalesS3Plan_("MIXED", [{ jenis:"BARANG", kode:ids[0], qty:1, harga:10000 }, { jenis:"JASA", kode:"JSA-S3", qty:1, harga:50000 }]);
    CanonicalSalesInventoryService.recordSaleOutBatchAtomic(mixed);
    canonicalSalesS3Assert_(mixed.inventoryLines.length === 1, "JASA tidak boleh masuk executor.");
    canonicalSalesS3Cleanup_(mixed);

    const wop = canonicalSalesS3Plan_("WOP", [{ jenis:"BARANG", kode:ids[0], qty:1, harga:10000 }, { jenis:"BARANG", kode:ids[0], qty:2, harga:10000, fulfillmentSource:"WORK_ORDER_FULFILLED", workOrderPartId:"WOP-S3" }], { workOrderId:"WO-S3" });
    const wopBefore = Number(BarangRepository.getStock(ids[0]));
    CanonicalSalesInventoryService.recordSaleOutBatchAtomic(wop);
    canonicalSalesS3Assert_(wop.inventoryLines.length === 1 && Number(BarangRepository.getStock(ids[0])) === wopBefore - 1, "WOP fulfilled terkena stock-out.");
    canonicalSalesS3Cleanup_(wop);

    const partial = canonicalSalesS3Plan_("PARTIAL", [{ jenis:"BARANG", kode:ids[0], qty:1, harga:10000 }, { jenis:"BARANG", kode:ids[1], qty:1, harga:10000 }]);
    const partialLine = partial.inventoryLines[0];
    InventoryService.moveStock({ kodeBarang:partialLine.barangId, movementType:MovementType.SALE, qty:partialLine.quantity, reference:partialLine.sourceLineId, note:CanonicalSalesInventoryService.buildLedgerNote_(partial), performedBy:"S3_TEST" });
    const partialReceipt = CanonicalSalesInventoryService.recordSaleOutBatchAtomic(partial);
    canonicalSalesS3Assert_(partialReceipt.existingItemCount === 1 && partialReceipt.newItemCount === 1, "Partial existing tidak diproses benar.");
    canonicalSalesS3Cleanup_(partial);

    const insufficient = canonicalSalesS3Plan_("INSUFFICIENT", [{ jenis:"BARANG", kode:ids[0], qty:Number(BarangRepository.getStock(ids[0])) + 1, harga:10000 }]);
    const insufficientBefore = canonicalSalesS3Snapshot_([ids[0]]);
    let insufficientRejected = false;
    try{ CanonicalSalesInventoryService.recordSaleOutBatchAtomic(insufficient); }catch(error){ insufficientRejected = String(error.message).indexOf("Stok tidak mencukupi") >= 0; }
    canonicalSalesS3Assert_(insufficientRejected && Number(BarangRepository.getStock(ids[0])) === Number(insufficientBefore.stocks[ids[0]]) && StockLedgerRepository.sheet().getLastRow() === insufficientBefore.ledgerRows, "Insufficient aggregate tidak zero mutation.");

    const malformed = JSON.parse(JSON.stringify(one));
    malformed.inventoryLines[0].fulfillmentSource = "WORK_ORDER_FULFILLED";
    let malformedRejected = false;
    try{ CanonicalSalesInventoryService.recordSaleOutBatchAtomic(malformed); }catch(error){ malformedRejected = true; }
    const duplicateLine = JSON.parse(JSON.stringify(one));
    duplicateLine.inventoryLines.push(duplicateLine.inventoryLines[0]);
    let duplicateRejected = false;
    try{ CanonicalSalesInventoryService.recordSaleOutBatchAtomic(duplicateLine); }catch(error){ duplicateRejected = true; }
    canonicalSalesS3Assert_(malformedRejected && duplicateRejected, "Malformed/duplicate source line tidak ditolak.");

    const conflict = canonicalSalesS3Plan_("CONFLICT", [{ jenis:"BARANG", kode:ids[0], qty:1, harga:10000 }]);
    CanonicalSalesInventoryService.recordSaleOutBatchAtomic(conflict);
    const changed = CanonicalSalesPlanner.planCanonicalSale({ salesNumber:conflict.salesNumber, submissionId:conflict.submissionId, customerId:"CUS-S3", vehicleId:"VEH-S3", paymentMethod:"TUNAI", amountPaid:999999, items:[{ jenis:"BARANG", kode:ids[0], qty:2, harga:10000 }] });
    let conflictRejected = false;
    try{ CanonicalSalesInventoryService.recordSaleOutBatchAtomic(changed); }catch(error){ conflictRejected = String(error.message).indexOf("conflict") >= 0 || String(error.message).indexOf("ambiguous") >= 0; }
    canonicalSalesS3Assert_(conflictRejected, "Existing ledger qty conflict tidak ditolak.");
    canonicalSalesS3Cleanup_(conflict);

    ["FIRST", "SECOND"].forEach(function(kind){
        const rollback = canonicalSalesS3Plan_("LEDGER-" + kind, [{ jenis:"BARANG", kode:ids[0], qty:1, harga:10000 }, { jenis:"BARANG", kode:ids[1], qty:1, harga:10000 }]);
        const snapshot = canonicalSalesS3Snapshot_(ids);
        CanonicalSalesInventoryService.setTestHooksForTest_({ beforeLedgerWrite:function(line,index){ if((kind === "FIRST" && index === 0) || (kind === "SECOND" && index === 1)){ throw new Error("S3 forced ledger failure"); } } });
        let rolledBack = false;
        try{ CanonicalSalesInventoryService.recordSaleOutBatchAtomic(rollback); }catch(error){ rolledBack = String(error.message).indexOf("rollback") >= 0; }
        finally{ CanonicalSalesInventoryService.setTestHooksForTest_(null); }
        canonicalSalesS3Assert_(rolledBack && Number(BarangRepository.getStock(ids[0])) === Number(snapshot.stocks[ids[0]]) && Number(BarangRepository.getStock(ids[1])) === Number(snapshot.stocks[ids[1]]) && StockLedgerRepository.sheet().getLastRow() === snapshot.ledgerRows, kind + " ledger failure tidak rollback.");
    });

    const stockRollback = canonicalSalesS3Plan_("STOCK-FAIL", [{ jenis:"BARANG", kode:ids[0], qty:1, harga:10000 }, { jenis:"BARANG", kode:ids[1], qty:1, harga:10000 }]);
    const stockSnapshot = canonicalSalesS3Snapshot_(ids);
    let stockCalls = 0;
    CanonicalSalesInventoryService.setTestHooksForTest_({ beforeStockUpdate:function(){ stockCalls++; if(stockCalls === 2){ throw new Error("S3 forced stock failure"); } } });
    let stockRolledBack = false;
    try{ CanonicalSalesInventoryService.recordSaleOutBatchAtomic(stockRollback); }catch(error){ stockRolledBack = String(error.message).indexOf("rollback") >= 0; }
    finally{ CanonicalSalesInventoryService.setTestHooksForTest_(null); }
    canonicalSalesS3Assert_(stockRolledBack && Number(BarangRepository.getStock(ids[0])) === Number(stockSnapshot.stocks[ids[0]]) && Number(BarangRepository.getStock(ids[1])) === Number(stockSnapshot.stocks[ids[1]]) && StockLedgerRepository.sheet().getLastRow() === stockSnapshot.ledgerRows, "Stock update failure tidak rollback.");

    canonicalSalesS3AssertProductionUntouched_(base, ids);
    return { success:true, test:"CANONICAL_SALES_S3_FUNCTIONAL", message:"PASS", cleanup:{ movementType:MovementType.PURCHASE, totalStockRestored:"all successful fixture qty" } };
}

function runCanonicalSalesS3FunctionalRegressionCli(){ return canonicalSalesS3RunFunctional_(); }

function runCanonicalSalesS3SingleLineSmokeCli(){
    const barangId=canonicalSalesS3BarangIds_(1)[0],baseline=Number(BarangRepository.getStock(barangId)),plan=canonicalSalesS3Plan_("S5-SMOKE",[{jenis:"BARANG",kode:barangId,qty:1,harga:10000}]);
    const receipt=CanonicalSalesInventoryService.recordSaleOutBatchAtomic(plan),rows=StockLedgerRepository.findByReferensiFresh(plan.inventoryLines[0].sourceLineId);
    canonicalSalesS3Assert_(receipt.newItemCount===1&&rows.length===1&&Number(rows[0][COL_STOK.STOKAWAL])===baseline&&Number(rows[0][COL_STOK.STOKAKHIR])===baseline-1,"S3 single-line smoke tidak commit tepat sekali.");
    canonicalSalesS3Cleanup_(plan);
    canonicalSalesS3Assert_(Number(BarangRepository.getStock(barangId))===baseline,"S3 single-line smoke cleanup gagal.");
    return {success:true,test:"CANONICAL_SALES_S3_SINGLE_LINE_SMOKE",barangId:barangId,salesNumber:plan.salesNumber,ledgerId:String(rows[0][COL_STOK.ID]||""),message:"PASS"};
}

function runCanonicalSalesS3FunctionalWithStatusCli(){
    const key = "CANONICAL_SALES:S3:FUNCTIONAL";
    const properties = PropertiesService.getScriptProperties();
    properties.setProperty(key, JSON.stringify({ status:"RUNNING", startedAt:new Date().toISOString() }));
    try{
        const result = canonicalSalesS3RunFunctional_();
        properties.setProperty(key, JSON.stringify({ status:"PASS", finishedAt:new Date().toISOString(), result:result }));
        return result;
    }
    catch(error){
        properties.setProperty(key, JSON.stringify({ status:"FAIL", error:String(error.message || error), finishedAt:new Date().toISOString() }));
        throw error;
    }
}

function getCanonicalSalesS3FunctionalStatusCli(){
    const value = PropertiesService.getScriptProperties().getProperty("CANONICAL_SALES:S3:FUNCTIONAL");
    return value ? JSON.parse(value) : { status:"NOT_RUN" };
}

function runCanonicalSalesS3ParallelWorkerCli(salesNumber, submissionId, barangId, quantity){
    const plan = CanonicalSalesPlanner.planCanonicalSale({ salesNumber:String(salesNumber), submissionId:String(submissionId), customerId:"CUS-S3", vehicleId:"VEH-S3", paymentMethod:"TUNAI", amountPaid:999999, items:[{ jenis:"BARANG", kode:String(barangId), qty:Number(quantity), harga:10000 }] });
    return CanonicalSalesInventoryService.recordSaleOutBatchAtomic(plan);
}

function getCanonicalSalesS3FixtureBarangIdsCli(count){
    return canonicalSalesS3BarangIds_(Number(count) || 1);
}

function inspectCanonicalSalesS3ParallelCli(salesNumber, barangId){
    const rows = StockLedgerRepository.findByReferensiFresh(String(salesNumber) + ":L001");
    return { stock:BarangRepository.getStock(barangId), ledgers:rows.map(function(row){ return { id:row[COL_STOK.ID], movementType:row[COL_STOK.JENISMUTASI], stokAwal:row[COL_STOK.STOKAWAL], qtyKeluar:row[COL_STOK.QTYKELUAR], stokAkhir:row[COL_STOK.STOKAKHIR], reference:row[COL_STOK.REFERENSI] }; }) };
}

function cleanupCanonicalSalesS3ParallelCli(salesNumber, barangId, quantity){
    InventoryService.moveStock({
        kodeBarang:String(barangId), movementType:MovementType.PURCHASE, qty:Number(quantity),
        reference:"S3_TEST_CLEANUP:" + String(salesNumber),
        note:"Canonical Sales S3 parallel test compensating stock IN", performedBy:"S3_TEST"
    });
    return { success:true, salesNumber:String(salesNumber), barangId:String(barangId), qty:Number(quantity) };
}

function auditCanonicalSalesS3TestLedgerCli(){
    const rows = StockLedgerRepository.sheet().getDataRange().getValues().slice(1);
    const canonicalSales = rows.filter(function(row){
        const note = CanonicalSalesInventoryService.parseLedgerNote_(row);
        return note && String(note.idempotencyKey || "").indexOf("SALE_SUBMIT:SUB-S3-") === 0;
    });
    const cleanup = rows.filter(function(row){
        return String(row[COL_STOK.REFERENSI] || "").indexOf("S3_TEST_CLEANUP:SO-S3-") === 0;
    });
    const salesQty = canonicalSales.reduce(function(total,row){ return total + Number(row[COL_STOK.QTYKELUAR] || 0); }, 0);
    const cleanupQty = cleanup.reduce(function(total,row){ return total + Number(row[COL_STOK.QTYMASUK] || 0); }, 0);
    return {
        canonicalSaleLedgerCount:canonicalSales.length,
        canonicalSaleQtyOut:salesQty,
        cleanupLedgerCount:cleanup.length,
        cleanupQtyIn:cleanupQty,
        netTestStockContribution:cleanupQty - salesQty,
        brg000097Stock:BarangRepository.getStock("BRG000097"),
        salesHeaders:getSheet_(CONFIG.SHEET.PENJUALAN).getLastRow(),
        salesDetails:getSheet_(CONFIG.SHEET.DETAIL_PENJUALAN).getLastRow(),
        workOrderPartRows:getSheet_(CONFIG.SHEET.WORK_ORDER_PART).getLastRow()
    };
}
