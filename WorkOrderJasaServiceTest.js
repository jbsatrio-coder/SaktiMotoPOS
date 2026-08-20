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

function testCreateUpdateWorkOrderJasa(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE UPDATE TEST WORK ORDER JASA"
    );

    Logger.log(
        "================================"
    );


    const result =
        WorkOrderJasaService.create({

            workOrderId :
                "WO2608100003",

            jasaId :
                "JAS000005",

            qty :
                1,

            diskon :
                0,

            mekanikId :
                "MEC000001",

            keluhan :
                "Update lifecycle initial keluhan",

            diagnosa :
                "Update lifecycle initial diagnosa",

            catatan :
                "Update lifecycle initial catatan"

        });


    Logger.log(
        "CREATE RESULT:"
    );

    Logger.log(
        result
    );


    if(
        !result ||
        !result.workOrderJasaId
    ){

        throw new Error(
            "Gagal membuat Work Order Jasa test."
        );

    }


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
        "WORK ORDER JASA ID:"
    );

    Logger.log(
        result.workOrderJasaId
    );


    Logger.log(
        "STATUS:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log(
        "EXPECTED STATUS:"
    );

    Logger.log(
        WorkOrderJasaStatus.OPEN
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE UPDATE TEST WORK ORDER JASA SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCreateUpdateWorkOrder(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE UPDATE TEST WORK ORDER"
    );

    Logger.log(
        "================================"
    );

    const result =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            jenisTransaksi :
                "SERVICE",

            kilometerMasuk :
                18000,

            prioritas :
                "NORMAL",

            admin :
                "Developer",

            catatan :
                "Dedicated Update/Edit Integration Test"

        });

    Logger.log(
        "CREATE RESULT:"
    );

    Logger.log(
        result
    );

    if(
        !result ||
        !result.workOrderId
    ){

        throw new Error(
            "Gagal membuat Work Order test."
        );

    }

    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        result.workOrderId
    );

    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE UPDATE TEST WORK ORDER SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testCreateUpdateWorkOrderJasa(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE UPDATE TEST WORK ORDER JASA"
    );

    Logger.log(
        "================================"
    );

    const result =
        WorkOrderJasaService.create({

            workOrderId :
                "WO2608110001",

            jasaId :
                "JAS000006",

            qty :
                1,

            diskon :
                0,

            mekanikId :
                "MEC000001",

            keluhan :
                "Update lifecycle initial keluhan",

            diagnosa :
                "Update lifecycle initial diagnosa",

            catatan :
                "Update lifecycle initial catatan"

        });

    Logger.log(
        "CREATE RESULT:"
    );

    Logger.log(
        result
    );

    if(
        !result ||
        !result.workOrderJasaId
    ){

        throw new Error(
            "Gagal membuat Work Order Jasa test."
        );

    }

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
        "WORK ORDER JASA ID:"
    );

    Logger.log(
        result.workOrderJasaId
    );

    Logger.log(
        "STATUS:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
    );

    Logger.log(
        "MEKANIK ID:"
    );

    Logger.log(
        row[
            COL_WO_JASA.MEKANIK_ID
        ]
    );

    Logger.log(
        "================================"
    );

    Logger.log(
        "CREATE UPDATE TEST WORK ORDER JASA SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testUpdateWorkOrderJasaOpen(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA OPEN TEST"
    );

    Logger.log(
        "================================"
    );

    const workOrderJasaId =
        "WOJ2608110004";


    const result =
        WorkOrderJasaService.update({

            workOrderJasaId :
                workOrderJasaId,

            keluhan :
                "Keluhan setelah pemeriksaan",

            diagnosa :
                "Diagnosa setelah pemeriksaan",

            catatan :
                "Catatan update test"

        });


    Logger.log(
        "UPDATE RESULT:"
    );

    Logger.log(
        result
    );


    const row =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "UPDATED ROW:"
    );

    Logger.log(
        row
    );


    Logger.log(
        "KELUHAN:"
    );

    Logger.log(
        row[
            COL_WO_JASA.KELUHAN
        ]
    );


    Logger.log(
        "DIAGNOSA:"
    );

    Logger.log(
        row[
            COL_WO_JASA.DIAGNOSA
        ]
    );


    Logger.log(
        "CATATAN:"
    );

    Logger.log(
        row[
            COL_WO_JASA.CATATAN
        ]
    );


    Logger.log(
        "STATUS:"
    );

    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA OPEN TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testUpdateWorkOrderJasaQty(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA QTY TEST"
    );

    Logger.log(
        "================================"
    );

    const workOrderJasaId =
        "WOJ2608110004";


    const before =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "SEBELUM:"
    );

    Logger.log(
        before
    );


    const result =
        WorkOrderJasaService.update({

            workOrderJasaId :
                workOrderJasaId,

            qty :
                2

        });


    Logger.log(
        "UPDATE RESULT:"
    );

    Logger.log(
        result
    );


    const after =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "SESUDAH:"
    );

    Logger.log(
        after
    );


    Logger.log(
        "QTY:"
    );

    Logger.log(
        after[
            COL_WO_JASA.QTY
        ]
    );


    Logger.log(
        "HARGA:"
    );

    Logger.log(
        after[
            COL_WO_JASA.HARGA
        ]
    );


    Logger.log(
        "DISKON:"
    );

    Logger.log(
        after[
            COL_WO_JASA.DISKON
        ]
    );


    Logger.log(
        "SUBTOTAL:"
    );

    Logger.log(
        after[
            COL_WO_JASA.SUBTOTAL
        ]
    );


    Logger.log(
        "EXPECTED QTY:"
    );

    Logger.log(
        2
    );


    Logger.log(
        "EXPECTED HARGA:"
    );

    Logger.log(
        50000
    );


    Logger.log(
        "EXPECTED SUBTOTAL:"
    );

    Logger.log(
        100000
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA QTY TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testUpdateWorkOrderJasaDiskon(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA DISKON TEST"
    );

    Logger.log(
        "================================"
    );

    const workOrderJasaId =
        "WOJ2608110004";


    const before =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "SEBELUM:"
    );

    Logger.log(
        before
    );


    const result =
        WorkOrderJasaService.update({

            workOrderJasaId :
                workOrderJasaId,

            diskon :
                10000

        });


    Logger.log(
        "UPDATE RESULT:"
    );

    Logger.log(
        result
    );


    const after =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "SESUDAH:"
    );

    Logger.log(
        after
    );


    Logger.log(
        "QTY:"
    );

    Logger.log(
        after[
            COL_WO_JASA.QTY
        ]
    );


    Logger.log(
        "HARGA:"
    );

    Logger.log(
        after[
            COL_WO_JASA.HARGA
        ]
    );


    Logger.log(
        "DISKON:"
    );

    Logger.log(
        after[
            COL_WO_JASA.DISKON
        ]
    );


    Logger.log(
        "SUBTOTAL:"
    );

    Logger.log(
        after[
            COL_WO_JASA.SUBTOTAL
        ]
    );


    Logger.log(
        "EXPECTED DISKON:"
    );

    Logger.log(
        10000
    );


    Logger.log(
        "EXPECTED SUBTOTAL:"
    );

    Logger.log(
        90000
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA DISKON TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testUpdateWorkOrderJasaDiskonExceedsTotal(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA DISKON EXCEEDS TOTAL TEST"
    );

    Logger.log(
        "================================"
    );

    const workOrderJasaId =
        "WOJ2608110004";


    try {

        WorkOrderJasaService.update({

            workOrderJasaId :
                workOrderJasaId,

            diskon :
                150000

        });


        Logger.log(
            "ERROR: DISKON BERLEBIH TIDAK DITOLAK"
        );

    } catch(error){

        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );


        Logger.log(
            "DISKON EXCEEDS TOTAL ERROR DETECTED:"
        );

        Logger.log(
            error.message.includes(
                "Diskon tidak boleh lebih besar dari total harga"
            )
        );

    }


    const after =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "DATA SETELAH TEST:"
    );

    Logger.log(
        after
    );


    Logger.log(
        "DISKON AKHIR:"
    );

    Logger.log(
        after[
            COL_WO_JASA.DISKON
        ]
    );


    Logger.log(
        "SUBTOTAL AKHIR:"
    );

    Logger.log(
        after[
            COL_WO_JASA.SUBTOTAL
        ]
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "DISKON EXCEEDS TOTAL TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testUpdateWorkOrderJasaMechanic(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA MECHANIC TEST"
    );

    Logger.log(
        "================================"
    );

    const workOrderJasaId =
        "WOJ2608110004";


    const before =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "MEKANIK SEBELUM:"
    );

    Logger.log(
        before[
            COL_WO_JASA.MEKANIK_ID
        ]
    );


    Logger.log(
        "NAMA MEKANIK SEBELUM:"
    );

    Logger.log(
        before[
            COL_WO_JASA.MEKANIK_NAMA
        ]
    );


    const result =
        WorkOrderJasaService.update({

            workOrderJasaId :
                workOrderJasaId,

            mekanikId :
                "MEC000002"

        });


    Logger.log(
        "UPDATE RESULT:"
    );

    Logger.log(
        result
    );


    const after =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "MEKANIK SESUDAH:"
    );

    Logger.log(
        after[
            COL_WO_JASA.MEKANIK_ID
        ]
    );


    Logger.log(
        "NAMA MEKANIK SESUDAH:"
    );

    Logger.log(
        after[
            COL_WO_JASA.MEKANIK_NAMA
        ]
    );


    Logger.log(
        "EXPECTED MEKANIK ID:"
    );

    Logger.log(
        "MEC000002"
    );


    Logger.log(
        "EXPECTED NAMA MEKANIK:"
    );

    Logger.log(
        "Kiki"
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA MECHANIC TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testUpdateWorkOrderJasaInvalidMechanic(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA INVALID MECHANIC TEST"
    );

    Logger.log(
        "================================"
    );

    const workOrderJasaId =
        "WOJ2608110004";


    const before =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "MEKANIK SEBELUM:"
    );

    Logger.log(
        before[
            COL_WO_JASA.MEKANIK_ID
        ]
    );


    try {

        WorkOrderJasaService.update({

            workOrderJasaId :
                workOrderJasaId,

            mekanikId :
                "MEC999999"

        });

        Logger.log(
            "ERROR: MEKANIK INVALID TIDAK DITOLAK"
        );

    } catch(error){

        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

        Logger.log(
            "INVALID MEKANIK ERROR DETECTED:"
        );

        Logger.log(
            error.message.includes(
                "Mekanik tidak ditemukan."
            )
        );

    }


    const after =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "MEKANIK SESUDAH TEST:"
    );

    Logger.log(
        after[
            COL_WO_JASA.MEKANIK_ID
        ]
    );

    Logger.log(
        "NAMA MEKANIK SESUDAH TEST:"
    );

    Logger.log(
        after[
            COL_WO_JASA.MEKANIK_NAMA
        ]
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "INVALID MECHANIC TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testUpdateWorkOrderJasaInactiveMechanic(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA INACTIVE MECHANIC TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderJasaId =
        "WOJ2608110004";


    const testMekanikId =
        "MEC999998";


    /**
     * ========================================
     * CREATE INACTIVE MEKANIK
     * ========================================
     */

    const mekanik = {

        id :
            testMekanikId,

        nama :
            "Test Inactive Mechanic",

        noHp :
            "",

        jabatan :
            "MEKANIK",

        tanggalMasuk :
            new Date(),

        gajiPokok :
            0,

        tipeKomisi :
            "",

        nilaiKomisi :
            0,

        status :
            "NONAKTIF",

        createdAt :
            new Date(),

        updatedAt :
            new Date(),

        urutanTampilan :
            999

    };


    try {

        MekanikRepository.save(
            mekanik
        );


        Logger.log(
            "TEST MEKANIK CREATED:"
        );

        Logger.log(
            testMekanikId
        );


        /**
         * ========================================
         * VERIFY EXISTS
         * ========================================
         */

        Logger.log(
            "MEKANIK EXISTS:"
        );

        Logger.log(
            MekanikRepository.exists(
                testMekanikId
            )
        );


        Logger.log(
            "MEKANIK ACTIVE:"
        );

        Logger.log(
            MekanikRepository.isActive(
                testMekanikId
            )
        );


        /**
         * ========================================
         * CURRENT ASSIGNMENT
         * ========================================
         */

        const before =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "MEKANIK SEBELUM:"
        );

        Logger.log(
            before[
                COL_WO_JASA.MEKANIK_ID
            ]
        );


        Logger.log(
            "NAMA MEKANIK SEBELUM:"
        );

        Logger.log(
            before[
                COL_WO_JASA.MEKANIK_NAMA
            ]
        );


        /**
         * ========================================
         * UPDATE WITH INACTIVE MEKANIK
         * ========================================
         */

        try {

            WorkOrderJasaService.update({

                workOrderJasaId :
                    workOrderJasaId,

                mekanikId :
                    testMekanikId

            });


            Logger.log(
                "ERROR: MEKANIK INACTIVE TIDAK DITOLAK"
            );

        } catch(error){

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
                error.message ===
                "Mekanik tidak aktif."
            );

        }


        /**
         * ========================================
         * VERIFY ORIGINAL ASSIGNMENT
         * ========================================
         */

        const after =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "MEKANIK SESUDAH TEST:"
        );

        Logger.log(
            after[
                COL_WO_JASA.MEKANIK_ID
            ]
        );


        Logger.log(
            "NAMA MEKANIK SESUDAH TEST:"
        );

        Logger.log(
            after[
                COL_WO_JASA.MEKANIK_NAMA
            ]
        );


       } finally {

        /**
         * ========================================
         * CLEANUP
         * ========================================
         */

        const row =
            MekanikRepository.findRowById(
                testMekanikId
            );


        if(row !== 0){

            MekanikRepository
                .sheet()
                .deleteRow(
                    row
                );

            Logger.log(
                "TEST MEKANIK CLEANUP: OK"
            );

        }

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "INACTIVE MECHANIC TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testUpdateWorkOrderJasaUnassignMechanic(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA UNASSIGN MECHANIC TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderJasaId =
        "WOJ2608110004";


    const before =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "MEKANIK SEBELUM:"
    );

    Logger.log(
        before[
            COL_WO_JASA.MEKANIK_ID
        ]
    );


    Logger.log(
        "NAMA MEKANIK SEBELUM:"
    );

    Logger.log(
        before[
            COL_WO_JASA.MEKANIK_NAMA
        ]
    );


    const result =
        WorkOrderJasaService.update({

            workOrderJasaId :
                workOrderJasaId,

            mekanikId :
                ""

        });


    Logger.log(
        "UPDATE RESULT:"
    );

    Logger.log(
        result
    );


    const after =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "MEKANIK SESUDAH:"
    );

    Logger.log(
        after[
            COL_WO_JASA.MEKANIK_ID
        ]
    );


    Logger.log(
        "NAMA MEKANIK SESUDAH:"
    );

    Logger.log(
        after[
            COL_WO_JASA.MEKANIK_NAMA
        ]
    );


    Logger.log(
        "QTY:"
    );

    Logger.log(
        after[
            COL_WO_JASA.QTY
        ]
    );


    Logger.log(
        "DISKON:"
    );

    Logger.log(
        after[
            COL_WO_JASA.DISKON
        ]
    );


    Logger.log(
        "SUBTOTAL:"
    );

    Logger.log(
        after[
            COL_WO_JASA.SUBTOTAL
        ]
    );


    Logger.log(
        "STATUS:"
    );

    Logger.log(
        after[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "UNASSIGN MECHANIC TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testUpdateWorkOrderJasaProgressLocked(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA PROGRESS LOCK TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderJasaId =
        "WOJ2608110004";


    const before =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    const originalKeluhan =
        before[
            COL_WO_JASA.KELUHAN
        ];


    Logger.log(
        "STATUS SEBELUM:"
    );

    Logger.log(
        before[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log(
        "KELUHAN SEBELUM:"
    );

    Logger.log(
        originalKeluhan
    );


    try {

        /**
         * ========================================
         * OPEN → PROGRESS
         * ========================================
         */

        const statusResult =
            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.PROGRESS

            );


        Logger.log(
            "CHANGE STATUS RESULT:"
        );

        Logger.log(
            statusResult
        );


        /**
         * ========================================
         * VERIFY PROGRESS
         * ========================================
         */

        const progressRow =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "STATUS SAAT PROGRESS:"
        );

        Logger.log(
            progressRow[
                COL_WO_JASA.STATUS
            ]
        );


        /**
         * ========================================
         * TRY UPDATE
         * ========================================
         */

        try {

            WorkOrderJasaService.update({

                workOrderJasaId :
                    workOrderJasaId,

                keluhan :
                    "Should be rejected while PROGRESS"

            });


            Logger.log(
                "ERROR: UPDATE PROGRESS TIDAK DITOLAK"
            );

        } catch(error){

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );


            Logger.log(
                "PROGRESS LOCK ERROR DETECTED:"
            );

            Logger.log(
                error.message ===
                "Work Order Jasa hanya dapat diedit saat status OPEN."
            );

        }


        /**
         * ========================================
         * VERIFY DATA TIDAK BERUBAH
         * ========================================
         */

        const after =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "KELUHAN SESUDAH TEST:"
        );

        Logger.log(
            after[
                COL_WO_JASA.KELUHAN
            ]
        );


        Logger.log(
            "STATUS SESUDAH TEST:"
        );

        Logger.log(
            after[
                COL_WO_JASA.STATUS
            ]
        );


    } finally {

        /**
         * ========================================
         * RESTORE STATUS → OPEN
         * ========================================
         */

        const current =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


       if(
    current &&
    current[
        COL_WO_JASA.STATUS
    ] ===
    WorkOrderJasaStatus.PROGRESS
){

    const row =
        WorkOrderJasaRepository.findRowById(
            workOrderJasaId
        );


    if(row !== 0){

        WorkOrderJasaRepository
            .sheet()
            .getRange(
                row,
                COL_WO_JASA.STATUS + 1
            )
            .setValue(
                WorkOrderJasaStatus.OPEN
            );


        Logger.log(
            "STATUS RESTORE: OPEN"
        );

    }

}


    /**
     * ========================================
     * FINAL VERIFY
     * ========================================
     */

    const restored =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "STATUS FINAL:"
    );

    Logger.log(
        restored[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log(
        "KELUHAN FINAL:"
    );

    Logger.log(
        restored[
            COL_WO_JASA.KELUHAN
        ]
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "PROGRESS LOCK TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testRestoreWorkOrderJasaFixture(){

    const workOrderJasaId =
        "WOJ2608110004";


    const row =
        WorkOrderJasaRepository.findRowById(
            workOrderJasaId
        );


    if(row === 0){

        throw new Error(
            "Work Order Jasa tidak ditemukan."
        );

    }


    WorkOrderJasaRepository
        .sheet()
        .getRange(
            row,
            COL_WO_JASA.STATUS + 1
        )
        .setValue(
            WorkOrderJasaStatus.OPEN
        );


    Logger.log(
        "FIXTURE STATUS RESTORED: OPEN"
    );

}

}

function testUpdateWorkOrderJasaDoneLocked(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA DONE LOCK TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608110001";


    const jasaId =
        "JAS000007";


    let workOrderJasaId = "";


    try {

        /**
         * ========================================
         * CREATE TEST WORK ORDER JASA
         * ========================================
         */

        const createResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    jasaId,

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "DONE LOCK INITIAL KELUHAN",

                diagnosa :
                    "DONE LOCK INITIAL DIAGNOSA",

                catatan :
                    "DONE LOCK TEST"

            });


        Logger.log(
            "CREATE RESULT:"
        );

        Logger.log(
            createResult
        );


        workOrderJasaId =
            createResult.workOrderJasaId;


        /**
         * ========================================
         * VERIFY OPEN
         * ========================================
         */

        let row =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "STATUS AWAL:"
        );

        Logger.log(
            row[
                COL_WO_JASA.STATUS
            ]
        );


        /**
         * ========================================
         * OPEN → PROGRESS
         * ========================================
         */

        const progressResult =
            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.PROGRESS

            );


        Logger.log(
            "PROGRESS RESULT:"
        );

        Logger.log(
            progressResult
        );


        /**
         * ========================================
         * PROGRESS → DONE
         * ========================================
         */

        const doneResult =
            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.DONE

            );


        Logger.log(
            "DONE RESULT:"
        );

        Logger.log(
            doneResult
        );


        /**
         * ========================================
         * VERIFY DONE
         * ========================================
         */

        row =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "STATUS SAAT DONE:"
        );

        Logger.log(
            row[
                COL_WO_JASA.STATUS
            ]
        );


        const originalKeluhan =
            row[
                COL_WO_JASA.KELUHAN
            ];


        /**
         * ========================================
         * TRY UPDATE
         * ========================================
         */

        try {

            WorkOrderJasaService.update({

                workOrderJasaId :
                    workOrderJasaId,

                keluhan :
                    "SHOULD BE REJECTED AFTER DONE"

            });


            Logger.log(
                "ERROR: UPDATE DONE TIDAK DITOLAK"
            );

        } catch(error){

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );


            Logger.log(
                "DONE LOCK ERROR DETECTED:"
            );

            Logger.log(
                error.message ===
                "Work Order Jasa hanya dapat diedit saat status OPEN."
            );

        }


        /**
         * ========================================
         * VERIFY DATA TIDAK BERUBAH
         * ========================================
         */

        const after =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "KELUHAN SESUDAH TEST:"
        );

        Logger.log(
            after[
                COL_WO_JASA.KELUHAN
            ]
        );


        Logger.log(
            "EXPECTED KELUHAN:"
        );

        Logger.log(
            originalKeluhan
        );


        Logger.log(
            "STATUS SESUDAH TEST:"
        );

        Logger.log(
            after[
                COL_WO_JASA.STATUS
            ]
        );


    } finally {

        /**
         * ========================================
         * CLEANUP TEST WO JASA
         * ========================================
         */

        if(workOrderJasaId){

            const rowNumber =
                WorkOrderJasaRepository.findRowById(
                    workOrderJasaId
                );


            if(rowNumber !== 0){

                WorkOrderJasaRepository
                    .sheet()
                    .deleteRow(
                        rowNumber
                    );


                Logger.log(
                    "TEST WO JASA CLEANUP: OK"
                );

            }

        }


        Logger.log(
            "================================"
        );

        Logger.log(
            "DONE LOCK TEST SELESAI"
        );

        Logger.log(
            "================================"
        );

    }

}

