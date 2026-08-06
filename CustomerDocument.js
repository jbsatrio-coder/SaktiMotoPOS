/**
 * ============================================
 * Customer Document
 * Version : 1.0.0
 * Sprint  : 5A.6
 * ============================================
 */

const CustomerDocument = {

    create(payload){

        return {

            customer : {

                id : payload.id,

                nama : payload.nama,

                noHP : payload.noHP || "",

                alamat : payload.alamat || "",

                tanggalLahir :

                    payload.tanggalLahir || "",

                jenisKelamin :

                    payload.jenisKelamin ||

                    CustomerGender.PRIA,

                status :

                    payload.status ||

                    CustomerStatus.AKTIF,

                catatan :

                    payload.catatan || "",

                createdAt :

                    payload.createdAt ||

                    new Date(),

                updatedAt :

                    payload.updatedAt || ""

            }

        };

    },

};

function testCustomerDocument(){

    const document =

        CustomerDocument.create({

            id : "CUS000001",

            nama : "Satrio Nugroho",

            noHP : "08123456789",

            alamat : "Legoso",

            jenisKelamin :

                CustomerGender.PRIA

        });

    Logger.log(

        JSON.stringify(

            document,

            null,

            2

        )

    );

}