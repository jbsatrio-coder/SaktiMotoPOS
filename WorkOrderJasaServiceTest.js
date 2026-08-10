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

      jasaId : "JAS000002",

      qty : 1,

      diskon : 0,

      mekanikId : "",

      keluhan : "Test create jasa",

      diagnosa : "Test diagnosis",

      catatan : "Unit test WorkOrderJasa"

    })
  );

}

function testJasaFindAll(){

    Logger.log(
        JasaRepository.findAll()
    );

}

function testLoadCreatedWorkOrderJasa(){

  Logger.log(
    WorkOrderJasaRepository.findRowById(
      "WOJ2608100001"
    )
  );

}

function testDuplicateWorkOrderJasa(){

  try {

    Logger.log(
      WorkOrderJasaService.create({

        workOrderId : "WO2608070001",

        jasaId : "JAS000002",

        qty : 1,

        diskon : 0,

        mekanikId : "",

        keluhan : "Duplicate test",

        diagnosa : "Duplicate test",

        catatan : "Should be rejected"

      })
    );

    Logger.log("ERROR: DUPLICATE TIDAK DITOLAK");

  } catch (error) {

    Logger.log("EXPECTED ERROR:");
    Logger.log(error.message);

    Logger.log(
      "DUPLICATE ERROR DETECTED: " +
      error.message.includes("Jasa sudah ada pada Work Order")
    );

  }

}