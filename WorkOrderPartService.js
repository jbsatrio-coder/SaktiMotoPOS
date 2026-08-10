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
 * BUILD STOCK OUT REQUEST
 * ========================================
 *
 * Mengubah WorkOrderPart menjadi
 * request untuk StockLedgerService.
 *
 * Method ini TIDAK mengurangi stok.
 * ========================================
 */
buildStockOutRequest(workOrderPart){

    if(!workOrderPart){

        throw new Error(
            "WorkOrderPart wajib diisi."
        );

    }


    const barangId =
        workOrderPart[
            COL_WORK_ORDER_PART
                .BARANG_ID
        ];


    const qty =
        Number(
            workOrderPart[
                COL_WORK_ORDER_PART
                    .QTY
            ] || 0
        );


    const workOrderId =
        workOrderPart[
            COL_WORK_ORDER_PART
                .WORK_ORDER_ID
        ];


    const namaBarang =
        workOrderPart[
            COL_WORK_ORDER_PART
                .NAMA_BARANG_SNAPSHOT
        ];


    const status =
        workOrderPart[
            COL_WORK_ORDER_PART
                .STATUS
        ];


    const catatan =
        workOrderPart[
            COL_WORK_ORDER_PART
                .CATATAN
        ];


    /**
     * ====================================
     * VALIDASI
     * ====================================
     */

    if(!barangId){

        throw new Error(
            "Barang ID WorkOrderPart wajib diisi."
        );

    }


    if(
        !Number.isFinite(qty) ||
        qty <= 0
    ){

        throw new Error(
            "Qty WorkOrderPart harus lebih besar dari 0."
        );

    }


    if(
        status &&
        status !== "AKTIF"
    ){

        throw new Error(
            "WorkOrderPart tidak aktif."
        );

    }


    /**
     * ====================================
     * BUILD REQUEST
     * ====================================
     */

    return {

        barangId :
            barangId,

        namaBarang :
            namaBarang,

        qty :
            qty,

        jenisMutasi :
            "SERVICE",

        referensi :
            workOrderId,

        keterangan :
            catatan ||
            "Pemakaian Part Work Order",

        admin :
            "SYSTEM"

    };

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

    },

    /**
 * ========================================
 * CEK STOCK OUT WORK ORDER PART
 * ========================================
 *
 * Mengecek apakah WorkOrderPart ini
 * sudah pernah dibuatkan Stock Ledger.
 * ========================================
 */
isStockOutRecorded(workOrderPartId){

    if(!workOrderPartId){

        throw new Error(
            "WorkOrderPart ID wajib diisi."
        );

    }


    const ledgerRows =
        StockLedgerRepository
            .findByReference(
                workOrderPartId
            );


    return ledgerRows.length > 0;

},

/**
 * ========================================
 * CONSUME STOCK
 * ========================================
 *
 * Mengurangi stok berdasarkan
 * WorkOrderPart.
 *
 * Aman dari double stock-out karena
 * menggunakan WorkOrderPart ID sebagai
 * referensi Stock Ledger.
 * ========================================
 */
consumeStock(workOrderPartId){

    if(!workOrderPartId){

        throw new Error(
            "WorkOrderPart ID wajib diisi."
        );

    }


    /**
     * ====================================
     * LOAD WORK ORDER PART
     * ====================================
     */

    const workOrderPart =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    if(!workOrderPart){

        throw new Error(
            "WorkOrderPart tidak ditemukan : " +
            workOrderPartId
        );

    }


    /**
     * ====================================
     * CEK SUDAH STOCK OUT ATAU BELUM
     * ====================================
     */

    if(
        this.isStockOutRecorded(
            workOrderPartId
        )
    ){

        return {

            success :
                true,

            alreadyRecorded :
                true,

            workOrderPartId :
                workOrderPartId

        };

    }


    /**
     * ====================================
     * BUILD STOCK OUT REQUEST
     * ====================================
     */

    const request =
        this.buildStockOutRequest(
            workOrderPart
        );


    /**
     * ====================================
     * TAMBAHKAN WORK ORDER PART ID
     * SEBAGAI REFERENSI LEDGER
     * ====================================
     */

    request.referensi =
        workOrderPartId;


    /**
     * ====================================
     * RECORD STOCK OUT ATOMIC
     * ====================================
     */

    const result =
        StockLedgerService.recordOutBatchAtomic(
            [
                request
            ]
        );


    return {

        success :
            result.success,

        alreadyRecorded :
            false,

        workOrderPartId :
            workOrderPartId,

        stockResult :
            result

    };

},

/**
 * ========================================
 * CONSUME STOCK BATCH
 * ========================================
 *
 * Mengurangi stok untuk seluruh
 * WorkOrderPart dalam satu Work Order.
 *
 * WorkOrderPart yang sudah pernah
 * di-consume akan dilewati.
 *
 * Proses stock-out menggunakan
 * StockLedgerService.recordOutBatchAtomic()
 * ========================================
 */
consumeStockBatch(workOrderId){

    if(!workOrderId){

        throw new Error(
            "Work Order ID wajib diisi."
        );

    }


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


    if(
        !workOrderParts ||
        workOrderParts.length === 0
    ){

        return {

            success :
                true,

            totalItem :
                0,

            items :
                []

        };

    }


    /**
     * ====================================
     * BUILD STOCK OUT ITEMS
     * ====================================
     */

    const stockItems = [];

    const skippedItems = [];


    for(
        let i = 0;
        i < workOrderParts.length;
        i++
    ){

        const part =
            workOrderParts[i];


        /**
         * ================================
         * HANYA PART AKTIF
         * ================================
         */

        const status =
            part[
                COL_WORK_ORDER_PART
                    .STATUS
            ];


        if(
            status &&
            status !== "AKTIF"
        ){

            continue;

        }


        /**
         * ================================
         * AMBIL WORK ORDER PART ID
         * ================================
         */

        const workOrderPartId =
            part[
                COL_WORK_ORDER_PART
                    .ID
            ];


        /**
         * ================================
         * CEK IDEMPOTENCY
         * ================================
         */

        if(
            this.isStockOutRecorded(
                workOrderPartId
            )
        ){

            skippedItems.push({

                workOrderPartId :
                    workOrderPartId,

                reason :
                    "Stock Out sudah tercatat."

            });


            continue;

        }


        /**
         * ================================
         * BUILD REQUEST
         * ================================
         */

        const request =
            this.buildStockOutRequest(
                part
            );


        /**
         * ================================
         * REFERENSI HARUS WOP ID
         * ================================
         */

        request.referensi =
            workOrderPartId;


        stockItems.push(
            request
        );

    }


    /**
     * ====================================
     * TIDAK ADA ITEM BARU
     * ====================================
     */

    if(
        stockItems.length === 0
    ){

        return {

            success :
                true,

            totalItem :
                0,

            items :
                [],

            skippedItems :
                skippedItems

        };

    }


    /**
     * ====================================
     * ATOMIC STOCK OUT
     * ====================================
     */

    const stockResult =
        StockLedgerService
            .recordOutBatchAtomic(
                stockItems
            );


    /**
     * ====================================
     * RETURN
     * ====================================
     */

    return {

        success :
            stockResult.success,

        totalItem :
            stockResult.totalItem,

        items :
            stockResult.items,

        skippedItems :
            skippedItems

    };

},

};