function testUpdateWorkOrderJasaCancelLocked(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "UPDATE WORK ORDER JASA CANCEL LOCK TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608110001";


    const jasaId =
        "JAS000008";


    let workOrderJasaId = "";


    try {

        /**
         * ========================================
         * CREATE TEST WORK ORDER JASA
         * ========================================
         */

        const createResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    jasaId,

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "CANCEL LOCK INITIAL KELUHAN",

                diagnosa :
                    "CANCEL LOCK INITIAL DIAGNOSA",

                catatan :
                    "CANCEL LOCK TEST"

            });


        Logger.log(
            "CREATE RESULT:"
        );

        Logger.log(
            createResult
        );


        workOrderJasaId =
            createResult.workOrderJasaId;


        /**
         * ========================================
         * VERIFY OPEN
         * ========================================
         */

        let row =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "STATUS AWAL:"
        );

        Logger.log(
            row[
                COL_WO_JASA.STATUS
            ]
        );


        /**
         * ========================================
         * OPEN → CANCEL
         * ========================================
         */

        const cancelResult =
            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.CANCEL

            );


        Logger.log(
            "CANCEL RESULT:"
        );

        Logger.log(
            cancelResult
        );


        /**
         * ========================================
         * VERIFY CANCEL
         * ========================================
         */

        row =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "STATUS SAAT CANCEL:"
        );

        Logger.log(
            row[
                COL_WO_JASA.STATUS
            ]
        );


        const originalKeluhan =
            row[
                COL_WO_JASA.KELUHAN
            ];


        /**
         * ========================================
         * TRY UPDATE
         * ========================================
         */

        try {

            WorkOrderJasaService.update({

                workOrderJasaId :
                    workOrderJasaId,

                keluhan :
                    "SHOULD BE REJECTED AFTER CANCEL"

            });


            Logger.log(
                "ERROR: UPDATE CANCEL TIDAK DITOLAK"
            );

        } catch(error){

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );


            Logger.log(
                "CANCEL LOCK ERROR DETECTED:"
            );

            Logger.log(
                error.message ===
                "Work Order Jasa hanya dapat diedit saat status OPEN."
            );

        }


        /**
         * ========================================
         * VERIFY DATA TIDAK BERUBAH
         * ========================================
         */

        const after =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "KELUHAN SESUDAH TEST:"
        );

        Logger.log(
            after[
                COL_WO_JASA.KELUHAN
            ]
        );


        Logger.log(
            "EXPECTED KELUHAN:"
        );

        Logger.log(
            originalKeluhan
        );


        Logger.log(
            "STATUS SESUDAH TEST:"
        );

        Logger.log(
            after[
                COL_WO_JASA.STATUS
            ]
        );


    } finally {

        /**
         * ========================================
         * CLEANUP TEST WO JASA
         * ========================================
         */

        if(workOrderJasaId){

            const rowNumber =
                WorkOrderJasaRepository.findRowById(
                    workOrderJasaId
                );


            if(rowNumber !== 0){

                WorkOrderJasaRepository
                    .sheet()
                    .deleteRow(
                        rowNumber
                    );


                Logger.log(
                    "TEST WO JASA CLEANUP: OK"
                );

            }

        }


        Logger.log(
            "================================"
        );

        Logger.log(
            "CANCEL LOCK TEST SELESAI"
        );

        Logger.log(
            "================================"
        );

    }

}


function testWorkOrderJasaCreatePermission(){

    Logger.log("================================");
    Logger.log("WORK ORDER JASA CREATE PERMISSION TEST");
    Logger.log("================================");


    /**
     * ========================================
     * CURRENT USER
     * ========================================
     */

    const user =
        PermissionService.getCurrentUser();

    Logger.log("EMAIL:");
    Logger.log(user.email);

    Logger.log("ROLE:");
    Logger.log(user.role);

    Logger.log("RESOLVED:");
    Logger.log(user.resolved);


    /**
     * ========================================
     * PERMISSION PRE-CHECK
     * ========================================
     */

    const canEditWO =
        PermissionService.can(
            Permission.EDIT_WO
        );

    const canAssignMekanik =
        PermissionService.can(
            Permission.ASSIGN_MEKANIK
        );


    Logger.log(
        "EDIT_WO = " +
        canEditWO
    );

    Logger.log(
        "ASSIGN_MEKANIK = " +
        canAssignMekanik
    );


    if(!canEditWO){

        throw new Error(
            "Current user tidak memiliki EDIT_WO."
        );

    }


    if(!canAssignMekanik){

        throw new Error(
            "Current user tidak memiliki ASSIGN_MEKANIK."
        );

    }


    Logger.log(
        "PERMISSION PRE-CHECK PASS"
    );

/**
 * ========================================
 * CREATE DEDICATED PERMISSION TEST WO
 * ========================================
 */

const testWO =
    WorkOrderService.create({

        customerId :
    "CUS2608160002",

vehicleId :
    "VEH2608160002",

        jenisTransaksi :
            WorkOrderType.SERVICE,

        kilometerMasuk :
            18000,

        prioritas :
            WorkOrderPriority.NORMAL,

        admin :
            "Permission Test",

        catatan :
            "Dedicated Permission Test WO"

    });


if(
    !testWO ||
    !testWO.workOrderId
){

    throw new Error(
        "Gagal membuat Work Order permission test."
    );

}


const permissionTestWorkOrderId =
    testWO.workOrderId;


Logger.log(
    "PERMISSION TEST WORK ORDER:"
);

Logger.log(
    permissionTestWorkOrderId
);
    /**
     * ========================================
     * TEST CREATE TANPA MEKANIK
     * ========================================
     */

    Logger.log(
        "--------------------------------"
    );

    Logger.log(
        "CREATE WITHOUT MECHANIC"
    );

    Logger.log(
        "--------------------------------"
    );


    const resultWithoutMechanic =
        WorkOrderJasaService.create({

          workOrderId :
    permissionTestWorkOrderId,

jasaId :
    "JAS000002",

            qty :
                1,

            diskon :
                0,

            mekanikId :
                "",

            keluhan :
                "Permission test without mechanic",

            diagnosa :
                "Permission test",

            catatan :
                "Permission create test"

        });


    Logger.log(
        "CREATE RESULT:"
    );

    Logger.log(
        resultWithoutMechanic
    );


    if(
        !resultWithoutMechanic ||
        !resultWithoutMechanic.workOrderJasaId
    ){

        throw new Error(
            "CREATE jasa tanpa mekanik gagal."
        );

    }


    const createdWithoutMechanicId =
        resultWithoutMechanic.workOrderJasaId;


    Logger.log(
        "CREATE WITHOUT MECHANIC PASS"
    );


    /**
     * ========================================
     * TEST CREATE DENGAN MEKANIK
     * ========================================
     */

    Logger.log(
        "--------------------------------"
    );

    Logger.log(
        "CREATE WITH MECHANIC"
    );

    Logger.log(
        "--------------------------------"
    );


    const resultWithMechanic =
        WorkOrderJasaService.create({

            workOrderId :
    permissionTestWorkOrderId,

jasaId :
    "JAS000005",

            qty :
                1,

            diskon :
                0,

            mekanikId :
                "MEC000001",

            keluhan :
                "Permission test with mechanic",

            diagnosa :
                "Permission test",

            catatan :
                "Permission create mechanic test"

        });


    Logger.log(
        "CREATE RESULT:"
    );

    Logger.log(
        resultWithMechanic
    );


    if(
        !resultWithMechanic ||
        !resultWithMechanic.workOrderJasaId
    ){

        throw new Error(
            "CREATE jasa dengan mekanik gagal."
        );

    }


    const createdWithMechanicId =
        resultWithMechanic.workOrderJasaId;


    Logger.log(
        "CREATE WITH MECHANIC PASS"
    );


    /**
     * ========================================
     * CLEANUP
     * ========================================
     */

    Logger.log(
        "--------------------------------"
    );

    Logger.log(
        "CLEANUP"
    );

    Logger.log(
        "--------------------------------"
    );


    const rowWithoutMechanic =
        WorkOrderJasaRepository.findRowById(
            createdWithoutMechanicId
        );


    if(
        rowWithoutMechanic !== 0
    ){

        WorkOrderJasaRepository
            .sheet()
            .deleteRow(
                rowWithoutMechanic
            );

    }


    const rowWithMechanic =
        WorkOrderJasaRepository.findRowById(
            createdWithMechanicId
        );


    if(
        rowWithMechanic !== 0
    ){

        WorkOrderJasaRepository
            .sheet()
            .deleteRow(
                rowWithMechanic
            );

    }


    Logger.log(
        "CLEANUP PASS"
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA CREATE PERMISSION TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

function testWorkOrderJasaAssignMechanicPermission(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA ASSIGN MEKANIK PERMISSION TEST"
    );

    Logger.log(
        "================================"
    );


    const user =
        PermissionService.getCurrentUser();


    Logger.log(
        "EMAIL:"
    );

    Logger.log(
        user.email
    );


    Logger.log(
        "ROLE:"
    );

    Logger.log(
        user.role
    );


    Logger.log(
        "ASSIGN_MEKANIK:"
    );

    Logger.log(
        PermissionService.can(
            Permission.ASSIGN_MEKANIK
        )
    );


    /**
     * ========================================
     * PRE-CHECK
     * ========================================
     *
     * Current user ADMIN harus memiliki
     * ASSIGN_MEKANIK.
     */

    if(
        !PermissionService.can(
            Permission.ASSIGN_MEKANIK
        )
    ){

        throw new Error(
            "Current user tidak memiliki ASSIGN_MEKANIK."
        );

    }


    Logger.log(
        "PERMISSION PRE-CHECK PASS"
    );


    /**
     * ========================================
     * TEST SELESAI
     * ========================================
     */

    Logger.log(
        "================================"
    );

    Logger.log(
        "ASSIGN MEKANIK PERMISSION TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

function testUpdateWorkOrderJasaPermission(){

    Logger.log("================================");
    Logger.log("WORK ORDER JASA UPDATE PERMISSION TEST");
    Logger.log("================================");


    const user =
        PermissionService.getCurrentUser();

    Logger.log("EMAIL:");
    Logger.log(user.email);

    Logger.log("ROLE:");
    Logger.log(user.role);

    Logger.log("RESOLVED:");
    Logger.log(user.resolved);


    const canEditWO =
        PermissionService.can(
            Permission.EDIT_WO
        );

    const canAssignMekanik =
        PermissionService.can(
            Permission.ASSIGN_MEKANIK
        );


    Logger.log(
        "EDIT_WO = " +
        canEditWO
    );

    Logger.log(
        "ASSIGN_MEKANIK = " +
        canAssignMekanik
    );


    if(!canEditWO){

        throw new Error(
            "Test tidak dapat dilanjutkan: current user tidak memiliki EDIT_WO."
        );

    }


    if(!canAssignMekanik){

        throw new Error(
            "Test tidak dapat dilanjutkan: current user tidak memiliki ASSIGN_MEKANIK."
        );

    }


    Logger.log(
        "PERMISSION PRE-CHECK PASS"
    );


    const workOrderJasaId =
        "WOJ2608110004";

    const mekanikId =
        "MEC000002";


    const before =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    if(!before){

        throw new Error(
            "Fixture Work Order Jasa tidak ditemukan: " +
            workOrderJasaId
        );

    }


    if(
        before[
            COL_WO_JASA.STATUS
        ] !==
        WorkOrderJasaStatus.OPEN
    ){

        throw new Error(
            "Fixture harus berstatus OPEN."
        );

    }


    Logger.log("FIXTURE:");
    Logger.log(workOrderJasaId);

    Logger.log("STATUS:");
    Logger.log(
        before[
            COL_WO_JASA.STATUS
        ]
    );


    /**
     * ========================================
     * TEST 1
     * EDIT TANPA MEKANIK
     * ========================================
     */

    Logger.log("--------------------------------");
    Logger.log("TEST 1: EDIT WITHOUT MECHANIC");
    Logger.log("--------------------------------");


    const editResult =
        WorkOrderJasaService.update({

            workOrderJasaId :
                workOrderJasaId,

            diagnosa :
                "Permission update test"

        });


    Logger.log("RESULT:");
    Logger.log(editResult);


    if(
        !editResult ||
        !editResult.success
    ){

        throw new Error(
            "EDIT tanpa mekanik gagal."
        );

    }


    Logger.log(
        "EDIT WITHOUT MECHANIC PASS"
    );


    /**
     * ========================================
     * TEST 2
     * ASSIGN MEKANIK
     * ========================================
     */

    Logger.log("--------------------------------");
    Logger.log("TEST 2: ASSIGN MEKANIK");
    Logger.log("--------------------------------");


    const assignResult =
        WorkOrderJasaService.update({

            workOrderJasaId :
                workOrderJasaId,

            mekanikId :
                mekanikId

        });


    Logger.log("RESULT:");
    Logger.log(assignResult);


    if(
        !assignResult ||
        !assignResult.success
    ){

        throw new Error(
            "Assign mekanik gagal."
        );

    }


    const afterAssign =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log("MEKANIK AFTER ASSIGN:");

    Logger.log(
        afterAssign[
            COL_WO_JASA.MEKANIK_ID
        ]
    );


    if(
        afterAssign[
            COL_WO_JASA.MEKANIK_ID
        ] !== mekanikId
    ){

        throw new Error(
            "Mekanik tidak berhasil di-assign."
        );

    }


    Logger.log(
        "ASSIGN MEKANIK PASS"
    );


    /**
     * ========================================
     * TEST 3
     * UNASSIGN MEKANIK
     * ========================================
     */

    Logger.log("--------------------------------");
    Logger.log("TEST 3: UNASSIGN MEKANIK");
    Logger.log("--------------------------------");


    const unassignResult =
        WorkOrderJasaService.update({

            workOrderJasaId :
                workOrderJasaId,

            mekanikId :
                ""

        });


    Logger.log("RESULT:");
    Logger.log(unassignResult);


    if(
        !unassignResult ||
        !unassignResult.success
    ){

        throw new Error(
            "Unassign mekanik gagal."
        );

    }


    const afterUnassign =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log("MEKANIK AFTER UNASSIGN:");

    Logger.log(
        afterUnassign[
            COL_WO_JASA.MEKANIK_ID
        ]
    );


    if(
        String(
            afterUnassign[
                COL_WO_JASA.MEKANIK_ID
            ] || ""
        ).trim() !== ""
    ){

        throw new Error(
            "Mekanik tidak berhasil di-unassign."
        );

    }


    Logger.log(
        "UNASSIGN MEKANIK PASS"
    );


    /**
     * ========================================
     * RESTORE FIXTURE
     * ========================================
     */

    const restoreRow =
        WorkOrderJasaRepository.findRowById(
            workOrderJasaId
        );


    if(
        restoreRow === 0
    ){

        throw new Error(
            "Gagal menemukan row fixture saat restore."
        );

    }


    const sh =
        WorkOrderJasaRepository.sheet();


    sh.getRange(
        restoreRow,
        COL_WO_JASA.MEKANIK_ID + 1
    )
    .setValue(
        before[
            COL_WO_JASA.MEKANIK_ID
        ]
    );


    sh.getRange(
        restoreRow,
        COL_WO_JASA.MEKANIK_NAMA + 1
    )
    .setValue(
        before[
            COL_WO_JASA.MEKANIK_NAMA
        ]
    );


    sh.getRange(
        restoreRow,
        COL_WO_JASA.DIAGNOSA + 1
    )
    .setValue(
        before[
            COL_WO_JASA.DIAGNOSA
        ]
    );


    Logger.log(
        "FIXTURE RESTORED"
    );


    Logger.log("================================");
    Logger.log(
        "WORK ORDER JASA UPDATE PERMISSION TEST PASS"
    );
    Logger.log("================================");

}

function testUpdateWorkOrderJasaAssignPermissionDisableRestore(){

    Logger.log("================================");
    Logger.log("WORK ORDER JASA ASSIGN MEKANIK");
    Logger.log("PERMISSION DISABLE / RESTORE TEST");
    Logger.log("================================");


    /**
     * ========================================
     * PRE-CHECK
     * ========================================
     */

    const user =
        PermissionService.getCurrentUser();

    Logger.log("EMAIL:");
    Logger.log(user.email);

    Logger.log("ROLE:");
    Logger.log(user.role);


    const role =
        String(
            user.role || ""
        )
        .trim()
        .toUpperCase();


    const permission =
        Permission.ASSIGN_MEKANIK;


    Logger.log("ROLE:");
    Logger.log(role);

    Logger.log("PERMISSION:");
    Logger.log(permission);


    /**
     * ========================================
     * CARI ROLE PERMISSION
     * ========================================
     */

    const permissionRow =
        RolePermissionRepository.findPermission(
            role,
            permission
        );


    if(!permissionRow){

        throw new Error(
            "Role Permission tidak ditemukan: " +
            role +
            " / " +
            permission
        );

    }


    const rolePermissionId =
        permissionRow[
            COL_ROLE_PERMISSION.ID
        ];


    const originalStatus =
        permissionRow[
            COL_ROLE_PERMISSION.STATUS
        ];


    Logger.log("ROLE PERMISSION ID:");
    Logger.log(rolePermissionId);

    Logger.log("ORIGINAL STATUS:");
    Logger.log(originalStatus);


    /**
     * ========================================
     * PASTIKAN FIXTURE
     * ========================================
     */

    const workOrderJasaId =
        "WOJ2608110004";


    const mekanikId =
        "MEC000002";


    const row =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    if(!row){

        throw new Error(
            "Fixture Work Order Jasa tidak ditemukan: " +
            workOrderJasaId
        );

    }


    if(
        row[
            COL_WO_JASA.STATUS
        ] !==
        WorkOrderJasaStatus.OPEN
    ){

        throw new Error(
            "Fixture Work Order Jasa harus OPEN."
        );

    }


    if(
        !MekanikRepository.isActive(
            mekanikId
        )
    ){

        throw new Error(
            "Fixture mekanik tidak aktif: " +
            mekanikId
        );

    }


    /**
     * ========================================
     * PASTIKAN PERMISSION AWAL AKTIF
     * ========================================
     */

    if(
        !PermissionService.can(
            permission
        )
    ){

        throw new Error(
            "ASSIGN_MEKANIK harus aktif sebelum test."
        );

    }


    Logger.log(
        "PRE-CHECK ASSIGN_MEKANIK = true"
    );


    try {

        /**
         * ====================================
         * DISABLE PERMISSION
         * ====================================
         */

        Logger.log("--------------------------------");
        Logger.log("DISABLE ASSIGN_MEKANIK");
        Logger.log("--------------------------------");


        RolePermissionRepository.updateStatus(

            rolePermissionId,

            "NONAKTIF"

        );


        const afterDisable =
            PermissionService.can(
                permission
            );


        Logger.log(
            "HAS PERMISSION AFTER DISABLE:"
        );

        Logger.log(
            afterDisable
        );


        if(afterDisable){

            throw new Error(
                "ASSIGN_MEKANIK masih aktif setelah disable."
            );

        }


        Logger.log(
            "DISABLE PERMISSION PASS"
        );


        /**
         * ====================================
         * TEST ASSIGN HARUS DITOLAK
         * ====================================
         */

        Logger.log("--------------------------------");
        Logger.log("TEST ASSIGN WITHOUT PERMISSION");
        Logger.log("--------------------------------");


        let rejected =
            false;


        try {

            WorkOrderJasaService.update({

                workOrderJasaId :
                    workOrderJasaId,

                mekanikId :
                    mekanikId

            });


        } catch(error){

            rejected = true;

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!rejected){

            throw new Error(
                "SECURITY FAILURE: " +
                "assign mekanik tetap berhasil " +
                "tanpa ASSIGN_MEKANIK."
            );

        }


        Logger.log(
            "ASSIGN WITHOUT PERMISSION REJECTED PASS"
        );


        /**
         * ====================================
         * RESTORE PERMISSION
         * ====================================
         */

        Logger.log("--------------------------------");
        Logger.log("RESTORE ORIGINAL PERMISSION");
        Logger.log("--------------------------------");


        RolePermissionRepository.updateStatus(

            rolePermissionId,

            originalStatus

        );


        const afterRestore =
            PermissionService.can(
                permission
            );


        Logger.log(
            "HAS PERMISSION AFTER RESTORE:"
        );

        Logger.log(
            afterRestore
        );


        if(
            String(
                originalStatus || ""
            )
            .trim()
            .toUpperCase()
            ===
            "AKTIF"
        ){

            if(!afterRestore){

                throw new Error(
                    "ASSIGN_MEKANIK gagal di-restore."
                );

            }

        }


        Logger.log(
            "RESTORE PERMISSION PASS"
        );


        /**
         * ====================================
         * FINAL POSITIVE TEST
         * ====================================
         */

        if(afterRestore){

            Logger.log("--------------------------------");
            Logger.log("TEST ASSIGN AFTER RESTORE");
            Logger.log("--------------------------------");


            const finalResult =
                WorkOrderJasaService.update({

                    workOrderJasaId :
                        workOrderJasaId,

                    mekanikId :
                        mekanikId

                });


            Logger.log(
                "FINAL ASSIGN RESULT:"
            );

            Logger.log(
                finalResult
            );


            if(
                !finalResult ||
                !finalResult.success
            ){

                throw new Error(
                    "Assign mekanik gagal setelah permission di-restore."
                );

            }


            Logger.log(
                "ASSIGN AFTER RESTORE PASS"
            );

        }

    } finally {

        /**
         * ====================================
         * SAFETY RESTORE
         * ====================================
         *
         * Apapun hasil test, permission
         * dikembalikan ke status awal.
         * ====================================
         */

        RolePermissionRepository.updateStatus(

            rolePermissionId,

            originalStatus

        );


        Logger.log(
            "PERMISSION SAFETY RESTORE EXECUTED"
        );

    }


    Logger.log("================================");
    Logger.log(
        "WORK ORDER JASA ASSIGN MEKANIK " +
        "PERMISSION DISABLE / RESTORE TEST PASS"
    );
    Logger.log("================================");

}

function testWorkOrderJasaEditWOPermissionDisableRestore(){

    Logger.log("================================");
    Logger.log("WORK ORDER JASA EDIT_WO");
    Logger.log("PERMISSION DISABLE / RESTORE TEST");
    Logger.log("================================");


    const role =
        PermissionService.getCurrentUser().role;

    const permission =
        Permission.EDIT_WO;


    Logger.log("ROLE:");
    Logger.log(role);

    Logger.log("PERMISSION:");
    Logger.log(permission);


    const permissionRow =
        RolePermissionRepository.findPermission(
            role,
            permission
        );


    if(!permissionRow){

        throw new Error(
            "Role Permission tidak ditemukan: " +
            role +
            " / " +
            permission
        );

    }


    const rolePermissionId =
        permissionRow[
            COL_ROLE_PERMISSION.ID
        ];


    const originalStatus =
        permissionRow[
            COL_ROLE_PERMISSION.STATUS
        ];


    Logger.log("ROLE PERMISSION ID:");
    Logger.log(rolePermissionId);

    Logger.log("ORIGINAL STATUS:");
    Logger.log(originalStatus);


    if(
        String(originalStatus)
            .trim()
            .toUpperCase()
        !==
        "AKTIF"
    ){

        throw new Error(
            "Fixture EDIT_WO harus AKTIF sebelum test."
        );

    }


    const workOrderJasaId =
        "WOJ2608110004";


    const before =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    if(!before){

        throw new Error(
            "Fixture Work Order Jasa tidak ditemukan: " +
            workOrderJasaId
        );

    }


    Logger.log("FIXTURE:");
    Logger.log(workOrderJasaId);

    Logger.log("STATUS:");
    Logger.log(
        before[
            COL_WO_JASA.STATUS
        ]
    );


    try {

        /**
         * ========================================
         * PRE-CHECK
         * ========================================
         */

        const preCheck =
            PermissionService.can(
                permission
            );


        Logger.log(
            "PRE-CHECK EDIT_WO:"
        );

        Logger.log(
            preCheck
        );


        if(!preCheck){

            throw new Error(
                "EDIT_WO seharusnya AKTIF sebelum test."
            );

        }


        /**
         * ========================================
         * DISABLE
         * ========================================
         */

        Logger.log("--------------------------------");
        Logger.log("DISABLE EDIT_WO");
        Logger.log("--------------------------------");


        RolePermissionRepository.updateStatus(
            rolePermissionId,
            "NONAKTIF"
        );


        const afterDisable =
            PermissionService.can(
                permission
            );


        Logger.log(
            "HAS PERMISSION AFTER DISABLE:"
        );

        Logger.log(
            afterDisable
        );


        if(afterDisable){

            throw new Error(
                "EDIT_WO masih aktif setelah disable."
            );

        }


        Logger.log(
            "DISABLE PERMISSION PASS"
        );


        /**
         * ========================================
         * TEST UPDATE WITHOUT PERMISSION
         * ========================================
         */

        Logger.log("--------------------------------");
        Logger.log("TEST UPDATE WITHOUT EDIT_WO");
        Logger.log("--------------------------------");


        let rejected =
            false;


        try {

            WorkOrderJasaService.update({

                workOrderJasaId :
                    workOrderJasaId,

                diagnosa :
                    "SHOULD BE REJECTED"

            });


        } catch(error){

            rejected = true;


            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );


            Logger.log(
                "UPDATE WITHOUT PERMISSION REJECTED PASS"
            );

        }


        if(!rejected){

            throw new Error(
                "Update WO Jasa tidak ditolak ketika EDIT_WO NONAKTIF."
            );

        }


        /**
         * ========================================
         * RESTORE
         * ========================================
         */

        Logger.log("--------------------------------");
        Logger.log("RESTORE EDIT_WO");
        Logger.log("--------------------------------");


        RolePermissionRepository.updateStatus(
            rolePermissionId,
            originalStatus
        );


        const afterRestore =
            PermissionService.can(
                permission
            );


        Logger.log(
            "HAS PERMISSION AFTER RESTORE:"
        );

        Logger.log(
            afterRestore
        );


        if(!afterRestore){

            throw new Error(
                "EDIT_WO gagal direstore."
            );

        }


        Logger.log(
            "RESTORE PERMISSION PASS"
        );


        /**
         * ========================================
         * TEST UPDATE AFTER RESTORE
         * ========================================
         */

        Logger.log("--------------------------------");
        Logger.log("TEST UPDATE AFTER RESTORE");
        Logger.log("--------------------------------");


        const restoreResult =
            WorkOrderJasaService.update({

                workOrderJasaId :
                    workOrderJasaId,

                diagnosa :
                    before[
                        COL_WO_JASA.DIAGNOSA
                    ]

            });


        Logger.log(
            "FINAL UPDATE RESULT:"
        );

        Logger.log(
            restoreResult
        );


        if(
            !restoreResult ||
            !restoreResult.success
        ){

            throw new Error(
                "Update setelah restore EDIT_WO gagal."
            );

        }


        Logger.log(
            "UPDATE AFTER RESTORE PASS"
        );


    } finally {

        /**
         * ========================================
         * SAFETY RESTORE
         * ========================================
         */

        RolePermissionRepository.updateStatus(
            rolePermissionId,
            originalStatus
        );


        Logger.log(
            "PERMISSION SAFETY RESTORE EXECUTED"
        );

    }


    /**
     * ========================================
     * FINAL VERIFY
     * ========================================
     */

    const finalPermission =
        PermissionService.can(
            permission
        );


    if(!finalPermission){

        throw new Error(
            "FINAL SAFETY CHECK FAILED: EDIT_WO tidak aktif."
        );

    }


    Logger.log(
        "FINAL EDIT_WO:"
    );

    Logger.log(
        finalPermission
    );


    Logger.log("================================");
    Logger.log(
        "WORK ORDER JASA EDIT_WO PERMISSION " +
        "DISABLE / RESTORE TEST PASS"
    );
    Logger.log("================================");

}

function testWorkOrderJasaStatusTransitionLifecycle(){

    Logger.log("================================");
    Logger.log("WORK ORDER JASA STATUS LIFECYCLE TEST");
    Logger.log("================================");


    const workOrderJasaId =
        "WOJ2608110004";


    const row =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    if(!row){

        throw new Error(
            "Fixture Work Order Jasa tidak ditemukan: " +
            workOrderJasaId
        );

    }


    Logger.log("FIXTURE:");
    Logger.log(workOrderJasaId);

    Logger.log("INITIAL STATUS:");
    Logger.log(
        row[
            COL_WO_JASA.STATUS
        ]
    );


    /**
     * ========================================
     * TEST 1
     * OPEN → PROGRESS
     * ========================================
     */

    Logger.log("--------------------------------");
    Logger.log("TEST 1: OPEN → PROGRESS");
    Logger.log("--------------------------------");


    const beforeOpen =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    if(
        beforeOpen[
            COL_WO_JASA.STATUS
        ] !==
        WorkOrderJasaStatus.OPEN
    ){

        throw new Error(
            "Fixture harus berada pada status OPEN."
        );

    }


    const progressResult =
        WorkOrderJasaService.changeStatus(
            workOrderJasaId,
            WorkOrderJasaStatus.PROGRESS
        );


    Logger.log("RESULT:");
    Logger.log(progressResult);


    const afterProgress =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log("STATUS AFTER:");
    Logger.log(
        afterProgress[
            COL_WO_JASA.STATUS
        ]
    );


    if(
        afterProgress[
            COL_WO_JASA.STATUS
        ] !==
        WorkOrderJasaStatus.PROGRESS
    ){

        throw new Error(
            "OPEN → PROGRESS gagal."
        );

    }


    Logger.log(
        "OPEN → PROGRESS PASS"
    );


    /**
     * ========================================
     * TEST 2
     * PROGRESS → DONE
     * ========================================
     */

    Logger.log("--------------------------------");
    Logger.log("TEST 2: PROGRESS → DONE");
    Logger.log("--------------------------------");


    const doneResult =
        WorkOrderJasaService.changeStatus(
            workOrderJasaId,
            WorkOrderJasaStatus.DONE
        );


    Logger.log("RESULT:");
    Logger.log(doneResult);


    const afterDone =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log("STATUS AFTER:");
    Logger.log(
        afterDone[
            COL_WO_JASA.STATUS
        ]
    );


    if(
        afterDone[
            COL_WO_JASA.STATUS
        ] !==
        WorkOrderJasaStatus.DONE
    ){

        throw new Error(
            "PROGRESS → DONE gagal."
        );

    }


    Logger.log(
        "PROGRESS → DONE PASS"
    );


    /**
     * ========================================
     * TEST 3
     * DONE → OPEN
     * ========================================
     */

    Logger.log("--------------------------------");
    Logger.log("TEST 3: DONE → OPEN");
    Logger.log("--------------------------------");


    let doneToOpenRejected =
        false;


    try {

        WorkOrderJasaService.changeStatus(
            workOrderJasaId,
            WorkOrderJasaStatus.OPEN
        );


    } catch(error){

        doneToOpenRejected = true;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    if(!doneToOpenRejected){

        throw new Error(
            "DONE → OPEN seharusnya ditolak."
        );

    }


    const afterDoneRejected =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    if(
        afterDoneRejected[
            COL_WO_JASA.STATUS
        ] !==
        WorkOrderJasaStatus.DONE
    ){

        throw new Error(
            "Status berubah meskipun DONE → OPEN ditolak."
        );

    }


    Logger.log(
        "DONE → OPEN REJECTED PASS"
    );


    /**
     * ========================================
     * RESTORE FIXTURE
     * ========================================
     */

    Logger.log("--------------------------------");
    Logger.log("RESTORE FIXTURE");
    Logger.log("--------------------------------");


    const fixtureRow =
        WorkOrderJasaRepository.findRowById(
            workOrderJasaId
        );


    if(fixtureRow === 0){

        throw new Error(
            "Fixture tidak ditemukan saat restore."
        );

    }


    WorkOrderJasaRepository
        .sheet()
        .getRange(
            fixtureRow,
            COL_WO_JASA.STATUS + 1
        )
        .setValue(
            WorkOrderJasaStatus.OPEN
        );


    const restored =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    Logger.log(
        "RESTORED STATUS:"
    );

    Logger.log(
        restored[
            COL_WO_JASA.STATUS
        ]
    );


    if(
        restored[
            COL_WO_JASA.STATUS
        ] !==
        WorkOrderJasaStatus.OPEN
    ){

        throw new Error(
            "Fixture gagal dikembalikan ke OPEN."
        );

    }


    Logger.log(
        "FIXTURE RESTORE PASS"
    );


    Logger.log("================================");
    Logger.log(
        "WORK ORDER JASA STATUS LIFECYCLE TEST PASS"
    );
    Logger.log("================================");

}

function testWorkOrderJasaChangeStatusPermissionDisableRestore(){

    Logger.log("================================");
    Logger.log(
        "WORK ORDER JASA CHANGE STATUS"
    );
    Logger.log(
        "PERMISSION DISABLE / RESTORE TEST"
    );
    Logger.log("================================");


    const role =
        PermissionService.getCurrentUser().role;

    const permission =
        Permission.EDIT_WO;


    Logger.log("ROLE:");
    Logger.log(role);

    Logger.log("PERMISSION:");
    Logger.log(permission);


    const permissionRow =
        RolePermissionRepository.findPermission(
            role,
            permission
        );


    if(!permissionRow){

        throw new Error(
            "Role Permission tidak ditemukan: " +
            role +
            " / " +
            permission
        );

    }


    const rolePermissionId =
        permissionRow[
            COL_ROLE_PERMISSION.ID
        ];


    const originalStatus =
        permissionRow[
            COL_ROLE_PERMISSION.STATUS
        ];


    Logger.log(
        "ROLE PERMISSION ID:"
    );

    Logger.log(
        rolePermissionId
    );


    Logger.log(
        "ORIGINAL STATUS:"
    );

    Logger.log(
        originalStatus
    );


    if(
        String(originalStatus)
            .trim()
            .toUpperCase()
        !==
        "AKTIF"
    ){

        throw new Error(
            "Fixture EDIT_WO harus AKTIF sebelum test."
        );

    }


    const workOrderJasaId =
        "WOJ2608110004";


    const before =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    if(!before){

        throw new Error(
            "Fixture WO Jasa tidak ditemukan: " +
            workOrderJasaId
        );

    }


    if(
        before[
            COL_WO_JASA.STATUS
        ] !==
        WorkOrderJasaStatus.OPEN
    ){

        throw new Error(
            "Fixture harus OPEN sebelum test."
        );

    }


    Logger.log("FIXTURE:");
    Logger.log(workOrderJasaId);

    Logger.log("STATUS:");
    Logger.log(
        before[
            COL_WO_JASA.STATUS
        ]
    );


    try {

        /**
         * ========================================
         * PRE-CHECK
         * ========================================
         */

        const preCheck =
            PermissionService.can(
                permission
            );


        Logger.log(
            "PRE-CHECK EDIT_WO:"
        );

        Logger.log(
            preCheck
        );


        if(!preCheck){

            throw new Error(
                "EDIT_WO seharusnya aktif."
            );

        }


        /**
         * ========================================
         * DISABLE EDIT_WO
         * ========================================
         */

        Logger.log("--------------------------------");
        Logger.log("DISABLE EDIT_WO");
        Logger.log("--------------------------------");


        RolePermissionRepository.updateStatus(
            rolePermissionId,
            "NONAKTIF"
        );


        const afterDisable =
            PermissionService.can(
                permission
            );


        Logger.log(
            "HAS PERMISSION AFTER DISABLE:"
        );

        Logger.log(
            afterDisable
        );


        if(afterDisable){

            throw new Error(
                "EDIT_WO masih aktif setelah disable."
            );

        }


        Logger.log(
            "DISABLE PERMISSION PASS"
        );


        /**
         * ========================================
         * TEST CHANGE STATUS
         * ========================================
         */

        Logger.log("--------------------------------");
        Logger.log(
            "TEST CHANGE STATUS WITHOUT EDIT_WO"
        );
        Logger.log("--------------------------------");


        let rejected =
            false;


        try {

            WorkOrderJasaService.changeStatus(
                workOrderJasaId,
                WorkOrderJasaStatus.PROGRESS
            );


        } catch(error){

            rejected = true;


            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );


            Logger.log(
                "CHANGE STATUS WITHOUT PERMISSION " +
                "REJECTED PASS"
            );

        }


        if(!rejected){

            throw new Error(
                "Change status tidak ditolak ketika EDIT_WO NONAKTIF."
            );

        }


        /**
         * ========================================
         * VERIFY STATUS TETAP OPEN
         * ========================================
         */

        const afterRejected =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "STATUS AFTER REJECT:"
        );

        Logger.log(
            afterRejected[
                COL_WO_JASA.STATUS
            ]
        );


        if(
            afterRejected[
                COL_WO_JASA.STATUS
            ] !==
            WorkOrderJasaStatus.OPEN
        ){

            throw new Error(
                "Status berubah walaupun permission ditolak."
            );

        }


        Logger.log(
            "STATUS UNCHANGED PASS"
        );


        /**
         * ========================================
         * RESTORE PERMISSION
         * ========================================
         */

        Logger.log("--------------------------------");
        Logger.log("RESTORE EDIT_WO");
        Logger.log("--------------------------------");


        RolePermissionRepository.updateStatus(
            rolePermissionId,
            originalStatus
        );


        const afterRestore =
            PermissionService.can(
                permission
            );


        Logger.log(
            "HAS PERMISSION AFTER RESTORE:"
        );

        Logger.log(
            afterRestore
        );


        if(!afterRestore){

            throw new Error(
                "EDIT_WO gagal direstore."
            );

        }


        Logger.log(
            "RESTORE PERMISSION PASS"
        );


        /**
         * ========================================
         * TEST CHANGE STATUS AFTER RESTORE
         * ========================================
         */

        Logger.log("--------------------------------");
        Logger.log(
            "TEST CHANGE STATUS AFTER RESTORE"
        );
        Logger.log("--------------------------------");


        const result =
            WorkOrderJasaService.changeStatus(
                workOrderJasaId,
                WorkOrderJasaStatus.PROGRESS
            );


        Logger.log(
            "FINAL CHANGE STATUS RESULT:"
        );

        Logger.log(
            result
        );


        if(
            !result ||
            !result.success
        ){

            throw new Error(
                "Change status setelah restore gagal."
            );

        }


        const afterSuccess =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            afterSuccess[
                COL_WO_JASA.STATUS
            ]
        );


        if(
            afterSuccess[
                COL_WO_JASA.STATUS
            ] !==
            WorkOrderJasaStatus.PROGRESS
        ){

            throw new Error(
                "Status tidak berubah menjadi PROGRESS setelah restore."
            );

        }


        Logger.log(
            "CHANGE STATUS AFTER RESTORE PASS"
        );


    } finally {

        /**
         * ========================================
         * SAFETY RESTORE PERMISSION
         * ========================================
         */

        RolePermissionRepository.updateStatus(
            rolePermissionId,
            originalStatus
        );


        /**
         * ========================================
         * SAFETY RESTORE FIXTURE STATUS
         * ========================================
         */

        const fixtureRow =
            WorkOrderJasaRepository.findRowById(
                workOrderJasaId
            );


        if(fixtureRow !== 0){

            WorkOrderJasaRepository
                .sheet()
                .getRange(
                    fixtureRow,
                    COL_WO_JASA.STATUS + 1
                )
                .setValue(
                    WorkOrderJasaStatus.OPEN
                );

        }


        Logger.log(
            "PERMISSION SAFETY RESTORE EXECUTED"
        );

        Logger.log(
            "FIXTURE SAFETY RESTORE EXECUTED"
        );

    }


    /**
     * ========================================
     * FINAL VERIFY
     * ========================================
     */

    const finalPermission =
        PermissionService.can(
            permission
        );


    if(!finalPermission){

        throw new Error(
            "FINAL SAFETY CHECK FAILED: EDIT_WO tidak aktif."
        );

    }


    const finalRow =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    if(
        !finalRow ||
        finalRow[
            COL_WO_JASA.STATUS
        ] !==
        WorkOrderJasaStatus.OPEN
    ){

        throw new Error(
            "FINAL SAFETY CHECK FAILED: fixture bukan OPEN."
        );

    }


    Logger.log(
        "FINAL EDIT_WO:"
    );

    Logger.log(
        finalPermission
    );


    Logger.log(
        "FINAL FIXTURE STATUS:"
    );

    Logger.log(
        finalRow[
            COL_WO_JASA.STATUS
        ]
    );


    Logger.log("================================");

    Logger.log(
        "WORK ORDER JASA CHANGE STATUS " +
        "PERMISSION DISABLE / RESTORE TEST PASS"
    );

    Logger.log("================================");

}

