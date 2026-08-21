/**
 * ============================================
 * CONFIG
 * SAKTI MOTO POS
 *
 * Sheet naming refactor - Phase 1
 *
 * PENTING:
 * Nilai nama sheet MASIH menggunakan nama lama.
 * Rename fisik sheet dilakukan pada fase akhir,
 * setelah seluruh hard-coded reference dibereskan.
 * ============================================
 */

const CONFIG = {

  SHEET: {

    SETTING:
      "Setting",

    BARANG:
      "MasterBarang",

    KATEGORI:
      "MasterKategori",

    MERK:
      "MasterMerk",

    MODEL:
      "MasterModel",

    SUPPLIER:
      "MasterSupplier",

    PELANGGAN:
      "MasterPelanggan",

    VEHICLE:
      "MasterKendaraan",

    JASA:
      "MasterJasa",

    MEKANIK:
      "MasterMekanik",

    MASTER_USER:
      "MasterUser",

    ROLE_PERMISSION:
      "RolePermission",

    POS:
      "POS",

    PENJUALAN:
      "Penjualan",

    DETAIL_PENJUALAN:
      "DetailPenjualan",

    PEMBELIAN_LEGACY:
      "13_Pembelian_Legacy",

    STOK:
      "Stok",

    DASHBOARD:
      "Dashboard",

    KOMISI_MEKANIK:
      "KomisiMekanik",

    WORK_ORDER:
      "WorkOrder",

    WORK_ORDER_JASA:
      "WorkOrderJasa",

    WORK_ORDER_PART:
      "WorkOrderPart",

    MASTER_KELUHAN:
      "MasterKeluhan",

    MASTER_STATUS_WO:
      "MasterStatusWO",

    LAPORAN:
      "Laporan",

    PEMBELIAN:
      "Pembelian",

    DETAIL_PEMBELIAN:
      "DetailPembelian",

    RUNNING_NUMBER:
      "RunningNumber"

  },


  /**
   * ==========================================
   * POS CONFIGURATION
   * ==========================================
   */

  POS: {

    START_ROW: 11,

    COL_JENIS: 1,

    COL_KODE: 2,

    COL_NAMA: 3,

    COL_QTY: 4,

    COL_HARGA: 5,

    COL_DISKON: 6,

    COL_SUBTOTAL: 7,

    COL_STOK: 8,

    BARCODE_CELL:
      "C6",

    GRAND_TOTAL_CELL:
      "K8"

  },

    /**
   * ==========================================
   * PRICING CONFIGURATION
   * ==========================================
   */

  PRICING: {

    // Opsi B:
    // Margin dihitung sebagai persentase dari Harga Jual.
    //
    // Harga Jual =
    // Harga Modal / (1 - Margin)

    DEFAULT_MARGIN: 0.30,

    // Pecahan Rupiah terkecil
    PRICE_ROUNDING: 100,

    // Pembulatan selalu ke atas
    ROUNDING_MODE: "UP"

  }

};


/**
 * ============================================
 * TEST CONFIG
 * ============================================
 */

function testVehicleConfig(){

  Logger.log(
    CONFIG.SHEET.VEHICLE
  );

}
