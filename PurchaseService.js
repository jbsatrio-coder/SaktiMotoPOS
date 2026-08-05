/**
 * ============================================
 * Purchase Service
 * Version : 0.1.0
 * Sprint  : 4D.1
 * ============================================
 */

const PurchaseService = {


    /**
     * Membuat Purchase Document
     */
    createPurchaseDocument(purchase){

        return {

            header : {

    nomor : RunningNumberService.generate(

        DocumentType.PURCHASE

    ),

    tanggal : purchase.tanggal,

    supplier : purchase.supplier,

    admin : purchase.admin

},

            items : purchase.items,

          status : PurchaseStatus.NEW

        };

    },

    /**
 * Membuat movement untuk Inventory Engine
 */
createPurchaseMovement(item, purchaseDocument){

    return {

        kodeBarang : item.kodeBarang,

        movementType : MovementType.PURCHASE,

        qty : item.qty,

        reference : purchaseDocument.header.nomor,

        note : "Purchase",

        performedBy : purchaseDocument.header.admin

    };

},

/**
 * Membuat seluruh movement dari Purchase Document
 */
createPurchaseMovements(purchaseDocument){

    return purchaseDocument.items.map(item => {

        return this.createPurchaseMovement(

            item,

            purchaseDocument

        );

    });

},

    /**
     * Receive Purchase
     */
receivePurchase(purchase){

    const purchaseDocument =
        this.createPurchaseDocument(
            purchase
        );

    // Simpan Header
    PurchaseRepository.saveHeader(
        purchaseDocument
    );

    // Simpan Detail
    PurchaseRepository.saveItems(
        purchaseDocument
    );

    // Buat Movement
    const movements =
        this.createPurchaseMovements(
            purchaseDocument
        );

    // Update Inventory
   const batchResult =
    InventoryService.moveStockBatch(
        movements
    );

const purchaseResult =
    PurchaseResult.create(

        batchResult,

        purchaseDocument

    );

Logger.log(

    JSON.stringify(

        purchaseResult,

        null,

        2

    )

);

return purchaseResult;

}

};

function testReceivePurchase(){

    PurchaseService.receivePurchase({

    tanggal : "2026-08-05",

    supplier : "SUP001",

    admin : "Developer",

    items : [

        {

            kodeBarang : "BRG000114",

            qty : 5,

            hargaBeli : 20000

        }

    ]

});
    

}

