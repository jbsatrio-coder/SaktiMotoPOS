function testMasterMerkStructure() {

  const sheet =
    getSheet(CONFIG.SHEET.MERK);

  Logger.log(
    "===== MASTER MERK STRUCTURE ====="
  );

  Logger.log(
    "Sheet: " +
    sheet.getName()
  );

  Logger.log(
    "Last Column: " +
    sheet.getLastColumn()
  );

  Logger.log(
    "Last Row: " +
    sheet.getLastRow()
  );

  const headers =
    sheet
      .getRange(
        1,
        1,
        1,
        sheet.getLastColumn()
      )
      .getValues()[0];

  Logger.log(
    JSON.stringify(
      headers,
      null,
      2
    )
  );

}
