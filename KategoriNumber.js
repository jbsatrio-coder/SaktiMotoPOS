/**
 * ============================================
 * Generator Kode Kategori
 * Format : KTG001
 * ============================================
 */

function generateKategoriId_() {

  const lock =
    LockService.getScriptLock();

  lock.waitLock(30000);

  try {

    const sheet =
      getSheet_(CONFIG.SHEET.KATEGORI);

    const lastRow =
      sheet.getLastRow();

    let maxNumber = 0;

    if (lastRow >= 2) {

      const ids =
        sheet
          .getRange(
            2,
            1,
            lastRow - 1,
            1
          )
          .getValues();

      ids.forEach(function(row) {

        const value =
          String(row[0] || "").trim();

        const match =
          value.match(/^KTG(\d{3})$/);

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
      "KTG" +
      String(nextNumber)
        .padStart(3, "0")
    );

  } finally {

    lock.releaseLock();

  }

}


/**
 * ============================================
 * TEST GENERATOR KATEGORI
 * ============================================
 */

function testGenerateKategoriId() {

  const result =
    generateKategoriId_();

  Logger.log(
    "[GENERATE KATEGORI ID] " +
    result
  );

}
