/**
 * ============================================
 * Transaction Service
 * Sprint 3
 * ============================================
 */

const TransactionService = {
  /**
   * Generate Nomor Transaksi
   */
  generateTransactionNo() {

  return generateInvoiceNumber();

},

/**
 * Simpan Transaksi
 */
saveTransaction(payload) {

  const start = new Date();

function logStep(step){
  Logger.log(
    step + " : " + (new Date() - start) + " ms"
  );
}

  if (!payload) {
    throw new Error("Payload transaksi kosong.");
  }

  const now = new Date();

  const noTransaksi =
  TransactionService.generateTransactionNo();

  logStep("Generate No");

  // --------------------------
  // HEADER
  // --------------------------

  const subtotal = payload.items.reduce(
    (sum, item) => sum + parseNumber(item.subtotal),
    0
  );

  const diskonNota =
    parseNumber(payload.transaksi.diskonNota);

  const grandTotal =
    subtotal - diskonNota;

  const bayar =
    parseNumber(payload.transaksi.bayar);

  const kembalian =
    bayar - grandTotal;

  const header = {

    noTransaksi,

    tanggal: Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      "dd/MM/yyyy"
    ),

    jam: Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      "HH:mm:ss"
    ),

    idPelanggan:
      payload.pelanggan.id,

    namaPelanggan:
      payload.pelanggan.nama,

    idKendaraan:
      payload.kendaraan.id,

    platNomor:
      payload.kendaraan.platNomor,

    mekanikUtama:
      payload.transaksi.mekanikUtama,

    subtotal,

    diskonNota,

    grandTotal,

    bayar,

    kembalian,

    metodeBayar:
      payload.transaksi.metodeBayar,

    admin:
      payload.transaksi.admin,

    status: "LUNAS",

    createdAt: now,

    workOrder:
      payload.transaksi.workOrder || "",

    updatedAt: ""

  };

  PenjualanRepository.saveHeader(header);

  logStep("Save Header");

  // --------------------------
  // DETAIL
  // --------------------------

  PenjualanRepository.saveDetail({

    noTransaksi,

    createdAt: now,

    items: payload.items

});

logStep("Save Detail");

// Kurangi stok


logStep("TOTAL");

  InventoryService.reduceStock(payload.items);

  return {

    success: true,

    noTransaksi,

    totalItem: payload.items.length,

    grandTotal

  };

}

};


/**
 * TEST
 */
function testGenerateTransactionNo() {

  Logger.log(
    TransactionService.generateTransactionNo()
  );

}

function testSaveTransaction() {

  const result =
    TransactionService.saveTransaction({

      pelanggan: {

        id: "PLG000001",
        nama: "TEST"

      },

      kendaraan: {

        id: "KND000001",
        platNomor: "B1234XYZ"

      },

      transaksi: {

        diskonNota: 5000,

        bayar: 150000,

        metodeBayar: "TUNAI",

        admin: "TEST",

        mekanikUtama: "MKN001",

        workOrder: ""

      },

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

          komisi: 15000,

          hargaModal: 0,

          labaKotor: 35000

        }

      ]

    });

  Logger.log(result);

}