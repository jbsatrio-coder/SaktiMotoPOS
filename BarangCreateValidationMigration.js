/**
 * Sinkronisasi secondary defense MasterBarang dengan enum satuan aplikasi.
 * Tidak mengubah data Barang yang sudah ada.
 */

function applyBarangSatuanValidationV1(){
    const sheet = getSheet_(CONFIG.SHEET.BARANG);
    const range = sheet.getRange(
        2,
        COL_BARANG.SATUAN + 1,
        sheet.getMaxRows() - 1,
        1
    );
    const rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(BarangValidator.VALID_SATUAN, true)
        .setAllowInvalid(false)
        .build();

    range.setDataValidation(rule);
    SpreadsheetApp.flush();

    return {
        success: true,
        sheet: sheet.getName(),
        header: sheet.getRange(1, COL_BARANG.SATUAN + 1).getDisplayValue(),
        allowedSatuanJson: JSON.stringify(BarangValidator.VALID_SATUAN)
    };
}
