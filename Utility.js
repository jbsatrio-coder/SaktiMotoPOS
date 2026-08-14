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

  const sheet = getSheet_(CONFIG.SHEET.PENJUALAN);

  const lastRow = sheet.getLastRow();

  const now = new Date();

  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const prefix = "SM" + yy + mm + dd;

  // Belum ada transaksi
  if (lastRow <= 1) {
    return prefix + "0001";
  }

  const lastInvoice = String(
  sheet
    .getRange(lastRow, 1) // Kolom A = NoTransaksi
    .getValue()
).trim();

  // Hari baru → mulai lagi dari 0001
  if (!lastInvoice.startsWith(prefix)) {
    return prefix + "0001";
  }

  const runningNo =
    parseInt(lastInvoice.slice(-4), 10) + 1;

  return prefix + String(runningNo).padStart(4, "0");

}


function toast_(message){

  SpreadsheetApp
    .getActiveSpreadsheet()
    .toast(message);

}

function parseNumber(value) {

  if (value === "" || value == null) return 0;

  return Number(
    String(value).replace(/,/g, "")
  ) || 0;

}

