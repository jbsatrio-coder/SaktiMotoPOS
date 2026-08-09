function testWorkOrderPartColumnMap(){

    Logger.log(
        JSON.stringify(
            COL_WORK_ORDER_PART,
            null,
            2
        )
    );

}

function testFindAllWorkOrderPart(){

    Logger.log(

        WorkOrderPartRepository.findAll()

    );

}

function testWorkOrderPartSheet(){

    Logger.log(
        "CONFIG = " +
        CONFIG.SHEET.WORK_ORDER_PART
    );

    const sh = getSheet_(
        CONFIG.SHEET.WORK_ORDER_PART
    );

    Logger.log(
        "SHEET = " +
        sh
    );

    if(sh){

        Logger.log(
            "NAME = " +
            sh.getName()
        );

        Logger.log(
            "LAST ROW = " +
            sh.getLastRow()
        );

    }

}

function testFindRowWorkOrderPart(){

    Logger.log(

        WorkOrderPartRepository.findRowById(
            "WOP000001"
        )

    );

}

function testExistsWorkOrderPart(){

    Logger.log(

        WorkOrderPartRepository.exists(
            "WOP000001"
        )

    );

}

function testFindByIdWorkOrderPart(){

    Logger.log(

        WorkOrderPartRepository.findById(
            "WOP000001"
        )

    );

}

function testFindByWorkOrderId(){

    Logger.log(

        WorkOrderPartRepository.findByWorkOrderId(
            "WO2608090001"
        )

    );

}

function testFindByWorkOrderJasaId(){

    Logger.log(

        WorkOrderPartRepository.findByWorkOrderJasaId(
            "WOJ2608090001"
        )

    );

}

function testSaveWorkOrderPart(){

    const result =

        WorkOrderPartRepository.save({

            id :
                "WOP000001",

            workOrderId :
                "WO2608090002",

            workOrderJasaId :
                "WOJ2608090001",

            barangId :
                "BRG000001",

            kodeBarang :
                "BRG-001",

            namaBarangSnapshot :
                "Oli Mesin",

            qty :
                2,

            harga :
                55000,

            diskon :
                5000,

            status :
                "AKTIF",

            catatan :
                "Test Repository",

            createdAt :
                new Date(),

            updatedAt :
                ""

        });

    Logger.log(result);

}

function testFindSavedWorkOrderPart(){

    Logger.log(

        WorkOrderPartRepository.findById(
            "WOP000001"
        )

    );

}

function testFindSavedWorkOrderPartByWO(){

    Logger.log(

        WorkOrderPartRepository.findByWorkOrderId(
            "WO2608090002"
        )

    );

}

function testFindSavedWorkOrderPartByWOJasa(){

    Logger.log(

        WorkOrderPartRepository.findByWorkOrderJasaId(
            "WOJ2608090001"
        )

    );

}

function testExistsSavedWorkOrderPart(){

    Logger.log(

        WorkOrderPartRepository.exists(
            "WOP000001"
        )

    );

}

function testDuplicateWorkOrderPart(){

    try{

        WorkOrderPartRepository.save({

            id : "WOP000001",

            workOrderId :
                "WO2608090002",

            workOrderJasaId :
                "WOJ2608090001",

            barangId :
                "BRG000001",

            kodeBarang :
                "BRG-001",

            namaBarangSnapshot :
                "Oli Mesin",

            qty : 2,

            harga : 55000,

            diskon : 5000,

            status : "AKTIF",

            catatan : "Duplicate Test",

            createdAt : new Date(),

            updatedAt : ""

        });

    }catch(error){

        Logger.log(
            "EXPECTED ERROR : " +
            error.message
        );

    }

}

function testFindAllWorkOrderPartV201(){

    const data =
        WorkOrderPartRepository.findAll();

    Logger.log(
        "Jumlah kolom row pertama : " +
        (data.length > 0
            ? data[0].length
            : 0)
    );

    Logger.log(data);

}

function testFindByIdWorkOrderPartV201(){

    Logger.log(

        WorkOrderPartRepository.findById(
            "WOP000001"
        )

    );

}

function testWorkOrderPartReadBack(){

    const result =
        WorkOrderPartRepository.findById(
            "WOP000002"
        );

    Logger.log(
        "READ BACK:"
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testWorkOrderPartExists(){

    Logger.log(
        "EXISTS WOP000002:"
    );

    Logger.log(
        WorkOrderPartRepository.exists(
            "WOP000002"
        )
    );


    Logger.log(
        "EXISTS WOP999999:"
    );

    Logger.log(
        WorkOrderPartRepository.exists(
            "WOP999999"
        )
    );

}

function testFindWorkOrderPartByWorkOrderId(){

    const result =
        WorkOrderPartRepository.findByWorkOrderId(
            "WO2608090002"
        );

    Logger.log(
        "PART BY WORK ORDER:"
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testFindWorkOrderPartByWorkOrderJasaId(){

    const result =
        WorkOrderPartRepository.findByWorkOrderJasaId(
            "WOJ2608090001"
        );

    Logger.log(
        "PART BY WORK ORDER JASA:"
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}