function testStockLedgerServiceRecordOut(){

    const result =
        StockLedgerService.recordOut({

            id :
                "TEST003",

            barangId :
                "BRG000001",

            namaBarang :
                "Kampas Rem Mio M3",

            jenisMutasi :
                "SERVICE",

            referensi :
                "WO2608090002",

            stokAwal :
                111,

            qty :
                2,

            keterangan :
                "Test Stock Ledger Service",

            admin :
                "Developer"

        });


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testStockLedgerServiceInsufficientStock(){

    try{

        StockLedgerService.recordOut({

            id :
                "TEST004",

            barangId :
                "BRG000001",

            namaBarang :
                "Kampas Rem Mio M3",

            jenisMutasi :
                "SERVICE",

            referensi :
                "WO2608090002",

            stokAwal :
                1,

            qty :
                2,

            keterangan :
                "Test Insufficient Stock",

            admin :
                "Developer"

        });


        Logger.log(
            "FAIL : Stok tidak mencukupi tetapi transaksi berhasil."
        );

    }
    catch(error){

        Logger.log(
            "PASS : " +
            error.message
        );

    }

}

function testStockLedgerServiceRecordOutActualStock(){

    const result =
        StockLedgerService.recordOutActualStock({

            id :
                "TEST005",

            barangId :
                "BRG000001",

            qty :
                2,

            jenisMutasi :
                "SERVICE",

            referensi :
                "WO2608090002",

            keterangan :
                "Test Actual Stock",

            admin :
                "Developer"

        });


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testStockLedgerServiceActualStockReadBack(){

    const barang =
        BarangRepository.findById(
            "BRG000001"
        );

    const stokMasterBarang =
        Number(
            barang[
                COL_BARANG.STOK
            ]
        ) || 0;


    const sh =
        StockLedgerRepository.sheet();

    const lastRow =
        sh.getLastRow();


    const ledger =
        sh.getRange(
            lastRow,
            1,
            1,
            COL_STOK.CREATEDAT + 1
        ).getValues()[0];


    Logger.log(
        "STOK MASTER BARANG:"
    );

    Logger.log(
        stokMasterBarang
    );


    Logger.log(
        "STOCK LEDGER:"
    );

    Logger.log(
        JSON.stringify(
            ledger
        )
    );


    Logger.log(
        "STOK AKHIR LEDGER:"
    );

    Logger.log(
        ledger[
            COL_STOK.STOKAKHIR
        ]
    );

}

function testShowCOLSTOK(){

    Logger.log(
        JSON.stringify(
            COL_STOK,
            null,
            2
        )
    );

}

function testStockLedgerServiceValidateOut(){

    const result =
        StockLedgerService.validateOut({

            barangId :
                "BRG000001",

            qty :
                2

        });


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testStockLedgerServiceValidateOutInsufficient(){

    try{

        StockLedgerService.validateOut({

            barangId :
                "BRG000001",

            qty :
                110

        });


        Logger.log(
            "FAIL : Stok tidak mencukupi tetapi validasi berhasil."
        );

    }
    catch(error){

        Logger.log(
            "PASS : " +
            error.message
        );

    }

}

function testStockLedgerServiceValidateOutNoMutation(){

    const sh =
        StockLedgerRepository.sheet();

    const before =
        sh.getLastRow();


    StockLedgerService.validateOut({

        barangId :
            "BRG000001",

        qty :
            2

    });


    const after =
        sh.getLastRow();


    Logger.log(
        "LEDGER ROW BEFORE:"
    );

    Logger.log(
        before
    );


    Logger.log(
        "LEDGER ROW AFTER:"
    );

    Logger.log(
        after
    );


    Logger.log(
        "LEDGER TIDAK BERUBAH:"
    );

    Logger.log(
        before === after
    );

}

function testStockLedgerServiceValidateOutBatch(){

    const result =
        StockLedgerService.validateOutBatch([

            {
                barangId :
                    "BRG000001",

                qty :
                    2
            },

            {
                barangId :
                    "BRG000001",

                qty :
                    1
            }

        ]);


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testStockLedgerServiceValidateOutBatchInsufficient(){

    const result =
        StockLedgerService.validateOutBatch([

            {
                barangId :
                    "BRG000001",

                qty :
                    80
            },

            {
                barangId :
                    "BRG000001",

                qty :
                    40
            }

        ]);


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testStockLedgerServiceRecordOutBatch(){

    const result =
        StockLedgerService.recordOutBatch([

            {
                barangId :
                    "BRG000001",

                qty :
                    2,

                jenisMutasi :
                    "SERVICE",

                referensi :
                    "WO2608090002",

                keterangan :
                    "Test Batch Item 1",

                admin :
                    "Developer"
            },

            {
                barangId :
                    "BRG000002",

                qty :
                    1,

                jenisMutasi :
                    "SERVICE",

                referensi :
                    "WO2608090002",

                keterangan :
                    "Test Batch Item 2",

                admin :
                    "Developer"
            }

        ]);


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

    

}

function testStockLedgerServiceRecordOutBatchAtomicRollback(){

    /**
     * ========================================
     * SNAPSHOT KONDISI AWAL
     * ========================================
     */

    const barangId1 =
        "BRG000001";

    const barangId2 =
        "BRG000002";


    const stokAwal1 =
        BarangRepository.getStock(
            barangId1
        );


    const stokAwal2 =
        BarangRepository.getStock(
            barangId2
        );


    const sh =
        StockLedgerRepository.sheet();


    const ledgerRowsBefore =
        sh.getLastRow();


    Logger.log(
        "STOK AWAL BRG000001: " +
        stokAwal1
    );

    Logger.log(
        "STOK AWAL BRG000002: " +
        stokAwal2
    );

    Logger.log(
        "LEDGER ROW AWAL: " +
        ledgerRowsBefore
    );


    /**
     * ========================================
     * SIMPAN METHOD ASLI
     * ========================================
     */

    const originalAddHistory =
        StockLedgerRepository.addHistory;


    let addHistoryCallCount = 0;


    /**
     * ========================================
     * INJECT FAILURE
     * ========================================
     *
     * Call pertama  -> berhasil
     * Call kedua    -> sengaja gagal
     */

    StockLedgerRepository.addHistory =
        function(data){

            addHistoryCallCount++;


            Logger.log(
                "[TEST] addHistory call #" +
                addHistoryCallCount
            );


            if(
                addHistoryCallCount === 2
            ){

                throw new Error(
                    "TEST FAILURE: Stock Ledger sengaja gagal pada item kedua."
                );

            }


            return originalAddHistory.call(
                this,
                data
            );

        };


    /**
     * ========================================
     * JALANKAN TRANSAKSI
     * ========================================
     */

    let errorCaught = false;


    try{

        StockLedgerService.recordOutBatchAtomic([

            {

                barangId :
                    barangId1,

                qty :
                    1,

                jenisMutasi :
                    "TEST",

                referensi :
                    "TEST-ROLLBACK",

                keterangan :
                    "Atomic Rollback Test Item 1",

                admin :
                    "Developer"

            },

            {

                barangId :
                    barangId2,

                qty :
                    1,

                jenisMutasi :
                    "TEST",

                referensi :
                    "TEST-ROLLBACK",

                keterangan :
                    "Atomic Rollback Test Item 2",

                admin :
                    "Developer"

            }

        ]);

    }
    catch(error){

        errorCaught = true;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }
    finally{

        /**
         * ====================================
         * KEMBALIKAN METHOD ASLI
         * ====================================
         */

        StockLedgerRepository.addHistory =
            originalAddHistory;

    }


    /**
     * ========================================
     * READ BACK STOK
     * ========================================
     */

    const stokAkhir1 =
        BarangRepository.getStock(
            barangId1
        );


    const stokAkhir2 =
        BarangRepository.getStock(
            barangId2
        );


    /**
     * ========================================
     * READ BACK LEDGER
     * ========================================
     */

    const ledgerRowsAfter =
        sh.getLastRow();


    Logger.log(
        "STOK AKHIR BRG000001: " +
        stokAkhir1
    );

    Logger.log(
        "STOK AKHIR BRG000002: " +
        stokAkhir2
    );

    Logger.log(
        "LEDGER ROW AKHIR: " +
        ledgerRowsAfter
    );


    /**
     * ========================================
     * ASSERTION
     * ========================================
     */

    Logger.log(
        "ERROR TERDETEKSI:"
    );

    Logger.log(
        errorCaught
    );


    Logger.log(
        "STOK BRG000001 ROLLBACK:"
    );

    Logger.log(
        stokAkhir1 === stokAwal1
    );


    Logger.log(
        "STOK BRG000002 ROLLBACK:"
    );

    Logger.log(
        stokAkhir2 === stokAwal2
    );


    Logger.log(
        "JUMLAH LEDGER ROLLBACK:"
    );

    Logger.log(
        ledgerRowsAfter ===
        ledgerRowsBefore
    );

}

function testStockLedgerServiceValidateOutBatchClean(){

    const result =
        StockLedgerService.validateOutBatch([

            {
                barangId : "BRG000001",
                qty : 1,
                jenisMutasi : "SERVICE",
                referensi : "TEST_CLEAN_001"
            },

            {
                barangId : "BRG000002",
                qty : 1,
                jenisMutasi : "SERVICE",
                referensi : "TEST_CLEAN_002"
            }

        ]);


    Logger.log(
        "VALIDATE BATCH CLEAN:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );

}

function testRecoverIncorrectStockOutSTK2608100007(){

    const barangId =
        "BRG000001";

    const stockLedgerId =
        "STK2608100007";


    /**
     * ========================================
     * CEK STOK SAAT INI
     * ========================================
     */

    const stokSebelum =
        BarangRepository.getStock(
            barangId
        );


    Logger.log(
        "STOK SEBELUM RECOVERY:"
    );

    Logger.log(
        stokSebelum
    );


    /**
     * ========================================
     * RECOVERY STOK
     * ========================================
     */

    const stokRecovery =
        105;


    BarangRepository.updateStockAbsolute(

        barangId,

        stokRecovery

    );


    /**
     * ========================================
     * HAPUS LEDGER TEST YANG SALAH
     * ========================================
     */

    StockLedgerService.deleteLedgerById_(

        stockLedgerId

    );


    /**
     * ========================================
     * CEK HASIL
     * ========================================
     */

    const stokSesudah =
        BarangRepository.getStock(
            barangId
        );


    Logger.log(
        "STOK SESUDAH RECOVERY:"
    );

    Logger.log(
        stokSesudah
    );


    Logger.log(
        "RECOVERY SELESAI:"
    );

    Logger.log({

        barangId :
            barangId,

        stockLedgerId :
            stockLedgerId,

        stokSebelum :
            stokSebelum,

        stokSesudah :
            stokSesudah

    });

}