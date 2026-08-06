function testCreateVehicleDocument(){

    const document =

        VehicleDocument.create({

            id : "VEH000001",

            customerId : "CUS999999",

            noPolisi : "B1234XYZ",

            merk : "Honda",

            model : "Beat",

            tahun : "2023",

            warna : "Hitam",

            noMesin : "JM11XXXX",

            noRangka : "MH1XXXX",

            lastKilometer : 15000

        });

    Logger.log(

        JSON.stringify(
            document,
            null,
            2
        )

    );

}

/**
 * ============================================
 * Vehicle Repository Test
 * ============================================
 */

function testVehicleSheet(){

    Logger.log(
        VehicleRepository
            .sheet()
            .getName()
    );

}

function testFindAllVehicle(){

    const vehicles =
        VehicleRepository.findAll();

    Logger.log(
        vehicles.length
    );

}

function testFindVehicleRow(){

    Logger.log(

        VehicleRepository.findRowById(
            "VEH000001"
        )

    );

}

function testVehicleExists(){

    Logger.log(

        VehicleRepository.exists(
            "VEH000001"
        )

    );

}

function testFindVehicleById(){

    Logger.log(

        VehicleRepository.findById(
            "VEH000001"
        )

    );

}