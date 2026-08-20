/**
 * ============================================
 * Purchase Service
 * Version : 1.1.0
 * Sprint  : 4D.4
 * ============================================
 */

const PurchaseService = {


    /**
     * ==========================================
     * CREATE PURCHASE DOCUMENT
     * ==========================================
     */

    createPurchaseDocument(purchase){

    if (!purchase) {
        throw new Error(
            "Data purchase wajib diisi."
        );
    }

    if (!purchase.supplier) {
        throw new Error(
            "Supplier wajib diisi."
        );
    }

    if (!purchase.admin) {
        throw new Error(
            "Admin wajib diisi."
        );
    }

    if (
        !Array.isArray(purchase.items) ||
        purchase.items.length === 0
    ) {
        throw new Error(
            "Item purchase wajib diisi."
        );
    }

    return {

        header : {

            nomor :
                RunningNumberService.generate(
                    DocumentType.PURCHASE
                ),

            tanggal :
                purchase.tanggal ||
                new Date(),

            supplier :
                String(
                    purchase.supplier
                ).trim(),

            noFaktur :
                String(
                    purchase.noFaktur || ""
                ).trim(),

            admin :
                String(
                    purchase.admin
                ).trim(),

            keterangan :
                String(
                    purchase.keterangan || ""
                ).trim()

        },

        items : purchase.items,

        status :
            PurchaseStatus.NEW

    };

},


    /**
     * ==========================================
     * CREATE INVENTORY MOVEMENT
     * ==========================================
     */

    createPurchaseMovement(
        item,
        purchaseDocument
    ){

        return {

            kodeBarang :
                item.kodeBarang,

            movementType :
                MovementType.PURCHASE,

            qty :
                Number(item.qty || 0),

            reference :
                purchaseDocument.header.nomor,

            note :
                "Purchase",

            performedBy :
                purchaseDocument.header.admin

        };

    },


    /**
     * ==========================================
     * CREATE ALL MOVEMENTS
     * ==========================================
     */

    createPurchaseMovements(
        purchaseDocument
    ){

        return purchaseDocument.items.map(
            item => {

                return this.createPurchaseMovement(
                    item,
                    purchaseDocument
                );

            }
        );

    },


    /**
     * ==========================================
     * RECEIVE PURCHASE
     * ==========================================
     */

    receivePurchase(purchase){

        const purchaseDocument =
            this.createPurchaseDocument(
                purchase
            );


        // ======================================
        // SIMPAN HEADER
        // Status awal = NEW
        // ======================================

        PurchaseRepository.saveHeader(
            purchaseDocument
        );


        // ======================================
        // STATUS = POSTING
        // ======================================

        PurchaseRepository.updateStatus(
            purchaseDocument.header.nomor,
            PurchaseStatus.POSTING
        );


        try {

            // ==================================
            // SIMPAN DETAIL
            // ==================================

            PurchaseRepository.saveItems(
                purchaseDocument
            );


            // ==================================
            // BUAT INVENTORY MOVEMENT
            // ==================================

            const movements =
                this.createPurchaseMovements(
                    purchaseDocument
                );


            // ==================================
            // UPDATE INVENTORY
            // ==================================

            const batchResult =
                InventoryService.moveStockBatch(
                    movements
                );


            // ==================================
            // STATUS = POSTED
            // ==================================

            PurchaseRepository.updateStatus(
                purchaseDocument.header.nomor,
                PurchaseStatus.POSTED
            );


            // ==================================
            // BUAT RESULT
            // ==================================

            const purchaseResult =
                PurchaseResult.create(
                    batchResult,
                    purchaseDocument,
                    PurchaseStatus.POSTED
                );


            Logger.log(
                JSON.stringify(
                    purchaseResult,
                    null,
                    2
                )
            );


            return purchaseResult;


        } catch(error) {

            // ==================================
            // STATUS = FAILED
            // ==================================

            try {

                PurchaseRepository.updateStatus(
                    purchaseDocument.header.nomor,
                    PurchaseStatus.FAILED
                );

            } catch(statusError) {

                Logger.log(
                    "[PURCHASE STATUS UPDATE FAILED] " +
                    statusError.message
                );

            }


            Logger.log(
                "[PURCHASE FAILED] " +
                error.message
            );

            throw error;

        }

    }

};


