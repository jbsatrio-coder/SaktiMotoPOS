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

function testWorkOrderJasaMekanikPrerequisite(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA MEKANIK PREREQUISITE TEST"
    );

    Logger.log(
        "================================"
    );


    const mekanikId =
        "MEC000001";


    const exists =
        MekanikRepository.exists(
            mekanikId
        );


    Logger.log(
        "MEKANIK ID:"
    );

    Logger.log(
        mekanikId
    );


    Logger.log(
        "MEKANIK EXISTS:"
    );

    Logger.log(
        exists
    );


    if(exists){

        const mekanik =
            MekanikRepository.findById(
                mekanikId
            );


        Logger.log(
            "MEKANIK DATA:"
        );

        Logger.log(
            mekanik
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "MEKANIK PREREQUISITE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testMekanikRepositoryFindAll(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "MEKANIK REPOSITORY FIND ALL TEST"
    );

    Logger.log(
        "================================"
    );

    const data =
        MekanikRepository.findAll();

    Logger.log(
        "JUMLAH MEKANIK:"
    );

    Logger.log(
        data.length
    );

    data.forEach(
        (row, index) => {

            Logger.log(
                "--------------------------------"
            );

            Logger.log(
                "MEKANIK #" + (index + 1)
            );

            Logger.log(
                JSON.stringify(row)
            );

        }
    );

    Logger.log(
        "================================"
    );

    Logger.log(
        "MEKANIK FIND ALL TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCreateWorkOrderJasaWithActiveMekanik(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA ACTIVE MEKANIK TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608100003";


    const mekanikId =
        "MEC000001";


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    Logger.log(
        "MEKANIK ID:"
    );

    Logger.log(
        mekanikId
    );


    Logger.log(
        "MEKANIK ACTIVE:"
    );

    Logger.log(
        MekanikRepository.isActive(
            mekanikId
        )
    );


    const result =
        WorkOrderJasaService.create({

            workOrderId :
                workOrderId,

            jasaId : "JAS000005",

            qty :
                1,

            diskon :
                0,

            mekanikId :
                mekanikId,

            keluhan :
                "Active mekanik prerequisite test",

            diagnosa :
                "Test mekanik aktif",

            catatan :
                "Testing active mechanic prerequisite"

        });


    Logger.log(
        "CREATE RESULT:"
    );

    Logger.log(
        result
    );


    if(result && result.workOrderJasaId){

        const row =
            WorkOrderJasaRepository.findById(
                result.workOrderJasaId
            );


        Logger.log(
            "CREATED ROW:"
        );

        Logger.log(
            row
        );


        Logger.log(
            "MEKANIK ID MATCH:"
        );

        Logger.log(
            row[
                COL_WO_JASA.MEKANIK_ID
            ] ===
            mekanikId
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "ACTIVE MEKANIK TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}


function testWorkOrderJasaInactiveMekanik(){

    Logger.log("================================");
    Logger.log("WORK ORDER JASA INACTIVE MEKANIK TEST");
    Logger.log("================================");


    const mekanikId = "MEC999998";

    const sheet =
        MekanikRepository
            .sheet();

    const lastRowBefore =
        sheet.getLastRow();


    try {

        Logger.log("CREATE TEST MEKANIK:");

        const saveResult =
            MekanikRepository.save({

                id : mekanikId,

                nama : "TEST MEKANIK NONAKTIF",

                noHp : "",

                jabatan : "Mekanik",

                tanggalMasuk : "",

                gajiPokok : "",

                tipeKomisi : "",

                nilaiKomisi : "",

                status : "NONAKTIF",

                createdAt : new Date(),

                updatedAt : "",

                urutanTampilan : 999

            });


        Logger.log(
            "SAVE RESULT:"
        );

        Logger.log(
            saveResult
        );


        Logger.log(
            "MEKANIK EXISTS:"
        );

        Logger.log(
            MekanikRepository.exists(
                mekanikId
            )
        );


        Logger.log(
            "MEKANIK ACTIVE:"
        );

        Logger.log(
            MekanikRepository.isActive(
                mekanikId
            )
        );


        Logger.log(
            "TEST CREATE WORK ORDER JASA:"
        );


        try {

            const result =
                WorkOrderJasaService.create({

                    workOrderId : "WO2608100003",

                    jasaId : "JAS000005",

                    qty : 1,

                    diskon : 0,

                    mekanikId : mekanikId,

                    keluhan : "Inactive mechanic test",

                    diagnosa : "Inactive mechanic test",

                    catatan : "Should be rejected"

                });


            Logger.log(
                "ERROR: MEKANIK NONAKTIF TIDAK DITOLAK"
            );

            Logger.log(
                "UNEXPECTED RESULT:"
            );

            Logger.log(
                result
            );

        } catch(error) {

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

            Logger.log(
                "INACTIVE MEKANIK ERROR DETECTED:"
            );

            Logger.log(
                error.message.includes(
                    "Mekanik tidak aktif"
                )
            );

        }


    } finally {

        /*
         * CLEANUP
         *
         * Test mechanic dibuat sebagai row terakhir.
         * Hapus kembali agar tidak mengotori Master Mekanik.
         */

        const lastRowAfter =
            sheet.getLastRow();


        if(
            lastRowAfter > lastRowBefore
        ){

            sheet.deleteRow(
                lastRowAfter
            );

            Logger.log(
                "TEST MEKANIK CLEANUP: OK"
            );

        }

    }


    Logger.log("================================");
    Logger.log("INACTIVE MEKANIK TEST SELESAI");
    Logger.log("================================");

}