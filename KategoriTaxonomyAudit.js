/**
 * ============================================
 * AUDIT TAXONOMY MASTER KATEGORI
 * ============================================
 */

function auditKategoriTaxonomy(){

    const ss =
        SpreadsheetApp.getActiveSpreadsheet();

    const kategori =
        getSheet_(CONFIG.SHEET.KATEGORI);

    const lastRow =
        kategori.getLastRow();

    const data =
        kategori
            .getRange(
                2,
                1,
                Math.max(lastRow - 1, 1),
                2
            )
            .getValues();

    Logger.log("================================");
    Logger.log("===== KATEGORI TAXONOMY AUDIT =====");
    Logger.log("================================");

    Logger.log(
        "MasterKategori rows : " +
        data.length
    );

    data.forEach(function(row, index){

        const id =
            String(row[0] || "").trim();

        const nama =
            String(row[1] || "").trim();

        if(!id && !nama){
            return;
        }

        Logger.log(
            "KATEGORI | Row " +
            (index + 2) +
            " | " +
            id +
            " | " +
            nama
        );

    });


    // ======================================
    // CEK REFERENSI KATEGORI DI MASTER BARANG
    // ======================================

    const barang =
        getSheet_(CONFIG.SHEET.BARANG);

    const lastBarangRow =
        barang.getLastRow();

    let references = {};

    if(lastBarangRow >= 2){

        const kategoriColumn =
            COL_BARANG.KATEGORI + 1;

        const values =
            barang
                .getRange(
                    2,
                    kategoriColumn,
                    lastBarangRow - 1,
                    1
                )
                .getValues();

        values.forEach(function(row){

            const value =
                String(
                    row[0] || ""
                ).trim();

            if(!value){
                return;
            }

            references[value] =
                (references[value] || 0) + 1;

        });

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "===== REFERENSI MASTER BARANG ====="
    );

    const keys =
        Object.keys(references);

    if(keys.length === 0){

        Logger.log(
            "Tidak ada kategori yang sedang digunakan."
        );

    } else {

        keys.forEach(function(key){

            Logger.log(
                key +
                " | digunakan " +
                references[key] +
                " barang"
            );

        });

    }


    Logger.log(
        "================================"
    );

}
