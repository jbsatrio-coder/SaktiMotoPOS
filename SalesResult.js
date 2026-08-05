/**
 * ============================================
 * Sales Result
 * Version : 1.0.0
 * Sprint  : 4D.5
 * ============================================
 */

const SalesResult = {

    create(batchResult, salesDocument){

        return {

            transactionNumber :

                salesDocument.header.noTransaksi,

            status :

                salesDocument.header.status,

            headerSaved : true,

            detailSaved : true,

            inventoryUpdated :

                batchResult.success,

            batchResult :

                batchResult

        };

    }

};

function testSalesResult(){

    const result = SalesResult.create(

        {

            success : true

        },

        {

            header : {

                noTransaksi : "INV2608060001",

                status : SalesStatus.LUNAS

            }

        }

    );

    Logger.log(

        JSON.stringify(

            result,

            null,

            2

        )

    );

}