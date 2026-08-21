/**
 * ============================================
 * WorkOrderPart Migration
 * Version : 1.0.0
 *
 * Migrasi:
 *
 * OLD
 * ID
 * WORK_ORDER_ID
 * WORK_ORDER_JASA_ID
 * BARANG_ID
 * KODE_BARANG
 * NAMA_BARANG_SNAPSHOT
 * QTY
 * HARGA
 * DISKON
 * STATUS
 * CATATAN
 * DIBUAT_PADA
 * DIUBAH_PADA
 * TOTAL
 *
 * menjadi:
 *
 * NEW
 * ID
 * WORK_ORDER_ID
 * WORK_ORDER_JASA_ID
 * BARANG_ID
 * NAMA_BARANG_SNAPSHOT
 * QTY
 * HARGA
 * DISKON
 * STATUS
 * CATATAN
 * DIBUAT_PADA
 * DIUBAH_PADA
 * TOTAL
 * ============================================
 */


function migrateWorkOrderPartRemoveKodeBarang(){

    const ss =
        SpreadsheetApp.getActiveSpreadsheet();

    const sh =
        getSheet_(
            CONFIG.SHEET.WORK_ORDER_PART
        );


    if(!sh){

        throw new Error(
            "Sheet WorkOrderPart tidak ditemukan."
        );

    }


    const lastRow =
        sh.getLastRow();


    const lastColumn =
        sh.getLastColumn();


    Logger.log(
        "Last Row  : " + lastRow
    );

    Logger.log(
        "Last Column : " + lastColumn
    );


    /**
     * Pastikan struktur lama
     * masih 14 kolom.
     */

    if(lastColumn !== 14){

        throw new Error(
            "Struktur " + CONFIG.SHEET.WORK_ORDER_PART + " tidak sesuai. " +
            "Ditemukan " +
            lastColumn +
            " kolom, seharusnya 14."
        );

    }


    /**
     * Ambil header
     */

    const header =
        sh
            .getRange(
                1,
                1,
                1,
                14
            )
            .getValues()[0];


    Logger.log(
        "OLD HEADER:"
    );

    Logger.log(header);


    /**
     * Ambil seluruh data
     */

    let data = [];

    if(lastRow >= 2){

        data =
            sh
                .getRange(
                    2,
                    1,
                    lastRow - 1,
                    14
                )
                .getValues();

    }


    Logger.log(
        "Jumlah data : " +
        data.length
    );


    /**
     * ========================================
     * VALIDASI BARANG_ID
     * ========================================
     *
     * BARANG_ID sekarang menjadi satu-satunya
     * referensi barang.
     */

    for(let i = 0; i < data.length; i++){

        const barangId =
            String(
                data[i][
                    COL_WORK_ORDER_PART.BARANG_ID
                ] || ""
            ).trim();


        /**
         * Lewati baris kosong.
         */

        if(!barangId){

            continue;

        }


        if(
            !BarangRepository.exists(
                barangId
            )
        ){

            throw new Error(
                "BARANG_ID tidak ditemukan di MasterBarang pada baris " +
                (i + 2) +
                " : " +
                barangId
            );

        }

    }


    Logger.log(
        "Validasi BARANG_ID : OK"
    );


    /**
     * ========================================
     * BACKUP
     * ========================================
     */

    const timestamp =
        Utilities.formatDate(

            new Date(),

            Session.getScriptTimeZone(),

            "yyyyMMdd_HHmmss"

        );


    const backupName =
        CONFIG.SHEET.WORK_ORDER_PART +
        "_BACKUP_" +
        timestamp;


    const backup =
        sh.copyTo(
            ss
        );


    backup.setName(
        backupName
    );


    Logger.log(
        "Backup dibuat : " +
        backupName
    );


    /**
     * ========================================
     * BUAT HEADER BARU
     * ========================================
     *
     * Kita tidak menulis nama header
     * secara manual.
     *
     * Header lama dipertahankan,
     * hanya KODE_BARANG dihapus.
     */

    const newHeader =
        header.filter(
            function(value, index){

                return index !==
                    COL_WORK_ORDER_PART.KODE_BARANG;

            }
        );


    /**
     * ========================================
     * BUAT DATA BARU
     * ========================================
     */

    const newData =
        data.map(
            function(row){

                return row.filter(
                    function(value, index){

                        return index !==
                            COL_WORK_ORDER_PART.KODE_BARANG;

                    }
                );

            }
        );


    Logger.log(
        "Kolom setelah migrasi : " +
        newHeader.length
    );


    /**
     * ========================================
     * TULIS ULANG SHEET
     * ========================================
     */

    sh.clearContents();


    /**
     * Header
     */

    sh
        .getRange(
            1,
            1,
            1,
            newHeader.length
        )
        .setValues([
            newHeader
        ]);


    /**
     * Data
     */

    if(newData.length > 0){

        sh
            .getRange(
                2,
                1,
                newData.length,
                newHeader.length
            )
            .setValues(
                newData
            );

    }


    /**
     * ========================================
     * SELESAI
     * ========================================
     */

    Logger.log(
        "Migrasi WorkOrderPart BERHASIL."
    );

    Logger.log(
        "Kolom lama : 14"
    );

    Logger.log(
        "Kolom baru : " +
        newHeader.length
    );

    Logger.log(
        "Backup     : " +
        backupName
    );

}

