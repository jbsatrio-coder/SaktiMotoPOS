function testWorkOrderPartServiceCreate(){

    const result =
        WorkOrderPartService.create({

            workOrderId :
                "WO2608090002",

            workOrderJasaId :
                "WOJ2608090001",

            barangId :
                "BRG000001",

            qty :
                2,

            harga :
                55000,

            diskon :
                5000,

            catatan :
                "Test Service"

        });


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testWorkOrderPartServiceReadBack(){

    const result =
        WorkOrderPartRepository.findById(
            "WOP2608100001"
        );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

/**
 * ============================================
 * TEST VALIDASI WORK ORDER PART SERVICE
 * ============================================
 */

function testWorkOrderPartServiceValidation(){

    const tests = [

        {
            name : "Request kosong",

            request : null
        },


        {
            name : "Work Order kosong",

            request : {

                barangId : "BRG000001",

                qty : 1

            }

        },


        {
            name : "Barang kosong",

            request : {

                workOrderId : "WO2608090002",

                qty : 1

            }

        },


        {
            name : "Work Order tidak ditemukan",

            request : {

                workOrderId : "WO9999999999",

                barangId : "BRG000001",

                qty : 1

            }

        },


        {
            name : "Barang tidak ditemukan",

            request : {

                workOrderId : "WO2608090002",

                barangId : "BRG999999",

                qty : 1

            }

        },


        {
            name : "Qty nol",

            request : {

                workOrderId : "WO2608090002",

                barangId : "BRG000001",

                qty : 0

            }

        },


        {
            name : "Qty negatif",

            request : {

                workOrderId : "WO2608090002",

                barangId : "BRG000001",

                qty : -1

            }

        },


        {
            name : "Harga negatif",

            request : {

                workOrderId : "WO2608090002",

                barangId : "BRG000001",

                qty : 1,

                harga : -1000

            }

        },


        {
            name : "Diskon negatif",

            request : {

                workOrderId : "WO2608090002",

                barangId : "BRG000001",

                qty : 1,

                harga : 50000,

                diskon : -1000

            }

        }

    ];


    for(
        let i = 0;
        i < tests.length;
        i++
    ){

        const test =
            tests[i];


        try{

            WorkOrderPartService.create(
                test.request
            );


            Logger.log(
                "FAIL : " +
                test.name +
                " → tidak menghasilkan error."
            );

        }
        catch(error){

            Logger.log(
                "PASS : " +
                test.name +
                " → " +
                error.message
            );

        }

    }

}

function testWorkOrderPartServiceBuildStockOutRequest(){

    const workOrderPart =
        WorkOrderPartRepository.findById(
            "WOP2608100001"
        );


    Logger.log(
        "WORK ORDER PART:"
    );

    Logger.log(
        JSON.stringify(
            workOrderPart
        )
    );


    const request =
        WorkOrderPartService
            .buildStockOutRequest(
                workOrderPart
            );


    Logger.log(
        "STOCK OUT REQUEST:"
    );

    Logger.log(
        JSON.stringify(
            request
        )
    );

}

function testWorkOrderPartServiceIsStockOutRecorded(){

    const workOrderPartId =
        "WOP2608100001";


    const result =
        WorkOrderPartService
            .isStockOutRecorded(
                workOrderPartId
            );


    Logger.log(
        "STOCK OUT RECORDED:"
    );


    Logger.log(
        result
    );

}

function testWorkOrderPartServiceConsumeStock(){

    const workOrderPartId =
        "WOP2608100001";


    Logger.log(
        "STOK SEBELUM:"
    );


    const barangBefore =
        BarangRepository.findById(
            "BRG000001"
        );


    Logger.log(
        Number(
            barangBefore[
                COL_BARANG.STOK
            ]
        )
    );


    const result =
        WorkOrderPartService
            .consumeStock(
                workOrderPartId
            );


    Logger.log(
        "CONSUME STOCK RESULT:"
    );


    Logger.log(
        JSON.stringify(
            result
        )
    );


    const barangAfter =
        BarangRepository.findById(
            "BRG000001"
        );


    Logger.log(
        "STOK SESUDAH:"
    );


    Logger.log(
        Number(
            barangAfter[
                COL_BARANG.STOK
            ]
        )
    );

}

function testStockLedgerServiceRecordOutBatchAtomicSuccess(){

    const result =
        StockLedgerService.recordOutBatchAtomic([

            {
                barangId : "BRG000001",
                namaBarang : "kampas rem Mio M3",
                qty : 2,
                jenisMutasi : "SERVICE",
                referensi : "WOP_BATCH_TEST_001",
                keterangan : "Test Batch Item 1",
                admin : "Developer"
            },

            {
                barangId : "BRG000002",
                namaBarang : "Test Barang 2",
                qty : 1,
                jenisMutasi : "SERVICE",
                referensi : "WOP_BATCH_TEST_002",
                keterangan : "Test Batch Item 2",
                admin : "Developer"
            }

        ]);


    Logger.log(
        "BATCH RESULT:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );

}

function testWOPConsumeStockBatch20260814(){

    Logger.log(
        "### UNIQUE WOP BATCH TEST 20260814 ###"
    );


    const result =
        WorkOrderPartService
            .consumeStockBatch(
                "WO2608090002"
            );


    Logger.log(
        "CONSUME STOCK BATCH RESULT:"
    );


    Logger.log(
        JSON.stringify(
            result
        )
    );

}

function testCreateWorkOrderPartsForBatch(){

    const workOrderId =
        "WO2608090002";


    /**
     * ========================================
     * PART 1
     * ========================================
     */

    const part1 =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            workOrderJasaId :
                "WOJ2608090001",

            barangId :
                "BRG000001",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Batch Test Part 1"

        });


    Logger.log(
        "PART 1 CREATED:"
    );

    Logger.log(
        JSON.stringify(
            part1
        )
    );

    const part1Id =
    part1.workOrderPartId;


WorkOrderPartService.changeStatus(
    part1Id,
    WorkOrderPartStatus.PROGRESS
);


    /**
     * ========================================
     * PART 2
     * ========================================
     */

    const part2 =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            workOrderJasaId :
                "WOJ2608090001",

            barangId :
                "BRG000002",

            qty :
                1,

            harga :
                50000,

            diskon :
                0,



            catatan :
                "Batch Test Part 2"

        });


    Logger.log(
        "PART 2 CREATED:"
    );

    Logger.log(
        JSON.stringify(
            part2
        )
    );

    const part2Id =
    part2.workOrderPartId;


WorkOrderPartService.changeStatus(
    part2Id,
    WorkOrderPartStatus.PROGRESS
);

}

function testWorkOrderPartStockLedgerAudit(){

    const workOrderId =
        "WO2608100001";


    /**
     * ========================================
     * AMBIL SEMUA WORK ORDER PART
     * ========================================
     */

    const parts =
        WorkOrderPartRepository
            .findByWorkOrderId(
                workOrderId
            );


    Logger.log(
        "WORK ORDER PART COUNT:"
    );

    Logger.log(
        parts.length
    );


    /**
     * ========================================
     * AUDIT SETIAP WOP
     * ========================================
     */

    const results = [];


    for(
        let i = 0;
        i < parts.length;
        i++
    ){

        const part =
            parts[i];


        const workOrderPartId =
            part[
                COL_WORK_ORDER_PART.ID
            ];


        const barangId =
            part[
                COL_WORK_ORDER_PART.BARANG_ID
            ];


        const qty =
            Number(
                part[
                    COL_WORK_ORDER_PART.QTY
                ]
            ) || 0;


        /**
         * Cari Stock Ledger berdasarkan
         * referensi = WorkOrderPart ID
         */

        const ledger =
            findStockLedgerByReference_(
                workOrderPartId
            );


        results.push({

            workOrderPartId :
                workOrderPartId,

            barangId :
                barangId,

            qty :
                qty,

            ledgerCount :
                ledger.length,

            valid :
                ledger.length === 1,

            ledger :
                ledger.map(
                    function(row){

                        return {

                            id :
                                row[
                                    COL_STOK.ID
                                ],

                            qtyKeluar :
                                Number(
                                    row[
                                        COL_STOK.QTYKELUAR
                                    ]
                                ) || 0,

                            stokAwal :
                                Number(
                                    row[
                                        COL_STOK.STOKAWAL
                                    ]
                                ) || 0,

                            stokAkhir :
                                Number(
                                    row[
                                        COL_STOK.STOKAKHIR
                                    ]
                                ) || 0

                        };

                    }
                )

        });

    }


    /**
     * ========================================
     * OUTPUT
     * ========================================
     */

    Logger.log(
        "WORK ORDER PART STOCK AUDIT:"
    );

    Logger.log(
        JSON.stringify(
            results
        )
    );

}


/**
 * ============================================
 * Helper:
 * Find Stock Ledger By Reference
 * ============================================
 */
function findStockLedgerByReference_(
    reference
){

    const sh =
        StockLedgerRepository.sheet();


    const lastRow =
        sh.getLastRow();


    if(lastRow < 2){

        return [];

    }


    const data =
        sh.getRange(
            2,
            1,
            lastRow - 1,
            COL_STOK.CREATEDAT + 1
        ).getValues();


    const results = [];


    for(
        let i = 0;
        i < data.length;
        i++
    ){

        const currentReference =
            String(
                data[i][
                    COL_STOK.REFERENSI
                ]
            ).trim();


        if(
            currentReference ===
            String(reference).trim()
        ){

            results.push(
                data[i]
            );

        }

    }


    return results;

}

function testWorkOrderPartStockLedgerAudit(){

    const workOrderId =
        "WO2608100001";


    /**
     * ========================================
     * AMBIL SEMUA WORK ORDER PART
     * ========================================
     */

    const parts =
        WorkOrderPartRepository
            .findByWorkOrderId(
                workOrderId
            );


    Logger.log(
        "WORK ORDER PART COUNT:"
    );

    Logger.log(
        parts.length
    );


    /**
     * ========================================
     * AUDIT SETIAP WOP
     * ========================================
     */

    const results = [];


    for(
        let i = 0;
        i < parts.length;
        i++
    ){

        const part =
            parts[i];


        const workOrderPartId =
            part[
                COL_WORK_ORDER_PART.ID
            ];


        const barangId =
            part[
                COL_WORK_ORDER_PART.BARANG_ID
            ];


        const qty =
            Number(
                part[
                    COL_WORK_ORDER_PART.QTY
                ]
            ) || 0;


        /**
         * Cari Stock Ledger berdasarkan:
         *
         * REFERENSI = WorkOrderPart ID
         */

        const ledger =
            findStockLedgerByReference_(
                workOrderPartId
            );


        const ledgerValid =
            ledger.length === 1;


        let qtyLedger = 0;


        if(ledger.length === 1){

            qtyLedger =
                Number(
                    ledger[0][
                        COL_STOK.QTYKELUAR
                    ]
                ) || 0;

        }


        const qtyMatch =
            ledger.length === 1 &&
            qtyLedger === qty;


        const barangMatch =
            ledger.length === 1 &&
            String(
                ledger[0][
                    COL_STOK.BARANG_ID
                ]
            ).trim() ===
            String(barangId).trim();


        results.push({

            workOrderPartId :
                workOrderPartId,

            barangId :
                barangId,

            qtyWOP :
                qty,

            ledgerCount :
                ledger.length,

            ledgerValid :
                ledgerValid,

            qtyLedger :
                qtyLedger,

            qtyMatch :
                qtyMatch,

            barangMatch :
                barangMatch,

            valid :
                ledgerValid &&
                qtyMatch &&
                barangMatch

        });

    }


    /**
     * ========================================
     * HASIL AUDIT
     * ========================================
     */

    const allValid =
        results.every(
            function(item){

                return item.valid;

            }
        );


    Logger.log(
        "WORK ORDER PART STOCK AUDIT:"
    );

    Logger.log(
        JSON.stringify(
            results
        )
    );


    Logger.log(
        "AUDIT VALID:"
    );

    Logger.log(
        allValid
    );

}


/**
 * ============================================
 * Find Stock Ledger By Reference
 * ============================================
 */
function findStockLedgerByReference_(
    reference
){

    const sh =
        StockLedgerRepository.sheet();


    const lastRow =
        sh.getLastRow();


    if(lastRow < 2){

        return [];

    }


    const data =
        sh.getRange(
            2,
            1,
            lastRow - 1,
            COL_STOK.CREATEDAT + 1
        ).getValues();


    const results = [];


    for(
        let i = 0;
        i < data.length;
        i++
    ){

        const currentReference =
            String(
                data[i][
                    COL_STOK.REFERENSI
                ]
            ).trim();


        if(
            currentReference ===
            String(reference).trim()
        ){

            results.push(
                data[i]
            );

        }

    }


    return results;

}

function testWorkOrderPartStockLedgerBarangIdDiagnostic(){

    const workOrderId =
        "WO2608100001";


    const parts =
        WorkOrderPartRepository
            .findByWorkOrderId(
                workOrderId
            );


    for(
        let i = 0;
        i < parts.length;
        i++
    ){

        const part =
            parts[i];


        const workOrderPartId =
            part[
                COL_WORK_ORDER_PART.ID
            ];


        const wopBarangId =
            part[
                COL_WORK_ORDER_PART.BARANG_ID
            ];


        const ledger =
            findStockLedgerByReference_(
                workOrderPartId
            );


        Logger.log(
            "================================"
        );


        Logger.log(
            "WOP ID:"
        );

        Logger.log(
            workOrderPartId
        );


        Logger.log(
            "WOP BARANG_ID:"
        );

        Logger.log(
            JSON.stringify(
                wopBarangId
            )
        );


        Logger.log(
            "WOP BARANG_ID TYPE:"
        );

        Logger.log(
            typeof wopBarangId
        );


        if(ledger.length === 0){

            Logger.log(
                "LEDGER: TIDAK DITEMUKAN"
            );

            continue;

        }


        const ledgerBarangId =
            ledger[0][
                COL_STOK.BARANG_ID
            ];


        Logger.log(
            "LEDGER ID:"
        );

        Logger.log(
            ledger[0][
                COL_STOK.ID
            ]
        );


        Logger.log(
            "LEDGER BARANG_ID:"
        );

        Logger.log(
            JSON.stringify(
                ledgerBarangId
            )
        );


        Logger.log(
            "LEDGER BARANG_ID TYPE:"
        );

        Logger.log(
            typeof ledgerBarangId
        );


        Logger.log(
            "WOP STRING:"
        );

        Logger.log(
            String(
                wopBarangId
            ).trim()
        );


        Logger.log(
            "LEDGER STRING:"
        );

        Logger.log(
            String(
                ledgerBarangId
            ).trim()
        );


        Logger.log(
            "STRICT MATCH:"
        );

        Logger.log(
            String(
                wopBarangId
            ).trim() ===
            String(
                ledgerBarangId
            ).trim()
        );

    }

}

/**
 * ============================================
 * TEST WORK ORDER PART CHANGE STATUS
 * ============================================
 */
/**
 * ============================================
 * TEST WORK ORDER PART CHANGE STATUS
 * ============================================
 */
function testWorkOrderPartServiceChangeStatus(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART CHANGE STATUS TEST"
    );

    Logger.log(
        "================================"
    );


    let testWorkOrderPartId = null;

    let cancelWorkOrderPartId = null;


    try{

        /**
         * ========================================
         * CREATE TEST WORK ORDER PART #1
         * ========================================
         */

        const createResult =
            WorkOrderPartService.create({

                workOrderId :
                    "WO2608100001",

                barangId :
                    "BRG000001",

                qty :
                    1

            });


        testWorkOrderPartId =
            createResult[
                "workOrderPartId"
            ] ||
            createResult.workOrderPartId;


        Logger.log(
            "TEST WOP CREATED:"
        );

        Logger.log(
            testWorkOrderPartId
        );


        if(!testWorkOrderPartId){

            throw new Error(
                "Test WorkOrderPart ID tidak berhasil dibuat."
            );

        }


        /**
         * ========================================
         * VERIFY INITIAL STATUS
         * ========================================
         */

        let current =
            WorkOrderPartRepository.findById(
                testWorkOrderPartId
            );


        Logger.log(
            "STATUS AWAL:"
        );

        Logger.log(
            current[
                COL_WORK_ORDER_PART.STATUS
            ]
        );


        /**
         * ========================================
         * TEST 1
         * OPEN → PROGRESS
         * ========================================
         */

        const resultProgress =
            WorkOrderPartService.changeStatus(
                testWorkOrderPartId,
                WorkOrderPartStatus.PROGRESS
            );


        Logger.log(
            "OPEN → PROGRESS RESULT:"
        );

        Logger.log(
            resultProgress
        );


        current =
            WorkOrderPartRepository.findById(
                testWorkOrderPartId
            );


        Logger.log(
            "STATUS SAAT PROGRESS:"
        );

        Logger.log(
            current[
                COL_WORK_ORDER_PART.STATUS
            ]
        );


        /**
         * ========================================
         * TEST 2
         * PROGRESS → DONE
         * ========================================
         */

        const resultDone =
            WorkOrderPartService.changeStatus(
                testWorkOrderPartId,
                WorkOrderPartStatus.DONE
            );


        Logger.log(
            "PROGRESS → DONE RESULT:"
        );

        Logger.log(
            resultDone
        );


        current =
            WorkOrderPartRepository.findById(
                testWorkOrderPartId
            );


        Logger.log(
            "STATUS SAAT DONE:"
        );

        Logger.log(
            current[
                COL_WORK_ORDER_PART.STATUS
            ]
        );


        /**
         * ========================================
         * TEST 3
         * DONE → OPEN
         * HARUS ERROR
         * ========================================
         */

        try{

            WorkOrderPartService.changeStatus(
                testWorkOrderPartId,
                WorkOrderPartStatus.OPEN
            );


            Logger.log(
                "FAIL: DONE → OPEN tidak menghasilkan error."
            );

        }
        catch(error){

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );


            Logger.log(
                "DONE → OPEN ERROR DETECTED:"
            );

            Logger.log(
                error.message ===
                "Perubahan status Work Order Part tidak diperbolehkan: DONE -> OPEN"
            );

        }


        /**
         * ========================================
         * CREATE TEST WORK ORDER PART #2
         * ========================================
         */

        const createCancelResult =
            WorkOrderPartService.create({

                workOrderId :
                    "WO2608100001",

                barangId :
                    "BRG000001",

                qty :
                    1

            });


        cancelWorkOrderPartId =
            createCancelResult[
                "workOrderPartId"
            ] ||
            createCancelResult.workOrderPartId;


        Logger.log(
            "CANCEL TEST WOP CREATED:"
        );

        Logger.log(
            cancelWorkOrderPartId
        );


        if(!cancelWorkOrderPartId){

            throw new Error(
                "Cancel test WorkOrderPart ID tidak berhasil dibuat."
            );

        }


        /**
         * ========================================
         * TEST 4
         * OPEN → CANCEL
         * ========================================
         */

        const resultCancel =
            WorkOrderPartService.changeStatus(
                cancelWorkOrderPartId,
                WorkOrderPartStatus.CANCEL
            );


        Logger.log(
            "OPEN → CANCEL RESULT:"
        );

        Logger.log(
            resultCancel
        );


        current =
            WorkOrderPartRepository.findById(
                cancelWorkOrderPartId
            );


        Logger.log(
            "STATUS SAAT CANCEL:"
        );

        Logger.log(
            current[
                COL_WORK_ORDER_PART.STATUS
            ]
        );


        /**
         * ========================================
         * TEST 5
         * CANCEL → OPEN
         * HARUS ERROR
         * ========================================
         */

        try{

            WorkOrderPartService.changeStatus(
                cancelWorkOrderPartId,
                WorkOrderPartStatus.OPEN
            );


            Logger.log(
                "FAIL: CANCEL → OPEN tidak menghasilkan error."
            );

        }
        catch(error){

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );


            Logger.log(
                "CANCEL → OPEN ERROR DETECTED:"
            );

            Logger.log(
                error.message ===
                "Perubahan status Work Order Part tidak diperbolehkan: CANCEL -> OPEN"
            );

        }


    }
    finally{


        /**
         * ========================================
         * CLEANUP
         * ========================================
         */

        if(testWorkOrderPartId){

            const row =
                WorkOrderPartRepository.findRowById(
                    testWorkOrderPartId
                );


            if(row !== 0){

                WorkOrderPartRepository
                    .sheet()
                    .deleteRow(
                        row
                    );


                Logger.log(
                    "TEST WOP #1 CLEANUP: OK"
                );

            }

        }


        if(cancelWorkOrderPartId){

            const row =
                WorkOrderPartRepository.findRowById(
                    cancelWorkOrderPartId
                );


            if(row !== 0){

                WorkOrderPartRepository
                    .sheet()
                    .deleteRow(
                        row
                    );


                Logger.log(
                    "TEST WOP #2 CLEANUP: OK"
                );

            }

        }


        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER PART CHANGE STATUS TEST SELESAI"
        );

        Logger.log(
            "================================"
        );

    }

}/**
 * ============================================
 * TEST WORK ORDER PART STOCK OUT PROGRESS
 * ============================================
 */
