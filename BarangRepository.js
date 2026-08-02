/**
 * ============================================
 * Barang Repository
 * ============================================
 */

const BarangRepository = {

  sheet() {
    return getSheet_(CONFIG.SHEET.BARANG);
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

  Logger.log("Jumlah data = " + data.length);

  Logger.log("Baris pertama = " + JSON.stringify(data[0]));

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
      r[COL_BARANG.KODE] == kode
    ) || null;

  }

};