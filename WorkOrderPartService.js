/**
 * ============================================
 * Work Order Part Service
 * Version : 1.0.0
 * ============================================
 */

const WorkOrderPartService = {

    /**
     * Membuat WorkOrderPart baru
     */
    create(request){

        Logger.log(
            request
        );


        this.validate(
            request
        );


        const workOrder =
            this.loadWorkOrder(
                request.workOrderId
            );


        const barang =
            this.loadBarang(
                request.barangId
            );


        Logger.log(
            workOrder
        );


        Logger.log(
            barang
        );


        const workOrderPartDocument =

            this.buildDocument(

                request,

                workOrder,

                barang

            );


        return this.save(
            workOrderPartDocument
        );

    },


    /**
     * ========================================
     * VALIDASI REQUEST
     * ========================================
     */
    validate(request){

        if(!request){

            throw new Error(
                "Request WorkOrderPart wajib diisi."
            );

        }


        /**
         * Work Order wajib
         */
        if(!request.workOrderId){

            throw new Error(
                "Work Order wajib diisi."
            );

        }


        /**
         * Barang wajib
         */
        if(!request.barangId){

            throw new Error(
                "Barang wajib dipilih."
            );

        }


        /**
         * Work Order harus ada
         */
        if(

            !WorkOrderRepository.exists(
                request.workOrderId
            )

        ){

            throw new Error(
                "Work Order tidak ditemukan : " +
                request.workOrderId
            );

        }


        /**
         * Barang harus ada
         */
        if(

            !BarangRepository.exists(
                request.barangId
            )

        ){

            throw new Error(
                "Barang tidak ditemukan : " +
                request.barangId
            );

        }


        /**
         * Qty
         */
        const qty =
            Number(
                request.qty || 0
            );


        if(qty <= 0){

            throw new Error(
                "Qty harus lebih besar dari 0."
            );

        }

    },


    /**
     * ========================================
     * LOAD WORK ORDER
     * ========================================
     */
    loadWorkOrder(workOrderId){

        return WorkOrderRepository.findById(
            workOrderId
        );

    },


    /**
     * ========================================
     * LOAD BARANG
     * ========================================
     */
    loadBarang(barangId){

        return BarangRepository.findById(
            barangId
        );

    },


    /**
     * ========================================
     * BUILD DOCUMENT
     * ========================================
     */
    buildDocument(
        request,
        workOrder,
        barang
    ){

        return WorkOrderPartDocument.create({

            id :

                RunningNumberService.generate(

                    DocumentType.WORK_ORDER_PART

                ),


            workOrderId :

                workOrder[
                    COL_WORK_ORDER.ID
                ],


            workOrderJasaId :

                request.workOrderJasaId || "",


            barangId :

                barang[
                    COL_BARANG.ID
                ],


            namaBarangSnapshot :

                barang[
                    COL_BARANG.NAMA
                ],


            qty :

                request.qty,


            harga :

                request.harga !== undefined

                    ?

                request.harga

                    :

                barang[
                    COL_BARANG.HARGAJUAL
                ],


            diskon :

                request.diskon || 0,


            status :

                "AKTIF",


            catatan :

                request.catatan || ""

        });

    },


    /**
     * ========================================
     * SAVE
     * ========================================
     */
    save(workOrderPartDocument){

        return WorkOrderPartRepository.save(

            workOrderPartDocument.workOrderPart

        );

    }

};