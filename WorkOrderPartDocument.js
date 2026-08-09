/**
 * ============================================
 * Work Order Part Document
 * Version : 2.0.0
 * ============================================
 */

const WorkOrderPartDocument = {

    create(payload){

        if(!payload){

            throw new Error(
                "Payload WorkOrderPart wajib diisi."
            );

        }


        const qty =
            Number(
                payload.qty || 0
            );


        const harga =
            Number(
                payload.harga || 0
            );


        const diskon =
            Number(
                payload.diskon || 0
            );


        if(qty <= 0){

            throw new Error(
                "Qty WorkOrderPart harus lebih besar dari 0."
            );

        }


        if(harga < 0){

            throw new Error(
                "Harga WorkOrderPart tidak boleh negatif."
            );

        }


        if(diskon < 0){

            throw new Error(
                "Diskon WorkOrderPart tidak boleh negatif."
            );

        }


        const total =
            (qty * harga) - diskon;


        if(total < 0){

            throw new Error(
                "Total WorkOrderPart tidak boleh negatif."
            );

        }


        return {

            workOrderPart : {

                id :
                    payload.id || "",


                workOrderId :
                    payload.workOrderId || "",


                workOrderJasaId :
                    payload.workOrderJasaId || "",


                barangId :
                    payload.barangId || "",


                namaBarangSnapshot :
                    payload.namaBarangSnapshot || "",


                qty :
                    qty,


                harga :
                    harga,


                diskon :
                    diskon,


                status :
                    payload.status || "AKTIF",


                catatan :
                    payload.catatan || "",


                createdAt :
                    payload.createdAt || new Date(),


                updatedAt :
                    payload.updatedAt || "",


                total :
                    total

            }

        };

    }

};