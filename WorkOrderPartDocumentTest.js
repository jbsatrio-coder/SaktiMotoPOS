function testCreateWorkOrderPartDocument(){

    Logger.log(

        JSON.stringify(

            WorkOrderPartDocument.create({

                id : "WOP000001",

                workOrderId : "WO2608070001",

                urutan : 1,

                barangId : "BRG000001",

                namaBarangSnapshot : "Oli Mesin",

                qty : 2,

                harga : 55000,

                diskon : 5000,

                catatan : "Test"

            }),

            null,

            2

        )

    );

}

function testCreateWorkOrderPartDocumentWithJasa(){

    Logger.log(

        JSON.stringify(

            WorkOrderPartDocument.create({

                id : "WOP000001",

                workOrderId : "WO2608090002",

                workOrderJasaId : "WOJ2608090001",

                barangId : "BRG000001",

                kodeBarang : "BRG-001",

                namaBarangSnapshot : "Oli Mesin",

                qty : 2,

                harga : 55000,

                diskon : 5000,

                catatan : "Part untuk jasa"

            }),

            null,

            2

        )

    );

}

function testCreateWorkOrderPartDocumentPartOnly(){

    Logger.log(

        JSON.stringify(

            WorkOrderPartDocument.create({

                id : "WOP000002",

                workOrderId : "WO2608090001",

                workOrderJasaId : "",

                barangId : "BRG000001",

                kodeBarang : "BRG-001",

                namaBarangSnapshot : "Oli Mesin",

                qty : 2,

                harga : 55000,

                diskon : 5000,

                catatan : "Pembelian part walk-in"

            }),

            null,

            2

        )

    );

}

function testWorkOrderPartDocumentCreate(){

    const result =
        WorkOrderPartDocument.create({

            id :
                "WOPTEST001",

            workOrderId :
                "WO2608090002",

            workOrderJasaId :
                "WOJ2608090001",

            barangId :
                "BRG000001",

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
                "Test Document"

        });


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testWorkOrderPartCreateAndSave(){

    const document =
        WorkOrderPartDocument.create({

            id :
                "WOP000002",

            workOrderId :
                "WO2608090002",

            workOrderJasaId :
                "WOJ2608090001",

            barangId :
                "BRG000001",

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
                "Test Create Save"

        });


    Logger.log(
        "DOCUMENT:"
    );

    Logger.log(
        JSON.stringify(
            document,
            null,
            2
        )
    );


    const result =
        WorkOrderPartRepository.save(
            document.workOrderPart
        );


    Logger.log(
        "SAVE RESULT:"
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}