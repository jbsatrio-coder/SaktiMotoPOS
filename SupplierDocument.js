/**
 * ============================================
 * Supplier Document
 * Phase 2
 * ============================================
 */

const SupplierDocument = {

    create(payload){

        const now = new Date();

        return {

            supplier : {

                id :

                    payload.id,

                nama :

                    payload.nama,

                noHP :

                    payload.noHP,

                alamat :

                    payload.alamat,

                sales :

                    payload.sales,

                noHPSales :

                    payload.noHPSales,

                status :

                    payload.status ||

                    SupplierStatus.AKTIF,

                catatan :

                    payload.catatan || "",

                createdAt :

                    now,

                updatedAt :

                    ""

            }

        };

    }

};

function testCreateSupplierDocument(){

    const supplier =

        SupplierDocument.create({

            id : "SUP000008",

            nama : "PT Astra",

            noHP : "08123456789",

            alamat : "Jakarta",

            sales : "Budi",

            noHPSales : "0812222222",

            status :

                SupplierStatus.AKTIF,

            catatan : "Supplier oli"

        });

    Logger.log(

        JSON.stringify(

            supplier,

            null,

            2

        )

    );

}