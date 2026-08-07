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

    VEHICLE : "VEH",

    WORK_ORDER : "WO",

    WORK_ORDER_JASA : "WOJ",

    WORK_ORDER_PART : "WOP",

    WORK_ORDER_TIMELINE : "WOT",

    PAYMENT : "PAY",

    ATTACHMENT : "ATT",

    ACTIVITY_LOG : "LOG"

};

function testVehicleRunningNumber(){

    Logger.log(

        RunningNumberService.generate(
            DocumentType.VEHICLE
        )

    );

}