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
    .getSheetByName(CONFIG.SHEET.BARANG);

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

function auditMasterJasaHeader(){

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sh = ss.getSheetByName(CONFIG.SHEET.JASA);

  if(!sh){

    Logger.log(CONFIG.SHEET.JASA + " TIDAK DITEMUKAN.");
    return;

  }

  Logger.log(
    JSON.stringify(
      sh
        .getRange(
          1,
          1,
          1,
          sh.getLastColumn()
        )
        .getValues()[0],
      null,
      2
    )
  );

}

function testPOSProductSearch(){

  const hasil =
    ProductRepository.search("baut");

  Logger.log(
    JSON.stringify(
      hasil,
      null,
      2
    )
  );

}
function auditMasterBarangPOS(){

  const sh =
    getSheet(CONFIG.SHEET.BARANG);

  const lastColumn =
    sh.getLastColumn();

  const lastRow =
    sh.getLastRow();

  Logger.log(
    "===== MASTER BARANG AUDIT ====="
  );

  Logger.log(
    "Sheet : " + sh.getName()
  );

  Logger.log(
    "Last Column : " + lastColumn
  );

  Logger.log(
    "Last Row : " + lastRow
  );

  const headers =
    sh.getRange(
      1,
      1,
      1,
      lastColumn
    ).getValues()[0];

  Logger.log(
    "===== HEADERS ====="
  );

  headers.forEach(
    function(value, index){

      Logger.log(
        (index + 1) +
        " | " +
        String(value)
      );

    }
  );

  if(lastRow >= 2){

    const row =
      sh.getRange(
        2,
        1,
        1,
        lastColumn
      ).getValues()[0];

    Logger.log(
      "===== ROW 2 ====="
    );

    row.forEach(
      function(value, index){

        Logger.log(
          (index + 1) +
          " | " +
          String(value)
        );

      }
    );

  }

}

function auditRuntimeColumnMap(){

  Logger.log(
    "===== RUNTIME COL_BARANG ====="
  );

  Logger.log(
    JSON.stringify(
      COL_BARANG,
      null,
      2
    )
  );

  Logger.log(
    "===== PROPERTY CHECK ====="
  );

  Logger.log(
    "COL_BARANG.ID = " +
    COL_BARANG.ID
  );

  Logger.log(
    "COL_BARANG.BARCODE = " +
    COL_BARANG.BARCODE
  );

  Logger.log(
    "COL_BARANG.KATAKUNCI = " +
    COL_BARANG.KATAKUNCI
  );

  Logger.log(
    "COL_BARANG.NAMAPENDEK = " +
    COL_BARANG.NAMAPENDEK
  );

  Logger.log(
    "COL_BARANG.NAMA = " +
    COL_BARANG.NAMA
  );

  Logger.log(
    "COL_BARANG.KODE = " +
    COL_BARANG.KODE
  );

  Logger.log(
    "COL_BARANG.HARGAJUAL = " +
    COL_BARANG.HARGAJUAL
  );

  Logger.log(
    "COL_BARANG.STOK = " +
    COL_BARANG.STOK
  );

}

function auditPOSProductSamples(){

  Logger.log("===== BARANG SAMPLE =====");

  const barang =
    ProductRepository.search("baut");

  Logger.log(
    JSON.stringify(
      barang.slice(0, 3),
      null,
      2
    )
  );

  Logger.log("===== JASA SAMPLE =====");

  const jasa =
    ProductRepository.search("service");

  Logger.log(
    JSON.stringify(
      jasa.slice(0, 5),
      null,
      2
    )
  );

}

function testInventoryWriteLedgerName(){

  const result = {

    movement : {

      kodeBarang : "BRG000114",

      movementType : MovementType.SALE,

      qty : 1,

      reference : "TEST-LEDGER-NAME",

      note : "Test Nama Barang",

      performedBy : "Developer"

    },

    currentStock : 23,

    qtyIn : 0,

    qtyOut : 1,

    newStock : 22

  };

  const output =
    InventoryService.writeLedger(result);

  Logger.log(
    JSON.stringify(
      output,
      null,
      2
    )
  );

}
