/**
 * ============================================
 * Model Number
 * Version : 1.0.0
 * ============================================
 */

function generateModelId_(){

    const sheet =
        getSheet(
            CONFIG.SHEET.MODEL
        );

    const lastRow =
        sheet.getLastRow();

    if(lastRow < 2){

        return "MOD000001";

    }

    const data =
        sheet
            .getRange(
                2,
                COL_MODEL.ID + 1,
                lastRow - 1,
                1
            )
            .getValues();

    let max = 0;

    data.forEach(row => {

        const id =
            String(
                row[0] || ""
            ).trim();

        const match =
            id.match(
                /^MOD(\d{6})$/
            );

        if(match){

            const number =
                Number(
                    match[1]
                );

            if(number > max){

                max = number;

            }

        }

    });

    if(max >= 999999){

        throw new Error(
            "ID Model sudah mencapai batas maksimum MOD999999."
        );

    }

    const next =
        max + 1;

    const id =
        "MOD" +
        String(next)
            .padStart(
                6,
                "0"
            );

    Logger.log(
        "[GENERATE MODEL ID] " +
        id
    );

    return id;

}
