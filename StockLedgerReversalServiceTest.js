/**
 * ============================================
 * Stock Ledger Reversal Service Test
 * Version : 1.0.0
 * ============================================
 *
 * TEST 1
 *
 * Membuktikan bahwa:
 *
 * 1. Work Order Part dibuat
 * 2. WOP berubah OPEN -> PROGRESS
 * 3. Stock Out dilakukan
 * 4. Stock Ledger OUT tercatat
 * 5. Ledger OUT dapat ditemukan berdasarkan WOP ID
 * 6. Data ledger cukup untuk menjadi dasar reversal
 *
 * TEST INI BELUM MELAKUKAN REVERSAL.
 * ============================================
 */

function testStockLedgerReversalPreparation(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "STOCK LEDGER REVERSAL PREPARATION TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Stock Reversal Preparation Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER PART
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Stock Reversal Preparation Test Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "WORK ORDER PART ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. OPEN -> PROGRESS
     * ========================================
     */

    const statusResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "OPEN -> PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            statusResult
        )
    );


    /**
     * ========================================
     * 4. CEK STOCK AWAL
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SEBELUM:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 5. CONSUME STOCK
     * ========================================
     */

    const consumeResult =
        WorkOrderPartService.consumeStockBatch(
            workOrderId
        );


    Logger.log(
        "CONSUME STOCK RESULT:"
    );

    Logger.log(
        JSON.stringify(
            consumeResult
        )
    );


    /**
     * ========================================
     * 6. CEK STOCK SETELAH OUT
     * ========================================
     */

    const stockAfterOut =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH STOCK OUT:"
    );

    Logger.log(
        stockAfterOut
    );


    /**
     * ========================================
     * 7. VALIDASI STOCK BERKURANG
     * ========================================
     */

    const stockReduced =
        stockAfterOut ===
        stockBefore - 1;


    Logger.log(
        "STOCK BERKURANG 1:"
    );

    Logger.log(
        stockReduced
    );


    if(
        !stockReduced
    ){

        throw new Error(
            "Stock Reversal Preparation Test gagal: " +
            "stok tidak berkurang sesuai Stock Out."
        );

    }


    /**
     * ========================================
     * 8. CARI LEDGER BERDASARKAN WOP ID
     * ========================================
     */

    const ledgers =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    Logger.log(
        "JUMLAH LEDGER BERDASARKAN WOP:"
    );

    Logger.log(
        ledgers.length
    );


    /**
     * ========================================
     * 9. VALIDASI LEDGER ADA
     * ========================================
     */

    if(
        ledgers.length === 0
    ){

        throw new Error(
            "Stock Reversal Preparation Test gagal: " +
            "Stock Ledger OUT tidak ditemukan."
        );

    }


    /**
     * ========================================
     * 10. AMBIL LEDGER TERAKHIR
     * ========================================
     */

    const ledger =
        ledgers[
            ledgers.length - 1
        ];


    Logger.log(
        "LEDGER OUT:"
    );

    Logger.log(
        JSON.stringify(
            ledger
        )
    );


    /**
     * ========================================
     * 11. VALIDASI BARANG
     * ========================================
     */

    const ledgerBarangId =
        String(
            ledger[
                COL_STOK.BARANG_ID
            ] || ""
        ).trim();


    const barangMatch =
        ledgerBarangId ===
        "BRG000001";


    Logger.log(
        "BARANG MATCH:"
    );

    Logger.log(
        barangMatch
    );


    if(
        !barangMatch
    ){

        throw new Error(
            "Stock Reversal Preparation Test gagal: " +
            "Barang ID Stock Ledger tidak sesuai."
        );

    }


    /**
     * ========================================
     * 12. VALIDASI QTY KELUAR
     * ========================================
     */

    const qtyKeluar =
        Number(
            ledger[
                COL_STOK.QTYKELUAR
            ]
        ) || 0;


    const qtyValid =
        qtyKeluar === 1;


    Logger.log(
        "QTY KELUAR:"
    );

    Logger.log(
        qtyKeluar
    );


    Logger.log(
        "QTY KELUAR VALID:"
    );

    Logger.log(
        qtyValid
    );


    if(
        !qtyValid
    ){

        throw new Error(
            "Stock Reversal Preparation Test gagal: " +
            "Qty Stock Out tidak sesuai."
        );

    }


    /**
     * ========================================
     * 13. VALIDASI REFERENSI
     * ========================================
     */

    const ledgerReferensi =
        String(
            ledger[
                COL_STOK.REFERENSI
            ] || ""
        ).trim();


    const referensiMatch =
        ledgerReferensi ===
        workOrderPartId;


    Logger.log(
        "REFERENSI:"
    );

    Logger.log(
        ledgerReferensi
    );


    Logger.log(
        "REFERENSI MATCH:"
    );

    Logger.log(
        referensiMatch
    );


    if(
        !referensiMatch
    ){

        throw new Error(
            "Stock Reversal Preparation Test gagal: " +
            "Referensi ledger tidak menunjuk ke WOP."
        );

    }


    /**
     * ========================================
     * 14. VALIDASI STOCK AKHIR
     * ========================================
     */

    const ledgerStockAkhir =
        Number(
            ledger[
                COL_STOK.STOKAKHIR
            ]
        ) || 0;


    const stockLedgerMatch =
        ledgerStockAkhir ===
        stockAfterOut;


    Logger.log(
        "STOCK AKHIR LEDGER:"
    );

    Logger.log(
        ledgerStockAkhir
    );


    Logger.log(
        "STOCK AKHIR MATCH:"
    );

    Logger.log(
        stockLedgerMatch
    );


    if(
        !stockLedgerMatch
    ){

        throw new Error(
            "Stock Reversal Preparation Test gagal: " +
            "Stock Akhir Ledger tidak sesuai stok aktual."
        );

    }


    /**
     * ========================================
     * 15. FINAL RESULT
     * ========================================
     */

    Logger.log(
        "================================"
    );

    Logger.log(
        "REVERSAL PREPARATION RESULT"
    );

    Logger.log(
        "================================"
    );

    Logger.log(
        "WOP:"
    );

    Logger.log(
        workOrderPartId
    );

    Logger.log(
        "STOCK BEFORE:"
    );

    Logger.log(
        stockBefore
    );

    Logger.log(
        "STOCK AFTER OUT:"
    );

    Logger.log(
        stockAfterOut
    );

    Logger.log(
        "LEDGER OUT FOUND:"
    );

    Logger.log(
        true
    );

    Logger.log(
        "QTY OUT:"
    );

    Logger.log(
        qtyKeluar
    );

    Logger.log(
        "================================"
    );

    Logger.log(
        "STOCK LEDGER REVERSAL PREPARATION TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Stock Ledger Reversal
 * ============================================
 */

function testStockLedgerReversal(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "STOCK LEDGER REVERSAL TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Stock Ledger Reversal Test"

        });


    const workOrderId =
        woResult.workOrderId;


    /**
     * ========================================
     * 2. CREATE WOP
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Stock Ledger Reversal Test Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "WOP ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. OPEN -> PROGRESS
     * ========================================
     */

    WorkOrderPartService.changeStatus(

        workOrderPartId,

        WorkOrderPartStatus.PROGRESS

    );


    /**
     * ========================================
     * 4. STOCK SEBELUM OUT
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SEBELUM OUT:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 5. CONSUME STOCK
     * ========================================
     */

    const consumeResult =
        WorkOrderPartService.consumeStockBatch(
            workOrderId
        );


    Logger.log(
        "CONSUME RESULT:"
    );

    Logger.log(
        JSON.stringify(
            consumeResult
        )
    );


    /**
     * ========================================
     * 6. STOCK SETELAH OUT
     * ========================================
     */

    const stockAfterOut =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH OUT:"
    );

    Logger.log(
        stockAfterOut
    );


    if(
        stockAfterOut !==
        stockBefore - 1
    ){

        throw new Error(
            "Stock Out tidak sesuai expectation."
        );

    }


    /**
     * ========================================
     * 7. REVERSAL
     * ========================================
     */

    const reversalResult =
        StockLedgerReversalService
            .reverseByWorkOrderPartId(
                workOrderPartId
            );


    Logger.log(
        "REVERSAL RESULT:"
    );

    Logger.log(
        JSON.stringify(
            reversalResult
        )
    );


    /**
     * ========================================
     * 8. STOCK SETELAH REVERSAL
     * ========================================
     */

    const stockAfterReversal =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH REVERSAL:"
    );

    Logger.log(
        stockAfterReversal
    );


    const stockRestored =
        stockAfterReversal ===
        stockBefore;


    Logger.log(
        "STOCK KEMBALI:"
    );

    Logger.log(
        stockRestored
    );


    if(
        !stockRestored
    ){

        throw new Error(
            "Stock Reversal gagal: " +
            "stok tidak kembali ke posisi sebelum Stock Out."
        );

    }


    /**
     * ========================================
     * 9. CARI SEMUA LEDGER WOP
     * ========================================
     */

    const ledgers =
        StockLedgerRepository
            .findByReferensi(
                workOrderPartId
            );


    Logger.log(
        "JUMLAH LEDGER:"
    );

    Logger.log(
        ledgers.length
    );


    /**
     * ========================================
     * 10. CARI OUT
     * ========================================
     */

    const outLedgers =
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


    /**
     * ========================================
     * 11. CARI REVERSAL
     * ========================================
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


    Logger.log(
        "STOCK OUT LEDGER:"
    );

    Logger.log(
        outLedgers.length
    );


    Logger.log(
        "REVERSAL LEDGER:"
    );

    Logger.log(
        reversalLedgers.length
    );


    /**
     * ========================================
     * 12. VALIDASI LEDGER OUT TETAP ADA
     * ========================================
     */

    if(
        outLedgers.length !== 1
    ){

        throw new Error(
            "Stock OUT lama tidak ditemukan."
        );

    }


    /**
     * ========================================
     * 13. VALIDASI REVERSAL LEDGER
     * ========================================
     */

    if(
        reversalLedgers.length !== 1
    ){

        throw new Error(
            "Ledger REVERSAL tidak ditemukan."
        );

    }


    const reversalLedger =
        reversalLedgers[0];


    /**
     * ========================================
     * 14. VALIDASI QTY MASUK
     * ========================================
     */

    const qtyMasuk =
        Number(
            reversalLedger[
                COL_STOK.QTYMASUK
            ]
        ) || 0;


    Logger.log(
        "QTY REVERSAL MASUK:"
    );

    Logger.log(
        qtyMasuk
    );


    if(
        qtyMasuk !== 1
    ){

        throw new Error(
            "Qty reversal tidak sesuai."
        );

    }


    /**
     * ========================================
     * 15. VALIDASI QTY KELUAR REVERSAL
     * ========================================
     */

    const qtyKeluarReversal =
        Number(
            reversalLedger[
                COL_STOK.QTYKELUAR
            ]
        ) || 0;


    if(
        qtyKeluarReversal !== 0
    ){

        throw new Error(
            "Ledger reversal tidak boleh memiliki Qty Keluar."
        );

    }


    /**
     * ========================================
     * 16. VALIDASI REFERENSI
     * ========================================
     */

    const reversalReferensi =
        String(
            reversalLedger[
                COL_STOK.REFERENSI
            ] || ""
        ).trim();


    if(
        reversalReferensi !==
        workOrderPartId
    ){

        throw new Error(
            "Referensi reversal tidak sesuai WOP."
        );

    }


    /**
     * ========================================
     * 17. VALIDASI STOCK LEDGER
     * ========================================
     */

    const reversalStockAkhir =
        Number(
            reversalLedger[
                COL_STOK.STOKAKHIR
            ]
        ) || 0;


    if(
        reversalStockAkhir !==
        stockBefore
    ){

        throw new Error(
            "Stock akhir reversal tidak sesuai."
        );

    }


    /**
     * ========================================
     * 18. TEST IDEMPOTENCY
     * ========================================
     *
     * Reversal kedua harus ditolak.
     */

    let duplicateError =
        false;


    try{

        StockLedgerReversalService
            .reverseByWorkOrderPartId(
                workOrderPartId
            );

    }
    catch(error){

        duplicateError =
            true;


        Logger.log(
            "EXPECTED DUPLICATE ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "DUPLICATE REVERSAL DITOLAK:"
    );

    Logger.log(
        duplicateError
    );


    if(
        !duplicateError
    ){

        throw new Error(
            "Reversal kedua seharusnya ditolak."
        );

    }


    /**
     * ========================================
     * FINAL
     * ========================================
     */

    Logger.log(
        "================================"
    );

    Logger.log(
        "STOCK LEDGER REVERSAL TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Reversal Without Stock Out
 * ============================================
 */

function testStockLedgerReversalWithoutStockOut(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "STOCK LEDGER REVERSAL WITHOUT STOCK OUT TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Reversal Without Stock Out Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER PART
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Reversal Without Stock Out Test Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "WORK ORDER PART ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     *
     * Sengaja TIDAK melakukan
     * consumeStockBatch().
     */

    const statusResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            statusResult
        )
    );


    /**
     * ========================================
     * 4. CEK STOCK SEBELUM
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SEBELUM REVERSAL:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 5. CEK LEDGER
     * ========================================
     */

    const ledgersBefore =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    Logger.log(
        "JUMLAH LEDGER:"
    );

    Logger.log(
        ledgersBefore.length
    );


    /**
     * ========================================
     * 6. COBA REVERSAL
     * ========================================
     */

    let errorDetected =
        false;


    try{

        StockLedgerReversalService
            .reverseByWorkOrderPartId(
                workOrderPartId
            );

        Logger.log(
            "ERROR: REVERSAL TANPA STOCK OUT SEHARUSNYA DITOLAK"
        );

    }
    catch(error){

        errorDetected =
            true;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * 7. CEK STOCK SETELAH
     * ========================================
     */

    const stockAfter =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH REVERSAL:"
    );

    Logger.log(
        stockAfter
    );


    /**
     * ========================================
     * 8. CEK LEDGER SETELAH
     * ========================================
     */

    const ledgersAfter =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    Logger.log(
        "JUMLAH LEDGER SETELAH:"
    );

    Logger.log(
        ledgersAfter.length
    );


    /**
     * ========================================
     * 9. VALIDASI
     * ========================================
     */

    const stockUnchanged =
        stockAfter ===
        stockBefore;


    const ledgerStillEmpty =
        ledgersAfter.length ===
        0;


    Logger.log(
        "ERROR TERDETEKSI:"
    );

    Logger.log(
        errorDetected
    );


    Logger.log(
        "STOCK TIDAK BERUBAH:"
    );

    Logger.log(
        stockUnchanged
    );


    Logger.log(
        "TIDAK ADA LEDGER:"
    );

    Logger.log(
        ledgerStillEmpty
    );


    /**
     * ========================================
     * 10. FINAL ASSERT
     * ========================================
     */

    if(
        !errorDetected
    ){

        throw new Error(
            "Reversal tanpa Stock Out seharusnya ditolak."
        );

    }


    if(
        !stockUnchanged
    ){

        throw new Error(
            "Stock berubah padahal reversal ditolak."
        );

    }


    if(
        !ledgerStillEmpty
    ){

        throw new Error(
            "Ledger tercipta padahal reversal ditolak."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "STOCK LEDGER REVERSAL WITHOUT STOCK OUT TEST PASS"
    );

    Logger.log(
        "================================"
    );

}