function testWorkOrderJasaSheet(){

    Logger.log(

        WorkOrderJasaRepository
            .sheet()
            .getName()

    );

}

function testWorkOrderJasaFindAll(){

    Logger.log(

        WorkOrderJasaRepository
            .findAll()

    );

}

function testWorkOrderJasaFindRow(){

    Logger.log(

        WorkOrderJasaRepository
            .findRowById(
                "WOJ000001"
            )

    );

}

function testWorkOrderJasaExists(){

    Logger.log(

        WorkOrderJasaRepository
            .exists(
                "WOJ000001"
            )

    );

}

function testWorkOrderJasaFindById(){

    Logger.log(

        WorkOrderJasaRepository
            .findById(
                "WOJ000001"
            )

    );

}

function testSaveWorkOrderJasa(){

    const workOrderJasa =

        WorkOrderJasaDocument.create({

            id : "WOJ2608070001",

            workOrderId : "WO2608070001",

            urutan : 1,

            jasaId : "JAS000001",

            namaJasaSnapshot : "Ganti Oli",

            keluhan : "Service berkala",

            diagnosa : "Oli sudah waktunya diganti",

            mekanikId : "MEC000001",

            mekanikNameSnapshot : "Andi",

            qty : 2,

            harga : 85000,

            diskon : 5000,

            catatan : "Test"

        }).workOrderJasa;

    Logger.log(

        WorkOrderJasaRepository.save(

            workOrderJasa

        )

    );

}

function testFindWorkOrderJasaByWorkOrder(){

    Logger.log(

        WorkOrderJasaRepository

            .findByWorkOrderId(

                "WO2608070001"

            )

    );

}

function testCountWorkOrderJasa(){

    Logger.log(

        WorkOrderJasaRepository

            .countByWorkOrderId(

                "WO2608070001"

            )

    );

}
function testUpdateWorkOrderJasa(){

    const workOrderJasa =

        WorkOrderJasaDocument.create({

            id : "WOJ2608070001",

            workOrderId : "WO2608070001",

            urutan : 1,

            jasaId : "JAS000001",

            namaJasaSnapshot : "Ganti Oli Premium",

            keluhan : "Service berkala",

            diagnosa : "Oli diganti",

            mekanikId : "MEC000001",

            mekanikNameSnapshot : "Andi",

            qty : 2,

            harga : 90000,

            diskon : 10000,

            catatan : "Update"

        }).workOrderJasa;

    Logger.log(

        WorkOrderJasaRepository.update(

            workOrderJasa

        )

    );

}