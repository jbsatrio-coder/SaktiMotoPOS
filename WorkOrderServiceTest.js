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

function testWorkOrderServiceChangeStatus(){

    const workOrderId =
        "WO2608100001";


    const nextStatus =
        WorkOrderStatus.MENUNGGU_APPROVAL;


    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER SERVICE CHANGE STATUS TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * STATUS SEBELUM
     * ========================================
     */

    const before =
        WorkOrderRepository.findById(
            workOrderId
        );


    Logger.log(
        "STATUS SEBELUM:"
    );

    Logger.log(
        before[
            COL_WORK_ORDER.STATUS
        ]
    );


    /**
     * ========================================
     * CHANGE STATUS
     * ========================================
     */

    const result =
        WorkOrderService.changeStatus(

            workOrderId,

            nextStatus

        );


    Logger.log(
        "CHANGE STATUS RESULT:"
    );

    Logger.log(
        result
    );


    /**
     * ========================================
     * BACA ULANG
     * ========================================
     */

    const after =
        WorkOrderRepository.findById(
            workOrderId
        );


    Logger.log(
        "STATUS SESUDAH:"
    );

    Logger.log(
        after[
            COL_WORK_ORDER.STATUS
        ]
    );


    /**
     * ========================================
     * VALIDASI
     * ========================================
     */

    const statusMatch =

        after[
            COL_WORK_ORDER.STATUS
        ] === nextStatus;


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        statusMatch
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "CHANGE STATUS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testWorkOrderServiceChangeStatusInvalid(){

    const workOrderId =
        "WO2608100001";


    const invalidStatus =
        WorkOrderStatus.DRAFT;


    Logger.log(
        "================================"
    );

    Logger.log(
        "INVALID CHANGE STATUS TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * STATUS SEBELUM
     * ========================================
     */

    const before =
        WorkOrderRepository.findById(
            workOrderId
        );


    const statusBefore =
        before[
            COL_WORK_ORDER.STATUS
        ];


    Logger.log(
        "STATUS SEBELUM:"
    );

    Logger.log(
        statusBefore
    );


    /**
     * ========================================
     * COBA TRANSITION INVALID
     * ========================================
     */

    let errorDetected = false;


    try{

        WorkOrderService.changeStatus(

            workOrderId,

            invalidStatus

        );

    }
    catch(error){

        errorDetected = true;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * BACA ULANG
     * ========================================
     */

    const after =
        WorkOrderRepository.findById(
            workOrderId
        );


    const statusAfter =
        after[
            COL_WORK_ORDER.STATUS
        ];


    Logger.log(
        "STATUS SESUDAH:"
    );

    Logger.log(
        statusAfter
    );


    /**
     * ========================================
     * VALIDASI ERROR
     * ========================================
     */

    Logger.log(
        "ERROR TERDETEKSI:"
    );

    Logger.log(
        errorDetected
    );


    /**
     * ========================================
     * VALIDASI STATUS TIDAK BERUBAH
     * ========================================
     */

    const statusUnchanged =
        statusAfter === statusBefore;


    Logger.log(
        "STATUS TETAP:"
    );

    Logger.log(
        statusUnchanged
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "INVALID CHANGE STATUS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testWorkOrderServiceChangeStatusToSelesaiSuccess(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "CHANGE STATUS TO SELESAI SUCCESS TEST"
    );

    Logger.log(
        "================================"
    );


    const workOrderId =
        "WO2608100001";


    /**
     * Pastikan status saat ini
     * DALAM_PENGERJAAN
     */

    const before =
        WorkOrderRepository.findById(
            workOrderId
        );


    Logger.log(
        "STATUS SEBELUM:"
    );

    Logger.log(
        before[
            COL_WORK_ORDER.STATUS
        ]
    );


    /**
     * Jalankan change status
     */

    const result =
        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SELESAI

        );


    Logger.log(
        "CHANGE STATUS RESULT:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );


    /**
     * Cek status aktual
     */

    const after =
        WorkOrderRepository.findById(
            workOrderId
        );


    Logger.log(
        "STATUS SESUDAH:"
    );

    Logger.log(
        after[
            COL_WORK_ORDER.STATUS
        ]
    );


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        after[
            COL_WORK_ORDER.STATUS
        ] ===
        WorkOrderStatus.SELESAI
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "SUCCESS TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Completion Gate Failure
 * ============================================
 */

function testWorkOrderServiceCompletionGateFailure(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE FAILURE TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE TEST WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Completion Gate Failure Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "TEST WORK ORDER:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE PART
     *
     * Tidak dilakukan Stock Out.
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            status :
                "AKTIF",

            catatan :
                "Completion Gate Failure Test"

        });


    Logger.log(
        "TEST PART:"
    );

    Logger.log(
        partResult.workOrderPartId
    );


    /**
     * ========================================
     * 3. DRAFT
     * → MENUNGGU_DIAGNOSA
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_DIAGNOSA

    );


    /**
     * ========================================
     * 4. MENUNGGU_DIAGNOSA
     * → MENUNGGU_APPROVAL
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_APPROVAL

    );


    /**
     * ========================================
     * 5. MENUNGGU_APPROVAL
     * → DALAM_PENGERJAAN
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.DALAM_PENGERJAAN

    );


    /**
     * ========================================
     * 6. CEK COMPLETION
     * ========================================
     */

    const completion =
        WorkOrderStatusService.canComplete(
            workOrderId
        );


    Logger.log(
        "CAN COMPLETE:"
    );

    Logger.log(
        completion.canComplete
    );


    Logger.log(
        "COMPLETION RESULT:"
    );

    Logger.log(
        JSON.stringify(
            completion
        )
    );


    /**
     * ========================================
     * 7. COBA SELESAI
     * ========================================
     */

    let errorDetected =
        false;


    try{

        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SELESAI

        );

    }
    catch(error){

        errorDetected =
            true;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * 8. CEK STATUS
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
        "ERROR TERDETEKSI:"
    );

    Logger.log(
        errorDetected
    );


    Logger.log(
        "STATUS AKHIR:"
    );

    Logger.log(
        finalStatus
    );


    Logger.log(
        "STATUS TETAP DALAM_PENGERJAAN:"
    );

    Logger.log(
        finalStatus ===
        WorkOrderStatus.DALAM_PENGERJAAN
    );

        /**
     * ========================================
     * 9. FINAL ASSERT
     * ========================================
     */

    if(
        completion.canComplete !== false ||
        !errorDetected ||
        finalStatus !==
            WorkOrderStatus.DALAM_PENGERJAAN
    ){

        throw new Error(
            "Completion Gate Failure Test gagal."
        );

    }


    Logger.log(
        "COMPLETION GATE FAILURE TEST PASS"
    );

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE FAILURE TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Completion Gate Success
 * ============================================
 */

function testWorkOrderServiceCompletionGateSuccess(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE SUCCESS TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Completion Gate Success Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "TEST WORK ORDER:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER PART
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Completion Gate Success Test Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "TEST WORK ORDER PART:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     */

    const partStatusResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "WOP OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            partStatusResult
        )
    );


    /**
     * ========================================
     * 4. DRAFT → MENUNGGU_DIAGNOSA
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_DIAGNOSA

    );


    /**
     * ========================================
     * 5. MENUNGGU_DIAGNOSA
     * → MENUNGGU_APPROVAL
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_APPROVAL

    );


    /**
     * ========================================
     * 6. MENUNGGU_APPROVAL
     * → DALAM_PENGERJAAN
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.DALAM_PENGERJAAN

    );


    Logger.log(
        "WO STATUS:"
    );

    const workOrderProgress =
        WorkOrderRepository.findById(
            workOrderId
        );


    Logger.log(
        workOrderProgress[
            COL_WORK_ORDER.STATUS
        ]
    );


    /**
     * ========================================
     * 7. CONSUME STOCK
     * ========================================
     *
     * Stock Out harus terjadi setelah
     * WOP berstatus PROGRESS.
     */

    const consumeResult =
        WorkOrderPartService.consumeStockBatch(
            workOrderId
        );


    Logger.log(
        "CONSUME STOCK RESULT:"
    );

    Logger.log(
        JSON.stringify(
            consumeResult
        )
    );


    /**
     * ========================================
     * 8. CEK COMPLETION GATE
     * ========================================
     */

    const completion =
        WorkOrderStatusService.canComplete(
            workOrderId
        );


    Logger.log(
        "CAN COMPLETE:"
    );

    Logger.log(
        completion.canComplete
    );


    Logger.log(
        "COMPLETION RESULT:"
    );

    Logger.log(
        JSON.stringify(
            completion
        )
    );


    /**
     * ========================================
     * 9. ASSERT CAN COMPLETE
     * ========================================
     */

    if(
        completion.canComplete !==
        true
    ){

        throw new Error(
            "Completion Gate Success Test gagal: " +
            completion.reason
        );

    }


    /**
     * ========================================
     * 10. CHANGE STATUS → SELESAI
     * ========================================
     */

    const result =
        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SELESAI

        );


    Logger.log(
        "CHANGE STATUS RESULT:"
    );

    Logger.log(
        JSON.stringify(
            result
        )
    );


    /**
     * ========================================
     * 11. CEK STATUS AKHIR
     * ========================================
     */

    const after =
        WorkOrderRepository.findById(
            workOrderId
        );


    const statusAfter =
        after[
            COL_WORK_ORDER.STATUS
        ];


    Logger.log(
        "STATUS SESUDAH:"
    );

    Logger.log(
        statusAfter
    );


    const statusMatch =
        statusAfter ===
        WorkOrderStatus.SELESAI;


    Logger.log(
        "STATUS MATCH:"
    );

    Logger.log(
        statusMatch
    );


    /**
     * ========================================
     * 12. FINAL ASSERT
     * ========================================
     */

    if(
        !statusMatch
    ){

        throw new Error(
            "Completion Gate Success Test gagal: " +
            "status akhir bukan SELESAI."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE SUCCESS TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Completion Gate Quantity Mismatch
 * ============================================
 *
 * WOP membutuhkan qty 2.
 * Stock Ledger hanya mencatat OUT qty 1.
 *
 * Expected:
 * - barangMatch = true
 * - qtyMatch = false
 * - valid = false
 * - canComplete = false
 * - WO tidak boleh menjadi SELESAI
 * ============================================
 */

function testWorkOrderServiceCompletionGateQuantityMismatch(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE QUANTITY MISMATCH TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Completion Gate Quantity Mismatch Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "TEST WORK ORDER:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WOP QTY 2
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                2,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Completion Gate Quantity Mismatch Test Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "TEST WORK ORDER PART:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     */

    WorkOrderPartService.changeStatus(

        workOrderPartId,

        WorkOrderPartStatus.PROGRESS

    );


    /**
     * ========================================
     * 4. WO → DALAM_PENGERJAAN
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


    /**
     * ========================================
     * 5. BUAT STOCK OUT QTY 1
     * ========================================
     *
     * Sengaja hanya qty 1 meskipun WOP
     * membutuhkan qty 2.
     */

    const stockBefore =
        BarangRepository.getStock(
            "BRG000001"
        );


    const stockResult =
        StockLedgerService.recordOutBatchAtomic(

            [

                {

                    barangId :
                        "BRG000001",

                    namaBarang :
                        "Completion Gate Quantity Mismatch Test",

                    jenisMutasi :
                        "SERVICE",

                    referensi :
                        workOrderPartId,

                    stokAwal :
                        stockBefore,

                    qty :
                        1,

                    keterangan :
                        "Quantity mismatch test",

                    admin :
                        "Developer"

                }

            ]

        );


    Logger.log(
        "STOCK OUT RESULT:"
    );

    Logger.log(
        JSON.stringify(
            stockResult
        )
    );


    /**
     * ========================================
     * 6. CEK COMPLETION
     * ========================================
     */

    const completion =
        WorkOrderStatusService.canComplete(
            workOrderId
        );


    Logger.log(
        "CAN COMPLETE:"
    );

    Logger.log(
        completion.canComplete
    );


    Logger.log(
        "COMPLETION RESULT:"
    );

    Logger.log(
        JSON.stringify(
            completion
        )
    );


    /**
     * ========================================
     * 7. EXPECTED VALIDATION
     * ========================================
     */

    const detail =
        completion.parts.details[0];


    const barangMatch =
        detail.barangMatch === true;


    const qtyMismatch =
        detail.qtyMatch === false;


    const invalid =
        detail.valid === false;


    const cannotComplete =
        completion.canComplete === false;


    Logger.log(
        "BARANG MATCH:"
    );

    Logger.log(
        barangMatch
    );


    Logger.log(
        "QTY MISMATCH:"
    );

    Logger.log(
        qtyMismatch
    );


    Logger.log(
        "VALID = FALSE:"
    );

    Logger.log(
        invalid
    );


    Logger.log(
        "CAN COMPLETE = FALSE:"
    );

    Logger.log(
        cannotComplete
    );


    /**
     * ========================================
     * 8. COBA SELESAI
     * ========================================
     */

    let errorDetected =
        false;


    try{

        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SELESAI

        );

    }
    catch(error){

        errorDetected =
            true;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * 9. CEK STATUS
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
        "ERROR TERDETEKSI:"
    );

    Logger.log(
        errorDetected
    );


    Logger.log(
        "STATUS AKHIR:"
    );

    Logger.log(
        finalStatus
    );


    /**
     * ========================================
     * 10. FINAL ASSERT
     * ========================================
     */

    if(

        !barangMatch ||
        !qtyMismatch ||
        !invalid ||
        !cannotComplete ||
        !errorDetected ||
        finalStatus !==
            WorkOrderStatus.DALAM_PENGERJAAN

    ){

        throw new Error(
            "Completion Gate Quantity Mismatch Test gagal."
        );

    }


    Logger.log(
        "COMPLETION GATE QUANTITY MISMATCH TEST PASS"
    );

    Logger.log(
        "================================"
    );

}



/**
 * ============================================
 * TEST: Completion Gate Quantity Excess
 * ============================================
 *
 * WOP membutuhkan qty 1.
 * Stock Ledger mencatat OUT qty 2.
 *
 * Expected:
 * - barangMatch = true
 * - qtyWOP = 1
 * - qtyLedger = 2
 * - qtyMatch = false
 * - valid = false
 * - canComplete = false
 * - WO tetap DALAM_PENGERJAAN
 * ============================================
 */

function testWorkOrderServiceCompletionGateQuantityExcess(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE QUANTITY EXCESS TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Completion Gate Quantity Excess Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "TEST WORK ORDER:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WOP QTY 1
     * ========================================
     */

    const partResult =
        WorkOrderPartService.create({

            workOrderId :
                workOrderId,

            barangId :
                "BRG000001",

            workOrderJasaId :
                "",

            qty :
                1,

            harga :
                55000,

            diskon :
                0,

            catatan :
                "Completion Gate Quantity Excess Test Part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "TEST WORK ORDER PART:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 3. OPEN → PROGRESS
     * ========================================
     */

    WorkOrderPartService.changeStatus(

        workOrderPartId,

        WorkOrderPartStatus.PROGRESS

    );


    /**
     * ========================================
     * 4. WO → DALAM_PENGERJAAN
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


    /**
     * ========================================
     * 5. STOCK OUT QTY 2
     * ========================================
     *
     * Sengaja lebih besar daripada
     * qty WOP = 1.
     *
     * Kita menggunakan StockLedgerService
     * secara langsung agar test dapat
     * menguji Completion Gate secara spesifik.
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            "BRG000001"
        );


    const stockRequest = {

        barangId :
            "BRG000001",

        qty :
            2,

        referensi :
            workOrderPartId,

        keterangan :
            "Completion Gate Quantity Excess Test"

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
            stockResult
        )
    );


    /**
     * ========================================
     * 6. CEK COMPLETION
     * ========================================
     */

    const completion =
        WorkOrderStatusService.canComplete(
            workOrderId
        );


    Logger.log(
        "CAN COMPLETE:"
    );

    Logger.log(
        completion.canComplete
    );


    Logger.log(
        "COMPLETION RESULT:"
    );

    Logger.log(
        JSON.stringify(
            completion
        )
    );


    /**
     * ========================================
     * 7. AMBIL DETAIL PART
     * ========================================
     */

    const detail =
        completion.parts.details[0];


    const barangMatch =
        detail.barangMatch;


    const qtyWOP =
        detail.qtyWOP;


    const qtyLedger =
        detail.qtyLedger;


    const qtyMismatch =
        detail.qtyMatch ===
        false;


    const invalid =
        detail.valid ===
        false;


    Logger.log(
        "BARANG MATCH:"
    );

    Logger.log(
        barangMatch
    );


    Logger.log(
        "QTY WOP:"
    );

    Logger.log(
        qtyWOP
    );


    Logger.log(
        "QTY LEDGER:"
    );

    Logger.log(
        qtyLedger
    );


    Logger.log(
        "QTY MISMATCH:"
    );

    Logger.log(
        qtyMismatch
    );


    Logger.log(
        "VALID = FALSE:"
    );

    Logger.log(
        invalid
    );


    /**
     * ========================================
     * 8. COBA SELESAI
     * ========================================
     */

    let errorDetected =
        false;


    try{

        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SELESAI

        );

    }
    catch(error){

        errorDetected =
            true;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * 9. CEK STATUS AKHIR
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
        "ERROR TERDETEKSI:"
    );

    Logger.log(
        errorDetected
    );


    Logger.log(
        "STATUS AKHIR:"
    );

    Logger.log(
        finalStatus
    );


    /**
     * ========================================
     * 10. ASSERT
     * ========================================
     */

    const cannotComplete =
        completion.canComplete ===
        false;


    if(

        !barangMatch ||
        qtyWOP !== 1 ||
        qtyLedger !== 2 ||
        !qtyMismatch ||
        !invalid ||
        !cannotComplete ||
        !errorDetected ||
        finalStatus !==
            WorkOrderStatus.DALAM_PENGERJAAN

    ){

        throw new Error(
            "Completion Gate Quantity Excess Test gagal."
        );

    }


    Logger.log(
        "COMPLETION GATE QUANTITY EXCESS TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST CLEANUP: Quantity Excess
 * ============================================
 *
 * Mengembalikan stock yang terpakai oleh
 * Completion Gate Quantity Excess Test.
 *
 * Test sebelumnya:
 * BRG000001 : 97 -> 95
 * Ledger     : STK2608140014
 * Qty OUT    : 2
 *
 * Cleanup:
 * BRG000001 : 95 -> 97
 * Ledger test dihapus.
 * ============================================
 */

/**
 * ============================================
 * TEST CLEANUP:
 * Completion Gate Quantity Excess
 * ============================================
 *
 * Cleanup untuk test terakhir:
 *
 * BRG000001
 * Stock sebelum test : 97
 * Stock OUT          : 2
 * Stock setelah test : 95
 *
 * Ledger:
 * STK2608140014
 *
 * Expected:
 * - Ledger test dihapus
 * - Stock kembali menjadi 97
 * ============================================
 */

function testCleanupCompletionGateQuantityExcess(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "CLEANUP COMPLETION GATE QUANTITY EXCESS"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CONFIG
     * ========================================
     */

    const barangId =
        "BRG000001";

    const stockLedgerId =
        "STK2608140014";

    const expectedStock =
        97;


    /**
     * ========================================
     * 2. STOCK SEBELUM CLEANUP
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            barangId
        );


    Logger.log(
        "STOCK SEBELUM CLEANUP:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 3. DELETE TEST LEDGER
     * ========================================
     */

    StockLedgerService.deleteLedgerById_(
        stockLedgerId
    );


    /**
     * ========================================
     * 4. RESTORE STOCK
     * ========================================
     */

    BarangRepository.updateStockAbsolute(

        barangId,

        expectedStock

    );


    /**
     * ========================================
     * 5. VERIFY STOCK
     * ========================================
     */

    const stockAfter =
        BarangRepository.getStock(
            barangId
        );


    Logger.log(
        "STOCK SETELAH CLEANUP:"
    );

    Logger.log(
        stockAfter
    );


    /**
     * ========================================
     * 6. VERIFY LEDGER
     * ========================================
     *
     * Repository tidak memiliki findById().
     *
     * Karena referensi ledger test adalah
     * WorkOrderPart ID, kita akan mencari
     * menggunakan referensi WOP setelah
     * kita mengetahui WOP test.
     *
     * Untuk tahap ini kita verifikasi stock
     * terlebih dahulu.
     * ========================================
     */


    /**
     * ========================================
     * 7. ASSERT STOCK
     * ========================================
     */

    const stockRestored =
        stockAfter ===
        expectedStock;


    Logger.log(
        "STOCK RESTORED:"
    );

    Logger.log(
        stockRestored
    );


    if(
        !stockRestored
    ){

        throw new Error(
            "Cleanup Quantity Excess gagal: " +
            "stock tidak kembali ke " +
            expectedStock
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "CLEANUP COMPLETION GATE QUANTITY EXCESS PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Completion Gate Jasa Failure
 * ============================================
 *
 * Jasa masih OPEN.
 *
 * Expected:
 *
 * canComplete = false
 * jasa.total = 1
 * jasa.selesai = 0
 * jasa.belumSelesai = 1
 *
 * WO tidak boleh menjadi SELESAI.
 * Status tetap DALAM_PENGERJAAN.
 * ============================================
 */

function testWorkOrderServiceCompletionGateJasaFailure(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA FAILURE TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE TEST WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Completion Gate Jasa Failure Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "TEST WORK ORDER:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER JASA
     * ========================================
     *
     * Jasa dibuat dengan status OPEN.
     */

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
                "Completion Gate Jasa Failure Test",

            diagnosa :
                "Test jasa belum selesai",

            catatan :
                "Jasa masih OPEN"

        });


    const workOrderJasaId =
        jasaResult.workOrderJasaId;


    Logger.log(
        "TEST WORK ORDER JASA:"
    );

    Logger.log(
        workOrderJasaId
    );


    /**
     * ========================================
     * 3. VERIFY JASA STATUS OPEN
     * ========================================
     */

    const jasaBefore =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    const jasaStatusBefore =
        jasaBefore[
            COL_WO_JASA.STATUS
        ];


    Logger.log(
        "JASA STATUS:"
    );

    Logger.log(
        jasaStatusBefore
    );


    const jasaIsOpen =
        jasaStatusBefore ===
        WorkOrderJasaStatus.OPEN;


    Logger.log(
        "JASA = OPEN:"
    );

    Logger.log(
        jasaIsOpen
    );


    if(
        !jasaIsOpen
    ){

        throw new Error(
            "Completion Gate Jasa Failure Test gagal: " +
            "status awal jasa bukan OPEN."
        );

    }


    /**
     * ========================================
     * 4. DRAFT
     * → MENUNGGU_DIAGNOSA
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_DIAGNOSA

    );


    /**
     * ========================================
     * 5. MENUNGGU_DIAGNOSA
     * → MENUNGGU_APPROVAL
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_APPROVAL

    );


    /**
     * ========================================
     * 6. MENUNGGU_APPROVAL
     * → DALAM_PENGERJAAN
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.DALAM_PENGERJAAN

    );


    /**
     * ========================================
     * 7. CEK COMPLETION GATE
     * ========================================
     */

    const completion =
        WorkOrderStatusService.canComplete(
            workOrderId
        );


    Logger.log(
        "CAN COMPLETE:"
    );

    Logger.log(
        completion.canComplete
    );


    Logger.log(
        "COMPLETION RESULT:"
    );

    Logger.log(
        JSON.stringify(
            completion
        )
    );


    /**
     * ========================================
     * 8. CEK DETAIL JASA
     * ========================================
     */

    const jasaTotal =
        completion.jasa.total;


    const jasaSelesai =
        completion.jasa.selesai;


    const jasaBelumSelesai =
        completion.jasa.belumSelesai;


    Logger.log(
        "JASA TOTAL:"
    );

    Logger.log(
        jasaTotal
    );


    Logger.log(
        "JASA SELESAI:"
    );

    Logger.log(
        jasaSelesai
    );


    Logger.log(
        "JASA BELUM SELESAI:"
    );

    Logger.log(
        jasaBelumSelesai
    );


    /**
     * ========================================
     * 9. EXPECTED RESULT
     * ========================================
     */

    const cannotComplete =
        completion.canComplete ===
        false;


    const jasaTotalCorrect =
        jasaTotal ===
        1;


    const jasaSelesaiCorrect =
        jasaSelesai ===
        0;


    const jasaBelumSelesaiCorrect =
        jasaBelumSelesai ===
        1;


    Logger.log(
        "CAN COMPLETE = FALSE:"
    );

    Logger.log(
        cannotComplete
    );


    Logger.log(
        "JASA TOTAL = 1:"
    );

    Logger.log(
        jasaTotalCorrect
    );


    Logger.log(
        "JASA SELESAI = 0:"
    );

    Logger.log(
        jasaSelesaiCorrect
    );


    Logger.log(
        "JASA BELUM SELESAI = 1:"
    );

    Logger.log(
        jasaBelumSelesaiCorrect
    );


    /**
     * ========================================
     * 10. COBA SELESAI
     * ========================================
     */

    let errorDetected =
        false;


    try{

        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SELESAI

        );

    }
    catch(error){

        errorDetected =
            true;


        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    /**
     * ========================================
     * 11. CEK STATUS AKHIR WO
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


    const statusUnchanged =
        finalStatus ===
        WorkOrderStatus.DALAM_PENGERJAAN;


    Logger.log(
        "ERROR TERDETEKSI:"
    );

    Logger.log(
        errorDetected
    );


    Logger.log(
        "STATUS AKHIR:"
    );

    Logger.log(
        finalStatus
    );


    Logger.log(
        "STATUS TETAP DALAM_PENGERJAAN:"
    );

    Logger.log(
        statusUnchanged
    );


    /**
     * ========================================
     * 12. FINAL ASSERT
     * ========================================
     */

    if(

        !cannotComplete ||

        !jasaTotalCorrect ||

        !jasaSelesaiCorrect ||

        !jasaBelumSelesaiCorrect ||

        !errorDetected ||

        !statusUnchanged

    ){

        throw new Error(
            "Completion Gate Jasa Failure Test gagal."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA FAILURE TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Completion Gate Jasa Success
 * ============================================
 *
 * Jasa harus:
 *
 * OPEN
 * → PROGRESS
 * → DONE
 *
 * Setelah jasa DONE:
 *
 * canComplete = true
 *
 * WO boleh:
 *
 * DALAM_PENGERJAAN
 * → SELESAI
 *
 * ============================================
 */

function testWorkOrderServiceCompletionGateJasaSuccess(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA SUCCESS TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Completion Gate Jasa Success Test"

        });


    const workOrderId =
        woResult.workOrderId;


    Logger.log(
        "TEST WORK ORDER:"
    );

    Logger.log(
        workOrderId
    );


    /**
     * ========================================
     * 2. CREATE WORK ORDER JASA
     * ========================================
     */

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
                "Completion Gate Jasa Success Test",

            diagnosa :
                "Test jasa selesai",

            catatan :
                "Completion Gate Jasa Success"

        });


    const workOrderJasaId =
        jasaResult.workOrderJasaId;


    Logger.log(
        "TEST WORK ORDER JASA:"
    );

    Logger.log(
        workOrderJasaId
    );


    /**
     * ========================================
     * 3. VERIFY OPEN
     * ========================================
     */

    let jasaRow =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    const initialStatus =
        jasaRow[
            COL_WO_JASA.STATUS
        ];


    Logger.log(
        "JASA STATUS AWAL:"
    );

    Logger.log(
        initialStatus
    );


    if(
        initialStatus !==
        WorkOrderJasaStatus.OPEN
    ){

        throw new Error(
            "Completion Gate Jasa Success Test gagal: " +
            "status awal jasa bukan OPEN."
        );

    }


    /**
     * ========================================
     * 4. OPEN → PROGRESS
     * ========================================
     */

    const progressResult =
        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.PROGRESS

        );


    Logger.log(
        "JASA OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            progressResult
        )
    );


    /**
     * ========================================
     * 5. PROGRESS → DONE
     * ========================================
     */

    const doneResult =
        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.DONE

        );


    Logger.log(
        "JASA PROGRESS → DONE:"
    );

    Logger.log(
        JSON.stringify(
            doneResult
        )
    );


    /**
     * ========================================
     * 6. VERIFY JASA DONE
     * ========================================
     */

    jasaRow =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    const finalJasaStatus =
        jasaRow[
            COL_WO_JASA.STATUS
        ];


    Logger.log(
        "JASA STATUS AKHIR:"
    );

    Logger.log(
        finalJasaStatus
    );


    const jasaDone =
        finalJasaStatus ===
        WorkOrderJasaStatus.DONE;


    Logger.log(
        "JASA = DONE:"
    );

    Logger.log(
        jasaDone
    );


    if(
        !jasaDone
    ){

        throw new Error(
            "Completion Gate Jasa Success Test gagal: " +
            "jasa tidak berhasil menjadi DONE."
        );

    }


    /**
     * ========================================
     * 7. WO DRAFT
     * → MENUNGGU_DIAGNOSA
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_DIAGNOSA

    );


    /**
     * ========================================
     * 8. MENUNGGU_DIAGNOSA
     * → MENUNGGU_APPROVAL
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_APPROVAL

    );


    /**
     * ========================================
     * 9. MENUNGGU_APPROVAL
     * → DALAM_PENGERJAAN
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.DALAM_PENGERJAAN

    );


    /**
     * ========================================
     * 10. CEK COMPLETION GATE
     * ========================================
     */

    const completion =
        WorkOrderStatusService.canComplete(
            workOrderId
        );


    Logger.log(
        "CAN COMPLETE:"
    );

    Logger.log(
        completion.canComplete
    );


    Logger.log(
        "COMPLETION RESULT:"
    );

    Logger.log(
        JSON.stringify(
            completion
        )
    );


    /**
     * ========================================
     * 11. CEK DETAIL JASA
     * ========================================
     */

    const jasaTotal =
        completion.jasa.total;


    const jasaSelesai =
        completion.jasa.selesai;


    const jasaBelumSelesai =
        completion.jasa.belumSelesai;


    Logger.log(
        "JASA TOTAL:"
    );

    Logger.log(
        jasaTotal
    );


    Logger.log(
        "JASA SELESAI:"
    );

    Logger.log(
        jasaSelesai
    );


    Logger.log(
        "JASA BELUM SELESAI:"
    );

    Logger.log(
        jasaBelumSelesai
    );


    /**
     * ========================================
     * 12. EXPECTED RESULT
     * ========================================
     */

    const canComplete =
        completion.canComplete ===
        true;


    const jasaTotalCorrect =
        jasaTotal ===
        1;


    const jasaSelesaiCorrect =
        jasaSelesai ===
        1;


    const jasaBelumSelesaiCorrect =
        jasaBelumSelesai ===
        0;


    Logger.log(
        "CAN COMPLETE = TRUE:"
    );

    Logger.log(
        canComplete
    );


    Logger.log(
        "JASA TOTAL = 1:"
    );

    Logger.log(
        jasaTotalCorrect
    );


    Logger.log(
        "JASA SELESAI = 1:"
    );

    Logger.log(
        jasaSelesaiCorrect
    );


    Logger.log(
        "JASA BELUM SELESAI = 0:"
    );

    Logger.log(
        jasaBelumSelesaiCorrect
    );


    /**
     * ========================================
     * 13. CHANGE WO → SELESAI
     * ========================================
     */

    let errorDetected =
        false;

    let completionResult =
        null;


    try{

        completionResult =
            WorkOrderService.changeStatus(

                workOrderId,

                WorkOrderStatus.SELESAI

            );

    }
    catch(error){

        errorDetected =
            true;


        Logger.log(
            "UNEXPECTED ERROR:"
        );

        Logger.log(
            error.message
        );

    }


    Logger.log(
        "CHANGE STATUS RESULT:"
    );

    Logger.log(
        JSON.stringify(
            completionResult
        )
    );


    /**
     * ========================================
     * 14. CEK STATUS WO
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


    const statusMatch =
        finalStatus ===
        WorkOrderStatus.SELESAI;


    Logger.log(
        "STATUS WO AKHIR:"
    );

    Logger.log(
        finalStatus
    );


    Logger.log(
        "STATUS = SELESAI:"
    );

    Logger.log(
        statusMatch
    );


    /**
     * ========================================
     * 15. FINAL ASSERT
     * ========================================
     */

    if(

        !jasaDone ||

        !canComplete ||

        !jasaTotalCorrect ||

        !jasaSelesaiCorrect ||

        !jasaBelumSelesaiCorrect ||

        errorDetected ||

        !statusMatch

    ){

        throw new Error(
            "Completion Gate Jasa Success Test gagal."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "COMPLETION GATE JASA SUCCESS TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

/**
 * ============================================
 * TEST: Integrated Work Order Lifecycle
 * ============================================
 *
 * Satu WO berisi:
 * - 1 Jasa
 * - 1 Sparepart
 *
 * Lifecycle:
 *
 * DRAFT
 *   ↓
 * MENUNGGU_DIAGNOSA
 *   ↓
 * MENUNGGU_APPROVAL
 *   ↓
 * DALAM_PENGERJAAN
 *
 * JASA:
 * OPEN → PROGRESS → DONE
 *
 * PART:
 * OPEN → PROGRESS → STOCK OUT
 *
 * Setelah seluruh pekerjaan terpenuhi:
 *
 * COMPLETION GATE
 *   ↓
 * SELESAI
 *
 * Expected:
 * - WO berakhir SELESAI
 * - Jasa berakhir DONE
 * - Part berakhir PROGRESS
 * - Stock berkurang sesuai qty
 * - Stock Ledger terbentuk
 * - canComplete = true
 */

function testWorkOrderIntegratedLifecycle(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER INTEGRATED LIFECYCLE TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * 1. CREATE WORK ORDER
     * ========================================
     */

    const woResult =
        WorkOrderService.create({

            customerId :
                "CUS999999",

            vehicleId :
                "VEH2608060003",

            kilometerMasuk :
                16000,

            admin :
                "Developer",

            jenisTransaksi :
                WorkOrderType.SERVICE,

            prioritas :
                WorkOrderPriority.NORMAL,

            catatan :
                "Integrated Lifecycle Test"

        });


    const workOrderId =
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
                "JAS000005",

            qty :
                1,

            diskon :
                0,

            mekanikId :
                "MEC000001",

            keluhan :
                "Integrated lifecycle test",

            diagnosa :
                "Integrated lifecycle diagnosis",

            catatan :
                "Integrated lifecycle jasa"

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
     * 3. CREATE PART
     * ========================================
     */

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

            status :
                "AKTIF",

            catatan :
                "Integrated lifecycle part"

        });


    const workOrderPartId =
        partResult.workOrderPartId;


    Logger.log(
        "WORK ORDER PART ID:"
    );

    Logger.log(
        workOrderPartId
    );


    /**
     * ========================================
     * 4. DRAFT → MENUNGGU_DIAGNOSA
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_DIAGNOSA

    );


    /**
     * ========================================
     * 5. MENUNGGU_DIAGNOSA
     * → MENUNGGU_APPROVAL
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.MENUNGGU_APPROVAL

    );


    /**
     * ========================================
     * 6. MENUNGGU_APPROVAL
     * → DALAM_PENGERJAAN
     * ========================================
     */

    WorkOrderService.changeStatus(

        workOrderId,

        WorkOrderStatus.DALAM_PENGERJAAN

    );


    /**
     * ========================================
     * 7. CEK STATUS WO
     * ========================================
     */

    const woProgress =
        WorkOrderRepository.findById(
            workOrderId
        );


    const woStatusBeforeWork =
        woProgress[
            COL_WORK_ORDER.STATUS
        ];


    Logger.log(
        "WO STATUS:"
    );

    Logger.log(
        woStatusBeforeWork
    );


    /**
     * ========================================
     * 8. CEK STOCK AWAL
     * ========================================
     */

    const stockBefore =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SEBELUM:"
    );

    Logger.log(
        stockBefore
    );


    /**
     * ========================================
     * 9. JASA OPEN → PROGRESS
     * ========================================
     */

    const jasaProgressResult =
        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.PROGRESS

        );


    Logger.log(
        "JASA OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            jasaProgressResult
        )
    );


    /**
     * ========================================
     * 10. JASA PROGRESS → DONE
     * ========================================
     */

    const jasaDoneResult =
        WorkOrderJasaService.changeStatus(

            workOrderJasaId,

            WorkOrderJasaStatus.DONE

        );


    Logger.log(
        "JASA PROGRESS → DONE:"
    );

    Logger.log(
        JSON.stringify(
            jasaDoneResult
        )
    );


    /**
     * ========================================
     * 11. PART OPEN → PROGRESS
     * ========================================
     */

    const partProgressResult =
        WorkOrderPartService.changeStatus(

            workOrderPartId,

            WorkOrderPartStatus.PROGRESS

        );


    Logger.log(
        "PART OPEN → PROGRESS:"
    );

    Logger.log(
        JSON.stringify(
            partProgressResult
        )
    );


    /**
     * ========================================
     * 12. CONSUME STOCK
     * ========================================
     */

    const stockOutResult =
        WorkOrderPartService.consumeStockBatch(
            workOrderId
        );


    Logger.log(
        "STOCK OUT RESULT:"
    );

    Logger.log(
        JSON.stringify(
            stockOutResult
        )
    );


    /**
     * ========================================
     * 13. CEK STOCK SETELAH OUT
     * ========================================
     */

    const stockAfter =
        BarangRepository.getStock(
            "BRG000001"
        );


    Logger.log(
        "STOCK SETELAH OUT:"
    );

    Logger.log(
        stockAfter
    );


    /**
     * ========================================
     * 14. CEK LEDGER
     * ========================================
     */

    const ledgers =
        StockLedgerRepository.findByReferensi(
            workOrderPartId
        );


    let qtyLedger = 0;


    for(
        let i = 0;
        i < ledgers.length;
        i++
    ){

        qtyLedger +=
            Number(
                ledgers[i][
                    COL_STOK.QTYKELUAR
                ]
            ) || 0;

    }


    Logger.log(
        "LEDGER COUNT:"
    );

    Logger.log(
        ledgers.length
    );


    Logger.log(
        "QTY LEDGER:"
    );

    Logger.log(
        qtyLedger
    );


    /**
     * ========================================
     * 15. CEK COMPLETION GATE
     * ========================================
     */

    const completion =
        WorkOrderStatusService.canComplete(
            workOrderId
        );


    Logger.log(
        "CAN COMPLETE:"
    );

    Logger.log(
        completion.canComplete
    );


    Logger.log(
        "COMPLETION RESULT:"
    );

    Logger.log(
        JSON.stringify(
            completion
        )
    );


    /**
     * ========================================
     * 16. CHANGE WO → SELESAI
     * ========================================
     */

    const completeResult =
        WorkOrderService.changeStatus(

            workOrderId,

            WorkOrderStatus.SELESAI

        );


    Logger.log(
        "WO → SELESAI:"
    );

    Logger.log(
        JSON.stringify(
            completeResult
        )
    );


    /**
     * ========================================
     * 17. CEK FINAL WO
     * ========================================
     */

    const woAfter =
        WorkOrderRepository.findById(
            workOrderId
        );


    const finalWOStatus =
        woAfter[
            COL_WORK_ORDER.STATUS
        ];


    /**
     * ========================================
     * 18. CEK FINAL JASA
     * ========================================
     */

    const jasaAfter =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    const finalJasaStatus =
        jasaAfter[
            COL_WO_JASA.STATUS
        ];


    /**
     * ========================================
     * 19. CEK FINAL PART
     * ========================================
     */

    const partAfter =
        WorkOrderPartRepository.findById(
            workOrderPartId
        );


    const finalPartStatus =
        partAfter[
            COL_WORK_ORDER_PART.STATUS
        ];


    Logger.log(
        "FINAL WO STATUS:"
    );

    Logger.log(
        finalWOStatus
    );


    Logger.log(
        "FINAL JASA STATUS:"
    );

    Logger.log(
        finalJasaStatus
    );


    Logger.log(
        "FINAL PART STATUS:"
    );

    Logger.log(
        finalPartStatus
    );


    /**
     * ========================================
     * 20. BUSINESS ASSERT
     * ========================================
     */

    const woStatusMatch =
        finalWOStatus ===
        WorkOrderStatus.SELESAI;


    const jasaStatusMatch =
        finalJasaStatus ===
        WorkOrderJasaStatus.DONE;


    const partStatusMatch =
        finalPartStatus ===
        WorkOrderPartStatus.PROGRESS;


    const stockReduced =
        stockAfter ===
        stockBefore - 1;


    const ledgerCreated =
        ledgers.length ===
        1;


    const ledgerQtyMatch =
        qtyLedger ===
        1;


    const completionPassed =
        completion.canComplete ===
        true;


    Logger.log(
        "WO STATUS MATCH:"
    );

    Logger.log(
        woStatusMatch
    );


    Logger.log(
        "JASA STATUS MATCH:"
    );

    Logger.log(
        jasaStatusMatch
    );


    Logger.log(
        "PART STATUS MATCH:"
    );

    Logger.log(
        partStatusMatch
    );


    Logger.log(
        "STOCK BERKURANG 1:"
    );

    Logger.log(
        stockReduced
    );


    Logger.log(
        "LEDGER CREATED:"
    );

    Logger.log(
        ledgerCreated
    );


    Logger.log(
        "LEDGER QTY MATCH:"
    );

    Logger.log(
        ledgerQtyMatch
    );


    Logger.log(
        "COMPLETION GATE PASS:"
    );

    Logger.log(
        completionPassed
    );


    /**
     * ========================================
     * 21. FINAL ASSERT
     * ========================================
     */

    if(

        woStatusBeforeWork !==
            WorkOrderStatus.DALAM_PENGERJAAN ||

        !woStatusMatch ||

        !jasaStatusMatch ||

        !partStatusMatch ||

        !stockReduced ||

        !ledgerCreated ||

        !ledgerQtyMatch ||

        !completionPassed

    ){

        throw new Error(
            "Integrated Lifecycle Test gagal."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER INTEGRATED LIFECYCLE TEST PASS"
    );

    Logger.log(
        "================================"
    );

}