function testWorkOrderJasaEditLockLifecycle(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA EDIT LOCK TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608110001";

    const jasaId =
        "JAS000007";

    let workOrderJasaId =
        "";


    try {

        /**
         * ========================================
         * STEP 1
         * CREATE FIXTURE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 1: CREATE FIXTURE"
        );

        Logger.log(
            "--------------------------------"
        );


        const createResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    jasaId,

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "EDIT LOCK INITIAL",

                diagnosa :
                    "EDIT LOCK INITIAL",

                catatan :
                    "EDIT LOCK TEST"

            });


        Logger.log(
            "CREATE RESULT:"
        );

        Logger.log(
            createResult
        );


        if(
            !createResult ||
            !createResult.workOrderJasaId
        ){

            throw new Error(
                "Gagal membuat fixture Edit Lock."
            );

        }


        workOrderJasaId =
            createResult.workOrderJasaId;


        /**
         * ========================================
         * VERIFY OPEN
         * ========================================
         */

        let row =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        if(
            row[
                COL_WO_JASA.STATUS
            ] !==
            WorkOrderJasaStatus.OPEN
        ){

            throw new Error(
                "Fixture tidak berada pada status OPEN."
            );

        }


        /**
         * ========================================
         * STEP 2
         * OPEN → UPDATE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 2: UPDATE WHILE OPEN"
        );

        Logger.log(
            "--------------------------------"
        );


        const openUpdate =
            WorkOrderJasaService.update({

                workOrderJasaId :
                    workOrderJasaId,

                keluhan :
                    "OPEN UPDATE PASS",

                diagnosa :
                    "OPEN UPDATE PASS",

                catatan :
                    "OPEN UPDATE PASS"

            });


        Logger.log(
            "UPDATE RESULT:"
        );

        Logger.log(
            openUpdate
        );


        if(
            !openUpdate ||
            !openUpdate.success
        ){

            throw new Error(
                "Update saat OPEN seharusnya berhasil."
            );

        }


        row =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        if(
            row[
                COL_WO_JASA.KELUHAN
            ] !==
            "OPEN UPDATE PASS"
        ){

            throw new Error(
                "Data keluhan gagal di-update saat OPEN."
            );

        }


        Logger.log(
            "OPEN UPDATE PASS"
        );


        /**
         * ========================================
         * STEP 3
         * OPEN → PROGRESS
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 3: OPEN → PROGRESS"
        );

        Logger.log(
            "--------------------------------"
        );


        const progressResult =
            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.PROGRESS

            );


        Logger.log(
            progressResult
        );


        if(
            !progressResult ||
            !progressResult.success ||
            progressResult.status !==
                WorkOrderJasaStatus.PROGRESS
        ){

            throw new Error(
                "Fixture gagal menjadi PROGRESS."
            );

        }


        /**
         * ========================================
         * STEP 4
         * PROGRESS → UPDATE MUST FAIL
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 4: UPDATE WHILE PROGRESS"
        );

        Logger.log(
            "--------------------------------"
        );


        row =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        const beforeProgressUpdate =
            row[
                COL_WO_JASA.KELUHAN
            ];


        let progressRejected =
            false;


        try {

            WorkOrderJasaService.update({

                workOrderJasaId :
                    workOrderJasaId,

                keluhan :
                    "SHOULD NOT BE SAVED"

            });

        } catch(error) {

            progressRejected =
                true;

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!progressRejected){

            throw new Error(
                "Update saat PROGRESS tidak ditolak."
            );

        }


        row =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        if(
            row[
                COL_WO_JASA.KELUHAN
            ] !==
            beforeProgressUpdate
        ){

            throw new Error(
                "Data berubah meskipun update PROGRESS ditolak."
            );

        }


        Logger.log(
            "PROGRESS UPDATE REJECTED PASS"
        );


        /**
         * ========================================
         * STEP 5
         * PROGRESS → DONE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 5: PROGRESS → DONE"
        );

        Logger.log(
            "--------------------------------"
        );


        const doneResult =
            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.DONE

            );


        Logger.log(
            doneResult
        );


        if(
            !doneResult ||
            !doneResult.success ||
            doneResult.status !==
                WorkOrderJasaStatus.DONE
        ){

            throw new Error(
                "Fixture gagal menjadi DONE."
            );

        }


        /**
         * ========================================
         * STEP 6
         * DONE → UPDATE MUST FAIL
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 6: UPDATE WHILE DONE"
        );

        Logger.log(
            "--------------------------------"
        );


        row =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        const beforeDoneUpdate =
            row[
                COL_WO_JASA.KELUHAN
            ];


        let doneRejected =
            false;


        try {

            WorkOrderJasaService.update({

                workOrderJasaId :
                    workOrderJasaId,

                keluhan :
                    "SHOULD NOT BE SAVED AFTER DONE"

            });

        } catch(error) {

            doneRejected =
                true;

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!doneRejected){

            throw new Error(
                "Update saat DONE tidak ditolak."
            );

        }


        row =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        if(
            row[
                COL_WO_JASA.KELUHAN
            ] !==
            beforeDoneUpdate
        ){

            throw new Error(
                "Data berubah meskipun update DONE ditolak."
            );

        }


        Logger.log(
            "DONE UPDATE REJECTED PASS"
        );


        /**
         * ========================================
         * STEP 7
         * FINAL STATUS VERIFY
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 7: FINAL STATUS"
        );

        Logger.log(
            "--------------------------------"
        );


        row =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            row[
                COL_WO_JASA.STATUS
            ]
        );


        if(
            row[
                COL_WO_JASA.STATUS
            ] !==
            WorkOrderJasaStatus.DONE
        ){

            throw new Error(
                "Final status fixture bukan DONE."
            );

        }


        /**
         * ========================================
         * SUCCESS
         * ========================================
         */

        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER JASA EDIT LOCK TEST PASS"
        );

        Logger.log(
            "================================"
        );


    } finally {

        /**
         * ========================================
         * CLEANUP
         * ========================================
         *
         * DONE tidak dapat dikembalikan ke OPEN
         * melalui service karena lifecycle memang
         * mengunci status terminal.
         *
         * Untuk fixture test, cleanup dilakukan
         * langsung melalui repository.
         * ========================================
         */

        if(
            workOrderJasaId
        ){

            const cleanupRow =
                WorkOrderJasaRepository.findRowById(
                    workOrderJasaId
                );


            if(
                cleanupRow !== 0
            ){

                WorkOrderJasaRepository
                    .sheet()
                    .deleteRow(
                        cleanupRow
                    );

                Logger.log(
                    "EDIT LOCK FIXTURE CLEANUP PASS"
                );

            }

        }

    }

}

