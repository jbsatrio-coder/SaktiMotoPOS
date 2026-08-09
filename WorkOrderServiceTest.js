function testServiceCreateWorkOrder(){

    Logger.log(

        WorkOrderService.create({

            jenisTransaksi :
                WorkOrderType.SERVICE,

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                15250,

            prioritas :
                WorkOrderPriority.NORMAL,

            estimasiSelesai :
                "",

            admin :
                "Admin",

            catatan :
                "Test service"

        })

    );

}


function testServiceCreatePartOnlyWorkOrder(){

    Logger.log(

        WorkOrderService.create({

            jenisTransaksi :
                WorkOrderType.PART_ONLY,

            customerId :
                "",

            vehicleId :
                "",

            kilometerMasuk :
                0,

            prioritas :
                WorkOrderPriority.NORMAL,

            estimasiSelesai :
                "",

            admin :
                "Admin",

            catatan :
                "Pembelian spare part walk-in"

        })

    );

}