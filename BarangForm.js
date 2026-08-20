/**
 * ============================================
 * BARANG FORM
 * ============================================
 */

function bukaFormBarangBaru() {

  const html =
    HtmlService
      .createHtmlOutputFromFile(
        "FormBarang"
      )
      .setWidth(650)
      .setHeight(720);

  SpreadsheetApp
    .getUi()
    .showModalDialog(
      html,
      "Barang Baru"
    );

}