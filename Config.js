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
      "01_Setting",

    BARANG:
      "02_MasterBarang",

    KATEGORI:
      "03_MasterKategori",

    MERK:
      "04_MasterMerk",

    MODEL:
      "MasterModel",

    SUPPLIER:
      "05_MasterSupplier",

    PELANGGAN:
      "06_MasterPelanggan",

    VEHICLE:
      "07_MasterKendaraan",

    JASA:
      "08_MasterJasa",

    MEKANIK:
      "09_MasterMekanik",

    MASTER_USER:
      "MasterUser",

    ROLE_PERMISSION:
      "RolePermission",

    POS:
      "10_POS",

    PENJUALAN:
      "11_Penjualan",

    DETAIL_PENJUALAN:
      "12_DetailPenjualan",

    PEMBELIAN_LEGACY:
      "13_Pembelian_Legacy",

    STOK:
      "14_Stok",

    DASHBOARD:
      "15_Dashboard",

    KOMISI_MEKANIK:
      "16_KomisiMekanik",

    WORK_ORDER:
      "17_WorkOrder",

    WORK_ORDER_JASA:
      "18_WorkOrderJasa",

    WORK_ORDER_PART:
      "19_WorkOrderPart",

    MASTER_KELUHAN:
      "19_MasterKeluhan",

    MASTER_STATUS_WO:
      "20_MasterStatusWO",

    LAPORAN:
      "21_Laporan",

    PEMBELIAN:
      "22_Pembelian",

    DETAIL_PEMBELIAN:
      "23_DetailPembelian",

    RUNNING_NUMBER:
      "99_RunningNumber"

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