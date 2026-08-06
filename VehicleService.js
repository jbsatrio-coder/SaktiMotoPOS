/**
 * ============================================
 * Vehicle Service
 * Version : 1.0.0
 * ============================================
 */

const VehicleService = {

    /**
     * Membuat kendaraan baru
     */
    createVehicle(payload){

        const vehicleDocument =

            VehicleDocument.create({

                ...payload,

                id :

                    RunningNumberService.generate(

                        DocumentType.VEHICLE

                    )

            });

        VehicleValidator.validateCreate(
            vehicleDocument
        );

        return VehicleRepository.save(
            vehicleDocument
        );

    },

    /**
     * Update kendaraan
     */
    updateVehicle(payload){

        const vehicleDocument =

            VehicleDocument.create(
                payload
            );

        VehicleValidator.validateUpdate(
            vehicleDocument
        );

        return VehicleRepository.update(
            vehicleDocument
        );

    }

};

function getLatestVehicleId(){

    const data = VehicleRepository.findAll();

    if(data.length === 0){

        return null;

    }

    return data[data.length - 1][COL_VEHICLE.ID];

}