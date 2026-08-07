/**
 * ============================================
 * Work Order Service
 * Version : 1.1.0
 * ============================================
 */

const WorkOrderService = {

    /**
     * Membuat Work Order baru
     */
    create(request){

        Logger.log(request);

        this.validate(request);

        const customer = this.loadCustomer(
            request.customerId
        );

        const vehicle = this.loadVehicle(
            request.vehicleId
        );

        Logger.log(customer);

Logger.log(vehicle);

const workOrderDocument =

    this.buildDocument(
        request,
        customer,
        vehicle
    );

return this.save(
    workOrderDocument
);

    },

    /**
     * Validasi Request
     */
    validate(request){

        if(!request){

            throw new Error(
                "Request wajib diisi."
            );

        }

        if(!request.customerId){

            throw new Error(
                "Pelanggan belum dipilih."
            );

        }

        if(!request.vehicleId){

            throw new Error(
                "Kendaraan belum dipilih."
            );

        }

        if(

            !CustomerRepository.exists(
                request.customerId
            )

        ){

            throw new Error(
                "Pelanggan tidak ditemukan."
            );

        }

        if(

            !VehicleRepository.exists(
                request.vehicleId
            )

        ){

            throw new Error(
                "Kendaraan tidak ditemukan."
            );

        }

    },

    /**
     * Mengambil Customer
     */
    loadCustomer(customerId){

        return CustomerRepository.findById(
            customerId
        );

    },

    /**
     * Mengambil Kendaraan
     */
    loadVehicle(vehicleId){

        return VehicleRepository.findById(
            vehicleId
        );

    },
    /**
 * Membuat Work Order Document
 */
buildDocument(
    request,
    customer,
    vehicle
){

    return WorkOrderDocument.create({

        id :

    RunningNumberService.generate(

        DocumentType.WORK_ORDER

    ),

        customerId :

            customer[COL_PELANGGAN.ID],

        customerNameSnapshot :

            customer[COL_PELANGGAN.NAMA],

        vehicleId :

            vehicle[COL_VEHICLE.ID],

        noPolisiSnapshot :

            vehicle[COL_VEHICLE.PLATE],

        merkSnapshot :

            vehicle[COL_VEHICLE.BRAND],

        modelSnapshot :

            vehicle[COL_VEHICLE.MODEL],

        kilometerMasuk :

            request.kilometerMasuk,

        status :

            "DRAFT",

        prioritas :

            request.prioritas,

         estimasiSelesai :

             request.estimasiSelesai || "",   

        admin :

            request.admin,

        catatan :

            request.catatan

    });

},

/**
 * Menyimpan Work Order
 */
save(workOrderDocument){

    return WorkOrderRepository.save(

        workOrderDocument.workOrder

    );

},

};