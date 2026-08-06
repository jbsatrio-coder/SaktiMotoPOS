/**
 * ============================================
 * CONFIG
 * SAKTI MOTO POS
 * ============================================
 */

const CONFIG = {

  SHEET: {

    BARANG: "02_MasterBarang",

    SUPPLIER: "05_MasterSupplier",

    PELANGGAN: "06_MasterPelanggan",

    KENDARAAN: "07_MasterKendaraan",

    JASA: "08_MasterJasa",

    MEKANIK: "09_MasterMekanik",

    POS: "10_POS",

    PENJUALAN: "11_Penjualan",

    DETAIL_PENJUALAN: "12_DetailPenjualan",

    STOK: "14_Stok",

    KOMISI_MEKANIK: "16_KomisiMekanik",

    WORK_ORDER: "17_WorkOrder"

},

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

    BARCODE_CELL: "C6",

    GRAND_TOTAL_CELL: "K8"

  }

};