function testWorkOrderJasaCancelLockLifecycle(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER JASA CANCEL LOCK TEST"
    );

    Logger.log(
        "================================"
    );

    const workOrderId =
        "WO2608110001";

    const jasaId =
        "JAS000007";

    let workOrderJasaId = "";

    try {

        /**
         * ========================================
         * STEP 1: CREATE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 1: CREATE FIXTURE"
        );

        Logger.log(
            "--------------------------------"
        );

        const createResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    jasaId,

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "CANCEL LOCK INITIAL",

                diagnosa :
                    "CANCEL LOCK INITIAL",

                catatan :
                    "CANCEL LOCK TEST"

            });


        Logger.log(
            "CREATE RESULT:"
        );

        Logger.log(
            createResult
        );


        if(
            !createResult ||
            !createResult.workOrderJasaId
        ){

            throw new Error(
                "Gagal membuat fixture Cancel Lock."
            );

        }


        workOrderJasaId =
            createResult.workOrderJasaId;


        /**
         * ========================================
         * STEP 2: OPEN → CANCEL
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 2: OPEN → CANCEL"
        );

        Logger.log(
            "--------------------------------"
        );


        const cancelResult =
            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.CANCEL

            );


        Logger.log(
            "CANCEL RESULT:"
        );

        Logger.log(
            cancelResult
        );


        if(
            !cancelResult ||
            !cancelResult.success ||
            cancelResult.status !==
                WorkOrderJasaStatus.CANCEL
        ){

            throw new Error(
                "OPEN → CANCEL gagal."
            );

        }


        Logger.log(
            "OPEN → CANCEL PASS"
        );


        /**
         * ========================================
         * STEP 3: CANCEL → UPDATE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 3: UPDATE WHILE CANCEL"
        );

        Logger.log(
            "--------------------------------"
        );


        const before =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        const beforeKeluhan =
            before[
                COL_WO_JASA.KELUHAN
            ];


        let updateRejected =
            false;


        try {

            WorkOrderJasaService.update({

                workOrderJasaId :
                    workOrderJasaId,

                keluhan :
                    "SHOULD NOT BE SAVED"

            });

        } catch(error) {

            updateRejected =
                true;

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!updateRejected){

            throw new Error(
                "Update saat CANCEL tidak ditolak."
            );

        }


        const afterUpdateAttempt =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        if(
            afterUpdateAttempt[
                COL_WO_JASA.KELUHAN
            ] !==
            beforeKeluhan
        ){

            throw new Error(
                "Data berubah setelah update CANCEL."
            );

        }


        Logger.log(
            "CANCEL UPDATE REJECTED PASS"
        );


        /**
         * ========================================
         * STEP 4: CANCEL → PROGRESS
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 4: CANCEL → PROGRESS"
        );

        Logger.log(
            "--------------------------------"
        );


        let progressRejected =
            false;


        try {

            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.PROGRESS

            );

        } catch(error) {

            progressRejected =
                true;

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!progressRejected){

            throw new Error(
                "CANCEL → PROGRESS tidak ditolak."
            );

        }


        Logger.log(
            "CANCEL → PROGRESS REJECTED PASS"
        );


        /**
         * ========================================
         * STEP 5: CANCEL → DONE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 5: CANCEL → DONE"
        );

        Logger.log(
            "--------------------------------"
        );


        let doneRejected =
            false;


        try {

            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.DONE

            );

        } catch(error) {

            doneRejected =
                true;

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!doneRejected){

            throw new Error(
                "CANCEL → DONE tidak ditolak."
            );

        }


        Logger.log(
            "CANCEL → DONE REJECTED PASS"
        );


        /**
         * ========================================
         * STEP 6: CANCEL → OPEN
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 6: CANCEL → OPEN"
        );

        Logger.log(
            "--------------------------------"
        );


        let openRejected =
            false;


        try {

            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.OPEN

            );

        } catch(error) {

            openRejected =
                true;

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!openRejected){

            throw new Error(
                "CANCEL → OPEN tidak ditolak."
            );

        }


        Logger.log(
            "CANCEL → OPEN REJECTED PASS"
        );


        /**
         * ========================================
         * STEP 7: FINAL STATUS
         * ========================================
         */

        const finalRow =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            finalRow[
                COL_WO_JASA.STATUS
            ]
        );


        if(
            finalRow[
                COL_WO_JASA.STATUS
            ] !==
            WorkOrderJasaStatus.CANCEL
        ){

            throw new Error(
                "Final status bukan CANCEL."
            );

        }


        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER JASA CANCEL LOCK TEST PASS"
        );

        Logger.log(
            "================================"
        );


    } finally {

        /**
         * ========================================
         * CLEANUP
         * ========================================
         */

        if(
            workOrderJasaId
        ){

            const row =
                WorkOrderJasaRepository.findRowById(
                    workOrderJasaId
                );


            if(
                row !== 0
            ){

                WorkOrderJasaRepository
                    .sheet()
                    .deleteRow(
                        row
                    );

                Logger.log(
                    "CANCEL LOCK FIXTURE CLEANUP PASS"
                );

            }

        }

    }

}

function testWorkOrderCompletionGateJasaEnforcement(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER COMPLETION GATE"
    );

    Logger.log(
        "JASA ENFORCEMENT INTEGRATION TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608110001";

    const jasaId =
        "JAS000007";


    let workOrderJasaId =
        "";


    let originalWorkOrderStatus;


    try {

        /**
         * ========================================
         * STEP 1
         * LOAD WORK ORDER
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 1: LOAD WORK ORDER"
        );

        Logger.log(
            "--------------------------------"
        );


        const workOrder =
            WorkOrderRepository.findById(
                workOrderId
            );


        if(!workOrder){

            throw new Error(
                "Work Order fixture tidak ditemukan: " +
                workOrderId
            );

        }


        originalWorkOrderStatus =
            workOrder[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "WORK ORDER:"
        );

        Logger.log(
            workOrderId
        );


        Logger.log(
            "ORIGINAL STATUS:"
        );

        Logger.log(
            originalWorkOrderStatus
        );


        /**
         * ========================================
         * STEP 2
         * CREATE JASA
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 2: CREATE INCOMPLETE JASA"
        );

        Logger.log(
            "--------------------------------"
        );


        const createResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    jasaId,

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "WO COMPLETION GATE TEST",

                diagnosa :
                    "Jasa belum selesai",

                catatan :
                    "Parent WO completion gate test"

            });


        Logger.log(
            "CREATE JASA RESULT:"
        );

        Logger.log(
            createResult
        );


        if(
            !createResult ||
            !createResult.workOrderJasaId
        ){

            throw new Error(
                "Gagal membuat fixture WO Jasa."
            );

        }


        workOrderJasaId =
            createResult.workOrderJasaId;


        /**
         * ========================================
         * STEP 3
         * VERIFY COMPLETION GATE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 3: VERIFY COMPLETION GATE"
        );

        Logger.log(
            "--------------------------------"
        );


        const completion =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        Logger.log(
            "COMPLETION RESULT:"
        );

        Logger.log(
            completion
        );


        if(
            completion.canComplete !==
            false
        ){

            throw new Error(
                "Completion Gate seharusnya FALSE."
            );

        }


        if(
            completion.jasa.belumSelesai <=
            0
        ){

            throw new Error(
                "Completion Gate seharusnya memiliki jasa belum selesai."
            );

        }


        Logger.log(
            "COMPLETION GATE FAILURE DETECTED PASS"
        );


        /**
         * ========================================
         * STEP 4
         * TRY COMPLETE WORK ORDER
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 4: COMPLETE WO WITH INCOMPLETE JASA"
        );

        Logger.log(
            "--------------------------------"
        );


        let rejected =
            false;


        try {

            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );

        } catch(error) {

            rejected =
                true;


            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!rejected){

            throw new Error(
                "Work Order berhasil diselesaikan " +
                "padahal masih ada jasa yang belum selesai."
            );

        }


        Logger.log(
            "COMPLETE WITH INCOMPLETE JASA REJECTED PASS"
        );


        /**
         * ========================================
         * STEP 5
         * VERIFY WO STATUS UNCHANGED
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 5: VERIFY WO STATUS"
        );

        Logger.log(
            "--------------------------------"
        );


        const afterRejected =
            WorkOrderRepository.findById(
                workOrderId
            );


        const statusAfterRejected =
            afterRejected[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "STATUS AFTER REJECT:"
        );

        Logger.log(
            statusAfterRejected
        );


        if(
            statusAfterRejected !==
            originalWorkOrderStatus
        ){

            throw new Error(
                "Status Work Order berubah " +
                "meskipun completion ditolak."
            );

        }


        Logger.log(
            "WO STATUS UNCHANGED PASS"
        );


        /**
         * ========================================
         * STEP 6
         * COMPLETE JASA
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 6: COMPLETE JASA"
        );

        Logger.log(
            "--------------------------------"
        );


        const progressResult =
            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.PROGRESS

            );


        Logger.log(
            "JASA PROGRESS:"
        );

        Logger.log(
            progressResult
        );


        const doneResult =
            WorkOrderJasaService.changeStatus(

                workOrderJasaId,

                WorkOrderJasaStatus.DONE

            );


        Logger.log(
            "JASA DONE:"
        );

        Logger.log(
            doneResult
        );


        /**
         * ========================================
         * STEP 7
         * VERIFY COMPLETION GATE SUCCESS
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 7: VERIFY COMPLETION GATE SUCCESS"
        );

        Logger.log(
            "--------------------------------"
        );


        const completionAfterJasaDone =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        Logger.log(
            "COMPLETION RESULT:"
        );

        Logger.log(
            completionAfterJasaDone
        );


        if(
            completionAfterJasaDone.canComplete !==
            true
        ){

            throw new Error(
                "Completion Gate seharusnya TRUE " +
                "setelah seluruh jasa selesai."
            );

        }


        Logger.log(
            "COMPLETION GATE SUCCESS PASS"
        );


        /**
         * ========================================
         * STEP 8
         * COMPLETE WORK ORDER
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 8: COMPLETE WORK ORDER"
        );

        Logger.log(
            "--------------------------------"
        );


        const finalResult =
            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );


        Logger.log(
            "FINAL RESULT:"
        );

        Logger.log(
            finalResult
        );


        if(
            !finalResult ||
            !finalResult.success
        ){

            throw new Error(
                "Work Order gagal diselesaikan."
            );

        }


        Logger.log(
            "WORK ORDER COMPLETE PASS"
        );


        /**
         * ========================================
         * STEP 9
         * VERIFY FINAL STATUS
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 9: VERIFY FINAL STATUS"
        );

        Logger.log(
            "--------------------------------"
        );


        const finalWorkOrder =
            WorkOrderRepository.findById(
                workOrderId
            );


        const finalStatus =
            finalWorkOrder[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            finalStatus
        );


        if(
            finalStatus !==
            WorkOrderStatus.SELESAI
        ){

            throw new Error(
                "Final status Work Order bukan SELESAI."
            );

        }


        Logger.log(
            "FINAL STATUS PASS"
        );


        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER COMPLETION GATE"
        );

        Logger.log(
            "JASA ENFORCEMENT INTEGRATION TEST PASS"
        );

        Logger.log(
            "================================"
        );


    } finally {

        /**
         * ========================================
         * CLEANUP JASA
         * ========================================
         */

        if(
            workOrderJasaId
        ){

            const jasaRow =
                WorkOrderJasaRepository.findRowById(
                    workOrderJasaId
                );


            if(
                jasaRow !== 0
            ){

                WorkOrderJasaRepository
                    .sheet()
                    .deleteRow(
                        jasaRow
                    );

                Logger.log(
                    "JASA FIXTURE CLEANUP PASS"
                );

            }

        }


        /**
         * ========================================
         * RESTORE WORK ORDER
         * ========================================
         */

        const currentWorkOrder =
            WorkOrderRepository.findById(
                workOrderId
            );


        if(
            currentWorkOrder &&
            originalWorkOrderStatus
        ){

            const currentStatus =
                currentWorkOrder[
                    COL_WORK_ORDER.STATUS
                ];


            if(
                currentStatus !==
                originalWorkOrderStatus
            ){

                WorkOrderRepository.updateStatus(

                    workOrderId,

                    originalWorkOrderStatus

                );

                Logger.log(
                    "WORK ORDER STATUS RESTORED:"
                );

                Logger.log(
                    originalWorkOrderStatus
                );

            }

        }

    }

}

function testWorkOrderCompletionGateJasaEnforcementV2(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER COMPLETION GATE JASA"
    );

    Logger.log(
        "INTEGRATION ENFORCEMENT V2"
    );

    Logger.log(
        "================================"
    );


    let workOrderId = "";

    let workOrderJasaId = "";


    try {

        /**
         * ========================================
         * 1. CREATE WORK ORDER
         * ========================================
         */

        Logger.log(
            "STEP 1: CREATE WORK ORDER"
        );


        const woResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    18000,

                prioritas :
                    WorkOrderPriority.NORMAL,

                admin :
                    "Completion Gate Jasa V2",

                catatan :
                    "Completion Gate Jasa Enforcement V2",

                jenisTransaksi :
                    WorkOrderType.SERVICE

            });


        workOrderId =
            woResult.workOrderId;


        Logger.log(
            "WORK ORDER ID:"
        );

        Logger.log(
            workOrderId
        );


        /**
         * ========================================
         * 2. CREATE JASA
         * ========================================
         */

        Logger.log(
            "STEP 2: CREATE JASA"
        );


        const jasaResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    "JAS000001",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "Completion Gate Jasa V2",

                diagnosa :
                    "Completion Gate Jasa V2",

                catatan :
                    "Integration Test V2"

            });


        workOrderJasaId =
            jasaResult.workOrderJasaId;


        Logger.log(
            "WORK ORDER JASA ID:"
        );

        Logger.log(
            workOrderJasaId
        );


        /**
         * ========================================
         * 3. COMPLETE JASA
         * ========================================
         *
         * OPEN
         * → PROGRESS
         * → DONE
         */

        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.PROGRESS

        );


        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.DONE

        );


        Logger.log(
            "JASA STATUS:"
        );

        Logger.log(
            WorkOrderJasaRepository
                .findById(
                    workOrderJasaId
                )[
                    COL_WO_JASA.STATUS
                ]
        );


        /**
         * ========================================
         * 4. WO LIFECYCLE → QC
         * ========================================
         */

        Logger.log(
            "STEP 4: WO LIFECYCLE → QC"
        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_DIAGNOSA

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_APPROVAL

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.DALAM_PENGERJAAN

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.QC

        );


        /**
         * ========================================
         * 5. VERIFY COMPLETION GATE
         * ========================================
         */

        Logger.log(
            "STEP 5: COMPLETION GATE"
        );


        const completion =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        Logger.log(
            "COMPLETION RESULT:"
        );

        Logger.log(
            completion
        );


        if(
            completion.canComplete !== true
        ){

            throw new Error(
                "Completion Gate seharusnya TRUE setelah jasa DONE."
            );

        }


        if(
            completion.jasa.total !== 1 ||
            completion.jasa.selesai !== 1 ||
            completion.jasa.belumSelesai !== 0
        ){

            throw new Error(
                "Detail Completion Gate Jasa tidak sesuai."
            );

        }


        Logger.log(
            "COMPLETION GATE SUCCESS PASS"
        );


        /**
         * ========================================
         * 6. QC → SELESAI
         * ========================================
         *
         * Ini adalah integration point utama:
         *
         * COMPLETE_WO
         * +
         * Completion Gate
         * +
         * State Machine
         */

        Logger.log(
            "STEP 6: QC → SELESAI"
        );


        const completeResult =
            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );


        Logger.log(
            "COMPLETE RESULT:"
        );

        Logger.log(
            completeResult
        );


        /**
         * ========================================
         * 7. VERIFY FINAL STATUS
         * ========================================
         */

        const afterComplete =
            WorkOrderRepository.findById(
                workOrderId
            );


        const finalStatus =
            afterComplete[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            finalStatus
        );


        if(
            finalStatus !==
            WorkOrderStatus.SELESAI
        ){

            throw new Error(
                "WO tidak berhasil menjadi SELESAI."
            );

        }


        Logger.log(
            "QC → SELESAI PASS"
        );


        /**
         * ========================================
         * 8. FINAL
         * ========================================
         */

        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER COMPLETION GATE JASA"
        );

        Logger.log(
            "INTEGRATION ENFORCEMENT V2 PASS"
        );

        Logger.log(
            "================================"
        );


    } finally {

        /**
         * ========================================
         * CLEANUP JASA
         * ========================================
         */

        if(
            workOrderJasaId
        ){

            try {

                const row =
                    WorkOrderJasaRepository.findById(
                        workOrderJasaId
                    );


                if(
                    row &&
                    row[
                        COL_WO_JASA.STATUS
                    ] !==
                    WorkOrderJasaStatus.CANCEL
                ){

                    if(
                        row[
                            COL_WO_JASA.STATUS
                        ] ===
                        WorkOrderJasaStatus.OPEN
                    ){

                        WorkOrderJasaService.changeStatus(

                            workOrderJasaId,

                            WorkOrderJasaStatus.CANCEL

                        );

                    }
                    else if(
                        row[
                            COL_WO_JASA.STATUS
                        ] ===
                        WorkOrderJasaStatus.PROGRESS
                    ){

                        WorkOrderJasaService.changeStatus(

                            workOrderJasaId,

                            WorkOrderJasaStatus.CANCEL

                        );

                    }

                }


                Logger.log(
                    "JASA CLEANUP PASS"
                );

            }
            catch(error){

                Logger.log(
                    "JASA CLEANUP ERROR:"
                );

                Logger.log(
                    error.message
                );

            }

        }


        /**
         * ========================================
         * CLEANUP WORK ORDER
         * ========================================
         *
         * WO SELESAI tidak dapat dikembalikan
         * ke status sebelumnya melalui state
         * machine.
         *
         * Karena itu untuk fixture ini kita
         * tidak melakukan reverse transition.
         *
         * Fixture WO baru memang sengaja dibuat
         * khusus untuk integration test.
         * ========================================
         */

        Logger.log(
            "TEST FIXTURE WO:"
        );

        Logger.log(
            workOrderId
        );

    }

}

