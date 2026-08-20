/**
 * ============================================
 * Vehicle Validator
 * Version : 1.0.0
 * ============================================
 */

const VehicleValidator = {

    validateCreate(vehicleDocument){

        const vehicle =
            vehicleDocument.vehicle;

        this.validateId(vehicle.id);

        this.validateCustomerId(
            vehicle.customerId
        );

        this.validateIdentity(vehicle);

        this.validateMasterReference(
            vehicle
        );

        this.validateStatus(
            vehicle.status
        );

        this.validateDuplicatePlate(
    vehicle,
    true
);

    },

    validateUpdate(vehicleDocument){

        const vehicle =
            vehicleDocument.vehicle;

        this.validateId(vehicle.id);

        this.validateCustomerId(
            vehicle.customerId
        );

        this.validateIdentity(vehicle);

        this.validateMasterReference(
            vehicle
        );

        this.validateStatus(
            vehicle.status
        );

        this.validateDuplicatePlate(

             vehicle,

            false

);

    },

    validateId(id){

        if(!id){

            throw new Error(
                "Vehicle ID wajib diisi."
            );

        }

    },

    validateCustomerId(customerId){

        if(!customerId){

            throw new Error(
                "Customer wajib dipilih."
            );

        }

        if(

            !CustomerRepository.exists(
                customerId
            )

        ){

            throw new Error(
                "Customer tidak ditemukan."
            );

        }

    },

    validateIdentity(vehicle){

        const hasPlate =
            vehicle.noPolisi &&
            vehicle.noPolisi.trim() !== "";

        const hasEngine =
            vehicle.noMesin &&
            vehicle.noMesin.trim() !== "";

        if(
            !hasPlate &&
            !hasEngine
        ){

            throw new Error(

                "Nomor Polisi atau Nomor Mesin wajib diisi."

            );

        }

    },

    /**
     * ============================================
     * Validasi Duplicate Nomor Polisi
     * ============================================
     *
     * Nomor Polisi optional jika kendaraan
     * menggunakan Nomor Mesin sebagai identitas.
     */
    validateDuplicatePlate(vehicle, isCreate){

    const plate =
        String(
            vehicle.noPolisi || ""
        )
        .trim()
        .replace(/\s+/g, "")
        .toUpperCase();

    if(!plate){

        return;

    }

    const existingVehicle =
        VehicleRepository.findByPlate(
            plate
        );

    if(!existingVehicle){

        return;

    }

    /*
     * CREATE:
     * Plat sudah ada → selalu reject.
     */
    if(isCreate){

        throw new Error(

            "Nomor Polisi " +
            plate +
            " sudah terdaftar."

        );

    }

    /*
     * UPDATE:
     * Plat yang ditemukan adalah milik
     * kendaraan yang sedang di-update.
     * Maka diperbolehkan.
     */
    const existingVehicleId =
        String(
            existingVehicle[
                COL_VEHICLE.ID
            ] || ""
        ).trim();

    const currentVehicleId =
        String(
            vehicle.id || ""
        ).trim();

    if(
        existingVehicleId !==
        currentVehicleId
    ){

        throw new Error(

            "Nomor Polisi " +
            plate +
            " sudah digunakan oleh kendaraan lain."

        );

    }

},

    /**
     * ============================================
     * Validasi Master Merk + Model
     * ============================================
     *
     * Memastikan:
     * 1. MerkID valid
     * 2. ModelID valid
     * 3. Model memang milik Merk tersebut
     *
     * Nama Merk dan Model kemudian di-resolve
     * dari Master, sehingga snapshot tidak
     * bergantung pada text input user.
     */
    validateMasterReference(vehicle){

        const merkId =
            String(
                vehicle.merkId || ""
            ).trim();

        const modelId =
            String(
                vehicle.modelId || ""
            ).trim();


        /*
         * ========================================
         * MERK
         * ========================================
         */

        if(!merkId){

            throw new Error(
                "Merk wajib dipilih."
            );

        }


        const merk =
            MerkRepository.findById(
                merkId
            );


        if(!merk){

            throw new Error(
                "Merk tidak ditemukan : " +
                merkId
            );

        }


        /*
         * ========================================
         * MODEL
         * ========================================
         */

        if(!modelId){

            throw new Error(
                "Model wajib dipilih."
            );

        }


        const model =
            ModelRepository.findById(
                modelId
            );


        if(!model){

            throw new Error(
                "Model tidak ditemukan : " +
                modelId
            );

        }


        /*
         * ========================================
         * CEK RELASI MERK → MODEL
         * ========================================
         */

        const modelMerkId =
            String(
                model.merkId || ""
            ).trim();


        if(
            modelMerkId !==
            merkId
        ){

            throw new Error(

                "Model " +
                model.nama +
                " bukan milik Merk " +
                merk.nama +
                "."

            );

        }


        /*
         * ========================================
         * RESOLVE SNAPSHOT
         * ========================================
         */

        vehicle.merk =
            merk.nama;

        vehicle.model =
            model.nama;


        return vehicle;

    },


    validateStatus(status){

        if(

            !Object.values(
                VehicleStatus
            ).includes(status)

        ){

            throw new Error(
                "Status kendaraan tidak valid."
            );

        }

    }

};
