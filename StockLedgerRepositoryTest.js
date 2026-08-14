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

function testStockLedgerRepositoryFindByReference(){

    const result =
        StockLedgerRepository.findByReference(
            "WOP2608100001"
        );


    Logger.log(
        "LEDGER BY WORK ORDER PART:"
    );


    Logger.log(
        JSON.stringify(
            result
        )
    );

}

function testStockLedgerRepositoryBarangIdMapping(){

    const testId =
        "TEST_REPO_BARANG_ID";


    StockLedgerRepository.addHistory({

        id :
            testId,

        tanggal :
            new Date(),

        jam :
            new Date(),

        barangId :
            "BRG000001",

        namaBarang :
            "TEST BARANG ID",

        jenisMutasi :
            "TEST",

        referensi :
            "TEST_REPO_MAPPING",

        stokAwal :
            100,

        qtyMasuk :
            0,

        qtyKeluar :
            1,

        stokAkhir :
            99,

        keterangan :
            "Repository Barang ID Mapping Test",

        admin :
            "Developer",

        createdAt :
            new Date()

    });


    Logger.log(
        "REPOSITORY TEST SELESAI:"
    );

    Logger.log(
        testId
    );

}

function testStockLedgerRepositoryBarangIdReadBack(){

    const testId =
        "TEST_REPO_BARANG_ID";


    const sh =
        StockLedgerRepository.sheet();


    const lastRow =
        sh.getLastRow();


    if(lastRow < 2){

        throw new Error(
            "Stock Ledger belum memiliki data."
        );

    }


    const data =
        sh.getRange(
            2,
            1,
            lastRow - 1,
            COL_STOK.CREATEDAT + 1
        ).getValues();


    let found = false;


    for(
        let i = 0;
        i < data.length;
        i++
    ){

        const row =
            data[i];


        const id =
            String(
                row[
                    COL_STOK.ID
                ]
            ).trim();


        if(id === testId){

            found = true;


            Logger.log(
                "TEST ROW:"
            );

            Logger.log(
                JSON.stringify(
                    row
                )
            );


            Logger.log(
                "ID:"
            );

            Logger.log(
                JSON.stringify(
                    row[
                        COL_STOK.ID
                    ]
                )
            );


            Logger.log(
                "BARANG_ID:"
            );

            Logger.log(
                JSON.stringify(
                    row[
                        COL_STOK.BARANG_ID
                    ]
                )
            );


            Logger.log(
                "BARANG_ID TYPE:"
            );

            Logger.log(
                typeof row[
                    COL_STOK.BARANG_ID
                ]
            );


            Logger.log(
                "NAMA BARANG:"
            );

            Logger.log(
                JSON.stringify(
                    row[
                        COL_STOK.NAMABARANG
                    ]
                )
            );


            break;

        }

    }


    Logger.log(
        "FOUND:"
    );

    Logger.log(
        found
    );


    if(!found){

        throw new Error(
            "TEST_REPO_BARANG_ID tidak ditemukan."
        );

    }

}

function testStockLedgerColumnMapRuntime(){

    Logger.log(
        "COL_STOK OBJECT:"
    );

    Logger.log(
        JSON.stringify(
            COL_STOK
        )
    );


    Logger.log(
        "COL_STOK.BARANG_ID:"
    );

    Logger.log(
        COL_STOK.BARANG_ID
    );


    Logger.log(
        "COL_STOK.BARANG_ID TYPE:"
    );

    Logger.log(
        typeof COL_STOK.BARANG_ID
    );


    Logger.log(
        "INDEX LITERAL 3:"
    );

    Logger.log(
        3
    );

}

/**
 * ============================================
 * TEST
 * Stock Ledger - Find By Referensi
 * ============================================
 */

function testFindStockLedgerByReferensi(){

  Logger.log(
    "================================"
  );

  Logger.log(
    "STOCK LEDGER FIND BY REFERENSI TEST"
  );

  Logger.log(
    "================================"
  );


  const referensi =
    "WOP2608100002";


  const result =
    StockLedgerRepository.findByReferensi(
      referensi
    );


  Logger.log(
    "REFERENSI:"
  );

  Logger.log(
    referensi
  );


  Logger.log(
    "JUMLAH LEDGER:"
  );

  Logger.log(
    result.length
  );


  Logger.log(
    "DATA LEDGER:"
  );

  Logger.log(
    JSON.stringify(
      result
    )
  );


  Logger.log(
    "================================"
  );

  Logger.log(
    "FIND BY REFERENSI TEST SELESAI"
  );

  Logger.log(
    "================================"
  );

}

function testStockLedgerFindByReference() {

  const reference =
    "MASUKKAN_WOP_ID_TEST_DI_SINI";

  const result =
    StockLedgerRepository.findByReference(
      reference
    );

  Logger.log(
    JSON.stringify(
      result
    )
  );

}