/**
 * =====================================================
 * SAKTI MOTO WMS
 * Running Number
 * =====================================================
 */

/**
 * Generate Running Number
 * Contoh:
 * WO2608010001
 * INV2608010001
 * PO2608010001
 */
function generateRunningNumber_(prefix) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sh = ss.getSheetByName("99_RunningNumber");

  // Jika sheet belum ada, buat otomatis
  if (!sh) {

    sh = ss.insertSheet("99_RunningNumber");

    sh.getRange(1,1,1,3).setValues([
      ["Prefix","Tanggal","LastNumber"]
    ]);

  }

  const today = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyMMdd"
  );

  const data = sh.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    if (
      data[i][0] == prefix &&
      data[i][1] == today
    ) {

      const next = Number(data[i][2]) + 1;

      sh.getRange(i + 1, 3).setValue(next);

      return (
        prefix +
        today +
        ("0000" + next).slice(-4)
      );

    }

  }

  sh.appendRow([
    prefix,
    today,
    1
  ]);

  return prefix + today + "0001";

}