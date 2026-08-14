/**
 * ============================================
 * Work Order Part Status Service Test
 * Version : 1.0.0
 * ============================================
 */

function testWorkOrderPartStatusService(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART STATUS SERVICE TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * VALID STATUS
     * ========================================
     */

    Logger.log(
        "VALID STATUS TEST"
    );


    Logger.log(
        "OPEN:"
    );

    Logger.log(
        WorkOrderPartStatusService.isValidStatus(
            WorkOrderPartStatus.OPEN
        )
    );


    Logger.log(
        "PROGRESS:"
    );

    Logger.log(
        WorkOrderPartStatusService.isValidStatus(
            WorkOrderPartStatus.PROGRESS
        )
    );


    Logger.log(
        "DONE:"
    );

    Logger.log(
        WorkOrderPartStatusService.isValidStatus(
            WorkOrderPartStatus.DONE
        )
    );


    Logger.log(
        "CANCEL:"
    );

    Logger.log(
        WorkOrderPartStatusService.isValidStatus(
            WorkOrderPartStatus.CANCEL
        )
    );


    Logger.log(
        "INVALID:"
    );

    Logger.log(
        WorkOrderPartStatusService.isValidStatus(
            "INVALID"
        )
    );


    /**
     * ========================================
     * ALLOWED TRANSITIONS
     * ========================================
     */

    Logger.log(
        "ALLOWED TRANSITION TEST"
    );


    Logger.log(
        "OPEN -> PROGRESS:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.OPEN,
            WorkOrderPartStatus.PROGRESS
        )
    );


    Logger.log(
        "OPEN -> CANCEL:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.OPEN,
            WorkOrderPartStatus.CANCEL
        )
    );


    Logger.log(
        "PROGRESS -> DONE:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.PROGRESS,
            WorkOrderPartStatus.DONE
        )
    );


    /**
     * ========================================
     * BLOCKED TRANSITIONS
     * ========================================
     */

    Logger.log(
        "BLOCKED TRANSITION TEST"
    );


    Logger.log(
        "PROGRESS -> CANCEL:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.PROGRESS,
            WorkOrderPartStatus.CANCEL
        )
    );


    Logger.log(
        "PROGRESS -> OPEN:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.PROGRESS,
            WorkOrderPartStatus.OPEN
        )
    );


    Logger.log(
        "DONE -> OPEN:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.DONE,
            WorkOrderPartStatus.OPEN
        )
    );


    Logger.log(
        "DONE -> PROGRESS:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.DONE,
            WorkOrderPartStatus.PROGRESS
        )
    );


    Logger.log(
        "CANCEL -> OPEN:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.CANCEL,
            WorkOrderPartStatus.OPEN
        )
    );


    Logger.log(
        "CANCEL -> PROGRESS:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.CANCEL,
            WorkOrderPartStatus.PROGRESS
        )
    );


    /**
     * ========================================
     * SAME STATUS
     * ========================================
     */

    Logger.log(
        "SAME STATUS TEST"
    );


    Logger.log(
        "OPEN -> OPEN:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.OPEN,
            WorkOrderPartStatus.OPEN
        )
    );


    Logger.log(
        "PROGRESS -> PROGRESS:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.PROGRESS,
            WorkOrderPartStatus.PROGRESS
        )
    );


    Logger.log(
        "DONE -> DONE:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.DONE,
            WorkOrderPartStatus.DONE
        )
    );


    Logger.log(
        "CANCEL -> CANCEL:"
    );

    Logger.log(
        WorkOrderPartStatusService.canTransition(
            WorkOrderPartStatus.CANCEL,
            WorkOrderPartStatus.CANCEL
        )
    );


    /**
     * ========================================
     * VALIDATE TRANSITION
     * ========================================
     */

    Logger.log(
        "VALIDATE TRANSITION TEST"
    );


    try{

        WorkOrderPartStatusService.validateTransition(
            WorkOrderPartStatus.OPEN,
            WorkOrderPartStatus.PROGRESS
        );

        Logger.log(
            "OPEN -> PROGRESS VALIDATION: PASS"
        );

    }catch(error){

        Logger.log(
            "UNEXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * INVALID TRANSITION
     * ========================================
     */

    try{

        WorkOrderPartStatusService.validateTransition(
            WorkOrderPartStatus.PROGRESS,
            WorkOrderPartStatus.CANCEL
        );

        Logger.log(
            "ERROR: PROGRESS -> CANCEL SHOULD FAIL"
        );

    }catch(error){

        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

        Logger.log(
            "PROGRESS -> CANCEL ERROR DETECTED:"
        );

        Logger.log(
            error.message ===
            "Perubahan status Work Order Part tidak diperbolehkan: PROGRESS -> CANCEL"
        );

    }


    /**
     * ========================================
     * INVALID CURRENT STATUS
     * ========================================
     */

    try{

        WorkOrderPartStatusService.validateTransition(
            "INVALID",
            WorkOrderPartStatus.OPEN
        );

        Logger.log(
            "ERROR: INVALID CURRENT STATUS SHOULD FAIL"
        );

    }catch(error){

        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

        Logger.log(
            "INVALID CURRENT STATUS ERROR DETECTED:"
        );

        Logger.log(
            error.message ===
            "Status Work Order Part saat ini tidak valid: INVALID"
        );

    }


    /**
     * ========================================
     * INVALID NEXT STATUS
     * ========================================
     */

    try{

        WorkOrderPartStatusService.validateTransition(
            WorkOrderPartStatus.OPEN,
            "INVALID"
        );

        Logger.log(
            "ERROR: INVALID NEXT STATUS SHOULD FAIL"
        );

    }catch(error){

        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

        Logger.log(
            "INVALID NEXT STATUS ERROR DETECTED:"
        );

        Logger.log(
            error.message ===
            "Status Work Order Part tujuan tidak valid: INVALID"
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PART STATUS SERVICE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}