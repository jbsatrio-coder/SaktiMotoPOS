function onOpen(e) {
  buildMenu_();
}

function buildMenu_() {

  SpreadsheetApp.getUi()
    .createMenu("SAKTI MOTO")

    .addItem("🏍️ POS V2", "openPOSV2")

    .addSeparator()

    .addItem("🏍️ Work Order Baru", "showFormWorkOrder")

    .addItem("📋 Dashboard Work Order", "showDashboardWO")

    .addSeparator()

    .addItem("🧪 Test Menu", "testMenu")

    .addToUi();

}

function testMenu() {
  SpreadsheetApp.getUi().alert("Menu OK");
}