function testWorkOrderPartServiceBuildStockOutRequestProgress(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART STOCK OUT PROGRESS TEST"
    );

    Logger.log(
        "================================"
    );


    let workOrderPartId = null;


    try{

        /**
         * ========================================
         * CREATE NEW WOP
         * ========================================
         */

        const result =
            WorkOrderPartService.create({

                workOrderId :
                    "WO2608100001",

                barangId :
                    "BRG000001",

                qty :
                    1,

                harga :
                    55000,

                diskon :
                    0,

                catatan :
                    "Progress Stock Test"

            });


        workOrderPartId =
            result.workOrderPartId;


        Logger.log(
            "TEST WOP CREATED:"
        );

        Logger.log(
            workOrderPartId
        );


        /**
         * ========================================
         * VERIFY OPEN
         * ========================================
         */

        let workOrderPart =
            WorkOrderPartRepository.findById(
                workOrderPartId
            );


        Logger.log(
            "STATUS AWAL:"
        );

        Logger.log(
            workOrderPart[
                COL_WORK_ORDER_PART.STATUS
            ]
        );


        /**
         * ========================================
         * CHANGE TO PROGRESS
         * ========================================
         */

        const progressResult =
            WorkOrderPartService.changeStatus(

                workOrderPartId,

                WorkOrderPartStatus.PROGRESS

            );


        Logger.log(
            "OPEN → PROGRESS RESULT:"
        );

        Logger.log(
            progressResult
        );


        /**
         * ========================================
         * LOAD UPDATED WOP
         * ========================================
         */

        workOrderPart =
            WorkOrderPartRepository.findById(
                workOrderPartId
            );


        Logger.log(
            "STATUS SAAT PROGRESS:"
        );

        Logger.log(
            workOrderPart[
                COL_WORK_ORDER_PART.STATUS
            ]
        );


        /**
         * ========================================
         * BUILD STOCK OUT REQUEST
         * ========================================
         */

        const stockRequest =
            WorkOrderPartService
                .buildStockOutRequest(
                    workOrderPart
                );


        Logger.log(
            "STOCK OUT REQUEST:"
        );

        Logger.log(
            JSON.stringify(
                stockRequest
            )
        );


        /**
         * ========================================
         * EXPECTED
         * ========================================
         */

        Logger.log(
            "STOCK OUT PROGRESS TEST:"
        );

        Logger.log(
            stockRequest !== null
        );

    }
    finally{

        /**
         * ========================================
         * CLEANUP
         * ========================================
         */

        if(workOrderPartId){

            const row =
                WorkOrderPartRepository.findRowById(
                    workOrderPartId
                );


            if(row !== 0){

                WorkOrderPartRepository
                    .sheet()
                    .deleteRow(
                        row
                    );


                Logger.log(
                    "TEST WOP CLEANUP: OK"
                );

            }

        }


        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER PART STOCK OUT PROGRESS TEST SELESAI"
        );

        Logger.log(
            "================================"
        );

    }

}

