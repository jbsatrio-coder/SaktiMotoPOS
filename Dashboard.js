/**
 * ============================================
 * Dashboard Work Order
 * ============================================
 */

function openDashboardWO() {

  const html = HtmlService
    .createTemplateFromFile("DashboardWO")
    .evaluate()
    .setWidth(1400)
    .setHeight(850);

  SpreadsheetApp
    .getUi()
    .showModalDialog(
      html,
      "Dashboard Work Order"
    );

}


/**
 * Membuka Detail WO
 */
function openDetailWO(noWO){

  const html = HtmlService
      .createTemplateFromFile("DetailWO");

  html.noWO = noWO;

  SpreadsheetApp.getUi()
    .showModalDialog(
      html.evaluate()
          .setWidth(700)
          .setHeight(750),
      "Detail Work Order"
    );

}
