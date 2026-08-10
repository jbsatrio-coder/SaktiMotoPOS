/**
 * ============================================
 * Work Order Service
 * Version : 1.2.0
 * ============================================
 */

const WorkOrderService = {

    /**
     * Membuat Work Order baru
     */
    create(request){

        Logger.log(request);

        this.validate(request);

        const customer =

            request.customerId

                ? this.loadCustomer(
                    request.customerId
                )

                : null;

        const vehicle =

            request.vehicleId

                ? this.loadVehicle(
                    request.vehicleId
                )

                : null;

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

        const jenisTransaksi =

            request.jenisTransaksi ||

            WorkOrderType.SERVICE;


        /**
         * Validasi jenis transaksi
         */
        if(

            jenisTransaksi !==
                WorkOrderType.SERVICE

            &&

            jenisTransaksi !==
                WorkOrderType.PART_ONLY

        ){

            throw new Error(
                "Jenis transaksi tidak valid."
            );

        }


        /**
         * ========================================
         * SERVICE
         * ========================================
         */

        if(

            jenisTransaksi ===
                WorkOrderType.SERVICE

        ){

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

        }


        /**
         * ========================================
         * Validasi Customer
         * hanya jika ID diberikan
         * ========================================
         */

        if(request.customerId){

            if(

                !CustomerRepository.exists(
                    request.customerId
                )

            ){

                throw new Error(
                    "Pelanggan tidak ditemukan."
                );

            }

        }


        /**
         * ========================================
         * Validasi Vehicle
         * hanya jika ID diberikan
         * ========================================
         */

        if(request.vehicleId){

            if(

                !VehicleRepository.exists(
                    request.vehicleId
                )

            ){

                throw new Error(
                    "Kendaraan tidak ditemukan."
                );

            }

        }

    },


    /**
     * Mengambil Customer
     */
    loadCustomer(customerId){

        if(!customerId){

            return null;

        }

        return CustomerRepository.findById(
            customerId
        );

    },


    /**
     * Mengambil Kendaraan
     */
    loadVehicle(vehicleId){

        if(!vehicleId){

            return null;

        }

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

            jenisTransaksi :

                request.jenisTransaksi ||

                WorkOrderType.SERVICE,


            customerId :

                customer
                    ? customer[COL_PELANGGAN.ID]
                    : "",


            customerNameSnapshot :

                customer
                    ? customer[COL_PELANGGAN.NAMA]
                    : "",


            vehicleId :

                vehicle
                    ? vehicle[COL_VEHICLE.ID]
                    : "",


            noPolisiSnapshot :

                vehicle
                    ? vehicle[COL_VEHICLE.PLATE]
                    : "",


            merkSnapshot :

                vehicle
                    ? vehicle[COL_VEHICLE.BRAND]
                    : "",


            modelSnapshot :

                vehicle
                    ? vehicle[COL_VEHICLE.MODEL]
                    : "",


            kilometerMasuk :

                Number(
                    request.kilometerMasuk || 0
                ),


            status :

                WorkOrderStatus.DRAFT,


            prioritas :

                request.prioritas ||

                WorkOrderPriority.NORMAL,


            estimasiSelesai :

                request.estimasiSelesai || "",


            admin :

                request.admin || "",


            catatan :

                request.catatan || ""

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

    /**
 * ============================================
 * Mengubah Status Work Order
 * ============================================
 */
changeStatus(
    workOrderId,
    nextStatus
){

    /**
     * ========================================
     * VALIDASI ID
     * ========================================
     */

    if(!workOrderId){

        throw new Error(
            "Work Order ID wajib diisi."
        );

    }


    /**
     * ========================================
     * AMBIL WORK ORDER
     * ========================================
     */

    const workOrder =
        WorkOrderRepository.findById(
            workOrderId
        );


    if(!workOrder){

        throw new Error(
            "Work Order tidak ditemukan : " +
            workOrderId
        );

    }


    /**
     * ========================================
     * STATUS SAAT INI
     * ========================================
     */

    const currentStatus =
        workOrder[
            COL_WORK_ORDER.STATUS
        ];


    /**
     * ========================================
     * VALIDASI TRANSITION
     * ========================================
     */

    WorkOrderStatusService.validateTransition(

        currentStatus,

        nextStatus

    );


    /**
     * ========================================
     * SIMPAN STATUS BARU
     * ========================================
     */

    const result =
        WorkOrderRepository.updateStatus(

            workOrderId,

            nextStatus

        );


    /**
     * ========================================
     * RETURN
     * ========================================
     */

    return {

        success :
            true,

        workOrderId :
            workOrderId,

        previousStatus :
            currentStatus,

        status :
            nextStatus

    };

}

};