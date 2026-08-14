function testWorkOrderPhysicalSchema(){

    const sh =
        getSheet_(
            CONFIG.SHEET.WORK_ORDER
        );

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PHYSICAL SCHEMA"
    );

    Logger.log(
        "================================"
    );

    Logger.log(
        "SHEET:"
    );

    Logger.log(
        sh.getName()
    );

    Logger.log(
        "LAST COLUMN:"
    );

    Logger.log(
        sh.getLastColumn()
    );

    Logger.log(
        "LAST ROW:"
    );

    Logger.log(
        sh.getLastRow()
    );


    const headers =
        sh
            .getRange(
                1,
                1,
                1,
                sh.getLastColumn()
            )
            .getDisplayValues()[0];


    Logger.log(
        "HEADERS:"
    );

    Logger.log(
        JSON.stringify(
            headers
        )
    );


    if(
        sh.getLastRow() >= 2
    ){

        const firstRow =
            sh
                .getRange(
                    2,
                    1,
                    1,
                    sh.getLastColumn()
                )
                .getDisplayValues()[0];


        Logger.log(
            "FIRST DATA ROW:"
        );

        Logger.log(
            JSON.stringify(
                firstRow
            )
        );

    }


    Logger.log(
        "================================"
    );

}