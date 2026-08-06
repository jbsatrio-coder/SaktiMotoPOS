/**
 * ============================================
 * Supplier Service
 * Phase 2
 * ============================================
 */

const SupplierService = {

    /**
     * Membuat Supplier Baru
     */
    createSupplier(payload){

    const supplierDocument =
        SupplierDocument.create({

            ...payload,

            id :
                RunningNumberService.generate(
                    DocumentType.SUPPLIER
                )

        });

    SupplierValidator.validateCreate(
        supplierDocument
    );

    return SupplierRepository.save(
        supplierDocument
    );

},

    /**
 * Update Supplier
 */
updateSupplier(payload){

    const supplierDocument =

        SupplierDocument.create(
            payload
        );

    SupplierValidator.validateUpdate(
        supplierDocument
    );

    return SupplierRepository.update(
        supplierDocument
    );

},

};

function testCreateSupplier(){

    const result =

        SupplierService.createSupplier({

    nama : "Castrol Indonesia",

    noHP : "081111111111",

    alamat : "Jakarta",

    sales : "Bambang",

    noHPSales : "082222222222",

    status : SupplierStatus.AKTIF,

    catatan : "Supplier baru"

});

    Logger.log(result);

}

function testUpdateSupplierService(){

    const result =

        SupplierService.updateSupplier({

            id : "SUP000010",

            nama : "PT Federal Oil Update Service",

            noHP : "081111111111",

            alamat : "Jakarta Selatan",

            sales : "Andi",

            noHPSales : "082222222222",

            status :

                SupplierStatus.AKTIF,

            catatan :

                "Updated by Service"

        });

    Logger.log(result);

}