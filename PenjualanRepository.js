/**
 * ============================================
 * Penjualan Repository
 * Sprint 3
 * ============================================
 */

const PenjualanRepository = {

  /**
   * Simpan Header Penjualan
   */
  saveHeader(header) {

    if (!header) {
      throw new Error("Header transaksi kosong.");
    }

    const sh = getSheet_(CONFIG.SHEET.PENJUALAN);

    sh.appendRow([

      header.noTransaksi,

      header.tanggal,
      header.jam,

      header.idPelanggan,
      header.namaPelanggan,

      header.idKendaraan,
      header.platNomor,

      header.mekanikUtama,

      parseNumber(header.subtotal),
      parseNumber(header.diskonNota),
      parseNumber(header.grandTotal),

      parseNumber(header.bayar),
      parseNumber(header.kembalian),

      header.metodeBayar,

      header.admin,

      header.status,

      header.createdAt,

      header.workOrder || "",

      header.updatedAt || ""

    ]);

    return true;

  },

  /**
   * Simpan Detail Penjualan
   */
 /**
 * Simpan Detail Penjualan
 */
saveDetail(payload) {

  if (!payload) {
    throw new Error("Payload kosong.");
  }

  const { noTransaksi, items, createdAt } = payload;

  if (!noTransaksi) {
    throw new Error("No transaksi kosong.");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Detail transaksi kosong.");
  }

  const sh = getSheet_(CONFIG.SHEET.DETAIL_PENJUALAN);

  // Cari baris terakhir
  const lastRow = sh.getLastRow();

  // Mulai nomor ID berikutnya
  let running = Math.max(1, lastRow);

  const rows = items.map(item => {

    running++;

    const idDetail =
      "DTL" + String(running).padStart(8, "0");

    return [

      idDetail,

      noTransaksi,

      item.jenis,

      item.kode,

      item.nama,

      parseNumber(item.qty),

      parseNumber(item.harga),

      parseNumber(item.diskon || 0),

      parseNumber(item.subtotal),

      item.mekanik || "",

      parseNumber(item.komisi || 0),

      parseNumber(item.hargaModal || 0),

      parseNumber(item.labaKotor || 0),

      createdAt,

      ""

    ];

  });

  sh
    .getRange(
      lastRow + 1,
      1,
      rows.length,
      rows[0].length
    )
    .setValues(rows);

  return {

    success: true,

    inserted: rows.length

  };

},

};

function testSaveHeader() {

  const ok = PenjualanRepository.saveHeader({

    noTransaksi: "TEST000001",

    tanggal: new Date(),
    jam: new Date(),

    idPelanggan: "PLG000001",
    namaPelanggan: "TEST PELANGGAN",

    idKendaraan: "KND000001",
    platNomor: "B1234XYZ",

    mekanikUtama: "Kiki",

    subtotal: 100000,
    diskonNota: 5000,
    grandTotal: 95000,

    bayar: 100000,
    kembalian: 5000,

    metodeBayar: "TUNAI",

    admin: "TEST",

    status: "SELESAI",

    createdAt: new Date(),

    workOrder: "",

    updatedAt: ""

  });

  Logger.log(ok);

}

function testSaveDetail() {

  const result = PenjualanRepository.saveDetail({

    noTransaksi: "TEST000001",

    createdAt: new Date(),

    items: [

      {

        jenis: "BARANG",

        kode: "BRG000001",

        nama: "Barang Test",

        qty: 2,

        harga: 50000,

        diskon: 0,

        subtotal: 100000,

        mekanik: "MKN001",

        komisi: 0,

        hargaModal: 30000,

        labaKotor: 40000

      },

      {

        jenis: "JASA",

        kode: "JSA000001",

        nama: "Service Ringan",

        qty: 1,

        harga: 35000,

        diskon: 0,

        subtotal: 35000,

        mekanik: "MKN001",

        komisi: 10000,

        hargaModal: 0,

        labaKotor: 35000

      }

    ]

  });

  Logger.log(result);

}