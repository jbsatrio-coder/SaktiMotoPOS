function testServiceCreateWorkOrder() {

    Logger.log(

        WorkOrderService.create({

            customerId : "CUS999999",

           vehicleId : "VEH2608060003",

            kilometerMasuk : 15250,

            prioritas : "NORMAL",

            admin : "Admin",

            catatan : "Service berkala"

        })

    );

}