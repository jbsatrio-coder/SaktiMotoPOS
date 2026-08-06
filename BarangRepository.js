/**
 * ============================================
 * Barang Repository
 * ============================================
 */

const BarangRepository = {

  sheet() {
    return getSheet_(CONFIG.SHEET.BARANG);
  },

  /**
 * Membaca nilai sebuah cell.
 */
getCellValue(row, column) {

    return this.sheet()

        .getRange(
            row,
            column
        )

        .getValue();

},

/**
 * Mengubah nilai sebuah cell.
 */
setCellValue(row, column, value) {

    this.sheet()

        .getRange(
            row,
            column
        )

        .setValue(value);

},


  getAll() {

    const sh = this.sheet();

    if (sh.getLastRow() < 2) return [];

    return sh
      .getDataRange()
      .getValues()
      .slice(1);

  },

  search(keyword) {

    keyword = String(keyword || "").toLowerCase().trim();

    const data = this.getAll();

    return data.filter(r => {

      return (

        String(r[COL_BARANG.NAMA]).toLowerCase().includes(keyword) ||

        String(r[COL_BARANG.NAMAPENDEK]).toLowerCase().includes(keyword) ||

        String(r[COL_BARANG.KATAKUNCI]).toLowerCase().includes(keyword) ||

        String(r[COL_BARANG.KODE]).toLowerCase().includes(keyword) ||

        String(r[COL_BARANG.BARCODE]).includes(keyword)

      );

    });

  },

  getByKode(kode) {

    return this.getAll().find(r =>

      String(r[COL_BARANG.KODE]).trim() === String(kode).trim()

    ) || null;

  },

  /**
   * Cari nomor baris berdasarkan Kode Barang
   * Return:
   * 0 = tidak ditemukan
   * >=2 = nomor baris di sheet
   */
  findRowByKode(kodeBarang) {

    const sheet = this.sheet();

    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {

      return 0;

    }

    const kodeList = sheet
      .getRange(2, 3, lastRow - 1, 1) // Kolom C = Kode Barang
      .getValues();

    for (let i = 0; i < kodeList.length; i++) {

      if (

        String(kodeList[i][0]).trim() ===

        String(kodeBarang).trim()

      ) {

        return i + 2;

      }

    }

    return 0;

  },

  /**
 * Pastikan barang ada.
 * Return nomor baris.
 */
requireRow(kodeBarang) {

  const row = this.findRowByKode(
    kodeBarang
  );

  if (row === 0) {

    throw new Error(
      "Barang tidak ditemukan : " +
      kodeBarang
    );

  }

  return row;

},

  /**
 * Kurangi stok barang
 */
updateStock(kodeBarang, qtyKeluar) {

  const row =
    this.requireRow(kodeBarang);

  const sheet = this.sheet();

  const currentStock = Number(
    sheet.getRange(
      row,
      SHEET_COL_BARANG.STOK
    ).getValue()
  ) || 0;

  const newStock =
    currentStock - Number(qtyKeluar);

  sheet.getRange(
    row,
    SHEET_COL_BARANG.STOK
  ).setValue(newStock);

  Logger.log(
    "[STOCK] " +
    kodeBarang +
    " : " +
    currentStock +
    " -> " +
    newStock
  );

  return newStock;

},

/**
 * Update stok absolut
 */
updateStockAbsolute(kodeBarang, newStock) {

  const row =
    this.requireRow(kodeBarang);

  const sheet = this.sheet();

  const currentStock = Number(

    sheet.getRange(
      row,
      SHEET_COL_BARANG.STOK
    ).getValue()

  ) || 0;

  this.setCellValue(

    row,

    SHEET_COL_BARANG.STOK,

    newStock

);

  Logger.log(

    "[STOCK ABSOLUTE] " +

    kodeBarang +

    " : " +

    currentStock +

    " -> " +

    newStock

  );

  return newStock;

},
getStock(kodeBarang) {

  const row =
    this.requireRow(kodeBarang);

  return Number(

    this.getCellValue(

        row,

        SHEET_COL_BARANG.STOK

    )

) || 0;

},

};


/**
 * ============================================
 * TEST
 * ============================================
 */

function testFindRowByKode() {

  const row =

    BarangRepository.findRowByKode("BRG000114");

  Logger.log(row);

}

function testUpdateStock(){

  const stokBaru =
    BarangRepository.updateStock(
      "BRG000114",
      1
    );

  Logger.log(stokBaru);

}

function testGetStock(){

  const stok =
    BarangRepository.getStock(
      "BRG000114"
    );

  Logger.log(stok);

}

function testUpdateStockAbsolute(){

  const stokBaru =
      BarangRepository.updateStockAbsolute(
          "BRG000114",
          23
      );

  Logger.log(stokBaru);

}