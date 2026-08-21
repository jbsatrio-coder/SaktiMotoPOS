/**
 * Canonical Sales S2 planner and read-only characterization tests.
 * No function in this file creates Sales/Purchase/WOP, changes stock, or
 * writes Stock Ledger, RunningNumber, or ScriptProperties.
 */

function canonicalSalesS2Assert_(condition, message){
    if(!condition){ throw new Error("Canonical Sales S2 gagal: " + message); }
}

function canonicalSalesS2Request_(salesNumber, submissionId, items, overrides){
    const fields = overrides || {};
    return {
        salesNumber : salesNumber,
        submissionId : submissionId,
        customerId : fields.customerId === undefined ? "CUS-S2" : fields.customerId,
        vehicleId : fields.vehicleId === undefined ? "VEH-S2" : fields.vehicleId,
        workOrderId : fields.workOrderId === undefined ? "" : fields.workOrderId,
        mechanicId : fields.mechanicId === undefined ? "MKN-S2" : fields.mechanicId,
        paymentMethod : fields.paymentMethod === undefined ? "TUNAI" : fields.paymentMethod,
        amountPaid : fields.amountPaid === undefined ? 1000000 : fields.amountPaid,
        transactionDiscount : fields.transactionDiscount === undefined ? 0 : fields.transactionDiscount,
        items : items
    };
}

function canonicalSalesS2Snapshot_(){
    const barang = BarangRepository.findAll();
    const barangId = barang.length > 0 ? String(barang[0][COL_BARANG.ID] || "").trim() : "";
    const runningSheet = getSheet_(CONFIG.SHEET.RUNNING_NUMBER);
    return {
        penjualanRows : getSheet_(CONFIG.SHEET.PENJUALAN).getLastRow(),
        detailRows : getSheet_(CONFIG.SHEET.DETAIL_PENJUALAN).getLastRow(),
        ledgerRows : StockLedgerRepository.sheet().getLastRow(),
        stock : barangId ? BarangRepository.getStock(barangId) : null,
        barangId : barangId,
        runningNumber : canonicalSalesS2Safe_(runningSheet.getDataRange().getValues()),
        properties : canonicalSalesS2PropertyEntries_(PropertiesService.getScriptProperties().getProperties())
    };
}

function canonicalSalesS2PropertyEntries_(properties){
    return Object.keys(properties).sort().map(function(key){ return [key, properties[key]]; });
}

function canonicalSalesS2Safe_(value){
    if(value instanceof Date){ return value.toISOString(); }
    if(Array.isArray(value)){ return value.map(canonicalSalesS2Safe_); }
    if(value && typeof value === "object"){
        const output = {};
        Object.keys(value).forEach(function(key){ output[key] = canonicalSalesS2Safe_(value[key]); });
        return output;
    }
    return value;
}

function canonicalSalesS2AssertUnchanged_(before){
    canonicalSalesS2Assert_(getSheet_(CONFIG.SHEET.PENJUALAN).getLastRow() === before.penjualanRows, "Jumlah Penjualan berubah.");
    canonicalSalesS2Assert_(getSheet_(CONFIG.SHEET.DETAIL_PENJUALAN).getLastRow() === before.detailRows, "Jumlah DetailPenjualan berubah.");
    canonicalSalesS2Assert_(StockLedgerRepository.sheet().getLastRow() === before.ledgerRows, "Jumlah Stock Ledger berubah.");
    if(before.barangId){
        canonicalSalesS2Assert_(BarangRepository.getStock(before.barangId) === before.stock, "Stok Barang berubah.");
    }
    canonicalSalesS2Assert_(JSON.stringify(canonicalSalesS2Safe_(getSheet_(CONFIG.SHEET.RUNNING_NUMBER).getDataRange().getValues())) === JSON.stringify(before.runningNumber), "RunningNumber berubah.");
    canonicalSalesS2Assert_(JSON.stringify(canonicalSalesS2PropertyEntries_(PropertiesService.getScriptProperties().getProperties())) === JSON.stringify(before.properties), "ScriptProperties berubah.");
}

