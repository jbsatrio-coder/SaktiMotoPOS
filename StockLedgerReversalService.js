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


        /**
         * ====================================
         * 2. CARI STOCK LEDGER
         * ====================================
         */

        const ledgers =
            StockLedgerRepository
                .findByReferensi(
                    workOrderPartId
                );


        if(
            !ledgers ||
            ledgers.length === 0
        ){

            throw new Error(
                "Stock Out untuk Work Order Part tidak ditemukan: " +
                workOrderPartId
            );

        }


        /**
         * ====================================
         * 3. CARI LEDGER STOCK OUT
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
         * 4. CEK SUDAH PERNAH REVERSAL
         * ====================================
         */

        const reversalLedgers =
            ledgers.filter(
                function(ledger){

                    return (
                        String(
                            ledger[
                                COL_STOK.JENISMUTASI
                            ] || ""
                        ).trim()
                        ===
                        "REVERSAL"
                    );

                }
            );


        if(
            reversalLedgers.length > 0
        ){

            throw new Error(
                "Stock Out untuk Work Order Part sudah pernah direversal: " +
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

        }
        catch(error){

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

    }

};