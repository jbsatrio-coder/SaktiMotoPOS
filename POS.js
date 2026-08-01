/**
 * Menambah barang ke POS
 */
function addItemToPOS(barang){

  const sheet = getSheet(CONFIG.SHEET.POS);

  const start = CONFIG.POS.START_ROW;
  const last = Math.max(sheet.getLastRow(), start);

  // cek apakah barang sudah ada
  for(let row=start; row<=last; row++){

    const kode = sheet.getRange(row,CONFIG.POS.COL_KODE).getValue();

    if(kode == barang.kode){

      let qty = Number(
        sheet.getRange(row,CONFIG.POS.COL_QTY).getValue()
      );

      qty++;

      sheet.getRange(row,CONFIG.POS.COL_QTY).setValue(qty);

      sheet.getRange(row,CONFIG.POS.COL_SUBTOTAL)
      .setValue(qty * barang.harga);

      hitungGrandTotal();

      return;

    }

  }

  // cari baris kosong
  let row = start;

  while(sheet.getRange(row,CONFIG.POS.COL_KODE).getValue()!=""){
    row++;
  }

  sheet.getRange(row,CONFIG.POS.COL_JENIS).setValue("Barang");
  sheet.getRange(row,CONFIG.POS.COL_KODE).setValue(barang.kode);
  sheet.getRange(row,CONFIG.POS.COL_NAMA).setValue(barang.nama);
  sheet.getRange(row,CONFIG.POS.COL_QTY).setValue(1);
  sheet.getRange(row,CONFIG.POS.COL_HARGA).setValue(barang.harga);
  sheet.getRange(row,CONFIG.POS.COL_DISKON).setValue(0);
  sheet.getRange(row,CONFIG.POS.COL_SUBTOTAL).setValue(barang.harga);
  sheet.getRange(row,CONFIG.POS.COL_STOK).setValue(barang.stok);

  hitungGrandTotal();

}


/**
 * Hitung Grand Total
 */
function hitungGrandTotal(){

  const sheet = getSheet(CONFIG.SHEET.POS);

  let total = 0;

  const start = CONFIG.POS.START_ROW;
  const last = sheet.getLastRow();

  for(let row=start; row<=last; row++){

    total += Number(
      sheet.getRange(row,CONFIG.POS.COL_SUBTOTAL).getValue()
    );

  }

  sheet.getRange(CONFIG.POS.GRAND_TOTAL_CELL)
       .setValue(total);

}


/**
 * TEST
 */
function testTambahBarang() {

  const barang = findProductByBarcode("100000001");

  Logger.log(JSON.stringify(barang));

  SpreadsheetApp.getUi().alert(JSON.stringify(barang));

  addItemToPOS(barang);

}

function testConfig(){

  Logger.log(JSON.stringify(CONFIG.POS));

  SpreadsheetApp.getUi().alert(JSON.stringify(CONFIG.POS));

}

/**
 * Smart Search Produk
 * Menggabungkan Barang + Jasa
 */
function searchProduct(keyword){

  keyword = String(keyword || "").trim();

  if(keyword=="") return [];

  return ProductRepository.search(keyword);

}

function testSearch(){

  const hasil = ProductRepository.search("oli");

  Logger.log(JSON.stringify(hasil,null,2));

}