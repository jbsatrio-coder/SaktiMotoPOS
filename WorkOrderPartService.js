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
 * PLAN CANONICAL STOCK OUT BATCH
 * ========================================
 *
 * Read-only planner for Canonical Inventory
 * Step 2B. It deliberately does not call any
 * stock mutation or ledger write method.
 *
 * Existing individual SERVICE OUT ledgers do
 * not persist their writer identity. Therefore
 * an individual ledger that fully matches its
 * authoritative WOP is classified as
 * EXISTING_CANONICAL by reconstructed contract.
 * Its historical origin cannot be proven
 * without a schema change.
 * ========================================
 */
planCanonicalStockOutBatch(workOrderId){

    const requestedWorkOrderId =
        String(workOrderId || "").trim();

    if(!requestedWorkOrderId){

        throw new Error(
            "Work Order ID wajib diisi."
        );

    }

    const workOrderParts =
        WorkOrderPartRepository
            .findByWorkOrderId(
                requestedWorkOrderId
            );

    const seenWorkOrderPartIds = {};
    const invalidLines = [];
    const candidateParts = [];

    for(
        let i = 0;
        i < workOrderParts.length;
        i++
    ){

        const part =
            workOrderParts[i];

        const workOrderPartId =
            String(
                part[
                    COL_WORK_ORDER_PART.ID
                ] || ""
            ).trim();

        if(!workOrderPartId){

            invalidLines.push({
                reason :
                    "WorkOrderPart ID wajib diisi."
            });

            continue;

        }

        if(seenWorkOrderPartIds[workOrderPartId]){

            throw new Error(
                "Duplicate WorkOrderPart ID pada canonical batch planner: " +
                workOrderPartId
            );

        }

        seenWorkOrderPartIds[workOrderPartId] =
            true;

        const sourceWorkOrderId =
            String(
                part[
                    COL_WORK_ORDER_PART.WORK_ORDER_ID
                ] || ""
            ).trim();

        if(sourceWorkOrderId !== requestedWorkOrderId){

            invalidLines.push({
                workOrderPartId :
                    workOrderPartId,
                reason :
                    "WorkOrderPart tidak dimiliki Work Order yang diminta."
            });

            continue;

        }

        if(
            part[
                COL_WORK_ORDER_PART.STATUS
            ] !== WorkOrderPartStatus.PROGRESS
        ){

            continue;

        }

        const barangId =
            String(
                part[
                    COL_WORK_ORDER_PART.BARANG_ID
                ] || ""
            ).trim();

        const qty =
            Number(
                part[
                    COL_WORK_ORDER_PART.QTY
                ]
            );

        if(
            !barangId ||
            !Number.isFinite(qty) ||
            qty <= 0
        ){

            invalidLines.push({
                workOrderPartId :
                    workOrderPartId,
                reason :
                    "Barang ID dan qty WorkOrderPart harus valid."
            });

            continue;

        }

        candidateParts.push({
            workOrderPartId :
                workOrderPartId,
            workOrderId :
                sourceWorkOrderId,
            barangId :
                barangId,
            qty :
                qty,
            namaBarang :
                part[
                    COL_WORK_ORDER_PART.NAMA_BARANG_SNAPSHOT
                ] || "",
            part :
                part
        });

    }

    candidateParts.sort(
        function(left, right){

            return left.workOrderPartId.localeCompare(
                right.workOrderPartId
            );

        }
    );

    const perBarangById = {};

    for(
        let i = 0;
        i < candidateParts.length;
        i++
    ){

        const candidate =
            candidateParts[i];

        if(!perBarangById[candidate.barangId]){

            perBarangById[candidate.barangId] = {
                barangId :
                    candidate.barangId,
                totalQtyRequired :
                    0,
                sourceLineIds :
                    []
            };

        }

        perBarangById[candidate.barangId]
            .totalQtyRequired += candidate.qty;

        perBarangById[candidate.barangId]
            .sourceLineIds.push(
                candidate.workOrderPartId
            );

    }

    const ledgerRowsByWorkOrderPartId = {};

    for(
        let i = 0;
        i < candidateParts.length;
        i++
    ){

        const candidate =
            candidateParts[i];

        ledgerRowsByWorkOrderPartId[
            candidate.workOrderPartId
        ] = StockLedgerRepository
            .findByReferensi(
                candidate.workOrderPartId
            );

    }

    const legacyAmbiguousBarangIds = {};

    Object.keys(perBarangById).forEach(
        function(barangId){

            const summary =
                perBarangById[barangId];

            if(summary.sourceLineIds.length < 2){

                return;

            }

            for(
                let i = 0;
                i < summary.sourceLineIds.length;
                i++
            ){

                const sourceLineId =
                    summary.sourceLineIds[i];

                const rows =
                    ledgerRowsByWorkOrderPartId[
                        sourceLineId
                    ];

                const groupedLedgerFound =
                    rows.some(
                        function(row){

                            return (
                                Number(
                                    row[
                                        COL_STOK.QTYKELUAR
                                    ]
                                ) || 0
                            ) === summary.totalQtyRequired &&
                            String(
                                row[
                                    COL_STOK.BARANG_ID
                                ] || ""
                            ).trim() === barangId &&
                            String(
                                row[
                                    COL_STOK.JENISMUTASI
                                ] || ""
                            ).trim() === "SERVICE";

                        }
                    );

                if(groupedLedgerFound){

                    legacyAmbiguousBarangIds[barangId] =
                        true;

                    return;

                }

            }

        }
    );

    const lines = [];
    const newLines = [];
    const existingLines = [];
    const legacyCompatibleLines = [];
    const legacyAmbiguousLines = [];
    const conflictLines = [];

    for(
        let i = 0;
        i < candidateParts.length;
        i++
    ){

        const candidate =
            candidateParts[i];

        const identity =
            this.buildStockOutTransactionIdentity(
                candidate.workOrderId,
                candidate.workOrderPartId
            );

        const rows =
            ledgerRowsByWorkOrderPartId[
                candidate.workOrderPartId
            ];

        const stockOutRows =
            rows.filter(
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

        const line = {
            transactionId :
                identity.transactionId,
            transactionType :
                identity.transactionType,
            sourceDocumentType :
                identity.sourceDocumentType,
            sourceDocumentId :
                identity.sourceDocumentId,
            sourceLineId :
                identity.sourceLineId,
            idempotencyKey :
                identity.idempotencyKey,
            barangId :
                candidate.barangId,
            qty :
                candidate.qty,
            referensi :
                candidate.workOrderPartId,
            classification :
                "NEW",
            classificationReason :
                "Belum ada Stock Ledger OUT untuk WorkOrderPart ini."
        };

        if(legacyAmbiguousBarangIds[candidate.barangId]){

            line.classification =
                "LEGACY_AMBIGUOUS";

            line.classificationReason =
                "Ditemukan SERVICE OUT agregat untuk lebih dari satu WorkOrderPart dengan barang sama.";

            legacyAmbiguousLines.push(line);

        }
        else if(stockOutRows.length === 0){

            if(rows.length > 0){

                line.classification =
                    "CONFLICT";

                line.classificationReason =
                    "Referensi ledger ada tetapi tidak memiliki OUT yang dapat divalidasi.";

                conflictLines.push(line);

            }
            else{

                newLines.push(line);

            }

        }
        else if(stockOutRows.length !== 1){

            line.classification =
                "CONFLICT";

            line.classificationReason =
                "Ditemukan lebih dari satu Stock Ledger OUT untuk WorkOrderPart."

            conflictLines.push(line);

        }
        else{

            const ledger =
                stockOutRows[0];

            const ledgerBarangId =
                String(
                    ledger[
                        COL_STOK.BARANG_ID
                    ] || ""
                ).trim();

            const ledgerQty =
                Number(
                    ledger[
                        COL_STOK.QTYKELUAR
                    ]
                ) || 0;

            const ledgerMovementType =
                String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim();

            if(
                ledgerMovementType !== "SERVICE" ||
                ledgerBarangId !== candidate.barangId ||
                ledgerQty !== candidate.qty
            ){

                line.classification =
                    "CONFLICT";

                line.classificationReason =
                    "Stock Ledger OUT tidak sesuai dengan barang, qty, atau jenis mutasi WorkOrderPart authoritative.";

                conflictLines.push(line);

            }
            else{

                line.classification =
                    "EXISTING_CANONICAL";

                line.classificationReason =
                    "Individual SERVICE OUT sesuai contract canonical yang direkonstruksi dari WorkOrderPart authoritative; provenance writer tidak dipersist."

                line.stockLedgerId =
                    ledger[
                        COL_STOK.ID
                    ];

                existingLines.push(line);

            }

        }

        lines.push(line);

    }

    const perBarangSummary =
        Object.keys(perBarangById)
            .sort()
            .map(
                function(barangId){

                    return perBarangById[barangId];

                }
            );

    return {
        workOrderId :
            requestedWorkOrderId,
        lines :
            lines,
        newLines :
            newLines,
        existingLines :
            existingLines,
        legacyCompatibleLines :
            legacyCompatibleLines,
        legacyAmbiguousLines :
            legacyAmbiguousLines,
        conflictLines :
            conflictLines,
        invalidLines :
            invalidLines,
        perBarangSummary :
            perBarangSummary,
        canExecuteCanonicalBatch :
            invalidLines.length === 0 &&
            legacyAmbiguousLines.length === 0 &&
            conflictLines.length === 0
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

    const lock =
        LockService.getScriptLock();

    lock.waitLock(30000);

    try{


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

    const reversalAttempt =
        StockLedgerReversalService
            .reverseByWorkOrderPartIdNoLock_(
                workOrderPartId,
                {
                    allowNoStockOut :
                        true
                }
            );

    const stockOutRecorded =
        reversalAttempt.noStockOut !== true;


    /**
     * ====================================
     * 6. REVERSAL
     * ====================================
     *
     * Reversal harus berhasil terlebih
     * dahulu sebelum status diubah.
     */

    const reversalResult =
        stockOutRecorded
            ? reversalAttempt
            : null;


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
     * Status CANCEL harus terlihat sebelum shared
     * ScriptLock dilepas, agar executor canonical
     * berikutnya tidak membaca WOP PROGRESS stale.
     */
    SpreadsheetApp.flush();


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

    }
    finally{

        lock.releaseLock();

    }

},

/**
 * ========================================
 * CONSUME STOCK BATCH
 * ========================================
 *
 * Mengurangi stok untuk seluruh
 * WorkOrderPart dalam satu Work Order.
 *
 * Caller produksi canonical Step 2D.
 * Planner dan executor melakukan validasi ulang
 * di dalam ScriptLock; legacy grouped ledger
 * ditolak tanpa mutation.
 * ========================================
 */
consumeStockBatch(workOrderId){

    if(!workOrderId){

        throw new Error(
            "Work Order ID wajib diisi."
        );

    }


    const requestedWorkOrderId =
        String(workOrderId).trim();

    const plan =
        this.planCanonicalStockOutBatch(
            requestedWorkOrderId
        );

    if(plan.lines.length === 0){

        return {
            success : true,
            totalItem : 0,
            items : [],
            skippedItems : [],
            alreadyRecorded : false,
            newItemCount : 0,
            existingItemCount : 0
        };

    }

    const batch = {
        workOrderId : requestedWorkOrderId,
        lines : plan.lines.map(
            function(line){

                return {
                    transactionId : line.transactionId,
                    transactionType : line.transactionType,
                    sourceDocumentType : line.sourceDocumentType,
                    sourceDocumentId : line.sourceDocumentId,
                    sourceLineId : line.sourceLineId,
                    idempotencyKey : line.idempotencyKey,
                    barangId : line.barangId,
                    qty : line.qty,
                    referensi : line.referensi
                };

            }
        )
    };

    const stockResult =
        StockLedgerService
            .recordCanonicalWopOutBatchAtomic(
                batch
            );

    const newItems =
        stockResult.items.filter(
            function(item){

                return item.alreadyRecorded !== true;

            }
        );

    const skippedItems =
        stockResult.items.filter(
            function(item){

                return item.alreadyRecorded === true;

            }
        ).map(
            function(item){

                return {
                    workOrderPartId :
                        item.transaction.sourceLineId,
                    reason :
                        "Stock Out sudah tercatat."
                };

            }
        );

    return {
        success : stockResult.success,
        totalItem : newItems.length,
        items : newItems,
        skippedItems : skippedItems,
        alreadyRecorded : stockResult.alreadyRecorded,
        newItemCount : stockResult.newItemCount,
        existingItemCount : stockResult.existingItemCount
    };

},

};
