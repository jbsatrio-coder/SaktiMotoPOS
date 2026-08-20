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

function testMekanikFixture(){

    Logger.log("================================");
    Logger.log("MEKANIK FIXTURE TEST");
    Logger.log("================================");

    const mekanikId = "MEC000002";

    const exists =
        MekanikRepository.exists(
            mekanikId
        );

    const active =
        MekanikRepository.isActive(
            mekanikId
        );

    const row =
        MekanikRepository.findById(
            mekanikId
        );

    Logger.log("ID:");
    Logger.log(mekanikId);

    Logger.log("EXISTS:");
    Logger.log(exists);

    Logger.log("IS ACTIVE:");
    Logger.log(active);

    Logger.log("ROW:");
    Logger.log(row);

    if(!exists){

        throw new Error(
            "MEC000002 tidak ditemukan."
        );

    }

    if(!active){

        throw new Error(
            "MEC000002 ditemukan tetapi statusnya bukan AKTIF."
        );

    }

    Logger.log("================================");
    Logger.log("MEKANIK FIXTURE TEST PASS");
    Logger.log("================================");

}