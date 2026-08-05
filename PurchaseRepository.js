/**
 * ============================================
 * Purchase Repository
 * Version : 1.0.0
 * Sprint  : 4D.2
 * ============================================
 */

const PurchaseRepository = {

    SHEET_HEADER : "22_Pembelian",

    SHEET_DETAIL : "23_DetailPembelian",

    /**
     * Header Sheet
     */
    getHeaderSheet(){

        return SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName(
                this.SHEET_HEADER
            );

    },

    /**
     * Detail Sheet
     */
    getDetailSheet(){

        return SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName(
                this.SHEET_DETAIL
            );

    },
/**
 * Simpan Header Purchase
 */
saveHeader(purchaseDocument){

    const sheet =
        this.getHeaderSheet();

    const totalItem =
        purchaseDocument.items.length;

    const totalQty =
        purchaseDocument.items.reduce(

            (total, item) =>

                total + Number(item.qty),

            0

        );

        

    sheet.appendRow([

        purchaseDocument.header.nomor,

        purchaseDocument.header.tanggal,

        purchaseDocument.header.supplier,

        totalItem,

        totalQty,

        purchaseDocument.status,

        purchaseDocument.header.admin,

        new Date()

    ]);

    Logger.log(

        "[PURCHASE HEADER] OK"

    );

},

/**
 * Simpan Detail Purchase
 */
saveItems(purchaseDocument){

    const sheet =
        this.getDetailSheet();

    const rows = purchaseDocument.items.map(item => [

        purchaseDocument.header.nomor,

        item.kodeBarang,

        item.qty,

        item.hargaBeli,

        item.qty * item.hargaBeli

    ]);

    if(rows.length > 0){

        sheet.getRange(

            sheet.getLastRow() + 1,

            1,

            rows.length,

            rows[0].length

        ).setValues(rows);

    }

    Logger.log("[PURCHASE DETAIL] OK");

},
};

function testPurchaseRepository(){

    const header =
        PurchaseRepository.getHeaderSheet();

    const detail =
        PurchaseRepository.getDetailSheet();

    Logger.log(header.getName());

    Logger.log(detail.getName());

}

function testSavePurchaseHeader(){

    PurchaseRepository.saveHeader({

        header : {

            nomor : "PO-TEST-001",

            tanggal : "2026-08-06",

            supplier : "SUP001",

            admin : "Developer"

        },

        items : [

            {

                kodeBarang : "BRG000114",

                qty : 5,

                hargaBeli : 20000

            },

            {

                kodeBarang : "BRG000115",

                qty : 2,

                hargaBeli : 15000

            }

        ],

        status : "NEW"

    });

}

function testSavePurchaseItems(){

    PurchaseRepository.saveItems({

        header : {

            nomor : "PO-TEST-001"

        },

        items : [

            {

                kodeBarang : "BRG000114",

                qty : 5,

                hargaBeli : 20000

            },

            {

                kodeBarang : "BRG000115",

                qty : 2,

                hargaBeli : 15000

            }

        ]

    });

}