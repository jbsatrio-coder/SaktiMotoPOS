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
function testCreateVehicleV2(){

    Logger.log(
        "===== VEHICLE SERVICE V2 CREATE ====="
    );


    /*
     * ========================================
     * Ambil Customer terakhir
     * ========================================
     */

    const customers =
        CustomerRepository.findAll();


    if(customers.length === 0){

        throw new Error(
            "Tidak ada Customer untuk test Vehicle V2."
        );

    }


    const customerId =
        customers[
            customers.length - 1
        ][
            COL_PELANGGAN.ID
        ];


    Logger.log(
        "Customer Test : " +
        customerId
    );


    /*
     * ========================================
     * CREATE VEHICLE
     * ========================================
     */

    const result =
        VehicleService.createVehicle({

            customerId :
                customerId,

            noPolisi :
                "BTESTV2001",

            merkId :
                "MRK000001",

            modelId :
                "MOD000001",

            /*
             * Sengaja kosong.
             *
             * Validator harus resolve:
             * MRK000001 -> Honda
             * MOD000001 -> Beat
             */

            merk :
                "",

            model :
                "",

            tahun :
                "2023",

            warna :
                "Hitam",

            noMesin :
                "TESTV2ENGINE001",

            noRangka :
                "TESTV2FRAME001",

            lastKilometer :
                12500,

            status :
                VehicleStatus.AKTIF,

            catatan :
                "Test Vehicle V2"

        });


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}



/**
 * ============================================
 * VEHICLE SERVICE V2
 * CREATE TEST
 * ============================================
 */

function testCreateVehicleV2MasterReference(){

    Logger.log(
        "===== VEHICLE SERVICE V2 MASTER REFERENCE ====="
    );

    const result =
        VehicleService.createVehicle({

            customerId :
                "CUS2608160012",

            noPolisi :
                "BTESTV20301",

            merkId :
                "MRK000001",

            modelId :
                "MOD000001",

            tahun :
                "2023",

            warna :
                "Hitam",

            noMesin :
                "TESTV203ENGINE001",

            noRangka :
                "TESTV203FRAME001",

            lastKilometer :
                12500,

            status :
                VehicleStatus.AKTIF,

            catatan :
                "Test Vehicle Service V2 Master Reference"

        });


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}
