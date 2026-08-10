function testServiceCreateWorkOrder(){

    Logger.log(

        WorkOrderService.create({

            jenisTransaksi :
                WorkOrderType.SERVICE,

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                15250,

            prioritas :
                WorkOrderPriority.NORMAL,

            estimasiSelesai :
                "",

            admin :
                "Admin",

            catatan :
                "Test service"

        })

    );

}


function testServiceCreatePartOnlyWorkOrder(){

    Logger.log(

        WorkOrderService.create({

            jenisTransaksi :
                WorkOrderType.PART_ONLY,

            customerId :
                "",

            vehicleId :
                "",

            kilometerMasuk :
                0,

            prioritas :
                WorkOrderPriority.NORMAL,

            estimasiSelesai :
                "",

            admin :
                "Admin",

            catatan :
                "Pembelian spare part walk-in"

        })

    );

}

function testCreateWorkOrderForBatchStock(){

    const result =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            kilometerMasuk :
                16000,

            prioritas :
                WorkOrderPriority.NORMAL,

            admin :
                "Developer",

            catatan :
                "Batch Stock Test"

        });


    Logger.log(
        "WORK ORDER CREATED:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );

}

function testCreateWorkOrderPartsForCleanBatch(){

    const workOrderId =
        "WO2608100001";


    /**
     * ========================================
     * PART 1
     * ========================================
     */

    const part1 =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            workOrderJasaId :
                "",

            barangId :
                "BRG000001",

            qty :
                2,

            harga :
                55000,

            diskon :
                0,

            status :
                "AKTIF",

            catatan :
                "Clean Batch Test Part 1"

        });


    Logger.log(
        "PART 1 CREATED:"
    );

    Logger.log(
        JSON.stringify(
            part1
        )
    );


    /**
     * ========================================
     * PART 2
     * ========================================
     */

    const part2 =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            workOrderJasaId :
                "",

            barangId :
                "BRG000002",

            qty :
                1,

            harga :
                50000,

            diskon :
                0,

            status :
                "AKTIF",

            catatan :
                "Clean Batch Test Part 2"

        });


    Logger.log(
        "PART 2 CREATED:"
    );

    Logger.log(
        JSON.stringify(
            part2
        )
    );

}

function testWorkOrderPartServiceConsumeStockBatch(){

    const result =
        WorkOrderPartService
            .consumeStockBatch(
                "WO2608100001"
            );

    Logger.log(
        "CONSUME STOCK BATCH RESULT:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );

}