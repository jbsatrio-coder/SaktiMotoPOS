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
     * CHANGE STATUS
     * ========================================
     *
     * Mengubah status WorkOrderPart melalui
     * WorkOrderPartStatusService.
     *
     * Method ini:
     * - tidak mengubah data part lainnya
     * - tidak melakukan stock-out
     * - hanya mengatur lifecycle status
     * ========================================
     */
    /**
 * ========================================
 * CHANGE STATUS
 * ========================================
 *
 * Mengubah status WorkOrderPart melalui
 * lifecycle status service.
 *
 * CANCEL memiliki lifecycle khusus:
 *
 * PROGRESS
 *    ↓
 * CANCEL
 *    ↓
 * AUTO REVERSAL jika sudah Stock Out
 *
 * Status lain menggunakan update biasa.
 * ========================================
 */
changeStatus(
    workOrderPartId,
    nextStatus
){

    /**
     * ====================================
     * 1. VALIDASI ID
     * ====================================
     */

    if(!workOrderPartId){

        throw new Error(
            "WorkOrderPart ID wajib diisi."
        );

    }


    /**
     * ====================================
     * 2. LOAD WORK ORDER PART
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
     * 3. CURRENT STATUS
     * ====================================
     */

    const currentStatus =
        workOrderPart[
            COL_WORK_ORDER_PART.STATUS
        ];


    /**
     * ====================================
     * 4. VALIDATE TRANSITION
     * ====================================
     */

    WorkOrderPartStatusService.validateTransition(
        currentStatus,
        nextStatus
    );


    /**
     * ====================================
     * 5. SPECIAL LIFECYCLE: CANCEL
     * ====================================
     *
     * CANCEL tidak boleh langsung
     * update status.
     *
     * Gunakan cancel() agar:
     *
     * - Stock Out dicek
     * - Reversal dilakukan jika perlu
     * - Stock dikembalikan
     * - Ledger OUT dipertahankan
     * - Ledger REVERSAL dibuat
     * - Baru status menjadi CANCEL
     */

    if(
        nextStatus ===
        WorkOrderPartStatus.CANCEL
    ){

        return this.cancel(
            workOrderPartId
        );

    }


    /**
     * ====================================
     * 6. UPDATE STATUS NORMAL
     * ====================================
     *
     * Untuk status selain CANCEL,
     * gunakan mekanisme update biasa.
     */

    WorkOrderPartRepository.update({

        id :
            workOrderPartId,

        status :
            nextStatus

    });


    /**
     * ====================================
     * 7. RETURN
     * ====================================
     */

    return {

        success :
            true,

        workOrderPartId :
            workOrderPartId,

        previousStatus :
            currentStatus,

        status :
            nextStatus

    };

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

                WorkOrderPartStatus.OPEN,


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


    const workOrderPartId =
        workOrderPart[
            COL_WORK_ORDER_PART
                .ID
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
    status !== WorkOrderPartStatus.PROGRESS
){

    throw new Error(
        "WorkOrderPart harus berstatus PROGRESS untuk stock out."
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
            "SYSTEM",


        /**
         * ====================================
         * CANONICAL TRANSACTION IDENTITY V1
         * ====================================
         *
         * Identity ini sengaja tidak mengubah
         * schema 14_Stok.
         *
         * Referensi ledger tetap WorkOrderPart ID
         * agar behaviour audit dan reversal lama
         * tetap kompatibel.
         */
        canonicalIdentity :
            this.buildStockOutTransactionIdentity(
                workOrderId,
                workOrderPartId
            ),

        idempotencyKey :
            "WOP:" +
            String(workOrderPartId || "").trim() +
            ":OUT"

    };

},

/**
 * ========================================
 * BUILD CANONICAL STOCK-OUT IDENTITY
 * ========================================
 *
 * Transaction ID bersifat deterministic untuk
 * satu business operation WorkOrderPart OUT.
 * Stock Ledger ID tetap merupakan ID audit row.
 */
buildStockOutTransactionIdentity(
    workOrderId,
    workOrderPartId
){

    const sourceDocumentId =
        String(workOrderId || "").trim();

    const sourceLineId =
        String(workOrderPartId || "").trim();

    if(!sourceLineId){

        throw new Error(
            "WorkOrderPart ID wajib diisi untuk Stock Out."
        );

    }

    const idempotencyKey =
        "WOP:" +
        sourceLineId +
        ":OUT";

    return {

        transactionId :
            idempotencyKey,

        transactionType :
            "WO_PART_OUT",

        sourceDocumentType :
            "WORK_ORDER_PART",

        sourceDocumentId :
            sourceDocumentId,

        sourceLineId :
            sourceLineId,

        idempotencyKey :
            idempotencyKey

    };

},

/**
 * ========================================
 * READ EXISTING CANONICAL STOCK-OUT RESULT
 * ========================================
 */
getRecordedStockOutTransaction(
    workOrderPartId,
    identity
){

    const ledgerRows =
        StockLedgerRepository
            .findByReferensi(
                workOrderPartId
            );

    const stockOutRows =
        ledgerRows.filter(
            function(row){

                return (
                    Number(
                        row[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        );

    if(stockOutRows.length !== 1){

        return null;

    }

    const ledger =
        stockOutRows[0];

    return {

        transaction :
            identity,

        stockLedgerId :
            ledger[
                COL_STOK.ID
            ],

        barangId :
            ledger[
                COL_STOK.BARANG_ID
            ],

        qtyKeluar :
            Number(
                ledger[
                    COL_STOK.QTYKELUAR
                ]
            ) || 0,

        stokAwal :
            Number(
                ledger[
                    COL_STOK.STOKAWAL
                ]
            ) || 0,

        stokAkhir :
            Number(
                ledger[
                    COL_STOK.STOKAKHIR
                ]
            ) || 0

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
        .findByReferensi(
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


    const identity =
        request.canonicalIdentity;


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
            result.alreadyRecorded === true,

        workOrderPartId :
            workOrderPartId,

        transaction :
            identity,

        existingTransaction :
            result.alreadyRecorded === true
                ? this.getRecordedStockOutTransaction(
                    workOrderPartId,
                    identity
                )
                : null,

        stockResult :
            result

    };

},

/**
 * ========================================
 * CANCEL WORK ORDER PART
 * ========================================
 *
 * Membatalkan WorkOrderPart.
 *
 * Jika belum Stock OUT:
 * - langsung CANCEL
 *
 * Jika sudah Stock OUT:
 * - lakukan reversal
 * - stock dikembalikan
 * - Ledger OUT tetap dipertahankan
 * - Ledger REVERSAL dibuat
 * - kemudian status menjadi CANCEL
 *
 * Jika reversal gagal:
 * - status tetap PROGRESS
 * ========================================
 */
cancel(workOrderPartId){

    /**
     * ====================================
     * 1. VALIDASI ID
     * ====================================
     */

    if(!workOrderPartId){

        throw new Error(
            "Work Order Part ID wajib diisi."
        );

    }


    /**
     * ====================================
     * 2. LOAD WORK ORDER PART
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
     * 3. CURRENT STATUS
     * ====================================
     */

    const currentStatus =
        workOrderPart[
            COL_WORK_ORDER_PART.STATUS
        ];


    /**
     * ====================================
     * 4. VALIDATE TRANSITION
     * ====================================
     */

    WorkOrderPartStatusService.validateTransition(

        currentStatus,

        WorkOrderPartStatus.CANCEL

    );


    /**
     * ====================================
     * 5. CEK STOCK OUT
     * ====================================
     */

    const stockOutRecorded =
        this.isStockOutRecorded(
            workOrderPartId
        );


    /**
     * ====================================
     * 6. REVERSAL
     * ====================================
     *
     * Reversal harus berhasil terlebih
     * dahulu sebelum status diubah.
     */

    let reversalResult = null;


    if(
        stockOutRecorded
    ){

        reversalResult =
            StockLedgerReversalService
                .reverseByWorkOrderPartId(
                    workOrderPartId
                );

    }


    /**
     * ====================================
     * 7. UPDATE STATUS → CANCEL
     * ====================================
     */

    WorkOrderPartRepository.update({

        id :
            workOrderPartId,

        status :
            WorkOrderPartStatus.CANCEL

    });


    /**
     * ====================================
     * 8. RETURN
     * ====================================
     */

    return {

        success :
            true,

        workOrderPartId :
            workOrderPartId,

        previousStatus :
            currentStatus,

        status :
            WorkOrderPartStatus.CANCEL,

        stockOutRecorded :
            stockOutRecorded,

        reversal :
            reversalResult

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

    Logger.log(
    "=== CONSUME STOCK BATCH DEBUG ==="
);

Logger.log(
    "WORK ORDER ID:"
);

Logger.log(
    workOrderId
);

Logger.log(
    "TOTAL WORK ORDER PART:"
);

Logger.log(
    workOrderParts.length
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

            Logger.log(
    "WOP BATCH CHECK:"
);

Logger.log(
    part[
        COL_WORK_ORDER_PART.ID
    ]
);

Logger.log(
    "STATUS:"
);

Logger.log(
    status
);

Logger.log(
    "EXPECTED:"
);

Logger.log(
    WorkOrderPartStatus.PROGRESS
);

Logger.log(
    "STATUS MATCH:"
);

Logger.log(
    status ===
    WorkOrderPartStatus.PROGRESS
);


        if(
    status !==
    WorkOrderPartStatus.PROGRESS
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


        /**
         * Batch lama menggabungkan qty berdasarkan
         * barang. Identity per WorkOrderPart belum
         * dapat dipersist secara aman pada batch
         * gabungan tanpa mengubah behaviour ledger.
         *
         * Step 1 membatasi canonical identity pada
         * consumeStock() satu WorkOrderPart.
         */
        delete request.canonicalIdentity;
        delete request.idempotencyKey;


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

        Logger.log(
    "FINAL STOCK ITEMS BEFORE ATOMIC:"
);

Logger.log(
    stockItems.length
);

Logger.log(
    JSON.stringify(
        stockItems
    )
);

Logger.log(
    "FINAL SKIPPED ITEMS:"
);

Logger.log(
    JSON.stringify(
        skippedItems
    )
);

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
