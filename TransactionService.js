/**
 * ============================================
 * Transaction Service
 * Sprint 4D.6
 * ============================================
 */

const TransactionService = {

    /**
     * Generate Nomor Transaksi
     */
    generateTransactionNo(){

        return RunningNumberService.generate(

            DocumentType.SALES

        );

    },

    /**
     * Save Transaction
     *
     * Legacy Facade
     */
    saveTransaction(payload){

        return SalesService.saveSale(

            payload

        );

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