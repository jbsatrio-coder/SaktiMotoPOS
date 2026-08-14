/**
 * ============================================
 * Work Order Document
 * Version : 1.2.0
 * ============================================
 */

const WorkOrderDocument = {

    create(payload){

        return {

            workOrder : {

                id :
                    payload.id || "",

                jenisTransaksi :
                    payload.jenisTransaksi ||

                    WorkOrderType.SERVICE,

                tanggal :
                    payload.tanggal ||

                    new Date(),

                customerId :
                    payload.customerId || "",

                customerNameSnapshot :
                    payload.customerNameSnapshot || "",

                vehicleId :
                    payload.vehicleId || "",

                noPolisiSnapshot :
                    payload.noPolisiSnapshot || "",

                merkSnapshot :
                    payload.merkSnapshot || "",

                modelSnapshot :
                    payload.modelSnapshot || "",

                kilometerMasuk :
                    Number(
                        payload.kilometerMasuk || 0
                    ),

                status :
                    payload.status ||

                    WorkOrderStatus.DRAFT,

                prioritas :
                    payload.prioritas ||

                    WorkOrderPriority.NORMAL,

                estimasiSelesai :
                    payload.estimasiSelesai || "",

                admin :
                    payload.admin || "",

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