function testWorkOrderCompletionGateJasaEnforcementFailureV2(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER COMPLETION GATE JASA"
    );

    Logger.log(
        "INTEGRATION ENFORCEMENT FAILURE V2"
    );

    Logger.log(
        "================================"
    );


    let workOrderId = "";

    let workOrderJasaId = "";


    try {

        /**
         * ========================================
         * 1. CREATE WORK ORDER
         * ========================================
         */

        const woResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    18000,

                prioritas :
                    WorkOrderPriority.NORMAL,

                admin :
                    "Completion Gate Failure V2",

                catatan :
                    "Completion Gate Jasa Failure V2",

                jenisTransaksi :
                    WorkOrderType.SERVICE

            });


        workOrderId =
            woResult.workOrderId;


        Logger.log(
            "WORK ORDER ID:"
        );

        Logger.log(
            workOrderId
        );


        /**
         * ========================================
         * 2. CREATE JASA
         * ========================================
         */

        const jasaResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    "JAS000001",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "Completion Gate Failure V2",

                diagnosa :
                    "Jasa belum selesai",

                catatan :
                    "Integration Failure Test V2"

            });


        workOrderJasaId =
            jasaResult.workOrderJasaId;


        Logger.log(
            "WORK ORDER JASA ID:"
        );

        Logger.log(
            workOrderJasaId
        );


        /**
         * ========================================
         * 3. JASA OPEN → PROGRESS
         * ========================================
         *
         * Sengaja TIDAK menjadi DONE.
         */

        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.PROGRESS

        );


        Logger.log(
            "JASA STATUS:"
        );

        Logger.log(
            WorkOrderJasaRepository
                .findById(
                    workOrderJasaId
                )[
                    COL_WO_JASA.STATUS
                ]
        );


        /**
         * ========================================
         * 4. WO LIFECYCLE → QC
         * ========================================
         */

        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_DIAGNOSA

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_APPROVAL

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.DALAM_PENGERJAAN

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.QC

        );


        /**
         * ========================================
         * 5. VERIFY COMPLETION GATE FAILURE
         * ========================================
         */

        const completion =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        Logger.log(
            "COMPLETION RESULT:"
        );

        Logger.log(
            completion
        );


        if(
            completion.canComplete !== false
        ){

            throw new Error(
                "Completion Gate seharusnya FALSE."
            );

        }


        if(
            completion.jasa.total !== 1 ||
            completion.jasa.selesai !== 0 ||
            completion.jasa.belumSelesai !== 1
        ){

            throw new Error(
                "Detail Completion Gate Jasa tidak sesuai."
            );

        }


        Logger.log(
            "COMPLETION GATE FAILURE DETECTED PASS"
        );


        /**
         * ========================================
         * 6. COBA QC → SELESAI
         * ========================================
         */

        Logger.log(
            "STEP 6: QC → SELESAI"
        );


        let errorDetected = false;

        let errorMessage = "";


        try {

            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );

        }
        catch(error){

            errorDetected = true;

            errorMessage =
                error.message;


            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                errorMessage
            );

        }


        /**
         * ========================================
         * 7. VERIFY WO TETAP QC
         * ========================================
         */

        const after =
            WorkOrderRepository.findById(
                workOrderId
            );


        const finalStatus =
            after[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "ERROR DETECTED:"
        );

        Logger.log(
            errorDetected
        );


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            finalStatus
        );


        /**
         * ========================================
         * 8. FINAL ASSERTION
         * ========================================
         */

        if(
            !errorDetected ||
            finalStatus !==
                WorkOrderStatus.QC
        ){

            throw new Error(
                "Completion Gate Failure Test gagal."
            );

        }


        Logger.log(
            "QC → SELESAI REJECTED PASS"
        );


        Logger.log(
            "STATUS TETAP QC PASS"
        );


        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER COMPLETION GATE JASA"
        );

        Logger.log(
            "INTEGRATION ENFORCEMENT FAILURE V2 PASS"
        );

        Logger.log(
            "================================"
        );

    }
    finally {

        /**
         * ========================================
         * CLEANUP JASA
         * ========================================
         */

        if(
            workOrderJasaId
        ){

            try {

                const row =
                    WorkOrderJasaRepository.findById(
                        workOrderJasaId
                    );


                if(
                    row &&
                    row[
                        COL_WO_JASA.STATUS
                    ] ===
                    WorkOrderJasaStatus.PROGRESS
                ){

                    WorkOrderJasaService.changeStatus(

                        workOrderJasaId,

                        WorkOrderJasaStatus.CANCEL

                    );

                }


                Logger.log(
                    "JASA CLEANUP PASS"
                );

            }
            catch(error){

                Logger.log(
                    "JASA CLEANUP ERROR:"
                );

                Logger.log(
                    error.message
                );

            }

        }


        Logger.log(
            "TEST FIXTURE WO:"
        );

        Logger.log(
            workOrderId
        );

    }

}

function testWorkOrderCompleteWOPermissionIntegration(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER COMPLETE_WO"
    );

    Logger.log(
        "PERMISSION INTEGRATION TEST"
    );

    Logger.log(
        "================================"
    );


    let rolePermissionId =
        "";

    let originalPermissionStatus =
        "";


    try{

        /**
         * ========================================
         * STEP 1: CREATE WORK ORDER
         * ========================================
         */

        Logger.log(
            "STEP 1: CREATE WORK ORDER"
        );


        const workOrderResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    18000,

                prioritas :
                    WorkOrderPriority.NORMAL,

                admin :
                    "COMPLETE_WO Permission Test",

                catatan :
                    "COMPLETE_WO Permission Integration Test",

                jenisTransaksi :
                    WorkOrderType.SERVICE

            });


        const workOrderId =
            workOrderResult.workOrderId;


        Logger.log(
            "WORK ORDER ID:"
        );

        Logger.log(
            workOrderId
        );


        /**
         * ========================================
         * STEP 2: CREATE JASA
         * ========================================
         */

        Logger.log(
            "STEP 2: CREATE JASA"
        );


        const jasaResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    "JAS000001",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "COMPLETE_WO Permission Test",

                diagnosa :
                    "Permission integration test",

                catatan :
                    "Jasa permission integration"

            });


        const workOrderJasaId =
            jasaResult.workOrderJasaId;


        Logger.log(
            "WORK ORDER JASA ID:"
        );

        Logger.log(
            workOrderJasaId
        );


        /**
         * ========================================
         * STEP 3: JASA OPEN → PROGRESS
         * ========================================
         */

        Logger.log(
            "STEP 3: JASA OPEN → PROGRESS"
        );


        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.PROGRESS

        );


        /**
         * ========================================
         * STEP 4: JASA PROGRESS → DONE
         * ========================================
         */

        Logger.log(
            "STEP 4: JASA PROGRESS → DONE"
        );


        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.DONE

        );


        const jasaRow =
            WorkOrderJasaRepository.findById(
                workOrderJasaId
            );


        Logger.log(
            "JASA STATUS:"
        );

        Logger.log(
            jasaRow[
                COL_WO_JASA.STATUS
            ]
        );


        if(
            jasaRow[
                COL_WO_JASA.STATUS
            ] !==
            WorkOrderJasaStatus.DONE
        ){

            throw new Error(
                "Jasa fixture seharusnya DONE."
            );

        }


        /**
         * ========================================
         * STEP 5: WO LIFECYCLE → QC
         * ========================================
         */

        Logger.log(
            "STEP 5: WO LIFECYCLE → QC"
        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_DIAGNOSA

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_APPROVAL

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.DALAM_PENGERJAAN

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.QC

        );


        /**
         * ========================================
         * STEP 6: VERIFY COMPLETION GATE
         * ========================================
         */

        Logger.log(
            "STEP 6: VERIFY COMPLETION GATE"
        );


        const completion =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        Logger.log(
            "COMPLETION RESULT:"
        );

        Logger.log(
            completion
        );


        if(
            completion.canComplete !==
            true
        ){

            throw new Error(
                "Completion Gate fixture seharusnya TRUE."
            );

        }


        /**
         * ========================================
         * STEP 7: GET CURRENT ROLE
         * ========================================
         */

        Logger.log(
            "STEP 7: GET CURRENT ROLE"
        );


        const role =
            PermissionService.getCurrentRole();


        Logger.log(
            "ROLE:"
        );

        Logger.log(
            role
        );


        if(!role){

            throw new Error(
                "Current role tidak ditemukan."
            );

        }


        /**
         * ========================================
         * STEP 8: FIND COMPLETE_WO
         * ========================================
         */

        Logger.log(
            "STEP 8: FIND COMPLETE_WO"
        );


        const permissionRow =
            RolePermissionRepository.findPermission(

                role,

                Permission.COMPLETE_WO

            );


        Logger.log(
            "PERMISSION ROW:"
        );

        Logger.log(
            permissionRow
        );


        if(!permissionRow){

            throw new Error(
                "Permission COMPLETE_WO tidak ditemukan untuk role " +
                role
            );

        }


        rolePermissionId =
            permissionRow[
                COL_ROLE_PERMISSION.ID
            ];


        originalPermissionStatus =
            permissionRow[
                COL_ROLE_PERMISSION.STATUS
            ];


        Logger.log(
            "ROLE PERMISSION ID:"
        );

        Logger.log(
            rolePermissionId
        );


        Logger.log(
            "ORIGINAL STATUS:"
        );

        Logger.log(
            originalPermissionStatus
        );


        /**
         * ========================================
         * STEP 9: PRE-CHECK
         * ========================================
         */

        const preCheck =
            RolePermissionRepository.hasPermission(

                role,

                Permission.COMPLETE_WO

            );


        Logger.log(
            "PRE-CHECK COMPLETE_WO:"
        );

        Logger.log(
            preCheck
        );


        if(
            preCheck !== true
        ){

            throw new Error(
                "Fixture awal harus memiliki COMPLETE_WO."
            );

        }


        /**
         * ========================================
         * STEP 10: DISABLE COMPLETE_WO
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 10: DISABLE COMPLETE_WO"
        );

        Logger.log(
            "--------------------------------"
        );


        RolePermissionRepository.updateStatus(

            rolePermissionId,

            "NONAKTIF"

        );


        const afterDisable =
            RolePermissionRepository.hasPermission(

                role,

                Permission.COMPLETE_WO

            );


        Logger.log(
            "HAS COMPLETE_WO AFTER DISABLE:"
        );

        Logger.log(
            afterDisable
        );


        if(
            afterDisable !== false
        ){

            throw new Error(
                "COMPLETE_WO seharusnya false setelah disable."
            );

        }


        Logger.log(
            "DISABLE COMPLETE_WO PASS"
        );


        /**
         * ========================================
         * STEP 11: COMPLETE WITHOUT PERMISSION
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 11: COMPLETE WITHOUT COMPLETE_WO"
        );

        Logger.log(
            "--------------------------------"
        );


        let rejected =
            false;


        try{

            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );

        }
        catch(error){

            rejected =
                true;


            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(
            !rejected
        ){

            throw new Error(
                "Completion seharusnya ditolak tanpa COMPLETE_WO."
            );

        }


        const statusAfterReject =
            WorkOrderRepository.findById(

                workOrderId

            )[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "STATUS AFTER REJECT:"
        );

        Logger.log(
            statusAfterReject
        );


        if(
            statusAfterReject !==
            WorkOrderStatus.QC
        ){

            throw new Error(
                "WO harus tetap QC setelah COMPLETE_WO ditolak."
            );

        }


        Logger.log(
            "COMPLETE WITHOUT PERMISSION PASS"
        );


        /**
         * ========================================
         * STEP 12: RESTORE COMPLETE_WO
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 12: RESTORE COMPLETE_WO"
        );

        Logger.log(
            "--------------------------------"
        );


        RolePermissionRepository.updateStatus(

            rolePermissionId,

            originalPermissionStatus

        );


        const afterRestore =
            RolePermissionRepository.hasPermission(

                role,

                Permission.COMPLETE_WO

            );


        Logger.log(
            "HAS COMPLETE_WO AFTER RESTORE:"
        );

        Logger.log(
            afterRestore
        );


        if(
            afterRestore !== true
        ){

            throw new Error(
                "COMPLETE_WO gagal direstore."
            );

        }


        Logger.log(
            "RESTORE COMPLETE_WO PASS"
        );


        /**
         * ========================================
         * STEP 13: COMPLETE AFTER RESTORE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 13: COMPLETE AFTER RESTORE"
        );

        Logger.log(
            "--------------------------------"
        );


        const completeResult =
            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );


        Logger.log(
            "COMPLETE RESULT:"
        );

        Logger.log(
            completeResult
        );


        const finalRow =
            WorkOrderRepository.findById(

                workOrderId

            );


        const finalStatus =
            finalRow[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            finalStatus
        );


        if(
            finalStatus !==
            WorkOrderStatus.SELESAI
        ){

            throw new Error(
                "WO seharusnya menjadi SELESAI."
            );

        }


        Logger.log(
            "COMPLETE AFTER RESTORE PASS"
        );


        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER COMPLETE_WO"
        );

        Logger.log(
            "PERMISSION INTEGRATION TEST PASS"
        );

        Logger.log(
            "================================"
        );


    }
    finally{

        /**
         * ========================================
         * SAFETY RESTORE
         * ========================================
         */

        if(
            rolePermissionId &&
            originalPermissionStatus
        ){

            try{

                RolePermissionRepository.updateStatus(

                    rolePermissionId,

                    originalPermissionStatus

                );

                Logger.log(
                    "PERMISSION SAFETY RESTORE PASS"
                );

            }
            catch(error){

                Logger.log(
                    "PERMISSION SAFETY RESTORE ERROR:"
                );

                Logger.log(
                    error.message
                );

            }

        }

    }

}

function testWorkOrderCancelWOPermissionIntegration(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER CANCEL_WO"
    );

    Logger.log(
        "PERMISSION INTEGRATION TEST"
    );

    Logger.log(
        "================================"
    );


    let rolePermissionId =
        "";

    let originalPermissionStatus =
        "";


    try{

        /**
         * ========================================
         * STEP 1: CREATE WORK ORDER
         * ========================================
         */

        Logger.log(
            "STEP 1: CREATE WORK ORDER"
        );


        const workOrderResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    18000,

                prioritas :
                    WorkOrderPriority.NORMAL,

                admin :
                    "CANCEL_WO Permission Test",

                catatan :
                    "CANCEL_WO Permission Integration Test",

                jenisTransaksi :
                    WorkOrderType.SERVICE

            });


        const workOrderId =
            workOrderResult.workOrderId;


        Logger.log(
            "WORK ORDER ID:"
        );

        Logger.log(
            workOrderId
        );


       /**
 * ========================================
 * STEP 2: MOVE WO TO
 * DALAM_PENGERJAAN
 * ========================================
 */

Logger.log(
    "STEP 2: WO LIFECYCLE → DALAM_PENGERJAAN"
);


WorkOrderService.changeStatus(

    workOrderId,

    WorkOrderStatus.MENUNGGU_DIAGNOSA

);


WorkOrderService.changeStatus(

    workOrderId,

    WorkOrderStatus.MENUNGGU_APPROVAL

);


WorkOrderService.changeStatus(

    workOrderId,

    WorkOrderStatus.DALAM_PENGERJAAN

);


const progressRow =
    WorkOrderRepository.findById(
        workOrderId
    );


const progressStatus =
    progressRow[
        COL_WORK_ORDER.STATUS
    ];


Logger.log(
    "WO STATUS:"
);

Logger.log(
    progressStatus
);


if(
    progressStatus !==
    WorkOrderStatus.DALAM_PENGERJAAN
){

    throw new Error(
        "Fixture WO seharusnya berada di DALAM_PENGERJAAN."
    );

}


        /**
         * ========================================
         * STEP 3: GET CURRENT ROLE
         * ========================================
         */

        Logger.log(
            "STEP 3: GET CURRENT ROLE"
        );


        const role =
            PermissionService.getCurrentRole();


        Logger.log(
            "ROLE:"
        );

        Logger.log(
            role
        );


        if(!role){

            throw new Error(
                "Current role tidak ditemukan."
            );

        }


        /**
         * ========================================
         * STEP 4: FIND CANCEL_WO
         * ========================================
         */

        Logger.log(
            "STEP 4: FIND CANCEL_WO"
        );


        const permissionRow =
            RolePermissionRepository.findPermission(

                role,

                Permission.CANCEL_WO

            );


        Logger.log(
            "PERMISSION ROW:"
        );

        Logger.log(
            permissionRow
        );


        if(!permissionRow){

            throw new Error(
                "Permission CANCEL_WO tidak ditemukan untuk role " +
                role
            );

        }


        rolePermissionId =
            permissionRow[
                COL_ROLE_PERMISSION.ID
            ];


        originalPermissionStatus =
            permissionRow[
                COL_ROLE_PERMISSION.STATUS
            ];


        Logger.log(
            "ROLE PERMISSION ID:"
        );

        Logger.log(
            rolePermissionId
        );


        Logger.log(
            "ORIGINAL STATUS:"
        );

        Logger.log(
            originalPermissionStatus
        );


        /**
         * ========================================
         * STEP 5: PRE-CHECK
         * ========================================
         */

        const preCheck =
            RolePermissionRepository.hasPermission(

                role,

                Permission.CANCEL_WO

            );


        Logger.log(
            "PRE-CHECK CANCEL_WO:"
        );

        Logger.log(
            preCheck
        );


        if(
            preCheck !== true
        ){

            throw new Error(
                "Fixture awal harus memiliki CANCEL_WO."
            );

        }


        /**
         * ========================================
         * STEP 6: DISABLE CANCEL_WO
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 6: DISABLE CANCEL_WO"
        );

        Logger.log(
            "--------------------------------"
        );


        RolePermissionRepository.updateStatus(

            rolePermissionId,

            "NONAKTIF"

        );


        const afterDisable =
            RolePermissionRepository.hasPermission(

                role,

                Permission.CANCEL_WO

            );


        Logger.log(
            "HAS CANCEL_WO AFTER DISABLE:"
        );

        Logger.log(
            afterDisable
        );


        if(
            afterDisable !== false
        ){

            throw new Error(
                "CANCEL_WO seharusnya false setelah disable."
            );

        }


        Logger.log(
            "DISABLE CANCEL_WO PASS"
        );


        /**
         * ========================================
         * STEP 7: CANCEL WITHOUT PERMISSION
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 7: CANCEL WITHOUT CANCEL_WO"
        );

        Logger.log(
            "--------------------------------"
        );


        let rejected =
            false;


        try{

            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.DIBATALKAN

            );

        }
        catch(error){

            rejected =
                true;


            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(
            !rejected
        ){

            throw new Error(
                "Cancellation seharusnya ditolak tanpa CANCEL_WO."
            );

        }


        const statusAfterReject =
            WorkOrderRepository.findById(

                workOrderId

            )[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "STATUS AFTER REJECT:"
        );

        Logger.log(
            statusAfterReject
        );


       if(
    statusAfterReject !==
    WorkOrderStatus.DALAM_PENGERJAAN
){

    throw new Error(
        "WO harus tetap DALAM_PENGERJAAN setelah CANCEL_WO ditolak."
    );

}


        Logger.log(
            "CANCEL WITHOUT PERMISSION PASS"
        );


        /**
         * ========================================
         * STEP 8: RESTORE CANCEL_WO
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 8: RESTORE CANCEL_WO"
        );

        Logger.log(
            "--------------------------------"
        );


        RolePermissionRepository.updateStatus(

            rolePermissionId,

            originalPermissionStatus

        );


        const afterRestore =
            RolePermissionRepository.hasPermission(

                role,

                Permission.CANCEL_WO

            );


        Logger.log(
            "HAS CANCEL_WO AFTER RESTORE:"
        );

        Logger.log(
            afterRestore
        );


        if(
            afterRestore !== true
        ){

            throw new Error(
                "CANCEL_WO gagal direstore."
            );

        }


        Logger.log(
            "RESTORE CANCEL_WO PASS"
        );


        /**
         * ========================================
         * STEP 9: CANCEL AFTER RESTORE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 9: CANCEL AFTER RESTORE"
        );

        Logger.log(
            "--------------------------------"
        );


        const cancelResult =
            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.DIBATALKAN

            );


        Logger.log(
            "CANCEL RESULT:"
        );

        Logger.log(
            cancelResult
        );


        const finalRow =
            WorkOrderRepository.findById(

                workOrderId

            );


        const finalStatus =
            finalRow[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            finalStatus
        );


        if(
            finalStatus !==
            WorkOrderStatus.DIBATALKAN
        ){

            throw new Error(
                "WO seharusnya menjadi DIBATALKAN."
            );

        }


        Logger.log(
            "CANCEL AFTER RESTORE PASS"
        );


        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER CANCEL_WO"
        );

        Logger.log(
            "PERMISSION INTEGRATION TEST PASS"
        );

        Logger.log(
            "================================"
        );


    }
    finally{

        /**
         * ========================================
         * SAFETY RESTORE
         * ========================================
         */

        if(
            rolePermissionId &&
            originalPermissionStatus
        ){

            try{

                RolePermissionRepository.updateStatus(

                    rolePermissionId,

                    originalPermissionStatus

                );

                Logger.log(
                    "PERMISSION SAFETY RESTORE PASS"
                );

            }
            catch(error){

                Logger.log(
                    "PERMISSION SAFETY RESTORE ERROR:"
                );

                Logger.log(
                    error.message
                );

            }

        }

    }

}

