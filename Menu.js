function onOpen(e) {
  buildMenu_();
}

function buildMenu_() {

  SpreadsheetApp.getUi()
    .createMenu("SAKTI MOTO")

    .addItem("🏍️ POS V2", "openPOSV2")

    .addItem(
  "👤 Pelanggan Baru",
  "bukaFormPelanggan"
)

    .addItem(
  "📦 Barang Baru",
  "bukaFormBarangBaru"
)

    .addItem(
  "🔧 Jasa Baru",
  "bukaFormJasaBaru"
)

    .addItem(
  "🏍️ Kendaraan Baru",
  "bukaFormKendaraan"
)

    .addSeparator()

    .addItem("🏍️ Work Order Baru", "showFormWorkOrder")

    .addItem("📋 Dashboard Work Order", "showDashboardWO")

    .addSeparator()

    .addItem("📦 Pembelian / Stok Masuk", "bukaFormPembelian")

    .addSeparator()

    .addItem("🧪 Test Menu", "testMenu")

    .addToUi();

}

function testMenu() {
  SpreadsheetApp.getUi().alert("Menu OK");
}