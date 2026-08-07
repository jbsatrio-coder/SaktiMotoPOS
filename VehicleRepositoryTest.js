function testVehicleSheet(){

    const sheet = VehicleRepository.sheet();

    Logger.log(sheet);

    Logger.log(sheet.getName());

}

/**
 * ============================================
 * Vehicle Repository Test
 * ============================================
 */

function testListAllSheets(){

    const sheets =
        SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheets();

    sheets.forEach(sheet => {

        Logger.log(
            "[" + sheet.getName() + "]"
        );

    });

}

function testVehicleConfig(){

    Logger.log(CONFIG.SHEET.VEHICLE);

}

function testVehicleExists(){

    Logger.log(

        VehicleRepository.exists(
            "VEH2608070003"
        )

    );

}

function testFindAllVehicle(){

    Logger.log(
        VehicleRepository.findAll()
    );

}