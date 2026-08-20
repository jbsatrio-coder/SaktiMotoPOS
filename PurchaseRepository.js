/**
 * ============================================
 * Purchase Repository
 * Version : 1.1.0
 * Sprint  : 4D.4
 * ============================================
 */

const PurchaseRepository = {

    /**
     * ==========================================
     * SHEET
     * ==========================================
     */

    getHeaderSheet(){

        return SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName(
                CONFIG.SHEET.PEMBELIAN
            );

    },

    getDetailSheet(){

        return SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName(
                CONFIG.SHEET.DETAIL_PEMBELIAN
            );

    },


    /**
     * ==========================================
     * SAVE HEADER
     * ==========================================
     */

    saveHeader(purchaseDocument){

        const sheet =
            this.getHeaderSheet();

        const totalItem =
            purchaseDocument.items.length;

        const totalQty =
            purchaseDocument.items.reduce(

                (total, item) =>

                    total + Number(item.qty || 0),

                0

            );

        sheet.appendRow([

            purchaseDocument.header.nomor,       // A ID Pembelian

            purchaseDocument.header.tanggal,     // B Tanggal

            purchaseDocument.header.supplier,    // C Supplier

            purchaseDocument.header.noFaktur || "", // D No.Faktur

            totalItem,                            // E TotalItem

            totalQty,                             // F TotalQty

            purchaseDocument.status,              // G Status

            purchaseDocument.header.admin,        // H Admin

            purchaseDocument.header.keterangan || "", // I Keterangan

            new Date()                            // J CreatedAt

        ]);

        Logger.log(
            "[PURCHASE HEADER] OK"
        );

    },


    /**
     * ==========================================
     * UPDATE PURCHASE STATUS
     * ==========================================
     */

    updateStatus(purchaseNumber, status){

        const sheet =
            this.getHeaderSheet();

        const lastRow =
            sheet.getLastRow();

        if(lastRow < 2){
            throw new Error(
                "Purchase Header masih kosong."
            );
        }

        const data =
            sheet
                .getRange(
                    2,
                    1,
                    lastRow - 1,
                    1
                )
                .getDisplayValues();

        let targetRow = 0;

        for(let i = 0; i < data.length; i++){

            if(
                String(data[i][0]).trim() ===
                String(purchaseNumber).trim()
            ){

                targetRow = i + 2;
                break;

            }

        }

        if(targetRow === 0){

            throw new Error(
                "Purchase tidak ditemukan : " +
                purchaseNumber
            );

        }

        // G = Status
        sheet
            .getRange(
                targetRow,
                7
            )
            .setValue(status);

        Logger.log(
            "[PURCHASE STATUS] " +
            purchaseNumber +
            " -> " +
            status
        );

        return true;

    },



    /**
     * ==========================================
     * SAVE DETAIL
     * ==========================================
     */

    saveItems(purchaseDocument){

        const sheet =
            this.getDetailSheet();

        const rows =
            purchaseDocument.items.map(item => [

                purchaseDocument.header.nomor,    // A

                item.kodeBarang,                  // B

                Number(item.qty || 0),            // C

                Number(item.hargaBeli || 0),      // D

                Number(item.qty || 0) *
                Number(item.hargaBeli || 0)       // E

            ]);

        if(rows.length > 0){

            sheet
                .getRange(

                    sheet.getLastRow() + 1,

                    1,

                    rows.length,

                    rows[0].length

                )
                .setValues(rows);

        }

        Logger.log(
            "[PURCHASE DETAIL] OK"
        );

    }

};


/**
 * ============================================
 * TEST
 * ============================================
 */

function testPurchaseRepository(){

    const header =
        PurchaseRepository.getHeaderSheet();

    const detail =
        PurchaseRepository.getDetailSheet();

    Logger.log(
        "HEADER: " +
        header.getName()
    );

    Logger.log(
        "DETAIL: " +
        detail.getName()
    );

}
function testSavePurchaseHeader(){

    const purchaseDocument = {

        header : {

            nomor : "PO-TEST-HEADER-001",

            tanggal : "2026-08-17",

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

        status : PurchaseStatus.NEW

    };

    PurchaseRepository.saveHeader(
        purchaseDocument
    );

    Logger.log(
        "[TEST] Purchase Header berhasil disimpan."
    );

}

function testSavePurchaseItems(){

    const purchaseDocument = {

        header : {

            nomor : "PO-TEST-HEADER-001"

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

    };

    PurchaseRepository.saveItems(
        purchaseDocument
    );

    Logger.log(
        "[TEST] Purchase Detail berhasil disimpan."
    );

}

function testSavePurchaseHeaderWithInvoice(){

    const purchaseDocument = {

        header : {

            nomor : "PO-TEST-HEADER-002",

            tanggal : "2026-08-17",

            supplier : "SUP001",

            noFaktur : "FAKTUR-TEST-002",

            admin : "Developer",

            keterangan :
                "Pembelian oli dan sparepart"

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

        status : PurchaseStatus.NEW

    };

    PurchaseRepository.saveHeader(
        purchaseDocument
    );

    Logger.log(
        "[TEST] Header dengan NoFaktur + Keterangan berhasil disimpan."
    );

}