function testWorkOrderPartServiceStockOutStatusGuard(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART STOCK OUT STATUS GUARD TEST"
    );

    Logger.log(
        "================================"
    );


    const testStatuses = [

        {
            name :
                "OPEN",

            status :
                WorkOrderPartStatus.OPEN,

            shouldPass :
                false
        },

        {
            name :
                "PROGRESS",

            status :
                WorkOrderPartStatus.PROGRESS,

            shouldPass :
                true
        },

        {
            name :
                "DONE",

            status :
                WorkOrderPartStatus.DONE,

            shouldPass :
                false
        },

        {
            name :
                "CANCEL",

            status :
                WorkOrderPartStatus.CANCEL,

            shouldPass :
                false
        }

    ];


    let passCount = 0;


    for(
        let i = 0;
        i < testStatuses.length;
        i++
    ){

        const test =
            testStatuses[i];


        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STATUS TEST: " +
            test.name
        );


        let workOrderPart = null;


        try{

            /**
             * ====================================
             * CREATE WOP
             * ====================================
             */

            const createResult =
                WorkOrderPartService.create({

                    workOrderId :
                        "WO2608100001",

                    barangId :
                        "BRG000001",

                    qty :
                        1,

                    harga :
                        55000,

                    diskon :
                        0,

                    catatan :
                        "Stock Status Guard Test"

                });


            const workOrderPartId =
                createResult.workOrderPartId;


            /**
             * ====================================
             * CHANGE STATUS
             * ====================================
             */

            if(
                test.status !==
                WorkOrderPartStatus.OPEN
            ){

                WorkOrderPartService.changeStatus(

                    workOrderPartId,

                    test.status

                );

            }


            /**
             * ====================================
             * LOAD
             * ====================================
             */

            workOrderPart =
                WorkOrderPartRepository.findById(

                    workOrderPartId

                );


            Logger.log(
                "ACTUAL STATUS:"
            );

            Logger.log(
                workOrderPart[
                    COL_WORK_ORDER_PART.STATUS
                ]
            );


            /**
             * ====================================
             * BUILD STOCK REQUEST
             * ====================================
             */

            const request =
                WorkOrderPartService
                    .buildStockOutRequest(
                        workOrderPart
                    );


            /**
             * ====================================
             * RESULT
             * ====================================
             */

            if(test.shouldPass){

                Logger.log(
                    "EXPECTED: PASS"
                );

                Logger.log(
                    "RESULT: PASS"
                );

                passCount++;

            }
            else{

                Logger.log(
                    "EXPECTED: ERROR"
                );

                Logger.log(
                    "RESULT: FAIL - STATUS DITERIMA"
                );

            }

        }
        catch(error){

            Logger.log(
                "ERROR:"
            );

            Logger.log(
                error.message
            );


            if(!test.shouldPass){

                Logger.log(
                    "RESULT: PASS"
                );

                passCount++;

            }
            else{

                Logger.log(
                    "RESULT: FAIL"
                );

            }

        }
        finally{

            /**
             * ====================================
             * CLEANUP
             * ====================================
             */

            if(workOrderPart){

                const workOrderPartId =
                    workOrderPart[
                        COL_WORK_ORDER_PART.ID
                    ];


                const row =
                    WorkOrderPartRepository
                        .findRowById(
                            workOrderPartId
                        );


                if(row !== 0){

                    WorkOrderPartRepository
                        .sheet()
                        .deleteRow(
                            row
                        );

                }

            }

        }

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "TOTAL PASS:"
    );

    Logger.log(
        passCount +
        " / " +
        testStatuses.length
    );

    Logger.log(
        "================================"
    );


    if(
        passCount !==
        testStatuses.length
    ){

        throw new Error(
            "Stock Out Status Guard Test FAILED."
        );

    }


    Logger.log(
        "STOCK OUT STATUS GUARD TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

function testWorkOrderPartServiceConsumeStockProgressIdempotent(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART CONSUME STOCK PROGRESS IDEMPOTENCY TEST"
    );

    Logger.log(
        "================================"
    );


    let workOrderPartId = null;


    try{

        /**
         * ========================================
         * STOK AWAL
         * ========================================
         */

        const barangBefore =
            BarangRepository.findById(
                "BRG000001"
            );


        const stockBefore =
            Number(
                barangBefore[
                    COL_BARANG.STOK
                ]
            );


        Logger.log(
            "STOK AWAL:"
        );

        Logger.log(
            stockBefore
        );


        /**
         * ========================================
         * CREATE WOP
         * ========================================
         */

        const createResult =
            WorkOrderPartService.create({

                workOrderId :
                    "WO2608100001",

                barangId :
                    "BRG000001",

                qty :
                    1,

                harga :
                    55000,

                diskon :
                    0,

                catatan :
                    "Progress Consume Idempotency Test"

            });


        workOrderPartId =
            createResult.workOrderPartId;


        Logger.log(
            "TEST WOP CREATED:"
        );

        Logger.log(
            workOrderPartId
        );


        /**
         * ========================================
         * OPEN → PROGRESS
         * ========================================
         */

        const progressResult =
            WorkOrderPartService.changeStatus(

                workOrderPartId,

                WorkOrderPartStatus.PROGRESS

            );


        Logger.log(
            "OPEN → PROGRESS RESULT:"
        );

        Logger.log(
            JSON.stringify(
                progressResult
            )
        );


        /**
         * ========================================
         * CONSUME #1
         * ========================================
         */

        const consumeResult1 =
            WorkOrderPartService.consumeStock(
                workOrderPartId
            );


        Logger.log(
            "CONSUME #1 RESULT:"
        );

        Logger.log(
            JSON.stringify(
                consumeResult1
            )
        );


        /**
         * ========================================
         * STOK SESUDAH CONSUME #1
         * ========================================
         */

        const barangAfter1 =
            BarangRepository.findById(
                "BRG000001"
            );


        const stockAfter1 =
            Number(
                barangAfter1[
                    COL_BARANG.STOK
                ]
            );


        Logger.log(
            "STOK SESUDAH CONSUME #1:"
        );

        Logger.log(
            stockAfter1
        );


        /**
         * ========================================
         * CONSUME #2
         * ========================================
         */

        const consumeResult2 =
            WorkOrderPartService.consumeStock(
                workOrderPartId
            );


        Logger.log(
            "CONSUME #2 RESULT:"
        );

        Logger.log(
            JSON.stringify(
                consumeResult2
            )
        );


        /**
         * ========================================
         * STOK SESUDAH CONSUME #2
         * ========================================
         */

        const barangAfter2 =
            BarangRepository.findById(
                "BRG000001"
            );


        const stockAfter2 =
            Number(
                barangAfter2[
                    COL_BARANG.STOK
                ]
            );


        Logger.log(
            "STOK SESUDAH CONSUME #2:"
        );

        Logger.log(
            stockAfter2
        );


        /**
         * ========================================
         * ASSERTION
         * ========================================
         */

        const firstConsumeCorrect =
            stockAfter1 ===
            stockBefore - 1;


        const secondConsumeBlocked =
            stockAfter2 ===
            stockAfter1;


        const firstConsumeNotDuplicate =
            consumeResult1.alreadyRecorded ===
            false;


        const secondConsumeDetected =
            consumeResult2.alreadyRecorded ===
            true;


        Logger.log(
            "ASSERT STOCK #1:"
        );

        Logger.log(
            firstConsumeCorrect
        );


        Logger.log(
            "ASSERT STOCK #2:"
        );

        Logger.log(
            secondConsumeBlocked
        );


        Logger.log(
            "ASSERT FIRST CONSUME:"
        );

        Logger.log(
            firstConsumeNotDuplicate
        );


        Logger.log(
            "ASSERT SECOND CONSUME:"
        );

        Logger.log(
            secondConsumeDetected
        );


        if(
            !firstConsumeCorrect ||
            !secondConsumeBlocked ||
            !firstConsumeNotDuplicate ||
            !secondConsumeDetected
        ){

            throw new Error(
                "Consume Stock Progress Idempotency Test FAILED."
            );

        }


        Logger.log(
            "CONSUME STOCK PROGRESS IDEMPOTENCY TEST PASS"
        );

    }
    finally{

        /**
         * ========================================
         * CLEANUP
         * ========================================
         */

        if(workOrderPartId){

            const row =
                WorkOrderPartRepository
                    .findRowById(
                        workOrderPartId
                    );


            if(row !== 0){

                WorkOrderPartRepository
                    .sheet()
                    .deleteRow(
                        row
                    );


                Logger.log(
                    "TEST WOP CLEANUP: OK"
                );

            }

        }

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "CONSUME STOCK PROGRESS IDEMPOTENCY TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function cleanupProgressConsumeStockTest(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "CLEANUP PROGRESS CONSUME STOCK TEST"
    );

    Logger.log(
        "================================"
    );


    const barangId =
        "BRG000001";

    const stockLedgerId =
        "STK2608130001";


    /**
     * ========================================
     * CEK STOK SAAT INI
     * ========================================
     */

    const barang =
        BarangRepository.findById(
            barangId
        );


    const stockBefore =
        Number(
            barang[
                COL_BARANG.STOK
            ]
        );


    Logger.log(
        "STOK SEBELUM CLEANUP:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * RESTORE STOCK
     * ========================================
     */

    BarangRepository.updateStockAbsolute(

        barangId,

        stockBefore + 1

    );


    const barangAfter =
        BarangRepository.findById(
            barangId
        );


    const stockAfter =
        Number(
            barangAfter[
                COL_BARANG.STOK
            ]
        );


    Logger.log(
        "STOK SESUDAH RESTORE:"
    );

    Logger.log(
        stockAfter
    );


    /**
     * ========================================
     * DELETE TEST LEDGER
     * ========================================
     *
     * Menggunakan mekanisme internal yang
     * memang dipakai oleh rollback.
     */

    StockLedgerService.deleteLedgerById_(
        stockLedgerId
    );


    /**
     * ========================================
     * VERIFIKASI LEDGER
     * ========================================
     */

    const ledgerRows =
        StockLedgerRepository.findByReferensi(
            "WOP2608130014"
        );


    Logger.log(
        "LEDGER TEST TERSISA:"
    );

    Logger.log(
        ledgerRows.length
    );


    /**
     * ========================================
     * ASSERTION
     * ========================================
     */

    if(
        stockAfter !==
        stockBefore + 1
    ){

        throw new Error(
            "Cleanup stock gagal."
        );

    }


    if(
        ledgerRows.length !== 0
    ){

        throw new Error(
            "Cleanup ledger gagal."
        );

    }


    Logger.log(
        "CLEANUP TEST PASS"
    );


    Logger.log(
        "================================"
    );

}

function testWorkOrderPartBatchStatusAudit(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART BATCH STATUS AUDIT"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608090002";


    const parts =
        WorkOrderPartRepository
            .findByWorkOrderId(
                workOrderId
            );


    Logger.log(
        "TOTAL WOP:"
    );

    Logger.log(
        parts.length
    );


    for(
        let i = 0;
        i < parts.length;
        i++
    ){

        const part =
            parts[i];


        Logger.log(
            "--------------------------------"
        );


        Logger.log(
            "WOP ID:"
        );

        Logger.log(
            part[
                COL_WORK_ORDER_PART.ID
            ]
        );


        Logger.log(
            "BARANG ID:"
        );

        Logger.log(
            part[
                COL_WORK_ORDER_PART.BARANG_ID
            ]
        );


        Logger.log(
            "QTY:"
        );

        Logger.log(
            part[
                COL_WORK_ORDER_PART.QTY
            ]
        );


        Logger.log(
            "STATUS:"
        );

        Logger.log(
            part[
                COL_WORK_ORDER_PART.STATUS
            ]
        );


        Logger.log(
            "EXPECTED PROGRESS:"
        );

        Logger.log(
            part[
                COL_WORK_ORDER_PART.STATUS
            ] ===
            WorkOrderPartStatus.PROGRESS
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "BATCH STATUS AUDIT SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testWorkOrderPartBatchPipeline(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART BATCH PIPELINE TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608090002";


    const workOrderParts =
        WorkOrderPartRepository
            .findByWorkOrderId(
                workOrderId
            );


    Logger.log(
        "TOTAL WOP:"
    );

    Logger.log(
        workOrderParts.length
    );


    const stockItems = [];


    for(
        let i = 0;
        i < workOrderParts.length;
        i++
    ){

        const part =
            workOrderParts[i];


        const workOrderPartId =
            part[
                COL_WORK_ORDER_PART.ID
            ];


        const status =
            part[
                COL_WORK_ORDER_PART.STATUS
            ];


        Logger.log(
            "--------------------------------"
        );


        Logger.log(
            "WOP:"
        );

        Logger.log(
            workOrderPartId
        );


        Logger.log(
            "STATUS:"
        );

        Logger.log(
            status
        );


        Logger.log(
            "STATUS CONSTANT PROGRESS:"
        );

        Logger.log(
            WorkOrderPartStatus.PROGRESS
        );


        Logger.log(
            "STATUS MATCH:"
        );

        Logger.log(
            status ===
            WorkOrderPartStatus.PROGRESS
        );


        if(
            status !==
            WorkOrderPartStatus.PROGRESS
        ){

            Logger.log(
                "ACTION: SKIP STATUS"
            );

            continue;

        }


        Logger.log(
            "ACTION: STATUS LOLOS"
        );


        const alreadyRecorded =
            WorkOrderPartService
                .isStockOutRecorded(
                    workOrderPartId
                );


        Logger.log(
            "ALREADY RECORDED:"
        );

        Logger.log(
            alreadyRecorded
        );


        if(alreadyRecorded){

            Logger.log(
                "ACTION: SKIP IDEMPOTENCY"
            );

            continue;

        }


        const request =
            WorkOrderPartService
                .buildStockOutRequest(
                    part
                );


        request.referensi =
            workOrderPartId;


        Logger.log(
            "STOCK REQUEST:"
        );

        Logger.log(
            JSON.stringify(
                request
            )
        );


        stockItems.push(
            request
        );


        Logger.log(
            "ACTION: STOCK ITEM ADDED"
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "FINAL STOCK ITEMS:"
    );

    Logger.log(
        stockItems.length
    );


    Logger.log(
        JSON.stringify(
            stockItems
        )
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "BATCH PIPELINE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testWOPConsumeStockBatchIdempotency20260814(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WOP CONSUME STOCK BATCH IDEMPOTENCY TEST"
    );

    Logger.log(
        "================================"
    );


    const barang1Before =
        BarangRepository.findById(
            "BRG000001"
        );


    const barang2Before =
        BarangRepository.findById(
            "BRG000002"
        );


    const stok1Before =
        Number(
            barang1Before[
                COL_BARANG.STOK
            ]
        );


    const stok2Before =
        Number(
            barang2Before[
                COL_BARANG.STOK
            ]
        );


    Logger.log(
        "STOK BRG000001 SEBELUM:"
    );

    Logger.log(
        stok1Before
    );


    Logger.log(
        "STOK BRG000002 SEBELUM:"
    );

    Logger.log(
        stok2Before
    );


    /**
     * ========================================
     * CONSUME BATCH KEDUA
     * ========================================
     */

    const result =
        WorkOrderPartService
            .consumeStockBatch(
                "WO2608090002"
            );


    Logger.log(
        "SECOND CONSUME RESULT:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );


    /**
     * ========================================
     * CEK STOCK SESUDAH
     * ========================================
     */

    const barang1After =
        BarangRepository.findById(
            "BRG000001"
        );


    const barang2After =
        BarangRepository.findById(
            "BRG000002"
        );


    const stok1After =
        Number(
            barang1After[
                COL_BARANG.STOK
            ]
        );


    const stok2After =
        Number(
            barang2After[
                COL_BARANG.STOK
            ]
        );


    Logger.log(
        "STOK BRG000001 SESUDAH:"
    );

    Logger.log(
        stok1After
    );


    Logger.log(
        "STOK BRG000002 SESUDAH:"
    );

    Logger.log(
        stok2After
    );


    /**
     * ========================================
     * ASSERT STOCK TIDAK BERUBAH
     * ========================================
     */

    const stock1Unchanged =
        stok1After ===
        stok1Before;


    const stock2Unchanged =
        stok2After ===
        stok2Before;


    Logger.log(
        "ASSERT BRG000001 TIDAK BERKURANG LAGI:"
    );

    Logger.log(
        stock1Unchanged
    );


    Logger.log(
        "ASSERT BRG000002 TIDAK BERKURANG LAGI:"
    );

    Logger.log(
        stock2Unchanged
    );


    /**
     * ========================================
     * ASSERT SKIPPED ITEMS
     * ========================================
     */

    const skippedCount =
        result.skippedItems
            ? result.skippedItems.length
            : 0;


    Logger.log(
        "SKIPPED ITEMS COUNT:"
    );

    Logger.log(
        skippedCount
    );


    const skippedPass =
        skippedCount === 2;


    Logger.log(
        "ASSERT SKIPPED ITEMS = 2:"
    );

    Logger.log(
        skippedPass
    );


    /**
     * ========================================
     * FINAL RESULT
     * ========================================
     */

    const pass =
        stock1Unchanged &&
        stock2Unchanged &&
        skippedPass &&
        result.success === true;


    Logger.log(
        "================================"
    );

    Logger.log(
        "BATCH IDEMPOTENCY TEST RESULT:"
    );

    Logger.log(
        pass
            ? "PASS"
            : "FAIL"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Work Order Part Full Lifecycle
 * ============================================
 */

function testWorkOrderPartFullLifecycle(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART FULL LIFECYCLE TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER PART
     * ========================================
     */

    const workOrderId =
        "WO2608100001";


    const result =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Full Lifecycle Test"

        });


    const workOrderPartId =
        result.workOrderPartId;


    Logger.log(
        "WOP ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 2. CEK STATUS AWAL
     * ========================================
     */

    let part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    let status =
        part[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS AWAL:"
    );

    Logger.log(
        status
    );


    if(
        status !==
        WorkOrderPartStatus.OPEN
    ){

        throw new Error(
            "Lifecycle Test gagal: status awal bukan OPEN."
        );

    }


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     */

    const progressResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            progressResult
        )
    );


    part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    status =
        part[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS SETELAH PROGRESS:"
    );

    Logger.log(
        status
    );


    if(
        status !==
        WorkOrderPartStatus.PROGRESS
    ){

        throw new Error(
            "Lifecycle Test gagal: OPEN → PROGRESS."
        );

    }


    /**
     * ========================================
     * 4. PROGRESS → DONE
     * ========================================
     */

    const doneResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.DONE

        );


    Logger.log(
        "PROGRESS → DONE:"
    );

    Logger.log(
        JSON.stringify(
            doneResult
        )
    );


    part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    status =
        part[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS AKHIR:"
    );

    Logger.log(
        status
    );


    if(
        status !==
        WorkOrderPartStatus.DONE
    ){

        throw new Error(
            "Lifecycle Test gagal: PROGRESS → DONE."
        );

    }


    /**
     * ========================================
     * 5. DONE → PROGRESS HARUS DITOLAK
     * ========================================
     */

    let errorDetected =
        false;


    try{

        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );

    }
    catch(error){

        errorDetected =
            true;


        Logger.log(
            "EXPECTED ERROR DONE → PROGRESS:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "DONE → PROGRESS DITOLAK:"
    );

    Logger.log(
        errorDetected
    );


    if(
        !errorDetected
    ){

        throw new Error(
            "Lifecycle Test gagal: DONE → PROGRESS seharusnya ditolak."
        );

    }


    /**
     * ========================================
     * 6. STATUS TETAP DONE
     * ========================================
     */

    part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    status =
        part[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS FINAL:"
    );

    Logger.log(
        status
    );


    if(
        status !==
        WorkOrderPartStatus.DONE
    ){

        throw new Error(
            "Lifecycle Test gagal: status berubah setelah transition ilegal."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART FULL LIFECYCLE TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Work Order Part Cancel Lifecycle
 * ============================================
 */

function testWorkOrderPartCancelLifecycle(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART CANCEL LIFECYCLE TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WOP
     * ========================================
     */

    const workOrderId =
        "WO2608100001";


    const result =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Cancel Lifecycle Test"

        });


    const workOrderPartId =
        result.workOrderPartId;


    Logger.log(
        "WOP ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 2. STATUS AWAL
     * ========================================
     */

    let part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    let status =
        part[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS AWAL:"
    );

    Logger.log(
        status
    );


    if(
        status !==
        WorkOrderPartStatus.OPEN
    ){

        throw new Error(
            "Cancel Lifecycle Test gagal: status awal bukan OPEN."
        );

    }


    /**
     * ========================================
     * 3. OPEN → CANCEL
     * ========================================
     */

    const cancelResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.CANCEL

        );


    Logger.log(
        "OPEN → CANCEL:"
    );

    Logger.log(
        JSON.stringify(
            cancelResult
        )
    );


    part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    status =
        part[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS SETELAH CANCEL:"
    );

    Logger.log(
        status
    );


    if(
        status !==
        WorkOrderPartStatus.CANCEL
    ){

        throw new Error(
            "Cancel Lifecycle Test gagal: OPEN → CANCEL."
        );

    }


    /**
     * ========================================
     * 4. CANCEL → OPEN HARUS DITOLAK
     * ========================================
     */

    let errorDetected =
        false;


    try{

        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.OPEN

        );

    }
    catch(error){

        errorDetected =
            true;


        Logger.log(
            "EXPECTED ERROR CANCEL → OPEN:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "CANCEL → OPEN DITOLAK:"
    );

    Logger.log(
        errorDetected
    );


    if(
        !errorDetected
    ){

        throw new Error(
            "Cancel Lifecycle Test gagal: CANCEL → OPEN seharusnya ditolak."
        );

    }


    /**
     * ========================================
     * 5. STATUS HARUS TETAP CANCEL
     * ========================================
     */

    part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    status =
        part[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS FINAL:"
    );

    Logger.log(
        status
    );


    if(
        status !==
        WorkOrderPartStatus.CANCEL
    ){

        throw new Error(
            "Cancel Lifecycle Test gagal: status CANCEL berubah."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART CANCEL LIFECYCLE TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: PROGRESS → CANCEL HARUS DITOLAK
 * ============================================
 */

function testWorkOrderPartCancelFromProgress(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART PROGRESS → CANCEL TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER PART
     * ========================================
     */

    const result =
        WorkOrderPartService.create({

            workOrderId :
                "WO2608100001",

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Progress Cancel Test"

        });


    const workOrderPartId =
        result.workOrderPartId;


    Logger.log(
        "WOP ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 2. OPEN → PROGRESS
     * ========================================
     */

    const progressResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            progressResult
        )
    );


    /**
     * ========================================
     * 3. CEK STATUS
     * ========================================
     */

    const progressPart =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    const progressStatus =
        progressPart[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS SETELAH PROGRESS:"
    );

    Logger.log(
        progressStatus
    );


    if(
        progressStatus !==
        WorkOrderPartStatus.PROGRESS
    ){

        throw new Error(
            "Test gagal: WOP tidak berhasil menjadi PROGRESS."
        );

    }


    /**
     * ========================================
     * 4. COBA PROGRESS → CANCEL
     * ========================================
     */

    let errorDetected =
        false;


    try{

        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.CANCEL

        );

    }
    catch(error){

        errorDetected =
            true;


        Logger.log(
            "EXPECTED ERROR PROGRESS → CANCEL:"
        );

        Logger.log(
            error.message
        );


        Logger.log(
            "ERROR SESUAI EXPECTATION:"
        );

        Logger.log(
            error.message ===
            "Perubahan status Work Order Part tidak diperbolehkan: PROGRESS -> CANCEL"
        );

    }


    /**
     * ========================================
     * 5. ASSERT ERROR
     * ========================================
     */

    if(
        !errorDetected
    ){

        throw new Error(
            "Test gagal: PROGRESS → CANCEL seharusnya ditolak."
        );

    }


    /**
     * ========================================
     * 6. STATUS HARUS TETAP PROGRESS
     * ========================================
     */

    const finalPart =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    const finalStatus =
        finalPart[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS FINAL:"
    );

    Logger.log(
        finalStatus
    );


    const statusUnchanged =
        finalStatus ===
        WorkOrderPartStatus.PROGRESS;


    Logger.log(
        "STATUS TETAP PROGRESS:"
    );

    Logger.log(
        statusUnchanged
    );


    if(
        !statusUnchanged
    ){

        throw new Error(
            "Test gagal: status berubah setelah PROGRESS → CANCEL."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "PROGRESS → CANCEL TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Cancel After Stock Out
 * ============================================
 */

function testWorkOrderPartCancelAfterStockOut(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART CANCEL AFTER STOCK OUT TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS2608160002",

            vehicleId :
                "VEH2608160002",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Cancel After Stock Out Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER PART
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Cancel After Stock Out Test Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "WORK ORDER PART ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     */

    const progressResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            progressResult
        )
    );


    /**
     * ========================================
     * 4. STOCK SEBELUM OUT
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SEBELUM OUT:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 5. CONSUME STOCK
     * ========================================
     */

    const consumeResult =
        WorkOrderPartService.consumeStockBatch(
            workOrderId
        );


    Logger.log(
        "CONSUME STOCK RESULT:"
    );

    Logger.log(
        JSON.stringify(
            consumeResult
        )
    );


    /**
     * ========================================
     * 6. STOCK SETELAH OUT
     * ========================================
     */

    const stockAfterOut =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH OUT:"
    );

    Logger.log(
        stockAfterOut
    );


    const stockOutCorrect =
        stockAfterOut ===
        stockBefore - 1;


    Logger.log(
        "STOCK BERKURANG 1:"
    );

    Logger.log(
        stockOutCorrect
    );


    /**
     * ========================================
     * 7. CEK LEDGER OUT
     * ========================================
     */

    const ledgersBeforeCancel =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const stockOutLedgerCount =
        ledgersBeforeCancel.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;


    Logger.log(
        "STOCK OUT LEDGER:"
    );

    Logger.log(
        stockOutLedgerCount
    );


    /**
     * ========================================
     * 8. COBA CANCEL
     * ========================================
     *
     * Test ini mendefinisikan behavior
     * yang kita inginkan.
     *
     * Saat ini kemungkinan masih FAIL
     * karena PROGRESS → CANCEL belum
     * diizinkan.
     */

    let cancelResult =
        null;

    let errorDetected =
        false;


    try{

        cancelResult =
            WorkOrderPartService.cancel(
                workOrderPartId
            );

        Logger.log(
            "CANCEL RESULT:"
        );

        Logger.log(
            JSON.stringify(
                cancelResult
            )
        );

    }
    catch(error){

        errorDetected =
            true;


        Logger.log(
            "CANCEL ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * 9. CEK STOCK SETELAH CANCEL
     * ========================================
     */

    const stockAfterCancel =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH CANCEL:"
    );

    Logger.log(
        stockAfterCancel
    );


    /**
     * ========================================
     * 10. CEK STATUS WOP
     * ========================================
     */

    const workOrderPartAfter =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    const finalStatus =
        workOrderPartAfter[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS AKHIR:"
    );

    Logger.log(
        finalStatus
    );


    /**
     * ========================================
     * 11. CEK LEDGER
     * ========================================
     */

    const ledgersAfterCancel =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const stockOutLedgersAfter =
        ledgersAfterCancel.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        );


    const reversalLedgersAfter =
        ledgersAfterCancel.filter(
            function(ledger){

                return (
                    String(
                        ledger[
                            COL_STOK.JENISMUTASI
                        ] || ""
                    ).trim()
                    ===
                    "REVERSAL"
                );

            }
        );


    Logger.log(
        "STOCK OUT LEDGER SETELAH CANCEL:"
    );

    Logger.log(
        stockOutLedgersAfter.length
    );


    Logger.log(
        "REVERSAL LEDGER SETELAH CANCEL:"
    );

    Logger.log(
        reversalLedgersAfter.length
    );


    /**
     * ========================================
     * 12. EXPECTED BUSINESS RESULT
     * ========================================
     */

    const cancelSuccess =
        errorDetected ===
        false;


    const statusIsCancel =
        finalStatus ===
        WorkOrderPartStatus.CANCEL;


    const stockReturned =
        stockAfterCancel ===
        stockBefore;


    const stockOutLedgerPreserved =
        stockOutLedgersAfter.length ===
        1;


    const reversalCreated =
        reversalLedgersAfter.length ===
        1;


    Logger.log(
        "CANCEL SUCCESS:"
    );

    Logger.log(
        cancelSuccess
    );


    Logger.log(
        "STATUS = CANCEL:"
    );

    Logger.log(
        statusIsCancel
    );


    Logger.log(
        "STOCK KEMBALI:"
    );

    Logger.log(
        stockReturned
    );


    Logger.log(
        "STOCK OUT LEDGER TETAP ADA:"
    );

    Logger.log(
        stockOutLedgerPreserved
    );


    Logger.log(
        "REVERSAL LEDGER TERBUAT:"
    );

    Logger.log(
        reversalCreated
    );


    /**
     * ========================================
     * 13. FINAL ASSERT
     * ========================================
     */

   if(

        !cancelSuccess

    ){

        throw new Error(

            "Cancel After Stock Out gagal: " +

            "Work Order Part tidak berhasil di-CANCEL."

        );

    }

    if(

        !statusIsCancel

    ){

        throw new Error(

            "Cancel After Stock Out gagal: " +

            "status akhir bukan CANCEL."

        );

    }

    if(

        !stockReturned

    ){

        throw new Error(

            "Cancel After Stock Out gagal: " +

            "stock tidak kembali ke posisi sebelum Stock Out."

        );

    }

    if(

        !stockOutLedgerPreserved

    ){

        throw new Error(

            "Cancel After Stock Out gagal: " +

            "Stock OUT ledger lama tidak boleh hilang."

        );

    }

    if(

        !reversalCreated

    ){

        throw new Error(

            "Cancel After Stock Out gagal: " +

            "REVERSAL ledger tidak ditemukan."

        );

    }

    Logger.log(

        "================================"

    );

    Logger.log(

        "WORK ORDER PART CANCEL AFTER STOCK OUT TEST PASS"

    );

    Logger.log(

        "================================"

    );

}

/**
 * ============================================
 * TEST: Work Order Part Cancel Without Stock Out
 * ============================================
 */

function testWorkOrderPartCancelWithoutStockOut(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART CANCEL WITHOUT STOCK OUT TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Cancel Without Stock Out Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER PART
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Cancel Without Stock Out Test Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "WORK ORDER PART ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     */

    const progressResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            progressResult
        )
    );


    /**
     * ========================================
     * 4. SNAPSHOT STOCK
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SEBELUM CANCEL:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 5. CEK LEDGER SEBELUM
     * ========================================
     */

    const ledgersBefore =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    Logger.log(
        "JUMLAH LEDGER SEBELUM:"
    );

    Logger.log(
        ledgersBefore.length
    );


    /**
     * ========================================
     * 6. CANCEL
     * ========================================
     */

    let cancelResult = null;

    let cancelError = null;


    try{

        cancelResult =
            WorkOrderPartService.cancel(
                workOrderPartId
            );

    }
    catch(error){

        cancelError =
            error;

    }


    if(cancelError){

        Logger.log(
            "CANCEL ERROR:"
        );

        Logger.log(
            cancelError.message
        );

        throw cancelError;

    }


    Logger.log(
        "CANCEL RESULT:"
    );

    Logger.log(
        JSON.stringify(
            cancelResult
        )
    );


    /**
     * ========================================
     * 7. CEK STOCK SETELAH CANCEL
     * ========================================
     */

    const stockAfter =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH CANCEL:"
    );

    Logger.log(
        stockAfter
    );


    /**
     * ========================================
     * 8. CEK STATUS AKHIR
     * ========================================
     */

    const after =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    const finalStatus =
        after[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS AKHIR:"
    );

    Logger.log(
        finalStatus
    );


    /**
     * ========================================
     * 9. CEK LEDGER SETELAH
     * ========================================
     */

    const ledgersAfter =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const reversalLedgers =
        ledgersAfter.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim() === "REVERSAL";

            }
        );


    Logger.log(
        "JUMLAH LEDGER SETELAH:"
    );

    Logger.log(
        ledgersAfter.length
    );


    Logger.log(
        "JUMLAH REVERSAL:"
    );

    Logger.log(
        reversalLedgers.length
    );


    /**
     * ========================================
     * 10. ASSERT
     * ========================================
     */

    const statusIsCancel =
        finalStatus ===
        WorkOrderPartStatus.CANCEL;


    const stockUnchanged =
        stockAfter ===
        stockBefore;


    const noLedgerCreated =
        ledgersAfter.length ===
        0;


    const noReversalCreated =
        reversalLedgers.length ===
        0;


    Logger.log(
        "STATUS = CANCEL:"
    );

    Logger.log(
        statusIsCancel
    );


    Logger.log(
        "STOCK TIDAK BERUBAH:"
    );

    Logger.log(
        stockUnchanged
    );


    Logger.log(
        "TIDAK ADA LEDGER:"
    );

    Logger.log(
        noLedgerCreated
    );


    Logger.log(
        "TIDAK ADA REVERSAL:"
    );

    Logger.log(
        noReversalCreated
    );


    /**
     * ========================================
     * 11. FINAL ASSERT
     * ========================================
     */

    if(
        !statusIsCancel ||
        !stockUnchanged ||
        !noLedgerCreated ||
        !noReversalCreated
    ){

        throw new Error(
            "Cancel Without Stock Out Test gagal."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART CANCEL WITHOUT STOCK OUT TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Work Order Part Cancel Duplicate Reversal
 * ============================================
 */

function testWorkOrderPartCancelDuplicateReversal(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART CANCEL DUPLICATE REVERSAL TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS2608160002",

            vehicleId :
                "VEH2608160002",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Cancel Duplicate Reversal Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER PART
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Cancel Duplicate Reversal Test Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "WORK ORDER PART ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     */

    WorkOrderPartService.changeStatus(

        workOrderPartId,

        WorkOrderPartStatus.PROGRESS

    );


    Logger.log(
        "OPEN → PROGRESS: PASS"
    );


    /**
     * ========================================
     * 4. SNAPSHOT STOCK
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SEBELUM OUT:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 5. CONSUME STOCK
     * ========================================
     */

    const consumeResult =
        WorkOrderPartService.consumeStockBatch(
            workOrderId
        );


    Logger.log(
        "CONSUME STOCK RESULT:"
    );

    Logger.log(
        JSON.stringify(
            consumeResult
        )
    );


    /**
     * ========================================
     * 6. STOCK AFTER OUT
     * ========================================
     */

    const stockAfterOut =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH OUT:"
    );

    Logger.log(
        stockAfterOut
    );


    /**
     * ========================================
     * 7. REVERSAL PERTAMA
     * ========================================
     *
     * Kita buat reversal secara langsung.
     *
     * Tujuannya:
     * memastikan WorkOrderPart sudah memiliki
     * reversal sebelum cancel dipanggil.
     */

    const firstReversal =
        StockLedgerReversalService
            .reverseByWorkOrderPartId(
                workOrderPartId
            );


    Logger.log(
        "REVERSAL PERTAMA:"
    );

    Logger.log(
        JSON.stringify(
            firstReversal
        )
    );


    /**
     * ========================================
     * 8. STOCK SETELAH REVERSAL PERTAMA
     * ========================================
     */

    const stockAfterFirstReversal =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH REVERSAL PERTAMA:"
    );

    Logger.log(
        stockAfterFirstReversal
    );


    const stockReturned =
        stockAfterFirstReversal ===
        stockBefore;


    Logger.log(
        "STOCK KEMBALI:"
    );

    Logger.log(
        stockReturned
    );


    /**
     * ========================================
     * 9. CEK LEDGER SEBELUM CANCEL
     * ========================================
     */

    const ledgersBeforeCancel =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const stockOutLedgersBefore =
        ledgersBeforeCancel.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        );


    const reversalLedgersBefore =
        ledgersBeforeCancel.filter(
            function(ledger){

                return (
                    String(
                        ledger[
                            COL_STOK.JENISMUTASI
                        ] || ""
                    ).trim()
                    ===
                    "REVERSAL"
                );

            }
        );


    Logger.log(
        "STOCK OUT LEDGER SEBELUM CANCEL:"
    );

    Logger.log(
        stockOutLedgersBefore.length
    );


    Logger.log(
        "REVERSAL LEDGER SEBELUM CANCEL:"
    );

    Logger.log(
        reversalLedgersBefore.length
    );


    /**
     * ========================================
     * 10. COBA CANCEL
     * ========================================
     */

    let cancelError =
        null;


    try{

        WorkOrderPartService.cancel(
            workOrderPartId
        );

        Logger.log(
            "ERROR: CANCEL SEHARUSNYA DITOLAK"
        );

    }
    catch(error){

        cancelError =
            error;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * 11. STOCK SETELAH CANCEL GAGAL
     * ========================================
     */

    const stockAfterCancel =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH CANCEL:"
    );

    Logger.log(
        stockAfterCancel
    );


    /**
     * ========================================
     * 12. STATUS AKHIR
     * ========================================
     */

    const workOrderPartAfter =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    const finalStatus =
        workOrderPartAfter[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS AKHIR:"
    );

    Logger.log(
        finalStatus
    );


    /**
     * ========================================
     * 13. CEK LEDGER AKHIR
     * ========================================
     */

    const ledgersAfterCancel =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const stockOutLedgersAfter =
        ledgersAfterCancel.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        );


    const reversalLedgersAfter =
        ledgersAfterCancel.filter(
            function(ledger){

                return (
                    String(
                        ledger[
                            COL_STOK.JENISMUTASI
                        ] || ""
                    ).trim()
                    ===
                    "REVERSAL"
                );

            }
        );


    Logger.log(
        "STOCK OUT LEDGER SETELAH:"
    );

    Logger.log(
        stockOutLedgersAfter.length
    );


    Logger.log(
        "REVERSAL LEDGER SETELAH:"
    );

    Logger.log(
        reversalLedgersAfter.length
    );


    /**
     * ========================================
     * 14. ASSERT
     * ========================================
     */

    const errorDetected =
        cancelError !== null;


    const duplicateErrorDetected =
        errorDetected &&
        cancelError.message ===
        "Stock Out untuk Work Order Part sudah pernah direversal: " +
        workOrderPartId;


    const statusStillProgress =
        finalStatus ===
        WorkOrderPartStatus.PROGRESS;


    const stockUnchanged =
        stockAfterCancel ===
        stockAfterFirstReversal;


    const stockOutPreserved =
        stockOutLedgersAfter.length ===
        1;


    const reversalStillOne =
        reversalLedgersAfter.length ===
        1;


    Logger.log(
        "ERROR TERDETEKSI:"
    );

    Logger.log(
        errorDetected
    );


    Logger.log(
        "DUPLICATE REVERSAL ERROR:"
    );

    Logger.log(
        duplicateErrorDetected
    );


    Logger.log(
        "STATUS TETAP PROGRESS:"
    );

    Logger.log(
        statusStillProgress
    );


    Logger.log(
        "STOCK TIDAK BERUBAH:"
    );

    Logger.log(
        stockUnchanged
    );


    Logger.log(
        "STOCK OUT LEDGER TETAP ADA:"
    );

    Logger.log(
        stockOutPreserved
    );


    Logger.log(
        "REVERSAL TETAP 1:"
    );

    Logger.log(
        reversalStillOne
    );


    /**
     * ========================================
     * 15. FINAL ASSERT
     * ========================================
     */

    if(
        !errorDetected ||
        !duplicateErrorDetected ||
        !statusStillProgress ||
        !stockUnchanged ||
        !stockOutPreserved ||
        !reversalStillOne
    ){

        throw new Error(
            "Cancel Duplicate Reversal Test gagal."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART CANCEL DUPLICATE REVERSAL TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Double Stock-Out Protection
 * ============================================
 *
 * Scenario:
 * 1. Buat Work Order
 * 2. Buat Work Order Part qty 1
 * 3. Ubah PART OPEN → PROGRESS
 * 4. Consume stock pertama kali
 * 5. Consume stock kedua kali
 *
 * Expected:
 * - Stock hanya berkurang 1 kali
 * - Ledger hanya dibuat 1 kali
 * - Pemanggilan kedua dianggap already recorded
 * - Tidak terjadi double stock-out
 * ============================================
 */

function testWorkOrderPartDoubleStockOutProtection(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "DOUBLE STOCK-OUT PROTECTION TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Double Stock-Out Protection Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER PART
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            status :
                "AKTIF",

            catatan :
                "Double Stock-Out Protection Test Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "WORK ORDER PART ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. PART → PROGRESS
     * ========================================
     */

    const progressResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "PART OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            progressResult
        )
    );


    /**
     * ========================================
     * 4. STOCK SEBELUM
     * ========================================
     */

    const barangBefore =
        BarangRepository.findById(
            "BRG000001"
        );


    const stockBefore =
        Number(
            barangBefore[
                COL_BARANG.STOK
            ]
        );


    Logger.log(
        "STOCK SEBELUM:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 5. STOCK OUT PERTAMA
     * ========================================
     */

    const firstResult =
        WorkOrderPartService.consumeStock(
            workOrderPartId
        );


    Logger.log(
        "STOCK OUT PERTAMA:"
    );

    Logger.log(
        JSON.stringify(
            firstResult
        )
    );


    /**
     * ========================================
     * 6. STOCK SETELAH PERTAMA
     * ========================================
     */

    const barangAfterFirst =
        BarangRepository.findById(
            "BRG000001"
        );


    const stockAfterFirst =
        Number(
            barangAfterFirst[
                COL_BARANG.STOK
            ]
        );


    Logger.log(
        "STOCK SETELAH PERTAMA:"
    );

    Logger.log(
        stockAfterFirst
    );


    /**
     * ========================================
     * 7. LEDGER SETELAH PERTAMA
     * ========================================
     */

    const ledgerAfterFirst =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    Logger.log(
        "LEDGER COUNT SETELAH PERTAMA:"
    );

    Logger.log(
        ledgerAfterFirst.length
    );


    /**
     * ========================================
     * 8. STOCK OUT KEDUA
     * ========================================
     */

    const secondResult =
        WorkOrderPartService.consumeStock(
            workOrderPartId
        );


    Logger.log(
        "STOCK OUT KEDUA:"
    );

    Logger.log(
        JSON.stringify(
            secondResult
        )
    );


    /**
     * ========================================
     * 9. STOCK SETELAH KEDUA
     * ========================================
     */

    const barangAfterSecond =
        BarangRepository.findById(
            "BRG000001"
        );


    const stockAfterSecond =
        Number(
            barangAfterSecond[
                COL_BARANG.STOK
            ]
        );


    Logger.log(
        "STOCK SETELAH KEDUA:"
    );

    Logger.log(
        stockAfterSecond
    );


    /**
     * ========================================
     * 10. LEDGER SETELAH KEDUA
     * ========================================
     */

    const ledgerAfterSecond =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    Logger.log(
        "LEDGER COUNT SETELAH KEDUA:"
    );

    Logger.log(
        ledgerAfterSecond.length
    );


    /**
     * ========================================
     * 11. VALIDASI
     * ========================================
     */

    const stockReducedOnce =
        stockAfterFirst ===
        stockBefore - 1;


    const stockNotReducedAgain =
        stockAfterSecond ===
        stockAfterFirst;


    const ledgerCreatedOnce =
        ledgerAfterFirst.length === 1;


    const ledgerStillOne =
        ledgerAfterSecond.length === 1;


    const secondCallAlreadyRecorded =
        secondResult.alreadyRecorded === true;


    Logger.log(
        "STOCK BERKURANG SATU KALI:"
    );

    Logger.log(
        stockReducedOnce
    );


    Logger.log(
        "STOCK TIDAK BERKURANG LAGI:"
    );

    Logger.log(
        stockNotReducedAgain
    );


    Logger.log(
        "LEDGER PERTAMA = 1:"
    );

    Logger.log(
        ledgerCreatedOnce
    );


    Logger.log(
        "LEDGER SETELAH KEDUA TETAP = 1:"
    );

    Logger.log(
        ledgerStillOne
    );


    Logger.log(
        "SECOND CALL ALREADY RECORDED:"
    );

    Logger.log(
        secondCallAlreadyRecorded
    );


    /**
     * ========================================
     * 12. FINAL ASSERTION
     * ========================================
     */

    if(

        !stockReducedOnce ||

        !stockNotReducedAgain ||

        !ledgerCreatedOnce ||

        !ledgerStillOne ||

        !secondCallAlreadyRecorded

    ){

        throw new Error(
            "Double Stock-Out Protection Test gagal."
        );

    }


    Logger.log(
        "DOUBLE STOCK-OUT PROTECTION TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Cancel + Stock Reversal Lifecycle
 * ============================================
 *
 * Scenario:
 *
 * OPEN
 *   ↓
 * PROGRESS
 *   ↓
 * STOCK OUT
 *   ↓
 * CANCEL
 *   ↓
 * STOCK REVERSAL
 *
 * Expected:
 *
 * 1. Stock berkurang saat Stock Out.
 * 2. Ledger OUT tetap ada.
 * 3. Cancel berhasil.
 * 4. Ledger REVERSAL dibuat.
 * 5. Stock kembali ke posisi sebelum Stock Out.
 * 6. Work Order Part menjadi CANCEL.
 * 7. Tidak ada double reversal.
 * ============================================
 */

function testWorkOrderPartCancelStockReversalLifecycle(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "CANCEL + STOCK REVERSAL LIFECYCLE TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Cancel Stock Reversal Lifecycle Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER PART
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            status :
                "AKTIF",

            catatan :
                "Cancel Stock Reversal Lifecycle Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "WORK ORDER PART ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. PART OPEN → PROGRESS
     * ========================================
     */

    const progressResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            progressResult
        )
    );


    /**
     * ========================================
     * 4. STOCK SEBELUM OUT
     * ========================================
     */

    const barangBefore =
        BarangRepository.findById(
            "BRG000001"
        );


    const stockBefore =
        Number(
            barangBefore[
                COL_BARANG.STOK
            ]
        );


    Logger.log(
        "STOCK SEBELUM OUT:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 5. STOCK OUT
     * ========================================
     */

    const stockOutResult =
        WorkOrderPartService.consumeStock(
            workOrderPartId
        );


    Logger.log(
        "STOCK OUT RESULT:"
    );

    Logger.log(
        JSON.stringify(
            stockOutResult
        )
    );


    /**
     * ========================================
     * 6. STOCK SETELAH OUT
     * ========================================
     */

    const barangAfterOut =
        BarangRepository.findById(
            "BRG000001"
        );


    const stockAfterOut =
        Number(
            barangAfterOut[
                COL_BARANG.STOK
            ]
        );


    Logger.log(
        "STOCK SETELAH OUT:"
    );

    Logger.log(
        stockAfterOut
    );


    /**
     * ========================================
     * 7. LEDGER SEBELUM CANCEL
     * ========================================
     */

    const ledgersBeforeCancel =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const stockOutLedgerCount =
        ledgersBeforeCancel.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;


    const reversalLedgerCountBefore =
        ledgersBeforeCancel.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim() ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "STOCK OUT LEDGER SEBELUM CANCEL:"
    );

    Logger.log(
        stockOutLedgerCount
    );


    Logger.log(
        "REVERSAL LEDGER SEBELUM CANCEL:"
    );

    Logger.log(
        reversalLedgerCountBefore
    );


    /**
     * ========================================
     * 8. CANCEL PART
     * ========================================
     */

    const cancelResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.CANCEL

        );


    Logger.log(
        "CANCEL RESULT:"
    );

    Logger.log(
        JSON.stringify(
            cancelResult
        )
    );


    /**
     * ========================================
     * 9. CEK STATUS AKHIR
     * ========================================
     */

    const finalPart =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    const finalStatus =
        finalPart[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS AKHIR:"
    );

    Logger.log(
        finalStatus
    );


    /**
     * ========================================
     * 10. STOCK SETELAH REVERSAL
     * ========================================
     */

    const barangAfterCancel =
        BarangRepository.findById(
            "BRG000001"
        );


    const stockAfterCancel =
        Number(
            barangAfterCancel[
                COL_BARANG.STOK
            ]
        );


    Logger.log(
        "STOCK SETELAH CANCEL:"
    );

    Logger.log(
        stockAfterCancel
    );


    /**
     * ========================================
     * 11. LEDGER SETELAH CANCEL
     * ========================================
     */

    const ledgersAfterCancel =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const stockOutLedgerCountAfter =
        ledgersAfterCancel.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;


    const reversalLedgerCountAfter =
        ledgersAfterCancel.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim() ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "STOCK OUT LEDGER SETELAH CANCEL:"
    );

    Logger.log(
        stockOutLedgerCountAfter
    );


    Logger.log(
        "REVERSAL LEDGER SETELAH CANCEL:"
    );

    Logger.log(
        reversalLedgerCountAfter
    );


    /**
     * ========================================
     * 12. VALIDASI
     * ========================================
     */

    const stockReducedOnce =
        stockAfterOut ===
        stockBefore - 1;


    const stockRestored =
        stockAfterCancel ===
        stockBefore;


    const stockOutLedgerRemains =
        stockOutLedgerCountAfter ===
        1;


    const reversalCreatedOnce =
        reversalLedgerCountBefore ===
            0 &&
        reversalLedgerCountAfter ===
            1;


    const statusCancel =
        finalStatus ===
        WorkOrderPartStatus.CANCEL;


    Logger.log(
        "STOCK BERKURANG 1:"
    );

    Logger.log(
        stockReducedOnce
    );


    Logger.log(
        "STOCK KEMBALI KE AWAL:"
    );

    Logger.log(
        stockRestored
    );


    Logger.log(
        "STOCK OUT LEDGER TETAP ADA:"
    );

    Logger.log(
        stockOutLedgerRemains
    );


    Logger.log(
        "REVERSAL LEDGER = 1:"
    );

    Logger.log(
        reversalCreatedOnce
    );


    Logger.log(
        "STATUS = CANCEL:"
    );

    Logger.log(
        statusCancel
    );


    /**
     * ========================================
     * 13. FINAL ASSERTION
     * ========================================
     */

    if(

        !stockReducedOnce ||

        !stockRestored ||

        !stockOutLedgerRemains ||

        !reversalCreatedOnce ||

        !statusCancel

    ){

        throw new Error(
            "Cancel + Stock Reversal Lifecycle Test gagal."
        );

    }


    Logger.log(
        "CANCEL + STOCK REVERSAL LIFECYCLE TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

function testWorkOrderPartStockCancelLifecycle(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART STOCK CANCEL LIFECYCLE"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WOP
     * ========================================
     */

    const createResult =
        WorkOrderPartService.create({

            workOrderId :
                "WO2608100001",

            barangId :
                "BRG000001",

            qty :
                1

        });


    const workOrderPartId =
        createResult.workOrderPartId;


    Logger.log(
        "WOP CREATED:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 2. CEK STATUS AWAL
     * ========================================
     */

    let part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    Logger.log(
        "INITIAL STATUS:"
    );

    Logger.log(
        part[
            COL_WORK_ORDER_PART.STATUS
        ]
    );


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     */

    const progressResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            progressResult
        )
    );


    /**
     * ========================================
     * 4. CEK STATUS
     * ========================================
     */

    part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    Logger.log(
        "STATUS AFTER PROGRESS:"
    );

    Logger.log(
        part[
            COL_WORK_ORDER_PART.STATUS
        ]
    );


    /**
     * ========================================
     * 5. BUILD STOCK OUT REQUEST
     * ========================================
     */

    const stockOutRequest =
        WorkOrderPartService
            .buildStockOutRequest(
                workOrderPartId
            );


    Logger.log(
        "STOCK OUT REQUEST:"
    );

    Logger.log(
        JSON.stringify(
            stockOutRequest
        )
    );


    /**
     * ========================================
     * 6. CONSUME STOCK
     * ========================================
     */

    const consumeResult =
        WorkOrderPartService.consumeStock(
            workOrderPartId
        );


    Logger.log(
        "CONSUME STOCK RESULT:"
    );

    Logger.log(
        JSON.stringify(
            consumeResult
        )
    );


    /**
     * ========================================
     * 7. CANCEL
     * ========================================
     */

    const cancelResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.CANCEL

        );


    Logger.log(
        "PROGRESS → CANCEL:"
    );

    Logger.log(
        JSON.stringify(
            cancelResult
        )
    );


    /**
     * ========================================
     * 8. REVERSAL
     * ========================================
     */

    const reversalResult =
        StockLedgerReversalService
            .reverseByWorkOrderPartId(
                workOrderPartId
            );


    Logger.log(
        "REVERSAL RESULT:"
    );

    Logger.log(
        JSON.stringify(
            reversalResult
        )
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "LIFECYCLE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCleanStockCancelReversalLifecycle(){

    Logger.log("================================");
    Logger.log("CLEAN STOCK CANCEL REVERSAL TEST");
    Logger.log("================================");


    /**
     * ========================================
     * 1. CREATE WOP
     * ========================================
     */

    const createResult =
        WorkOrderPartService.create({

            workOrderId :
                "WO2608100001",

            barangId :
                "BRG000001",

            qty :
                1

        });


    const workOrderPartId =
        createResult.workOrderPartId;


    if(!workOrderPartId){

        throw new Error(
            "WOP gagal dibuat."
        );

    }


    Logger.log(
        "WOP ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 2. STATUS AWAL
     * ========================================
     */

    let part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    Logger.log(
        "STATUS AWAL:"
    );

    Logger.log(
        part[
            COL_WORK_ORDER_PART.STATUS
        ]
    );


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     */

    WorkOrderPartService.changeStatus(

        workOrderPartId,

        WorkOrderPartStatus.PROGRESS

    );


    part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    Logger.log(
        "STATUS SETELAH PROGRESS:"
    );

    Logger.log(
        part[
            COL_WORK_ORDER_PART.STATUS
        ]
    );


    /**
     * ========================================
     * 4. STOCK SEBELUM OUT
     * ========================================
     */

    const stokSebelumOut =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOK SEBELUM OUT:"
    );

    Logger.log(
        stokSebelumOut
    );


    /**
     * ========================================
     * 5. CONSUME STOCK
     * ========================================
     */

    const consumeResult =
        WorkOrderPartService.consumeStock(
            workOrderPartId
        );


    Logger.log(
        "CONSUME RESULT:"
    );

    Logger.log(
        JSON.stringify(
            consumeResult
        )
    );


    /**
     * ========================================
     * 6. STOCK SETELAH OUT
     * ========================================
     */

    const stokSetelahOut =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOK SETELAH OUT:"
    );

    Logger.log(
        stokSetelahOut
    );


    /**
     * ========================================
     * 7. CEK LEDGER OUT
     * ========================================
     */

    const ledgerOut =
        StockLedgerRepository
            .findByReferensi(
                workOrderPartId
            );


    Logger.log(
        "LEDGER SETELAH OUT:"
    );

    Logger.log(
        JSON.stringify(
            ledgerOut
        )
    );


    /**
     * ========================================
     * 8. CANCEL
     * ========================================
     */

    const cancelResult =
        WorkOrderPartService.cancel(
            workOrderPartId
        );


    Logger.log(
        "CANCEL RESULT:"
    );

    Logger.log(
        JSON.stringify(
            cancelResult
        )
    );


    /**
     * ========================================
     * 9. STOCK SETELAH CANCEL
     * ========================================
     */

    const stokSetelahCancel =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOK SETELAH CANCEL:"
    );

    Logger.log(
        stokSetelahCancel
    );


    /**
     * ========================================
     * 10. CEK LEDGER FINAL
     * ========================================
     */

    const ledgerFinal =
        StockLedgerRepository
            .findByReferensi(
                workOrderPartId
            );


    Logger.log(
        "LEDGER FINAL:"
    );

    Logger.log(
        JSON.stringify(
            ledgerFinal
        )
    );


    /**
     * ========================================
     * 11. STATUS FINAL
     * ========================================
     */

    part =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    Logger.log(
        "STATUS FINAL:"
    );

    Logger.log(
        part[
            COL_WORK_ORDER_PART.STATUS
        ]
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "CLEAN LIFECYCLE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCleanLifecyclePreflight(){

    const barangId =
        "BRG000001";

    const barang =
        BarangRepository.findById(
            barangId
        );

    const stok =
        BarangRepository.getStock(
            barangId
        );

    Logger.log(
        "================================"
    );

    Logger.log(
        "CLEAN LIFECYCLE PREFLIGHT"
    );

    Logger.log(
        "================================"
    );

    Logger.log(
        "BARANG ID:"
    );

    Logger.log(
        barangId
    );

    Logger.log(
        "BARANG:"
    );

    Logger.log(
        JSON.stringify(
            barang
        )
    );

    Logger.log(
        "STOK AKTUAL:"
    );

    Logger.log(
        stok
    );

}

