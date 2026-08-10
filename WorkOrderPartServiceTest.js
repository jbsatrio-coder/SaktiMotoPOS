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

function testWorkOrderPartServiceConsumeStockBatch(){

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

            status :
                "AKTIF",

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

            status :
                "AKTIF",

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

