/**
 * ============================================
 * JASA CLEANUP
 * Version : 1.0.0
 * ============================================
 *
 * Menghapus dummy JAS000072 - JAS000988
 * yang hanya berisi ID.
 *
 * Sebelum cleanup:
 * - Backup MasterJasa dibuat otomatis
 * - Referensi eksternal sudah diaudit
 *
 * ============================================
 */

function cleanupJasaDummy() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const masterJasa =
    ss.getSheetByName(
      CONFIG.SHEET.JASA
    );

  if (!masterJasa) {

    throw new Error(
      "Sheet MasterJasa tidak ditemukan."
    );

  }


  const START = 72;
  const END = 988;


  // ==========================================
  // 1. BACKUP
  // ==========================================

  const timezone =
    Session.getScriptTimeZone() ||
    "Asia/Jakarta";

  const timestamp =
    Utilities.formatDate(
      new Date(),
      timezone,
      "yyyyMMdd_HHmmss"
    );

  const backupName =
    CONFIG.SHEET.JASA +
    "_BACKUP_" +
    timestamp;


  // Hindari duplicate nama backup
  let finalBackupName =
    backupName;

  let counter = 1;

  while (
    ss.getSheetByName(finalBackupName)
  ) {

    finalBackupName =
      backupName +
      "_" +
      counter;

    counter++;

  }


  const backup =
    masterJasa.copyTo(ss);

  backup.setName(
    finalBackupName
  );


  Logger.log(
    "[BACKUP] " +
    finalBackupName
  );


  // ==========================================
  // 2. CARI ROW DUMMY
  // ==========================================

  const lastRow =
    masterJasa.getLastRow();

  const lastColumn =
    masterJasa.getLastColumn();

  const rowsToDelete = [];


  if (lastRow >= 2) {

    const data =
      masterJasa
        .getRange(
          2,
          1,
          lastRow - 1,
          lastColumn
        )
        .getDisplayValues();


    data.forEach(function(row, index) {

      const id =
        String(
          row[0] || ""
        ).trim();


      const match =
        id.match(/^JAS(\d{6})$/);


      if (!match) {
        return;
      }


      const number =
        Number(match[1]);


      if (
        number < START ||
        number > END
      ) {

        return;

      }


      // Pastikan kolom selain ID kosong
      const hasOtherData =
        row
          .slice(1)
          .some(function(value) {

            return String(
              value || ""
            ).trim() !== "";

          });


      if (!hasOtherData) {

        rowsToDelete.push(
          index + 2
        );

      }

    });

  }


  // ==========================================
  // 3. VALIDASI
  // ==========================================

  Logger.log(
    "[CLEANUP] Row dummy ditemukan: " +
    rowsToDelete.length
  );


  if (
    rowsToDelete.length === 0
  ) {

    Logger.log(
      "[CLEANUP] Tidak ada dummy yang perlu dihapus."
    );

    return;

  }


  // ==========================================
  // 4. HAPUS DARI BAWAH
  // ==========================================
  //
  // Penting:
  // Hapus dari row paling bawah supaya
  // nomor row tidak bergeser.
  //

  rowsToDelete
    .sort(function(a, b) {
      return b - a;
    });


  rowsToDelete.forEach(function(row) {

    masterJasa.deleteRow(row);

  });


  // ==========================================
  // 5. CARI ID VALID TERAKHIR
  // ==========================================

  const newLastRow =
    masterJasa.getLastRow();

  let lastValidNumber = 0;
  let lastValidId = "";


  if (newLastRow >= 2) {

    const ids =
      masterJasa
        .getRange(
          2,
          1,
          newLastRow - 1,
          1
        )
        .getDisplayValues();


    ids.forEach(function(row) {

      const id =
        String(
          row[0] || ""
        ).trim();


      const match =
        id.match(/^JAS(\d{6})$/);


      if (!match) {
        return;
      }


      const number =
        Number(match[1]);


      if (
        number > lastValidNumber
      ) {

        lastValidNumber =
          number;

        lastValidId =
          id;

      }

    });

  }


  const nextId =
    "JAS" +
    String(
      lastValidNumber + 1
    ).padStart(6, "0");


  // ==========================================
  // 6. LOG
  // ==========================================

  Logger.log(
    "================================"
  );

  Logger.log(
    "===== JASA CLEANUP SELESAI ====="
  );

  Logger.log(
    "Row dihapus : " +
    rowsToDelete.length
  );

  Logger.log(
    "Backup      : " +
    finalBackupName
  );

  Logger.log(
    "Last ID     : " +
    (
      lastValidId ||
      "-"
    )
  );

  Logger.log(
    "Next ID     : " +
    nextId
  );

  Logger.log(
    "Last Row    : " +
    newLastRow
  );

  Logger.log(
    "================================"
  );

}

/**
 * ============================================
 * CLEANUP TEST JASA
 * ============================================
 *
 * Menghapus hanya data test:
 * JAS000072 | TEST JASA CLEAN
 *
 * Tidak menghapus data lain.
 * ============================================
 */

function cleanupTestJasaClean() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      CONFIG.SHEET.JASA
    );

  if (!sheet) {

    throw new Error(
      "Sheet " + CONFIG.SHEET.JASA + " tidak ditemukan."
    );

  }


  const lastRow =
    sheet.getLastRow();

  if (lastRow < 2) {

    throw new Error(
      "MasterJasa tidak memiliki data."
    );

  }


  const data =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        sheet.getLastColumn()
      )
      .getDisplayValues();


  let targetRow = 0;


  for (
    let i = 0;
    i < data.length;
    i++
  ) {

    const id =
      String(
        data[i][0] || ""
      ).trim();

    const nama =
      String(
        data[i][1] || ""
      ).trim();


    if (
      id === "JAS000072" &&
      nama === "TEST JASA CLEAN"
    ) {

      targetRow =
        i + 2;

      break;

    }

  }


  if (targetRow === 0) {

    Logger.log(
      "TEST JASA CLEAN tidak ditemukan."
    );

    return;

  }


  sheet.deleteRow(
    targetRow
  );


  Logger.log(
    "================================"
  );

  Logger.log(
    "===== TEST JASA CLEANUP ====="
  );

  Logger.log(
    "Deleted Row : " +
    targetRow
  );

  Logger.log(
    "Deleted ID  : JAS000072"
  );

  Logger.log(
    "Status      : SUCCESS"
  );

  Logger.log(
    "================================"
  );

}
