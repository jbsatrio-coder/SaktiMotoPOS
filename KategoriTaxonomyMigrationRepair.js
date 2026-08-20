/**
 * ============================================
 * REPAIR MASTER KATEGORI TAXONOMY
 * ============================================
 */

function repairKategoriTaxonomyMigration(){

    const kategoriSheet =
        getSheet_(CONFIG.SHEET.KATEGORI);

    const barangSheet =
        getSheet_(CONFIG.SHEET.BARANG);


    // ==========================================
    // TAXONOMY
    // ==========================================

    const taxonomy =
        kategoriSheet
            .getRange(
                2,
                1,
                13,
                2
            )
            .getValues();


    Logger.log(
        "[TAXONOMY] " +
        taxonomy.length +
        " kategori ditemukan."
    );


    // ==========================================
    // KOLOM KATEGORI BARANG
    // ==========================================

    const kategoriColumn =
        COL_BARANG.KATEGORI + 1;

    const lastRow =
        barangSheet.getLastRow();


    if(lastRow < 2){

        Logger.log(
            "Tidak ada barang untuk diperbaiki."
        );

        return;

    }


    const rowCount =
        lastRow - 1;


    // ==========================================
    // CLEAR VALIDATION SEMENTARA
    // ==========================================

    barangSheet
        .getRange(
            2,
            kategoriColumn,
            rowCount,
            1
        )
        .clearDataValidations();


    Logger.log(
        "[VALIDATION] Validation kategori sementara dihapus."
    );


    // ==========================================
    // MIGRASI TEST
    // ==========================================

    const range =
        barangSheet
            .getRange(
                2,
                kategoriColumn,
                rowCount,
                1
            );


    const values =
        range.getValues();


    let testUpdated = 0;


    values.forEach(function(row){

        const kategori =
            String(
                row[0] || ""
            ).trim();


        if(
            kategori === "TEST"
        ){

            row[0] =
                "Lain-lain";

            testUpdated++;

        }

    });


    range.setValues(values);


    Logger.log(
        "[BARANG] TEST -> Lain-lain : " +
        testUpdated
    );


    // ==========================================
    // BUAT DROPDOWN BARU
    // ==========================================

    const kategoriNames =
        kategoriSheet
            .getRange(
                2,
                2,
                13,
                1
            );


    const validation =
        SpreadsheetApp
            .newDataValidation()
            .requireValueInRange(
                kategoriNames,
                true
            )
            .setAllowInvalid(false)
            .build();


    range.setDataValidation(
        validation
    );


    Logger.log(
        "[VALIDATION] Dropdown kategori baru dipasang."
    );


    // ==========================================
    // CEK TEST YANG TERSISA
    // ==========================================

    const check =
        range.getValues();


    let remainingTest = 0;


    check.forEach(function(row){

        if(
            String(
                row[0] || ""
            ).trim()
            ===
            "TEST"
        ){

            remainingTest++;

        }

    });


    // ==========================================
    // LOG
    // ==========================================

    Logger.log(
        "================================"
    );

    Logger.log(
        "===== REPAIR TAXONOMY ====="
    );

    Logger.log(
        "Kategori : " +
        taxonomy.length
    );

    Logger.log(
        "TEST dipindahkan : " +
        testUpdated
    );

    Logger.log(
        "TEST tersisa : " +
        remainingTest
    );

    Logger.log(
        "Dropdown : AKTIF"
    );

    Logger.log(
        "STATUS : " +
        (
            remainingTest === 0
                ? "SUCCESS"
                : "CHECK REQUIRED"
        )
    );

    Logger.log(
        "================================"
    );

}
