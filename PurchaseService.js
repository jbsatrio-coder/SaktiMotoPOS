/**
 * ============================================
 * Purchase Service
 * Version : 1.1.0
 * Sprint  : 4D.4
 * ============================================
 */

const PurchaseService = {

    testHooks_ : null,

    setTestHooksForTest_(hooks){
        this.testHooks_ = hooks || null;
    },

    updateCanonicalStatus_(purchaseNumber, status){
        if(this.testHooks_ && typeof this.testHooks_.beforeStatusUpdate === "function"){
            this.testHooks_.beforeStatusUpdate(purchaseNumber, status);
        }
        return PurchaseRepository.updateStatus(purchaseNumber, status);
    },

    getCanonicalPurchaseDocument_(purchaseNumber){
        const record = PurchaseRepository.findByPurchaseNumber(purchaseNumber);
        if(!record){
            throw new Error("Purchase canonical tidak ditemukan: " + purchaseNumber);
        }
        return {
            header : {
                nomor : record.purchaseNumber,
                tanggal : record.row[1],
                supplier : record.row[2],
                noFaktur : record.row[3],
                admin : record.row[7],
                keterangan : record.row[8],
                submissionId : record.submissionId,
                idempotencyKey : record.idempotencyKey,
                transactionId : record.transactionId,
                payloadFingerprint : record.payloadFingerprint
            },
            items : PurchaseRepository.findItemsByPurchaseNumber(record.purchaseNumber),
            status : record.status
        };
    },

    createCanonicalPurchaseResult_(receipt, purchaseDocument, status, options){
        const batchResult = {
            success : true,
            results : receipt.lines.map(function(line){
                return {
                    kodeBarang : line.barangId,
                    qty : line.qty,
                    stokAwal : line.stokAwal,
                    stokAkhir : line.stokAkhir,
                    ledgerId : line.ledgerId
                };
            })
        };
        const result = PurchaseResult.create(batchResult, purchaseDocument, status);
        result.alreadyRecorded = receipt.alreadyRecorded === true;
        result.resumed = options && options.resumed === true;
        result.transactionId = receipt.transactionId;
        result.idempotencyKey = receipt.idempotencyKey;
        result.submissionId = purchaseDocument.header.submissionId;
        result.ledgerIds = receipt.ledgerIds.slice();
        return result;
    },

    receiveCanonicalPurchase_(purchase){
        const prepared = prepareCanonicalPurchaseSubmission(purchase);
        const purchaseDocument = this.getCanonicalPurchaseDocument_(prepared.purchaseNumber);
        const currentStatus = String(purchaseDocument.status || "").trim();
        let receipt = null;
        let inventoryCommitted = false;

        if(currentStatus === PurchaseStatus.POSTED){
            receipt = CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(prepared.plan);
            return this.createCanonicalPurchaseResult_(receipt, purchaseDocument, PurchaseStatus.POSTED, {
                resumed : true
            });
        }

        if([PurchaseStatus.NEW, PurchaseStatus.POSTING, PurchaseStatus.FAILED].indexOf(currentStatus) < 0){
            throw new Error("Status Purchase canonical tidak dapat diproses: " + currentStatus);
        }

        try{
            if(currentStatus !== PurchaseStatus.POSTING){
                this.updateCanonicalStatus_(prepared.purchaseNumber, PurchaseStatus.POSTING);
            }

            receipt = CanonicalPurchaseInventoryService.recordPurchaseInBatchAtomic(prepared.plan);
            inventoryCommitted = true;
            this.updateCanonicalStatus_(prepared.purchaseNumber, PurchaseStatus.POSTED);

            return this.createCanonicalPurchaseResult_(receipt, purchaseDocument, PurchaseStatus.POSTED, {
                resumed : prepared.alreadyPrepared || receipt.alreadyRecorded
            });
        }
        catch(error){
            if(!inventoryCommitted){
                try{
                    this.updateCanonicalStatus_(prepared.purchaseNumber, PurchaseStatus.FAILED);
                }
                catch(statusError){
                    Logger.log("[CANONICAL PURCHASE STATUS UPDATE FAILED] " + statusError.message);
                }
                throw error;
            }

            throw new Error("Canonical Purchase inventory sudah committed; finalisasi POSTED perlu retry. " + error.message);
        }
    },


    /**
     * ==========================================
     * CREATE PURCHASE DOCUMENT
     * ==========================================
     */

    createPurchaseDocument(purchase, options){

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
                options && options.purchaseNumber ||
                RunningNumberService.generate(DocumentType.PURCHASE),

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

        if(purchase && String(purchase.submissionId || "").trim()){
            return this.receiveCanonicalPurchase_(purchase);
        }

        return this.receivePurchaseLegacy_(purchase);
    },

    receivePurchaseLegacy_(purchase){

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

    if(!data || !String(data.submissionId || "").trim()){
        throw new Error("submissionId Purchase wajib diisi.");
    }

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