/**
 * ============================================
 * TEST CREATE PURCHASE DOCUMENT
 * ============================================
 *
 * TEST INI TIDAK MENYIMPAN DATA.
 * TEST INI TIDAK MENGUBAH STOK.
 */

function testCreatePurchaseDocument(){

    const purchaseDocument =
        PurchaseService.createPurchaseDocument({

            tanggal :
                "2026-08-17",

            supplier :
                "SUP001",

            noFaktur :
                "FAKTUR-TEST-001",

            admin :
                "Developer",

            keterangan :
                "Test Purchase Document",

            items : [

                {

                    kodeBarang :
                        "BRG000114",

                    qty :
                        5,

                    hargaBeli :
                        20000

                },

                {

                    kodeBarang :
                        "BRG000115",

                    qty :
                        2,

                    hargaBeli :
                        15000

                }

            ]

        });


    Logger.log(
        JSON.stringify(
            purchaseDocument,
            null,
            2
        )
    );

}

function testCreatePurchaseMovements(){

    const purchaseDocument = {

        header : {

            nomor : "PO-TEST-MOVEMENT",

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

        ]

    };


    const movements =
        PurchaseService.createPurchaseMovements(
            purchaseDocument
        );


    Logger.log(
        JSON.stringify(
            movements,
            null,
            2
        )
    );

}
function testCreatePurchaseDocumentFull(){

    const purchase =
        {
            tanggal : "2026-08-17",

            supplier : "SUP001",

            admin : "Developer",

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

    const document =
        PurchaseService.createPurchaseDocument(
            purchase
        );

    Logger.log(
        JSON.stringify(
            document,
            null,
            2
        )
    );

}

function testCreatePurchaseDocumentWithInvoice(){

    const purchase = {

        tanggal : "2026-08-17",

        supplier : "SUP001",

        noFaktur : "FAKTUR-TEST-002",

        admin : "Developer",

        keterangan :
            "Pembelian oli dan sparepart",

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

    const document =
        PurchaseService.createPurchaseDocument(
            purchase
        );

    Logger.log(
        JSON.stringify(
            document,
            null,
            2
        )
    );

}

/**
 * ============================================
 * UI ADAPTER
 * ============================================
 * Dipanggil oleh FormPembelian.html
 */
function submitPurchase(data){

    return PurchaseService.receivePurchase(
        data
    );

}


function testReceivePurchaseE2E(){

    const result =
        PurchaseService.receivePurchase({

            tanggal : "2026-08-17",

            supplier : "SUP001",

            noFaktur : "E2E-TEST-001",

            admin : "Developer",

            keterangan :
                "E2E Purchase Test",

            items : [

                {
                    kodeBarang : "BRG000114",
                    qty : 2,
                    hargaBeli : 20000
                },

                {
                    kodeBarang : "BRG000115",
                    qty : 3,
                    hargaBeli : 15000
                }

            ]

        });

    Logger.log(
        "[E2E PURCHASE RESULT]"
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testReceivePurchaseFailed(){

    try {

        PurchaseService.receivePurchase({

            tanggal : "2026-08-17",

            supplier : "SUP001",

            noFaktur : "FAILED-TEST-001",

            admin : "Developer",

            keterangan :
                "TEST FAILED PURCHASE",

            items : [

                {
                    kodeBarang : "KODE-TIDAK-ADA-999",
                    qty : 1,
                    hargaBeli : 10000
                }

            ]

        });

        throw new Error(
            "TEST GAGAL: Purchase seharusnya menghasilkan error."
        );

    } catch(error) {

        Logger.log(
            "[EXPECTED PURCHASE FAILURE]"
        );

        Logger.log(
            error.message
        );

    }

}