function testWorkOrderChangeStatusPermissionIntegration(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER CHANGE_STATUS"
    );

    Logger.log(
        "PERMISSION INTEGRATION TEST"
    );

    Logger.log(
        "================================"
    );


    let rolePermissionId =
        "";

    let originalPermissionStatus =
        "";


    try{

        /**
         * ========================================
         * STEP 1: CREATE WORK ORDER
         * ========================================
         */

        Logger.log(
            "STEP 1: CREATE WORK ORDER"
        );


        const workOrderResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    18000,

                prioritas :
                    WorkOrderPriority.NORMAL,

                admin :
                    "CHANGE_STATUS Permission Test",

                catatan :
                    "CHANGE_STATUS Permission Integration Test",

                jenisTransaksi :
                    WorkOrderType.SERVICE

            });


        const workOrderId =
            workOrderResult.workOrderId;


        Logger.log(
            "WORK ORDER ID:"
        );

        Logger.log(
            workOrderId
        );


        /**
         * ========================================
         * STEP 2: VERIFY CURRENT ROLE
         * ========================================
         */

        Logger.log(
            "STEP 2: GET CURRENT ROLE"
        );


        const role =
            PermissionService.getCurrentRole();


        Logger.log(
            "ROLE:"
        );

        Logger.log(
            role
        );


        if(!role){

            throw new Error(
                "Current role tidak ditemukan."
            );

        }


        /**
         * ========================================
         * STEP 3: FIND CHANGE_STATUS
         * ========================================
         */

        Logger.log(
            "STEP 3: FIND CHANGE_STATUS"
        );


        const permissionRow =
            RolePermissionRepository.findPermission(

                role,

                Permission.CHANGE_STATUS

            );


        Logger.log(
            "PERMISSION ROW:"
        );

        Logger.log(
            permissionRow
        );


        if(!permissionRow){

            throw new Error(
                "Permission CHANGE_STATUS tidak ditemukan untuk role " +
                role
            );

        }


        rolePermissionId =
            permissionRow[
                COL_ROLE_PERMISSION.ID
            ];


        originalPermissionStatus =
            permissionRow[
                COL_ROLE_PERMISSION.STATUS
            ];


        Logger.log(
            "ROLE PERMISSION ID:"
        );

        Logger.log(
            rolePermissionId
        );


        Logger.log(
            "ORIGINAL STATUS:"
        );

        Logger.log(
            originalPermissionStatus
        );


        /**
         * ========================================
         * STEP 4: PRE-CHECK
         * ========================================
         */

        Logger.log(
            "STEP 4: PRE-CHECK CHANGE_STATUS"
        );


        const preCheck =
            PermissionService.can(
                Permission.CHANGE_STATUS
            );


        Logger.log(
            "PRE-CHECK CHANGE_STATUS:"
        );

        Logger.log(
            preCheck
        );


        if(
            preCheck !== true
        ){

            throw new Error(
                "Fixture awal harus memiliki CHANGE_STATUS."
            );

        }


        /**
         * ========================================
         * STEP 5: NORMAL STATUS CHANGE
         *
         * DRAFT
         * → MENUNGGU_DIAGNOSA
         * ========================================
         */

        Logger.log(
            "STEP 5: CHANGE STATUS WITH PERMISSION"
        );


        const firstChange =
            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.MENUNGGU_DIAGNOSA

            );


        Logger.log(
            "CHANGE STATUS RESULT:"
        );

        Logger.log(
            firstChange
        );


        if(
            !firstChange ||
            !firstChange.success
        ){

            throw new Error(
                "Change status dengan CHANGE_STATUS aktif gagal."
            );

        }


        /**
         * ========================================
         * STEP 6: DISABLE CHANGE_STATUS
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 6: DISABLE CHANGE_STATUS"
        );

        Logger.log(
            "--------------------------------"
        );


        RolePermissionRepository.updateStatus(

            rolePermissionId,

            "NONAKTIF"

        );


        const afterDisable =
            PermissionService.can(

                Permission.CHANGE_STATUS

            );


        Logger.log(
            "HAS CHANGE_STATUS AFTER DISABLE:"
        );

        Logger.log(
            afterDisable
        );


        if(
            afterDisable !== false
        ){

            throw new Error(
                "CHANGE_STATUS seharusnya false setelah disable."
            );

        }


        Logger.log(
            "DISABLE CHANGE_STATUS PASS"
        );


        /**
         * ========================================
         * STEP 7: CHANGE STATUS
         * WITHOUT PERMISSION
         *
         * MENUNGGU_DIAGNOSA
         * → MENUNGGU_APPROVAL
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 7: CHANGE STATUS WITHOUT CHANGE_STATUS"
        );

        Logger.log(
            "--------------------------------"
        );


        let rejected =
            false;


        try{

            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.MENUNGGU_APPROVAL

            );

        }
        catch(error){

            rejected =
                true;


            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(
            !rejected
        ){

            throw new Error(
                "Change status seharusnya ditolak tanpa CHANGE_STATUS."
            );

        }


        /**
         * ========================================
         * STEP 8: VERIFY STATUS UNCHANGED
         * ========================================
         */

        const afterRejected =
            WorkOrderRepository.findById(

                workOrderId

            );


        const rejectedStatus =
            afterRejected[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "STATUS AFTER REJECT:"
        );

        Logger.log(
            rejectedStatus
        );


        if(
            rejectedStatus !==
            WorkOrderStatus.MENUNGGU_DIAGNOSA
        ){

            throw new Error(
                "Status WO berubah walaupun CHANGE_STATUS ditolak."
            );

        }


        Logger.log(
            "STATUS UNCHANGED PASS"
        );


        /**
         * ========================================
         * STEP 9: RESTORE CHANGE_STATUS
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 9: RESTORE CHANGE_STATUS"
        );

        Logger.log(
            "--------------------------------"
        );


        RolePermissionRepository.updateStatus(

            rolePermissionId,

            originalPermissionStatus

        );


        const afterRestore =
            PermissionService.can(

                Permission.CHANGE_STATUS

            );


        Logger.log(
            "HAS CHANGE_STATUS AFTER RESTORE:"
        );

        Logger.log(
            afterRestore
        );


        if(
            afterRestore !== true
        ){

            throw new Error(
                "CHANGE_STATUS gagal direstore."
            );

        }


        Logger.log(
            "RESTORE CHANGE_STATUS PASS"
        );


        /**
         * ========================================
         * STEP 10: CHANGE STATUS AFTER RESTORE
         * ========================================
         */

        Logger.log(
            "--------------------------------"
        );

        Logger.log(
            "STEP 10: CHANGE STATUS AFTER RESTORE"
        );

        Logger.log(
            "--------------------------------"
        );


        const finalChange =
            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.MENUNGGU_APPROVAL

            );


        Logger.log(
            "FINAL CHANGE RESULT:"
        );

        Logger.log(
            finalChange
        );


        if(
            !finalChange ||
            !finalChange.success
        ){

            throw new Error(
                "Change status setelah restore gagal."
            );

        }


        /**
         * ========================================
         * STEP 11: VERIFY FINAL STATUS
         * ========================================
         */

        const finalRow =
            WorkOrderRepository.findById(

                workOrderId

            );


        const finalStatus =
            finalRow[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            finalStatus
        );


        if(
            finalStatus !==
            WorkOrderStatus.MENUNGGU_APPROVAL
        ){

            throw new Error(
                "WO seharusnya menjadi MENUNGGU_APPROVAL."
            );

        }


        Logger.log(
            "CHANGE STATUS AFTER RESTORE PASS"
        );


        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER CHANGE_STATUS"
        );

        Logger.log(
            "PERMISSION INTEGRATION TEST PASS"
        );

        Logger.log(
            "================================"
        );


    }
    finally{

        /**
         * ========================================
         * SAFETY RESTORE PERMISSION
         * ========================================
         */

        if(
            rolePermissionId &&
            originalPermissionStatus
        ){

            try{

                RolePermissionRepository.updateStatus(

                    rolePermissionId,

                    originalPermissionStatus

                );


                Logger.log(
                    "PERMISSION SAFETY RESTORE PASS"
                );

            }
            catch(error){

                Logger.log(
                    "PERMISSION SAFETY RESTORE ERROR:"
                );

                Logger.log(
                    error.message
                );

            }

        }

    }

}

function testWorkOrderFullLifecycleRegressionV1(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER FULL LIFECYCLE"
    );

    Logger.log(
        "REGRESSION TEST V1"
    );

    Logger.log(
        "================================"
    );


    const workOrderResult =
        WorkOrderService.create({

            customerId :
                "CUS2608160002",

            vehicleId :
                "VEH2608160002",

            kilometerMasuk :
                18000,

            prioritas :
                WorkOrderPriority.NORMAL,

            admin :
                "Full Lifecycle Regression",

            catatan :
                "Deterministic Full Lifecycle Regression Test V1",

            jenisTransaksi :
                WorkOrderType.SERVICE

        });


    const workOrderId =
        workOrderResult.workOrderId;


    Logger.log(
        "WORK ORDER ID:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * STEP 1
     * DRAFT
     * ========================================
     */

    let row =
        WorkOrderRepository.findById(
            workOrderId
        );


    if(
        row[
            COL_WORK_ORDER.STATUS
        ] !==
        WorkOrderStatus.DRAFT
    ){

        throw new Error(
            "WO awal harus DRAFT."
        );

    }


    Logger.log(
        "STEP 1 DRAFT PASS"
    );


    /**
     * ========================================
     * STEP 2
     * DRAFT → MENUNGGU_DIAGNOSA
     * ========================================
     */

    WorkOrderService.changeStatus(
        workOrderId,
        WorkOrderStatus.MENUNGGU_DIAGNOSA
    );


    Logger.log(
        "DRAFT → MENUNGGU_DIAGNOSA PASS"
    );


    /**
     * ========================================
     * STEP 3
     * MENUNGGU_DIAGNOSA
     * → MENUNGGU_APPROVAL
     * ========================================
     */

    WorkOrderService.changeStatus(
        workOrderId,
        WorkOrderStatus.MENUNGGU_APPROVAL
    );


    Logger.log(
        "MENUNGGU_DIAGNOSA → MENUNGGU_APPROVAL PASS"
    );


    /**
     * ========================================
     * STEP 4
     * MENUNGGU_APPROVAL
     * → DALAM_PENGERJAAN
     * ========================================
     */

    WorkOrderService.changeStatus(
        workOrderId,
        WorkOrderStatus.DALAM_PENGERJAAN
    );


    Logger.log(
        "MENUNGGU_APPROVAL → DALAM_PENGERJAAN PASS"
    );


    /**
     * ========================================
     * STEP 5
     * DALAM_PENGERJAAN
     * → MENUNGGU_SPAREPART
     * ========================================
     */

    WorkOrderService.changeStatus(
        workOrderId,
        WorkOrderStatus.MENUNGGU_SPAREPART
    );


    Logger.log(
        "DALAM_PENGERJAAN → MENUNGGU_SPAREPART PASS"
    );


    /**
     * ========================================
     * STEP 6
     * MENUNGGU_SPAREPART
     * → DALAM_PENGERJAAN
     * ========================================
     */

    WorkOrderService.changeStatus(
        workOrderId,
        WorkOrderStatus.DALAM_PENGERJAAN
    );


    Logger.log(
        "MENUNGGU_SPAREPART → DALAM_PENGERJAAN PASS"
    );


    /**
     * ========================================
     * STEP 7
     * DALAM_PENGERJAAN → QC
     * ========================================
     */

    WorkOrderService.changeStatus(
        workOrderId,
        WorkOrderStatus.QC
    );


    row =
        WorkOrderRepository.findById(
            workOrderId
        );


    if(
        row[
            COL_WORK_ORDER.STATUS
        ] !==
        WorkOrderStatus.QC
    ){

        throw new Error(
            "WO seharusnya berada di QC."
        );

    }


    Logger.log(
        "DALAM_PENGERJAAN → QC PASS"
    );


    /**
     * ========================================
     * STEP 8
     * CREATE JASA
     * ========================================
     */

    const jasaResult =
        WorkOrderJasaService.create({

            workOrderId :
                workOrderId,

            jasaId :
                "JAS000001",

            qty :
                1,

            diskon :
                0,

            mekanikId :
                "",

            keluhan :
                "Full Lifecycle Regression",

            diagnosa :
                "Regression Test",

            catatan :
                "Full Lifecycle Regression Test"

        });


    const workOrderJasaId =
        jasaResult.workOrderJasaId;


    Logger.log(
        "WORK ORDER JASA ID:"
    );

    Logger.log(
        workOrderJasaId
    );


    /**
     * ========================================
     * STEP 9
     * JASA OPEN → PROGRESS
     * ========================================
     */

    WorkOrderJasaService.changeStatus(

        workOrderJasaId,

        WorkOrderJasaStatus.PROGRESS

    );


    Logger.log(
        "JASA OPEN → PROGRESS PASS"
    );


    /**
     * ========================================
     * STEP 10
     * JASA PROGRESS → DONE
     * ========================================
     */

    WorkOrderJasaService.changeStatus(

        workOrderJasaId,

        WorkOrderJasaStatus.DONE

    );


    const jasaRow =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    if(
        jasaRow[
            COL_WO_JASA.STATUS
        ] !==
        WorkOrderJasaStatus.DONE
    ){

        throw new Error(
            "Jasa seharusnya DONE."
        );

    }


    Logger.log(
        "JASA PROGRESS → DONE PASS"
    );


    /**
     * ========================================
     * STEP 11
     * COMPLETION GATE
     * ========================================
     */

    const completion =
        WorkOrderStatusService.canComplete(
            workOrderId
        );


    Logger.log(
        "COMPLETION RESULT:"
    );

    Logger.log(
        completion
    );


    if(
        completion.canComplete !== true
    ){

        throw new Error(
            "Completion Gate seharusnya TRUE."
        );

    }


    if(
        completion.jasa.total !== 1 ||
        completion.jasa.selesai !== 1 ||
        completion.jasa.belumSelesai !== 0
    ){

        throw new Error(
            "Perhitungan Completion Gate Jasa tidak sesuai."
        );

    }


    Logger.log(
        "COMPLETION GATE PASS"
    );


    /**
     * ========================================
     * STEP 12
     * QC → SELESAI
     * ========================================
     */

    const completeResult =
        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SELESAI

        );


    Logger.log(
        "COMPLETE RESULT:"
    );

    Logger.log(
        completeResult
    );


    if(
        completeResult.status !==
        WorkOrderStatus.SELESAI
    ){

        throw new Error(
            "QC → SELESAI gagal."
        );

    }


    Logger.log(
        "QC → SELESAI PASS"
    );


    /**
     * ========================================
     * STEP 13
     * SELESAI → SUDAH_DIAMBIL
     * ========================================
     */

    const pickedUpResult =
        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SUDAH_DIAMBIL

        );


    Logger.log(
        "PICKUP RESULT:"
    );

    Logger.log(
        pickedUpResult
    );


    if(
        pickedUpResult.status !==
        WorkOrderStatus.SUDAH_DIAMBIL
    ){

        throw new Error(
            "SELESAI → SUDAH_DIAMBIL gagal."
        );

    }


    Logger.log(
        "SELESAI → SUDAH_DIAMBIL PASS"
    );


    /**
     * ========================================
     * NEGATIVE TRANSITION TEST
     * ========================================
     */

    const negativeTests = [

        [
            WorkOrderStatus.SUDAH_DIAMBIL,
            WorkOrderStatus.DIBATALKAN
        ],

        [
            WorkOrderStatus.SUDAH_DIAMBIL,
            WorkOrderStatus.QC
        ],

        [
            WorkOrderStatus.SUDAH_DIAMBIL,
            WorkOrderStatus.SELESAI
        ]

    ];


    for(
        let i = 0;
        i < negativeTests.length;
        i++
    ){

        const fromStatus =
            negativeTests[i][0];

        const toStatus =
            negativeTests[i][1];


        let rejected =
            false;


        try{

            WorkOrderService.changeStatus(

                workOrderId,

                toStatus

            );

        }
        catch(error){

            rejected =
                true;


            Logger.log(
                "EXPECTED REJECTION:"
            );

            Logger.log(
                fromStatus +
                " → " +
                toStatus
            );

            Logger.log(
                error.message
            );

        }


        if(!rejected){

            throw new Error(
                "Invalid transition diterima: " +
                fromStatus +
                " → " +
                toStatus
            );

        }


        Logger.log(
            fromStatus +
            " → " +
            toStatus +
            " REJECTED PASS"
        );

    }


    /**
     * ========================================
     * FINAL STATUS
     * ========================================
     */

    row =
        WorkOrderRepository.findById(
            workOrderId
        );


    const finalStatus =
        row[
            COL_WORK_ORDER.STATUS
        ];


    Logger.log(
        "FINAL STATUS:"
    );

    Logger.log(
        finalStatus
    );


    if(
        finalStatus !==
        WorkOrderStatus.SUDAH_DIAMBIL
    ){

        throw new Error(
            "Final status harus SUDAH_DIAMBIL."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER FULL LIFECYCLE"
    );

    Logger.log(
        "REGRESSION TEST V1 PASS"
    );

    Logger.log(
        "================================"
    );

}

function testWorkOrderCompletionGatePartEnforcementV1(){

    Logger.log("================================");
    Logger.log("WORK ORDER COMPLETION GATE PART");
    Logger.log("INTEGRATION ENFORCEMENT V1");
    Logger.log("================================");


    let workOrderId = "";
    let workOrderPartId = "";


    try{

        /**
         * ========================================
         * STEP 1: CREATE WORK ORDER
         * ========================================
         */

        Logger.log("STEP 1: CREATE WORK ORDER");


        const workOrderResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    18000,

                prioritas :
                    WorkOrderPriority.NORMAL,

                admin :
                    "Completion Gate Part Failure V1",

                catatan :
                    "Completion Gate Part Failure V1",

                jenisTransaksi :
                    WorkOrderType.SERVICE

            });


        workOrderId =
            workOrderResult.workOrderId;


        Logger.log("WORK ORDER ID:");
        Logger.log(workOrderId);


        /**
         * ========================================
         * STEP 2: CREATE JASA
         * ========================================
         */

        Logger.log("STEP 2: CREATE JASA");


        const jasaResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    "JASA000001",

                qty :
                    1,

                harga :
                    50000,

                diskon :
                    0,

                catatan :
                    "Completion Gate Part Failure"

            });


        const workOrderJasaId =
            jasaResult.workOrderJasaId;


        Logger.log("WORK ORDER JASA ID:");
        Logger.log(workOrderJasaId);


        /**
         * ========================================
         * STEP 3: JASA → PROGRESS → DONE
         * ========================================
         */

        Logger.log("STEP 3: COMPLETE JASA");


        WorkOrderJasaService.changeStatus(
            workOrderJasaId,
            WorkOrderJasaStatus.PROGRESS
        );


        WorkOrderJasaService.changeStatus(
            workOrderJasaId,
            WorkOrderJasaStatus.DONE
        );


        /**
         * ========================================
         * STEP 4: CREATE PART
         * ========================================
         */

        Logger.log("STEP 4: CREATE PART");


        const partResult =
            WorkOrderPartService.create({

                workOrderId :
                    workOrderId,

                workOrderJasaId :
                    workOrderJasaId,

                barangId :
                    "BRG000001",

                qty :
                    1,

                harga :
                    55000,

                diskon :
                    0,

                catatan :
                    "Completion Gate Part Failure"

            });


        workOrderPartId =
            partResult.workOrderPartId;


        Logger.log("WORK ORDER PART ID:");
        Logger.log(workOrderPartId);


        /**
         * ========================================
         * STEP 5: WO → QC
         * ========================================
         */

        Logger.log("STEP 5: WO LIFECYCLE → QC");


        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.MENUNGGU_DIAGNOSA
        );


        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.MENUNGGU_APPROVAL
        );


        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.DALAM_PENGERJAAN
        );


        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.QC
        );


        /**
         * ========================================
         * STEP 6: COMPLETION GATE
         * ========================================
         *
         * PART BELUM STOCK OUT
         *
         * Expected:
         * canComplete = false
         * ========================================
         */

        Logger.log("STEP 6: COMPLETION GATE");


        const completion =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        Logger.log("COMPLETION RESULT:");

        Logger.log(
            JSON.stringify(
                completion,
                null,
                2
            )
        );


        if(
            completion.canComplete !== false
        ){

            throw new Error(
                "Completion Gate seharusnya FALSE ketika Part belum Stock Out."
            );

        }


        if(
            completion.parts.belumTerpenuhi !== 1
        ){

            throw new Error(
                "Completion Gate seharusnya mendeteksi 1 Part belum terpenuhi."
            );

        }


        Logger.log(
            "COMPLETION GATE FAILURE DETECTED PASS"
        );


        /**
         * ========================================
         * STEP 7: QC → SELESAI
         * ========================================
         */

        Logger.log("STEP 7: QC → SELESAI");


        let rejected = false;


        try{

            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );

        }
        catch(error){

            rejected = true;


            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!rejected){

            throw new Error(
                "WO seharusnya ditolak menjadi SELESAI."
            );

        }


        /**
         * ========================================
         * STEP 8: VERIFY STATUS
         * ========================================
         */

        const after =
            WorkOrderRepository.findById(
                workOrderId
            );


        const finalStatus =
            after[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log("FINAL STATUS:");
        Logger.log(finalStatus);


        if(
            finalStatus !==
            WorkOrderStatus.QC
        ){

            throw new Error(
                "WO harus tetap QC setelah Completion Gate menolak."
            );

        }


        Logger.log("STATUS TETAP QC PASS");


        Logger.log("================================");
        Logger.log("WORK ORDER COMPLETION GATE PART");
        Logger.log("INTEGRATION ENFORCEMENT V1 PASS");
        Logger.log("================================");


    }
    finally{

        /**
         * Cleanup fixture jika diperlukan.
         *
         * Jangan menghapus ledger / part secara
         * manual di sini sebelum kita melihat
         * repository cleanup pattern yang sudah
         * digunakan project.
         */

    }

}

