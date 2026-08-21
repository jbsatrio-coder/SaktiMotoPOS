/**
 * ============================================
 * Running Number Service
 * Version : 1.0.0
 * Sprint  : 4D.4
 * ============================================
 */

const RunningNumberService = {

    /**
     * Generate nomor dokumen
     */
    generate(documentType){

        return generateRunningNumber_(

            documentType

        );

    }

    ,

    // Internal only. Caller MUST already own ScriptLock.
    generateNoLock_(documentType){

        return generateRunningNumberNoLock_(

            documentType

        );

    }

};

function testRunningNumberService(){

    Logger.log(

        RunningNumberService.generate("PO")

    );

}

function testGenerateSupplierNumber(){

    const supplierId =

        RunningNumberService.generate(

            DocumentType.SUPPLIER

        );

    Logger.log(supplierId);

}



function testGenerateCustomerNumber(){

    const customerId =

        RunningNumberService.generate(

            DocumentType.CUSTOMER

        );

    Logger.log(customerId);

}
