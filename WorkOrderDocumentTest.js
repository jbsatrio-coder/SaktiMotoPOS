/**
 * ============================================
 * Work Order Document Test
 * ============================================
 */

function testWorkOrderDocument(){

    const document =

        WorkOrderDocument.create({

            id : "WO000001",

            customerId : "CUS999999",

            customerName : "Satrio Nugroho",

            vehicleId : "VEH2608060003",

            noPolisi : "B1234XYZ",

            merkSnapshot : "Honda",

            model : "Beat",

            kilometerMasuk : 15250,

            status :

                WorkOrderStatus.DRAFT,

            prioritas :

                WorkOrderPriority.NORMAL,

            admin : "Admin",

            catatan :

                "Service berkala"

        });

    Logger.log(

        JSON.stringify(

            document,

            null,

            2

        )

    );

}

/**
 * ============================================
 * Work Order Jasa Document Test
 * ============================================
 */

function testWorkOrderJasaDocument(){

    const document =

        WorkOrderJasaDocument.create({

            id : "WOJ000001",

            workOrderId : "WO000001",

            urutan : 1,

            jasaId : "JAS000001",

            namaJasa : "Ganti Oli",

            keluhan : "Service berkala",

            diagnosa : "Oli sudah waktunya diganti",

            mekanikId : "MEC000001",

            mekanikNameSnapshot : "Andi",

            qty : 1,

            harga : 85000,

            diskon : 5000,

            

        });

    Logger.log(

        JSON.stringify(

            document,

            null,

            2

        )

    );

}

/**
 * ============================================
 * Work Order Part Document Test
 * ============================================
 */

function testWorkOrderPartDocument(){

    const document =

        WorkOrderPartDocument.create({

            id : "WOP000001",

            workOrderJasaId : "WOJ000001",

            barangId : "BRG000001",

            kodeBarang : "OLI001",

            namaBarangSnapshot : "Castrol Power1",

            qty : 2,

            harga : 85000,

            diskon : 5000

        });

    Logger.log(

        JSON.stringify(

            document,

            null,

            2

        )

    );

}

function testCreateWorkOrderService(){

    Logger.log(

        JSON.stringify(

            WorkOrderDocument.create({

                id : "WO-TEST-001",

                jenisTransaksi :

                    WorkOrderType.SERVICE,

                customerId : "CUS000001",

                customerName : "Test Customer",

                vehicleId : "VEH000001",

                noPolisi : "B1234XYZ",

                merkSnapshot : "Honda",

                model : "Beat",

                kilometerMasuk : 15000,

                prioritas :

                    WorkOrderPriority.NORMAL,

                admin : "Admin",

                catatan : "Test Service"

            }),

            null,

            2

        )

    );

}

function testCreateWorkOrderPartOnly(){

    Logger.log(

        JSON.stringify(

            WorkOrderDocument.create({

                id : "WO-TEST-002",

                jenisTransaksi :

                    WorkOrderType.PART_ONLY,

                customerId : "",

                customerName : "",

                vehicleId : "",

                noPolisi : "",

                merkSnapshot : "",

                model : "",

                kilometerMasuk : 0,

                prioritas :

                    WorkOrderPriority.NORMAL,

                admin : "Admin",

                catatan : "Pembelian spare part"

            }),

            null,

            2

        )

    );

}