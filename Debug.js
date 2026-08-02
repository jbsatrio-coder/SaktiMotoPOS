/**
 * ============================================
 * DEBUG TOOLS
 * SaktiMotoPOS
 * ============================================
 */

/**
 * Test Barang Repository
 */
function testBarangSearch() {

  const hasil = BarangRepository.search("baut");

  Logger.log("Jumlah hasil = " + hasil.length);

  if (hasil.length > 0) {
    Logger.log(JSON.stringify(hasil[0], null, 2));
  }

}

/**
 * Test Product Repository
 */
function testProductSearch() {

  const hasil = ProductRepository.search("baut");

  Logger.log("Jumlah = " + hasil.length);

  if (hasil.length > 0) {
    Logger.log(JSON.stringify(hasil[0], null, 2));
  }

}

/**
 * Test Search Service
 */
function testSearchService() {

  const hasil = SearchService.search("baut");

  Logger.log("Jumlah = " + hasil.length);

  if (hasil.length > 0) {
    Logger.log(JSON.stringify(hasil[0], null, 2));
  }

}

/**
 * Test Sheet Master Barang
 */
function testSheetBarang() {

  const sh = BarangRepository.sheet();

  Logger.log("Nama sheet = " + sh.getName());

  Logger.log("Last Row = " + sh.getLastRow());

  Logger.log(
    JSON.stringify(
      sh.getRange(2, 1, 1, 20).getDisplayValues()
    )
  );

}

function testCellType() {

  const sh = SpreadsheetApp.getActive()
    .getSheetByName("02_MasterBarang");

  Logger.log(sh.getRange("N2").getValue());
  Logger.log(typeof sh.getRange("N2").getValue());

}

function testGetValues() {

  const sh = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(CONFIG.SHEET.BARANG);

  const value = sh.getRange(2, 14).getValue();   // kolom N (Harga Jual)

  Logger.log(value);
  Logger.log(typeof value);

}