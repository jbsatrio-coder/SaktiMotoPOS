/**
 * Mengambil sheet berdasarkan nama
 */
function getSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(sheetName);
}

/**
 * Membuat nomor invoice
 * Contoh: SM-260731-0001
 */
function generateInvoiceNumber() {

  const sheet = getSheet(CONFIG.SHEET.PENJUALAN);

  const today = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyMMdd"
  );

  const runningNumber = Math.max(sheet.getLastRow(), 1);

  return "SM-" +
         today +
         "-" +
         Utilities.formatString("%04d", runningNumber);

}

function getSheet_(name){

  return SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(name);

}


function toast_(message){

  SpreadsheetApp
    .getActiveSpreadsheet()
    .toast(message);

}