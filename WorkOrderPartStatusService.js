/**
 * ============================================
 * Work Order Part Status Service
 * Version : 1.0.0
 * ============================================
 *
 * Mengatur perpindahan status Work Order Part.
 *
 * Service ini:
 * - Tidak mengubah database
 * - Tidak menyimpan Work Order Part
 * - Hanya menentukan apakah perpindahan
 *   status diperbolehkan
 * ============================================
 */

const WorkOrderPartStatusService = {

    /**
     * ========================================
     * Validasi Status
     * ========================================
     */

    isValidStatus(status){

        return Object.values(
            WorkOrderPartStatus
        ).includes(
            status
        );

    },


    /**
     * ========================================
     * Validasi Transition
     * ========================================
     */

    canTransition(
        currentStatus,
        nextStatus
    ){

        /**
         * ================================
         * VALIDASI STATUS
         * ================================
         */

        if(
            !this.isValidStatus(
                currentStatus
            )
        ){

            return false;

        }


        if(
            !this.isValidStatus(
                nextStatus
            )
        ){

            return false;

        }


        /**
         * ================================
         * STATUS YANG SAMA
         * ================================
         */

        if(
            currentStatus ===
            nextStatus
        ){

            return true;

        }


        /**
         * ================================
         * TRANSITION MAP
         * ================================
         */

        const transitions = {

            [WorkOrderPartStatus.OPEN] : [

                WorkOrderPartStatus.PROGRESS,

                WorkOrderPartStatus.CANCEL

            ],


            [WorkOrderPartStatus.PROGRESS] : [

                 WorkOrderPartStatus.DONE,

                 WorkOrderPartStatus.CANCEL

            ],


            [WorkOrderPartStatus.DONE] : [],


            [WorkOrderPartStatus.CANCEL] : []

        };


        /**
         * ================================
         * CEK TRANSITION
         * ================================
         */

        const allowedTransitions =
            transitions[
                currentStatus
            ] || [];


        return allowedTransitions.includes(
            nextStatus
        );

    },


    /**
     * ========================================
     * Validate Transition
     * ========================================
     */

    validateTransition(
        currentStatus,
        nextStatus
    ){

        /**
         * ================================
         * VALIDASI STATUS SAAT INI
         * ================================
         */

        if(
            !this.isValidStatus(
                currentStatus
            )
        ){

            throw new Error(
                "Status Work Order Part saat ini tidak valid: " +
                currentStatus
            );

        }


        /**
         * ================================
         * VALIDASI STATUS TUJUAN
         * ================================
         */

        if(
            !this.isValidStatus(
                nextStatus
            )
        ){

            throw new Error(
                "Status Work Order Part tujuan tidak valid: " +
                nextStatus
            );

        }


        /**
         * ================================
         * VALIDASI TRANSITION
         * ========================================
         */

        if(
            !this.canTransition(
                currentStatus,
                nextStatus
            )
        ){

            throw new Error(
                "Perubahan status Work Order Part tidak diperbolehkan: " +
                currentStatus +
                " -> " +
                nextStatus
            );

        }


        return true;

    }

};