/**
 * ============================================
 * MASTER KATEGORI TAXONOMY MIGRATION
 * Version : 1.0.0
 *
 * Target:
 * 13 kategori utama BARANG
 *
 * Tidak ada kategori JASA.
 * ============================================
 */

function migrateKategoriTaxonomy(){

    const ss =
        SpreadsheetApp.getActiveSpreadsheet();

    const kategoriSheet =
        getSheet_(CONFIG.SHEET.KATEGORI);

    const barangSheet =
        getSheet_(CONFIG.SHEET.BARANG);


    // ==========================================
    // LOCK
    // ==========================================

    const lock =
        LockService.getScriptLock();

    lock.waitLock(30000);


    try {

        // ======================================
        // BACKUP
        // ======================================

        const timestamp =
            Utilities.formatDate(
                new Date(),
                Session.getScriptTimeZone(),
                "yyyyMMdd_HHmmss"
            );


        const backupKategoriName =
            "03_MasterKategori_BACKUP_" +
            timestamp;

        const backupBarangName =
            "02_MasterBarang_BACKUP_KATEGORI_" +
            timestamp;


        const backupKategori =
            kategoriSheet.copyTo(ss);

        backupKategori.setName(
            backupKategoriName
        );


        const backupBarang =
            barangSheet.copyTo(ss);

        backupBarang.setName(
            backupBarangName
        );


        Logger.log(
            "[BACKUP KATEGORI] " +
            backupKategoriName
        );

        Logger.log(
            "[BACKUP BARANG] " +
            backupBarangName
        );


        // ======================================
        // TAXONOMY FINAL
        // ======================================

        const taxonomy = [

            ["KTG001", "Pelumas & Fluida"],

            ["KTG002", "Filter"],

            ["KTG003", "Penggerak"],

            ["KTG004", "Mesin"],

            ["KTG005", "Bahan Bakar & Injeksi"],

            ["KTG006", "Pengapian"],

            ["KTG007", "Kelistrikan"],

            ["KTG008", "Pengereman"],

            ["KTG009", "Kaki-kaki & Kemudi"],

            ["KTG010", "Roda & Ban"],

            ["KTG011", "Body & Aksesori"],

            ["KTG012", "Chemical & Perawatan"],

            ["KTG013", "Lain-lain"]

        ];


        // ======================================
        // BERSIHKAN MASTER KATEGORI
        // ======================================

        const maxRows =
            kategoriSheet.getMaxRows();


        if(maxRows >= 2){

            kategoriSheet
                .getRange(
                    2,
                    1,
                    maxRows - 1,
                    2
                )
                .clearContent();

        }


        // ======================================
        // TULIS TAXONOMY BARU
        // ======================================

        kategoriSheet
            .getRange(
                2,
                1,
                taxonomy.length,
                2
            )
            .setValues(
                taxonomy
            );


        Logger.log(
            "[KATEGORI] " +
            taxonomy.length +
            " kategori ditulis."
        );


        // ======================================
        // MIGRASI MASTER BARANG
        // ======================================
        //
        // Saat ini kategori barang disimpan
        // sebagai NAMA kategori.
        //
        // Kita pertahankan pola tersebut.
        //
        // Pengereman tetap Pengereman.
        // TEST -> Lain-lain.
        // ======================================

        const lastBarangRow =
            barangSheet.getLastRow();


        let barangUpdated =
            0;

        let barangTestUpdated =
            0;


        if(lastBarangRow >= 2){

            const kategoriColumn =
                COL_BARANG.KATEGORI + 1;


            const values =
                barangSheet
                    .getRange(
                        2,
                        kategoriColumn,
                        lastBarangRow - 1,
                        1
                    )
                    .getValues();


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

                    barangTestUpdated++;

                }


            });


            barangSheet
                .getRange(
                    2,
                    kategoriColumn,
                    values.length,
                    1
                )
                .setValues(
                    values
                );


            barangUpdated =
                barangTestUpdated;

        }


        // ======================================
        // VALIDASI MASTER KATEGORI
        // ======================================

        const resultKategori =
            kategoriSheet
                .getRange(
                    2,
                    1,
                    taxonomy.length,
                    2
                )
                .getValues();


        let kategoriValid =
            true;


        for(
            let i = 0;
            i < taxonomy.length;
            i++
        ){

            if(
                String(
                    resultKategori[i][0]
                ).trim()
                !==
                taxonomy[i][0]
                ||

                String(
                    resultKategori[i][1]
                ).trim()
                !==
                taxonomy[i][1]
            ){

                kategoriValid =
                    false;

                break;

            }

        }


        // ======================================
        // VALIDASI TEST BARANG
        // ======================================

        let remainingTest =
            0;


        if(lastBarangRow >= 2){

            const kategoriColumn =
                COL_BARANG.KATEGORI + 1;


            const check =
                barangSheet
                    .getRange(
                        2,
                        kategoriColumn,
                        lastBarangRow - 1,
                        1
                    )
                    .getValues();


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

        }


        // ======================================
        // FINAL LOG
        // ======================================

        Logger.log(
            "================================"
        );

        Logger.log(
            "===== KATEGORI MIGRATION ====="
        );

        Logger.log(
            "Kategori final : " +
            taxonomy.length
        );

        Logger.log(
            "Barang TEST dipindahkan : " +
            barangTestUpdated
        );

        Logger.log(
            "Barang TEST tersisa : " +
            remainingTest
        );

        Logger.log(
            "Kategori valid : " +
            kategoriValid
        );

        Logger.log(
            "Backup Kategori : " +
            backupKategoriName
        );

        Logger.log(
            "Backup Barang : " +
            backupBarangName
        );

        Logger.log(
            "STATUS : " +
            (
                kategoriValid &&
                remainingTest === 0
                    ? "SUCCESS"
                    : "CHECK REQUIRED"
            )
        );

        Logger.log(
            "================================"
        );


    }

    finally {

        lock.releaseLock();

    }

}
