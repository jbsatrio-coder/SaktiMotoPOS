/**
 * ============================================
 * Supplier Validator
 * Phase 2
 * ============================================
 */

const SupplierValidator = {

   validateCreate(document){

    this.validateId(document);

    this.validateNama(document);

    this.validateStatus(document);

    this.validateDuplicate(document);

},

    /**
     * Validasi ID Supplier
     */
    validateId(document){

        const supplier = document.supplier;

        if(!supplier.id){

            throw new Error(
                "ID Supplier wajib diisi."
            );

        }

    },

    /**
 * Validasi Nama Supplier
 */
validateNama(document){

    const supplier = document.supplier;

    if(

        !String(

            supplier.nama || ""

        ).trim()

    ){

        throw new Error(

            "Nama Supplier wajib diisi."

        );

    }

},

/**
 * Validasi Status Supplier
 */
validateStatus(document){

    const supplier = document.supplier;

    if(

        supplier.status !== SupplierStatus.AKTIF &&

        supplier.status !== SupplierStatus.NONAKTIF

    ){

        throw new Error(

            "Status Supplier tidak valid."

        );

    }

},

/**
 * Validasi Supplier Duplikat
 */
validateDuplicate(document){

    const supplier = document.supplier;

    if(

        SupplierRepository.exists(

            supplier.id

        )

    ){

        throw new Error(

            "Supplier sudah terdaftar : " +

            supplier.id

        );

    }

},

/**
 * Validasi Update Supplier
 */
validateUpdate(document){

    this.validateId(document);

    this.validateNama(document);

    this.validateStatus(document);

},

};

function testValidateSupplierId(){

    const document = {

        supplier : {

            id : "",

            nama : "PT Test"

        }

    };

    SupplierValidator.validateId(
        document
    );

}

function testValidateSupplierIdOK(){

    const document = {

        supplier : {

            id : "SUP000010",

            nama : "PT Test"

        }

    };

    SupplierValidator.validateId(
        document
    );

    Logger.log("OK");

}

function testValidateNamaFail(){

    const document = {

        supplier : {

            id : "SUP000010",

            nama : "   "

        }

    };

    SupplierValidator.validateNama(
        document
    );

}

function testValidateNamaOK(){

    const document = {

        supplier : {

            id : "SUP000010",

            nama : "Federal Oil"

        }

    };

    SupplierValidator.validateNama(
        document
    );

    Logger.log("OK");

}

function testValidateStatus(){

    const document = {

        supplier : {

            status : "TEST"

        }

    };

    SupplierValidator.validateStatus(
        document
    );

}  

    

function testValidateStatusFail(){

    const document = {

        supplier : {

            status : "TEST"

        }

    };

    SupplierValidator.validateStatus(
        document
    );

}

function testValidateStatusOK(){

    const document = {

        supplier : {

            status :

                SupplierStatus.AKTIF

        }

    };

    SupplierValidator.validateStatus(
        document
    );

    Logger.log("OK");
    

}

function testValidateDuplicateFail(){

    const document = {

        supplier : {

            id : "SUP000009",

            nama : "PT Federal Oil",

            status : SupplierStatus.AKTIF

        }

    };

    SupplierValidator.validateDuplicate(
        document
    );

}

function testValidateDuplicateOK(){

    const document = {

        supplier : {

            id : "SUP999999",

            nama : "Supplier Baru",

            status : SupplierStatus.AKTIF

        }

    };

    SupplierValidator.validateDuplicate(
        document
    );

    Logger.log("OK");

}