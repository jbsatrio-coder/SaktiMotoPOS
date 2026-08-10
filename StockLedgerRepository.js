/**
 * ============================================
 * Stock Repository
 * SAKTI MOTO POS
 * ============================================
 */

const StockLedgerRepository = {

  sheet() {
    return getSheet_(CONFIG.SHEET.STOK);
  },

  /**
   * Menambahkan satu record mutasi stok
   */
  addHistory(data) {

    const sh = this.sheet();

    sh.appendRow([
      data.id,
      data.tanggal,
      data.jam,
      data.barangId,
      data.namaBarang,
      data.jenisMutasi,
      data.referensi,
      data.stokAwal,
      data.qtyMasuk,
      data.qtyKeluar,
      data.stokAkhir,
      data.keterangan,
      data.admin,
      data.createdAt
    ]);

  },

  /**
 * ============================================
 * Mencari Stock Ledger berdasarkan Referensi
 * ============================================
 */
findByReference(referensi){

    if(!referensi){

        return [];

    }


    const sh =
        this.sheet();


    if(sh.getLastRow() < 2){

        return [];

    }


    const data =
        sh.getRange(
            2,
            1,
            sh.getLastRow() - 1,
            COL_STOK.CREATEDAT + 1
        ).getValues();


    return data.filter(row =>

        String(
            row[
                COL_STOK.REFERENSI
            ]
        ).trim()

        ===

        String(
            referensi
        ).trim()

    );

},

};

function testAddStockHistory(){

  StockLedgerRepository.addHistory({

    id: "TEST001",

    tanggal: "2026-08-04",

    jam: "22:45",

    kodeBarang: "BRG000114",

    namaBarang: "TEST BARANG",

    jenisMutasi: "TEST",

    referensi: "TEST",

    stokAwal: 30,

    qtyMasuk: 0,

    qtyKeluar: 1,

    stokAkhir: 29,

    keterangan: "Unit Test",

    admin: "Developer",

    createdAt: new Date()

  });

}