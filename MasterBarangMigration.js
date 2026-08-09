/**
 * ============================================
 * Master Barang Migration
 * Convert numeric ID -> BRGxxxxxx
 * ============================================
 */

function migrateMasterBarangId(){

    const sh = getSheet_(
        CONFIG.SHEET.BARANG
    );

    const lastRow = sh.getLastRow();

    if(lastRow < 2){

        Logger.log(
            "MasterBarang kosong."
        );

        return;

    }

    const range = sh.getRange(
        2,
        COL_BARANG.ID + 1,
        lastRow - 1,
        1
    );

    const values = range.getValues();

    const converted = values.map(row => {

        const value = row[0];

        if(value === "" || value === null){

            return [""];

        }

        const text = String(value).trim();

        // Jika sudah BRGxxxxxx, jangan ubah lagi
        if(
            text.toUpperCase().startsWith("BRG")
        ){

            return [text];

        }

        const number = Number(value);

        if(!Number.isFinite(number)){

            throw new Error(
                "ID Barang tidak valid : " +
                value
            );

        }

        return [
            "BRG" +
            String(Math.trunc(number))
                .padStart(6, "0")
        ];

    });

    range.setValues(converted);

    Logger.log(
        "Migrasi ID MasterBarang selesai."
    );

}

function testMasterBarangIdMigration(){

    const sh = getSheet_(
        CONFIG.SHEET.BARANG
    );

    const lastRow = sh.getLastRow();

    if(lastRow < 2){

        Logger.log("MasterBarang kosong.");

        return;

    }

    const jumlahBaris =
        Math.min(lastRow - 1, 10);

    const data = sh
        .getRange(
            2,
            1,
            jumlahBaris,
            6
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