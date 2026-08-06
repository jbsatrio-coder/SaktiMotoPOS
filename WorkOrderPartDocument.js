/**
 * ============================================
 * Work Order Part Document
 * Version : 1.0.0
 * ============================================
 */

const WorkOrderPartDocument = {

    create(payload){

        return {

            workOrderPart : {

                id :

                    payload.id || "",

                workOrderItemId :

                    payload.workOrderItemId || "",

                barangId :

                    payload.barangId || "",

                kodeBarang :

                    payload.kodeBarang || "",

                namaBarangSnapshot :

                    payload.namaBarangSnapshot || "",

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

                status :

                    payload.status ||

                    "AKTIF",

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