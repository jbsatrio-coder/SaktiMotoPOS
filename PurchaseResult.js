

/**
 * ============================================
 * Purchase Result
 * Version : 1.0.0
 * Sprint  : 4D.3
 * ============================================
 */

const PurchaseResult = {

    create(batchResult, purchaseDocument){

        return {

            purchaseNumber :
                purchaseDocument.header.nomor,

            status :
                PurchaseStatus.POSTED,

            headerSaved : true,

            detailSaved : true,

            inventoryUpdated :
                batchResult.success,

            batchResult :
                batchResult

        };

    }

};