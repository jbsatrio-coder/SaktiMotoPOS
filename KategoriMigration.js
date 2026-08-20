/**
 * ============================================
 * Kategori Migration / Cleanup
 * ============================================
 */

function cleanupMasterKategori(){

    const sheet =
        getSheet_(CONFIG.SHEET.KATEGORI);

    const lastRow =
        sheet.getLastRow();

    const backupName =
        "03_MasterKategori_BACKUP_" +
        Utilities.formatDate(
            new Date(),
            Session.getScriptTimeZone(),
            "yyyyMMdd_HHmmss"
        );

    const backup =
        sheet.copyTo(
            sheet.getParent()
        );

    backup.setName(
        backupName
    );

    Logger.log(
        "[BACKUP] " + backupName
    );


    // ======================================
    // BACA DATA
    // ======================================

    const data =
        sheet
            .getRange(
                2,
                1,
                lastRow - 1,
                2
            )
            .getValues();


    let fixed = 0;
    let deleted = 0;


    // ======================================
    // PERBAIKI KTG017 - KTG023
    // ======================================

    data.forEach(function(row, index){

        const rowNumber =
            index + 2;

        const colA =
            String(
                row[0] || ""
            ).trim();

        const colB =
            String(
                row[1] || ""
            ).trim();


        // Format rusak:
        // KTG017   Service Ringan

        const match =
            colA.match(
                /^(KTG\d{3})\s+(.+)$/
            );


        if(
            match &&
            !colB
        ){

            sheet
                .getRange(
                    rowNumber,
                    1,
                    1,
                    2
                )
                .setValues([
                    [
                        match[1],
                        match[2].trim()
                    ]
                ]);

            fixed++;

            Logger.log(
                "[FIX] Row " +
                rowNumber +
                " : " +
                match[1] +
                " | " +
                match[2].trim()
            );

        }

    });


    // ======================================
    // HAPUS DATA TEST KAT
    // ======================================

    const refreshed =
        sheet
            .getRange(
                2,
                1,
                sheet.getLastRow() - 1,
                2
            )
            .getValues();


    for(
        let i = refreshed.length - 1;
        i >= 0;
        i--
    ){

        const id =
            String(
                refreshed[i][0] || ""
            ).trim();

        if(
            id === "KAT000001"
        ){

            sheet.deleteRow(
                i + 2
            );

            deleted++;

            Logger.log(
                "[DELETE TEST] KAT000001"
            );

        }

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "===== KATEGORI CLEANUP ====="
    );

    Logger.log(
        "Row diperbaiki : " + fixed
    );

    Logger.log(
        "Data test dihapus : " + deleted
    );

    Logger.log(
        "Backup : " + backupName
    );

    Logger.log(
        "================================"
    );

}
