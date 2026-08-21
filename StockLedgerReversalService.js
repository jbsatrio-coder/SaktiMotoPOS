/**
 * ============================================
 * Stock Ledger Reversal Service
 * Version : 1.0.0
 * ============================================
 *
 * Membatalkan Stock OUT dengan membuat
 * Stock IN baru sebagai reversal.
 *
 * Prinsip:
 *
 * - Ledger OUT lama TIDAK dihapus
 * - Ledger OUT lama TIDAK diubah
 * - Stock aktual dikembalikan
 * - Dibuat Ledger IN baru
 * - Reversal hanya boleh dilakukan satu kali
 *
 * Service ini belum mengubah status
 * Work Order Part.
 * ============================================
 */

const StockLedgerReversalService = {

    /**
     * ========================================
     * REVERSE STOCK OUT
     * ========================================
     */

    reverseByWorkOrderPartId(
        workOrderPartId
    ){

        const lock =
            LockService.getScriptLock();

        lock.waitLock(30000);

        try{

            return this.reverseByWorkOrderPartIdNoLock_(
                workOrderPartId
            );

        }
        finally{

            lock.releaseLock();

        }

    },

    /**
     * ========================================
     * REVERSE STOCK OUT - LOCK ALREADY HELD
     * ========================================
     *
     * Dipakai oleh WorkOrderPartService.cancel()
     * yang sudah memegang ScriptLock. Jangan
     * panggil helper ini dari caller umum.
     */
    reverseByWorkOrderPartIdNoLock_(
        workOrderPartId,
        options
    ){

        /**
         * ====================================
         * 1. VALIDASI ID
         * ====================================
         */

        if(
            !workOrderPartId
        ){

            throw new Error(
                "Work Order Part ID wajib diisi."
            );

        }

        const workOrderPart =
            WorkOrderPartRepository.findById(
                workOrderPartId
            );

        if(!workOrderPart){

            throw new Error(
                "WorkOrderPart tidak ditemukan: " +
                workOrderPartId
            );

        }

        /**
         * ====================================
         * 2. CARI STOCK LEDGER
         * ====================================
         */

        const ledgers =
            StockLedgerRepository
                .findByReferensiFresh(
                    workOrderPartId
                );

        const reversalIdempotencyKey =
            this.getReversalIdempotencyKey_(
                workOrderPartId
            );

        const scriptProperties =
            this.getReversalPropertyStore_();

        const propertyMetadata =
            this.getReversalIdempotencyMetadata_(
                scriptProperties,
                reversalIdempotencyKey
            );


        /**
         * ====================================
         * 3. VALIDATE REVERSAL SOURCE OF TRUTH
         * ====================================
         *
         * Stock Ledger adalah bukti bisnis.
         * Property hanya marker teknis dan selalu
         * direkonsiliasi terhadap ledger fresh.
         */

        const reversalLedgers =
            (ledgers || []).filter(
                function(ledger){

                    return String(
                        ledger[
                            COL_STOK.JENISMUTASI
                        ] || ""
                    ).trim() === "REVERSAL";

                }
            );

        if(reversalLedgers.length > 1){

            throw new Error(
                "Audit anomaly: ditemukan lebih dari satu REVERSAL untuk Work Order Part: " +
                workOrderPartId
            );

        }

        if(reversalLedgers.length === 1){

            const reversalLedger =
                reversalLedgers[0];

            const reversalLedgerId =
                String(
                    reversalLedger[
                        COL_STOK.ID
                    ] || ""
                ).trim();

            const propertyMatchesLedger =
                propertyMetadata &&
                propertyMetadata.stockLedgerId ===
                reversalLedgerId;

            if(!propertyMatchesLedger){

                this.writeReversalIdempotencyMarker_(
                    scriptProperties,
                    reversalIdempotencyKey,
                    reversalLedgerId
                );

            }

            throw new Error(
                "Stock Out untuk Work Order Part sudah pernah direversal: " +
                workOrderPartId
            );

        }

        if(propertyMetadata){

            throw new Error(
                "Reversal idempotency metadata tidak konsisten: property ada tetapi ledger REVERSAL tidak ditemukan. Recovery manual diperlukan untuk Work Order Part: " +
                workOrderPartId
            );

        }


        if(
            !ledgers ||
            ledgers.length === 0
        ){

            if(options && options.allowNoStockOut === true){

                return {
                    success :
                        true,
                    noStockOut :
                        true,
                    workOrderPartId :
                        workOrderPartId
                };

            }

            throw new Error(
                "Stock Out untuk Work Order Part tidak ditemukan: " +
                workOrderPartId
            );

        }


        /**
         * ====================================
         * 4. CARI LEDGER STOCK OUT
         * ====================================
         *
         * Jangan menganggap semua ledger
         * berdasarkan referensi sebagai OUT.
         *
         * Kita hanya mencari ledger dengan
         * qtyKeluar > 0.
         */

        const stockOutLedgers =
            ledgers.filter(
                function(ledger){

                    return (
                        Number(
                            ledger[
                                COL_STOK.QTYKELUAR
                            ]
                        ) || 0
                    ) > 0;

                }
            );


        if(
            stockOutLedgers.length === 0
        ){

            throw new Error(
                "Stock Out untuk Work Order Part tidak ditemukan: " +
                workOrderPartId
            );

        }


        /**
         * ====================================
         * 5. AMBIL STOCK OUT
         * ====================================
         *
         * Untuk v1.0 kita mengharapkan
         * satu Stock Out untuk satu WOP.
         */

        if(
            stockOutLedgers.length > 1
        ){

            throw new Error(
                "Ditemukan lebih dari satu Stock Out untuk Work Order Part: " +
                workOrderPartId
            );

        }


        const stockOutLedger =
            stockOutLedgers[0];


        /**
         * ====================================
         * 6. AMBIL DATA REVERSAL
         * ====================================
         */

        const barangId =
            String(
                stockOutLedger[
                    COL_STOK.BARANG_ID
                ] || ""
            ).trim();


        const qtyKeluar =
            Number(
                stockOutLedger[
                    COL_STOK.QTYKELUAR
                ]
            ) || 0;


        if(
            !barangId
        ){

            throw new Error(
                "Barang ID pada Stock Out tidak valid."
            );

        }


        if(
            qtyKeluar <= 0
        ){

            throw new Error(
                "Qty Stock Out tidak valid untuk reversal."
            );

        }


        /**
         * ====================================
         * 7. CEK BARANG
         * ====================================
         */

        const barang =
            BarangRepository.findById(
                barangId
            );


        if(
            !barang
        ){

            throw new Error(
                "Barang tidak ditemukan: " +
                barangId
            );

        }


        /**
         * ====================================
         * 8. CEK STOCK AKTUAL
         * ====================================
         *
         * Reversal adalah STOCK IN.
         *
         * Tidak ada kebutuhan stock minimum
         * seperti Stock OUT.
         *
         * Kita tetap membaca stock aktual
         * sebagai dasar ledger baru.
         */

        const stokAwal =
            BarangRepository.getStock(
                barangId
            );


        const stokAkhir =
            stokAwal +
            qtyKeluar;


        /**
         * ====================================
         * 9. GENERATE LEDGER ID
         * ====================================
         */

        const stockLedgerId =
            RunningNumberService.generate(
                DocumentType.STOCK_LEDGER
            );


        /**
         * ====================================
         * 10. UPDATE STOCK
         * ====================================
         */

        BarangRepository.updateStockAbsolute(

            barangId,

            stokAkhir

        );


        /**
         * ====================================
         * 11. CREATE REVERSAL LEDGER
         * ====================================
         */

        let reversalLedgerWritten = false;

        try{

            StockLedgerRepository.addHistory({

                id :
                    stockLedgerId,

                tanggal :
                    new Date(),

                jam :
                    new Date(),

                barangId :
                    barangId,

                namaBarang :
                    barang[
                        COL_BARANG.NAMA
                    ] || "",

                jenisMutasi :
                    "REVERSAL",

                referensi :
                    workOrderPartId,

                stokAwal :
                    stokAwal,

                qtyMasuk :
                    qtyKeluar,

                qtyKeluar :
                    0,

                stokAkhir :
                    stokAkhir,

                keterangan :
                    "Reversal Stock Out " +
                    workOrderPartId,

                admin :
                    "SYSTEM",

                createdAt :
                    new Date()

            });

            reversalLedgerWritten = true;

            /**
             * Spreadsheet append dapat terlambat terlihat
             * oleh execution lain. Property ini adalah
             * indeks idempotensi reversal WOP, ditulis
             * setelah ledger berhasil dibuat dan masih di
             * dalam ScriptLock yang sama.
             */
            this.writeReversalIdempotencyMarker_(
                scriptProperties,
                reversalIdempotencyKey,
                stockLedgerId
            );

            /**
             * Pastikan append reversal sudah visible
             * sebelum ScriptLock dilepas. Tanpa flush,
             * execution paralel berikutnya dapat membaca
             * ledger stale dan membuat reversal kedua.
             */
            SpreadsheetApp.flush();

        }
        catch(error){

            if(reversalLedgerWritten){

                throw new Error(
                    "Stock Reversal sudah tercatat, tetapi finalisasi gagal. " +
                    error.message
                );

            }

            /**
             * ====================================
             * ROLLBACK STOCK
             * ====================================
             */

            try{

                BarangRepository.updateStockAbsolute(

                    barangId,

                    stokAwal

                );

            }
            catch(
                rollbackError
            ){

                Logger.log(
                    "[CRITICAL REVERSAL ROLLBACK ERROR] " +
                    barangId +
                    " : " +
                    rollbackError.message
                );

            }


            throw new Error(
                "Stock Reversal gagal dan stock dikembalikan. " +
                error.message
            );

        }


        /**
         * ====================================
         * 12. RETURN
         * ====================================
         */

        return {

            success :
                true,

            workOrderPartId :
                workOrderPartId,

            stockLedgerId :
                stockLedgerId,

            barangId :
                barangId,

            qtyReversal :
                qtyKeluar,

            stokAwal :
                stokAwal,

            stokAkhir :
                stokAkhir,

            jenisMutasi :
                "REVERSAL"

        };

    },

    /**
     * Property hanyalah indeks koordinasi teknis.
     * Ledger tetap menjadi source of truth reversal.
     */
    getReversalIdempotencyKey_(workOrderPartId){

        return "WOP:" +
            String(workOrderPartId).trim() +
            ":REVERSAL";

    },

    getReversalPropertyStore_(){

        return PropertiesService.getScriptProperties();

    },

    getReversalIdempotencyMetadata_(
        scriptProperties,
        propertyKey
    ){

        const rawValue =
            scriptProperties.getProperty(
                propertyKey
            );

        if(!rawValue){

            return null;

        }

        try{

            return JSON.parse(rawValue);

        }
        catch(error){

            return {
                invalid : true
            };

        }

    },

    writeReversalIdempotencyMarker_(
        scriptProperties,
        propertyKey,
        stockLedgerId
    ){

        scriptProperties.setProperty(
            propertyKey,
            JSON.stringify({
                stockLedgerId : stockLedgerId,
                recordedAt : new Date().toISOString()
            })
        );

    }

};
