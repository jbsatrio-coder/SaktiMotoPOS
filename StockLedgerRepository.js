/**
 * ============================================
 * Stock Ledger Repository
 * SAKTI MOTO POS
 * Version : 2.0.0
 * ============================================
 *
 * 14_Stok
 *
 * A = IDMutasi
 * B = Tanggal
 * C = Jam
 * D = Barang ID
 * E = NamaBarang
 * F = JenisMutasi
 * G = Referensi
 * H = StokAwal
 * I = QtyMasuk
 * J = QtyKeluar
 * K = StokAkhir
 * L = Keterangan
 * M = Admin
 * N = CreatedAt
 *
 * ============================================
 */

const StockLedgerRepository = {

  /**
   * ============================================
   * SHEET
   * ============================================
   */
  sheet() {
    return getSheet_(CONFIG.SHEET.STOK);
  },


  /**
   * ============================================
   * ADD HISTORY
   * ============================================
   */
  addHistory(data) {

    if (!data) {
      throw new Error(
        "Data Stock Ledger wajib diisi."
      );
    }

    if (!data.id) {
      throw new Error(
        "ID Mutasi wajib diisi."
      );
    }

    if (!data.barangId) {
      throw new Error(
        "Barang ID wajib diisi."
      );
    }

    const sh = this.sheet();

    sh.appendRow([

      // A - IDMutasi
      data.id,

      // B - Tanggal
      data.tanggal,

      // C - Jam
      data.jam,

      // D - Barang ID
      data.barangId,

      // E - NamaBarang
      data.namaBarang,

      // F - JenisMutasi
      data.jenisMutasi,

      // G - Referensi
      data.referensi,

      // H - StokAwal
      data.stokAwal,

      // I - QtyMasuk
      data.qtyMasuk,

      // J - QtyKeluar
      data.qtyKeluar,

      // K - StokAkhir
      data.stokAkhir,

      // L - Keterangan
      data.keterangan,

      // M - Admin
      data.admin,

      // N - CreatedAt
      data.createdAt

    ]);

  },


  /**
   * ============================================
   * FIND BY REFERENCE
   * ============================================
   *
   * Mencari seluruh ledger berdasarkan
   * WorkOrderPart ID / Referensi.
   *
   * Return:
   * array of ledger rows
   *
   * ============================================
   */
  findByReference(reference) {

    if (!reference) {
      return [];
    }

    const sh = this.sheet();

    if (sh.getLastRow() < 2) {
      return [];
    }

    const data =
      sh
        .getRange(
          2,
          1,
          sh.getLastRow() - 1,
          14
        )
        .getValues();

    const target =
      String(reference)
        .trim();

    return data.filter(row => {

      return (
        String(
          row[COL_STOK.REFERENSI]
        ).trim()
        ===
        target
      );

    });

  },


  /**
   * ============================================
   * FIND BY REFERENSI
   * ============================================
   *
   * Alias untuk kompatibilitas dengan
   * StockLedgerReversalService versi sekarang.
   *
   * ============================================
   */
  findByReferensi(reference) {

    return this.findByReference(
      reference
    );

  }

};