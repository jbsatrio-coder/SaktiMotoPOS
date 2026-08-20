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

    DIUBAH_PADA : 14,

    JENIS_TRANSAKSI : 15,

    TOTAL : 16

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

    ID : 0,

    BARCODE : 1,

    KATAKUNCI : 2,

    NAMAPENDEK : 3,

    NAMA : 4,

    KATEGORI : 5,

    SUBKATEGORI : 6,

    MERK : 7,

    KENDARAAN : 8,

    SATUAN : 9,

    HARGAMODAL : 10,

    MARGIN : 11,

    HARGAJUAL : 12,

    STOK : 13,

    MINSTOK : 14,

    RAK : 15,

    SUPPLIER : 16,

    STATUS : 17,

    CATATAN : 18,

    CREATED_AT : 19,

    UPDATED_AT : 20,

    CREATED_BY : 21,

    UPDATED_BY : 22,

    TOTAL : 23

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
 * MASTER KATEGORI
 * ===================================================== */

const COL_KATEGORI = {

    ID : 0,

    NAMA : 1,

    TOTAL : 2

};


/* =====================================================
 * MASTER JASA
 * ===================================================== */

const COL_JASA = {

    ID : 0,

    // MasterJasa menggunakan ID sebagai kode internal jasa.
    KODE : 0,

    NAMA : 1,

    HARGA : 2,

    // Komisi khusus jasa dalam Rupiah.
    KOMISI : 3,

    ESTIMASI : 4,

    STATUS : 5,

    // MEKANIK atau JASA
    MODE_KOMISI : 6,

    CATATAN : 7,

    CREATED_AT : 8,

    UPDATED_AT : 9,

    TOTAL : 10

};

/* =====================================================
 * MASTER MERK
 * ===================================================== */

const COL_MERK = {

    ID : 0,

    NAMA : 1,

    TOTAL : 2

};

/* =====================================================
 * MASTER MODEL
 * ===================================================== */

const COL_MODEL = {

    ID : 0,

    MERK_ID : 1,

    NAMA : 2,

    STATUS : 3,

    CREATED_AT : 4,

    UPDATED_AT : 5,

    TOTAL : 6

};

const COL_STOK = {

  ID: 0,

  TANGGAL: 1,

  JAM: 2,

  BARANG_ID: 3,

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

const COL_MEKANIK = {

    ID : 0,

    NAMA : 1,

    NO_HP : 2,

    JABATAN : 3,

    TANGGAL_MASUK : 4,

    GAJI_POKOK : 5,

    TIPE_KOMISI : 6,

    NILAI_KOMISI : 7,

    STATUS : 8,

    CREATED_AT : 9,

    UPDATED_AT : 10,

    URUTAN_TAMPILAN : 11,

    TOTAL : 12

};

/* =====================================================
 * MASTER USER
 * ===================================================== */

const COL_MASTER_USER = {

    ID : 0,

    EMAIL : 1,

    NAMA : 2,

    ROLE : 3,

    STATUS : 4,

    CREATED_AT : 5,

    UPDATED_AT : 6,

    TOTAL : 7

};

/* =====================================================
 * ROLE PERMISSION
 * ===================================================== */

const COL_ROLE_PERMISSION = {

    ID : 0,

    ROLE : 1,

    PERMISSION : 2,

    STATUS : 3,

    UPDATED_AT : 4,

    TOTAL : 5

};

/**
 * ============================================
 * WORK ORDER PART COLUMN MAP
 * ============================================
 */

const COL_WORK_ORDER_PART = {

    ID : 0,

    WORK_ORDER_ID : 1,

    WORK_ORDER_JASA_ID : 2,

    BARANG_ID : 3,

    NAMA_BARANG_SNAPSHOT : 4,

    QTY : 5,

    HARGA : 6,

    DISKON : 7,

    STATUS : 8,

    CATATAN : 9,

    DIBUAT_PADA : 10,

    DIUBAH_PADA : 11,

    TOTAL : 12

};

function testBarangColumnMap(){

    Logger.log(

        JSON.stringify(

            COL_BARANG,

            null,

            2

        )

    );

}