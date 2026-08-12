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