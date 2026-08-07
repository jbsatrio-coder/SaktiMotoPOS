/**
 * ============================================
 * COLUMN MAP
 * SAKTI MOTO POS
 * ============================================
 *
 * CATATAN:
 * COL_xxx       = Index Array (hasil getValues()) dimulai dari 0
 * SHEET_COL_xxx = Nomor Kolom Google Sheet dimulai dari 1
 * ============================================
 */


/* =====================================================
 * WORK ORDER
 * ===================================================== */

const COL_WO = {

  NOWO: 0,

  TANGGAL: 1,

  JAM: 2,

  STATUS: 3,

  PRIORITAS: 4,

  APPROVAL: 5,

  IDPELANGGAN: 6,

  NAMAPELANGGAN: 7,

  IDKENDARAAN: 8,

  PLAT: 9,

  MERK: 10,

  MODEL: 11,

  KM: 12,

  KELUHAN: 13,

  DIAGNOSA: 14,

  ESTIMASI: 15,

  ESTIMASISELESAI: 16,

  MEKANIK: 17,

  ADMIN: 18,

  CATATAN: 19,

  CREATED: 20,

  UPDATED: 21

};


/* =====================================================
 * MASTER PELANGGAN
 * ===================================================== */

const COL_PELANGGAN = {

    ID : 0,

    NAMA : 1,

    NOHP : 2,

    ALAMAT : 3,

    TANGGALLAHIR : 4,

    JENISKELAMIN : 5,

    STATUS : 6,

    CATATAN : 7,

    CREATEDAT : 8,

    UPDATEDAT : 9

};

/**
 * ============================================
 * Sheet Column Master Pelanggan
 * (1-based index)
 * ============================================
 */
const SHEET_COL_PELANGGAN = {

    ID : 1,

    NAMA : 2,

    NOHP : 3,

    ALAMAT : 4,

    TANGGALLAHIR : 5,

    JENISKELAMIN : 6,

    STATUS : 7,

    CATATAN : 8,

    CREATEDAT : 9,

    UPDATEDAT : 10

};


/* =====================================================
 * MASTER KENDARAAN
 * ===================================================== */

const COL_VEHICLE = {

    ID : 0,

    CUSTOMER_ID : 1,

    PLATE : 2,

    BRAND : 3,

    MODEL : 4,

    YEAR : 5,

    COLOR : 6,

    ENGINE_NO : 7,

    FRAME_NO : 8,

    LAST_KM : 9,

    STATUS : 10,

    NOTE : 11,

    CREATED_AT : 12,

    UPDATED_AT : 13

};



const SHEET_COL_VEHICLE = {

    ID : 1,

    CUSTOMER_ID : 2,

    PLATE : 3,

    BRAND : 4,

    MODEL : 5,

    YEAR : 6,

    COLOR : 7,

    ENGINE_NO : 8,

    FRAME_NO : 9,

    LAST_KM : 10,

    STATUS : 11,

    NOTE : 12,

    CREATED_AT : 13,

    UPDATED_AT : 14

};

/* =====================================================
 * MASTER WORK ORDER
 * ===================================================== */

const COL_WORK_ORDER = {

    ID : 0,

    ID_PELANGGAN : 1,

    NAMA_PELANGGAN : 2,

    ID_KENDARAAN : 3,

    NO_POLISI : 4,

    MERK : 5,

    MODEL : 6,

    KILOMETER_MASUK : 7,

    STATUS : 8,

    PRIORITAS : 9,

    ESTIMASI_SELESAI : 10,

    ADMIN : 11,

    CATATAN : 12,

    DIBUAT_PADA : 13,

    DIUBAH_PADA : 14

};

const SHEET_COL_WORK_ORDER = {

    ID : 1,

    ID_PELANGGAN : 2,

    NAMA_PELANGGAN : 3,

    ID_KENDARAAN : 4,

    NO_POLISI : 5,

    MERK : 6,

    MODEL : 7,

    KILOMETER_MASUK : 8,

    STATUS : 9,

    PRIORITAS : 10,

    ESTIMASI_SELESAI : 11,

    ADMIN : 12,

    CATATAN : 13,

    DIBUAT_PADA : 14,

    DIUBAH_PADA : 15

};


/* =====================================================
 * MASTER BARANG
 * getValues() -> index array
 * ===================================================== */

const COL_BARANG = {

  ID: 0,

  BARCODE: 1,

  KODE: 2,

  KATAKUNCI: 3,

  NAMAPENDEK: 4,

  NAMA: 5,

  KATEGORI: 6,

  SUBKATEGORI: 7,

  MERK: 8,

  KENDARAAN: 9,

  SATUAN: 10,

  HARGAMODAL: 11,

  MARGIN: 12,

  HARGAJUAL: 13,

  STOK: 14,

  MINSTOK: 15,

  RAK: 16,

  SUPPLIER: 17,

  STATUS: 18,

  CATATAN: 19

};


/* =====================================================
 * MASTER BARANG
 * getRange() -> nomor kolom Sheet
 * ===================================================== */

const SHEET_COL_BARANG = {

  ID: 1,

  BARCODE: 2,

  KODE: 3,

  KATAKUNCI: 4,

  NAMAPENDEK: 5,

  NAMA: 6,

  KATEGORI: 7,

  SUBKATEGORI: 8,

  MERK: 9,

  KENDARAAN: 10,

  SATUAN: 11,

  HARGAMODAL: 12,

  MARGIN: 13,

  HARGAJUAL: 14,

  STOK: 15,

  MINSTOK: 16,

  RAK: 17,

  SUPPLIER: 18,

  STATUS: 19,

  CATATAN: 20

};


/* =====================================================
 * MASTER JASA
 * ===================================================== */

const COL_JASA = {

  ID: 0,

  KODE: 1,

  NAMA: 2,

  KATEGORI: 3,

  HARGA: 4,

  KOMISI: 5,

  ESTIMASI: 6,

  STATUS: 7

};

const COL_STOK = {

  ID: 0,

  TANGGAL: 1,

  JAM: 2,

  KODEBARANG: 3,

  NAMABARANG: 4,

  JENISMUTASI: 5,

  REFERENSI: 6,

  STOKAWAL: 7,

  QTYMASUK: 8,

  QTYKELUAR: 9,

  STOKAKHIR: 10,

  KETERANGAN: 11,

  ADMIN: 12,

  CREATEDAT: 13

};

const COL_WO_JASA = {

    ID : 0,

    WORK_ORDER_ID : 1,

    URUTAN : 2,

    JASA_ID : 3,

    NAMA_JASA : 4,

    KELUHAN : 5,

    DIAGNOSA : 6,

    MEKANIK_ID : 7,

    MEKANIK_NAMA : 8,

    QTY : 9,

    HARGA : 10,

    DISKON : 11,

    SUBTOTAL : 12,

    STATUS : 13,

    CATATAN : 14,

    CREATED_AT : 15,

    UPDATED_AT : 16

};