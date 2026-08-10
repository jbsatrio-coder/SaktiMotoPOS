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

    },

    /**
 * ============================================
 * Validate Work Order Completion
 * Version : 1.0.0
 *
 * Memastikan seluruh pekerjaan pada WO
 * sudah terpenuhi sebelum status menjadi SELESAI.
 *
 * Rule:
 *
 * 1. Work Order harus ada
 * 2. Harus ada minimal satu Jasa atau Part
 * 3. Jasa:
 *      DONE / CANCEL = terpenuhi
 *      OPEN / PROGRESS = belum selesai
 *
 * 4. Part:
 *      hanya PART AKTIF yang diperiksa
 *      Stock Ledger harus ada
 *      Barang ID harus cocok
 *      Total Qty Stock Out harus sesuai Qty WOP
 *
 * TIDAK mengubah data.
 * ============================================
 */
canComplete(workOrderId){

    /**
     * ========================================
     * VALIDASI INPUT
     * ========================================
     */

    if(!workOrderId){

        throw new Error(
            "Work Order ID wajib diisi."
        );

    }


    /**
     * ========================================
     * CEK WORK ORDER
     * ========================================
     */

    const workOrder =
        WorkOrderRepository.findById(
            workOrderId
        );


    if(!workOrder){

        throw new Error(
            "Work Order tidak ditemukan : " +
            workOrderId
        );

    }


    /**
     * ========================================
     * AMBIL JASA
     * ========================================
     */

    const workOrderJasa =
        WorkOrderJasaRepository
            .findByWorkOrderId(
                workOrderId
            );


    /**
     * ========================================
     * AMBIL PART
     * ========================================
     */

    const workOrderParts =
        WorkOrderPartRepository
            .findByWorkOrderId(
                workOrderId
            );


    /**
     * ========================================
     * FILTER PART AKTIF
     * ========================================
     */

    const activeParts = [];


    for(
        let i = 0;
        i < workOrderParts.length;
        i++
    ){

        const part =
            workOrderParts[i];


        const status =
            part[
                COL_WORK_ORDER_PART.STATUS
            ];


        if(
            status &&
            status !== "AKTIF"
        ){

            continue;

        }


        activeParts.push(
            part
        );

    }


    /**
     * ========================================
     * MINIMAL HARUS ADA PEKERJAAN
     * ========================================
     */

    if(
        workOrderJasa.length === 0 &&
        activeParts.length === 0
    ){

        return {

            canComplete :
                false,

            workOrderId :
                workOrderId,

            reason :
                "Work Order belum memiliki jasa atau sparepart.",

            jasa : {

                total :
                    0,

                selesai :
                    0,

                belumSelesai :
                    0

            },

            parts : {

                total :
                    0,

                terpenuhi :
                    0,

                belumTerpenuhi :
                    0

            }

        };

    }


    /**
     * ========================================
     * VALIDASI JASA
     * ========================================
     */

    let jasaSelesai = 0;

    let jasaBelumSelesai = 0;

    const jasaDetails = [];


    for(
        let i = 0;
        i < workOrderJasa.length;
        i++
    ){

        const jasa =
            workOrderJasa[i];


        const status =
            String(
                jasa[
                    COL_WO_JASA.STATUS
                ] || ""
            ).trim();


        const selesai =
            status ===
                WorkOrderJasaStatus.DONE

            ||

            status ===
                WorkOrderJasaStatus.CANCEL;


        if(selesai){

            jasaSelesai++;

        }
        else{

            jasaBelumSelesai++;

        }


        jasaDetails.push({

            workOrderJasaId :
                jasa[
                    COL_WO_JASA.ID
                ],

            status :
                status,

            selesai :
                selesai

        });

    }


    /**
     * ========================================
     * VALIDASI PART
     * ========================================
     */

    let partTerpenuhi = 0;

    let partBelumTerpenuhi = 0;

    const partDetails = [];


    for(
        let i = 0;
        i < activeParts.length;
        i++
    ){

        const part =
            activeParts[i];


        const workOrderPartId =
            part[
                COL_WORK_ORDER_PART.ID
            ];


        const barangId =
            String(
                part[
                    COL_WORK_ORDER_PART.BARANG_ID
                ] || ""
            ).trim();


        const qtyWOP =
            Number(
                part[
                    COL_WORK_ORDER_PART.QTY
                ]
            ) || 0;


        /**
         * ====================================
         * CARI LEDGER BERDASARKAN WOP ID
         * ====================================
         */

        const ledgers =
            StockLedgerRepository
                .findByReferensi(
                    workOrderPartId
                );


        let qtyLedger = 0;

        let barangMatch = true;


        /**
         * ====================================
         * VALIDASI SETIAP LEDGER
         * ====================================
         */

        for(
            let j = 0;
            j < ledgers.length;
            j++
        ){

            const ledger =
                ledgers[j];


            const ledgerBarangId =
                String(
                    ledger[
                        COL_STOK.BARANG_ID
                    ] || ""
                ).trim();


            if(
                ledgerBarangId !==
                barangId
            ){

                barangMatch = false;

            }


            qtyLedger +=
                Number(
                    ledger[
                        COL_STOK.QTYKELUAR
                    ]
                ) || 0;

        }


        const qtyMatch =
            qtyLedger ===
            qtyWOP;


        const valid =
            ledgers.length > 0 &&
            barangMatch &&
            qtyMatch;


        if(valid){

            partTerpenuhi++;

        }
        else{

            partBelumTerpenuhi++;

        }


        partDetails.push({

            workOrderPartId :
                workOrderPartId,

            barangId :
                barangId,

            qtyWOP :
                qtyWOP,

            ledgerCount :
                ledgers.length,

            qtyLedger :
                qtyLedger,

            barangMatch :
                barangMatch,

            qtyMatch :
                qtyMatch,

            valid :
                valid

        });

    }


    /**
     * ========================================
     * HASIL AKHIR
     * ========================================
     */

    const canComplete =
        jasaBelumSelesai === 0 &&
        partBelumTerpenuhi === 0;


    let reason = "";


    if(!canComplete){

        const reasons = [];


        if(
            jasaBelumSelesai > 0
        ){

            reasons.push(
                "Masih ada " +
                jasaBelumSelesai +
                " jasa yang belum selesai."
            );

        }


        if(
            partBelumTerpenuhi > 0
        ){

            reasons.push(
                "Masih ada " +
                partBelumTerpenuhi +
                " sparepart yang belum terpenuhi."
            );

        }


        reason =
            reasons.join(" ");

    }


    return {

        canComplete :
            canComplete,

        workOrderId :
            workOrderId,

        reason :
            reason,

        jasa : {

            total :
                workOrderJasa.length,

            selesai :
                jasaSelesai,

            belumSelesai :
                jasaBelumSelesai,

            details :
                jasaDetails

        },

        parts : {

            total :
                activeParts.length,

            terpenuhi :
                partTerpenuhi,

            belumTerpenuhi :
                partBelumTerpenuhi,

            details :
                partDetails

        }

    };

},

};