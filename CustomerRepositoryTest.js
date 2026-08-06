/**
 * ============================================
 * Customer Repository Test
 * Version : 1.0.0
 * Sprint  : 5B.2
 * ============================================
 */

function testCustomerSheet(){

    Logger.log(

        CustomerRepository
            .sheet()
            .getName()

    );

}

function testFindAllCustomer(){

    const customers =

        CustomerRepository.findAll();

    Logger.log(

        "Jumlah Customer : " +

        customers.length

    );

}

function testFindRowCustomer(){

    const row =

        CustomerRepository.findRowById(
            "CUS000001"
        );

    Logger.log(row);

}

function testCustomerExists(){

    Logger.log(

        CustomerRepository.exists(
            "CUS000001"
        )

    );

    Logger.log(

        CustomerRepository.exists(
            "CUS999999"
        )

    );

}

function testFindCustomerById(){

    const customer =

        CustomerRepository.findById(
            "CUS000001"
        );

    Logger.log(

        JSON.stringify(
            customer,
            null,
            2
        )

    );

}

function testListCustomerId(){

    const data = CustomerRepository.findAll();

    data.forEach(r => {

        Logger.log(r[COL_PELANGGAN.ID]);

    });

}

function testSaveCustomer(){

    const customerDocument =

        CustomerDocument.create({

            id : "CUS999999",

            nama : "Test Customer",

            noHP : "08123456789",

            alamat : "Legoso",

            tanggalLahir : "",

            jenisKelamin :
                CustomerGender.PRIA,

            status :
                CustomerStatus.AKTIF,

            catatan :
                "Repository Test"

        });

    const result =

        CustomerRepository.save(
            customerDocument
        );

    Logger.log(result);

}

function testUpdateCustomer(){

    const customerDocument =

        CustomerDocument.create({

            id : "CUS999999",

            nama : "Test Customer Update",

            noHP : "081111111111",

            alamat : "Ciputat",

            tanggalLahir : "",

            jenisKelamin :
                CustomerGender.PRIA,

            status :
                CustomerStatus.AKTIF,

            catatan :
                "Updated"

        });

    const result =

        CustomerRepository.update(
            customerDocument
        );

    Logger.log(result);

}