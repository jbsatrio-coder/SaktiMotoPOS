/**
 * =====================================================
 * SAKTI MOTO POS V2
 * MODULE  : POS Controller
 * VERSION : 2.0.0
 * =====================================================
 */

/**
 * Membuka POS V2
 */
function openPOSV2() {

  const html = HtmlService
    .createTemplateFromFile("POSV2")
    .evaluate()
    .setWidth(1500)
    .setHeight(900);

  SpreadsheetApp
    .getUi()
    .showModalDialog(
      html,
      "SAKTI MOTO POS V2"
    );

}


/**
 * Smart Search
 */
function searchPOSProduct(keyword){

  const hasil = ProductRepository.search(keyword);

  Logger.log(JSON.stringify(hasil, null, 2));

  return hasil;

}


/**
 * Mengambil data Work Order
 * (sementara dikosongkan)
 */
function getPOSWorkOrder(noWO){

  return {};

}