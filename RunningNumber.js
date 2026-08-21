/**
 * =====================================================
 * SAKTI MOTO WMS
 * Running Number
 * =====================================================
 *
 * Generate ID / nomor dokumen secara terpusat.
 *
 * Format:
 * PREFIX + YYMMDD + 4 digit sequence
 *
 * Contoh:
 * CUS2608160001
 * VEH2608160001
 * WO2608160001
 * WOJ2608160001
 * WOP2608160001
 *
 * =====================================================
 */

function generateRunningNumberNoLock_(prefix) {

  if (!prefix) {

    throw new Error(
      "Prefix running number wajib diisi."
    );

  }

    const ss =
      SpreadsheetApp
        .getActiveSpreadsheet();

    let sh =
      ss.getSheetByName(
        CONFIG.SHEET.RUNNING_NUMBER
      );


    // ============================================
    // BUAT SHEET JIKA BELUM ADA
    // ============================================

    if (!sh) {

      sh =
        ss.insertSheet(
          CONFIG.SHEET.RUNNING_NUMBER
        );

      sh
        .getRange(1, 1, 1, 3)
        .setValues([
          [
            "Prefix",
            "Tanggal",
            "LastNumber"
          ]
        ]);

    }


    // ============================================
    // TANGGAL RUNNING NUMBER
    // ============================================

    const today =
      Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        "yyMMdd"
      );


    // ============================================
    // CARI PREFIX + TANGGAL
    // ============================================

    const data =
      sh
        .getDataRange()
        .getValues();


    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      if (
        String(data[i][0]).trim() ===
          String(prefix).trim()
        &&
        String(data[i][1]).trim() ===
          today
      ) {

        const next =
          Number(data[i][2] || 0) + 1;


        sh
          .getRange(
            i + 1,
            3
          )
          .setValue(next);


        return (
          prefix +
          today +
          ("0000" + next)
            .slice(-4)
        );

      }

    }


    // ============================================
    // PREFIX + TANGGAL BELUM ADA
    // ============================================

    sh.appendRow([
      prefix,
      today,
      1
    ]);


    return (
      prefix +
      today +
      "0001"
    );


}

function generateRunningNumber_(prefix) {

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    return generateRunningNumberNoLock_(prefix);
  } finally {
    lock.releaseLock();
  }

}
