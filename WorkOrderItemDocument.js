/**
 * ============================================
 * Work Order Item Document
 * Version : 1.0.0
 * ============================================
 */

const WorkOrderItemDocument = {

    create(payload){

        return {

            workOrderItem : {

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

                namaJasa :

                    payload.namaJasa || "",

                keluhan :

                    payload.keluhan || "",

                diagnosa :

                    payload.diagnosa || "",

                mekanikId :

                    payload.mekanikId || "",

                mekanikName :

                    payload.mekanikName || "",

                qty :

                    Number(
                        payload.qty || 1
                    ),

                harga :

                    Number(
                        payload.harga || 0
                    ),

                diskon :

                    Number(
                        payload.diskon || 0
                    ),

                subtotal :

                    Number(
                        payload.subtotal || 0
                    ),

                status :

                    payload.status ||

                    "OPEN",

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