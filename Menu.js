function buildMenu_() {

  const ui = SpreadsheetApp.getUi();

  ui.createMenu("SAKTI MOTO")

    .addItem("🏍️ Work Order Baru", "showFormWorkOrder")

    .addItem(
"Dashboard Work Order",
"showDashboardWO")

    .addSeparator()

    .addItem("🧪 Test Menu", "testMenu")

    .addToUi();

}

function testMenu() {

  SpreadsheetApp.getUi().alert("Menu OK");

}