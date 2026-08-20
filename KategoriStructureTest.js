function testMasterKategoriStructure(){

  const sh =
    getSheet_(CONFIG.SHEET.KATEGORI);

  Logger.log(
    "===== MASTER KATEGORI STRUCTURE ====="
  );

  Logger.log(
    "Sheet: " + sh.getName()
  );

  Logger.log(
    "Last Column: " + sh.getLastColumn()
  );

  Logger.log(
    "Last Row: " + sh.getLastRow()
  );

  Logger.log(
    sh
      .getRange(
        1,
        1,
        1,
        sh.getLastColumn()
      )
      .getValues()[0]
  );

}