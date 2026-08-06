/**
 * ============================================
 * Test Suite
 * Sprint 4D.7
 * ============================================
 */

const TestSuite = {

    run(){

        Logger.log("================================");
        Logger.log("SAKTI MOTO REGRESSION TEST");
        Logger.log("================================");

        this.runningNumber();

        this.inventory();

        this.purchase();

        this.sales();

        Logger.log("================================");
        Logger.log("ALL TEST COMPLETED");
        Logger.log("================================");

    },

    runningNumber(){

        Logger.log("Running Number");

        testRunningNumberService();

    },

    inventory(){

        Logger.log("Inventory");

        testMoveStockSale();

    },

    purchase(){

        Logger.log("Purchase");

        testReceivePurchase();

    },

    sales(){

        Logger.log("Sales");

        testSaveSale();

        testSaveTransaction();

    }

};

function runRegressionTest(){

    TestSuite.run();

}