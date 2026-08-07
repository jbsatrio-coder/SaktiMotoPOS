function migrateJasaIdPrefix(){

    const sh = getSheet_(CONFIG.SHEET.JASA);

    const lastRow = sh.getLastRow();

    if(lastRow <= 1){

        Logger.log("Tidak ada data.");

        return;

    }

    const values = sh
        .getRange(
            2,
            1,
            lastRow - 1,
            1
        )
        .getValues();

    for(let i = 0; i < values.length; i++){

        if(values[i][0]){

            values[i][0] = String(values[i][0])
                .replace(/^JSA/, "JAS");

        }

    }

    sh.getRange(
        2,
        1,
        values.length,
        1
    ).setValues(values);

    Logger.log("Migrasi selesai.");

}

function normalizeJasaId(){

    const sh = getSheet_(CONFIG.SHEET.JASA);

    const lastRow = sh.getLastRow();

    if(lastRow <= 1) return;

    const values = sh.getRange(
        2,
        1,
        lastRow - 1,
        1
    ).getValues();

    for(let i = 0; i < values.length; i++){

        const nomor = i + 1;

        values[i][0] =
            "JAS" +
            Utilities.formatString(
                "%06d",
                nomor
            );

    }

    sh.getRange(
        2,
        1,
        values.length,
        1
    ).setValues(values);

    Logger.log("Normalisasi ID selesai.");

}

function rebuildJasaId(){

    const sh = getSheet_(CONFIG.SHEET.JASA);

    const lastRow = sh.getLastRow();

    if(lastRow <= 1){
        Logger.log("Tidak ada data.");
        return;
    }

    const values = sh.getRange(
        2,
        1,
        lastRow - 1,
        1
    ).getValues();

    for(let i = 0; i < values.length; i++){

        // Lewati baris kosong
        if(values[i][0] === ""){
            continue;
        }

        values[i][0] =
            "JAS" +
            Utilities.formatString(
                "%06d",
                i + 1
            );

    }

    sh.getRange(
        2,
        1,
        values.length,
        1
    ).setValues(values);

    Logger.log("Rebuild ID Jasa selesai.");

}