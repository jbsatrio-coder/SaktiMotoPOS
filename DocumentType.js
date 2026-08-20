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

    KELUHAN : "KEL",

    WORK_ORDER : "WO",

    WORK_ORDER_JASA : "WOJ",

    WORK_ORDER_PART : "WOP",

    WORK_ORDER_TIMELINE : "WOT",

    STOCK_LEDGER : "STK",

    PAYMENT : "PAY",

    ATTACHMENT : "ATT",

    ACTIVITY_LOG : "LOG",

    ROLE_PERMISSION : "RPR"

};

function testVehicleRunningNumber(){

    Logger.log(

        RunningNumberService.generate(
            DocumentType.VEHICLE
        )

    );

}