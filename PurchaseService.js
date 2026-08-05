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

                nomor : purchase.nomor,

                tanggal : purchase.tanggal,

                supplier : purchase.supplier,

                admin : purchase.admin

            },

            items : purchase.items,

            status : "NEW"

        };

    },

    /**
 * Membuat movement untuk Inventory Engine
 */
createPurchaseMovement(item, purchaseDocument){

    return {

        kodeBarang : item.kodeBarang,

        movementType : "PURCHASE",

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

    const movements =
        this.createPurchaseMovements(
            purchaseDocument
        );

    const batchResult =
        InventoryService.moveStockBatch(
            movements
        );

    Logger.log(

        JSON.stringify(

            batchResult,

            null,

            2

        )

    );

    return batchResult;

}

};

function testReceivePurchase(){

    PurchaseService.receivePurchase({

        nomor : "PO000001",

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

