/**
 * ============================================
 * Vehicle Document
 * Version : 2.0.0
 *
 * Reference:
 *   merkId  -> MasterMerk
 *   modelId -> MasterModel
 *
 * Snapshot / display:
 *   merk
 *   model
 *
 * Merk dan Model tetap dipertahankan untuk
 * backward compatibility dan WorkOrder snapshot.
 * ============================================
 */

const VehicleDocument = {

    create(payload){

        payload = payload || {};

        return {

            vehicle : {

                id :
                    payload.id || "",

                customerId :
                    payload.customerId || "",

                noPolisi :
                    payload.noPolisi || "",

                /*
                 * ========================================
                 * MASTER REFERENCE
                 * ========================================
                 */

                merkId :
                    payload.merkId || "",

                modelId :
                    payload.modelId || "",

                /*
                 * ========================================
                 * SNAPSHOT / DISPLAY
                 *
                 * Tetap dipertahankan untuk compatibility.
                 * ========================================
                 */

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
