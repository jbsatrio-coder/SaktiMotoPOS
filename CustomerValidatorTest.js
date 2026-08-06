/**
 * ============================================
 * Customer Validator Test
 * ============================================
 */

function testCustomerValidateIdOK(){

    const document =

        CustomerDocument.create({

            id : "CUS000001",

            nama : "Test"

        });

    CustomerValidator.validateId(
        document
    );

    Logger.log("OK");

}

function testCustomerValidateIdFail(){

    const document =

        CustomerDocument.create({

            id : "",

            nama : "Test"

        });

    CustomerValidator.validateId(
        document
    );

}

function testCustomerValidateNamaOK(){

    const document =

        CustomerDocument.create({

            id : "CUS000001",

            nama : "Satrio Nugroho"

        });

    CustomerValidator.validateNama(
        document
    );

    Logger.log("OK");

}

function testCustomerValidateNamaFail(){

    const document =

        CustomerDocument.create({

            id : "CUS000001",

            nama : "   "

        });

    CustomerValidator.validateNama(
        document
    );

}

function testCustomerValidateStatusOK(){

    const document =

        CustomerDocument.create({

            id : "CUS000001",

            nama : "Test",

            status :

                CustomerStatus.AKTIF

        });

    CustomerValidator.validateStatus(
        document
    );

    Logger.log("OK");

}

function testCustomerValidateStatusFail(){

    const document =

        CustomerDocument.create({

            id : "CUS000001",

            nama : "Test",

            status : "TEST"

        });

    CustomerValidator.validateStatus(
        document
    );

}

function testCustomerValidateGenderOK(){

    const document =

        CustomerDocument.create({

            id : "CUS000001",

            nama : "Test",

            jenisKelamin :

                CustomerGender.PRIA

        });

    CustomerValidator.validateGender(
        document
    );

    Logger.log("OK");

}

function testCustomerValidateGenderFail(){

    const document =

        CustomerDocument.create({

            id : "CUS000001",

            nama : "Test",

            jenisKelamin : "ABC"

        });

    CustomerValidator.validateGender(
        document
    );

}

function testCustomerValidateDuplicateOK(){

    const document =

        CustomerDocument.create({

            id : "CUS888888",

            nama : "Customer Baru"

        });

    CustomerValidator.validateDuplicate(
        document
    );

    Logger.log("OK");

}

function testCustomerValidateDuplicateFail(){

    const document =

        CustomerDocument.create({

            id : "CUS999999",

            nama : "Duplicate"

        });

    CustomerValidator.validateDuplicate(
        document
    );

}

function testCustomerValidateUpdateOK(){

    const document =

        CustomerDocument.create({

            id : "CUS999999",

            nama : "Update",

            status :
                CustomerStatus.AKTIF,

            jenisKelamin :
                CustomerGender.PRIA

        });

    CustomerValidator.validateUpdate(
        document
    );

    Logger.log("OK");

}

function testCustomerValidateUpdateFail(){

    const document =

        CustomerDocument.create({

            id : "CUS123456",

            nama : "Update",

            status :
                CustomerStatus.AKTIF,

            jenisKelamin :
                CustomerGender.PRIA

        });

    CustomerValidator.validateUpdate(
        document
    );

}

function testCustomerValidateCreate(){

    const document =

        CustomerDocument.create({

            id : "CUS888888",

            nama : "Create Test",

            status :
                CustomerStatus.AKTIF,

            jenisKelamin :
                CustomerGender.PRIA

        });

    CustomerValidator.validateCreate(
        document
    );

    Logger.log("OK");

}

function testCustomerValidateCreateFail(){

    const document =

        CustomerDocument.create({

            id : "CUS999999",

            nama : "Duplicate",

            status :
                CustomerStatus.AKTIF,

            jenisKelamin :
                CustomerGender.PRIA

        });

    CustomerValidator.validateCreate(
        document
    );

}