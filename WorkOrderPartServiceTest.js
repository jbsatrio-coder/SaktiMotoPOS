function testWorkOrderPartServiceCreate(){

    const result =
        WorkOrderPartService.create({

            workOrderId :
                "WO2608090002",

            workOrderJasaId :
                "WOJ2608090001",

            barangId :
                "BRG000001",

            qty :
                2,

            harga :
                55000,

            diskon :
                5000,

            catatan :
                "Test Service"

        });


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testWorkOrderPartServiceReadBack(){

    const result =
        WorkOrderPartRepository.findById(
            "WOP2608100001"
        );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

/**
 * ============================================
 * TEST VALIDASI WORK ORDER PART SERVICE
 * ============================================
 */

function testWorkOrderPartServiceValidation(){

    const tests = [

        {
            name : "Request kosong",

            request : null
        },


        {
            name : "Work Order kosong",

            request : {

                barangId : "BRG000001",

                qty : 1

            }

        },


        {
            name : "Barang kosong",

            request : {

                workOrderId : "WO2608090002",

                qty : 1

            }

        },


        {
            name : "Work Order tidak ditemukan",

            request : {

                workOrderId : "WO9999999999",

                barangId : "BRG000001",

                qty : 1

            }

        },


        {
            name : "Barang tidak ditemukan",

            request : {

                workOrderId : "WO2608090002",

                barangId : "BRG999999",

                qty : 1

            }

        },


        {
            name : "Qty nol",

            request : {

                workOrderId : "WO2608090002",

                barangId : "BRG000001",

                qty : 0

            }

        },


        {
            name : "Qty negatif",

            request : {

                workOrderId : "WO2608090002",

                barangId : "BRG000001",

                qty : -1

            }

        },


        {
            name : "Harga negatif",

            request : {

                workOrderId : "WO2608090002",

                barangId : "BRG000001",

                qty : 1,

                harga : -1000

            }

        },


        {
            name : "Diskon negatif",

            request : {

                workOrderId : "WO2608090002",

                barangId : "BRG000001",

                qty : 1,

                harga : 50000,

                diskon : -1000

            }

        }

    ];


    for(
        let i = 0;
        i < tests.length;
        i++
    ){

        const test =
            tests[i];


        try{

            WorkOrderPartService.create(
                test.request
            );


            Logger.log(
                "FAIL : " +
                test.name +
                " → tidak menghasilkan error."
            );

        }
        catch(error){

            Logger.log(
                "PASS : " +
                test.name +
                " → " +
                error.message
            );

        }

    }

}