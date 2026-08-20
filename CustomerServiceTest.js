/**
 * ============================================
 * Customer Service Test
 * ============================================
 */

function testCreateCustomer(){

    const result =

        CustomerService.createCustomer({

            nama : "TEST CUSTOMER",

            noHP : "080000000001",

            alamat : "TEST ADDRESS",

            tanggalLahir : "",

            jenisKelamin :
                CustomerGender.PRIA,

            status :
                CustomerStatus.AKTIF,

            catatan :
                "Test CustomerService"

        });

    Logger.log(result);

}


function testUpdateCustomer(){

    const data =
        CustomerRepository.findAll();

    if(data.length === 0){

        throw new Error(
            "Tidak ada customer untuk test update."
        );

    }

    const customerId =
        data[data.length - 1][
            COL_PELANGGAN.ID
        ];

    const result =

        CustomerService.updateCustomer({

            id :
                customerId,

            nama :
                "TEST CUSTOMER UPDATED",

            noHP :
                "080000000001",

            alamat :
                "TEST ADDRESS UPDATED",

            tanggalLahir : "",

            jenisKelamin :
                CustomerGender.PRIA,

            status :
                CustomerStatus.AKTIF,

            catatan :
                "Test Update CustomerService"

        });

    Logger.log(result);

}
