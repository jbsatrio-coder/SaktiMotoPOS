/**
 * ============================================
 * Document Type
 * Version : 1.0.0
 * Sprint  : 4D.4
 * ============================================
 */

const DocumentType = {

    PURCHASE : "PO",

    SALES : "SO",

    SUPPLIER : "SUP",

    CUSTOMER : "CUS",

    VEHICLE : "VEH"

};

function testVehicleRunningNumber(){

    Logger.log(

        RunningNumberService.generate(
            DocumentType.VEHICLE
        )

    );

}