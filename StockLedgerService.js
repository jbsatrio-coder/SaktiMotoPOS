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
     * Record Canonical WOP Out Batch Atomic
     * ============================================
     *
     * Step 2C executor. This method is intentionally
     * separate from recordOutBatchAtomic() so legacy
     * callers retain their current behavior.
     *
     * The planner is re-run inside ScriptLock, then
     * every submitted line is compared again with its
     * authoritative WorkOrderPart before mutation.
     * ============================================
     */
    recordCanonicalWopOutBatchAtomic(batch){

        if(!batch || !Array.isArray(batch.lines)){

            throw new Error(
                "Canonical WOP batch wajib berisi lines array."
            );

        }

        if(batch.lines.length === 0){

            throw new Error(
                "Canonical WOP batch tidak boleh kosong."
            );

        }

        const workOrderId =
            String(batch.workOrderId || "").trim();

        if(!workOrderId){

            throw new Error(
                "Work Order ID wajib diisi."
            );

        }

        const lock =
            LockService.getScriptLock();

        lock.waitLock(30000);

        const updatedStocks = [];
        const createdLedgerIds = [];

        try{

            const submittedBySourceLineId = {};
            const submittedSourceLineIds = [];

            for(
                let i = 0;
                i < batch.lines.length;
                i++
            ){

                const line =
                    batch.lines[i];

                const sourceLineId =
                    String(
                        line && line.sourceLineId || ""
                    ).trim();

                if(!sourceLineId){

                    throw new Error(
                        "Canonical WOP sourceLineId wajib diisi."
                    );

                }

                if(submittedBySourceLineId[sourceLineId]){

                    throw new Error(
                        "Duplicate WorkOrderPart source line pada canonical executor: " +
                        sourceLineId
                    );

                }

                submittedBySourceLineId[sourceLineId] =
                    line;

                submittedSourceLineIds.push(
                    sourceLineId
                );

            }

            submittedSourceLineIds.sort();

            const authoritativeBySourceLineId = {};

            for(
                let i = 0;
                i < submittedSourceLineIds.length;
                i++
            ){

                const sourceLineId =
                    submittedSourceLineIds[i];

                const submittedLine =
                    submittedBySourceLineId[sourceLineId];

                const workOrderPart =
                    WorkOrderPartRepository.findByIdFresh(
                        sourceLineId
                    );

                if(!workOrderPart){

                    throw new Error(
                        "Canonical WOP source tidak ditemukan: " +
                        sourceLineId
                    );

                }

                const authoritativeWorkOrderId =
                    String(
                        workOrderPart[
                            COL_WORK_ORDER_PART.WORK_ORDER_ID
                        ] || ""
                    ).trim();

                const authoritativeBarangId =
                    String(
                        workOrderPart[
                            COL_WORK_ORDER_PART.BARANG_ID
                        ] || ""
                    ).trim();

                const authoritativeQty =
                    Number(
                        workOrderPart[
                            COL_WORK_ORDER_PART.QTY
                        ]
                    );

                const expectedIdentity =
                    WorkOrderPartService
                        .buildStockOutTransactionIdentity(
                            authoritativeWorkOrderId,
                            sourceLineId
                        );

                if(
                    authoritativeWorkOrderId !== workOrderId ||
                    workOrderPart[
                        COL_WORK_ORDER_PART.STATUS
                    ] !== WorkOrderPartStatus.PROGRESS ||
                    !authoritativeBarangId ||
                    !Number.isFinite(authoritativeQty) ||
                    authoritativeQty <= 0 ||
                    submittedLine.transactionId !== expectedIdentity.transactionId ||
                    submittedLine.transactionType !== "WO_PART_OUT" ||
                    submittedLine.sourceDocumentType !== "WORK_ORDER_PART" ||
                    submittedLine.sourceDocumentId !== authoritativeWorkOrderId ||
                    submittedLine.sourceLineId !== sourceLineId ||
                    submittedLine.idempotencyKey !== expectedIdentity.idempotencyKey ||
                    String(submittedLine.barangId || "").trim() !== authoritativeBarangId ||
                    Number(submittedLine.qty) !== authoritativeQty ||
                    String(submittedLine.referensi || "").trim() !== sourceLineId
                ){

                    throw new Error(
                        "Canonical WOP line tidak sesuai dengan WorkOrderPart authoritative: " +
                        sourceLineId
                    );

                }

                authoritativeBySourceLineId[sourceLineId] = {
                    workOrderPart :
                        workOrderPart,
                    barangId :
                        authoritativeBarangId,
                    qty :
                        authoritativeQty
                };

            }

            /**
             * Planner is invoked inside the same lock.
             * The submitted line set must exactly match
             * all current eligible lines for this Work Order
             * so no PROGRESS WOP is silently omitted.
             */
            const plan =
                WorkOrderPartService
                    .planCanonicalStockOutBatch(
                        workOrderId
                    );

            const plannedSourceLineIds =
                plan.lines.map(
                    function(line){

                        return line.sourceLineId;

                    }
                ).sort();

            if(
                plan.invalidLines.length > 0 ||
                plannedSourceLineIds.length !== submittedSourceLineIds.length ||
                plannedSourceLineIds.join("|") !==
                submittedSourceLineIds.join("|")
            ){

                throw new Error(
                    "Canonical WOP batch tidak sesuai dengan WorkOrderPart PROGRESS authoritative."
                );

            }

            const plannedBySourceLineId = {};

            for(
                let i = 0;
                i < plan.lines.length;
                i++
            ){

                const plannedLine =
                    plan.lines[i];

                plannedBySourceLineId[
                    plannedLine.sourceLineId
                ] = plannedLine;

            }

            const newLines = [];
            const existingLines = [];

            for(
                let i = 0;
                i < submittedSourceLineIds.length;
                i++
            ){

                const sourceLineId =
                    submittedSourceLineIds[i];

                const plannedLine =
                    plannedBySourceLineId[sourceLineId];

                if(
                    plannedLine.classification ===
                    "LEGACY_AMBIGUOUS"
                ){

                    throw new Error(
                        "Canonical WOP batch ditolak: LEGACY_AMBIGUOUS pada " +
                        sourceLineId +
                        ". " +
                        plannedLine.classificationReason
                    );

                }

                if(
                    plannedLine.classification ===
                    "CONFLICT"
                ){

                    throw new Error(
                        "Canonical WOP batch ditolak: CONFLICT pada " +
                        sourceLineId +
                        ". " +
                        plannedLine.classificationReason
                    );

                }

                if(
                    plannedLine.classification ===
                    "EXISTING_CANONICAL"
                ){

                    existingLines.push(plannedLine);

                    continue;

                }

                if(plannedLine.classification !== "NEW"){

                    throw new Error(
                        "Canonical WOP batch memiliki classification tidak dapat dieksekusi: " +
                        plannedLine.classification
                    );

                }

                newLines.push(plannedLine);

            }

            const stockStateByBarangId = {};

            for(
                let i = 0;
                i < newLines.length;
                i++
            ){

                const line =
                    newLines[i];

                if(!stockStateByBarangId[line.barangId]){

                    const barang =
                        BarangRepository.findById(
                            line.barangId
                        );

                    if(!barang){

                        throw new Error(
                            "Barang canonical WOP tidak ditemukan: " +
                            line.barangId
                        );

                    }

                    stockStateByBarangId[line.barangId] = {
                        barangId :
                            line.barangId,
                        stokAwal :
                            BarangRepository.getStock(
                                line.barangId
                            ),
                        qtyRequired :
                            0,
                        stokAkhir :
                            0,
                        currentLedgerStock :
                            0
                    };

                }

                stockStateByBarangId[line.barangId]
                    .qtyRequired += line.qty;

            }

            const barangIds =
                Object.keys(stockStateByBarangId).sort();

            for(
                let i = 0;
                i < barangIds.length;
                i++
            ){

                const stockState =
                    stockStateByBarangId[
                        barangIds[i]
                    ];

                if(stockState.stokAwal < stockState.qtyRequired){

                    throw new Error(
                        "Stok tidak mencukupi untuk canonical WOP batch. Barang: " +
                        stockState.barangId +
                        ", Stok: " + stockState.stokAwal +
                        ", Qty: " + stockState.qtyRequired
                    );

                }

                stockState.stokAkhir =
                    stockState.stokAwal -
                    stockState.qtyRequired;

                stockState.currentLedgerStock =
                    stockState.stokAwal;

                updatedStocks.push({
                    barangId :
                        stockState.barangId,
                    stokAwal :
                        stockState.stokAwal,
                    stokAkhir :
                        stockState.stokAkhir
                });

            }

            const ledgerPlans = [];

            for(
                let i = 0;
                i < newLines.length;
                i++
            ){

                const line =
                    newLines[i];

                const stockState =
                    stockStateByBarangId[line.barangId];

                const stokAwal =
                    stockState.currentLedgerStock;

                const stokAkhir =
                    stokAwal - line.qty;

                stockState.currentLedgerStock =
                    stokAkhir;

                ledgerPlans.push({
                    line :
                        line,
                    stokAwal :
                        stokAwal,
                    stokAkhir :
                        stokAkhir
                });

            }

            for(
                let i = 0;
                i < updatedStocks.length;
                i++
            ){

                const stock =
                    updatedStocks[i];

                BarangRepository.updateStockAbsolute(
                    stock.barangId,
                    stock.stokAkhir
                );

            }

            const newResultsBySourceLineId = {};

            for(
                let i = 0;
                i < ledgerPlans.length;
                i++
            ){

                const ledgerPlan =
                    ledgerPlans[i];

                const line =
                    ledgerPlan.line;

                const authoritative =
                    authoritativeBySourceLineId[
                        line.sourceLineId
                    ];

                const stockLedgerId =
                    RunningNumberService.generate(
                        DocumentType.STOCK_LEDGER
                    );

                const result =
                    this.recordOutLedgerOnly_({
                        id :
                            stockLedgerId,
                        barangId :
                            line.barangId,
                        namaBarang :
                            authoritative.workOrderPart[
                                COL_WORK_ORDER_PART.NAMA_BARANG_SNAPSHOT
                            ] || "",
                        jenisMutasi :
                            "SERVICE",
                        referensi :
                            line.sourceLineId,
                        stokAwal :
                            ledgerPlan.stokAwal,
                        qty :
                            line.qty,
                        stokAkhir :
                            ledgerPlan.stokAkhir,
                        keterangan :
                            authoritative.workOrderPart[
                                COL_WORK_ORDER_PART.CATATAN
                            ] || "Pemakaian Part Work Order",
                        admin :
                            "SYSTEM"
                    });

                if(!result || result.success !== true){

                    throw new Error(
                        "Gagal mencatat Stock Ledger canonical WOP: " +
                        line.sourceLineId
                    );

                }

                createdLedgerIds.push(stockLedgerId);

                newResultsBySourceLineId[
                    line.sourceLineId
                ] = {
                    success :
                        true,
                    alreadyRecorded :
                        false,
                    stockLedgerId :
                        stockLedgerId,
                    barangId :
                        line.barangId,
                    qtyKeluar :
                        line.qty,
                    stokAwal :
                        ledgerPlan.stokAwal,
                    stokAkhir :
                        ledgerPlan.stokAkhir,
                    transaction :
                        line
                };

            }

            /**
             * Stock dan ledger canonical harus sudah
             * visible sebelum ScriptLock dilepas.
             * Ini membuat reversal yang menunggu lock
             * selalu membaca OUT yang sudah committed.
             */
            if(newLines.length > 0){

                SpreadsheetApp.flush();

            }

            const results =
                submittedSourceLineIds.map(
                    function(sourceLineId){

                        if(newResultsBySourceLineId[sourceLineId]){

                            return newResultsBySourceLineId[
                                sourceLineId
                            ];

                        }

                        const existingLine =
                            plannedBySourceLineId[sourceLineId];

                        return {
                            success :
                                true,
                            alreadyRecorded :
                                true,
                            stockLedgerId :
                                existingLine.stockLedgerId,
                            barangId :
                                existingLine.barangId,
                            qtyKeluar :
                                existingLine.qty,
                            transaction :
                                existingLine
                        };

                    }
                );

            return {
                success :
                    true,
                alreadyRecorded :
                    newLines.length === 0,
                workOrderId :
                    workOrderId,
                totalItem :
                    results.length,
                newItemCount :
                    newLines.length,
                existingItemCount :
                    existingLines.length,
                items :
                    results
            };

        }
        catch(error){

            for(
                let i = 0;
                i < updatedStocks.length;
                i++
            ){

                const stock =
                    updatedStocks[i];

                try{

                    BarangRepository.updateStockAbsolute(
                        stock.barangId,
                        stock.stokAwal
                    );

                }
                catch(rollbackError){

                    Logger.log(
                        "[CRITICAL CANONICAL WOP STOCK ROLLBACK ERROR] " +
                        stock.barangId +
                        " : " + rollbackError.message
                    );

                }

            }

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
                catch(rollbackError){

                    Logger.log(
                        "[CRITICAL CANONICAL WOP LEDGER ROLLBACK ERROR] " +
                        createdLedgerIds[i] +
                        " : " + rollbackError.message
                    );

                }

            }

            throw new Error(
                "Canonical WOP batch gagal dan rollback dilakukan. " +
                error.message
            );

        }
        finally{

            lock.releaseLock();

        }

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
