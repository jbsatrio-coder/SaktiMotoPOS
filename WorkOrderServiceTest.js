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

function testWorkOrderServiceChangeStatusToSelesaiSuccess(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "CHANGE STATUS TO SELESAI SUCCESS TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608100001";


    /**
     * Pastikan status saat ini
     * DALAM_PENGERJAAN
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
     * Jalankan change status
     */

    const result =
        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SELESAI

        );


    Logger.log(
        "CHANGE STATUS RESULT:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );


    /**
     * Cek status aktual
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


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        after[
            COL_WORK_ORDER.STATUS
        ] ===
        WorkOrderStatus.SELESAI
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "SUCCESS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Completion Gate Failure
 * ============================================
 */

function testWorkOrderServiceCompletionGateFailure(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE FAILURE TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE TEST WORK ORDER
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
                "Completion Gate Failure Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "TEST WORK ORDER:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE PART
     *
     * Tidak dilakukan Stock Out.
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
                "Completion Gate Failure Test"

        });


    Logger.log(
        "TEST PART:"
    );

    Logger.log(
        partResult.workOrderPartId
    );


    /**
     * ========================================
     * 3. DRAFT
     * → MENUNGGU_DIAGNOSA
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_DIAGNOSA

    );


    /**
     * ========================================
     * 4. MENUNGGU_DIAGNOSA
     * → MENUNGGU_APPROVAL
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_APPROVAL

    );


    /**
     * ========================================
     * 5. MENUNGGU_APPROVAL
     * → DALAM_PENGERJAAN
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.DALAM_PENGERJAAN

    );


    /**
     * ========================================
     * 6. CEK COMPLETION
     * ========================================
     */

    const completion =
        WorkOrderStatusService.canComplete(
            workOrderId
        );


    Logger.log(
        "CAN COMPLETE:"
    );

    Logger.log(
        completion.canComplete
    );


    Logger.log(
        "COMPLETION RESULT:"
    );

    Logger.log(
        JSON.stringify(
            completion
        )
    );


    /**
     * ========================================
     * 7. COBA SELESAI
     * ========================================
     */

    let errorDetected =
        false;


    try{

        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SELESAI

        );

    }
    catch(error){

        errorDetected =
            true;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * 8. CEK STATUS
     * ========================================
     */

    const after =
        WorkOrderRepository.findById(
            workOrderId
        );


    const finalStatus =
        after[
            COL_WORK_ORDER.STATUS
        ];


    Logger.log(
        "ERROR TERDETEKSI:"
    );

    Logger.log(
        errorDetected
    );


    Logger.log(
        "STATUS AKHIR:"
    );

    Logger.log(
        finalStatus
    );


    Logger.log(
        "STATUS TETAP DALAM_PENGERJAAN:"
    );

    Logger.log(
        finalStatus ===
        WorkOrderStatus.DALAM_PENGERJAAN
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE FAILURE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Completion Gate Success
 * ============================================
 */

function testWorkOrderServiceCompletionGateSuccess(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE SUCCESS TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608100001";

/**
 * ========================================
 * Pastikan WO berada di
 * DALAM_PENGERJAAN
 * ========================================
 */

const current =
    WorkOrderRepository.findById(
        workOrderId
    );


const currentStatus =
    current[
        COL_WORK_ORDER.STATUS
    ];


Logger.log(
    "STATUS AWAL:"
);

Logger.log(
    currentStatus
);


if(
    currentStatus ===
    WorkOrderStatus.MENUNGGU_APPROVAL
){

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.DALAM_PENGERJAAN

    );

}
    /**
     * ========================================
     * 1. CEK STATUS SEKARANG
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
     * 2. CEK COMPLETION
     * ========================================
     */

    const completion =
        WorkOrderStatusService.canComplete(
            workOrderId
        );


    Logger.log(
        "CAN COMPLETE:"
    );

    Logger.log(
        completion.canComplete
    );


    Logger.log(
        "COMPLETION RESULT:"
    );

    Logger.log(
        JSON.stringify(
            completion
        )
    );


    /**
     * ========================================
     * 3. CHANGE STATUS
     * ========================================
     */

    const result =
        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SELESAI

        );


    Logger.log(
        "CHANGE STATUS RESULT:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );


    /**
     * ========================================
     * 4. CEK STATUS AKHIR
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


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        statusAfter ===
        WorkOrderStatus.SELESAI
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE SUCCESS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}