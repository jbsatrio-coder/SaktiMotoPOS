/**
 * ============================================
 * Work Order Status Service
 * Version : 1.0.0
 * ============================================
 *
 * Mengatur perpindahan status Work Order.
 *
 * Service ini:
 * - Tidak mengubah database
 * - Tidak menyimpan Work Order
 * - Hanya menentukan apakah perpindahan
 *   status diperbolehkan
 * ============================================
 */

const WorkOrderStatusService = {

    /**
     * ========================================
     * Validasi Status
     * ========================================
     */
    isValidStatus(status){

        return Object.values(
            WorkOrderStatus
        ).includes(
            status
        );

    },


    /**
     * ========================================
     * Mendapatkan Status Berikutnya
     * ========================================
     *
     * Return:
     * true  = transition diperbolehkan
     * false = transition tidak diperbolehkan
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

            [WorkOrderStatus.DRAFT] : [

                WorkOrderStatus.MENUNGGU_DIAGNOSA,

                WorkOrderStatus.DIBATALKAN

            ],


            [WorkOrderStatus.MENUNGGU_DIAGNOSA] : [

                WorkOrderStatus.MENUNGGU_APPROVAL,

                WorkOrderStatus.DIBATALKAN

            ],


            [WorkOrderStatus.MENUNGGU_APPROVAL] : [

                WorkOrderStatus.DALAM_PENGERJAAN,

                WorkOrderStatus.DIBATALKAN

            ],


            [WorkOrderStatus.DALAM_PENGERJAAN] : [

                WorkOrderStatus.MENUNGGU_SPAREPART,

                WorkOrderStatus.SELESAI,

                WorkOrderStatus.DIBATALKAN

            ],


            [WorkOrderStatus.MENUNGGU_SPAREPART] : [

                WorkOrderStatus.DALAM_PENGERJAAN,

                WorkOrderStatus.DIBATALKAN

            ],


            [WorkOrderStatus.SELESAI] : [

                WorkOrderStatus.SUDAH_DIAMBIL

            ],


            [WorkOrderStatus.SUDAH_DIAMBIL] : [],


            [WorkOrderStatus.DIBATALKAN] : []

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
     * Validasi Transition
     * ========================================
     *
     * Sama seperti canTransition(),
     * tetapi menghasilkan Error jika
     * transition tidak diperbolehkan.
     * ========================================
     */
    validateTransition(
        currentStatus,
        nextStatus
    ){

        if(
            !this.isValidStatus(
                currentStatus
            )
        ){

            throw new Error(
                "Status Work Order saat ini tidak valid: " +
                currentStatus
            );

        }


        if(
            !this.isValidStatus(
                nextStatus
            )
        ){

            throw new Error(
                "Status Work Order tujuan tidak valid: " +
                nextStatus
            );

        }


        if(
            !this.canTransition(
                currentStatus,
                nextStatus
            )
        ){

            throw new Error(
                "Perubahan status Work Order tidak diperbolehkan: " +
                currentStatus +
                " -> " +
                nextStatus
            );

        }


        return true;

    }

};