function testCurrentWorkOrderPartStructure(){

    const sh =
        getSheet_(
            CONFIG.SHEET.WORK_ORDER_PART
        );

    Logger.log(
        "Last Row : " +
        sh.getLastRow()
    );

    Logger.log(
        "Last Column : " +
        sh.getLastColumn()
    );

    const header =
        sh.getRange(
            1,
            1,
            1,
            sh.getLastColumn()
        ).getValues()[0];

    Logger.log(
        JSON.stringify(
            header,
            null,
            2
        )
    );

    if(sh.getLastRow() >= 2){

        const data =
            sh.getRange(
                2,
                1,
                1,
                sh.getLastColumn()
            ).getValues()[0];

        Logger.log(
            JSON.stringify(
                data,
                null,
                2
            )
        );

    }

}

function migrateWorkOrderPartCurrentStructure(){

    const ss =
        SpreadsheetApp.getActiveSpreadsheet();

    const sh =
        getSheet_(
            CONFIG.SHEET.WORK_ORDER_PART
        );

    if(!sh){

        throw new Error(
            "Sheet WorkOrderPart tidak ditemukan."
        );

    }

    const lastRow =
        sh.getLastRow();

    const lastColumn =
        sh.getLastColumn();

    Logger.log(
        "Last Row : " +
        lastRow
    );

    Logger.log(
        "Last Column : " +
        lastColumn
    );


    /**
     * ========================================
     * VALIDASI STRUKTUR AKTUAL
     * ========================================
     */

    if(lastColumn !== 13){

        throw new Error(
            "Jumlah kolom tidak sesuai. " +
            "Ditemukan : " +
            lastColumn +
            ", seharusnya 13."
        );

    }


    const header =
        sh.getRange(
            1,
            1,
            1,
            13
        ).getValues()[0];


    Logger.log(
        "Header aktual:"
    );

    Logger.log(
        JSON.stringify(
            header,
            null,
            2
        )
    );


    /**
     * Pastikan header benar-benar
     * sesuai struktur yang kita temukan.
     */

    const expectedHeader = [

        "ID",
        "Work Order ID",
        "Work Order Jasa ID",
        "Barang ID",
        "Kode Barang",
        "Nama Barang Snapshot",
        "Qty",
        "Harga",
        "Diskon",
        "Status",
        "Catatan",
        "Dibuat pada",
        "Diubah Pada"

    ];


    for(
        let i = 0;
        i < expectedHeader.length;
        i++
    ){

        if(
            String(header[i]).trim()
            !==
            expectedHeader[i]
        ){

            throw new Error(

                "Header tidak sesuai pada kolom " +
                (i + 1) +
                ". Ditemukan : " +
                header[i] +
                ", seharusnya : " +
                expectedHeader[i]

            );

        }

    }


    /**
     * ========================================
     * VALIDASI BARANG_ID
     * ========================================
     */

    if(lastRow >= 2){

        const data =
            sh.getRange(
                2,
                1,
                lastRow - 1,
                13
            ).getValues();


        for(
            let i = 0;
            i < data.length;
            i++
        ){

            const barangId =
                String(
                    data[i][3] || ""
                ).trim();


            if(!barangId){

                continue;

            }


            if(
                !BarangRepository.exists(
                    barangId
                )
            ){

                throw new Error(

                    "Barang tidak ditemukan pada baris " +
                    (i + 2) +
                    " : " +
                    barangId

                );

            }

        }

    }


    Logger.log(
        "Validasi BARANG_ID : OK"
    );


    /**
     * ========================================
     * BACKUP
     * ========================================
     */

    const timestamp =
        Utilities.formatDate(

            new Date(),

            Session.getScriptTimeZone(),

            "yyyyMMdd_HHmmss"

        );


    const backupName =
        CONFIG.SHEET.WORK_ORDER_PART +
        "_BACKUP_" +
        timestamp;


    const backup =
        sh.copyTo(ss);


    backup.setName(
        backupName
    );


    Logger.log(
        "Backup dibuat : " +
        backupName
    );


    /**
     * ========================================
     * HAPUS KOLOM KODE BARANG
     * ========================================
     */

    sh.deleteColumn(5);


    /**
     * ========================================
     * TAMBAHKAN TOTAL
     * ========================================
     */

    sh.getRange(
        1,
        13
    ).setValue(
        "Total"
    );


    Logger.log(
        "Kolom Kode Barang dihapus."
    );

    Logger.log(
        "Kolom Total ditambahkan."
    );


    /**
     * ========================================
     * SELESAI
     * ========================================
     */

    Logger.log(
        "Migrasi WorkOrderPart BERHASIL."
    );

    Logger.log(
        "Struktur akhir : 13 kolom."
    );

    Logger.log(
        "Backup : " +
        backupName
    );

}

function testFinalWorkOrderPartStructure(){

    const sh =
        getSheet_(
            CONFIG.SHEET.WORK_ORDER_PART
        );

    Logger.log(
        "Last Row : " +
        sh.getLastRow()
    );

    Logger.log(
        "Last Column : " +
        sh.getLastColumn()
    );

    const header =
        sh.getRange(
            1,
            1,
            1,
            13
        )
        .getValues()[0];

    Logger.log(
        JSON.stringify(
            header,
            null,
            2
        )
    );

    if(sh.getLastRow() >= 2){

        const data =
            sh.getRange(
                2,
                1,
                sh.getLastRow() - 1,
                13
            )
            .getValues();

        Logger.log(
            JSON.stringify(
                data,
                null,
                2
            )
        );

    }

}
