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

        this.validateStatus(
            vehicle.status
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

        this.validateStatus(
            vehicle.status
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