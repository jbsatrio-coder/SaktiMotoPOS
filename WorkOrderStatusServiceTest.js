/**
 * ============================================
 * Work Order Status Service Test
 * Version : 1.0.0
 * ============================================
 */

function testWorkOrderStatusService(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER STATUS SERVICE TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * TEST 1
     * DRAFT → MENUNGGU_DIAGNOSA
     * ========================================
     */

    const test1 =
        WorkOrderStatusService.canTransition(

            WorkOrderStatus.DRAFT,

            WorkOrderStatus.MENUNGGU_DIAGNOSA

        );


    Logger.log(
        "TEST 1 DRAFT → MENUNGGU_DIAGNOSA:"
    );

    Logger.log(
        test1
    );


    /**
     * ========================================
     * TEST 2
     * MENUNGGU_DIAGNOSA → MENUNGGU_APPROVAL
     * ========================================
     */

    const test2 =
        WorkOrderStatusService.canTransition(

            WorkOrderStatus.MENUNGGU_DIAGNOSA,

            WorkOrderStatus.MENUNGGU_APPROVAL

        );


    Logger.log(
        "TEST 2 MENUNGGU_DIAGNOSA → MENUNGGU_APPROVAL:"
    );

    Logger.log(
        test2
    );


    /**
     * ========================================
     * TEST 3
     * MENUNGGU_APPROVAL → DALAM_PENGERJAAN
     * ========================================
     */

    const test3 =
        WorkOrderStatusService.canTransition(

            WorkOrderStatus.MENUNGGU_APPROVAL,

            WorkOrderStatus.DALAM_PENGERJAAN

        );


    Logger.log(
        "TEST 3 MENUNGGU_APPROVAL → DALAM_PENGERJAAN:"
    );

    Logger.log(
        test3
    );


    /**
     * ========================================
     * TEST 4
     * DALAM_PENGERJAAN → MENUNGGU_SPAREPART
     * ========================================
     */

    const test4 =
        WorkOrderStatusService.canTransition(

            WorkOrderStatus.DALAM_PENGERJAAN,

            WorkOrderStatus.MENUNGGU_SPAREPART

        );


    Logger.log(
        "TEST 4 DALAM_PENGERJAAN → MENUNGGU_SPAREPART:"
    );

    Logger.log(
        test4
    );


    /**
     * ========================================
     * TEST 5
     * MENUNGGU_SPAREPART → DALAM_PENGERJAAN
     * ========================================
     */

    const test5 =
        WorkOrderStatusService.canTransition(

            WorkOrderStatus.MENUNGGU_SPAREPART,

            WorkOrderStatus.DALAM_PENGERJAAN

        );


    Logger.log(
        "TEST 5 MENUNGGU_SPAREPART → DALAM_PENGERJAAN:"
    );

    Logger.log(
        test5
    );


    /**
     * ========================================
     * TEST 6
     * DALAM_PENGERJAAN → SELESAI
     * ========================================
     */

    /**
 * ========================================
 * TEST 6
 * DALAM_PENGERJAAN → QC
 * ========================================
 */

const testProgressToQC =
    WorkOrderStatusService.canTransition(

        WorkOrderStatus.DALAM_PENGERJAAN,

        WorkOrderStatus.QC

    );


Logger.log(
    "TEST DALAM_PENGERJAAN → QC:"
);

Logger.log(
    testProgressToQC
);


    /**
 * ========================================
 * TEST 7
 * QC → SELESAI
 * ========================================
 */

const testQCToSelesai =
    WorkOrderStatusService.canTransition(

        WorkOrderStatus.QC,

        WorkOrderStatus.SELESAI

    );


Logger.log(
    "TEST QC → SELESAI:"
);

Logger.log(
    testQCToSelesai
);


/**
 * ========================================
 * TEST 8
 * DALAM_PENGERJAAN → SELESAI
 *
 * HARUS DITOLAK
 * ========================================
 */

const testProgressToSelesai =
    WorkOrderStatusService.canTransition(

        WorkOrderStatus.DALAM_PENGERJAAN,

        WorkOrderStatus.SELESAI

    );


Logger.log(
    "TEST DALAM_PENGERJAAN → SELESAI (HARUS FALSE):"
);

Logger.log(
    testProgressToSelesai
);


    /**
     * ========================================
     * TEST 9
     * SELESAI → SUDAH_DIAMBIL
     * ========================================
     */

    const test7 =
        WorkOrderStatusService.canTransition(

            WorkOrderStatus.SELESAI,

            WorkOrderStatus.SUDAH_DIAMBIL

        );


    Logger.log(
        "TEST 7 SELESAI → SUDAH_DIAMBIL:"
    );

    Logger.log(
        test7
    );


    /**
     * ========================================
     * TEST 8
     * DRAFT → DIBATALKAN
     * ========================================
     */

    const test8 =
        WorkOrderStatusService.canTransition(

            WorkOrderStatus.DRAFT,

            WorkOrderStatus.DIBATALKAN

        );


    Logger.log(
        "TEST 8 DRAFT → DIBATALKAN:"
    );

    Logger.log(
        test8
    );


    /**
     * ========================================
     * TEST 9
     * STATUS SAMA
     * ========================================
     */

    const test9 =
        WorkOrderStatusService.canTransition(

            WorkOrderStatus.DRAFT,

            WorkOrderStatus.DRAFT

        );


    Logger.log(
        "TEST 9 DRAFT → DRAFT:"
    );

    Logger.log(
        test9
    );


    /**
     * ========================================
     * INVALID TRANSITION TEST
     * DRAFT → SELESAI
     * ========================================
     */

    const testInvalid =
        WorkOrderStatusService.canTransition(

            WorkOrderStatus.DRAFT,

            WorkOrderStatus.SELESAI

        );


    Logger.log(
        "TEST INVALID DRAFT → SELESAI:"
    );

    Logger.log(
        testInvalid
    );


    /**
     * ========================================
     * INVALID TRANSITION TEST
     * SELESAI → DRAFT
     * ========================================
     */

    const testInvalid2 =
        WorkOrderStatusService.canTransition(

            WorkOrderStatus.SELESAI,

            WorkOrderStatus.DRAFT

        );


    Logger.log(
        "TEST INVALID SELESAI → DRAFT:"
    );

    Logger.log(
        testInvalid2
    );


    /**
     * ========================================
     * INVALID TRANSITION TEST
     * SUDAH_DIAMBIL → SELESAI
     * ========================================
     */

    const testInvalid3 =
        WorkOrderStatusService.canTransition(

            WorkOrderStatus.SUDAH_DIAMBIL,

            WorkOrderStatus.SELESAI

        );


    Logger.log(
        "TEST INVALID SUDAH_DIAMBIL → SELESAI:"
    );

    Logger.log(
        testInvalid3
    );


    /**
     * ========================================
     * SUMMARY
     * ========================================
     */

    Logger.log(
        "================================"
    );

    Logger.log(
        "STATUS SERVICE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

    /**
     * ========================================
     * TERMINAL STATE REGRESSION TEST
     * ========================================
     *
     * DIBATALKAN dan SUDAH_DIAMBIL
     * harus menjadi terminal state.
     *
     * Tidak boleh berpindah ke status lain.
     * ========================================
     */

    const terminalStatuses = [

        WorkOrderStatus.DIBATALKAN,

        WorkOrderStatus.SUDAH_DIAMBIL

    ];


    const allStatuses = [

        WorkOrderStatus.DRAFT,

        WorkOrderStatus.MENUNGGU_DIAGNOSA,

        WorkOrderStatus.MENUNGGU_APPROVAL,

        WorkOrderStatus.DALAM_PENGERJAAN,

        WorkOrderStatus.MENUNGGU_SPAREPART,

        WorkOrderStatus.QC,

        WorkOrderStatus.SELESAI,

        WorkOrderStatus.SUDAH_DIAMBIL,

        WorkOrderStatus.DIBATALKAN

    ];


    for(
        let i = 0;
        i < terminalStatuses.length;
        i++
    ){

        const fromStatus =
            terminalStatuses[i];


        for(
            let j = 0;
            j < allStatuses.length;
            j++
        ){

            const toStatus =
                allStatuses[j];


            if(
                fromStatus === toStatus
            ){

                continue;

            }


            const allowed =
                WorkOrderStatusService.canTransition(

                    fromStatus,

                    toStatus

                );


            Logger.log(

                "TERMINAL " +
                fromStatus +
                " → " +
                toStatus +
                " = " +
                allowed

            );


            if(
                allowed
            ){

                throw new Error(

                    "Terminal state tidak boleh berpindah: " +
                    fromStatus +
                    " → " +
                    toStatus

                );

            }

        }

    }


    Logger.log(
        "TERMINAL STATE REGRESSION PASS"
    );

function testWorkOrderStatusServiceValidate(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "VALIDATE TRANSITION TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * TEST VALID
     * DRAFT → MENUNGGU_DIAGNOSA
     * ========================================
     */

    const validResult =
        WorkOrderStatusService.validateTransition(

            WorkOrderStatus.DRAFT,

            WorkOrderStatus.MENUNGGU_DIAGNOSA

        );


    Logger.log(
        "VALID TRANSITION RESULT:"
    );

    Logger.log(
        validResult
    );


    /**
     * ========================================
     * TEST INVALID
     * DRAFT → SELESAI
     * ========================================
     */

    let invalidErrorDetected = false;


    try{

        WorkOrderStatusService.validateTransition(

            WorkOrderStatus.DRAFT,

            WorkOrderStatus.SELESAI

        );

    }
    catch(error){

        invalidErrorDetected = true;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "INVALID TRANSITION ERROR DETECTED:"
    );

    Logger.log(
        invalidErrorDetected
    );


    /**
     * ========================================
     * TEST INVALID STATUS
     * ========================================
     */

    let invalidStatusErrorDetected = false;


    try{

        WorkOrderStatusService.validateTransition(

            "STATUS_TIDAK_VALID",

            WorkOrderStatus.DRAFT

        );

    }
    catch(error){

        invalidStatusErrorDetected = true;


        Logger.log(
            "EXPECTED INVALID STATUS ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "INVALID STATUS ERROR DETECTED:"
    );

    Logger.log(
        invalidStatusErrorDetected
    );


    /**
     * ========================================
     * SUMMARY
     * ========================================
     */

    Logger.log(
        "================================"
    );

    Logger.log(
        "VALIDATE TRANSITION TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Work Order Completion Validation
 * ============================================
 */

function testWorkOrderStatusServiceCanComplete(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER CAN COMPLETE TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608100001";


    /**
     * ========================================
     * TEST 1
     * Work Order belum boleh selesai
     * ========================================
     */

    let result;

    try{

        result =
            WorkOrderStatusService.canComplete(
                workOrderId
            );

        Logger.log(
            "CAN COMPLETE RESULT:"
        );

        Logger.log(
            JSON.stringify(result)
        );

    }
    catch(error){

        Logger.log(
            "EXPECTED / CURRENT ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "CAN COMPLETE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Work Order Can Complete
 * ============================================
 */

function testWorkOrderStatusServiceCanComplete(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER CAN COMPLETE TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608100001";


    const result =
        WorkOrderStatusService.canComplete(
            workOrderId
        );


    Logger.log(
        "CAN COMPLETE:"
    );

    Logger.log(
        result.canComplete
    );


    Logger.log(
        "REASON:"
    );

    Logger.log(
        result.reason
    );


    Logger.log(
        "JASA:"
    );

    Logger.log(
        JSON.stringify(
            result.jasa
        )
    );


    Logger.log(
        "PARTS:"
    );

    Logger.log(
        JSON.stringify(
            result.parts
        )
    );


    Logger.log(
        "FULL RESULT:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "CAN COMPLETE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}