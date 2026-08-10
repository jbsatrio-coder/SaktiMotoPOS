function testServiceCreateWorkOrder(){

    Logger.log(

        WorkOrderService.create({

            jenisTransaksi :
                WorkOrderType.SERVICE,

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                15250,

            prioritas :
                WorkOrderPriority.NORMAL,

            estimasiSelesai :
                "",

            admin :
                "Admin",

            catatan :
                "Test service"

        })

    );

}


function testServiceCreatePartOnlyWorkOrder(){

    Logger.log(

        WorkOrderService.create({

            jenisTransaksi :
                WorkOrderType.PART_ONLY,

            customerId :
                "",

            vehicleId :
                "",

            kilometerMasuk :
                0,

            prioritas :
                WorkOrderPriority.NORMAL,

            estimasiSelesai :
                "",

            admin :
                "Admin",

            catatan :
                "Pembelian spare part walk-in"

        })

    );

}

function testCreateWorkOrderForBatchStock(){

    const result =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            kilometerMasuk :
                16000,

            prioritas :
                WorkOrderPriority.NORMAL,

            admin :
                "Developer",

            catatan :
                "Batch Stock Test"

        });


    Logger.log(
        "WORK ORDER CREATED:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );

}

function testCreateWorkOrderPartsForCleanBatch(){

    const workOrderId =
        "WO2608100001";


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
                "",

            barangId :
                "BRG000001",

            qty :
                2,

            harga :
                55000,

            diskon :
                0,

            status :
                "AKTIF",

            catatan :
                "Clean Batch Test Part 1"

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
                "",

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
                "Clean Batch Test Part 2"

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

function testWorkOrderPartServiceConsumeStockBatch(){

    const result =
        WorkOrderPartService
            .consumeStockBatch(
                "WO2608100001"
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

function testWorkOrderServiceChangeStatus(){

    const workOrderId =
        "WO2608100001";


    const nextStatus =
        WorkOrderStatus.MENUNGGU_APPROVAL;


    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER SERVICE CHANGE STATUS TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * STATUS SEBELUM
     * ========================================
     */

    const before =
        WorkOrderRepository.findById(
            workOrderId
        );


    Logger.log(
        "STATUS SEBELUM:"
    );

    Logger.log(
        before[
            COL_WORK_ORDER.STATUS
        ]
    );


    /**
     * ========================================
     * CHANGE STATUS
     * ========================================
     */

    const result =
        WorkOrderService.changeStatus(

            workOrderId,

            nextStatus

        );


    Logger.log(
        "CHANGE STATUS RESULT:"
    );

    Logger.log(
        result
    );


    /**
     * ========================================
     * BACA ULANG
     * ========================================
     */

    const after =
        WorkOrderRepository.findById(
            workOrderId
        );


    Logger.log(
        "STATUS SESUDAH:"
    );

    Logger.log(
        after[
            COL_WORK_ORDER.STATUS
        ]
    );


    /**
     * ========================================
     * VALIDASI
     * ========================================
     */

    const statusMatch =

        after[
            COL_WORK_ORDER.STATUS
        ] === nextStatus;


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        statusMatch
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "CHANGE STATUS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testWorkOrderServiceChangeStatusInvalid(){

    const workOrderId =
        "WO2608100001";


    const invalidStatus =
        WorkOrderStatus.DRAFT;


    Logger.log(
        "================================"
    );

    Logger.log(
        "INVALID CHANGE STATUS TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * STATUS SEBELUM
     * ========================================
     */

    const before =
        WorkOrderRepository.findById(
            workOrderId
        );


    const statusBefore =
        before[
            COL_WORK_ORDER.STATUS
        ];


    Logger.log(
        "STATUS SEBELUM:"
    );

    Logger.log(
        statusBefore
    );


    /**
     * ========================================
     * COBA TRANSITION INVALID
     * ========================================
     */

    let errorDetected = false;


    try{

        WorkOrderService.changeStatus(

            workOrderId,

            invalidStatus

        );

    }
    catch(error){

        errorDetected = true;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * BACA ULANG
     * ========================================
     */

    const after =
        WorkOrderRepository.findById(
            workOrderId
        );


    const statusAfter =
        after[
            COL_WORK_ORDER.STATUS
        ];


    Logger.log(
        "STATUS SESUDAH:"
    );

    Logger.log(
        statusAfter
    );


    /**
     * ========================================
     * VALIDASI ERROR
     * ========================================
     */

    Logger.log(
        "ERROR TERDETEKSI:"
    );

    Logger.log(
        errorDetected
    );


    /**
     * ========================================
     * VALIDASI STATUS TIDAK BERUBAH
     * ========================================
     */

    const statusUnchanged =
        statusAfter === statusBefore;


    Logger.log(
        "STATUS TETAP:"
    );

    Logger.log(
        statusUnchanged
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "INVALID CHANGE STATUS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}