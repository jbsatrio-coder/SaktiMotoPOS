function testCreateWorkOrderJasa(){

    const document =

        WorkOrderJasaDocument.create({

            id : "WOJ000001",

            workOrderId : "WO000001",

            jasaId : "JAS000001",

            namaJasaSnapshot : "Ganti Oli",

            mekanikId : "MEC000001",

            mekanikNameSnapshot : "Andi",

            qty : 2,

            harga : 85000,

            diskon : 5000,

            keluhan : "Service berkala",

            diagnosa : "Oli sudah waktunya diganti"

        });

    Logger.log(

        JSON.stringify(

            document,

            null,

            2

        )

    );

}

function testBuildWorkOrderJasa(){

    const workOrder =

    WorkOrderRepository.findById(

        "WO2608070001"

    );

Logger.log(workOrder);

const jasa =

    JasaRepository.findById(

        "000001"

    );

Logger.log(jasa);

const mekanik = null;

    Logger.log(

        JSON.stringify(

            WorkOrderJasaService

                .buildDocument(

                    {

                        workOrderId :

                            "WO2608070001",

                        qty : 2,

                        diskon : 5000,

                        keluhan :

                            "Service berkala",

                        diagnosa :

                            "Oli harus diganti"

                    },

                    workOrder,

                    jasa,

                    mekanik

                ),

            null,

            2

        )

    );

}