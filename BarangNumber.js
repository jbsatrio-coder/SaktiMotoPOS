/**
 * ============================================
 * Generator Kode Barang
 * Format : BRG000001
 * ============================================
 */

function generateBarangId_() {

  const lock =
    LockService.getScriptLock();

  lock.waitLock(30000);

  try {

    const sheet =
      getSheet_(CONFIG.SHEET.BARANG);

    const lastRow =
      sheet.getLastRow();

    let maxNumber = 0;

    if (lastRow >= 2) {

      const ids =
        sheet
          .getRange(
            2,
            COL_BARANG.ID + 1,
            lastRow - 1,
            1
          )
          .getValues();

      ids.forEach(function(row) {

        const value =
          String(row[0] || "").trim();

        const match =
          value.match(/^BRG(\d{6})$/);

        if (match) {

          const number =
            Number(match[1]);

          if (number > maxNumber) {
            maxNumber = number;
          }

        }

      });

    }

    const nextNumber =
      maxNumber + 1;

    return (
      "BRG" +
      String(nextNumber)
        .padStart(6, "0")
    );

  } finally {

    lock.releaseLock();

  }

}

function testGenerateBarangId() {

  const result =
    generateBarangId_();

  Logger.log(
    "[GENERATE BARANG ID] " +
    result
  );

}