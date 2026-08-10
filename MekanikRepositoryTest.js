function testMekanikSheet(){

    Logger.log(

        MekanikRepository

            .sheet()

            .getName()

    );

}

function testMekanikFindAll(){

    Logger.log(

        MekanikRepository

            .findAll()

    );

}

function testMekanikFindRow(){

    Logger.log(

        MekanikRepository

            .findRowById(

                "MEC000001"

            )

    );

}

function testMekanikExists(){

    Logger.log(

        MekanikRepository

            .exists(

                "MEC000001"

            )

    );

}

function testMekanikFindById(){

    Logger.log(

        MekanikRepository

            .findById(

                "MEC000001"

            )

    );

}

function testMekanikIsActive(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "MEKANIK IS ACTIVE TEST"
    );

    Logger.log(
        "================================"
    );

    Logger.log(
        "MEC000001 ACTIVE:"
    );

    Logger.log(
        MekanikRepository
            .isActive(
                "MEC000001"
            )
    );

    Logger.log(
        "MEC999999 ACTIVE:"
    );

    Logger.log(
        MekanikRepository
            .isActive(
                "MEC999999"
            )
    );

    Logger.log(
        "================================"
    );

    Logger.log(
        "MEKANIK IS ACTIVE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}