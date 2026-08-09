function testWorkOrderSheet(){

    Logger.log(

        WorkOrderRepository
            .sheet()
            .getName()

    );

}

function testWorkOrderFindAll(){

    Logger.log(

        WorkOrderRepository
            .findAll()

    );

}

function testFindWorkOrderRow(){

    Logger.log(

        WorkOrderRepository.findRowById(

            "WO2608070001"

        )

    );

}

function testExistsWorkOrder(){

    Logger.log(

        WorkOrderRepository.exists(
            "WO2608070001"
        )

    );

}

function testFindWorkOrderById(){

    Logger.log(

        WorkOrderRepository.findById(
            "WO2608070001"
        )

    );

}

function testSaveWorkOrder(){

    const workOrder =

        WorkOrderDocument.create({

            id : "WO2608070001",

            customerId : "CUS999999",

            customerNameSnapshot : "Satrio Nugroho",

            vehicleId : "VEH2608070003",

            noPolisiSnapshot : "B1234XYZ",

            merkSnapshot : "Honda",

            modelSnapshot : "Beat",

            kilometerMasuk : 15250,

            status : "DRAFT",

            prioritas : "NORMAL",

            admin : "Admin",

            catatan : "Service berkala"

        }).workOrder;

    Logger.log(

        WorkOrderRepository.save(
            workOrder
        )

    );

}

function testFindCustomer(){

    Logger.log(

        CustomerRepository.findById(
            "CUS000001"
        )

    );

}

function testFindAllCustomer(){

    Logger.log(
        CustomerRepository.findAll()
    );

}

function testRepositorySaveWorkOrder() {
 

    Logger.log(

        WorkOrderService.create({

            customerId : "CUS999999",

            vehicleId : "VEH2608070003",

            kilometerMasuk : 15250,

            prioritas : "NORMAL",

            admin : "Admin",

            catatan : "Service berkala"

        })

    );

}

function testFindVehicle(){

    Logger.log(

        VehicleRepository.findById(
            "VEH2608070003"
        )

    );

}

function testCustomerExists(){

    Logger.log(

        CustomerRepository.exists(
            "CUS999999"
        )

    );

}

function testWorkOrderRepositoryFindById(){

    Logger.log(

        WorkOrderRepository.findById(
            "WO2608070001"
        )

    );

}

function testSavePartOnlyWorkOrder(){

    const result =

        WorkOrderRepository.save({

            id : "WO-TEST-PART-001",

            customerId : "",

            customerNameSnapshot : "",

            vehicleId : "",

            noPolisiSnapshot : "",

            merkSnapshot : "",

            modelSnapshot : "",

            kilometerMasuk : 0,

            status : "DRAFT",

            prioritas : "NORMAL",

            estimasiSelesai : "",

            admin : "Admin",

            catatan : "Test Part Only",

            createdAt : new Date(),

            updatedAt : "",

            jenisTransaksi :
                WorkOrderType.PART_ONLY

        });

    Logger.log(result);

}