/**
 * ============================================
 * TEST:
 * Completion Gate + Part Cancel + Stock Reversal
 *
 * Version : 1.0.0
 *
 * Scenario:
 *
 * WO
 *  ↓
 * JASA DONE
 *  ↓
 * PART PROGRESS
 *  ↓
 * WO → QC
 *  ↓
 * STOCK OUT
 *  ↓
 * COMPLETION GATE = TRUE
 *  ↓
 * PART CANCEL
 *  ↓
 * REVERSAL
 *  ↓
 * STOCK KEMBALI
 *  ↓
 * COMPLETION GATE = FALSE
 *
 * Expected:
 *
 * 1. Stock berkurang saat Stock OUT.
 * 2. Completion Gate TRUE sebelum cancel.
 * 3. Cancel Part berhasil.
 * 4. Reversal mengembalikan stock.
 * 5. Stock kembali ke baseline.
 * 6. Completion Gate FALSE setelah part CANCEL.
 * 7. Tidak ada double reversal.
 *
 * ============================================
 */

function testCompletionGateAfterPartCancelReversalV1(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE + PART CANCEL + REVERSAL"
    );

    Logger.log(
        "INTEGRATION TEST V1"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * TEST FIXTURE
     * ========================================
     */

    const barangId =
        "BRG000001";

    const customerId =
        "CUS2608160002";

    const vehicleId =
        "VEH2608160002";


    /**
     * ========================================
     * CLEANUP STATE
     * ========================================
     */

    let stockBaseline = null;

    let stockLedgerId = null;

    let workOrderPartId = null;

    let workOrderId = null;


    try{

        /**
         * ====================================
         * 1. SNAPSHOT STOCK BASELINE
         * ====================================
         */

        stockBaseline =
            BarangRepository.getStock(
                barangId
            );


        Logger.log(
            "STOCK BASELINE:"
        );

        Logger.log(
            stockBaseline
        );


        /**
         * ====================================
         * 2. CREATE WORK ORDER
         * ====================================
         */

        Logger.log(
            "STEP 1: CREATE WORK ORDER"
        );


        const woResult =
            WorkOrderService.create({

                customerId :
                    customerId,

                vehicleId :
                    vehicleId,

                kilometerMasuk :
                    18000,

                admin :
                    "Completion Gate Cancel Reversal V1",

                jenisTransaksi :
                    WorkOrderType.SERVICE,

                prioritas :
                    WorkOrderPriority.NORMAL,

                catatan :
                    "Completion Gate Cancel Reversal V1"

            });


        workOrderId =
            woResult.workOrderId;


        Logger.log(
            "WORK ORDER ID:"
        );

        Logger.log(
            workOrderId
        );


        /**
         * ====================================
         * 3. CREATE JASA
         * ====================================
         */

        Logger.log(
            "STEP 2: CREATE JASA"
        );


        const jasaResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    "JAS000002",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "Completion Gate Cancel Reversal",

                diagnosa :
                    "Integration Test",

                catatan :
                    "Completion Gate Cancel Reversal V1"

            });


        const workOrderJasaId =
            jasaResult.workOrderJasaId;


        Logger.log(
            "WORK ORDER JASA ID:"
        );

        Logger.log(
            workOrderJasaId
        );


        /**
         * ====================================
         * 4. JASA → DONE
         * ====================================
         */

        Logger.log(
            "STEP 3: JASA → DONE"
        );


        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.DONE

        );


        Logger.log(
            "JASA DONE PASS"
        );


        /**
         * ====================================
         * 5. CREATE PART
         * ====================================
         */

        Logger.log(
            "STEP 4: CREATE PART"
        );


        const partResult =
            WorkOrderPartService.create({

                workOrderId :
                    workOrderId,

                workOrderJasaId :
                    workOrderJasaId,

                barangId :
                    barangId,

                qty :
                    1,

                harga :
                    55000,

                diskon :
                    0,

                catatan :
                    "Completion Gate Cancel Reversal Part"

            });


        workOrderPartId =
            partResult.workOrderPartId;


        Logger.log(
            "WORK ORDER PART ID:"
        );

        Logger.log(
            workOrderPartId
        );


        /**
         * ====================================
         * 6. PART → PROGRESS
         * ====================================
         */

        Logger.log(
            "STEP 5: PART → PROGRESS"
        );


        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


        Logger.log(
            "PART PROGRESS PASS"
        );


        /**
         * ====================================
         * 7. WO LIFECYCLE → QC
         * ====================================
         */

        Logger.log(
            "STEP 6: WO LIFECYCLE → QC"
        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_DIAGNOSA

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_APPROVAL

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.DALAM_PENGERJAAN

        );


        /**
         * ====================================
         * CARI TRANSISI QC
         * ====================================
         *
         * Mengikuti lifecycle yang sudah
         * digunakan pada regression test.
         */

        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.QC

        );


        Logger.log(
            "WO → QC PASS"
        );


        /**
         * ====================================
         * 8. STOCK OUT
         * ====================================
         */

        Logger.log(
            "STEP 7: STOCK OUT"
        );


        const stockOutResult =
            WorkOrderPartService.consumeStock(

                workOrderPartId

            );


        Logger.log(
            "STOCK OUT RESULT:"
        );

        Logger.log(
            JSON.stringify(
                stockOutResult,
                null,
                2
            )
        );


        /**
         * ====================================
         * 9. AMBIL STOCK LEDGER ID
         * ====================================
         */

        const ledgersAfterOut =
            StockLedgerRepository
                .findByReferensi(
                    workOrderPartId
                );


        Logger.log(
            "LEDGER AFTER STOCK OUT:"
        );

        Logger.log(
            JSON.stringify(
                ledgersAfterOut,
                null,
                2
            )
        );


        const outLedgers =
            ledgersAfterOut.filter(
                function(ledger){

                    return (

                        Number(
                            ledger[
                                COL_STOK.QTYKELUAR
                            ]
                        ) || 0

                    ) > 0;

                }
            );


        if(
            outLedgers.length !== 1
        ){

            throw new Error(
                "Ledger STOCK OUT tidak ditemukan."
            );

        }


        stockLedgerId =
            String(
                outLedgers[0][
                    COL_STOK.ID
                ]
            ).trim();


        Logger.log(
            "STOCK LEDGER ID:"
        );

        Logger.log(
            stockLedgerId
        );


        /**
         * ====================================
         * 10. VERIFY STOCK BERKURANG
         * ====================================
         */

        const stockAfterOut =
            BarangRepository.getStock(
                barangId
            );


        Logger.log(
            "STOCK AFTER OUT:"
        );

        Logger.log(
            stockAfterOut
        );


        if(
            stockAfterOut !==
            stockBaseline - 1
        ){

            throw new Error(
                "Stock OUT tidak sesuai expectation."
            );

        }


        Logger.log(
            "STOCK OUT QTY PASS"
        );


        /**
         * ====================================
         * 11. COMPLETION GATE SEBELUM CANCEL
         * ====================================
         */

        Logger.log(
            "STEP 8: COMPLETION GATE BEFORE CANCEL"
        );


        const completionBeforeCancel =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        Logger.log(
            JSON.stringify(
                completionBeforeCancel,
                null,
                2
            )
        );


        if(
            completionBeforeCancel.canComplete !==
            true
        ){

            throw new Error(
                "Completion Gate seharusnya TRUE sebelum cancel."
            );

        }


        Logger.log(
            "COMPLETION GATE BEFORE CANCEL PASS"
        );


        /**
         * ====================================
         * 12. CANCEL PART
         * ====================================
         */

        Logger.log(
            "STEP 9: CANCEL PART"
        );


        const cancelResult =
            WorkOrderPartService.cancel(

                workOrderPartId

            );


        Logger.log(
            "CANCEL RESULT:"
        );

        Logger.log(
            JSON.stringify(
                cancelResult,
                null,
                2
            )
        );


        /**
         * ====================================
         * 13. VERIFY PART STATUS
         * ====================================
         */

        const cancelledPart =
            WorkOrderPartRepository.findById(
                workOrderPartId
            );


        const cancelledStatus =
            String(
                cancelledPart[
                    COL_WORK_ORDER_PART.STATUS
                ] || ""
            ).trim();


        Logger.log(
            "PART STATUS AFTER CANCEL:"
        );

        Logger.log(
            cancelledStatus
        );


        if(
            cancelledStatus !==
            WorkOrderPartStatus.CANCEL
        ){

            throw new Error(
                "Work Order Part gagal menjadi CANCEL."
            );

        }


        Logger.log(
            "PART CANCEL PASS"
        );


        /**
         * ====================================
         * 14. REVERSAL
         * ====================================
         */

        Logger.log(
            "STEP 10: STOCK REVERSAL"
        );


        const reversalResult =
            StockLedgerReversalService
                .reverseByWorkOrderPartId(
                    workOrderPartId
                );


        Logger.log(
            "REVERSAL RESULT:"
        );

        Logger.log(
            JSON.stringify(
                reversalResult,
                null,
                2
            )
        );


        /**
         * ====================================
         * 15. VERIFY STOCK RESTORED
         * ====================================
         */

        const stockAfterReversal =
            BarangRepository.getStock(
                barangId
            );


        Logger.log(
            "STOCK AFTER REVERSAL:"
        );

        Logger.log(
            stockAfterReversal
        );


        if(
            stockAfterReversal !==
            stockBaseline
        ){

            throw new Error(
                "Stock tidak kembali ke baseline setelah reversal."
            );

        }


        Logger.log(
            "STOCK RESTORE PASS"
        );


        /**
         * ====================================
         * 16. VERIFY REVERSAL LEDGER
         * ====================================
         */

        const ledgersAfterReversal =
            StockLedgerRepository
                .findByReferensi(
                    workOrderPartId
                );


        const reversalLedgers =
            ledgersAfterReversal.filter(
                function(ledger){

                    return (

                        String(
                            ledger[
                                COL_STOK.JENISMUTASI
                            ] || ""
                        ).trim()
                        ===
                        "REVERSAL"

                    );

                }
            );


        Logger.log(
            "REVERSAL LEDGER COUNT:"
        );

        Logger.log(
            reversalLedgers.length
        );


        if(
            reversalLedgers.length !== 1
        ){

            throw new Error(
                "Ledger REVERSAL tidak ditemukan."
            );

        }


        Logger.log(
            "REVERSAL LEDGER PASS"
        );


        /**
         * ====================================
         * 17. COMPLETION GATE AFTER CANCEL
         * ====================================
         */

        Logger.log(
            "STEP 11: COMPLETION GATE AFTER CANCEL"
        );


        const completionAfterCancel =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        Logger.log(
            JSON.stringify(
                completionAfterCancel,
                null,
                2
            )
        );


        if(
            completionAfterCancel.canComplete !==
            false
        ){

            throw new Error(
                "Completion Gate seharusnya FALSE setelah Part CANCEL."
            );

        }


        Logger.log(
            "COMPLETION GATE AFTER CANCEL PASS"
        );


        /**
         * ====================================
         * 18. TEST DOUBLE REVERSAL
         * ====================================
         */

        Logger.log(
            "STEP 12: DUPLICATE REVERSAL"
        );


        let duplicateReversalRejected =
            false;


        try{

            StockLedgerReversalService
                .reverseByWorkOrderPartId(
                    workOrderPartId
                );

        }
        catch(error){

            duplicateReversalRejected =
                true;


            Logger.log(
                "EXPECTED DUPLICATE ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(
            !duplicateReversalRejected
        ){

            throw new Error(
                "Double reversal seharusnya ditolak."
            );

        }


        Logger.log(
            "DUPLICATE REVERSAL REJECT PASS"
        );


        /**
         * ====================================
         * 19. FINAL VERIFICATION
         * ====================================
         */

        const finalStock =
            BarangRepository.getStock(
                barangId
            );


        if(
            finalStock !==
            stockBaseline
        ){

            throw new Error(
                "Final stock tidak sama dengan baseline."
            );

        }


        Logger.log(
            "FINAL STOCK:"
        );

        Logger.log(
            finalStock
        );


        /**
         * ====================================
         * FINAL PASS
         * ====================================
         */

        Logger.log(
            "================================"
        );

        Logger.log(
            "COMPLETION GATE + CANCEL + REVERSAL"
        );

        Logger.log(
            "INTEGRATION TEST V1 PASS"
        );

        Logger.log(
            "================================"
        );


    }
    finally{


        /**
         * ====================================
         * CLEANUP
         * ====================================
         *
         * Pastikan stock kembali ke baseline.
         *
         * Jangan menghapus ledger OUT/REVERSAL
         * di sini jika reversal sudah berhasil,
         * karena lifecycle ledger memang bagian
         * dari data yang sedang diuji.
         *
         * Namun jika test berhenti sebelum
         * reversal terjadi, stock perlu
         * dikembalikan secara manual.
         * ====================================
         */

        if(
            stockBaseline !== null
        ){

            const currentStock =
                BarangRepository.getStock(
                    barangId
                );


            Logger.log(
                "CLEANUP STOCK:"
            );

            Logger.log(
                currentStock
            );


            /**
             * Jika stock masih berbeda dari
             * baseline, restore langsung.
             */

            if(
                currentStock !==
                stockBaseline
            ){

                BarangRepository.updateStockAbsolute(

                    barangId,

                    stockBaseline

                );


                Logger.log(
                    "STOCK FORCE RESTORED:"
                );

                Logger.log(
                    BarangRepository.getStock(
                        barangId
                    )
                );

            }
            else{

                Logger.log(
                    "STOCK SUDAH SESUAI BASELINE."
                );

            }

        }


        Logger.log(
            "CLEANUP SELESAI"
        );

    }

}

