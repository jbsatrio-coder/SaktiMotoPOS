function testVehicleValidateIdOK(){

    VehicleValidator.validateId(
        "VEH000001"
    );

    Logger.log("OK");

}

function testVehicleValidateIdFail(){

    try{

        VehicleValidator.validateId("");

    }catch(err){

        Logger.log(err.message);

    }

}

function testVehicleValidateCustomerOK(){

    VehicleValidator.validateCustomerId(
        "CUS999999"
    );

    Logger.log("OK");

}

function testVehicleValidateCustomerFail(){

    try{

        VehicleValidator.validateCustomerId(
            "CUS000000"
        );

    }catch(err){

        Logger.log(err.message);

    }

}

function testVehicleValidateIdentityOK(){

    VehicleValidator.validateIdentity({

        noPolisi : "B1234XYZ",

        noMesin : ""

    });

    Logger.log("OK");

}

function testVehicleValidateIdentityFail(){

    try{

        VehicleValidator.validateIdentity({

            noPolisi : "",

            noMesin : ""

        });

    }catch(err){

        Logger.log(err.message);

    }

}

function testVehicleValidateStatusOK(){

    VehicleValidator.validateStatus(

        VehicleStatus.AKTIF

    );

    Logger.log("OK");

}

function testVehicleValidateStatusFail(){

    try{

        VehicleValidator.validateStatus(

            "RUSAK"

        );

    }catch(err){

        Logger.log(err.message);

    }

}