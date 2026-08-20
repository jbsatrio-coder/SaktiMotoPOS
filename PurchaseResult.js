

/**
 * ============================================
 * Purchase Result
 * Version : 1.0.0
 * Sprint  : 4D.3
 * ============================================
 */

const PurchaseResult = {

    create(
        batchResult,
        purchaseDocument,
        status
    ){

        return {

            purchaseNumber :
                purchaseDocument.header.nomor,

            status :
                status ||
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