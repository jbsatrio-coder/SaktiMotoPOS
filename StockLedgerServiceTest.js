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