/**
 * ============================================
 * TEST:
 * Work Order Part Cancel Auto Reversal
 * + Duplicate Cancel Rejection
 * ============================================
 *
 * Expected:
 *
 * PROGRESS
 *    ↓
 * STOCK OUT
 *    ↓
 * CANCEL
 *    ↓
 * AUTO REVERSAL
 *
 * Kemudian:
 *
 * CANCEL
 *    ↓
 * CANCEL
 *    ↓
 * REJECT
 *
 * Validasi:
 *
 * 1. Stock berkurang 1 saat Stock Out.
 * 2. Stock kembali ke baseline setelah CANCEL.
 * 3. Ledger OUT tetap ada.
 * 4. Ledger REVERSAL dibuat tepat 1.
 * 5. Status WOP menjadi CANCEL.
 * 6. CANCEL kedua ditolak.
 * 7. Stock tidak berubah setelah CANCEL kedua.
 * 8. Tidak dibuat reversal kedua.
 * ============================================
 */

function testWorkOrderPartCancelAutoReversalDuplicateCancel(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART CANCEL AUTO REVERSAL"
    );

    Logger.log(
        "DUPLICATE CANCEL REJECTION TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
    "CUS2608160002",

vehicleId :
    "VEH2608160002",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Cancel Auto Reversal Duplicate Cancel Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER PART
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Cancel Auto Reversal Duplicate Cancel Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    if(
        !workOrderPartId
    ){

        throw new Error(
            "Work Order Part gagal dibuat."
        );

    }


    Logger.log(
        "WORK ORDER PART ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     */

    const progressResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            progressResult
        )
    );


    /**
     * ========================================
     * 4. STOCK BASELINE
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK BASELINE:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 5. STOCK OUT
     * ========================================
     */

    const stockOutResult =
        WorkOrderPartService.consumeStock(
            workOrderPartId
        );


    Logger.log(
        "STOCK OUT RESULT:"
    );

    Logger.log(
        JSON.stringify(
            stockOutResult
        )
    );


    /**
     * ========================================
     * 6. VALIDATE STOCK AFTER OUT
     * ========================================
     */

    const stockAfterOut =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK AFTER OUT:"
    );

    Logger.log(
        stockAfterOut
    );


    const stockReducedOnce =
        stockAfterOut ===
        stockBefore - 1;


    Logger.log(
        "STOCK BERKURANG 1:"
    );

    Logger.log(
        stockReducedOnce
    );


    if(
        !stockReducedOnce
    ){

        throw new Error(
            "Stock Out tidak sesuai expectation."
        );

    }


    /**
     * ========================================
     * 7. CEK LEDGER SEBELUM CANCEL
     * ========================================
     */

    const ledgersBeforeCancel =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const stockOutLedgerCountBefore =
        ledgersBeforeCancel.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;


    const reversalLedgerCountBefore =
        ledgersBeforeCancel.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "STOCK OUT LEDGER SEBELUM CANCEL:"
    );

    Logger.log(
        stockOutLedgerCountBefore
    );


    Logger.log(
        "REVERSAL LEDGER SEBELUM CANCEL:"
    );

    Logger.log(
        reversalLedgerCountBefore
    );


    /**
     * ========================================
     * 8. CANCEL
     * ========================================
     *
     * Penting:
     *
     * Kita TIDAK memanggil
     * StockLedgerReversalService
     * secara manual.
     *
     * Karena changeStatus(CANCEL)
     * seharusnya melakukan AUTO REVERSAL.
     * ========================================
     */

    const cancelResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.CANCEL

        );


    Logger.log(
        "CANCEL RESULT:"
    );

    Logger.log(
        JSON.stringify(
            cancelResult
        )
    );


    /**
     * ========================================
     * 9. STATUS SETELAH CANCEL
     * ========================================
     */

    const partAfterCancel =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    const statusAfterCancel =
        partAfterCancel[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "STATUS SETELAH CANCEL:"
    );

    Logger.log(
        statusAfterCancel
    );


    const statusCancel =
        statusAfterCancel ===
        WorkOrderPartStatus.CANCEL;


    Logger.log(
        "STATUS = CANCEL:"
    );

    Logger.log(
        statusCancel
    );


    if(
        !statusCancel
    ){

        throw new Error(
            "Status WOP tidak menjadi CANCEL."
        );

    }


    /**
     * ========================================
     * 10. STOCK SETELAH AUTO REVERSAL
     * ========================================
     */

    const stockAfterCancel =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH AUTO REVERSAL:"
    );

    Logger.log(
        stockAfterCancel
    );


    const stockRestored =
        stockAfterCancel ===
        stockBefore;


    Logger.log(
        "STOCK KEMBALI KE BASELINE:"
    );

    Logger.log(
        stockRestored
    );


    if(
        !stockRestored
    ){

        throw new Error(
            "Auto reversal gagal: stock tidak kembali ke baseline."
        );

    }


    /**
     * ========================================
     * 11. CEK LEDGER SETELAH AUTO REVERSAL
     * ========================================
     */

    const ledgersAfterCancel =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const stockOutLedgerCountAfter =
        ledgersAfterCancel.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;


    const reversalLedgerCountAfter =
        ledgersAfterCancel.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "STOCK OUT LEDGER SETELAH CANCEL:"
    );

    Logger.log(
        stockOutLedgerCountAfter
    );


    Logger.log(
        "REVERSAL LEDGER SETELAH CANCEL:"
    );

    Logger.log(
        reversalLedgerCountAfter
    );


    /**
     * ========================================
     * 12. VALIDASI AUTO REVERSAL
     * ========================================
     */

    const stockOutRemains =
        stockOutLedgerCountAfter ===
        1;


    const reversalCreatedOnce =
        reversalLedgerCountBefore ===
            0 &&
        reversalLedgerCountAfter ===
            1;


    Logger.log(
        "STOCK OUT LEDGER TETAP ADA:"
    );

    Logger.log(
        stockOutRemains
    );


    Logger.log(
        "REVERSAL TEPAT 1:"
    );

    Logger.log(
        reversalCreatedOnce
    );


    if(
        !stockOutRemains
    ){

        throw new Error(
            "Ledger Stock OUT lama tidak tetap ada."
        );

    }


    if(
        !reversalCreatedOnce
    ){

        throw new Error(
            "Auto reversal tidak menghasilkan tepat 1 ledger REVERSAL."
        );

    }


    /**
     * ========================================
     * 13. SNAPSHOT SEBELUM DUPLICATE CANCEL
     * ========================================
     */

    const stockBeforeDuplicateCancel =
        BarangRepository.getStock(
            "BRG000001"
        );


    const ledgersBeforeDuplicateCancel =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const reversalCountBeforeDuplicateCancel =
        ledgersBeforeDuplicateCancel.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "STOCK SEBELUM DUPLICATE CANCEL:"
    );

    Logger.log(
        stockBeforeDuplicateCancel
    );


    Logger.log(
        "REVERSAL SEBELUM DUPLICATE CANCEL:"
    );

    Logger.log(
        reversalCountBeforeDuplicateCancel
    );


    /**
     * ========================================
     * 14. DUPLICATE CANCEL
     * ========================================
     */

    let duplicateCancelRejected =
        false;


    try{

        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.CANCEL

        );


        Logger.log(
            "ERROR: DUPLICATE CANCEL SEHARUSNYA DITOLAK"
        );

    }
    catch(error){

        duplicateCancelRejected =
            true;


        Logger.log(
            "EXPECTED DUPLICATE CANCEL ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "DUPLICATE CANCEL DITOLAK:"
    );

    Logger.log(
        duplicateCancelRejected
    );


    /**
     * ========================================
     * 15. STOCK SETELAH DUPLICATE CANCEL
     * ========================================
     */

    const stockAfterDuplicateCancel =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH DUPLICATE CANCEL:"
    );

    Logger.log(
        stockAfterDuplicateCancel
    );


    const stockUnchanged =
        stockAfterDuplicateCancel ===
        stockBeforeDuplicateCancel;


    Logger.log(
        "STOCK TIDAK BERUBAH:"
    );

    Logger.log(
        stockUnchanged
    );


    /**
     * ========================================
     * 16. LEDGER SETELAH DUPLICATE CANCEL
     * ========================================
     */

    const ledgersAfterDuplicateCancel =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const reversalCountAfterDuplicateCancel =
        ledgersAfterDuplicateCancel.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "REVERSAL SETELAH DUPLICATE CANCEL:"
    );

    Logger.log(
        reversalCountAfterDuplicateCancel
    );


    const noDuplicateReversal =
        reversalCountAfterDuplicateCancel ===
        reversalCountBeforeDuplicateCancel;


    Logger.log(
        "TIDAK ADA DUPLICATE REVERSAL:"
    );

    Logger.log(
        noDuplicateReversal
    );


    /**
     * ========================================
     * 17. FINAL STATUS
     * ========================================
     */

    const finalPart =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    const finalStatus =
        finalPart[
            COL_WORK_ORDER_PART.STATUS
        ];


    const finalStatusStillCancel =
        finalStatus ===
        WorkOrderPartStatus.CANCEL;


    Logger.log(
        "FINAL STATUS:"
    );

    Logger.log(
        finalStatus
    );


    Logger.log(
        "FINAL STATUS TETAP CANCEL:"
    );

    Logger.log(
        finalStatusStillCancel
    );


    /**
     * ========================================
     * 18. FINAL ASSERTION
     * ========================================
     */

    if(
        !duplicateCancelRejected
    ){

        throw new Error(
            "Duplicate CANCEL seharusnya ditolak."
        );

    }


    if(
        !stockUnchanged
    ){

        throw new Error(
            "Stock berubah setelah duplicate CANCEL."
        );

    }


    if(
        !noDuplicateReversal
    ){

        throw new Error(
            "Duplicate CANCEL menghasilkan reversal kedua."
        );

    }


    if(
        !finalStatusStillCancel
    ){

        throw new Error(
            "Status akhir WOP tidak tetap CANCEL."
        );

    }


    /**
     * ========================================
     * FINAL
     * ========================================
     */

    Logger.log(
        "================================"
    );

    Logger.log(
        "CANCEL AUTO REVERSAL"
    );

    Logger.log(
        "DUPLICATE CANCEL REJECTION PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * CANONICAL WOP STOCK-OUT IDENTITY REGRESSION
 * ============================================
 *
 * Covers Step 1:
 * - normal stock-out
 * - deterministic transaction identity
 * - retry returns existing transaction
 * - incompatible retry is rejected
 * - cancellation creates one reversal
 * - duplicate reversal is rejected
 *
 * Atomic partial-failure rollback remains covered
 * by testStockLedgerServiceRecordOutBatchAtomicRollback().
 * ============================================
 */
function testCanonicalWopStockOutIdentityRegression(){

    const barangId =
        "BRG000001";

    const stockBefore =
        BarangRepository.getStock(
            barangId
        );

    const workOrderResult =
        WorkOrderService.create({

            customerId :
                "CUS2608160002",

            vehicleId :
                "VEH2608160002",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Canonical WOP Stock-Out Identity Regression"

        });

    const workOrderId =
        workOrderResult.workOrderId;

    const workOrderPartResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                barangId,

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Canonical identity test"

        });

    const workOrderPartId =
        workOrderPartResult.workOrderPartId;

    WorkOrderPartService.changeStatus(
        workOrderPartId,
        WorkOrderPartStatus.PROGRESS
    );


    const firstResult =
        WorkOrderPartService.consumeStock(
            workOrderPartId
        );

    const stockAfterFirst =
        BarangRepository.getStock(
            barangId
        );

    const ledgersAfterFirst =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );

    const outLedgersAfterFirst =
        ledgersAfterFirst.filter(
            function(row){

                return (
                    Number(
                        row[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        );

    const expectedKey =
        "WOP:" +
        workOrderPartId +
        ":OUT";

    if(
        stockAfterFirst !==
        stockBefore - 1
    ){

        throw new Error(
            "Canonical stock-out tidak mengurangi stok tepat satu kali."
        );

    }

    if(outLedgersAfterFirst.length !== 1){

        throw new Error(
            "Canonical stock-out harus membuat tepat satu ledger OUT."
        );

    }

    if(
        !firstResult.transaction ||
        firstResult.transaction.transactionId !== expectedKey ||
        firstResult.transaction.transactionType !== "WO_PART_OUT" ||
        firstResult.transaction.sourceDocumentType !== "WORK_ORDER_PART" ||
        firstResult.transaction.sourceDocumentId !== workOrderId ||
        firstResult.transaction.sourceLineId !== workOrderPartId ||
        firstResult.transaction.idempotencyKey !== expectedKey
    ){

        throw new Error(
            "Canonical transaction identity WorkOrderPart tidak sesuai."
        );

    }


    const retryResult =
        WorkOrderPartService.consumeStock(
            workOrderPartId
        );

    const stockAfterRetry =
        BarangRepository.getStock(
            barangId
        );

    const outLedgersAfterRetry =
        StockLedgerRepository
            .findByReferensi(
                workOrderPartId
            )
            .filter(
                function(row){

                    return (
                        Number(
                            row[
                                COL_STOK.QTYKELUAR
                            ]
                        ) || 0
                    ) > 0;

                }
            );

    if(
        retryResult.alreadyRecorded !== true ||
        !retryResult.existingTransaction ||
        retryResult.existingTransaction.transaction.idempotencyKey !== expectedKey
    ){

        throw new Error(
            "Retry canonical WOP harus mengembalikan transaction yang sudah ada."
        );

    }

    if(
        stockAfterRetry !== stockAfterFirst ||
        outLedgersAfterRetry.length !== 1
    ){

        throw new Error(
            "Retry canonical WOP mengubah stok atau membuat ledger OUT baru."
        );

    }


    const workOrderPart =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );

    const conflictRequest =
        WorkOrderPartService.buildStockOutRequest(
            workOrderPart
        );

    conflictRequest.referensi =
        workOrderPartId;

    conflictRequest.qty =
        2;

    let conflictRejected =
        false;

    try{

        StockLedgerService.recordOutBatchAtomic([
            conflictRequest
        ]);

    }
    catch(error){

        conflictRejected =
            String(error.message || "")
                .includes("Conflict canonical Stock Out");

    }

    if(!conflictRejected){

        throw new Error(
            "Payload retry yang tidak kompatibel harus ditolak."
        );

    }

    if(
        BarangRepository.getStock(barangId) !==
        stockAfterRetry
    ){

        throw new Error(
            "Conflict canonical WOP tidak boleh mengubah stok."
        );

    }


    const assertCanonicalConflict =
        function(mutateRequest, label){

            const request =
                WorkOrderPartService.buildStockOutRequest(
                    workOrderPart
                );

            request.referensi =
                workOrderPartId;

            mutateRequest(request);

            let rejected =
                false;

            try{

                StockLedgerService.recordOutBatchAtomic([
                    request
                ]);

            }
            catch(error){

                rejected =
                    String(error.message || "")
                        .toLowerCase()
                        .includes("canonical");

            }

            if(!rejected){

                throw new Error(
                    "Conflict canonical WOP harus ditolak: " +
                    label
                );

            }

            if(
                BarangRepository.getStock(barangId) !==
                stockAfterRetry
            ){

                throw new Error(
                    "Conflict canonical WOP mengubah stok: " +
                    label
                );

            }

        };


    assertCanonicalConflict(
        function(request){

            request.canonicalIdentity.sourceDocumentId =
                "WO-CONFLICT";

        },
        "sourceDocumentId"
    );

    assertCanonicalConflict(
        function(request){

            request.canonicalIdentity.transactionType =
                "SALE";

        },
        "transactionType"
    );

    assertCanonicalConflict(
        function(request){

            request.canonicalIdentity.sourceDocumentType =
                "SALES";

        },
        "sourceDocumentType"
    );

    assertCanonicalConflict(
        function(request){

            request.referensi =
                "WOP-CONFLICT";

        },
        "sourceLineId / ledger Referensi"
    );

    assertCanonicalConflict(
        function(request){

            request.barangId =
                "BRG000002";

        },
        "barangId"
    );


    const originalFindByReferensi =
        StockLedgerRepository.findByReferensi;

    let nonWoLedgerRejected =
        false;

    try{

        StockLedgerRepository.findByReferensi =
            function(reference){

                const rows =
                    originalFindByReferensi.call(
                        this,
                        reference
                    );

                return rows.map(
                    function(row){

                        const copy =
                            row.slice();

                        copy[
                            COL_STOK.JENISMUTASI
                        ] = "SALE";

                        return copy;

                    }
                );

            };

        StockLedgerService.recordOutBatchAtomic([
            WorkOrderPartService.buildStockOutRequest(
                workOrderPart
            )
        ].map(function(request){

            request.referensi =
                workOrderPartId;

            return request;

        }));

    }
    catch(error){

        nonWoLedgerRejected =
            String(error.message || "")
                .toLowerCase()
                .includes("canonical");

    }
    finally{

        StockLedgerRepository.findByReferensi =
            originalFindByReferensi;

    }

    if(!nonWoLedgerRejected){

        throw new Error(
            "Ledger non-WO dengan Referensi sama harus ditolak."
        );

    }


    WorkOrderPartService.cancel(
        workOrderPartId
    );

    const stockAfterCancel =
        BarangRepository.getStock(
            barangId
        );

    const ledgersAfterCancel =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );

    const outCount =
        ledgersAfterCancel.filter(
            function(row){

                return (
                    Number(
                        row[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;

    const reversalCount =
        ledgersAfterCancel.filter(
            function(row){

                return String(
                    row[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim() === "REVERSAL";

            }
        ).length;

    if(
        stockAfterCancel !== stockBefore ||
        outCount !== 1 ||
        reversalCount !== 1
    ){

        throw new Error(
            "Cancellation canonical WOP tidak mempertahankan OUT/reversal atau stok baseline."
        );

    }


    let duplicateReversalRejected =
        false;

    try{

        StockLedgerReversalService
            .reverseByWorkOrderPartId(
                workOrderPartId
            );

    }
    catch(error){

        duplicateReversalRejected =
            String(error.message || "")
                .includes("sudah pernah direversal");

    }

    if(
        !duplicateReversalRejected ||
        BarangRepository.getStock(barangId) !== stockBefore
    ){

        throw new Error(
            "Duplicate reversal canonical WOP harus ditolak tanpa mengubah stok."
        );

    }

    Logger.log(
        "CANONICAL WOP STOCK-OUT IDENTITY REGRESSION PASS"
    );

}

function runCanonicalWopInventoryStep1Regression(){

    testCanonicalWopStockOutIdentityRegression();

    testStockLedgerServiceRecordOutBatchAtomicRollback();

    Logger.log(
        "CANONICAL WOP INVENTORY STEP 1 REGRESSION PASS"
    );

}

function runCanonicalWopInventoryStep1RegressionCli(){

    runCanonicalWopInventoryStep1Regression();

    return {
        success : true,
        message : "CANONICAL WOP INVENTORY STEP 1 REGRESSION PASS"
    };

}

/**
 * ============================================
 * CANONICAL WOP INVENTORY STEP 2A
 * BATCH CHARACTERIZATION REGRESSION
 * ============================================
 *
 * Test-only characterization for the legacy
 * consumeStockBatch() path. These tests do not
 * implement canonical batch behavior.
 * ============================================
 */

function assertCanonicalWopStep2A_(condition, message){

    if(!condition){

        throw new Error(
            "Step 2A characterization gagal: " +
            message
        );

    }

}

function getCanonicalWopStep2AOutLedgers_(workOrderPartId){

    return StockLedgerRepository
        .findByReferensi(
            workOrderPartId
        )
        .filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        );

}

function getCanonicalWopStep2AAlternativeBarangId_(){

    const primaryBarangId =
        "BRG000001";

    const candidates =
        BarangRepository.findAll();

    for(
        let i = 0;
        i < candidates.length;
        i++
    ){

        const barang =
            candidates[i];

        const barangId =
            String(
                barang[
                    COL_BARANG.ID
                ] || ""
            ).trim();

        const status =
            String(
                barang[
                    COL_BARANG.STATUS
                ] || ""
            ).trim();

        const stock =
            Number(
                barang[
                    COL_BARANG.STOK
                ]
            ) || 0;

        if(
            barangId &&
            barangId !== primaryBarangId &&
            status === BarangStatus.AKTIF &&
            stock >= 1
        ){

            return barangId;

        }

    }

    throw new Error(
        "Step 2A membutuhkan barang aktif selain BRG000001 dengan stok minimal 1."
    );

}

function createCanonicalWopStep2AWorkOrder_(label){

    const result =
        WorkOrderService.create({

            customerId :
                "CUS2608160002",

            vehicleId :
                "VEH2608160002",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Canonical WOP Step 2A - " + label

        });

    assertCanonicalWopStep2A_(
        !!result.workOrderId,
        "Work Order fixture gagal dibuat."
    );

    return result.workOrderId;

}

function createCanonicalWopStep2AProgressPart_(
    workOrderId,
    barangId,
    qty,
    label
){

    const result =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                barangId,

            qty :
                qty,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Canonical WOP Step 2A - " + label

        });

    const workOrderPartId =
        result.workOrderPartId;

    assertCanonicalWopStep2A_(
        !!workOrderPartId,
        "WorkOrderPart fixture gagal dibuat."
    );

    WorkOrderPartService.changeStatus(
        workOrderPartId,
        WorkOrderPartStatus.PROGRESS
    );

    return workOrderPartId;

}

function cleanupCanonicalWopStep2AParts_(workOrderPartIds){

    for(
        let i = 0;
        i < workOrderPartIds.length;
        i++
    ){

        const workOrderPartId =
            workOrderPartIds[i];

        const part =
            WorkOrderPartRepository.findById(
                workOrderPartId
            );

        if(!part){

            continue;

        }

        const status =
            part[
                COL_WORK_ORDER_PART.STATUS
            ];

        if(status !== WorkOrderPartStatus.CANCEL){

            WorkOrderPartService.cancel(
                workOrderPartId
            );

        }

    }

}

function testCanonicalWopStep2ATwoWopDifferentBarang(){

    const primaryBarangId =
        "BRG000001";

    const alternativeBarangId =
        getCanonicalWopStep2AAlternativeBarangId_();

    const primaryStockBefore =
        BarangRepository.getStock(
            primaryBarangId
        );

    const alternativeStockBefore =
        BarangRepository.getStock(
            alternativeBarangId
        );

    assertCanonicalWopStep2A_(
        primaryStockBefore >= 1 &&
        alternativeStockBefore >= 1,
        "Stok fixture dua barang tidak mencukupi."
    );

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "two different barang"
        );

    const workOrderPartA =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            primaryBarangId,
            1,
            "different barang A"
        );

    const workOrderPartB =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            alternativeBarangId,
            1,
            "different barang B"
        );

    try{

        const result =
            WorkOrderPartService.consumeStockBatch(
                workOrderId
            );

        const outA =
            getCanonicalWopStep2AOutLedgers_(
                workOrderPartA
            );

        const outB =
            getCanonicalWopStep2AOutLedgers_(
                workOrderPartB
            );

        assertCanonicalWopStep2A_(
            result.success === true &&
            result.totalItem === 2,
            "Batch dua barang harus menghasilkan dua item ledger legacy."
        );

        assertCanonicalWopStep2A_(
            BarangRepository.getStock(primaryBarangId) ===
            primaryStockBefore - 1 &&
            BarangRepository.getStock(alternativeBarangId) ===
            alternativeStockBefore - 1,
            "Batch dua barang harus mengurangi masing-masing stok satu."
        );

        assertCanonicalWopStep2A_(
            outA.length === 1 &&
            outB.length === 1 &&
            Number(outA[0][COL_STOK.QTYKELUAR]) === 1 &&
            Number(outB[0][COL_STOK.QTYKELUAR]) === 1,
            "Batch dua barang harus tetap traceable per WOP."
        );

    }
    finally{

        cleanupCanonicalWopStep2AParts_([
            workOrderPartA,
            workOrderPartB
        ]);

        assertCanonicalWopStep2A_(
            BarangRepository.getStock(primaryBarangId) ===
            primaryStockBefore &&
            BarangRepository.getStock(alternativeBarangId) ===
            alternativeStockBefore,
            "Cleanup dua barang harus mengembalikan stok baseline."
        );

    }

}

function testCanonicalWopStep2ATwoWopSameBarangLegacyCharacterization(){

    const barangId =
        "BRG000001";

    const stockBefore =
        BarangRepository.getStock(
            barangId
        );

    assertCanonicalWopStep2A_(
        stockBefore >= 3,
        "Stok BRG000001 harus minimal 3 untuk karakterisasi grouped ledger."
    );

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "same barang grouped ledger"
        );

    const workOrderPartA =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            barangId,
            1,
            "same barang A"
        );

    const workOrderPartB =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            barangId,
            2,
            "same barang B"
        );

    try{

        const result =
            WorkOrderPartService.consumeStockBatch(
                workOrderId
            );

        const outA =
            getCanonicalWopStep2AOutLedgers_(
                workOrderPartA
            );

        const outB =
            getCanonicalWopStep2AOutLedgers_(
                workOrderPartB
            );

        assertCanonicalWopStep2A_(
            result.success === true &&
            result.totalItem === 1,
            "Legacy batch harus menggabungkan WOP barang sama menjadi satu item."
        );

        assertCanonicalWopStep2A_(
            BarangRepository.getStock(barangId) ===
            stockBefore - 3,
            "Legacy grouped batch harus mengurangi total qty 3."
        );

        assertCanonicalWopStep2A_(
            outA.length === 1 &&
            Number(outA[0][COL_STOK.QTYKELUAR]) === 3 &&
            outB.length === 0,
            "Legacy grouped ledger harus hanya direferensikan oleh WOP-A dengan qty 3."
        );

    }
    finally{

        cleanupCanonicalWopStep2AParts_([
            workOrderPartA,
            workOrderPartB
        ]);

        assertCanonicalWopStep2A_(
            BarangRepository.getStock(barangId) === stockBefore,
            "Cleanup grouped ledger harus mengembalikan stok baseline."
        );

    }

}

