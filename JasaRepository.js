/**
 * ============================================
 * Jasa Repository
 * ============================================
 */

const JasaRepository = {

  sheet() {
    return getSheet_(CONFIG.SHEET.MASTER_JASA);
  },

  getAll() {

    const sh = this.sheet();

    if (sh.getLastRow() < 2) return [];

    return sh
      .getDataRange()
      .getDisplayValues()
      .slice(1);

  },

  search(keyword) {

  keyword = String(keyword || "").toLowerCase().trim();

  const hasil = this.getAll().filter(r => {

    return (

      String(r[COL_JASA.NAMA]).toLowerCase().includes(keyword)

      ||

      String(r[COL_JASA.KODE]).toLowerCase().includes(keyword)

      ||

      String(r[COL_JASA.KATEGORI]).toLowerCase().includes(keyword)

    );

  });

  Logger.log("=== HASIL JASA ===");
  Logger.log(JSON.stringify(hasil));

  return hasil;

},

  getByKode(kode) {

    return this.getAll().find(r =>

      r[COL_JASA.KODE] == kode

    ) || null;

  }

};