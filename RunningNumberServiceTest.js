function testStockLedgerRunningNumber(){

    const stockLedgerId =
        RunningNumberService.generate(
            DocumentType.STOCK_LEDGER
        );

    Logger.log(
        "STOCK LEDGER ID:"
    );

    Logger.log(
        stockLedgerId
    );

}