function testCanonicalWopStep2ARetryBatch(){

    const primaryBarangId =
        "BRG000001";

    const alternativeBarangId =
        getCanonicalWopStep2AAlternativeBarangId_();

    const primaryStockBefore =
        BarangRepository.getStock(primaryBarangId);

    const alternativeStockBefore =
        BarangRepository.getStock(alternativeBarangId);

    assertCanonicalWopStep2A_(
        primaryStockBefore >= 1 &&
        alternativeStockBefore >= 1,
        "Stok fixture retry batch tidak mencukupi."
    );

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "retry batch"
        );

    const workOrderPartA =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            primaryBarangId,
            1,
            "retry A"
        );

    const workOrderPartB =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            alternativeBarangId,
            1,
            "retry B"
        );

    try{

        WorkOrderPartService.consumeStockBatch(
            workOrderId
        );

        const primaryStockBeforeRetry =
            BarangRepository.getStock(primaryBarangId);

        const alternativeStockBeforeRetry =
            BarangRepository.getStock(alternativeBarangId);

        const outCountBeforeRetry =
            getCanonicalWopStep2AOutLedgers_(workOrderPartA).length +
            getCanonicalWopStep2AOutLedgers_(workOrderPartB).length;

        const retryResult =
            WorkOrderPartService.consumeStockBatch(
                workOrderId
            );

        const outCountAfterRetry =
            getCanonicalWopStep2AOutLedgers_(workOrderPartA).length +
            getCanonicalWopStep2AOutLedgers_(workOrderPartB).length;

        const skippedIds =
            (retryResult.skippedItems || [])
                .map(function(item){

                    return item.workOrderPartId;

                })
                .sort();

        assertCanonicalWopStep2A_(
            retryResult.success === true &&
            retryResult.totalItem === 0 &&
            skippedIds.length === 2 &&
            skippedIds[0] === workOrderPartA &&
            skippedIds[1] === workOrderPartB,
            "Retry batch legacy harus menandai dua WOP sebagai sudah tercatat."
        );

        assertCanonicalWopStep2A_(
            BarangRepository.getStock(primaryBarangId) ===
            primaryStockBeforeRetry &&
            BarangRepository.getStock(alternativeBarangId) ===
            alternativeStockBeforeRetry &&
            outCountAfterRetry === outCountBeforeRetry,
            "Retry batch tidak boleh mengubah stok atau membuat ledger baru."
        );

    }
    finally{

        cleanupCanonicalWopStep2AParts_([
            workOrderPartA,
            workOrderPartB
        ]);

        assertCanonicalWopStep2A_(
            BarangRepository.getStock(primaryBarangId) ===
            primaryStockBefore &&
            BarangRepository.getStock(alternativeBarangId) ===
            alternativeStockBefore,
            "Cleanup retry batch harus mengembalikan stok baseline."
        );

    }

}

