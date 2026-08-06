function testCreateVehicle(){

    const result =

        VehicleService.createVehicle({

            customerId : "CUS999999",

            noPolisi : "B1234XYZ",

            merk : "Honda",

            model : "Beat",

            tahun : "2023",

            warna : "Hitam",

            noMesin : "JM81E123456",

            noRangka : "MH1JM81123456",

            lastKilometer : 12500,

            status :

                VehicleStatus.AKTIF,

            catatan :

                "Motor customer"

        });

    Logger.log(result);

}

function testUpdateVehicle(){

    const result =

        VehicleService.updateVehicle({

           id : getLatestVehicleId(),

            customerId : "CUS999999",

            noPolisi : "B1234XYZ",

            merk : "Honda",

            model : "Beat Deluxe",

            tahun : "2023",

            warna : "Hitam",

            noMesin : "JM81E123456",

            noRangka : "MH1JM81123456",

            lastKilometer : 15000,

            status :

                VehicleStatus.AKTIF,

            catatan :

                "Update Service"

        });

    Logger.log(result);

}