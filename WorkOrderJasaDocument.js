/**
 * ============================================
 * Work Order Jasa Document
 * Version : 2.0.0
 * ============================================
 */

const WorkOrderJasaDocument = {

    create(payload){

        const qty = Number(
            payload.qty || 1
        );

        const harga = Number(
            payload.harga || 0
        );

        const diskon = Number(
            payload.diskon || 0
        );

        const subtotal = Math.max(

            0,

            (qty * harga) - diskon

        );

        return {

            workOrderJasa : {

                id :

                    payload.id || "",

                workOrderId :

                    payload.workOrderId || "",

                urutan :

                    Number(
                        payload.urutan || 1
                    ),

                jasaId :

                    payload.jasaId || "",

                namaJasaSnapshot :

                    payload.namaJasaSnapshot || "",

                keluhan :

                    payload.keluhan || "",

                diagnosa :

                    payload.diagnosa || "",

                mekanikId :

                    payload.mekanikId || "",

                mekanikNameSnapshot :

                    payload.mekanikNameSnapshot || "",

                qty :

                    qty,

                harga :

                    harga,

                diskon :

                    diskon,

                subtotal :

                    subtotal,

                status :

                    payload.status ||

                    WorkOrderJasaStatus.OPEN,

                catatan :

                    payload.catatan || "",

                createdAt :

                    payload.createdAt ||

                    new Date(),

                updatedAt :

                    payload.updatedAt || ""

            }

        };

    }

};