function testCanonicalWopStep2APartialExisting(){

    const primaryBarangId =
        "BRG000001";

    const alternativeBarangId =
        getCanonicalWopStep2AAlternativeBarangId_();

    const primaryStockBefore =
        BarangRepository.getStock(primaryBarangId);

    const alternativeStockBefore =
        BarangRepository.getStock(alternativeBarangId);

    assertCanonicalWopStep2A_(
        primaryStockBefore >= 1 &&
        alternativeStockBefore >= 1,
        "Stok fixture partial-existing tidak mencukupi."
    );

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "partial existing"
        );

    const workOrderPartA =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            primaryBarangId,
            1,
            "partial existing A"
        );

    const workOrderPartB =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            alternativeBarangId,
            1,
            "partial existing B"
        );

    try{

        WorkOrderPartService.consumeStock(
            workOrderPartA
        );

        const primaryStockAfterSingle =
            BarangRepository.getStock(primaryBarangId);

        const result =
            WorkOrderPartService.consumeStockBatch(
                workOrderId
            );

        assertCanonicalWopStep2A_(
            result.success === true &&
            result.totalItem === 1 &&
            result.skippedItems.length === 1 &&
            result.skippedItems[0].workOrderPartId === workOrderPartA,
            "Batch partial-existing harus melewati WOP-A dan memproses WOP-B."
        );

        assertCanonicalWopStep2A_(
            BarangRepository.getStock(primaryBarangId) ===
            primaryStockAfterSingle &&
            BarangRepository.getStock(alternativeBarangId) ===
            alternativeStockBefore - 1,
            "WOP existing tidak boleh mengurangi stok dua kali."
        );

        assertCanonicalWopStep2A_(
            getCanonicalWopStep2AOutLedgers_(workOrderPartA).length === 1 &&
            getCanonicalWopStep2AOutLedgers_(workOrderPartB).length === 1,
            "Partial-existing harus menyisakan satu OUT ledger per WOP."
        );

    }
    finally{

        cleanupCanonicalWopStep2AParts_([
            workOrderPartA,
            workOrderPartB
        ]);

        assertCanonicalWopStep2A_(
            BarangRepository.getStock(primaryBarangId) ===
            primaryStockBefore &&
            BarangRepository.getStock(alternativeBarangId) ===
            alternativeStockBefore,
            "Cleanup partial-existing harus mengembalikan stok baseline."
        );

    }

}

function testCanonicalWopStep2AInsufficientAggregateStock(){

    const barangId =
        "BRG000001";

    const stockBefore =
        BarangRepository.getStock(barangId);

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "insufficient aggregate stock"
        );

    const workOrderPartA =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            barangId,
            Math.max(1, stockBefore + 1),
            "insufficient aggregate A"
        );

    const workOrderPartB =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            barangId,
            1,
            "insufficient aggregate B"
        );

    try{

        let errorCaught = false;

        try{

            WorkOrderPartService.consumeStockBatch(
                workOrderId
            );

        }
        catch(error){

            errorCaught = true;

        }

        assertCanonicalWopStep2A_(
            errorCaught,
            "Batch insufficient aggregate stock harus melempar error."
        );

        assertCanonicalWopStep2A_(
            BarangRepository.getStock(barangId) === stockBefore &&
            getCanonicalWopStep2AOutLedgers_(workOrderPartA).length === 0 &&
            getCanonicalWopStep2AOutLedgers_(workOrderPartB).length === 0,
            "Batch insufficient aggregate stock tidak boleh meninggalkan stok atau ledger parsial."
        );

    }
    finally{

        cleanupCanonicalWopStep2AParts_([
            workOrderPartA,
            workOrderPartB
        ]);

        assertCanonicalWopStep2A_(
            BarangRepository.getStock(barangId) === stockBefore,
            "Cleanup insufficient aggregate harus mempertahankan stok baseline."
        );

    }

}

function testCanonicalWopStep2ACancelSameBarangLegacyCharacterization(){

    const barangId =
        "BRG000001";

    const stockBefore =
        BarangRepository.getStock(barangId);

    assertCanonicalWopStep2A_(
        stockBefore >= 3,
        "Stok BRG000001 harus minimal 3 untuk karakterisasi cancellation legacy."
    );

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "same barang cancellation risk"
        );

    const workOrderPartA =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            barangId,
            1,
            "cancellation legacy A"
        );

    const workOrderPartB =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            barangId,
            2,
            "cancellation legacy B"
        );

    try{

        WorkOrderPartService.consumeStockBatch(
            workOrderId
        );

        const cancelB =
            WorkOrderPartService.cancel(
                workOrderPartB
            );

        const stockAfterCancelB =
            BarangRepository.getStock(barangId);

        assertCanonicalWopStep2A_(
            cancelB.stockOutRecorded === false &&
            cancelB.reversal === null &&
            stockAfterCancelB === stockBefore - 3,
            "Legacy WOP-B tidak menemukan OUT; cancel B tidak memulihkan qty 2."
        );

        const cancelA =
            WorkOrderPartService.cancel(
                workOrderPartA
            );

        assertCanonicalWopStep2A_(
            cancelA.stockOutRecorded === true &&
            cancelA.reversal &&
            cancelA.reversal.qtyReversal === 3 &&
            BarangRepository.getStock(barangId) === stockBefore,
            "Legacy WOP-A mereversal seluruh qty grouped 3, bukan qty individual 1."
        );

    }
    finally{

        cleanupCanonicalWopStep2AParts_([
            workOrderPartA,
            workOrderPartB
        ]);

        assertCanonicalWopStep2A_(
            BarangRepository.getStock(barangId) === stockBefore,
            "Cleanup cancellation characterization harus mengembalikan stok baseline."
        );

    }

}

function runCanonicalWopInventoryStep2ACharacterization(){

    testCanonicalWopStep2ATwoWopDifferentBarang();
    testCanonicalWopStep2ATwoWopSameBarangLegacyCharacterization();
    testCanonicalWopStep2ARetryBatch();
    testCanonicalWopStep2APartialExisting();
    testCanonicalWopStep2AInsufficientAggregateStock();
    testCanonicalWopStep2ACancelSameBarangLegacyCharacterization();

    Logger.log(
        "CANONICAL WOP INVENTORY STEP 2A CHARACTERIZATION PASS"
    );

}

function runCanonicalWopInventoryStep2ACharacterizationCli(){

    runCanonicalWopInventoryStep2ACharacterization();

    return {
        success : true,
        message : "CANONICAL WOP INVENTORY STEP 2A CHARACTERIZATION PASS"
    };

}

/**
 * ============================================
 * CANONICAL WOP INVENTORY STEP 2B
 * READ-ONLY BATCH PLANNER REGRESSION
 * ============================================
 */

function assertCanonicalWopStep2B_(condition, message){

    if(!condition){

        throw new Error(
            "Step 2B planner regression gagal: " +
            message
        );

    }

}

function snapshotCanonicalWopStep2BState_(barangIds){

    const stocks = {};

    for(
        let i = 0;
        i < barangIds.length;
        i++
    ){

        stocks[barangIds[i]] =
            BarangRepository.getStock(
                barangIds[i]
            );

    }

    return {
        stocks :
            stocks,
        ledgerRowCount :
            StockLedgerRepository.sheet()
                .getLastRow()
    };

}

function assertCanonicalWopStep2BStateUnchanged_(
    snapshot,
    barangIds,
    message
){

    for(
        let i = 0;
        i < barangIds.length;
        i++
    ){

        const barangId =
            barangIds[i];

        assertCanonicalWopStep2B_(
            BarangRepository.getStock(barangId) ===
            snapshot.stocks[barangId],
            message + " Stok berubah untuk " + barangId
        );

    }

    assertCanonicalWopStep2B_(
        StockLedgerRepository.sheet().getLastRow() ===
        snapshot.ledgerRowCount,
        message + " Jumlah Stock Ledger berubah."
    );

}

function testCanonicalWopStep2BPlannerTwoDifferentBarang(){

    const primaryBarangId =
        "BRG000001";

    const alternativeBarangId =
        getCanonicalWopStep2AAlternativeBarangId_();

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "step 2B different barang"
        );

    const workOrderPartA =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            primaryBarangId,
            1,
            "step 2B different A"
        );

    const workOrderPartB =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            alternativeBarangId,
            1,
            "step 2B different B"
        );

    try{

        const snapshot =
            snapshotCanonicalWopStep2BState_([
                primaryBarangId,
                alternativeBarangId
            ]);

        const originalFindByWorkOrderId =
            WorkOrderPartRepository.findByWorkOrderId;

        let plan;

        try{

            WorkOrderPartRepository.findByWorkOrderId =
                function(id){

                    return originalFindByWorkOrderId.call(
                        this,
                        id
                    ).reverse();

                };

            plan =
                WorkOrderPartService
                    .planCanonicalStockOutBatch(
                        workOrderId
                    );

        }
        finally{

            WorkOrderPartRepository.findByWorkOrderId =
                originalFindByWorkOrderId;

        }

        const repeatedPlan =
            WorkOrderPartService
                .planCanonicalStockOutBatch(
                    workOrderId
                );

        const expectedIds = [
            workOrderPartA,
            workOrderPartB
        ].sort();

        assertCanonicalWopStep2B_(
            plan.workOrderId === workOrderId &&
            plan.lines.length === 2 &&
            plan.newLines.length === 2 &&
            plan.canExecuteCanonicalBatch === true &&
            plan.lines.map(function(line){

                return line.sourceLineId;

            }).join("|") === expectedIds.join("|") &&
            JSON.stringify(plan) === JSON.stringify(repeatedPlan),
            "Planner harus menghasilkan line NEW dengan urutan dan hasil deterministik."
        );

        for(
            let i = 0;
            i < plan.lines.length;
            i++
        ){

            const line =
                plan.lines[i];

            const expectedKey =
                "WOP:" +
                line.sourceLineId +
                ":OUT";

            assertCanonicalWopStep2B_(
                line.transactionId === expectedKey &&
                line.idempotencyKey === expectedKey &&
                line.transactionType === "WO_PART_OUT" &&
                line.sourceDocumentType === "WORK_ORDER_PART" &&
                line.sourceDocumentId === workOrderId &&
                line.referensi === line.sourceLineId,
                "Canonical identity line tidak sesuai contract."
            );

        }

        assertCanonicalWopStep2B_(
            plan.perBarangSummary.length === 2 &&
            plan.perBarangSummary.every(function(summary){

                return summary.totalQtyRequired === 1 &&
                    summary.sourceLineIds.length === 1;

            }),
            "Planner dua barang harus membuat summary terpisah per barang."
        );

        assertCanonicalWopStep2BStateUnchanged_(
            snapshot,
            [
                primaryBarangId,
                alternativeBarangId
            ],
            "Planner dua barang harus read-only."
        );

    }
    finally{

        cleanupCanonicalWopStep2AParts_([
            workOrderPartA,
            workOrderPartB
        ]);

    }

}

function testCanonicalWopStep2BPlannerTwoSameBarang(){

    const barangId =
        "BRG000001";

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "step 2B same barang"
        );

    const workOrderPartA =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            barangId,
            1,
            "step 2B same A"
        );

    const workOrderPartB =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            barangId,
            2,
            "step 2B same B"
        );

    try{

        const snapshot =
            snapshotCanonicalWopStep2BState_([
                barangId
            ]);

        const plan =
            WorkOrderPartService
                .planCanonicalStockOutBatch(
                    workOrderId
                );

        assertCanonicalWopStep2B_(
            plan.lines.length === 2 &&
            plan.newLines.length === 2 &&
            plan.perBarangSummary.length === 1 &&
            plan.perBarangSummary[0].barangId === barangId &&
            plan.perBarangSummary[0].totalQtyRequired === 3 &&
            plan.perBarangSummary[0].sourceLineIds.length === 2,
            "Planner harus mempertahankan dua line WOP dan mengagregasi summary qty 3."
        );

        assertCanonicalWopStep2BStateUnchanged_(
            snapshot,
            [barangId],
            "Planner barang sama harus read-only."
        );

    }
    finally{

        cleanupCanonicalWopStep2AParts_([
            workOrderPartA,
            workOrderPartB
        ]);

    }

}

function testCanonicalWopStep2BPlannerDuplicateWorkOrderPartId(){

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "step 2B duplicate WOP ID"
        );

    const workOrderPartId =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            "BRG000001",
            1,
            "step 2B duplicate source"
        );

    const originalFindByWorkOrderId =
        WorkOrderPartRepository.findByWorkOrderId;

    try{

        WorkOrderPartRepository.findByWorkOrderId =
            function(id){

                const rows =
                    originalFindByWorkOrderId.call(
                        this,
                        id
                    );

                return rows.concat([
                    rows[0].slice()
                ]);

            };

        let duplicateRejected = false;

        try{

            WorkOrderPartService
                .planCanonicalStockOutBatch(
                    workOrderId
                );

        }
        catch(error){

            duplicateRejected =
                String(error.message || "")
                    .includes("Duplicate WorkOrderPart ID");

        }

        assertCanonicalWopStep2B_(
            duplicateRejected,
            "Planner harus menolak duplicate WorkOrderPart ID."
        );

    }
    finally{

        WorkOrderPartRepository.findByWorkOrderId =
            originalFindByWorkOrderId;

        cleanupCanonicalWopStep2AParts_([
            workOrderPartId
        ]);

    }

}

function testCanonicalWopStep2BPlannerExistingAndPartial(){

    const primaryBarangId =
        "BRG000001";

    const alternativeBarangId =
        getCanonicalWopStep2AAlternativeBarangId_();

    const primaryStockBefore =
        BarangRepository.getStock(primaryBarangId);

    const alternativeStockBefore =
        BarangRepository.getStock(alternativeBarangId);

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "step 2B partial existing"
        );

    const workOrderPartA =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            primaryBarangId,
            1,
            "step 2B existing canonical"
        );

    const workOrderPartB =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            alternativeBarangId,
            1,
            "step 2B new line"
        );

    try{

        WorkOrderPartService.consumeStock(
            workOrderPartA
        );

        const snapshot =
            snapshotCanonicalWopStep2BState_([
                primaryBarangId,
                alternativeBarangId
            ]);

        const plan =
            WorkOrderPartService
                .planCanonicalStockOutBatch(
                    workOrderId
                );

        const lineA =
            plan.lines.filter(function(line){

                return line.sourceLineId === workOrderPartA;

            })[0];

        const lineB =
            plan.lines.filter(function(line){

                return line.sourceLineId === workOrderPartB;

            })[0];

        assertCanonicalWopStep2B_(
            lineA.classification === "EXISTING_CANONICAL" &&
            lineB.classification === "NEW" &&
            plan.existingLines.length === 1 &&
            plan.newLines.length === 1 &&
            plan.canExecuteCanonicalBatch === true,
            "Planner harus mendeteksi Step 1 OUT existing dan line baru dalam batch parsial."
        );

        assertCanonicalWopStep2BStateUnchanged_(
            snapshot,
            [
                primaryBarangId,
                alternativeBarangId
            ],
            "Planner partial-existing harus read-only."
        );

    }
    finally{

        cleanupCanonicalWopStep2AParts_([
            workOrderPartA,
            workOrderPartB
        ]);

        assertCanonicalWopStep2B_(
            BarangRepository.getStock(primaryBarangId) ===
            primaryStockBefore &&
            BarangRepository.getStock(alternativeBarangId) ===
            alternativeStockBefore,
            "Cleanup planner partial-existing harus mengembalikan stok baseline."
        );

    }

}

function testCanonicalWopStep2BPlannerLegacyAmbiguous(){

    const barangId =
        "BRG000001";

    const stockBefore =
        BarangRepository.getStock(barangId);

    assertCanonicalWopStep2B_(
        stockBefore >= 3,
        "Stok BRG000001 harus minimal 3 untuk planner legacy ambiguous."
    );

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "step 2B legacy ambiguous"
        );

    const workOrderPartA =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            barangId,
            1,
            "step 2B legacy ambiguous A"
        );

    const workOrderPartB =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            barangId,
            2,
            "step 2B legacy ambiguous B"
        );

    try{

        WorkOrderPartService.consumeStockBatch(
            workOrderId
        );

        const snapshot =
            snapshotCanonicalWopStep2BState_([
                barangId
            ]);

        const plan =
            WorkOrderPartService
                .planCanonicalStockOutBatch(
                    workOrderId
                );

        assertCanonicalWopStep2B_(
            plan.legacyAmbiguousLines.length === 2 &&
            plan.lines.every(function(line){

                return line.classification ===
                    "LEGACY_AMBIGUOUS";

            }) &&
            plan.canExecuteCanonicalBatch === false,
            "Grouped ledger legacy harus diklasifikasikan LEGACY_AMBIGUOUS untuk seluruh WOP terkait."
        );

        assertCanonicalWopStep2BStateUnchanged_(
            snapshot,
            [barangId],
            "Planner legacy ambiguous harus read-only."
        );

    }
    finally{

        cleanupCanonicalWopStep2AParts_([
            workOrderPartA,
            workOrderPartB
        ]);

        assertCanonicalWopStep2B_(
            BarangRepository.getStock(barangId) === stockBefore,
            "Cleanup planner legacy ambiguous harus mengembalikan stok baseline."
        );

    }

}

function testCanonicalWopStep2BPlannerConflicts(){

    const barangId =
        "BRG000001";

    const workOrderId =
        createCanonicalWopStep2AWorkOrder_(
            "step 2B planner conflicts"
        );

    const workOrderPartId =
        createCanonicalWopStep2AProgressPart_(
            workOrderId,
            barangId,
            1,
            "step 2B conflict source"
        );

    const originalFindByReferensi =
        StockLedgerRepository.findByReferensi;

    const snapshot =
        snapshotCanonicalWopStep2BState_([
            barangId
        ]);

    const createFakeLedger =
        function(fakeBarangId, fakeQty){

            const ledger = [];

            ledger[COL_STOK.ID] =
                "SL-STEP2B-FAKE";

            ledger[COL_STOK.BARANG_ID] =
                fakeBarangId;

            ledger[COL_STOK.JENISMUTASI] =
                "SERVICE";

            ledger[COL_STOK.REFERENSI] =
                workOrderPartId;

            ledger[COL_STOK.QTYKELUAR] =
                fakeQty;

            return ledger;

        };

    try{

        StockLedgerRepository.findByReferensi =
            function(){

                return [
                    createFakeLedger(
                        "BRG-CONFLICT",
                        1
                    )
                ];

            };

        const barangConflictPlan =
            WorkOrderPartService
                .planCanonicalStockOutBatch(
                    workOrderId
                );

        assertCanonicalWopStep2B_(
            barangConflictPlan.conflictLines.length === 1 &&
            barangConflictPlan.lines[0].classification === "CONFLICT" &&
            barangConflictPlan.canExecuteCanonicalBatch === false,
            "Planner harus mengklasifikasikan barang mismatch sebagai CONFLICT."
        );

        StockLedgerRepository.findByReferensi =
            function(){

                return [
                    createFakeLedger(
                        barangId,
                        2
                    )
                ];

            };

        const qtyConflictPlan =
            WorkOrderPartService
                .planCanonicalStockOutBatch(
                    workOrderId
                );

        assertCanonicalWopStep2B_(
            qtyConflictPlan.conflictLines.length === 1 &&
            qtyConflictPlan.lines[0].classification === "CONFLICT" &&
            qtyConflictPlan.canExecuteCanonicalBatch === false,
            "Planner harus mengklasifikasikan qty mismatch sebagai CONFLICT."
        );

        assertCanonicalWopStep2BStateUnchanged_(
            snapshot,
            [barangId],
            "Planner conflict harus read-only."
        );

    }
    finally{

        StockLedgerRepository.findByReferensi =
            originalFindByReferensi;

        cleanupCanonicalWopStep2AParts_([
            workOrderPartId
        ]);

    }

}

function runCanonicalWopInventoryStep2BPlannerRegression(){

    testCanonicalWopStep2BPlannerTwoDifferentBarang();
    testCanonicalWopStep2BPlannerTwoSameBarang();
    testCanonicalWopStep2BPlannerDuplicateWorkOrderPartId();
    testCanonicalWopStep2BPlannerExistingAndPartial();
    testCanonicalWopStep2BPlannerLegacyAmbiguous();
    testCanonicalWopStep2BPlannerConflicts();

    Logger.log(
        "CANONICAL WOP INVENTORY STEP 2B PLANNER PASS"
    );

}

