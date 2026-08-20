/**
 * ============================================
 * COMPLETION GATE INTEGRATION FIXTURE
 * ============================================
 */

let completionGateFixture = {

    workOrderId :
        "",

    jasa1Id :
        "",

    jasa2Id :
        "",

    jasa3Id :
        ""

};



/**
 * ============================================
 * Work Order Jasa Status Service Test
 * Version : 1.0.0
 * ============================================
 */

function testWorkOrderJasaStatusService(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA STATUS SERVICE TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * TEST 1
     * OPEN → PROGRESS
     * ========================================
     */

    const test1 =
        WorkOrderJasaStatusService.canTransition(

            WorkOrderJasaStatus.OPEN,

            WorkOrderJasaStatus.PROGRESS

        );


    Logger.log(
        "TEST 1 OPEN → PROGRESS:"
    );

    Logger.log(
        test1
    );


    /**
     * ========================================
     * TEST 2
     * PROGRESS → DONE
     * ========================================
     */

    const test2 =
        WorkOrderJasaStatusService.canTransition(

            WorkOrderJasaStatus.PROGRESS,

            WorkOrderJasaStatus.DONE

        );


    Logger.log(
        "TEST 2 PROGRESS → DONE:"
    );

    Logger.log(
        test2
    );


    /**
     * ========================================
     * TEST 3
     * OPEN → CANCEL
     * ========================================
     */

    const test3 =
        WorkOrderJasaStatusService.canTransition(

            WorkOrderJasaStatus.OPEN,

            WorkOrderJasaStatus.CANCEL

        );


    Logger.log(
        "TEST 3 OPEN → CANCEL:"
    );

    Logger.log(
        test3
    );


    /**
     * ========================================
     * TEST 4
     * PROGRESS → CANCEL
     * ========================================
     */

    const test4 =
        WorkOrderJasaStatusService.canTransition(

            WorkOrderJasaStatus.PROGRESS,

            WorkOrderJasaStatus.CANCEL

        );


    Logger.log(
        "TEST 4 PROGRESS → CANCEL:"
    );

    Logger.log(
        test4
    );


    /**
     * ========================================
     * TEST 5
     * STATUS SAMA
     * ========================================
     */

    const test5 =
        WorkOrderJasaStatusService.canTransition(

            WorkOrderJasaStatus.OPEN,

            WorkOrderJasaStatus.OPEN

        );


    Logger.log(
        "TEST 5 OPEN → OPEN:"
    );

    Logger.log(
        test5
    );


    /**
     * ========================================
     * INVALID 1
     * OPEN → DONE
     * ========================================
     */

    const invalid1 =
        WorkOrderJasaStatusService.canTransition(

            WorkOrderJasaStatus.OPEN,

            WorkOrderJasaStatus.DONE

        );


    Logger.log(
        "INVALID 1 OPEN → DONE:"
    );

    Logger.log(
        invalid1
    );


    /**
     * ========================================
     * INVALID 2
     * DONE → PROGRESS
     * ========================================
     */

    const invalid2 =
        WorkOrderJasaStatusService.canTransition(

            WorkOrderJasaStatus.DONE,

            WorkOrderJasaStatus.PROGRESS

        );


    Logger.log(
        "INVALID 2 DONE → PROGRESS:"
    );

    Logger.log(
        invalid2
    );


    /**
     * ========================================
     * INVALID 3
     * CANCEL → OPEN
     * ========================================
     */

    const invalid3 =
        WorkOrderJasaStatusService.canTransition(

            WorkOrderJasaStatus.CANCEL,

            WorkOrderJasaStatus.OPEN

        );


    Logger.log(
        "INVALID 3 CANCEL → OPEN:"
    );

    Logger.log(
        invalid3
    );


    /**
     * ========================================
     * INVALID STATUS
     * ========================================
     */

    const invalidStatus =
        WorkOrderJasaStatusService.canTransition(

            "STATUS_TIDAK_VALID",

            WorkOrderJasaStatus.OPEN

        );


    Logger.log(
        "INVALID STATUS → OPEN:"
    );

    Logger.log(
        invalidStatus
    );


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

function testWorkOrderJasaStatusServiceValidate(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "VALIDATE JASA STATUS TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * VALID
     * OPEN → PROGRESS
     * ========================================
     */

    const validResult =
        WorkOrderJasaStatusService.validateTransition(

            WorkOrderJasaStatus.OPEN,

            WorkOrderJasaStatus.PROGRESS

        );


    Logger.log(
        "VALID TRANSITION RESULT:"
    );

    Logger.log(
        validResult
    );


    /**
     * ========================================
     * INVALID TRANSITION
     * OPEN → DONE
     * ========================================
     */

    let invalidErrorDetected =
        false;


    try{

        WorkOrderJasaStatusService.validateTransition(

            WorkOrderJasaStatus.OPEN,

            WorkOrderJasaStatus.DONE

        );

    }
    catch(error){

        invalidErrorDetected =
            true;


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
     * INVALID STATUS
     * ========================================
     */

    let invalidStatusErrorDetected =
        false;


    try{

        WorkOrderJasaStatusService.validateTransition(

            "STATUS_TIDAK_VALID",

            WorkOrderJasaStatus.OPEN

        );

    }
    catch(error){

        invalidStatusErrorDetected =
            true;


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


    Logger.log(
        "================================"
    );

    Logger.log(
        "VALIDATE JASA STATUS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testWorkOrderJasaChangeStatus(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA CHANGE STATUS TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderJasaId =
        "WOJ2608100001";


    /**
     * ========================================
     * STATUS AWAL
     * ========================================
     */

    const before =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "STATUS SEBELUM:"
    );

    Logger.log(
        before
            ? before[COL_WO_JASA.STATUS]
            : "NOT FOUND"
    );


    /**
     * ========================================
     * OPEN → PROGRESS
     * ========================================
     */

    const result =
        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.PROGRESS

        );


    Logger.log(
        "CHANGE STATUS RESULT:"
    );

    Logger.log(
        result
    );


    /**
     * ========================================
     * STATUS SESUDAH
     * ========================================
     */

    const after =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    const finalStatus =
        after
            ? after[COL_WO_JASA.STATUS]
            : "";


    Logger.log(
        "STATUS SESUDAH:"
    );

    Logger.log(
        finalStatus
    );


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        finalStatus ===
        WorkOrderJasaStatus.PROGRESS
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

function testWorkOrderJasaChangeStatusToDone(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA PROGRESS TO DONE TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderJasaId =
        "WOJ2608100001";


    /**
     * ========================================
     * STATUS AWAL
     * ========================================
     */

    const before =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "STATUS SEBELUM:"
    );

    Logger.log(
        before
            ? before[COL_WO_JASA.STATUS]
            : "NOT FOUND"
    );


    /**
     * ========================================
     * PROGRESS → DONE
     * ========================================
     */

    const result =
        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.DONE

        );


    Logger.log(
        "CHANGE STATUS RESULT:"
    );

    Logger.log(
        result
    );


    /**
     * ========================================
     * STATUS SESUDAH
     * ========================================
     */

    const after =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    const finalStatus =
        after
            ? after[COL_WO_JASA.STATUS]
            : "";


    Logger.log(
        "STATUS SESUDAH:"
    );

    Logger.log(
        finalStatus
    );


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        finalStatus ===
        WorkOrderJasaStatus.DONE
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "PROGRESS TO DONE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCreateWorkOrderJasaForCancel(){

  Logger.log(
    WorkOrderJasaService.create({

      workOrderId : "WO2608070001",

      jasaId : "JAS000003",

      qty : 1,

      diskon : 0,

      mekanikId : "",

      keluhan : "Cancel lifecycle test",

      diagnosa : "Cancel lifecycle test",

      catatan : "Testing PROGRESS to CANCEL"

    })
  );

}

function testWorkOrderJasaCancelStart(){

  const workOrderJasaId =
    "WOJ2608100002";

  Logger.log(
    WorkOrderJasaService.changeStatus(
      workOrderJasaId,
      WorkOrderJasaStatus.PROGRESS
    )
  );

}

function testWorkOrderJasaProgressToCancel(){

  const workOrderJasaId =
    "WOJ2608100002";

  Logger.log(
    "================================"
  );

  Logger.log(
    "WORK ORDER JASA PROGRESS TO CANCEL TEST"
  );

  Logger.log(
    "================================"
  );


  const before =
    WorkOrderJasaRepository.findById(
      workOrderJasaId
    );


  Logger.log(
    "STATUS SEBELUM:"
  );

  Logger.log(
    before[
      COL_WO_JASA.STATUS
    ]
  );


  const result =
    WorkOrderJasaService.changeStatus(

      workOrderJasaId,

      WorkOrderJasaStatus.CANCEL

    );


  Logger.log(
    "CHANGE STATUS RESULT:"
  );

  Logger.log(
    result
  );


  const after =
    WorkOrderJasaRepository.findById(
      workOrderJasaId
    );


  const finalStatus =
    after[
      COL_WO_JASA.STATUS
    ];


  Logger.log(
    "STATUS SESUDAH:"
  );

  Logger.log(
    finalStatus
  );


  Logger.log(
    "STATUS MATCH:"
  );

  Logger.log(
    finalStatus ===
    WorkOrderJasaStatus.CANCEL
  );


  Logger.log(
    "================================"
  );

  Logger.log(
    "PROGRESS TO CANCEL TEST SELESAI"
  );

  Logger.log(
    "================================"
  );

}

function testWorkOrderJasaTerminalStatus(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA TERMINAL STATUS TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * CANCEL → OPEN
     * ========================================
     */

    let cancelToOpenError = false;

    try {

        WorkOrderJasaService.changeStatus(

            "WOJ2608100002",

            WorkOrderJasaStatus.OPEN

        );

    }
    catch(error){

        cancelToOpenError = true;

        Logger.log(
            "EXPECTED ERROR CANCEL → OPEN:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "CANCEL → OPEN ERROR DETECTED:"
    );

    Logger.log(
        cancelToOpenError
    );


    /**
     * ========================================
     * CANCEL → DONE
     * ========================================
     */

    let cancelToDoneError = false;

    try {

        WorkOrderJasaService.changeStatus(

            "WOJ2608100002",

            WorkOrderJasaStatus.DONE

        );

    }
    catch(error){

        cancelToDoneError = true;

        Logger.log(
            "EXPECTED ERROR CANCEL → DONE:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "CANCEL → DONE ERROR DETECTED:"
    );

    Logger.log(
        cancelToDoneError
    );


    /**
     * ========================================
     * DONE → PROGRESS
     * ========================================
     */

    let doneToProgressError = false;

    try {

        WorkOrderJasaService.changeStatus(

            "WOJ2608100001",

            WorkOrderJasaStatus.PROGRESS

        );

    }
    catch(error){

        doneToProgressError = true;

        Logger.log(
            "EXPECTED ERROR DONE → PROGRESS:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "DONE → PROGRESS ERROR DETECTED:"
    );

    Logger.log(
        doneToProgressError
    );


    /**
     * ========================================
     * DONE → CANCEL
     * ========================================
     */

    let doneToCancelError = false;

    try {

        WorkOrderJasaService.changeStatus(

            "WOJ2608100001",

            WorkOrderJasaStatus.CANCEL

        );

    }
    catch(error){

        doneToCancelError = true;

        Logger.log(
            "EXPECTED ERROR DONE → CANCEL:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "DONE → CANCEL ERROR DETECTED:"
    );

    Logger.log(
        doneToCancelError
    );


    /**
     * ========================================
     * VERIFY STATUS TETAP
     * ========================================
     */

    const cancelRecord =
        WorkOrderJasaRepository.findById(
            "WOJ2608100002"
        );


    const doneRecord =
        WorkOrderJasaRepository.findById(
            "WOJ2608100001"
        );


    Logger.log(
        "CANCEL STATUS TETAP:"
    );

    Logger.log(
        cancelRecord[
            COL_WO_JASA.STATUS
        ] ===
        WorkOrderJasaStatus.CANCEL
    );


    Logger.log(
        "DONE STATUS TETAP:"
    );

    Logger.log(
        doneRecord[
            COL_WO_JASA.STATUS
        ] ===
        WorkOrderJasaStatus.DONE
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "TERMINAL STATUS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testWorkOrderJasaCompletionGateSuccess(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA COMPLETION GATE SUCCESS TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608070001";


    /**
     * ========================================
     * CEK JASA
     * ========================================
     */

    const jasa =
        WorkOrderJasaRepository.findByWorkOrderId(
            workOrderId
        );


    Logger.log(
        "JUMLAH JASA:"
    );

    Logger.log(
        jasa.length
    );


    for(
        let i = 0;
        i < jasa.length;
        i++
    ){

        Logger.log(
            "JASA " + (i + 1) + ":"
        );

        Logger.log(
            {
                id :
                    jasa[i][COL_WO_JASA.ID],

                jasaId :
                    jasa[i][COL_WO_JASA.JASA_ID],

                status :
                    jasa[i][COL_WO_JASA.STATUS]
            }
        );

    }


    /**
     * ========================================
     * COMPLETION GATE
     * ========================================
     */

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
        "JASA RESULT:"
    );

    Logger.log(
        result.jasa
    );


    Logger.log(
        "EXPECTED:"
    );

    Logger.log(
        "JASA SELESAI = " +
        result.jasa.selesai
    );

    Logger.log(
        "JASA BELUM SELESAI = " +
        result.jasa.belumSelesai
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

function testCreateCompletionGateWorkOrder(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE COMPLETION GATE TEST WORK ORDER"
    );

    Logger.log(
        "================================"
    );


    const result =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                17000,

            prioritas :
                WorkOrderPriority.NORMAL,

            admin :
                "Developer",

            catatan :
                "Dedicated Completion Gate Integration Test",

            jenisTransaksi :
                WorkOrderType.SERVICE

        });


    Logger.log(
        "CREATE RESULT:"
    );

    Logger.log(
        result
    );


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        result.workOrderId
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE TEST WORK ORDER SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCreateCompletionGateJasa(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE COMPLETION GATE TEST JASA"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608100003";


    /**
     * ========================================
     * JASA #1
     * ========================================
     */

    Logger.log(
        "CREATE JASA #1"
    );

    const jasa1 =
        WorkOrderJasaService.create({

            workOrderId :
                workOrderId,

            jasaId :
                "JAS000001",

            qty :
                1,

            diskon :
                0,

            mekanikId :
                "",

            keluhan :
                "Test Completion Gate - Jasa 1",

            diagnosa :
                "Test jasa pertama",

            catatan :
                "Completion Gate Test - Jasa 1"

        });


    Logger.log(
        "JASA #1 RESULT:"
    );

    Logger.log(
        jasa1
    );


    /**
     * ========================================
     * JASA #2
     * ========================================
     */

    Logger.log(
        "CREATE JASA #2"
    );

    const jasa2 =
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
                "Test Completion Gate - Jasa 2",

            diagnosa :
                "Test jasa kedua",

            catatan :
                "Completion Gate Test - Jasa 2"

        });


    Logger.log(
        "JASA #2 RESULT:"
    );

    Logger.log(
        jasa2
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE JASA TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCompletionGateJasa1ToProgress(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA #1 TO PROGRESS"
    );

    Logger.log(
        "================================"
    );


    const result =
        WorkOrderJasaService.changeStatus(

            "WOJ2608100003",

            WorkOrderJasaStatus.PROGRESS

        );


    Logger.log(
        "RESULT:"
    );

    Logger.log(
        result
    );


    const row =
        WorkOrderJasaRepository.findById(
            "WOJ2608100003"
        );


    Logger.log(
        "STATUS:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
        ===
        WorkOrderJasaStatus.PROGRESS
    );

}

function testCompletionGateJasa1ToDone(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA #1 TO DONE"
    );

    Logger.log(
        "================================"
    );


    const result =
        WorkOrderJasaService.changeStatus(

            "WOJ2608100003",

            WorkOrderJasaStatus.DONE

        );


    Logger.log(
        "RESULT:"
    );

    Logger.log(
        result
    );


    const row =
        WorkOrderJasaRepository.findById(
            "WOJ2608100003"
        );


    Logger.log(
        "STATUS:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
        ===
        WorkOrderJasaStatus.DONE
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "JASA #1 TO DONE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCompletionGateJasa2ToProgress(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA #2 TO PROGRESS"
    );

    Logger.log(
        "================================"
    );


    const result =
        WorkOrderJasaService.changeStatus(

            "WOJ2608100004",

            WorkOrderJasaStatus.PROGRESS

        );


    Logger.log(
        "RESULT:"
    );

    Logger.log(
        result
    );


    const row =
        WorkOrderJasaRepository.findById(
            "WOJ2608100004"
        );


    Logger.log(
        "STATUS:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
        ===
        WorkOrderJasaStatus.PROGRESS
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "JASA #2 TO PROGRESS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCompletionGateJasa2ToCancel(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA #2 TO CANCEL"
    );

    Logger.log(
        "================================"
    );


    const result =
        WorkOrderJasaService.changeStatus(

            "WOJ2608100004",

            WorkOrderJasaStatus.CANCEL

        );


    Logger.log(
        "RESULT:"
    );

    Logger.log(
        result
    );


    const row =
        WorkOrderJasaRepository.findById(
            "WOJ2608100004"
        );


    Logger.log(
        "STATUS:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
        ===
        WorkOrderJasaStatus.CANCEL
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "JASA #2 TO CANCEL TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCompletionGateJasaIntegrationSuccess(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA INTEGRATION SUCCESS TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608100003";


    /**
     * ========================================
     * CEK JASA
     * ========================================
     */

    const jasa =
        WorkOrderJasaRepository.findByWorkOrderId(
            workOrderId
        );


    Logger.log(
        "JUMLAH JASA:"
    );

    Logger.log(
        jasa.length
    );


    for(
        let i = 0;
        i < jasa.length;
        i++
    ){

        Logger.log(
            "JASA " + (i + 1) + ":"
        );

        Logger.log({

            id :
                jasa[i][COL_WO_JASA.ID],

            jasaId :
                jasa[i][COL_WO_JASA.JASA_ID],

            status :
                jasa[i][COL_WO_JASA.STATUS]

        });

    }


    /**
     * ========================================
     * COMPLETION GATE
     * ========================================
     */

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
        "JASA RESULT:"
    );

    Logger.log(
        result.jasa
    );


    /**
     * ========================================
     * ASSERTION
     * ========================================
     */

    Logger.log(
        "EXPECTED CAN COMPLETE:"
    );

    Logger.log(
        result.canComplete === true
    );


    Logger.log(
        "EXPECTED TOTAL JASA:"
    );

    Logger.log(
        result.jasa.total === 2
    );


    Logger.log(
        "EXPECTED JASA SELESAI:"
    );

    Logger.log(
        result.jasa.selesai === 2
    );


    Logger.log(
        "EXPECTED JASA BELUM SELESAI:"
    );

    Logger.log(
        result.jasa.belumSelesai === 0
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA INTEGRATION SUCCESS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCreateCompletionGateJasa3(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE COMPLETION GATE JASA #3"
    );

    Logger.log(
        "================================"
    );


    const result =
        WorkOrderJasaService.create({

            workOrderId :
                "WO2608100003",

            jasaId :
                "JAS000003",

            qty :
                1,

            diskon :
                0,

            mekanikId :
                "",

            keluhan :
                "Test Completion Gate Failure",

            diagnosa :
                "Jasa belum selesai",

            catatan :
                "Completion Gate Failure Test"

        });


    Logger.log(
        "CREATE RESULT:"
    );

    Logger.log(
        result
    );


    Logger.log(
        "WORK ORDER JASA ID:"
    );

    Logger.log(
        result.workOrderJasaId
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE JASA #3 TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCompletionGateJasa3ToProgress(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA #3 TO PROGRESS"
    );

    Logger.log(
        "================================"
    );


    const workOrderJasaId =
        "WOJ2608110001";


    const result =
        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.PROGRESS

        );


    Logger.log(
        "RESULT:"
    );

    Logger.log(
        result
    );


    const row =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "STATUS:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
        ===
        WorkOrderJasaStatus.PROGRESS
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "JASA #3 TO PROGRESS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCompletionGateJasaIntegrationFailure(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA INTEGRATION FAILURE TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608100003";


    /**
     * ========================================
     * COMPLETION GATE
     * ========================================
     */

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
        "JASA RESULT:"
    );

    Logger.log(
        result.jasa
    );


    /**
     * ========================================
     * ASSERTION
     * ========================================
     */

    Logger.log(
        "EXPECTED CAN COMPLETE:"
    );

    Logger.log(
        result.canComplete === false
    );


    Logger.log(
        "EXPECTED TOTAL JASA:"
    );

    Logger.log(
        result.jasa.total === 3
    );


    Logger.log(
        "EXPECTED JASA SELESAI:"
    );

    Logger.log(
        result.jasa.selesai === 2
    );


    Logger.log(
        "EXPECTED JASA BELUM SELESAI:"
    );

    Logger.log(
        result.jasa.belumSelesai === 1
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA INTEGRATION FAILURE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCompletionGateJasa3Cleanup(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA #3 CLEANUP"
    );

    Logger.log(
        "================================"
    );


    const workOrderJasaId =
        "WOJ2608110001";


    const result =
        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.CANCEL

        );


    Logger.log(
        "RESULT:"
    );

    Logger.log(
        result
    );


    const row =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "STATUS AKHIR:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
        ===
        WorkOrderJasaStatus.CANCEL
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "CLEANUP TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCompletionGateIntegration(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA COMPLETION GATE"
    );

    Logger.log(
        "DETERMINISTIC INTEGRATION TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * RESET FIXTURE
     * ========================================
     */

    completionGateFixture = {

        workOrderId :
            "",

        jasa1Id :
            "",

        jasa2Id :
            "",

        jasa3Id :
            ""

    };


    try {

        /**
         * ========================================
         * 1. CREATE WORK ORDER
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 1: CREATE WORK ORDER"
        );

        Logger.log(
            "--------------------------------"
        );


        const workOrderResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    18000,

                prioritas :
                    WorkOrderPriority.NORMAL,

                admin :
                    "Completion Gate Test",

                catatan :
                    "Dedicated Completion Gate Integration Test",

                jenisTransaksi :
                    WorkOrderType.SERVICE

            });


        Logger.log(
            "WORK ORDER RESULT:"
        );

        Logger.log(
            workOrderResult
        );


        if(
            !workOrderResult ||
            !workOrderResult.workOrderId
        ){

            throw new Error(
                "Gagal membuat Work Order fixture."
            );

        }


        completionGateFixture.workOrderId =
            workOrderResult.workOrderId;


        Logger.log(
            "WORK ORDER ID:"
        );

        Logger.log(
            completionGateFixture.workOrderId
        );


        /**
         * ========================================
         * 2. CREATE JASA #1
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 2: CREATE JASA #1"
        );

        Logger.log(
            "--------------------------------"
        );


        const jasa1 =
            WorkOrderJasaService.create({

                workOrderId :
                    completionGateFixture.workOrderId,

                jasaId :
                    "JAS000001",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "Completion Gate Integration Jasa 1",

                diagnosa :
                    "Test jasa pertama",

                catatan :
                    "Completion Gate Integration Test"

            });


        Logger.log(
            "JASA #1 RESULT:"
        );

        Logger.log(
            jasa1
        );


        if(
            !jasa1 ||
            !jasa1.workOrderJasaId
        ){

            throw new Error(
                "Gagal membuat Jasa #1 fixture."
            );

        }


        completionGateFixture.jasa1Id =
            jasa1.workOrderJasaId;


        /**
         * ========================================
         * 3. CREATE JASA #2
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 3: CREATE JASA #2"
        );

        Logger.log(
            "--------------------------------"
        );


        const jasa2 =
            WorkOrderJasaService.create({

                workOrderId :
                    completionGateFixture.workOrderId,

                jasaId :
                    "JAS000002",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "Completion Gate Integration Jasa 2",

                diagnosa :
                    "Test jasa kedua",

                catatan :
                    "Completion Gate Integration Test"

            });


        Logger.log(
            "JASA #2 RESULT:"
        );

        Logger.log(
            jasa2
        );


        if(
            !jasa2 ||
            !jasa2.workOrderJasaId
        ){

            throw new Error(
                "Gagal membuat Jasa #2 fixture."
            );

        }


        completionGateFixture.jasa2Id =
            jasa2.workOrderJasaId;


        /**
         * ========================================
         * 4. JASA #1 → PROGRESS
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 4: JASA #1 OPEN → PROGRESS"
        );

        Logger.log(
            "--------------------------------"
        );


        const jasa1Progress =
            WorkOrderJasaService.changeStatus(

                completionGateFixture.jasa1Id,

                WorkOrderJasaStatus.PROGRESS

            );


        Logger.log(
            jasa1Progress
        );


        if(
            !jasa1Progress ||
            !jasa1Progress.success ||
            jasa1Progress.status !==
                WorkOrderJasaStatus.PROGRESS
        ){

            throw new Error(
                "Jasa #1 gagal masuk PROGRESS."
            );

        }


        /**
         * ========================================
         * 5. JASA #1 → DONE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 5: JASA #1 PROGRESS → DONE"
        );

        Logger.log(
            "--------------------------------"
        );


        const jasa1Done =
            WorkOrderJasaService.changeStatus(

                completionGateFixture.jasa1Id,

                WorkOrderJasaStatus.DONE

            );


        Logger.log(
            jasa1Done
        );


        if(
            !jasa1Done ||
            !jasa1Done.success ||
            jasa1Done.status !==
                WorkOrderJasaStatus.DONE
        ){

            throw new Error(
                "Jasa #1 gagal menjadi DONE."
            );

        }


        /**
         * ========================================
         * 6. JASA #2 → PROGRESS
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 6: JASA #2 OPEN → PROGRESS"
        );

        Logger.log(
            "--------------------------------"
        );


        const jasa2Progress =
            WorkOrderJasaService.changeStatus(

                completionGateFixture.jasa2Id,

                WorkOrderJasaStatus.PROGRESS

            );


        Logger.log(
            jasa2Progress
        );


        if(
            !jasa2Progress ||
            !jasa2Progress.success ||
            jasa2Progress.status !==
                WorkOrderJasaStatus.PROGRESS
        ){

            throw new Error(
                "Jasa #2 gagal masuk PROGRESS."
            );

        }


        /**
         * ========================================
         * 7. JASA #2 → DONE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 7: JASA #2 PROGRESS → DONE"
        );

        Logger.log(
            "--------------------------------"
        );


        const jasa2Done =
            WorkOrderJasaService.changeStatus(

                completionGateFixture.jasa2Id,

                WorkOrderJasaStatus.DONE

            );


        Logger.log(
            jasa2Done
        );


        if(
            !jasa2Done ||
            !jasa2Done.success ||
            jasa2Done.status !==
                WorkOrderJasaStatus.DONE
        ){

            throw new Error(
                "Jasa #2 gagal menjadi DONE."
            );

        }


        /**
         * ========================================
         * 8. COMPLETION GATE SUCCESS
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 8: COMPLETION GATE SUCCESS"
        );

        Logger.log(
            "--------------------------------"
        );


        const successCompletion =
            WorkOrderStatusService.canComplete(

                completionGateFixture.workOrderId

            );


        Logger.log(
            "COMPLETION RESULT:"
        );

        Logger.log(
            successCompletion
        );


        if(
            !successCompletion ||
            successCompletion.canComplete !== true
        ){

            throw new Error(
                "Completion Gate seharusnya TRUE."
            );

        }


        if(
            !successCompletion.jasa ||
            successCompletion.jasa.total !== 2 ||
            successCompletion.jasa.selesai !== 2 ||
            successCompletion.jasa.belumSelesai !== 0
        ){

            throw new Error(
                "Data Completion Gate SUCCESS tidak sesuai."
            );

        }


        Logger.log(
            "COMPLETION SUCCESS PASS"
        );


        /**
         * ========================================
         * 9. CREATE JASA #3
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 9: CREATE JASA #3"
        );

        Logger.log(
            "--------------------------------"
        );


        const jasa3 =
            WorkOrderJasaService.create({

                workOrderId :
                    completionGateFixture.workOrderId,

                jasaId :
                    "JAS000003",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "Completion Gate Failure Jasa 3",

                diagnosa :
                    "Jasa belum selesai",

                catatan :
                    "Completion Gate Failure Integration Test"

            });


        Logger.log(
            "JASA #3 RESULT:"
        );

        Logger.log(
            jasa3
        );


        if(
            !jasa3 ||
            !jasa3.workOrderJasaId
        ){

            throw new Error(
                "Gagal membuat Jasa #3 fixture."
            );

        }


        completionGateFixture.jasa3Id =
            jasa3.workOrderJasaId;


        /**
         * ========================================
         * 10. JASA #3 → PROGRESS
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 10: JASA #3 OPEN → PROGRESS"
        );

        Logger.log(
            "--------------------------------"
        );


        const jasa3Progress =
            WorkOrderJasaService.changeStatus(

                completionGateFixture.jasa3Id,

                WorkOrderJasaStatus.PROGRESS

            );


        Logger.log(
            jasa3Progress
        );


        if(
            !jasa3Progress ||
            !jasa3Progress.success ||
            jasa3Progress.status !==
                WorkOrderJasaStatus.PROGRESS
        ){

            throw new Error(
                "Jasa #3 gagal masuk PROGRESS."
            );

        }


        /**
         * ========================================
         * 11. COMPLETION GATE FAILURE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 11: COMPLETION GATE FAILURE"
        );

        Logger.log(
            "--------------------------------"
        );


        const failureCompletion =
            WorkOrderStatusService.canComplete(

                completionGateFixture.workOrderId

            );


        Logger.log(
            "COMPLETION RESULT:"
        );

        Logger.log(
            failureCompletion
        );


        if(
            !failureCompletion ||
            failureCompletion.canComplete !== false
        ){

            throw new Error(
                "Completion Gate seharusnya FALSE."
            );

        }


        if(
            !failureCompletion.jasa ||
            failureCompletion.jasa.total !== 3 ||
            failureCompletion.jasa.selesai !== 2 ||
            failureCompletion.jasa.belumSelesai !== 1
        ){

            throw new Error(
                "Data Completion Gate FAILURE tidak sesuai."
            );

        }


        Logger.log(
            "COMPLETION FAILURE PASS"
        );


        /**
         * ========================================
         * 12. CLEANUP
         * ========================================
         *
         * Jasa #3 masih PROGRESS.
         *
         * Ubah menjadi CANCEL agar fixture
         * tidak meninggalkan pekerjaan aktif.
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 12: CLEANUP"
        );

        Logger.log(
            "--------------------------------"
        );


        const cleanupResult =
            WorkOrderJasaService.changeStatus(

                completionGateFixture.jasa3Id,

                WorkOrderJasaStatus.CANCEL

            );


        Logger.log(
            "CLEANUP RESULT:"
        );

        Logger.log(
            cleanupResult
        );


        if(
            !cleanupResult ||
            !cleanupResult.success ||
            cleanupResult.status !==
                WorkOrderJasaStatus.CANCEL
        ){

            throw new Error(
                "Cleanup Jasa #3 gagal."
            );

        }


        Logger.log(
            "CLEANUP PASS"
        );


        /**
         * ========================================
         * FINAL
         * ========================================
         */

        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER JASA COMPLETION GATE"
        );

        Logger.log(
            "DETERMINISTIC INTEGRATION TEST PASS"
        );

        Logger.log(
            "================================"
        );


    } finally {

        /**
         * ========================================
         * RESET LOCAL FIXTURE STATE
         * ========================================
         */

        completionGateFixture = {

            workOrderId :
                "",

            jasa1Id :
                "",

            jasa2Id :
                "",

            jasa3Id :
                ""

        };

    }

}