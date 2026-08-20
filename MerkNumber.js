/**
 * ============================================
 * Merk Number
 * Version : 1.1.0
 *
 * Format:
 * MRK000001
 * MRK000002
 * ...
 * MRK999999
 * ============================================
 */

function generateMerkId_(){

    const sheet =
        getSheet(
            CONFIG.SHEET.MERK
        );


    const lastRow =
        sheet.getLastRow();


    if(lastRow < 2){

        return "MRK000001";

    }


    const data =
        sheet
            .getRange(
                2,
                COL_MERK.ID + 1,
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
                /^MRK(\d{6})$/
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


    // ======================================
    // MAXIMUM ID
    // ======================================

    if(max >= 999999){

        throw new Error(
            "ID Merk sudah mencapai batas maksimum MRK999999."
        );

    }


    const next =
        max + 1;


    const id =
        "MRK" +
        String(next)
            .padStart(
                6,
                "0"
            );


    Logger.log(
        "[GENERATE MERK ID] " +
        id
    );


    return id;

}