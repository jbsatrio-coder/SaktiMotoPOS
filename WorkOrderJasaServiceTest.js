function testLoadWorkOrder(){

    Logger.log(

        WorkOrderJasaService.loadWorkOrder({

            workOrderId : "WO2608070001"

        })

    );

}

function testLoadJasa(){

    Logger.log(

        WorkOrderJasaService.loadJasa({

            jasaId : "JAS000001"

        })

    );

}

function testServiceCreateWorkOrderJasa(){

    Logger.log(

        WorkOrderJasaService.create({

            workOrderId : "WO2608070001",

            jasaId : "000001",

            qty : 2,

            diskon : 5000,

            mekanikId : "",

            keluhan : "Service berkala",

            diagnosa : "Oli sudah waktunya diganti",

            catatan : "Test"

        })

    );

}