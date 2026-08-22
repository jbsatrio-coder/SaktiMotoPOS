/**
 * ============================================
 * Work Order Service
 * Version : 1.2.0
 * ============================================
 */

const WorkOrderService = {

    create(request){

    /**
     * ========================================
     * PERMISSION CHECK
     * ========================================
     */

    PermissionService.require(
        Permission.CREATE_WO
    );


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
 * CHANGE STATUS WORK ORDER
 * Version : 1.4.0
 * ============================================
 *
 * Mengubah status Work Order.
 *
 * KHUSUS CANCEL:
 *
 * Jika target = DIBATALKAN:
 *
 * 1. Validasi transition WO
 * 2. Ambil seluruh WorkOrderPart
 * 3. Cancel setiap WorkOrderPart
 * 4. Jika part sudah Stock OUT:
 *      → reversal otomatis
 * 5. Jika part belum Stock OUT:
 *      → langsung CANCEL
 * 6. Pastikan seluruh part sudah CANCEL
 * 7. Baru WO menjadi DIBATALKAN
 *
 * Jika salah satu part gagal:
 *      → WO tidak diubah
 *
 * ============================================
 */
changeStatus(
    workOrderId,
    nextStatus
){

    /**
     * ========================================
     * 1. VALIDASI ID
     * ========================================
     */

    if(!workOrderId){

        throw new Error(
            "Work Order ID wajib diisi."
        );

    }


    /**
     * ========================================
     * 2. PERMISSION CHECK
     * ========================================
     */

    let requiredPermission =
        Permission.CHANGE_STATUS;


    if(
        nextStatus ===
        WorkOrderStatus.SELESAI
    ){

        requiredPermission =
            Permission.COMPLETE_WO;

    }


    if(
        nextStatus ===
        WorkOrderStatus.DIBATALKAN
    ){

        requiredPermission =
            Permission.CANCEL_WO;

    }


    PermissionService.require(
        requiredPermission
    );


    /**
     * ========================================
     * 3. AMBIL WORK ORDER
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

    if(WorkOrderRepository.isWorkOrderSettled(workOrderId) && nextStatus !== WorkOrderStatus.SUDAH_DIAMBIL){
        throw new Error("WORK_ORDER_ALREADY_SETTLED");
    }


    /**
     * ========================================
     * 4. STATUS SAAT INI
     * ========================================
     */

    const currentStatus =
        workOrder[
            COL_WORK_ORDER.STATUS
        ];


    /**
     * ========================================
     * 5. VALIDATE TRANSITION
     * ========================================
     */

    WorkOrderStatusService.validateTransition(

        currentStatus,

        nextStatus

    );


    /**
     * ========================================
     * 6. COMPLETION GATE
     * ========================================
     */

    if(
        nextStatus ===
        WorkOrderStatus.SELESAI
    ){

        const completion =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        if(
            !completion.canComplete
        ){

            throw new Error(
                "Work Order belum dapat diselesaikan: " +
                completion.reason
            );

        }

    }


    /**
     * ========================================
     * 7. CANCEL CASCADE
     * ========================================
     *
     * Hanya dijalankan jika target status
     * adalah DIBATALKAN.
     *
     * WO tidak akan diubah menjadi
     * DIBATALKAN sebelum seluruh
     * WorkOrderPart berhasil CANCEL.
     *
     * WorkOrderPartService.cancel()
     * menangani:
     *
     * - validasi transition part
     * - pengecekan Stock OUT
     * - reversal stock
     * - pembuatan ledger REVERSAL
     * - update status part → CANCEL
     *
     * ========================================
     */

    let cancelCascade = null;


    if(
        nextStatus ===
        WorkOrderStatus.DIBATALKAN
    ){

        /**
         * ====================================
         * AMBIL SEMUA WORK ORDER PART
         * ====================================
         */

        const workOrderParts =
            WorkOrderPartRepository
                .findByWorkOrderId(
                    workOrderId
                );


        /**
         * ====================================
         * INITIALIZE RESULT
         * ====================================
         */

        cancelCascade = {

            totalPart :
                workOrderParts
                    ? workOrderParts.length
                    : 0,

            processed :
                0,

            cancelled :
                0,

            skipped :
                0,

            stockReversal :
                0,

            items :
                []

        };


        /**
         * ====================================
         * PROSES SEMUA PART
         * ====================================
         */

        if(
            workOrderParts &&
            workOrderParts.length > 0
        ){

            for(
                let i = 0;
                i < workOrderParts.length;
                i++
            ){

                const part =
                    workOrderParts[i];


                /**
                 * ================================
                 * WORK ORDER PART ID
                 * ================================
                 */

                const workOrderPartId =
                    part[
                        COL_WORK_ORDER_PART.ID
                    ];


                /**
                 * ================================
                 * STATUS PART
                 * ================================
                 */

                const partStatus =
                    part[
                        COL_WORK_ORDER_PART.STATUS
                    ];


                Logger.log(
                    "================================"
                );

                Logger.log(
                    "WO CANCEL CASCADE"
                );

                Logger.log(
                    "WORK ORDER ID:"
                );

                Logger.log(
                    workOrderId
                );

                Logger.log(
                    "WORK ORDER PART ID:"
                );

                Logger.log(
                    workOrderPartId
                );

                Logger.log(
                    "PART STATUS:"
                );

                Logger.log(
                    partStatus
                );


                /**
                 * ================================
                 * SUDAH CANCEL
                 * ================================
                 */

                if(
                    partStatus ===
                    WorkOrderPartStatus.CANCEL
                ){

                    cancelCascade.skipped++;


                    cancelCascade.items.push({

                        workOrderPartId :
                            workOrderPartId,

                        previousStatus :
                            partStatus,

                        status :
                            WorkOrderPartStatus.CANCEL,

                        skipped :
                            true,

                        stockOutRecorded :
                            false,

                        reversal :
                            null,

                        reason :
                            "WorkOrderPart sudah CANCEL."

                    });


                    continue;

                }


                /**
                 * ================================
                 * CANCEL PART
                 * ================================
                 */

                const cancelResult =
                    WorkOrderPartService.cancel(
                        workOrderPartId
                    );


                /**
                 * ================================
                 * VALIDASI RESULT
                 * ================================
                 */

                if(
                    !cancelResult ||
                    !cancelResult.success
                ){

                    throw new Error(
                        "Gagal membatalkan Work Order Part: " +
                        workOrderPartId
                    );

                }


                /**
                 * ================================
                 * HITUNG RESULT
                 * ================================
                 */

                cancelCascade.processed++;

                cancelCascade.cancelled++;


                if(
                    cancelResult.stockOutRecorded
                ){

                    cancelCascade.stockReversal++;

                }


                /**
                 * ================================
                 * SIMPAN DETAIL
                 * ================================
                 */

                cancelCascade.items.push({

                    workOrderPartId :
                        workOrderPartId,

                    previousStatus :
                        cancelResult.previousStatus,

                    status :
                        cancelResult.status,

                    stockOutRecorded :
                        cancelResult.stockOutRecorded,

                    reversal :
                        cancelResult.reversal

                });

            }

        }


        /**
         * ====================================
         * FINAL VALIDATION
         * ====================================
         *
         * Pastikan seluruh part sudah CANCEL.
         */

        const finalParts =
            WorkOrderPartRepository
                .findByWorkOrderId(
                    workOrderId
                );


        if(
            finalParts &&
            finalParts.length > 0
        ){

            for(
                let i = 0;
                i < finalParts.length;
                i++
            ){

                const finalPart =
                    finalParts[i];


                const finalPartStatus =
                    finalPart[
                        COL_WORK_ORDER_PART.STATUS
                    ];


                if(
                    finalPartStatus !==
                    WorkOrderPartStatus.CANCEL
                ){

                    throw new Error(
                        "Cancel cascade gagal. " +
                        "Work Order Part belum CANCEL: " +
                        finalPart[
                            COL_WORK_ORDER_PART.ID
                        ]
                    );

                }

            }

        }

    }


    /**
     * ========================================
     * 8. UPDATE STATUS WORK ORDER
     * ========================================
     *
     * Baru dilakukan setelah:
     *
     * - completion gate lolos, atau
     * - cancel cascade selesai.
     *
     * ========================================
     */

    const result =
        WorkOrderRepository.updateStatus(

            workOrderId,

            nextStatus

        );


    /**
     * ========================================
     * 9. RETURN
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
            nextStatus,

        cancelCascade :
            cancelCascade

    };

},

}


