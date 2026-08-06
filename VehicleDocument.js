/**
 * ============================================
 * Vehicle Document
 * ============================================
 */

const VehicleDocument = {

    create(payload){

        return {

            vehicle : {

                id :

                    payload.id || "",

                customerId :

                    payload.customerId || "",

                noPolisi :

                    payload.noPolisi || "",

                merk :

                    payload.merk || "",

                model :

                    payload.model || "",

                tahun :

                    payload.tahun || "",

                warna :

                    payload.warna || "",

                noMesin :

                    payload.noMesin || "",

                noRangka :

                    payload.noRangka || "",

                lastKilometer :

                    payload.lastKilometer || 0,
                    
                status :

                    payload.status ||

                    VehicleStatus.AKTIF,

                catatan :

                    payload.catatan || "",

                createdAt :

                    payload.createdAt ||

                    new Date().toISOString(),

                updatedAt :

                    payload.updatedAt || ""

            }

        };

    }

};