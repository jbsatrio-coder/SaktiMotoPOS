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