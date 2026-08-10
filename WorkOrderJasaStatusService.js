/**
 * ============================================
 * Work Order Jasa Status Service
 * Version : 1.0.0
 * ============================================
 *
 * Mengatur perpindahan status Work Order Jasa.
 *
 * Service ini:
 * - Tidak mengubah database
 * - Tidak menyimpan Work Order Jasa
 * - Hanya menentukan apakah perpindahan
 *   status diperbolehkan
 * ============================================
 */

const WorkOrderJasaStatusService = {

    /**
     * ========================================
     * Validasi Status
     * ========================================
     */

    isValidStatus(status){

        return Object.values(
            WorkOrderJasaStatus
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

            [WorkOrderJasaStatus.OPEN] : [

                WorkOrderJasaStatus.PROGRESS,

                WorkOrderJasaStatus.CANCEL

            ],


            [WorkOrderJasaStatus.PROGRESS] : [

                WorkOrderJasaStatus.DONE,

                WorkOrderJasaStatus.CANCEL

            ],


            [WorkOrderJasaStatus.DONE] : [],


            [WorkOrderJasaStatus.CANCEL] : []

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
                "Status Work Order Jasa saat ini tidak valid: " +
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
                "Status Work Order Jasa tujuan tidak valid: " +
                nextStatus
            );

        }


        /**
         * ================================
         * VALIDASI TRANSITION
         * ================================
         */

        if(
            !this.canTransition(
                currentStatus,
                nextStatus
            )
        ){

            throw new Error(
                "Perubahan status Work Order Jasa tidak diperbolehkan: " +
                currentStatus +
                " -> " +
                nextStatus
            );

        }


        return true;

    }

};