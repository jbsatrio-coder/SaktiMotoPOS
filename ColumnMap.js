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

  ID: 0,

  NAMA: 1,

  NOHP: 2,

  ALAMAT: 3,

  CATATAN: 4,

  MEMBERSEJAK: 5

};


/* =====================================================
 * MASTER KENDARAAN
 * ===================================================== */

const COL_KENDARAAN = {

  ID: 0,

  IDPELANGGAN: 1,

  PLAT: 2,

  MERK: 3,

  MODEL: 4,

  TAHUN: 5,

  WARNA: 6,

  NOMORMESIN: 7,

  NOMORRANGKA: 8

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