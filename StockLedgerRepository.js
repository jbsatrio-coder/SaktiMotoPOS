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
findByReferensi(referensi){

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


    return data.filter(
        row =>

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

