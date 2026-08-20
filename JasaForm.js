/**
 * ============================================
 * JASA FORM
 * ============================================
 */

function bukaFormJasaBaru() {

  const html =
    HtmlService
      .createHtmlOutputFromFile(
        "FormJasa"
      )
      .setWidth(550)
      .setHeight(650);

  SpreadsheetApp
    .getUi()
    .showModalDialog(
      html,
      "Jasa Baru"
    );

}
