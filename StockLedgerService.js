/**
 * ============================================
 * Stock Ledger Service
 * Version : 1.1.0
 * ============================================
 */

const StockLedgerService = {

    /**
     * ============================================
     * Record Stock Out
     * ============================================
     *
     * Legacy / single ledger.
     *
     * Catatan:
     * Method ini hanya membuat Stock Ledger.
     * Pengurangan MasterBarang dilakukan oleh
     * caller jika diperlukan.
     */
    recordOut(data){

        if(!data){

            throw new Error(
                "Data mutasi stok wajib diisi."
            );

        }


        if(!data.barangId){

            throw new Error(
                "Barang ID wajib diisi."
            );

        }


        if(!data.qty){

            throw new Error(
                "Qty mutasi wajib diisi."
            );

        }


        const qty =
            Number(data.qty);


        if(qty <= 0){

            throw new Error(
                "Qty mutasi harus lebih besar dari 0."
            );

        }


        if(data.stokAwal === undefined){

            throw new Error(
                "Stok awal wajib diisi."
            );

        }


        const stokAwal =
            Number(data.stokAwal);


        const stokAkhir =
            stokAwal - qty;


        if(stokAkhir < 0){

            throw new Error(
                "Stok tidak mencukupi."
            );

        }


        const result = {

            id :
                data.id || "",

            tanggal :
                data.tanggal ||
                new Date(),

            jam :
                data.jam ||
                new Date(),

            barangId :
                data.barangId,

            namaBarang :
                data.namaBarang || "",

            jenisMutasi :
                data.jenisMutasi ||
                "PENGELUARAN",

            referensi :
                data.referensi || "",

            stokAwal :
                stokAwal,

            qtyMasuk :
                0,

            qtyKeluar :
                qty,

            stokAkhir :
                stokAkhir,

            keterangan :
                data.keterangan || "",

            admin :
                data.admin || "",

            createdAt :
                data.createdAt ||
                new Date()

        };


        StockLedgerRepository.addHistory(
            result
        );


        return {

            success :
                true,

            stockLedgerId :
                result.id,

            barangId :
                result.barangId,

            qtyKeluar :
                result.qtyKeluar,

            stokAwal :
                result.stokAwal,

            stokAkhir :
                result.stokAkhir

        };

    },


    /**
     * ============================================
     * Validate Stock Out
     * ============================================
     *
     * Hanya validasi.
     * Tidak mengubah stok.
     * Tidak membuat ledger.
     */
    validateOut(data){

        if(!data){

            throw new Error(
                "Data validasi stok wajib diisi."
            );

        }


        if(!data.barangId){

            throw new Error(
                "Barang ID wajib diisi."
            );

        }


        const qty =
            Number(
                data.qty || 0
            );


        if(qty <= 0){

            throw new Error(
                "Qty mutasi harus lebih besar dari 0."
            );

        }


        const barang =
            BarangRepository.findById(
                data.barangId
            );


        if(!barang){

            throw new Error(
                "Barang tidak ditemukan : " +
                data.barangId
            );

        }


        const stokAktual =
            Number(
                barang[
                    COL_BARANG.STOK
                ]
            ) || 0;


        if(stokAktual < qty){

            throw new Error(
                "Stok tidak mencukupi. " +
                "Barang: " +
                data.barangId +
                ", Stok: " +
                stokAktual +
                ", Qty: " +
                qty
            );

        }


        return {

            valid :
                true,

            barangId :
                data.barangId,

            namaBarang :
                barang[
                    COL_BARANG.NAMA
                ] || "",

            stokAwal :
                stokAktual,

            qty :
                qty,

            stokAkhir :
                stokAktual - qty

        };

    },


    /**
     * ============================================
     * Record Stock Out - Actual Stock
     * ============================================
     */
    recordOutActualStock(data){

        if(!data){

            throw new Error(
                "Data mutasi stok wajib diisi."
            );

        }


        if(!data.barangId){

            throw new Error(
                "Barang ID wajib diisi."
            );

        }


        const qty =
            Number(
                data.qty || 0
            );


        if(qty <= 0){

            throw new Error(
                "Qty mutasi harus lebih besar dari 0."
            );

        }


        const stokAwal =
            BarangRepository.getStock(
                data.barangId
            );


        if(stokAwal < qty){

            throw new Error(
                "Stok tidak mencukupi. " +
                "Barang: " +
                data.barangId +
                ", Stok: " +
                stokAwal +
                ", Qty: " +
                qty
            );

        }


        const stokAkhir =
            stokAwal - qty;


        const barang =
            BarangRepository.findById(
                data.barangId
            );


        if(!barang){

            throw new Error(
                "Barang tidak ditemukan : " +
                data.barangId
            );

        }


        const namaBarang =
            barang[
                COL_BARANG.NAMA
            ] || "";


        BarangRepository.updateStockAbsolute(

            data.barangId,

            stokAkhir

        );


        const ledgerData = {

            id :
                data.id || "",

            tanggal :
                data.tanggal ||
                new Date(),

            jam :
                data.jam ||
                new Date(),

            barangId :
                data.barangId,

            namaBarang :
                namaBarang,

            jenisMutasi :
                data.jenisMutasi ||
                "PENGELUARAN",

            referensi :
                data.referensi || "",

            stokAwal :
                stokAwal,

            qtyMasuk :
                0,

            qtyKeluar :
                qty,

            stokAkhir :
                stokAkhir,

            keterangan :
                data.keterangan || "",

            admin :
                data.admin || "",

            createdAt :
                data.createdAt ||
                new Date()

        };


        StockLedgerRepository.addHistory(
            ledgerData
        );


        return {

            success :
                true,

            stockLedgerId :
                ledgerData.id,

            barangId :
                data.barangId,

            qtyKeluar :
                qty,

            stokAwal :
                stokAwal,

            stokAkhir :
                stokAkhir

        };

    },


    /**
     * ============================================
     * Validate Stock Out Batch
     * ============================================
     *
     * Menggabungkan qty berdasarkan Barang ID.
     *
     * TIDAK mengubah stok.
     * TIDAK membuat Stock Ledger.
     */
    validateOutBatch(items){

        if(!Array.isArray(items)){

            throw new Error(
                "Items validasi stok wajib berupa array."
            );

        }


        if(items.length === 0){

            throw new Error(
                "Tidak ada item yang divalidasi."
            );

        }


        const grouped = {};


        for(
            let i = 0;
            i < items.length;
            i++
        ){

            const item =
                items[i];


            if(!item){

                throw new Error(
                    "Item validasi stok tidak boleh kosong."
                );

            }


            const barangId =
                String(
                    item.barangId || ""
                ).trim();


            const qty =
                Number(
                    item.qty
                );


            if(!barangId){

                throw new Error(
                    "Barang ID wajib diisi."
                );

            }


            if(
                !Number.isFinite(qty) ||
                qty <= 0
            ){

                throw new Error(
                    "Qty harus lebih besar dari 0."
                );

            }


            if(!grouped[barangId]){

                grouped[barangId] = {

                    barangId :
                        barangId,

                    qty :
                        0,

                    namaBarang :
                        item.namaBarang ||
                        "",

                    jenisMutasi :
                        item.jenisMutasi ||
                        "SERVICE",

                    referensi :
                        item.referensi ||
                        "",

                    keterangan :
                        item.keterangan ||
                        "",

                    admin :
                        item.admin ||
                        "SYSTEM"

                };

            }


            grouped[barangId].qty += qty;

        }


        const results = [];


        const groupedItems =
            Object.values(
                grouped
            );


        for(
            let i = 0;
            i < groupedItems.length;
            i++
        ){

            const item =
                groupedItems[i];


            const result =
                this.validateOut({

                    barangId :
                        item.barangId,

                    qty :
                        item.qty

                });


            results.push({

                ...result,

                jenisMutasi :
                    item.jenisMutasi,

                referensi :
                    item.referensi,

                keterangan :
                    item.keterangan,

                admin :
                    item.admin,

                qtyOriginal :
                    item.qty

            });

        }


        return {

            valid :
                true,

            totalItem :
                results.length,

            items :
                results

        };

    },


    /**
     * ============================================
     * Record Stock Out Batch
     * ============================================
     */
    recordOutBatch(items){

        if(!Array.isArray(items)){

            throw new Error(
                "Items Stock Out Batch wajib berupa array."
            );

        }


        if(items.length === 0){

            throw new Error(
                "Items Stock Out Batch tidak boleh kosong."
            );

        }


        const validation =
            this.validateOutBatch(
                items
            );


        if(!validation.valid){

            throw new Error(
                "Validasi Stock Out Batch gagal."
            );

        }


        const results = [];


        for(
            let i = 0;
            i < validation.items.length;
            i++
        ){

            const item =
                validation.items[i];


            const stockLedgerId =
                RunningNumberService.generate(
                    DocumentType.STOCK_LEDGER
                );


            const result =
                this.recordOut({

                    id :
                        stockLedgerId,

                    barangId :
                        item.barangId,

                    namaBarang :
                        item.namaBarang,

                    jenisMutasi :
                        item.jenisMutasi,

                    referensi :
                        item.referensi,

                    stokAwal :
                        item.stokAwal,

                    qty :
                        item.qty,

                    keterangan :
                        item.keterangan,

                    admin :
                        item.admin

                });


            results.push(
                result
            );

        }


        return {

            success :
                true,

            totalItem :
                results.length,

            items :
                results

        };

    },


    /**
     * ============================================
     * Record Stock Out Batch Atomic
     * ============================================
     *
     * 1. Lock
     * 2. Validasi seluruh batch
     * 3. Snapshot stok aktual
     * 4. Update MasterBarang
     * 5. Buat Stock Ledger
     * 6. Jika gagal -> rollback
     *
     * Running number yang sudah dibuat
     * tidak dikembalikan.
     */
    recordOutBatchAtomic(items){

        if(!Array.isArray(items)){

            throw new Error(
                "Items Stock Out Batch wajib berupa array."
            );

        }


        if(items.length === 0){

            throw new Error(
                "Items Stock Out Batch tidak boleh kosong."
            );

        }


        const lock =
            LockService.getScriptLock();


        lock.waitLock(30000);


        const updatedStocks = [];

        const createdLedgerIds = [];


        try{

            /**
             * ====================================
             * CANONICAL IDEMPOTENCY CHECK V1
             * ====================================
             *
             * Dilakukan DI DALAM lock agar retry
             * WorkOrderPart tidak dapat membuat
             * double stock-out secara concurrent.
             *
             * Optional supaya caller lama tetap
             * menggunakan behaviour sebelumnya.
             */

            const existingTransactions =
                this.findExistingCanonicalStockOuts_(
                    items
                );


            if(
                existingTransactions.length > 0
            ){

                if(
                    existingTransactions.length !==
                    items.length
                ){

                    throw new Error(
                        "Batch Stock Out berisi campuran transaction baru dan transaction yang sudah tercatat."
                    );

                }


                return {

                    success :
                        true,

                    alreadyRecorded :
                        true,

                    totalItem :
                        existingTransactions.length,

                    items :
                        existingTransactions

                };

            }

            /**
             * ====================================
             * 1. VALIDASI SELURUH BATCH
             * ====================================
             */

            const validation =
                this.validateOutBatch(
                    items
                );


            if(!validation.valid){

                throw new Error(
                    "Validasi Stock Out Batch gagal."
                );

            }


            /**
             * ====================================
             * 2. SNAPSHOT STOK AKTUAL
             * ====================================
             */

            for(
                let i = 0;
                i < validation.items.length;
                i++
            ){

                const item =
                    validation.items[i];


                const stokAwal =
                    BarangRepository.getStock(
                        item.barangId
                    );


                if(
                    stokAwal < item.qty
                ){

                    throw new Error(
                        "Stok tidak mencukupi. " +
                        "Barang: " +
                        item.barangId +
                        ", Stok: " +
                        stokAwal +
                        ", Qty: " +
                        item.qty
                    );

                }


                updatedStocks.push({

                    barangId :
                        item.barangId,

                    stokAwal :
                        stokAwal,

                    qty :
                        item.qty,

                    stokAkhir :
                        stokAwal -
                        item.qty

                });

            }


            /**
             * ====================================
             * 3. UPDATE MASTER BARANG
             * ====================================
             */

            for(
                let i = 0;
                i < updatedStocks.length;
                i++
            ){

                const item =
                    updatedStocks[i];


                BarangRepository.updateStockAbsolute(

                    item.barangId,

                    item.stokAkhir

                );

            }


            /**
             * ====================================
             * 4. BUAT STOCK LEDGER
             * ====================================
             */

            for(
                let i = 0;
                i < validation.items.length;
                i++
            ){

                const item =
                    validation.items[i];


                const stockLedgerId =
                    RunningNumberService.generate(
                        DocumentType.STOCK_LEDGER
                    );


                const result =
                    this.recordOutLedgerOnly_({

                        id :
                            stockLedgerId,

                        barangId :
                            item.barangId,

                        namaBarang :
                            item.namaBarang,

                        jenisMutasi :
                            item.jenisMutasi,

                        referensi :
                            item.referensi,

                        stokAwal :
                            updatedStocks[i]
                                .stokAwal,

                        qty :
                            item.qty,

                        stokAkhir :
                            updatedStocks[i]
                                .stokAkhir,

                        keterangan :
                            item.keterangan,

                        admin :
                            item.admin

                    });


                if(
                    !result ||
                    result.success !== true
                ){

                    throw new Error(
                        "Gagal mencatat Stock Ledger : " +
                        item.barangId
                    );

                }


                createdLedgerIds.push(
                    stockLedgerId
                );

            }


            /**
             * ====================================
             * 5. SUCCESS
             * ====================================
             */

            return {

                success :
                    true,

                totalItem :
                    updatedStocks.length,

                items :
                    updatedStocks.map(
                        function(item, index){

                            return {

                                success :
                                    true,

                                stockLedgerId :
                                    createdLedgerIds[
                                        index
                                    ],

                                barangId :
                                    item.barangId,

                                qtyKeluar :
                                    item.qty,

                                stokAwal :
                                    item.stokAwal,

                                stokAkhir :
                                    item.stokAkhir

                            };

                        }
                    )

            };

        }
        catch(error){

            /**
             * ====================================
             * ROLLBACK MASTER BARANG
             * ====================================
             */

            for(
                let i = 0;
                i < updatedStocks.length;
                i++
            ){

                const item =
                    updatedStocks[i];


                try{

                    BarangRepository
                        .updateStockAbsolute(

                            item.barangId,

                            item.stokAwal

                        );

                }
                catch(
                    rollbackError
                ){

                    Logger.log(
                        "[CRITICAL ROLLBACK ERROR] " +
                        item.barangId +
                        " : " +
                        rollbackError.message
                    );

                }

            }


            /**
             * ====================================
             * ROLLBACK STOCK LEDGER
             * ====================================
             */

            for(
                let i = 0;
                i < createdLedgerIds.length;
                i++
            ){

                try{

                    this.deleteLedgerById_(
                        createdLedgerIds[i]
                    );

                }
                catch(
                    ledgerRollbackError
                ){

                    Logger.log(
                        "[CRITICAL LEDGER ROLLBACK ERROR] " +
                        createdLedgerIds[i] +
                        " : " +
                        ledgerRollbackError.message
                    );

                }

            }


            throw new Error(
                "Stock Out Batch gagal dan rollback dilakukan. " +
                error.message
            );

        }
        finally{

            lock.releaseLock();

        }

    },

    /**
     * ============================================
     * FIND EXISTING CANONICAL STOCK OUTS
     * ============================================
     *
     * Ledger schema belum berubah. Untuk WOP V1,
     * `referensi` tetap sourceLineId / WorkOrderPart ID.
     */
    findExistingCanonicalStockOuts_(items){

        const existing = [];


        for(
            let i = 0;
            i < items.length;
            i++
        ){

            const item =
                items[i];

            const identity =
                item && item.canonicalIdentity;


            if(!identity){

                continue;

            }


            this.validateCanonicalStockOutIdentity_(
                item,
                identity
            );


            const workOrderPart =
                WorkOrderPartRepository.findById(
                    identity.sourceLineId
                );


            this.validateCanonicalStockOutSource_(
                item,
                identity,
                workOrderPart
            );


            const ledgerRows =
                StockLedgerRepository
                    .findByReferensi(
                        identity.sourceLineId
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


            if(stockOutRows.length === 0){

                continue;

            }


            if(stockOutRows.length > 1){

                throw new Error(
                    "Conflict canonical Stock Out: ditemukan lebih dari satu ledger OUT untuk " +
                    identity.idempotencyKey
                );

            }


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
                ledgerMovementType !==
                "SERVICE" ||
                ledgerBarangId !==
                String(item.barangId || "").trim() ||
                ledgerQty !==
                Number(item.qty || 0)
            ){

                throw new Error(
                    "Conflict canonical Stock Out untuk " +
                    identity.idempotencyKey +
                    ". Ledger existing tidak sesuai dengan canonical WOP OUT."
                );

            }


            existing.push({

                success :
                    true,

                alreadyRecorded :
                    true,

                stockLedgerId :
                    ledger[
                        COL_STOK.ID
                    ],

                barangId :
                    ledgerBarangId,

                qtyKeluar :
                    ledgerQty,

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
                    ) || 0,

                transaction :
                    identity

            });

        }


        return existing;

    },

    /**
     * ============================================
     * VALIDATE CANONICAL WOP OUT IDENTITY
     * ============================================
     */
    validateCanonicalStockOutIdentity_(
        item,
        identity
    ){

        const sourceLineId =
            String(
                identity.sourceLineId || ""
            ).trim();

        const expectedKey =
            "WOP:" +
            sourceLineId +
            ":OUT";


        if(
            identity.transactionType !==
            "WO_PART_OUT" ||
            identity.sourceDocumentType !==
            "WORK_ORDER_PART" ||
            !sourceLineId ||
            identity.transactionId !== expectedKey ||
            identity.idempotencyKey !== expectedKey ||
            String(item.idempotencyKey || "").trim() !== expectedKey ||
            String(item.referensi || "").trim() !== sourceLineId
        ){

            throw new Error(
                "Canonical identity WorkOrderPart Stock Out tidak valid."
            );

        }


        return true;

    },

    /**
     * ============================================
     * VALIDATE AUTHORITATIVE WOP SOURCE
     * ============================================
     *
     * Ledger lama tidak menyimpan seluruh metadata
     * canonical. Source of truth untuk Step 1 adalah
     * WorkOrderPart yang direferensikan oleh ledger.
     */
    validateCanonicalStockOutSource_(
        item,
        identity,
        workOrderPart
    ){

        if(!workOrderPart){

            throw new Error(
                "Conflict canonical Stock Out: WorkOrderPart source tidak ditemukan."
            );

        }


        const sourceWorkOrderId =
            String(
                workOrderPart[
                    COL_WORK_ORDER_PART.WORK_ORDER_ID
                ] || ""
            ).trim();

        const sourceBarangId =
            String(
                workOrderPart[
                    COL_WORK_ORDER_PART.BARANG_ID
                ] || ""
            ).trim();

        const sourceQty =
            Number(
                workOrderPart[
                    COL_WORK_ORDER_PART.QTY
                ]
            ) || 0;


        if(
            String(
                identity.sourceDocumentId || ""
            ).trim() !== sourceWorkOrderId ||
            String(item.barangId || "").trim() !== sourceBarangId ||
            Number(item.qty || 0) !== sourceQty
        ){

            throw new Error(
                "Conflict canonical Stock Out: payload tidak sesuai dengan WorkOrderPart authoritative."
            );

        }


        return true;

    },


    /**
     * ============================================
     * Internal: Create Ledger Only
     * ============================================
     *
     * Tidak mengubah MasterBarang.
     */
    recordOutLedgerOnly_(data){

        StockLedgerRepository.addHistory({

            id :
                data.id,

            tanggal :
                data.tanggal ||
                new Date(),

            jam :
                data.jam ||
                new Date(),

            barangId :
                data.barangId,

            namaBarang :
                data.namaBarang,

            jenisMutasi :
                data.jenisMutasi ||
                "SERVICE",

            referensi :
                data.referensi ||
                "",

            stokAwal :
                data.stokAwal,

            qtyMasuk :
                0,

            qtyKeluar :
                data.qty,

            stokAkhir :
                data.stokAkhir,

            keterangan :
                data.keterangan ||
                "",

            admin :
                data.admin ||
                "SYSTEM",

            createdAt :
                data.createdAt ||
                new Date()

        });


        return {

            success :
                true,

            stockLedgerId :
                data.id

        };

    },


    /**
     * ============================================
     * Internal: Delete Ledger By ID
     * ============================================
     */
    deleteLedgerById_(stockLedgerId){

        const sh =
            StockLedgerRepository.sheet();


        const lastRow =
            sh.getLastRow();


        if(lastRow < 2){

            return;

        }


        const data =
            sh.getRange(
                2,
                1,
                lastRow - 1,
                COL_STOK.CREATEDAT + 1
            ).getValues();


        for(
            let i = 0;
            i < data.length;
            i++
        ){

            const id =
                String(
                    data[i][
                        COL_STOK.ID
                    ]
                ).trim();


            if(
                id ===
                String(
                    stockLedgerId
                ).trim()
            ){

                sh.deleteRow(
                    i + 2
                );


                Logger.log(
                    "[LEDGER ROLLBACK] " +
                    stockLedgerId
                );


                return;

            }

        }

    }

};