function runCanonicalSalesS2PlannerRegressionCli(){
    const before = canonicalSalesS2Snapshot_();
    const direct = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-001", "SUB-S2-001", [
        { jenis : "BARANG", kode : "BRG-S2-A", qty : 2, harga : 10000, diskon : 1000 }
    ], { amountPaid : 19000 }));
    canonicalSalesS2Assert_(direct.transactionId === "SALE:SO-S2-001:OUT" && direct.idempotencyKey === "SALE_SUBMIT:SUB-S2-001" && direct.inventoryLines.length === 1 && direct.perBarangSummary[0].totalQuantity === 2 && direct.calculatedTotal === 19000, "Direct Barang identity/total tidak sesuai.");

    const jasa = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-002", "SUB-S2-002", [
        { jenis : "JASA", kode : "JSA-S2-A", qty : 1, harga : 50000, diskon : 0 }
    ], { amountPaid : 50000 }));
    canonicalSalesS2Assert_(jasa.inventoryLines.length === 0 && jasa.nonInventoryLines.length === 1 && jasa.canExecuteCanonicalSale, "JASA-only tidak sesuai.");

    const mixed = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-003", "SUB-S2-003", [
        { jenis : "BARANG", kode : "BRG-S2-A", qty : 1, harga : 10000 },
        { jenis : "JASA", kode : "JSA-S2-A", qty : 1, harga : 50000 }
    ], { amountPaid : 60000 }));
    canonicalSalesS2Assert_(mixed.inventoryLines.length === 1 && mixed.nonInventoryLines.length === 1 && mixed.calculatedTotal === 60000, "Mixed sale tidak sesuai.");

    const duplicate = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-004", "SUB-S2-004", [
        { jenis : "BARANG", kode : "BRG-S2-A", qty : 2, harga : 10000 },
        { jenis : "BARANG", kode : "BRG-S2-A", qty : 3, harga : 10000 }
    ], { amountPaid : 50000 }));
    canonicalSalesS2Assert_(duplicate.lines.length === 2 && duplicate.lines[0].sourceLineId !== duplicate.lines[1].sourceLineId && duplicate.perBarangSummary.length === 1 && duplicate.perBarangSummary[0].totalQuantity === 5, "Duplicate direct Barang harus line-preserving dan teragregasi hanya di summary.");

    const directAndWop = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-005", "SUB-S2-005", [
        { jenis : "BARANG", kode : "BRG-S2-A", qty : 1, harga : 10000, fulfillmentSource : "DIRECT_SALE" },
        { jenis : "BARANG", kode : "BRG-S2-A", qty : 1, harga : 10000, fulfillmentSource : "WORK_ORDER_FULFILLED", workOrderPartId : "WOP-S2-001" }
    ], { workOrderId : "WO-S2-001", amountPaid : 20000 }));
    canonicalSalesS2Assert_(directAndWop.inventoryLines.length === 1 && directAndWop.nonInventoryLines.length === 1 && directAndWop.perBarangSummary[0].totalQuantity === 1, "Barang WOP fulfilled tidak boleh masuk inventoryLines.");

    const reordered = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-003", "SUB-S2-003", [
        { jenis : "JASA", kode : "JSA-S2-A", qty : 1, harga : 50000 },
        { jenis : "BARANG", kode : "BRG-S2-A", qty : 1, harga : 10000 }
    ], { amountPaid : 60000 }));
    canonicalSalesS2Assert_(mixed.payloadFingerprint === reordered.payloadFingerprint && JSON.stringify(mixed.lines) === JSON.stringify(reordered.lines), "Urutan item harus tidak signifikan dan line ID deterministik.");

    const changedQty = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-003", "SUB-S2-003", [
        { jenis : "BARANG", kode : "BRG-S2-A", qty : 2, harga : 10000 },
        { jenis : "JASA", kode : "JSA-S2-A", qty : 1, harga : 50000 }
    ], { amountPaid : 70000 }));
    const changedPayment = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-003", "SUB-S2-003", mixed.lines.map(function(line){ return { jenis : line.itemType, kode : line.itemId, qty : line.quantity, harga : line.unitPriceIntent, diskon : line.lineDiscountIntent }; }), { amountPaid : 70000 }));
    const differentSubmission = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-003", "SUB-S2-OTHER", [
        { jenis : "BARANG", kode : "BRG-S2-A", qty : 1, harga : 10000 },
        { jenis : "JASA", kode : "JSA-S2-A", qty : 1, harga : 50000 }
    ], { amountPaid : 60000 }));
    canonicalSalesS2Assert_(CanonicalSalesPlanner.compareCanonicalSalesSubmission(mixed, reordered) === "SAME_SUBMISSION" && CanonicalSalesPlanner.compareCanonicalSalesSubmission(mixed, changedQty) === "CONFLICT" && CanonicalSalesPlanner.compareCanonicalSalesSubmission(mixed, changedPayment) === "CONFLICT" && CanonicalSalesPlanner.compareCanonicalSalesSubmission(mixed, differentSubmission) === "DIFFERENT_SUBMISSION", "Submission comparison tidak sesuai.");

    const invalidQty = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-006", "SUB-S2-006", [{ jenis : "BARANG", kode : "BRG-S2-A", qty : 0, harga : 10000 }]));
    const invalidType = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-007", "SUB-S2-007", [{ jenis : "PAKET", kode : "PKT-S2", qty : 1, harga : 10000 }]));
    const insufficientCash = CanonicalSalesPlanner.planCanonicalSale(canonicalSalesS2Request_("SO-S2-008", "SUB-S2-008", [{ jenis : "JASA", kode : "JSA-S2-A", qty : 1, harga : 10000 }], { amountPaid : 9999 }));
    canonicalSalesS2Assert_(!invalidQty.canExecuteCanonicalSale && !invalidType.canExecuteCanonicalSale && !insufficientCash.canExecuteCanonicalSale, "Qty/type/payment invalid harus ditolak planner.");

    canonicalSalesS2AssertUnchanged_(before);
    return { success : true, test : "CANONICAL_SALES_S2_PLANNER", message : "PASS" };
}

