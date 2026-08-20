function testJasaSheet(){

    Logger.log(
        JasaRepository.sheet().getName()
    );

}

function testJasaFindAll(){

    Logger.log(
        JasaRepository.findAll()
    );

}

function testJasaFindById(){

    Logger.log(

        JasaRepository.findById(

            "JAS000001"

        )

    );

}

function testJasaExists(){

    Logger.log(

        JasaRepository.exists(

            "JAS000001"

        )

    );

}


function testJasaStructure(){

    const sheet =
        JasaRepository.sheet();

    Logger.log(
        "===== MASTER JASA STRUCTURE ====="
    );

    Logger.log(
        "Sheet: " +
        sheet.getName()
    );

    Logger.log(
        "Last Column: " +
        sheet.getLastColumn()
    );

    Logger.log(
        "Last Row: " +
        sheet.getLastRow()
    );

    const headers =
        sheet
            .getRange(
                1,
                1,
                1,
                sheet.getLastColumn()
            )
            .getValues()[0];

    Logger.log(
        JSON.stringify(
            headers,
            null,
            2
        )
    );

}

function testJasaSample(){

    const data =
        JasaRepository.findAll();

    Logger.log(
        "===== SAMPLE MASTER JASA ====="
    );

    Logger.log(
        JSON.stringify(
            data.slice(0, 5),
            null,
            2
        )
    );

}

function testJasaRepositorySave(){

    const document =
        JasaDocument.create({

            id:
                "JAS001000",

            nama:
                "Test Jasa Repository",

            harga:
                45000,

            komisi:
                10000,

            estimasi:
                "45 menit",

            status:
                "AKTIF"

        });


    JasaValidator.validateCreate(
        document
    );


    const result =
        JasaRepository.save(
            document
        );


    Logger.log(
        "===== JASA REPOSITORY SAVE ====="
    );


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function debugJasaRows(){

    const sheet =
        JasaRepository.sheet();

    Logger.log(
        "===== JASA ROW DEBUG ====="
    );

    Logger.log(
        "Last Row: " +
        sheet.getLastRow()
    );

    Logger.log(
        "Max Rows: " +
        sheet.getMaxRows()
    );


    // ======================================
    // CEK ROW 2-20
    // ======================================

    const awal =
        sheet
            .getRange(
                2,
                1,
                19,
                11
            )
            .getValues();

    Logger.log(
        "===== ROW 2-20 ====="
    );

    awal.forEach(function(row, index){

        const rowNumber =
            index + 2;

        Logger.log(
            "ROW " +
            rowNumber +
            " : " +
            JSON.stringify(row)
        );

    });


    // ======================================
    // CEK ROW 990-1010
    // ======================================

    const akhir =
        sheet
            .getRange(
                990,
                1,
                21,
                11
            )
            .getValues();

    Logger.log(
        "===== ROW 990-1010 ====="
    );

    akhir.forEach(function(row, index){

        const rowNumber =
            index + 990;

        Logger.log(
            "ROW " +
            rowNumber +
            " : " +
            JSON.stringify(row)
        );

    });

}

function cleanupJasaTestRows(){

    const sheet =
        JasaRepository.sheet();

    const startRow = 990;
    const endRow = 1004;

    const numRows =
        endRow - startRow + 1;


    Logger.log(
        "===== CLEANUP MASTER JASA ====="
    );

    Logger.log(
        "Clearing row " +
        startRow +
        " sampai " +
        endRow
    );


    sheet
        .getRange(
            startRow,
            1,
            numRows,
            COL_JASA.TOTAL
        )
        .clearContent();


    Logger.log(
        "Cleanup selesai."
    );

}