function testWorkOrderCompletionGatePartFailureV1(){

    Logger.log("================================");
    Logger.log("WORK ORDER COMPLETION GATE PART");
    Logger.log("FAILURE INTEGRATION TEST V1");
    Logger.log("================================");

    let workOrderId = "";

    try{

        /**
         * ========================================
         * STEP 1: CREATE WORK ORDER
         * ========================================
         */

        Logger.log("STEP 1: CREATE WORK ORDER");

        const workOrderResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    18000,

                prioritas :
                    WorkOrderPriority.NORMAL,

                admin :
                    "Completion Gate Part Failure V1",

                catatan :
                    "Completion Gate Part Failure V1",

                jenisTransaksi :
                    WorkOrderType.SERVICE

            });

        workOrderId =
            workOrderResult.workOrderId;

        Logger.log("WORK ORDER ID:");
        Logger.log(workOrderId);


        /**
         * ========================================
         * STEP 2: CREATE JASA
         * ========================================
         */

        Logger.log("STEP 2: CREATE JASA");

        const jasaResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    "JAS000002",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "Completion Gate Part Failure",

                diagnosa :
                    "Completion Gate Part Failure",

                catatan :
                    "Completion Gate Part Failure"

            });

        const workOrderJasaId =
            jasaResult.workOrderJasaId;

        Logger.log("WORK ORDER JASA ID:");
        Logger.log(workOrderJasaId);


        /**
         * ========================================
         * STEP 3: JASA OPEN → PROGRESS → DONE
         * ========================================
         */

        Logger.log("STEP 3: COMPLETE JASA");

        WorkOrderJasaService.changeStatus(
            workOrderJasaId,
            WorkOrderJasaStatus.PROGRESS
        );

        WorkOrderJasaService.changeStatus(
            workOrderJasaId,
            WorkOrderJasaStatus.DONE
        );

        Logger.log("JASA DONE PASS");


        /**
         * ========================================
         * STEP 4: CREATE PART
         * ========================================
         */

        Logger.log("STEP 4: CREATE PART");

        const partResult =
            WorkOrderPartService.create({

                workOrderId :
                    workOrderId,

                workOrderJasaId :
                    workOrderJasaId,

                barangId :
                    "BRG000001",

                qty :
                    1,

                harga :
                    55000,

                diskon :
                    0,

                catatan :
                    "Completion Gate Part Failure"

            });

        const workOrderPartId =
            partResult.workOrderPartId;

        Logger.log("WORK ORDER PART ID:");
        Logger.log(workOrderPartId);


        /**
         * ========================================
         * STEP 5: WO → QC
         * ========================================
         */

        Logger.log("STEP 5: WO LIFECYCLE → QC");

        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.MENUNGGU_DIAGNOSA
        );

        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.MENUNGGU_APPROVAL
        );

        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.DALAM_PENGERJAAN
        );

        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.QC
        );

        Logger.log("WO → QC PASS");


        /**
         * ========================================
         * STEP 6: COMPLETION GATE
         * ========================================
         *
         * Tidak ada Stock Out.
         *
         * WOP:
         * qty = 1
         *
         * Ledger:
         * 0
         *
         * Expected:
         * canComplete = false
         * ========================================
         */

        Logger.log("STEP 6: COMPLETION GATE");

        const completion =
            WorkOrderStatusService.canComplete(
                workOrderId
            );

        Logger.log("COMPLETION RESULT:");

        Logger.log(
            JSON.stringify(
                completion,
                null,
                2
            )
        );


        if(
            completion.canComplete !== false
        ){

            throw new Error(
                "Completion Gate seharusnya FALSE ketika Part belum Stock Out."
            );

        }


        if(
            completion.parts.total !== 1
        ){

            throw new Error(
                "Completion Gate seharusnya mendeteksi 1 active Part."
            );

        }


        if(
            completion.parts.terpenuhi !== 0
        ){

            throw new Error(
                "Part seharusnya belum terpenuhi."
            );

        }


        if(
            completion.parts.belumTerpenuhi !== 1
        ){

            throw new Error(
                "Seharusnya ada 1 Part yang belum terpenuhi."
            );

        }


        const partDetail =
            completion.parts.details[0];


        if(
            partDetail.ledgerCount !== 0
        ){

            throw new Error(
                "Part Failure Test seharusnya belum memiliki Stock Ledger."
            );

        }


        if(
            partDetail.qtyLedger !== 0
        ){

            throw new Error(
                "Qty Ledger seharusnya 0."
            );

        }


        if(
            partDetail.qtyWOP !== 1
        ){

            throw new Error(
                "Qty WOP seharusnya 1."
            );

        }


        Logger.log(
            "COMPLETION GATE FAILURE DETECTED PASS"
        );


        /**
         * ========================================
         * STEP 7: QC → SELESAI
         * ========================================
         */

        Logger.log("STEP 7: QC → SELESAI");

        let rejected = false;

        try{

            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );

        }
        catch(error){

            rejected = true;

            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!rejected){

            throw new Error(
                "QC → SELESAI seharusnya ditolak karena Part belum terpenuhi."
            );

        }


        /**
         * ========================================
         * STEP 8: VERIFY STATUS
         * ========================================
         */

        const after =
            WorkOrderRepository.findById(
                workOrderId
            );

        const finalStatus =
            after[
                COL_WORK_ORDER.STATUS
            ];

        Logger.log("FINAL STATUS:");
        Logger.log(finalStatus);


        if(
            finalStatus !==
            WorkOrderStatus.QC
        ){

            throw new Error(
                "WO harus tetap QC setelah Completion Gate menolak."
            );

        }


        Logger.log(
            "QC → SELESAI REJECTED PASS"
        );

        Logger.log(
            "STATUS TETAP QC PASS"
        );


        Logger.log("================================");
        Logger.log("WORK ORDER COMPLETION GATE PART");
        Logger.log("FAILURE INTEGRATION TEST V1 PASS");
        Logger.log("================================");

    }
    finally{

        /**
         * Tidak melakukan Stock Ledger cleanup
         * karena test ini memang tidak membuat ledger.
         *
         * Fixture WO/Jasa/Part mengikuti pola
         * cleanup test yang sudah ada di project.
         */

    }

}

function testWorkOrderCompletionGatePartSuccessV1(){

    Logger.log("================================");
    Logger.log("WORK ORDER COMPLETION GATE PART");
    Logger.log("SUCCESS INTEGRATION TEST V1");
    Logger.log("================================");

    let workOrderId = "";

    try{

        /**
         * ========================================
         * STEP 1: CREATE WORK ORDER
         * ========================================
         */

        Logger.log("STEP 1: CREATE WORK ORDER");

        const workOrderResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    18000,

                prioritas :
                    WorkOrderPriority.NORMAL,

                admin :
                    "Completion Gate Part Success V1",

                catatan :
                    "Completion Gate Part Success V1",

                jenisTransaksi :
                    WorkOrderType.SERVICE

            });

        workOrderId =
            workOrderResult.workOrderId;

        Logger.log("WORK ORDER ID:");
        Logger.log(workOrderId);


        /**
         * ========================================
         * STEP 2: CREATE JASA
         * ========================================
         */

        Logger.log("STEP 2: CREATE JASA");

        const jasaResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    "JAS000002",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "Completion Gate Part Success",

                diagnosa :
                    "Completion Gate Part Success",

                catatan :
                    "Completion Gate Part Success"

            });

        const workOrderJasaId =
            jasaResult.workOrderJasaId;

        Logger.log("WORK ORDER JASA ID:");
        Logger.log(workOrderJasaId);


        /**
         * ========================================
         * STEP 3: JASA OPEN → PROGRESS → DONE
         * ========================================
         */

        Logger.log("STEP 3: COMPLETE JASA");

        WorkOrderJasaService.changeStatus(
            workOrderJasaId,
            WorkOrderJasaStatus.PROGRESS
        );

        WorkOrderJasaService.changeStatus(
            workOrderJasaId,
            WorkOrderJasaStatus.DONE
        );

        Logger.log("JASA DONE PASS");


        /**
         * ========================================
         * STEP 4: CREATE PART
         * ========================================
         */

        Logger.log("STEP 4: CREATE PART");

        const partResult =
            WorkOrderPartService.create({

                workOrderId :
                    workOrderId,

                workOrderJasaId :
                    workOrderJasaId,

                barangId :
                    "BRG000001",

                qty :
                    1,

                harga :
                    55000,

                diskon :
                    0,

                catatan :
                    "Completion Gate Part Success"

            });

        const workOrderPartId =
            partResult.workOrderPartId;

        Logger.log("WORK ORDER PART ID:");
        Logger.log(workOrderPartId);


        /**
         * ========================================
         * STEP 5: PART → PROGRESS
         * ========================================
         */

        Logger.log("STEP 5: PART → PROGRESS");

        WorkOrderPartService.changeStatus(
            workOrderPartId,
            WorkOrderPartStatus.PROGRESS
        );

        Logger.log("PART PROGRESS PASS");


        /**
         * ========================================
         * STEP 6: WO → QC
         * ========================================
         */

        Logger.log("STEP 6: WO LIFECYCLE → QC");

        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.MENUNGGU_DIAGNOSA
        );

        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.MENUNGGU_APPROVAL
        );

        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.DALAM_PENGERJAAN
        );

        WorkOrderService.changeStatus(
            workOrderId,
            WorkOrderStatus.QC
        );

        Logger.log("WO → QC PASS");


        /**
         * ========================================
         * STEP 7: STOCK OUT QTY TEPAT
         * ========================================
         *
         * WOP:
         * qty = 1
         *
         * STOCK OUT:
         * qty = 1
         *
         * ========================================
         */

        Logger.log("STEP 7: STOCK OUT");

        const stockBefore =
            BarangRepository.getStock(
                "BRG000001"
            );

        Logger.log(
            "STOCK BEFORE:"
        );

        Logger.log(
            stockBefore
        );

        stockBefore =
    BarangRepository.getStock(
        "BRG000001"
    );

Logger.log(
    "STOCK BASELINE:"
);

Logger.log(
    stockBefore
);


        const stockResult =
            StockLedgerService.recordOutBatchAtomic(

                [
                    {

                        barangId :
                            "BRG000001",

                        qty :
                            1,

                        referensi :
                            workOrderPartId,

                        keterangan :
                            "Completion Gate Part Success V1"

                    }

                ]

            );


        Logger.log(
            "STOCK OUT RESULT:"
        );

        Logger.log(
            JSON.stringify(
                stockResult,
                null,
                2
            )
        );


        /**
         * ========================================
         * STEP 8: COMPLETION GATE
         * ========================================
         */

        Logger.log(
            "STEP 8: COMPLETION GATE"
        );


        const completion =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        Logger.log(
            "COMPLETION RESULT:"
        );

        Logger.log(
            JSON.stringify(
                completion,
                null,
                2
            )
        );


        if(
            completion.canComplete !== true
        ){

            throw new Error(
                "Completion Gate seharusnya TRUE setelah Stock Out qty tepat."
            );

        }


        if(
            completion.parts.total !== 1
        ){

            throw new Error(
                "Completion Gate seharusnya mendeteksi 1 active Part."
            );

        }


        if(
            completion.parts.terpenuhi !== 1
        ){

            throw new Error(
                "Part seharusnya terpenuhi."
            );

        }


        if(
            completion.parts.belumTerpenuhi !== 0
        ){

            throw new Error(
                "Tidak boleh ada Part yang belum terpenuhi."
            );

        }


        const partDetail =
            completion.parts.details[0];


        if(
            partDetail.ledgerCount < 1
        ){

            throw new Error(
                "Stock Ledger seharusnya tercatat."
            );

        }


        if(
            partDetail.qtyWOP !== 1
        ){

            throw new Error(
                "Qty WOP seharusnya 1."
            );

        }


        if(
            partDetail.qtyLedger !== 1
        ){

            throw new Error(
                "Qty Ledger seharusnya tepat 1."
            );

        }


        if(
            partDetail.barangMatch !== true
        ){

            throw new Error(
                "Barang ID Stock Ledger harus cocok dengan WOP."
            );

        }


        if(
            partDetail.qtyMatch !== true
        ){

            throw new Error(
                "Qty Stock Out harus sama dengan Qty WOP."
            );

        }


        if(
            partDetail.valid !== true
        ){

            throw new Error(
                "Part seharusnya VALID."
            );

        }


        Logger.log(
            "COMPLETION GATE SUCCESS PASS"
        );


        /**
         * ========================================
         * STEP 9: QC → SELESAI
         * ========================================
         */

        Logger.log(
            "STEP 9: QC → SELESAI"
        );


        const completeResult =
            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );


        Logger.log(
            "COMPLETE RESULT:"
        );

        Logger.log(
            completeResult
        );


        if(
            !completeResult ||
            completeResult.success !== true
        ){

            throw new Error(
                "QC → SELESAI gagal setelah seluruh Part terpenuhi."
            );

        }


        if(
            completeResult.status !==
            WorkOrderStatus.SELESAI
        ){

            throw new Error(
                "Status hasil completion harus SELESAI."
            );

        }


        /**
         * ========================================
         * STEP 10: VERIFY FINAL STATUS
         * ========================================
         */

        const finalRow =
            WorkOrderRepository.findById(
                workOrderId
            );


        const finalStatus =
            finalRow[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            finalStatus
        );


        if(
            finalStatus !==
            WorkOrderStatus.SELESAI
        ){

            throw new Error(
                "Final status seharusnya SELESAI."
            );

        }


        Logger.log(
            "QC → SELESAI PASS"
        );


        Logger.log("================================");
        Logger.log("WORK ORDER COMPLETION GATE PART");
        Logger.log("SUCCESS INTEGRATION TEST V1 PASS");
        Logger.log("================================");


    }
    finally{

        /**
         * Cleanup mengikuti pola fixture
         * Stock Ledger yang sudah digunakan
         * pada WorkOrderServiceTest.
         */

    }

}

function testWorkOrderCompletionGatePartWrongBarangIntegrationV1(){

    Logger.log("================================");
    Logger.log("WORK ORDER COMPLETION GATE PART");
    Logger.log("WRONG BARANG ID INTEGRATION TEST V1");
    Logger.log("================================");


    let workOrderId = "";

    let workOrderJasaId = "";

    let workOrderPartId = "";

    let stockLedgerId = "";

    let stockBefore = null;


    try{

        /**
         * ========================================
         * STEP 1: CREATE WORK ORDER
         * ========================================
         */

        Logger.log(
            "STEP 1: CREATE WORK ORDER"
        );


        const workOrderResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    18000,

                prioritas :
                    WorkOrderPriority.NORMAL,

                admin :
                    "Completion Gate Wrong Barang V1",

                catatan :
                    "Completion Gate Wrong Barang Integration Test V1",

                jenisTransaksi :
                    WorkOrderType.SERVICE

            });


        workOrderId =
            workOrderResult.workOrderId;


        Logger.log(
            "WORK ORDER ID:"
        );

        Logger.log(
            workOrderId
        );


        /**
         * ========================================
         * STEP 2: CREATE JASA
         * ========================================
         */

        Logger.log(
            "STEP 2: CREATE JASA"
        );


        const jasaResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    "JAS000002",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "Completion Gate Wrong Barang",

                diagnosa :
                    "Test wrong barang",

                catatan :
                    "Completion Gate Wrong Barang"

            });


        workOrderJasaId =
            jasaResult.workOrderJasaId;


        Logger.log(
            "WORK ORDER JASA ID:"
        );

        Logger.log(
            workOrderJasaId
        );


        /**
         * ========================================
         * STEP 3: COMPLETE JASA
         * ========================================
         */

        Logger.log(
            "STEP 3: COMPLETE JASA"
        );


        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.PROGRESS

        );


        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.DONE

        );


        Logger.log(
            "JASA DONE PASS"
        );


        /**
         * ========================================
         * STEP 4: CREATE PART
         *
         * WOP menggunakan:
         * BRG000001 × 1
         * ========================================
         */

        Logger.log(
            "STEP 4: CREATE PART"
        );


        const partResult =
            WorkOrderPartService.create({

                workOrderId :
                    workOrderId,

                workOrderJasaId :
                    workOrderJasaId,

                barangId :
                    "BRG000001",

                qty :
                    1,

                harga :
                    55000,

                diskon :
                    0,

                catatan :
                    "Completion Gate Wrong Barang"

            });


        workOrderPartId =
            partResult.workOrderPartId;


        Logger.log(
            "WORK ORDER PART ID:"
        );

        Logger.log(
            workOrderPartId
        );


        /**
         * ========================================
         * STEP 5: PART → PROGRESS
         * ========================================
         */

        Logger.log(
            "STEP 5: PART → PROGRESS"
        );


        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


        Logger.log(
            "PART PROGRESS PASS"
        );


        /**
         * ========================================
         * STEP 6: WO → QC
         * ========================================
         */

        Logger.log(
            "STEP 6: WO LIFECYCLE → QC"
        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_DIAGNOSA

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_APPROVAL

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.DALAM_PENGERJAAN

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.QC

        );


        Logger.log(
            "WO → QC PASS"
        );


        /**
         * ========================================
         * STEP 7: STOCK OUT WRONG BARANG
         *
         * WOP:
         * BRG000001 × 1
         *
         * STOCK LEDGER:
         * BRG000002 × 1
         *
         * QTY SAMA
         * BARANG BERBEDA
         * ========================================
         */

        Logger.log(
            "STEP 7: STOCK OUT WRONG BARANG"
        );


        stockBefore =
            BarangRepository.getStock(
                "BRG000002"
            );


        Logger.log(
            "BRG000002 STOCK BEFORE:"
        );

        Logger.log(
            stockBefore
        );


        const stockRequest = {

            barangId :
                "BRG000002",

            qty :
                1,

            referensi :
                workOrderPartId,

            keterangan :
                "Completion Gate Wrong Barang Test"

        };


        const stockResult =
            StockLedgerService.recordOutBatchAtomic(

                [
                    stockRequest
                ]

            );


        Logger.log(
            "STOCK OUT RESULT:"
        );

        Logger.log(
            JSON.stringify(
                stockResult,
                null,
                2
            )
        );


        if(
            !stockResult ||
            !stockResult.success
        ){

            throw new Error(
                "Stock OUT test gagal."
            );

        }


        stockLedgerId =
            stockResult
                .items[0]
                .stockLedgerId;


        Logger.log(
            "TEST STOCK LEDGER ID:"
        );

        Logger.log(
            stockLedgerId
        );


        /**
         * ========================================
         * STEP 8: COMPLETION GATE
         * ========================================
         */

        Logger.log(
            "STEP 8: COMPLETION GATE"
        );


        const completion =
            WorkOrderStatusService.canComplete(

                workOrderId

            );


        Logger.log(
            "COMPLETION RESULT:"
        );


        Logger.log(
            JSON.stringify(
                completion,
                null,
                2
            )
        );


        /**
         * ========================================
         * ASSERTION 1
         * ========================================
         */

        if(
            completion.canComplete !== false
        ){

            throw new Error(
                "Completion Gate seharusnya menolak " +
                "part dengan barangId berbeda."
            );

        }


        /**
         * ========================================
         * ASSERTION 2
         * ========================================
         */

        const partDetail =
            completion
                .parts
                .details[0];


        Logger.log(
            "PART DETAIL:"
        );


        Logger.log(
            JSON.stringify(
                partDetail,
                null,
                2
            )
        );


        if(
            partDetail.barangMatch !== false
        ){

            throw new Error(
                "barangMatch seharusnya FALSE."
            );

        }


        if(
            partDetail.qtyMatch !== true
        ){

            throw new Error(
                "qtyMatch seharusnya TRUE."
            );

        }


        if(
            partDetail.valid !== false
        ){

            throw new Error(
                "valid seharusnya FALSE."
            );

        }


        Logger.log(
            "WRONG BARANG COMPLETION GATE PASS"
        );


        /**
         * ========================================
         * STEP 9: QC → SELESAI
         * HARUS DITOLAK
         * ========================================
         */

        Logger.log(
            "STEP 9: QC → SELESAI"
        );


        let rejected = false;


        try{

            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );

        }
        catch(error){

            rejected = true;


            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!rejected){

            throw new Error(
                "QC → SELESAI seharusnya ditolak."
            );

        }


        /**
         * ========================================
         * STEP 10: STATUS HARUS TETAP QC
         * ========================================
         */

        const finalRow =
            WorkOrderRepository.findById(

                workOrderId

            );


        const finalStatus =
            finalRow[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            finalStatus
        );


        if(
            finalStatus !==
            WorkOrderStatus.QC
        ){

            throw new Error(
                "WO harus tetap QC."
            );

        }


        Logger.log(
            "QC → SELESAI REJECTED PASS"
        );


        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER COMPLETION GATE PART"
        );

        Logger.log(
            "WRONG BARANG ID INTEGRATION TEST V1 PASS"
        );

        Logger.log(
            "================================"
        );


    }
    finally{

        /**
         * ========================================
         * CLEANUP STOCK
         * ========================================
         */

        if(
            stockLedgerId &&
            stockBefore !== null
        ){

            try{

                BarangRepository.updateStockAbsolute(

                    "BRG000002",

                    stockBefore

                );


                Logger.log(
                    "STOCK RESTORED:"
                );

                Logger.log(
                    stockBefore
                );


                /**
                 * Hapus test ledger.
                 *
                 * Method ini hanya menghapus ledger,
                 * sehingga restore stock dilakukan
                 * terlebih dahulu.
                 */

                StockLedgerService.deleteLedgerById_(

                    stockLedgerId

                );


                /**
                 * ====================================
                 * VERIFY STOCK
                 * ====================================
                 */

                const stockAfter =
                    BarangRepository.getStock(

                        "BRG000002"

                    );


                Logger.log(
                    "STOCK AFTER CLEANUP:"
                );

                Logger.log(
                    stockAfter
                );


                if(
                    stockAfter !==
                    stockBefore
                ){

                    throw new Error(
                        "Cleanup stock gagal."
                    );

                }


                /**
                 * ====================================
                 * VERIFY LEDGER
                 * ====================================
                 */

                const remainingLedgers =
                    StockLedgerRepository
                        .findByReferensi(

                            workOrderPartId

                        );


                Logger.log(
                    "TEST LEDGER TERSISA:"
                );

                Logger.log(
                    remainingLedgers.length
                );


                if(
                    remainingLedgers.length !== 0
                ){

                    throw new Error(
                        "Cleanup ledger gagal."
                    );

                }


                Logger.log(
                    "CLEANUP STOCK + LEDGER PASS"
                );


            }
            catch(cleanupError){

                Logger.log(
                    "CLEANUP ERROR:"
                );

                Logger.log(
                    cleanupError.message
                );

                throw cleanupError;

            }

        }


        Logger.log(
            "TEST FIXTURE WO:"
        );

        Logger.log(
            workOrderId
        );

    }

}

