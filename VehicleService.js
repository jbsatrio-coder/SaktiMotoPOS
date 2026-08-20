/**
 * ============================================
 * Vehicle Service
 * Version : 2.0.0
 * ============================================
 *
 * Vehicle Service bertanggung jawab untuk:
 *
 * 1. Membuat Vehicle Document
 * 2. Memastikan Master Merk + Model valid
 * 3. Validasi Vehicle
 * 4. Generate Vehicle ID
 * 5. Menyimpan Vehicle
 *
 * Reference:
 *   merkId  -> MasterMerk
 *   modelId -> MasterModel
 *
 * Snapshot:
 *   merk
 *   model
 *
 * Nama Merk dan Model di-resolve oleh
 * VehicleValidator.validateMasterReference()
 * ============================================
 */

const VehicleService = {

    /**
     * ============================================
     * CREATE VEHICLE
     * ============================================
     */
    createVehicle(payload){

        payload = payload || {};

        /*
         * ========================================
         * 1. MASTER REFERENCE
         * ========================================
         */

        const merkId =
            String(
                payload.merkId || ""
            ).trim();

        const modelId =
            String(
                payload.modelId || ""
            ).trim();


        /*
         * ========================================
         * 2. GENERATE VEHICLE ID
         * ========================================
         */

        const vehicleId =
            RunningNumberService.generate(
                DocumentType.VEHICLE
            );


        /*
         * ========================================
         * 3. CREATE DOCUMENT
         * ========================================
         */

        const vehicleDocument =
            VehicleDocument.create({

                ...payload,

                id :
                    vehicleId,

                merkId :
                    merkId,

                modelId :
                    modelId

            });


        /*
         * ========================================
         * 4. VALIDATE MASTER REFERENCE
         *
         * Sekaligus resolve:
         *
         * merkId  → merk
         * modelId → model
         * ========================================
         */

        VehicleValidator.validateMasterReference(
            vehicleDocument.vehicle
        );


        /*
         * ========================================
         * 5. VALIDATE VEHICLE
         * ========================================
         */

        VehicleValidator.validateCreate(
            vehicleDocument
        );


        /*
         * ========================================
         * 6. SAVE
         * ========================================
         */

        const result =
            VehicleRepository.save(
                vehicleDocument
            );


        Logger.log(
            "[VEHICLE CREATE] " +
            vehicleId +
            " | " +
            vehicleDocument.vehicle.merk +
            " | " +
            vehicleDocument.vehicle.model
        );


        return result;

    },


    /**
     * ============================================
     * UPDATE VEHICLE
     * ============================================
     */
    updateVehicle(payload){

        payload = payload || {};


        /*
         * ========================================
         * 1. CREATE DOCUMENT
         * ========================================
         */

        const vehicleDocument =
            VehicleDocument.create(
                payload
            );


        /*
         * ========================================
         * 2. VALIDATE MASTER REFERENCE
         * ========================================
         */

        VehicleValidator.validateMasterReference(
            vehicleDocument.vehicle
        );


        /*
         * ========================================
         * 3. VALIDATE UPDATE
         * ========================================
         */

        VehicleValidator.validateUpdate(
            vehicleDocument
        );


        /*
         * ========================================
         * 4. SAVE UPDATE
         * ========================================
         */

        return VehicleRepository.update(
            vehicleDocument
        );

    }

};


/**
 * ============================================
 * HELPER
 * ============================================
 */

function getLatestVehicleId(){

    const data =
        VehicleRepository.findAll();

    if(data.length === 0){

        return null;

    }

    return data[
        data.length - 1
    ][
        COL_VEHICLE.ID
    ];

}
