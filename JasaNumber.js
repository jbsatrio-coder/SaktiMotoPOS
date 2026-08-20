/**
 * ============================================
 * Generator Kode Jasa
 * Format : JAS000001
 * ============================================
 */

function generateJasaId_() {

  const lock =
    LockService.getScriptLock();

  lock.waitLock(30000);

  try {

    const sheet =
      getSheet_(CONFIG.SHEET.JASA);

    const lastRow =
      sheet.getLastRow();

    let maxNumber = 0;

    if (lastRow >= 2) {

      const ids =
        sheet
          .getRange(
            2,
            COL_JASA.ID + 1,
            lastRow - 1,
            1
          )
          .getValues();

      ids.forEach(function(row) {

        const value =
          String(row[0] || "").trim();

        const match =
          value.match(/^JAS(\d{6})$/);

        if (match) {

          const number =
            Number(match[1]);

          if (number > maxNumber) {

            maxNumber =
              number;

          }

        }

      });

    }

    const nextNumber =
      maxNumber + 1;

    return (
      "JAS" +
      String(nextNumber)
        .padStart(6, "0")
    );

  } finally {

    lock.releaseLock();

  }

}


/**
 * ============================================
 * TEST GENERATOR JASA
 * ============================================
 */

function testGenerateJasaId() {

  const result =
    generateJasaId_();

  Logger.log(
    "[GENERATE JASA ID] " +
    result
  );

}