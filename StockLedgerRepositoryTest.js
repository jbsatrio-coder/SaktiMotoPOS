function testAddStockHistoryV2(){

    StockLedgerRepository.addHistory({

        id: "TEST002",

        tanggal: "2026-08-10",

        jam: "02:30",

        barangId: "BRG000001",

        namaBarang: "Kampas Rem Mio M3",

        jenisMutasi: "SERVICE",

        referensi: "WO2608090002",

        stokAwal: 111,

        qtyMasuk: 0,

        qtyKeluar: 2,

        stokAkhir: 109,

        keterangan: "Test Stock Ledger V2",

        admin: "Developer",

        createdAt: new Date()

    });

}

function testStockLedgerReadBackV2(){

    const sh =
        StockLedgerRepository.sheet();

    const lastRow =
        sh.getLastRow();

    if(lastRow < 2){

        Logger.log(
            "Tidak ada data Stock Ledger."
        );

        return;

    }

    const row =
        sh.getRange(
            lastRow,
            1,
            1,
            COL_STOK.CREATEDAT + 1
        ).getValues()[0];

    Logger.log(
        "STOCK LEDGER READ BACK:"
    );

    Logger.log(
        JSON.stringify(row)
    );

}