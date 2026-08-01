/**
 * =====================================================
 * SAKTI MOTO WMS
 * Core Library
 * =====================================================
 */


/**
 * Mengambil object Sheet
 */
function getSheet_(sheetName) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sh = ss.getSheetByName(sheetName);

  if (!sh) {

    throw new Error("Sheet tidak ditemukan : " + sheetName);

  }

  return sh;

}


/**
 * Mengambil tanggal sekarang
 */
function now_(){

  return new Date();

}


/**
 * Format tanggal Indonesia
 */
function formatDate_(date){

  return Utilities.formatDate(

    date,

    Session.getScriptTimeZone(),

    "dd/MM/yyyy"

  );

}


/**
 * Format Jam
 */
function formatTime_(date){

  return Utilities.formatDate(

    date,

    Session.getScriptTimeZone(),

    "HH:mm:ss"

  );

}


/**
 * Menampilkan Toast
 */
function toast_(message){

  SpreadsheetApp
    .getActiveSpreadsheet()
    .toast(message);

}

/**
 * Include file HTML
 */
function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}