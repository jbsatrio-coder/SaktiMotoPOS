function testCreateVehicleDocument(){

    const document =
        VehicleDocument.create({

            id : "VEH000001",

            customerId : "CUS999999",

            noPolisi : "B1234XYZ",

            merkId : "MRK000001",

            modelId : "MOD000001",

            merk : "Honda",

            model : "Beat",

            tahun : "2023",

            warna : "Hitam",

            noMesin : "JM11XXXX",

            noRangka : "MH1XXXX",

            lastKilometer : 15000

        });

    Logger.log(
        "===== VEHICLE DOCUMENT ====="
    );

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
function testVehicleDocumentMasterReference(){

    Logger.log(
        "===== VEHICLE MASTER REFERENCE TEST ====="
    );


    const valid =
        VehicleDocument.create({

            id : "VEH000001",

            customerId : "CUS999999",

            noPolisi : "B1234XYZ",

            merkId : "MRK000001",

            modelId : "MOD000001",

            merk : "Honda",

            model : "Beat"

        });


    Logger.log(
        "VALID:"
    );

    Logger.log(
        JSON.stringify(
            valid.vehicle,
            null,
            2
        )
    );


    const mismatch =
        VehicleDocument.create({

            id : "VEH000002",

            customerId : "CUS999999",

            noPolisi : "B5678XYZ",

            merkId : "MRK000001",

            modelId : "MOD000037",

            merk : "Honda",

            model : "NMAX"

        });


    Logger.log(
        "MISMATCH:"
    );

    Logger.log(
        JSON.stringify(
            mismatch.vehicle,
            null,
            2
        )
    );

}

function testVehicleMasterReferenceValidation(){

    Logger.log(
        "===== VEHICLE MASTER REFERENCE VALIDATION ====="
    );


    function runCase(name, payload){

        try {

            const document =
                VehicleDocument.create(payload);

            VehicleValidator.validateMasterReference(
                document.vehicle
            );

            Logger.log(
                "[PASS] " + name
            );

        } catch(error){

            Logger.log(
                "[REJECT] " +
                name +
                " | " +
                error.message
            );

        }

    }


    /*
     * ========================================
     * 1. VALID
     * Honda + Beat
     * ========================================
     */

    runCase(
        "VALID HONDA BEAT",
        {

            id : "VEHTEST001",

            customerId : "CUS999999",

            noPolisi : "BTEST001",

            merkId : "MRK000001",

            modelId : "MOD000001",

            merk : "Honda",

            model : "Beat"

        }
    );


    /*
     * ========================================
     * 2. INVALID MERK
     * ========================================
     */

    runCase(
        "INVALID MERK",
        {

            id : "VEHTEST002",

            customerId : "CUS999999",

            noPolisi : "BTEST002",

            merkId : "MRK999999",

            modelId : "MOD000001",

            merk : "Honda",

            model : "Beat"

        }
    );


    /*
     * ========================================
     * 3. INVALID MODEL
     * ========================================
     */

    runCase(
        "INVALID MODEL",
        {

            id : "VEHTEST003",

            customerId : "CUS999999",

            noPolisi : "BTEST003",

            merkId : "MRK000001",

            modelId : "MOD999999",

            merk : "Honda",

            model : "Beat"

        }
    );


    /*
     * ========================================
     * 4. MODEL MILIK MERK LAIN
     *
     * Honda + NMAX
     * NMAX = Yamaha
     * ========================================
     */

    runCase(
        "MISMATCH HONDA NMAX",
        {

            id : "VEHTEST004",

            customerId : "CUS999999",

            noPolisi : "BTEST004",

            merkId : "MRK000001",

            modelId : "MOD000037",

            merk : "Honda",

            model : "NMAX"

        }
    );

}

function testVehicleV2SavedData(){

    Logger.log(
        "===== VEHICLE V2 SAVED DATA ====="
    );

    const vehicle =
        VehicleRepository.findById(
            "VEH2608190002"
        );

    Logger.log(
        JSON.stringify(
            vehicle,
            null,
            2
        )
    );

}