function canonicalSalesS2Frequency_(values){
    return values.reduce(function(result, value){
        const key = canonicalSalesText_(value) || "(blank)";
        result[key] = (result[key] || 0) + 1;
        return result;
    }, {});
}

function canonicalSalesS2BlankCounts_(headers, rows){
    return (headers || []).reduce(function(result, header, index){
        result[String(header || index)] = rows.filter(function(row){
            return !canonicalSalesText_(row[index]);
        }).length;
        return result;
    }, {});
}

function runCanonicalSalesS2ReadOnlyCharacterizationCli(){
    const headerSheet = getSheet_(CONFIG.SHEET.PENJUALAN);
    const detailSheet = getSheet_(CONFIG.SHEET.DETAIL_PENJUALAN);
    const ledgerSheet = StockLedgerRepository.sheet();
    const headers = headerSheet.getDataRange().getValues();
    const details = detailSheet.getDataRange().getValues();
    const ledger = ledgerSheet.getDataRange().getValues();
    const headerRows = headers.slice(1);
    const detailRows = details.slice(1);
    const headerIds = headerRows.reduce(function(result, row){ result[canonicalSalesText_(row[COL_PENJUALAN.NO_TRANSAKSI])] = true; return result; }, {});
    const detailIds = detailRows.map(function(row){ return canonicalSalesText_(row[COL_DETAIL.ID_DETAIL]); });
    const salesLedger = ledger.slice(1).filter(function(row){ return headerIds[canonicalSalesText_(row[COL_STOK.REFERENSI])]; });
    const duplicateReferences = salesLedger.reduce(function(result, row){
        const reference = canonicalSalesText_(row[COL_STOK.REFERENSI]);
        result[reference] = (result[reference] || 0) + 1;
        return result;
    }, {});
    const allByBarang = {};
    ledger.slice(1).forEach(function(row){
        const barangId = canonicalSalesText_(row[COL_STOK.BARANG_ID]);
        if(!allByBarang[barangId]){ allByBarang[barangId] = []; }
        allByBarang[barangId].push(row);
    });
    const salesContinuity = salesLedger.slice(0, 20).map(function(row){
        const barangRows = allByBarang[canonicalSalesText_(row[COL_STOK.BARANG_ID])] || [];
        const index = barangRows.indexOf(row);
        const previous = index > 0 ? barangRows[index - 1] : null;
        return {
            ledgerId : row[COL_STOK.ID], reference : row[COL_STOK.REFERENSI], movementType : row[COL_STOK.JENISMUTASI],
            stokAwal : row[COL_STOK.STOKAWAL], stokAkhir : row[COL_STOK.STOKAKHIR],
            previousStokAkhir : previous ? previous[COL_STOK.STOKAKHIR] : null,
            continuousWithPrevious : !previous || Number(previous[COL_STOK.STOKAKHIR]) === Number(row[COL_STOK.STOKAWAL])
        };
    });
    return canonicalSalesS2Safe_({
        success : true,
        penjualan : { headers : headers[0] || [], rowCount : headerRows.length, samples : headerRows.slice(0, 3), blankCounts : canonicalSalesS2BlankCounts_(headers[0], headerRows), statusDistribution : canonicalSalesS2Frequency_(headerRows.map(function(row){ return row[COL_PENJUALAN.STATUS]; })), paymentMethodDistribution : canonicalSalesS2Frequency_(headerRows.map(function(row){ return row[COL_PENJUALAN.METODE]; })), workOrderBlankCount : headerRows.filter(function(row){ return !canonicalSalesText_(row[COL_PENJUALAN.WORK_ORDER]); }).length, duplicateNoTransaksi : Object.keys(canonicalSalesS2Frequency_(headerRows.map(function(row){ return row[COL_PENJUALAN.NO_TRANSAKSI]; }))).filter(function(key){ return canonicalSalesS2Frequency_(headerRows.map(function(row){ return row[COL_PENJUALAN.NO_TRANSAKSI]; }))[key] > 1; }) },
        detailPenjualan : { headers : details[0] || [], rowCount : detailRows.length, samples : detailRows.slice(0, 3), blankCounts : canonicalSalesS2BlankCounts_(details[0], detailRows), duplicateDetailIds : detailIds.filter(function(id, index){ return id && detailIds.indexOf(id) !== index; }), orphanDetailCount : detailRows.filter(function(row){ return !headerIds[canonicalSalesText_(row[COL_DETAIL.NO_TRANSAKSI])]; }).length },
        stockLedger : { totalRows : ledger.length > 0 ? ledger.length - 1 : 0, salesAssociatedRows : salesLedger.length, movementTypes : canonicalSalesS2Frequency_(salesLedger.map(function(row){ return row[COL_STOK.JENISMUTASI]; })), duplicateReferences : Object.keys(duplicateReferences).filter(function(key){ return duplicateReferences[key] > 1; }), continuityFailureCount : salesContinuity.filter(function(item){ return !item.continuousWithPrevious; }).length, continuitySample : salesContinuity }
    });
}

function runCanonicalSalesS2ReadOnlyCharacterizationJsonCli(){
    return JSON.stringify(runCanonicalSalesS2ReadOnlyCharacterizationCli());
}
