/**
 * Canonical Sales schema migration.
 *
 * Preflight is read-only. Applying the append-only migration requires a
 * separate explicit Product Owner approval after the preflight is reviewed.
 */
const SALES_CANONICAL_SCHEMA = {
    headerRequired : [
        "NoTransaksi", "Tanggal", "Jam", "IDPelanggan", "IDKendaraan",
        "Subtotal", "DiskonNota", "GrandTotal", "Bayar", "Kembalian",
        "MetodeBayar", "Admin", "Status", "CreatedAt", "WorkOrder", "UpdatedAt"
    ],
    headerAppend : ["SubmissionId", "IdempotencyKey", "TransactionId", "PayloadFingerprint"],
    detailRequired : [
        "IDDetail", "NoTransaksi", "Tipe", "KodeItem", "Qty", "Harga",
        "Diskon", "Subtotal", "CreatedAt", "UpdatedAt"
    ],
    // Fulfillment fields are needed to preserve the S2 line contract. They do
    // not settle a Work Order and do not trigger any inventory operation.
    detailAppend : ["LineId", "FulfillmentSource", "WorkOrderPartId"]
};

function normalizeSalesCanonicalHeader_(value){
    return String(value || "").trim().toLowerCase();
}

function analyzeSalesCanonicalSheet_(sheet, required, append){
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
    const normalized = headers.map(normalizeSalesCanonicalHeader_);
    const duplicates = headers.filter(function(header, index){
        const normalizedHeader = normalized[index];
        return normalizedHeader && normalized.indexOf(normalizedHeader) !== index;
    });
    return {
        sheetName : sheet.getName(),
        currentHeaders : headers,
        rowCount : sheet.getLastRow(),
        missingRequired : required.filter(function(name){
            return normalized.indexOf(normalizeSalesCanonicalHeader_(name)) < 0;
        }),
        missingAppendOnly : append.filter(function(name){
            return normalized.indexOf(normalizeSalesCanonicalHeader_(name)) < 0;
        }),
        duplicateHeaders : duplicates,
        hasDuplicateHeaders : duplicates.length > 0
    };
}

function getSalesCanonicalSchemaPreflight_(){
    const header = analyzeSalesCanonicalSheet_(
        PenjualanRepository.getHeaderSheet(),
        SALES_CANONICAL_SCHEMA.headerRequired,
        SALES_CANONICAL_SCHEMA.headerAppend
    );
    const detail = analyzeSalesCanonicalSheet_(
        PenjualanRepository.getDetailSheet(),
        SALES_CANONICAL_SCHEMA.detailRequired,
        SALES_CANONICAL_SCHEMA.detailAppend
    );
    return {
        success : true,
        mutationPerformed : false,
        header : header,
        detail : detail,
        safeToApplyAppendOnly : header.missingRequired.length === 0 &&
            detail.missingRequired.length === 0 &&
            !header.hasDuplicateHeaders && !detail.hasDuplicateHeaders,
        proposedColumns : {
            header : SALES_CANONICAL_SCHEMA.headerAppend,
            detail : SALES_CANONICAL_SCHEMA.detailAppend
        }
    };
}

function runSalesCanonicalSchemaPreflightCli(){
    return getSalesCanonicalSchemaPreflight_();
}

function appendSalesCanonicalColumns_(sheet, columns){
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
    const normalized = headers.map(normalizeSalesCanonicalHeader_);
    const missing = columns.filter(function(name){
        return normalized.indexOf(normalizeSalesCanonicalHeader_(name)) < 0;
    });
    if(missing.length){
        sheet.getRange(1, sheet.getLastColumn() + 1, 1, missing.length).setValues([missing]);
    }
    return missing;
}

function applySalesCanonicalSchemaMigrationCli(){
    const preflight = getSalesCanonicalSchemaPreflight_();
    if(!preflight.safeToApplyAppendOnly){
        throw new Error("Sales canonical schema migration tidak aman: preflight gagal.");
    }
    const headerAdded = appendSalesCanonicalColumns_(
        PenjualanRepository.getHeaderSheet(), SALES_CANONICAL_SCHEMA.headerAppend
    );
    const detailAdded = appendSalesCanonicalColumns_(
        PenjualanRepository.getDetailSheet(), SALES_CANONICAL_SCHEMA.detailAppend
    );
    SpreadsheetApp.flush();
    const after = getSalesCanonicalSchemaPreflight_();
    if(after.header.missingAppendOnly.length || after.detail.missingAppendOnly.length){
        throw new Error("Sales canonical schema migration tidak lengkap.");
    }
    return {success:true, headerAdded:headerAdded, detailAdded:detailAdded, after:after};
}