function runCanonicalWopInventoryStep2BPlannerRegressionCli(){

    runCanonicalWopInventoryStep2BPlannerRegression();

    return {
        success : true,
        message : "CANONICAL WOP INVENTORY STEP 2B PLANNER PASS"
    };

}

/**
 * ============================================
 * TEST: Work Order Cancel Cascade
 * Stock Reversal Regression V1
 * ============================================
 *
 * FLOW:
 *
 * DRAFT
 *   ↓
 * MENUNGGU_DIAGNOSA
 *   ↓
 * MENUNGGU_APPROVAL
 *   ↓
 * DALAM_PENGERJAAN
 *   ↓
 * DIBATALKAN
 *
 * PART A:
 * OPEN
 *   ↓
 * PROGRESS
 *   ↓
 * STOCK OUT
 *   ↓
 * EXPECTED CANCEL + AUTO REVERSAL
 *
 * PART B:
 * OPEN
 *   ↓
 * PROGRESS
 *   ↓
 * EXPECTED CANCEL TANPA REVERSAL
 *
 * TEST INI SAAT INI DIMAKSUDKAN UNTUK
 * MEMBUKTIKAN GAP CASCADE DI WORK ORDER.
 * ============================================
 */

function testWorkOrderCancelCascadeStockReversalV1(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER CANCEL CASCADE"
    );

    Logger.log(
        "STOCK REVERSAL REGRESSION V1"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * CONSTANT
     * ========================================
     */

    const CUSTOMER_ID =
        "CUS2608160002";

    const VEHICLE_ID =
        "VEH2608160002";

    const BARANG_ID =
        "BRG000001";


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                CUSTOMER_ID,

            vehicleId :
                VEHICLE_ID,

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "WO Cancel Cascade Stock Reversal V1"

        });


    const workOrderId =
        woResult.workOrderId;


    if(!workOrderId){

        throw new Error(
            "Work Order gagal dibuat."
        );

    }


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE PART A
     * ========================================
     */

    const partAResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                BARANG_ID,

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Cancel Cascade Part A"

        });


    const partAId =
        partAResult.workOrderPartId;


    if(!partAId){

        throw new Error(
            "Part A gagal dibuat."
        );

    }


    Logger.log(
        "PART A ID:"
    );

    Logger.log(
        partAId
    );


    /**
     * ========================================
     * 3. CREATE PART B
     * ========================================
     */

    const partBResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                BARANG_ID,

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Cancel Cascade Part B"

        });


    const partBId =
        partBResult.workOrderPartId;


    if(!partBId){

        throw new Error(
            "Part B gagal dibuat."
        );

    }


    Logger.log(
        "PART B ID:"
    );

    Logger.log(
        partBId
    );


    /**
     * ========================================
     * 4. PART A → PROGRESS
     * ========================================
     */

    const partAProgress =
        WorkOrderPartService.changeStatus(

            partAId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "PART A OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            partAProgress
        )
    );


    /**
     * ========================================
     * 5. PART B → PROGRESS
     * ========================================
     */

    const partBProgress =
        WorkOrderPartService.changeStatus(

            partBId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "PART B OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            partBProgress
        )
    );


    /**
     * ========================================
     * 6. STOCK BASELINE
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            BARANG_ID
        );


    Logger.log(
        "STOCK BASELINE:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 7. STOCK OUT PART A
     * ========================================
     */

    const stockOutA =
        WorkOrderPartService.consumeStock(
            partAId
        );


    Logger.log(
        "PART A STOCK OUT:"
    );

    Logger.log(
        JSON.stringify(
            stockOutA
        )
    );


    /**
     * ========================================
     * 8. STOCK SETELAH PART A OUT
     * ========================================
     */

    const stockAfterOut =
        BarangRepository.getStock(
            BARANG_ID
        );


    Logger.log(
        "STOCK AFTER PART A OUT:"
    );

    Logger.log(
        stockAfterOut
    );


    /**
     * ========================================
     * 9. VALIDASI STOCK BERKURANG
     * ========================================
     */

    const stockReducedOnce =
        stockAfterOut ===
        stockBefore - 1;


    Logger.log(
        "STOCK BERKURANG 1:"
    );

    Logger.log(
        stockReducedOnce
    );


    if(!stockReducedOnce){

        throw new Error(
            "Stock Part A tidak berkurang 1."
        );

    }


    /**
     * ========================================
     * 10. WO DRAFT
     *     →
     *     MENUNGGU_DIAGNOSA
     * ========================================
     */

    const woDiagnosaResult =
        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_DIAGNOSA

        );


    Logger.log(
        "WO DRAFT → MENUNGGU_DIAGNOSA:"
    );

    Logger.log(
        JSON.stringify(
            woDiagnosaResult
        )
    );


    /**
     * ========================================
     * 11. WO MENUNGGU_DIAGNOSA
     *     →
     *     MENUNGGU_APPROVAL
     * ========================================
     */

    const woApprovalResult =
        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_APPROVAL

        );


    Logger.log(
        "WO MENUNGGU_DIAGNOSA → MENUNGGU_APPROVAL:"
    );

    Logger.log(
        JSON.stringify(
            woApprovalResult
        )
    );


    /**
     * ========================================
     * 12. WO MENUNGGU_APPROVAL
     *     →
     *     DALAM_PENGERJAAN
     * ========================================
     */

    const woProgressResult =
        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.DALAM_PENGERJAAN

        );


    Logger.log(
        "WO MENUNGGU_APPROVAL → DALAM_PENGERJAAN:"
    );

    Logger.log(
        JSON.stringify(
            woProgressResult
        )
    );


    /**
     * ========================================
     * 13. VALIDASI WO SUDAH
     *     DALAM_PENGERJAAN
     * ========================================
     */

    const woBeforeCancel =
        WorkOrderRepository.findById(
            workOrderId
        );


    const woStatusBeforeCancel =
        woBeforeCancel[
            COL_WORK_ORDER.STATUS
        ];


    Logger.log(
        "WO STATUS SEBELUM CANCEL:"
    );

    Logger.log(
        woStatusBeforeCancel
    );


    if(
        woStatusBeforeCancel !==
        WorkOrderStatus.DALAM_PENGERJAAN
    ){

        throw new Error(
            "WO tidak berada di DALAM_PENGERJAAN sebelum cancel."
        );

    }


    /**
     * ========================================
     * 14. LEDGER SEBELUM CANCEL
     * ========================================
     */

    const partALedgersBefore =
        StockLedgerRepository.findByReferensi(
            partAId
        );


    const partBLedgersBefore =
        StockLedgerRepository.findByReferensi(
            partBId
        );


    const partAOutBefore =
        partALedgersBefore.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;


    const partAReversalBefore =
        partALedgersBefore.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    const partBOutBefore =
        partBLedgersBefore.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;


    const partBReversalBefore =
        partBLedgersBefore.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "PART A OUT BEFORE CANCEL:"
    );

    Logger.log(
        partAOutBefore
    );


    Logger.log(
        "PART A REVERSAL BEFORE CANCEL:"
    );

    Logger.log(
        partAReversalBefore
    );


    Logger.log(
        "PART B OUT BEFORE CANCEL:"
    );

    Logger.log(
        partBOutBefore
    );


    Logger.log(
        "PART B REVERSAL BEFORE CANCEL:"
    );

    Logger.log(
        partBReversalBefore
    );


    /**
     * ========================================
     * 15. CANCEL WORK ORDER
     * ========================================
     */

    let cancelResult = null;

    let cancelError = null;


    try{

        cancelResult =
            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.DIBATALKAN

            );


        Logger.log(
            "WO CANCEL RESULT:"
        );

        Logger.log(
            JSON.stringify(
                cancelResult
            )
        );

    }
    catch(error){

        cancelError =
            error;

        Logger.log(
            "WO CANCEL ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * 16. CEK WO STATUS
     * ========================================
     */

    const finalWO =
        WorkOrderRepository.findById(
            workOrderId
        );


    const finalWOStatus =
        finalWO[
            COL_WORK_ORDER.STATUS
        ];


    Logger.log(
        "FINAL WO STATUS:"
    );

    Logger.log(
        finalWOStatus
    );


    /**
     * ========================================
     * 17. CEK PART A
     * ========================================
     */

    const finalPartA =
        WorkOrderPartRepository.findById(
            partAId
        );


    const finalPartAStatus =
        finalPartA[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "FINAL PART A STATUS:"
    );

    Logger.log(
        finalPartAStatus
    );


    /**
     * ========================================
     * 18. CEK PART B
     * ========================================
     */

    const finalPartB =
        WorkOrderPartRepository.findById(
            partBId
        );


    const finalPartBStatus =
        finalPartB[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "FINAL PART B STATUS:"
    );

    Logger.log(
        finalPartBStatus
    );


    /**
     * ========================================
     * 19. STOCK SETELAH CANCEL
     * ========================================
     */

    const stockAfterCancel =
        BarangRepository.getStock(
            BARANG_ID
        );


    Logger.log(
        "STOCK AFTER WO CANCEL:"
    );

    Logger.log(
        stockAfterCancel
    );


    /**
     * ========================================
     * 20. LEDGER SETELAH CANCEL
     * ========================================
     */

    const partALedgersAfter =
        StockLedgerRepository.findByReferensi(
            partAId
        );


    const partBLedgersAfter =
        StockLedgerRepository.findByReferensi(
            partBId
        );


    const partAOutAfter =
        partALedgersAfter.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;


    const partAReversalAfter =
        partALedgersAfter.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    const partBOutAfter =
        partBLedgersAfter.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;


    const partBReversalAfter =
        partBLedgersAfter.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "PART A OUT AFTER:"
    );

    Logger.log(
        partAOutAfter
    );


    Logger.log(
        "PART A REVERSAL AFTER:"
    );

    Logger.log(
        partAReversalAfter
    );


    Logger.log(
        "PART B OUT AFTER:"
    );

    Logger.log(
        partBOutAfter
    );


    Logger.log(
        "PART B REVERSAL AFTER:"
    );

    Logger.log(
        partBReversalAfter
    );


    /**
     * ========================================
     * 21. VALIDATION
     * ========================================
     */

    const woCancelled =
        finalWOStatus ===
        WorkOrderStatus.DIBATALKAN;


    const partACancelled =
        finalPartAStatus ===
        WorkOrderPartStatus.CANCEL;


    const partBCancelled =
        finalPartBStatus ===
        WorkOrderPartStatus.CANCEL;


    const stockRestored =
        stockAfterCancel ===
        stockBefore;


    const partAOutRemains =
        partAOutAfter ===
        1;


    const partAReversalCreated =
        partAReversalAfter ===
        1;


    const partBNoOut =
        partBOutAfter ===
        0;


    const partBNoReversal =
        partBReversalAfter ===
        0;


    Logger.log(
        "WO = DIBATALKAN:"
    );

    Logger.log(
        woCancelled
    );


    Logger.log(
        "PART A = CANCEL:"
    );

    Logger.log(
        partACancelled
    );


    Logger.log(
        "PART B = CANCEL:"
    );

    Logger.log(
        partBCancelled
    );


    Logger.log(
        "STOCK KEMBALI:"
    );

    Logger.log(
        stockRestored
    );


    Logger.log(
        "PART A OUT TETAP ADA:"
    );

    Logger.log(
        partAOutRemains
    );


    Logger.log(
        "PART A REVERSAL = 1:"
    );

    Logger.log(
        partAReversalCreated
    );


    Logger.log(
        "PART B TIDAK ADA OUT:"
    );

    Logger.log(
        partBNoOut
    );


    Logger.log(
        "PART B TIDAK ADA REVERSAL:"
    );

    Logger.log(
        partBNoReversal
    );


    /**
     * ========================================
     * 22. FINAL ASSERTION
     * ========================================
     */

    if(

        !woCancelled ||

        !partACancelled ||

        !partBCancelled ||

        !stockRestored ||

        !partAOutRemains ||

        !partAReversalCreated ||

        !partBNoOut ||

        !partBNoReversal

    ){

        throw new Error(
            "WORK ORDER CANCEL CASCADE STOCK REVERSAL V1 GAGAL."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER CANCEL CASCADE"
    );

    Logger.log(
        "STOCK REVERSAL REGRESSION V1 PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Direct Stock Ledger Reversal
 * Duplicate Reversal Rejection V1
 * ============================================
 *
 * FLOW:
 *
 * OPEN
 *   ↓
 * PROGRESS
 *   ↓
 * STOCK OUT
 *   ↓
 * DIRECT REVERSAL
 *   ↓
 * DIRECT REVERSAL AGAIN
 *   ↓
 * REJECT
 *
 * Validasi:
 *
 * 1. Stock berkurang 1 setelah Stock OUT.
 * 2. Stock kembali baseline setelah reversal pertama.
 * 3. Ledger OUT tetap ada.
 * 4. Ledger REVERSAL = 1.
 * 5. Reversal kedua ditolak.
 * 6. Stock tidak berubah setelah reversal kedua.
 * 7. Tidak dibuat REVERSAL kedua.
 * ============================================
 */

function testStockLedgerDirectReversalDuplicateRejectionV1(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "DIRECT STOCK REVERSAL"
    );

    Logger.log(
        "DUPLICATE REVERSAL REJECTION TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS2608160002",

            vehicleId :
                "VEH2608160002",

            kilometerMasuk :
                17000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Direct Reversal Duplicate Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER PART
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Direct Reversal Duplicate Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    if(
        !workOrderPartId
    ){

        throw new Error(
            "Work Order Part gagal dibuat."
        );

    }


    Logger.log(
        "WORK ORDER PART ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     */

    WorkOrderPartService.changeStatus(

        workOrderPartId,

        WorkOrderPartStatus.PROGRESS

    );


    Logger.log(
        "OPEN → PROGRESS PASS"
    );


    /**
     * ========================================
     * 4. STOCK BASELINE
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK BASELINE:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 5. STOCK OUT
     * ========================================
     */

    const stockOutResult =
        WorkOrderPartService.consumeStock(
            workOrderPartId
        );


    Logger.log(
        "STOCK OUT RESULT:"
    );

    Logger.log(
        JSON.stringify(
            stockOutResult,
            null,
            2
        )
    );


    /**
     * ========================================
     * 6. VERIFY STOCK OUT
     * ========================================
     */

    const stockAfterOut =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK AFTER OUT:"
    );

    Logger.log(
        stockAfterOut
    );


    if(
        stockAfterOut !==
        stockBefore - 1
    ){

        throw new Error(
            "Stock OUT tidak mengurangi stock sebesar 1."
        );

    }


    Logger.log(
        "STOCK OUT PASS"
    );


    /**
     * ========================================
     * 7. VERIFY LEDGER BEFORE REVERSAL
     * ========================================
     */

    const ledgersBefore =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const outCountBefore =
        ledgersBefore.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;


    const reversalCountBefore =
        ledgersBefore.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "OUT LEDGER BEFORE REVERSAL:"
    );

    Logger.log(
        outCountBefore
    );


    Logger.log(
        "REVERSAL LEDGER BEFORE REVERSAL:"
    );

    Logger.log(
        reversalCountBefore
    );


    if(
        outCountBefore !== 1 ||
        reversalCountBefore !== 0
    ){

        throw new Error(
            "Ledger sebelum reversal tidak sesuai expectation."
        );

    }


    /**
     * ========================================
     * 8. DIRECT REVERSAL #1
     * ========================================
     */

    const reversalResult =
        StockLedgerReversalService
            .reverseByWorkOrderPartId(
                workOrderPartId
            );


    Logger.log(
        "REVERSAL #1 RESULT:"
    );

    Logger.log(
        JSON.stringify(
            reversalResult,
            null,
            2
        )
    );


    if(
        !reversalResult ||
        reversalResult.success !== true
    ){

        throw new Error(
            "Direct reversal pertama gagal."
        );

    }


    Logger.log(
        "REVERSAL #1 PASS"
    );


    /**
     * ========================================
     * 9. VERIFY STOCK RESTORED
     * ========================================
     */

    const stockAfterReversal =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK AFTER REVERSAL #1:"
    );

    Logger.log(
        stockAfterReversal
    );


    if(
        stockAfterReversal !==
        stockBefore
    ){

        throw new Error(
            "Stock tidak kembali ke baseline setelah reversal."
        );

    }


    Logger.log(
        "STOCK RESTORE PASS"
    );


    /**
     * ========================================
     * 10. VERIFY REVERSAL LEDGER = 1
     * ========================================
     */

    const ledgersAfterReversal =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const outCountAfter =
        ledgersAfterReversal.filter(
            function(ledger){

                return (
                    Number(
                        ledger[
                            COL_STOK.QTYKELUAR
                        ]
                    ) || 0
                ) > 0;

            }
        ).length;


    const reversalCountAfter =
        ledgersAfterReversal.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "OUT LEDGER AFTER REVERSAL #1:"
    );

    Logger.log(
        outCountAfter
    );


    Logger.log(
        "REVERSAL LEDGER AFTER REVERSAL #1:"
    );

    Logger.log(
        reversalCountAfter
    );


    if(
        outCountAfter !== 1
    ){

        throw new Error(
            "Ledger OUT lama tidak tetap ada."
        );

    }


    if(
        reversalCountAfter !== 1
    ){

        throw new Error(
            "Reversal pertama tidak menghasilkan tepat 1 ledger."
        );

    }


    Logger.log(
        "REVERSAL LEDGER #1 PASS"
    );


    /**
     * ========================================
     * 11. SNAPSHOT BEFORE REVERSAL #2
     * ========================================
     */

    const stockBeforeReversal2 =
        BarangRepository.getStock(
            "BRG000001"
        );


    const ledgersBeforeReversal2 =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const reversalCountBeforeReversal2 =
        ledgersBeforeReversal2.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "STOCK BEFORE REVERSAL #2:"
    );

    Logger.log(
        stockBeforeReversal2
    );


    Logger.log(
        "REVERSAL COUNT BEFORE #2:"
    );

    Logger.log(
        reversalCountBeforeReversal2
    );


    /**
     * ========================================
     * 12. DIRECT REVERSAL #2
     * ========================================
     */

    let duplicateReversalRejected =
        false;


    try{

        StockLedgerReversalService
            .reverseByWorkOrderPartId(
                workOrderPartId
            );


        Logger.log(
            "ERROR: DUPLICATE REVERSAL SEHARUSNYA DITOLAK"
        );

    }
    catch(error){

        duplicateReversalRejected =
            true;


        Logger.log(
            "EXPECTED DUPLICATE REVERSAL ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "DUPLICATE REVERSAL DITOLAK:"
    );

    Logger.log(
        duplicateReversalRejected
    );


    /**
     * ========================================
     * 13. VERIFY STOCK UNCHANGED
     * ========================================
     */

    const stockAfterReversal2 =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK AFTER REVERSAL #2:"
    );

    Logger.log(
        stockAfterReversal2
    );


    const stockUnchanged =
        stockAfterReversal2 ===
        stockBeforeReversal2;


    Logger.log(
        "STOCK TIDAK BERUBAH:"
    );

    Logger.log(
        stockUnchanged
    );


    /**
     * ========================================
     * 14. VERIFY NO SECOND REVERSAL
     * ========================================
     */

    const ledgersAfterReversal2 =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    const reversalCountAfterReversal2 =
        ledgersAfterReversal2.filter(
            function(ledger){

                return String(
                    ledger[
                        COL_STOK.JENISMUTASI
                    ] || ""
                ).trim()
                ===
                "REVERSAL";

            }
        ).length;


    Logger.log(
        "REVERSAL COUNT AFTER #2:"
    );

    Logger.log(
        reversalCountAfterReversal2
    );


    const noDuplicateReversal =
        reversalCountAfterReversal2 ===
        reversalCountBeforeReversal2;


    Logger.log(
        "NO DUPLICATE REVERSAL:"
    );

    Logger.log(
        noDuplicateReversal
    );


    /**
     * ========================================
     * 15. FINAL ASSERTION
     * ========================================
     */

    if(
        !duplicateReversalRejected
    ){

        throw new Error(
            "Direct reversal kedua seharusnya ditolak."
        );

    }


    if(
        !stockUnchanged
    ){

        throw new Error(
            "Stock berubah setelah duplicate direct reversal."
        );

    }


    if(
        !noDuplicateReversal
    ){

        throw new Error(
            "Duplicate direct reversal menghasilkan reversal kedua."
        );

    }


    /**
     * ========================================
     * FINAL
     * ========================================
     */

    Logger.log(
        "================================"
    );

    Logger.log(
        "DIRECT STOCK REVERSAL"
    );

    Logger.log(
        "DUPLICATE REVERSAL REJECTION PASS"
    );

    Logger.log(
        "================================"
    );

}
