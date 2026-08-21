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


    /**
     * ============================================
     * COMPATIBILITY
     * ============================================
     *
     * InventoryService:
     *   menggunakan kodeBarang
     *
     * StockLedgerService:
     *   menggunakan barangId
     *
     * Repository menerima keduanya.
     *
     * Prioritas:
     *   1. kodeBarang
     *   2. barangId
     * ============================================
     */

    const kodeBarang =
      String(
        data.kodeBarang ||
        data.barangId ||
        ""
      ).trim();


    if (!kodeBarang) {

      throw new Error(
        "Kode Barang / Barang ID wajib diisi."
      );

    }


    const sh =
      this.sheet();


    sh.appendRow([

      // A - IDMutasi
      data.id,


      // B - Tanggal
      data.tanggal,


      // C - Jam
      data.jam,


      // D - KodeBarang
      kodeBarang,


      // E - NamaBarang
      data.namaBarang || "",


      // F - JenisMutasi
      data.jenisMutasi || "",


      // G - Referensi
      data.referensi || "",


      // H - StokAwal
      data.stokAwal,


      // I - QtyMasuk
      data.qtyMasuk || 0,


      // J - QtyKeluar
      data.qtyKeluar || 0,


      // K - StokAkhir
      data.stokAkhir,


      // L - Keterangan
      data.keterangan || "",


      // M - Admin
      data.admin || "",


      // N - CreatedAt
      data.createdAt ||
        new Date()

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

  },


  /**
   * ============================================
   * FIND BY REFERENCE - FRESH READ
   * ============================================
   *
   * Dipakai hanya pada critical section inventory
   * yang perlu melihat append ledger dari execution
   * sebelumnya setelah ScriptLock diperoleh.
   *
   * Tidak mengubah kontrak findByReference() lama.
   * ============================================
   */
  findByReferensiFresh(reference) {

    if (!reference) {
      return [];
    }

    SpreadsheetApp.flush();

    const activeSpreadsheet =
      SpreadsheetApp.getActiveSpreadsheet();

    const ss =
      SpreadsheetApp.openById(
        activeSpreadsheet.getId()
      );

    const sh =
      ss.getSheetByName(
        CONFIG.SHEET.STOK
      );

    if (!sh || sh.getLastRow() < 2) {
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

  }

};
