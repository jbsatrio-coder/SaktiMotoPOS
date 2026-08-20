/**
 * ============================================
 * JASA SCHEMA MIGRATION
 * Version : 1.0.0
 *
 * Migration:
 * Hapus kolom Kategori dari MasterJasa
 *
 * OLD:
 * A ID
 * B NamaJasa
 * C Kategori
 * D Harga
 * E Komisi
 * F EstimasiWaktu
 * G Status
 * H ModeKomisi
 * I Catatan
 * J CreatedAt
 * K UpdatedAt
 *
 * NEW:
 * A ID
 * B NamaJasa
 * C Harga
 * D Komisi
 * E EstimasiWaktu
 * F Status
 * G ModeKomisi
 * H Catatan
 * I CreatedAt
 * J UpdatedAt
 *
 * IMPORTANT:
 * ColumnMap.js BELUM diubah oleh script ini.
 * ============================================
 */

function migrateJasaSchemaRemoveKategori() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheetName =
    CONFIG.SHEET.JASA;

  const sheet =
    ss.getSheetByName(sheetName);

  if (!sheet) {

    throw new Error(
      "Sheet Jasa tidak ditemukan: " +
      sheetName
    );

  }


  // ==========================================
  // EXPECTED OLD HEADER
  // ==========================================

  const expectedOldHeader = [

    "ID",
    "NamaJasa",
    "Kategori",
    "Harga",
    "Komisi",
    "EstimasiWaktu",
    "Status",
    "ModeKomisi",
    "Catatan",
    "CreatedAt",
    "UpdatedAt"

  ];


  // ==========================================
  // READ CURRENT HEADER
  // ==========================================

  const lastColumn =
    sheet.getLastColumn();

  const header =
    sheet
      .getRange(
        1,
        1,
        1,
        lastColumn
      )
      .getValues()[0];


  // ==========================================
  // VALIDATE STRUCTURE
  // ==========================================

  if (
    header.length !==
    expectedOldHeader.length
  ) {

    throw new Error(
      "Struktur MasterJasa tidak sesuai. " +
      "Expected 11 kolom, ditemukan " +
      header.length
    );

  }


  for (
    let i = 0;
    i < expectedOldHeader.length;
    i++
  ) {

    if (
      String(header[i]).trim() !==
      expectedOldHeader[i]
    ) {

      throw new Error(
        "Header tidak sesuai pada kolom " +
        (i + 1) +
        ". Expected: " +
        expectedOldHeader[i] +
        " | Actual: " +
        header[i]
      );

    }

  }


  Logger.log(
    "[VALIDATION] Struktur lama valid."
  );


  // ==========================================
  // BACKUP
  // ==========================================

  const timestamp =
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyyMMdd_HHmmss"
    );

  const backupName =
    sheetName +
    "_BACKUP_SCHEMA_" +
    timestamp;


  const backup =
    sheet.copyTo(
      ss
    );

  backup.setName(
    backupName
  );


  Logger.log(
    "[BACKUP] " +
    backupName
  );


  // ==========================================
  // DELETE KATEGORI
  // ==========================================

  Logger.log(
    "[MIGRATION] Menghapus kolom C: Kategori"
  );


  sheet.deleteColumn(3);


  // ==========================================
  // EXPECTED NEW HEADER
  // ==========================================

  const expectedNewHeader = [

    "ID",
    "NamaJasa",
    "Harga",
    "Komisi",
    "EstimasiWaktu",
    "Status",
    "ModeKomisi",
    "Catatan",
    "CreatedAt",
    "UpdatedAt"

  ];


  // ==========================================
  // VERIFY NEW HEADER
  // ==========================================

  const newHeader =
    sheet
      .getRange(
        1,
        1,
        1,
        sheet.getLastColumn()
      )
      .getValues()[0];


  if (
    newHeader.length !==
    expectedNewHeader.length
  ) {

    throw new Error(
      "Migration gagal: jumlah kolom setelah migration tidak sesuai."
    );

  }


  for (
    let i = 0;
    i < expectedNewHeader.length;
    i++
  ) {

    if (
      String(newHeader[i]).trim() !==
      expectedNewHeader[i]
    ) {

      throw new Error(
        "Migration gagal pada kolom " +
        (i + 1) +
        ". Expected: " +
        expectedNewHeader[i] +
        " | Actual: " +
        newHeader[i]
      );

    }

  }


  // ==========================================
  // DATA COUNT
  // ==========================================

  const lastRow =
    sheet.getLastRow();

  const dataRows =
    Math.max(
      0,
      lastRow - 1
    );


  // ==========================================
  // LOG SAMPLE
  // ==========================================

  let firstId = "";
  let lastId = "";

  if (dataRows > 0) {

    firstId =
      String(
        sheet
          .getRange(
            2,
            1
          )
          .getValue() || ""
      ).trim();


    lastId =
      String(
        sheet
          .getRange(
            lastRow,
            1
          )
          .getValue() || ""
      ).trim();

  }


  // ==========================================
  // FINAL LOG
  // ==========================================

  Logger.log(
    "================================"
  );

  Logger.log(
    "===== JASA SCHEMA MIGRATION ====="
  );

  Logger.log(
    "Sheet        : " +
    sheetName
  );

  Logger.log(
    "Kolom lama   : 11"
  );

  Logger.log(
    "Kolom baru   : " +
    sheet.getLastColumn()
  );

  Logger.log(
    "Data rows    : " +
    dataRows
  );

  Logger.log(
    "First ID     : " +
    firstId
  );

  Logger.log(
    "Last ID      : " +
    lastId
  );

  Logger.log(
    "Backup       : " +
    backupName
  );

  Logger.log(
    "Status       : SUCCESS"
  );

  Logger.log(
    "================================"
  );

}