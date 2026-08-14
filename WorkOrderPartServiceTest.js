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