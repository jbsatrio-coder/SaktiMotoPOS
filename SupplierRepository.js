/**
 * ============================================
 * Supplier Repository
 * Phase 2
 * ============================================
 */

const SupplierRepository = {

    sheet(){

        return getSheet_(
            CONFIG.SHEET.SUPPLIER
        );

    },

    /**
 * Ambil semua supplier
 */
findAll(){

    const sh = this.sheet();

    const lastRow = sh.getLastRow();

    if(lastRow < 2){

        return [];

    }

    return sh

        .getRange(

            2,

            1,

            lastRow - 1,

            10

        )

        .getValues();

},

/**
 * Cari nomor baris berdasarkan ID Supplier
 *
 * Return:
 * 0   = tidak ditemukan
 * >=2 = nomor baris di sheet
 */
findRowById(supplierId){

    const sh = this.sheet();

    const lastRow = sh.getLastRow();

    if(lastRow < 2){

        return 0;

    }

    const idList = sh
        .getRange(
            2,
            1,
            lastRow - 1,
            1
        )
        .getValues();

    for(let i = 0; i < idList.length; i++){

        if(

            String(idList[i][0]).trim() ===

            String(supplierId).trim()

        ){

            return i + 2;

        }

    }

    return 0;

},

/**
 * Pastikan Supplier ada.
 * Return nomor baris.
 */
requireRow(supplierId){

    const row =

        this.findRowById(
            supplierId
        );

    if(row === 0){

        throw new Error(

            "Supplier tidak ditemukan : " +

            supplierId

        );

    }

    return row;

},

/**
 * Cek apakah Supplier ada
 */
exists(supplierId){

    return this.findRowById(

        supplierId

    ) > 0;

},

/**
 * Ambil Supplier berdasarkan ID
 */
findById(supplierId){

    const row =

        this.requireRow(
            supplierId
        );

    const values =

        this.sheet()

            .getRange(
                row,
                1,
                1,
                10
            )

            .getValues()[0];

    return {

    id : String(values[0]),

    nama : String(values[1]),

    noHP : String(values[2]),

    alamat : String(values[3]),

    sales : String(values[4]),

    noHPSales : String(values[5]),

    status : String(values[6]),

    catatan : String(values[7]),

    createdAt : values[8],

    updatedAt : values[9]

};

},

    /**
 * Simpan Supplier
 */
save(supplierDocument) {

    const supplier =
        supplierDocument.supplier;

    const sh = this.sheet();

    sh.appendRow([

        supplier.id,

        supplier.nama,

        supplier.noHP,

        supplier.alamat,

        supplier.sales,

        supplier.noHPSales,

        supplier.status,

        supplier.catatan,

        supplier.createdAt,

        supplier.updatedAt

    ]);

    return {

        success : true,

        supplierId : supplier.id

    };

},

/**
 * Update Supplier
 */
update(supplierDocument){

    const supplier =
        supplierDocument.supplier;

    const row =
        this.requireRow(
            supplier.id
        );

    const sh =
        this.sheet();

    sh.getRange(
        row,
        1,
        1,
        10
    ).setValues([[
        supplier.id,
        supplier.nama,
        supplier.noHP,
        supplier.alamat,
        supplier.sales,
        supplier.noHPSales,
        supplier.status,
        supplier.catatan,
        supplier.createdAt,
        new Date()
    ]]);

    return {

        success : true,

        supplierId :
            supplier.id

    };

},

};


function testSupplierSheet(){

    Logger.log(

        SupplierRepository
            .sheet()
            .getName()

    );

    

}

function testSaveSupplier(){

    const supplierDocument =
        SupplierDocument.create({

            id : "SUP000009",

            nama : "PT Federal Oil",

            noHP : "08123456789",

            alamat : "Jakarta",

            sales : "Andi",

            noHPSales : "0812222222",

            status :
                SupplierStatus.AKTIF,

            catatan :
                "Supplier test"

        });

    const result =
        SupplierRepository.save(
            supplierDocument
        );

    Logger.log(result);

}

function testFindAllSupplier(){

    const sh = SupplierRepository.sheet();

    Logger.log("Last Row : " + sh.getLastRow());

    Logger.log("Last Column : " + sh.getLastColumn());

}

function testFindSupplierRow(){

    const row =
        SupplierRepository.findRowById(

            "SUP000009"

        );

    Logger.log(row);

}

function testRequireSupplierRow(){

    const row =

        SupplierRepository.requireRow(

            "SUP000009"

        );

    Logger.log(row);

}

function testSupplierExists(){

    Logger.log(

        SupplierRepository.exists(

            "SUP000009"

        )

    );

    Logger.log(

        SupplierRepository.exists(

            "SUP999999"

        )

    );

}

function testFindSupplierById(){

    const supplier =

        SupplierRepository.findById(

            "SUP000009"

        );

    Logger.log(

        JSON.stringify(

            supplier,

            null,

            2

        )

    );

}

function testUpdateSupplier(){

    const supplierDocument =
        SupplierDocument.create({

            id : "SUP000010",

            nama : "PT Federal Oil Updated",

            noHP : "081999999999",

            alamat : "Jakarta Selatan",

            sales : "Bambang",

            noHPSales : "082222222222",

            status :
                SupplierStatus.AKTIF,

            catatan :
                "Updated"

        });

    const result =

        SupplierRepository.update(
            supplierDocument
        );

    Logger.log(result);

}

