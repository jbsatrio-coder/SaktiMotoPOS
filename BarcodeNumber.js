/**
 * ============================================
 * SAKTI MOTO POS
 * Barcode Number Generator
 * Version : 1.0.0
 * ============================================
 *
 * Format barcode internal:
 *
 * 100000001
 * 100000002
 * 100000003
 * ...
 *
 * Barcode internal bersifat independen
 * dari KodeBarang / ID Barang.
 * ============================================
 */


/**
 * ============================================
 * GENERATE BARCODE INTERNAL
 * ============================================
 */
function generateBarcode_() {

  const lock =
    LockService.getScriptLock();

  lock.waitLock(30000);

  try {

    const sheet =
      getSheet_(
        CONFIG.SHEET.BARANG
      );


    // ==========================================
    // AMBIL SEMUA DATA MASTER BARANG
    // ==========================================

    const lastRow =
      sheet.getLastRow();

    if (lastRow < 2) {

      return "100000001";

    }


    const data =
      sheet
        .getRange(
          2,
          1,
          lastRow - 1,
          COL_BARANG.TOTAL
        )
        .getValues();


    // ==========================================
    // CARI BARCODE NUMERIK TERBESAR
    // ==========================================

    let maxBarcode = 100000000;


    data.forEach(function(row) {

      const value =
        String(
          row[
            COL_BARANG.BARCODE
          ] || ""
        ).trim();


      // Hanya barcode numerik 9 digit
      if (
        /^\d{9}$/.test(value)
      ) {

        const number =
          Number(value);


        if (
          number > maxBarcode
        ) {

          maxBarcode =
            number;

        }

      }

    });


    // ==========================================
    // GENERATE BARCODE BERIKUTNYA
    // ==========================================

    const nextBarcode =
      maxBarcode + 1;


    // ==========================================
    // BATAS MAKSIMUM
    // ==========================================

    if (
      nextBarcode > 999999999
    ) {

      throw new Error(
        "Barcode internal sudah mencapai batas maksimum 999999999."
      );

    }


    return String(
      nextBarcode
    ).padStart(
      9,
      "0"
    );


  } finally {

    lock.releaseLock();

  }

}


/**
 * ============================================
 * TEST GENERATOR BARCODE
 * ============================================
 */
function testGenerateBarcode() {

  const result =
    generateBarcode_();

  Logger.log(
    "[GENERATE BARCODE] " +
    result
  );

}