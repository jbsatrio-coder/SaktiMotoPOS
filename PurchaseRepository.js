/**
 * ============================================
 * Purchase Repository
 * Version : 1.1.0
 * Sprint  : 4D.4
 * ============================================
 */

const PurchaseRepository = {

    getColumnMap_(sheet){
        return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
            .reduce(function(map, header, index){ map[String(header).trim()] = index; return map; }, {});
    },

    getHeaderRecord_(row, columns){
        return {
            purchaseNumber : row[columns["ID Pembelian"]] || "",
            submissionId : row[columns.SubmissionId] || "",
            idempotencyKey : row[columns.IdempotencyKey] || "",
            transactionId : row[columns.TransactionId] || "",
            payloadFingerprint : row[columns.PayloadFingerprint] || "",
            status : row[columns.Status] || "",
            row : row
        };
    },

    findBySubmissionId(submissionId){
        const sheet = this.getHeaderSheet();
        const columns = this.getColumnMap_(sheet);
        if(columns.SubmissionId === undefined || !submissionId || sheet.getLastRow() < 2){ return null; }
        const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
        const matches = rows.filter(function(row){ return String(row[columns.SubmissionId] || "").trim() === String(submissionId).trim(); });
        if(matches.length > 1){ throw new Error("Duplicate canonical submissionId ditemukan."); }
        return matches.length ? this.getHeaderRecord_(matches[0], columns) : null;
    },

    findAllBySubmissionId(submissionId){
        const sheet = this.getHeaderSheet();
        const columns = this.getColumnMap_(sheet);
        if(columns.SubmissionId === undefined || !submissionId || sheet.getLastRow() < 2){ return []; }
        return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues().filter(function(row){
            return String(row[columns.SubmissionId] || "").trim() === String(submissionId).trim();
        }).map(function(row){ return PurchaseRepository.getHeaderRecord_(row, columns); });
    },

    findByPurchaseNumber(purchaseNumber){
        const sheet = this.getHeaderSheet();
        const columns = this.getColumnMap_(sheet);
        if(!purchaseNumber || sheet.getLastRow() < 2){ return null; }
        const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
        const row = rows.find(function(item){ return String(item[columns["ID Pembelian"]] || "").trim() === String(purchaseNumber).trim(); });
        return row ? this.getHeaderRecord_(row, columns) : null;
    },

    findItemsByPurchaseNumber(purchaseNumber){
        const sheet = this.getDetailSheet(); const columns = this.getColumnMap_(sheet);
        if(sheet.getLastRow() < 2){ return []; }
        return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues().filter(function(row){
            return String(row[columns["ID Pembelian"]] || "").trim() === String(purchaseNumber).trim();
        }).map(function(row){ return { purchaseNumber : row[columns["ID Pembelian"]], lineId : columns.LineId === undefined ? "" : row[columns.LineId], kodeBarang : row[columns.KodeBarang], qty : row[columns.Qty], hargaBeli : row[columns.HargaBeli], subtotal : row[columns.Subtotal] }; });
    },

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

        const row = [

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
        ];
        const columns = this.getColumnMap_(sheet);
        row[columns.SubmissionId] = purchaseDocument.header.submissionId || "";
        row[columns.IdempotencyKey] = purchaseDocument.header.idempotencyKey || "";
        row[columns.TransactionId] = purchaseDocument.header.transactionId || "";
        row[columns.PayloadFingerprint] = purchaseDocument.header.payloadFingerprint || "";
        sheet.appendRow(row);

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

        const columns = this.getColumnMap_(sheet);
        const rows = purchaseDocument.items.map(item => {
            const row = [];
            row[columns["ID Pembelian"]] = purchaseDocument.header.nomor;
            row[columns.KodeBarang] = item.kodeBarang || item.barangId;
            row[columns.Qty] = Number(item.qty === undefined ? item.quantity : item.qty || 0);
            row[columns.HargaBeli] = Number(item.hargaBeli === undefined ? item.unitCost : item.hargaBeli || 0);
            row[columns.Subtotal] = row[columns.Qty] * row[columns.HargaBeli];
            if(columns.LineId !== undefined){ row[columns.LineId] = item.lineId || item.sourceLineId || ""; }
            return row;
        });

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
