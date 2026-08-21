/**
 * Purchase Canonical schema migration — preflight only in P5A.
 * Applying the append-only migration requires separate Product Owner approval.
 */
const PURCHASE_CANONICAL_SCHEMA = {
    headerRequired : [
        "ID Pembelian", "Tanggal", "Supplier", "No.Faktur", "TotalItem",
        "TotalQty", "Status", "Admin", "Keterangan", "CreatedAt"
    ],
    headerAppend : ["SubmissionId", "IdempotencyKey", "TransactionId", "PayloadFingerprint"],
    detailRequired : ["ID Pembelian", "KodeBarang", "Qty", "HargaBeli", "Subtotal"],
    detailAppend : ["LineId"]
};

function normalizePurchaseCanonicalHeader_(value){
    return String(value || "").trim().toLowerCase();
}

function getPurchaseCanonicalSchemaPreflight_(){
    const headerSheet = PurchaseRepository.getHeaderSheet();
    const detailSheet = PurchaseRepository.getDetailSheet();
    const headerHeaders = headerSheet.getRange(1, 1, 1, headerSheet.getLastColumn()).getDisplayValues()[0];
    const detailHeaders = detailSheet.getRange(1, 1, 1, detailSheet.getLastColumn()).getDisplayValues()[0];
    const analyze = function(actual, required, append){
        const normalized = actual.map(normalizePurchaseCanonicalHeader_);
        const missingRequired = required.filter(function(name){
            return normalized.indexOf(normalizePurchaseCanonicalHeader_(name)) < 0;
        });
        return {
            currentHeaders : actual,
            missingRequired : missingRequired,
            missingAppendOnly : append.filter(function(name){
                return normalized.indexOf(normalizePurchaseCanonicalHeader_(name)) < 0;
            }),
            hasDuplicateHeaders : normalized.some(function(name, index){
                return name && normalized.indexOf(name) !== index;
            })
        };
    };
    const header = analyze(headerHeaders, PURCHASE_CANONICAL_SCHEMA.headerRequired, PURCHASE_CANONICAL_SCHEMA.headerAppend);
    const detail = analyze(detailHeaders, PURCHASE_CANONICAL_SCHEMA.detailRequired, PURCHASE_CANONICAL_SCHEMA.detailAppend);
    return {
        success : true,
        mutationPerformed : false,
        header : header,
        detail : detail,
        safeToApplyAppendOnly : header.missingRequired.length === 0 &&
            detail.missingRequired.length === 0 && !header.hasDuplicateHeaders && !detail.hasDuplicateHeaders,
        headerRowCount : headerSheet.getLastRow(),
        detailRowCount : detailSheet.getLastRow()
    };
}

function runPurchaseCanonicalSchemaPreflightCli(){
    return getPurchaseCanonicalSchemaPreflight_();
}

function appendPurchaseCanonicalColumns_(sheet, columns){
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
    const normalized = headers.map(normalizePurchaseCanonicalHeader_);
    const missing = columns.filter(function(name){
        return normalized.indexOf(normalizePurchaseCanonicalHeader_(name)) < 0;
    });
    if(missing.length > 0){
        sheet.getRange(1, sheet.getLastColumn() + 1, 1, missing.length).setValues([missing]);
    }
    return missing;
}

function applyPurchaseCanonicalSchemaMigrationCli(){
    const preflight = getPurchaseCanonicalSchemaPreflight_();
    if(!preflight.safeToApplyAppendOnly){
        throw new Error("Purchase canonical schema migration tidak aman: preflight gagal.");
    }
    const headerAdded = appendPurchaseCanonicalColumns_(PurchaseRepository.getHeaderSheet(), PURCHASE_CANONICAL_SCHEMA.headerAppend);
    const detailAdded = appendPurchaseCanonicalColumns_(PurchaseRepository.getDetailSheet(), PURCHASE_CANONICAL_SCHEMA.detailAppend);
    SpreadsheetApp.flush();
    const after = getPurchaseCanonicalSchemaPreflight_();
    if(after.header.missingAppendOnly.length || after.detail.missingAppendOnly.length){
        throw new Error("Purchase canonical schema migration tidak lengkap.");
    }
    return { success : true, headerAdded : headerAdded, detailAdded : detailAdded, after : after };
}