function testWorkOrderCompletionGateRegressionV1(){

    Logger.log("================================");
    Logger.log("WORK ORDER COMPLETION GATE");
    Logger.log("REGRESSION TEST V1");
    Logger.log("================================");


    let workOrderId = "";

    let workOrderJasaId = "";

    let workOrderPartId = "";

    let stockLedgerIds = [];

    /**
     * Baseline stock.
     *
     * Disimpan sebelum Stock OUT
     * agar cleanup tidak bergantung
     * pada angka hard-coded.
     */
    let stockBefore = null;


    try {

        /**
         * ========================================
         * STEP 1: CREATE WORK ORDER
         * ========================================
         */

        Logger.log(
            "STEP 1: CREATE WORK ORDER"
        );


        const woResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    18000,

                prioritas :
                    WorkOrderPriority.NORMAL,

                admin :
                    "Completion Gate Regression V1",

                catatan :
                    "Completion Gate Regression V1",

                jenisTransaksi :
                    WorkOrderType.SERVICE

            });


        workOrderId =
            woResult.workOrderId;


        Logger.log(
            "WORK ORDER ID:"
        );

        Logger.log(
            workOrderId
        );


        if(!workOrderId){

            throw new Error(
                "Work Order gagal dibuat."
            );

        }


        /**
         * ========================================
         * TEST 1
         * NO JASA + NO PART
         * → REJECT
         * ========================================
         */

        Logger.log("--------------------------------");

        Logger.log(
            "TEST 1: NO JASA + NO PART"
        );

        Logger.log("--------------------------------");


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_DIAGNOSA

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.MENUNGGU_APPROVAL

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.DALAM_PENGERJAAN

        );


        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.QC

        );


        const noWork =
            WorkOrderStatusService.canComplete(

                workOrderId

            );


        Logger.log(
            JSON.stringify(
                noWork,
                null,
                2
            )
        );


        if(
            noWork.canComplete !== false
        ){

            throw new Error(
                "WO tanpa jasa/part seharusnya ditolak."
            );

        }


        Logger.log(
            "NO JASA + NO PART REJECT PASS"
        );


        /**
         * ========================================
         * TEST 2
         * JASA PROGRESS
         * → REJECT
         * ========================================
         */

        Logger.log("--------------------------------");

        Logger.log(
            "TEST 2: JASA PROGRESS"
        );

        Logger.log("--------------------------------");


        const jasaResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    "JAS000002",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "Completion Gate Regression",

                diagnosa :
                    "",

                catatan :
                    "Completion Gate Regression V1"

            });


        workOrderJasaId =
            jasaResult.workOrderJasaId;


        Logger.log(
            "WORK ORDER JASA ID:"
        );

        Logger.log(
            workOrderJasaId
        );


        if(!workOrderJasaId){

            throw new Error(
                "Work Order Jasa gagal dibuat."
            );

        }


        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.PROGRESS

        );


        const jasaProgress =
            WorkOrderStatusService.canComplete(

                workOrderId

            );


        Logger.log(
            JSON.stringify(
                jasaProgress,
                null,
                2
            )
        );


        if(
            jasaProgress.canComplete !== false
        ){

            throw new Error(
                "Jasa PROGRESS seharusnya belum dapat complete."
            );

        }


        Logger.log(
            "JASA PROGRESS REJECT PASS"
        );


        /**
         * ========================================
         * TEST 3
         * JASA DONE
         * → PASS
         * ========================================
         */

        Logger.log("--------------------------------");

        Logger.log(
            "TEST 3: JASA DONE"
        );

        Logger.log("--------------------------------");


        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.DONE

        );


        const jasaDone =
            WorkOrderStatusService.canComplete(

                workOrderId

            );


        Logger.log(
            JSON.stringify(
                jasaDone,
                null,
                2
            )
        );


        if(
            jasaDone.canComplete !== true
        ){

            throw new Error(
                "Jasa DONE seharusnya dapat complete."
            );

        }


        Logger.log(
            "JASA DONE PASS"
        );


        /**
         * ========================================
         * TEST 4
         * PART WITHOUT STOCK OUT
         * → REJECT
         * ========================================
         */

        Logger.log("--------------------------------");

        Logger.log(
            "TEST 4: PART WITHOUT STOCK OUT"
        );

        Logger.log("--------------------------------");


        const partResult =
            WorkOrderPartService.create({

                workOrderId :
                    workOrderId,

                workOrderJasaId :
                    workOrderJasaId,

                barangId :
                    "BRG000001",

                qty :
                    1,

                harga :
                    55000,

                diskon :
                    0,

                catatan :
                    "Completion Gate Regression Part"

            });


        workOrderPartId =
            partResult.workOrderPartId;


        Logger.log(
            "WORK ORDER PART ID:"
        );

        Logger.log(
            workOrderPartId
        );


        if(!workOrderPartId){

            throw new Error(
                "Work Order Part gagal dibuat."
            );

        }


        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


        const noStockOut =
            WorkOrderStatusService.canComplete(

                workOrderId

            );


        Logger.log(
            JSON.stringify(
                noStockOut,
                null,
                2
            )
        );


        if(
            noStockOut.canComplete !== false
        ){

            throw new Error(
                "Part tanpa Stock OUT seharusnya ditolak."
            );

        }


        Logger.log(
            "PART WITHOUT STOCK OUT REJECT PASS"
        );


        /**
         * ========================================
         * TEST 5
         * PART VALID STOCK OUT
         * → PASS
         * ========================================
         */

        Logger.log("--------------------------------");

        Logger.log(
            "TEST 5: PART VALID STOCK OUT"
        );

        Logger.log("--------------------------------");


        /**
         * Simpan baseline stock SEBELUM
         * Stock OUT dilakukan.
         */

        stockBefore =
            BarangRepository.getStock(

                "BRG000001"

            );


        Logger.log(
            "STOCK BASELINE:"
        );

        Logger.log(
            stockBefore
        );


        if(
            stockBefore === null ||
            stockBefore === undefined
        ){

            throw new Error(
                "Stock baseline tidak dapat dibaca."
            );

        }


        /**
         * Stock OUT sesuai WOP.
         */

        const stockResult =
    StockLedgerService.recordOutBatchAtomic(

        [

            {

                barangId :
                    "BRG000001",

                qty :
                    1,

                jenisMutasi :
                    "SERVICE",

                referensi :
                    workOrderPartId,

                keterangan :
                    "Completion Gate Regression V1"

            }

        ]

    );


        Logger.log(
            JSON.stringify(
                stockResult,
                null,
                2
            )
        );


        if(
            !stockResult ||
            stockResult.success !== true
        ){

            throw new Error(
                "Stock OUT regression test gagal."
            );

        }


        /**
         * Simpan semua ledger ID
         * untuk cleanup.
         */

        if(
            stockResult.items &&
            stockResult.items.length > 0
        ){

            for(
                let i = 0;
                i < stockResult.items.length;
                i++
            ){

                const ledgerId =
                    stockResult.items[i]
                        .stockLedgerId;


                if(ledgerId){

                    stockLedgerIds.push(
                        ledgerId
                    );

                }

            }

        }


        if(
            stockLedgerIds.length === 0
        ){

            throw new Error(
                "Stock OUT berhasil tetapi Stock Ledger ID tidak ditemukan."
            );

        }


        /**
         * ========================================
         * VERIFY COMPLETION GATE
         * ========================================
         */

        const validPart =
            WorkOrderStatusService.canComplete(

                workOrderId

            );


        Logger.log(
            JSON.stringify(
                validPart,
                null,
                2
            )
        );


        if(
            validPart.canComplete !== true
        ){

            throw new Error(
                "Jasa DONE + Part valid seharusnya dapat complete."
            );

        }


        Logger.log(
            "PART VALID STOCK OUT PASS"
        );


        /**
         * ========================================
         * TEST 6
         * QC → SELESAI
         * ========================================
         */

        Logger.log("--------------------------------");

        Logger.log(
            "TEST 6: COMPLETE WO"
        );

        Logger.log("--------------------------------");


        const completeResult =
            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );


        Logger.log(
            JSON.stringify(
                completeResult,
                null,
                2
            )
        );


        if(
            !completeResult ||
            completeResult.success !== true
        ){

            throw new Error(
                "WO gagal diselesaikan."
            );

        }


        const completedRow =
            WorkOrderRepository.findById(

                workOrderId

            );


        const completedStatus =
            completedRow[
                COL_WORK_ORDER.STATUS
            ];


        Logger.log(
            "FINAL STATUS:"
        );

        Logger.log(
            completedStatus
        );


        if(
            completedStatus !==
            WorkOrderStatus.SELESAI
        ){

            throw new Error(
                "WO seharusnya menjadi SELESAI."
            );

        }


        Logger.log(
            "QC → SELESAI PASS"
        );


        /**
         * ========================================
         * TEST 7
         * SELESAI → SUDAH_DIAMBIL
         * ========================================
         */

        Logger.log("--------------------------------");

        Logger.log(
            "TEST 7: PICKUP"
        );

        Logger.log("--------------------------------");


        const pickupResult =
            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SUDAH_DIAMBIL

            );


        Logger.log(
            JSON.stringify(
                pickupResult,
                null,
                2
            )
        );


        if(
            !pickupResult ||
            pickupResult.success !== true
        ){

            throw new Error(
                "Pickup Work Order gagal."
            );

        }


        const pickupRow =
            WorkOrderRepository.findById(

                workOrderId

            );


        const pickupStatus =
            pickupRow[
                COL_WORK_ORDER.STATUS
            ];


        if(
            pickupStatus !==
            WorkOrderStatus.SUDAH_DIAMBIL
        ){

            throw new Error(
                "WO seharusnya menjadi SUDAH_DIAMBIL."
            );

        }


        Logger.log(
            "SELESAI → SUDAH_DIAMBIL PASS"
        );


        /**
         * ========================================
         * TEST 8
         * INVALID TRANSITION
         * ========================================
         */

        Logger.log("--------------------------------");

        Logger.log(
            "TEST 8: INVALID TRANSITION"
        );

        Logger.log("--------------------------------");


        let rejected =
            false;


        try{

            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.QC

            );

        }
        catch(error){

            rejected =
                true;


            Logger.log(
                "EXPECTED ERROR:"
            );

            Logger.log(
                error.message
            );

        }


        if(!rejected){

            throw new Error(
                "Invalid transition seharusnya ditolak."
            );

        }


        const finalRow =
            WorkOrderRepository.findById(

                workOrderId

            );


        const finalStatus =
            finalRow[
                COL_WORK_ORDER.STATUS
            ];


        if(
            finalStatus !==
            WorkOrderStatus.SUDAH_DIAMBIL
        ){

            throw new Error(
                "Status berubah setelah invalid transition."
            );

        }


        Logger.log(
            "INVALID TRANSITION REJECT PASS"
        );


        /**
         * ========================================
         * FINAL PASS
         * ========================================
         */

        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER COMPLETION GATE"
        );

        Logger.log(
            "REGRESSION TEST V1 PASS"
        );

        Logger.log(
            "================================"
        );


    }
    finally{

        /**
         * ========================================
         * CLEANUP STOCK LEDGER
         * ========================================
         */

        for(
            let i = 0;
            i < stockLedgerIds.length;
            i++
        ){

            try{

                StockLedgerService
                    .deleteLedgerById_(
                        stockLedgerIds[i]
                    );

            }
            catch(error){

                Logger.log(
                    "CLEANUP LEDGER ERROR:"
                );

                Logger.log(
                    error.message
                );

            }

        }


        /**
         * ========================================
         * RESTORE STOCK BASELINE
         * ========================================
         */

        if(
            stockBefore !== null
        ){

            try{

                const stockCurrent =
                    BarangRepository.getStock(

                        "BRG000001"

                    );


                Logger.log(
                    "STOCK BEFORE RESTORE:"
                );

                Logger.log(
                    stockCurrent
                );


                BarangRepository.updateStockAbsolute(

                    "BRG000001",

                    stockBefore

                );


                const stockAfter =
                    BarangRepository.getStock(

                        "BRG000001"

                    );


                Logger.log(
                    "STOCK AFTER RESTORE:"
                );

                Logger.log(
                    stockAfter
                );


                if(
                    Number(stockAfter) !==
                    Number(stockBefore)
                ){

                    throw new Error(
                        "Regression cleanup gagal: " +
                        "stock tidak kembali ke baseline."
                    );

                }


                Logger.log(
                    "STOCK BASELINE RESTORE PASS"
                );

            }
            catch(error){

                Logger.log(
                    "STOCK RESTORE ERROR:"
                );

                Logger.log(
                    error.message
                );

                throw error;

            }

        }


        /**
         * ========================================
         * FINAL CLEANUP LOG
         * ========================================
         */

        Logger.log(
            "REGRESSION TEST CLEANUP SELESAI"
        );

    }

}

/**
 * ============================================
 * TEST: Completion Gate Reversal Regression
 * ============================================
 *
 * Flow:
 *
 * JASA DONE
 * +
 * PART STOCK OUT
 * ↓
 * canComplete = TRUE
 *
 * kemudian:
 *
 * STOCK OUT → REVERSAL
 * ↓
 * canComplete = FALSE
 *
 * Expected:
 *
 * qtyOut      = 1
 * qtyReversal = 1
 * qtyNet      = 0
 * qtyMatch    = false
 * valid       = false
 *
 * WO tidak boleh menjadi SELESAI.
 * ============================================
 */

function testWorkOrderCompletionGateReversalRegressionV1(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER COMPLETION GATE"
    );

    Logger.log(
        "REVERSAL REGRESSION TEST V1"
    );

    Logger.log(
        "================================"
    );


    let workOrderId = "";

    let workOrderJasaId = "";

    let workOrderPartId = "";

    let stockLedgerId = "";

    let stockBefore = null;


    try{

        /**
         * ========================================
         * STEP 1
         * CREATE WORK ORDER
         * ========================================
         */

        Logger.log(
            "STEP 1: CREATE WORK ORDER"
        );


        const woResult =
            WorkOrderService.create({

                customerId :
                    "CUS2608160002",

                vehicleId :
                    "VEH2608160002",

                kilometerMasuk :
                    19000,

                admin :
                    "Completion Gate Reversal V1",

                jenisTransaksi :
                    WorkOrderType.SERVICE,

                prioritas :
                    WorkOrderPriority.NORMAL,

                catatan :
                    "Completion Gate Reversal Regression V1"

            });


        workOrderId =
            woResult.workOrderId;


        Logger.log(
            "WORK ORDER ID:"
        );

        Logger.log(
            workOrderId
        );


        /**
         * ========================================
         * STEP 2
         * CREATE JASA
         * ========================================
         */

        Logger.log(
            "STEP 2: CREATE JASA"
        );


        const jasaResult =
            WorkOrderJasaService.create({

                workOrderId :
                    workOrderId,

                jasaId :
                    "JAS000001",

                qty :
                    1,

                diskon :
                    0,

                mekanikId :
                    "",

                keluhan :
                    "Completion Gate Reversal Test",

                diagnosa :
                    "Regression Test",

                catatan :
                    "Reversal Regression"

            });


        workOrderJasaId =
            jasaResult.workOrderJasaId;


        Logger.log(
            "WORK ORDER JASA ID:"
        );

        Logger.log(
            workOrderJasaId
        );


        /**
         * ========================================
         * STEP 3
         * JASA → PROGRESS → DONE
         * ========================================
         */

        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.PROGRESS

        );


        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.DONE

        );


        Logger.log(
            "JASA DONE PASS"
        );


        /**
         * ========================================
         * STEP 4
         * CREATE WORK ORDER PART
         * ========================================
         */

        Logger.log(
            "STEP 4: CREATE PART"
        );


        const partResult =
            WorkOrderPartService.create({

                workOrderId :
                    workOrderId,

                workOrderJasaId :
                    workOrderJasaId,

                barangId :
                    "BRG000001",

                qty :
                    1,

                harga :
                    55000,

                diskon :
                    0,

                catatan :
                    "Completion Gate Reversal Part"

            });


        workOrderPartId =
            partResult.workOrderPartId;


        Logger.log(
            "WORK ORDER PART ID:"
        );

        Logger.log(
            workOrderPartId
        );


        /**
         * ========================================
         * STEP 5
         * PART → PROGRESS
         * ========================================
         */

        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


        Logger.log(
            "PART PROGRESS PASS"
        );


        /**
         * ========================================
         * STEP 6
         * STOCK OUT
         * ========================================
         */

        stockBefore =
            BarangRepository.getStock(
                "BRG000001"
            );


        Logger.log(
            "STOCK BASELINE:"
        );

        Logger.log(
            stockBefore
        );


        const stockResult =
            StockLedgerService.recordOutBatchAtomic(

                [

                    {

                        barangId :
                            "BRG000001",

                        qty :
                            1,

                        referensi :
                            workOrderPartId,

                        keterangan :
                            "Completion Gate Reversal Regression"

                    }

                ]

            );


        if(
            !stockResult ||
            stockResult.success !== true
        ){

            throw new Error(
                "Stock OUT regression gagal."
            );

        }


        stockLedgerId =
            stockResult.items[0]
                .stockLedgerId;


        Logger.log(
            "STOCK OUT ID:"
        );

        Logger.log(
            stockLedgerId
        );


        /**
         * ========================================
         * STEP 7
         * VERIFY CAN COMPLETE
         * ========================================
         */

        Logger.log(
            "STEP 7: VERIFY CAN COMPLETE TRUE"
        );


        const beforeReversal =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        Logger.log(
            JSON.stringify(
                beforeReversal,
                null,
                2
            )
        );


        if(
            beforeReversal.canComplete !== true
        ){

            throw new Error(
                "Jasa DONE + Stock OUT seharusnya dapat complete."
            );

        }


        Logger.log(
            "CAN COMPLETE BEFORE REVERSAL PASS"
        );


        /**
         * ========================================
         * STEP 8
         * REVERSAL
         * ========================================
         */

        Logger.log(
            "STEP 8: REVERSAL STOCK OUT"
        );


        const reversalResult =
            StockLedgerReversalService
                .reverseByWorkOrderPartId(

                    workOrderPartId

                );


        Logger.log(
            "REVERSAL RESULT:"
        );

        Logger.log(
            JSON.stringify(
                reversalResult,
                null,
                2
            )
        );


        Logger.log(
            "REVERSAL EXECUTED"
        );


        /**
         * ========================================
         * STEP 9
         * VERIFY STOCK RESTORED
         * ========================================
         */

        const stockAfterReversal =
            BarangRepository.getStock(
                "BRG000001"
            );


        Logger.log(
            "STOCK AFTER REVERSAL:"
        );

        Logger.log(
            stockAfterReversal
        );


        if(
            stockAfterReversal !==
            stockBefore
        ){

            throw new Error(
                "Stock tidak kembali ke baseline setelah reversal."
            );

        }


        Logger.log(
            "STOCK RESTORE PASS"
        );


        /**
         * ========================================
         * STEP 10
         * VERIFY COMPLETION GATE
         * ========================================
         */

        Logger.log(
            "STEP 10: VERIFY CAN COMPLETE FALSE"
        );


        const afterReversal =
            WorkOrderStatusService.canComplete(
                workOrderId
            );


        Logger.log(
            JSON.stringify(
                afterReversal,
                null,
                2
            )
        );


        if(
            afterReversal.canComplete !== false
        ){

            throw new Error(
                "Setelah reversal, Completion Gate seharusnya FALSE."
            );

        }


        /**
         * ========================================
         * VERIFY PART DETAIL
         * ========================================
         */

        const partDetail =
            afterReversal
                .parts
                .details[0];


        if(
            partDetail.qtyOut !== 1
        ){

            throw new Error(
                "qtyOut seharusnya 1."
            );

        }


        if(
            partDetail.qtyReversal !== 1
        ){

            throw new Error(
                "qtyReversal seharusnya 1."
            );

        }


        if(
            partDetail.qtyNet !== 0
        ){

            throw new Error(
                "qtyNet seharusnya 0 setelah reversal."
            );

        }


        if(
            partDetail.qtyMatch !== false
        ){

            throw new Error(
                "qtyMatch seharusnya FALSE setelah reversal."
            );

        }


        if(
            partDetail.valid !== false
        ){

            throw new Error(
                "Part seharusnya INVALID setelah reversal."
            );

        }


        Logger.log(
            "REVERSAL COMPLETION GATE DETAIL PASS"
        );


       /**
 * ========================================
 * STEP 11
 * MOVE WO → QC
 * ========================================
 */

Logger.log(
    "STEP 11: MOVE WO → QC"
);


/**
 * DRAFT → MENUNGGU_DIAGNOSA
 */

WorkOrderService.changeStatus(
    workOrderId,
    WorkOrderStatus.MENUNGGU_DIAGNOSA
);


/**
 * MENUNGGU_DIAGNOSA → MENUNGGU_APPROVAL
 */

WorkOrderService.changeStatus(
    workOrderId,
    WorkOrderStatus.MENUNGGU_APPROVAL
);


/**
 * MENUNGGU_APPROVAL → DALAM_PENGERJAAN
 */

WorkOrderService.changeStatus(
    workOrderId,
    WorkOrderStatus.DALAM_PENGERJAAN
);


/**
 * DALAM_PENGERJAAN → QC
 */

const qcResult =
    WorkOrderService.changeStatus(
        workOrderId,
        WorkOrderStatus.QC
    );


Logger.log(
    "QC RESULT:"
);

Logger.log(
    JSON.stringify(
        qcResult,
        null,
        2
    )
);


if(
    !qcResult ||
    qcResult.success !== true
){

    throw new Error(
        "WO gagal dipindahkan ke QC."
    );

}


const qcRow =
    WorkOrderRepository.findById(
        workOrderId
    );


const qcStatus =
    qcRow[
        COL_WORK_ORDER.STATUS
    ];


Logger.log(
    "STATUS AFTER QC:"
);

Logger.log(
    qcStatus
);


if(
    qcStatus !==
    WorkOrderStatus.QC
){

    throw new Error(
        "WO seharusnya berada di QC."
    );

}


Logger.log(
    "WO → QC PASS"
);


/**
 * ========================================
 * STEP 12
 * QC → SELESAI HARUS DITOLAK
 * ========================================
 */

Logger.log(
    "STEP 12: QC → SELESAI REJECTION"
);


let rejected =
    false;


try{

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.SELESAI

    );

}
catch(error){

    rejected =
        true;


    Logger.log(
        "EXPECTED ERROR:"
    );

    Logger.log(
        error.message
    );

}


if(!rejected){

    throw new Error(
        "WO tidak boleh menjadi SELESAI setelah reversal."
    );

}


Logger.log(
    "QC → SELESAI REJECT PASS"
);


/**
 * ========================================
 * VERIFY STATUS TETAP QC
 * ========================================
 */

const finalStatusRow =
    WorkOrderRepository.findById(
        workOrderId
    );


const finalStatus =
    finalStatusRow[
        COL_WORK_ORDER.STATUS
    ];


Logger.log(
    "FINAL STATUS:"
);

Logger.log(
    finalStatus
);


if(
    finalStatus !==
    WorkOrderStatus.QC
){

    throw new Error(
        "Status WO berubah setelah Completion Gate rejection."
    );

}


Logger.log(
    "STATUS TETAP QC PASS"
);


     


        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER COMPLETION GATE"
        );

        Logger.log(
            "REVERSAL REGRESSION TEST V1 PASS"
        );

        Logger.log(
            "================================"
        );

    }
    finally{

        /**
         * ========================================
         * CLEANUP STOCK
         * ========================================
         *
         * Reversal seharusnya sudah mengembalikan
         * stock ke baseline.
         *
         * Kita hanya melakukan safety check.
         */

        if(
            stockBefore !== null
        ){

            const stockFinal =
                BarangRepository.getStock(
                    "BRG000001"
                );


            Logger.log(
                "FINAL STOCK:"
            );

            Logger.log(
                stockFinal
            );


            if(
                stockFinal ===
                stockBefore
            ){

                Logger.log(
                    "STOCK BASELINE RESTORE PASS"
                );

            }
            else{

                Logger.log(
                    "WARNING: STOCK BASELINE BERBEDA."
                );

            }

        }

    }

}
