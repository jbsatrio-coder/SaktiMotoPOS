function testFindByIdBarang(){

    Logger.log(

        BarangRepository.findById(
            "BRG000001"
        )

    );

}

function testFindRowByIdBarang(){

    Logger.log(

        BarangRepository.findRowById(
            "BRG000001"
        )

    );

}

function testFindByIdBarangExisting(){

    Logger.log(

        BarangRepository.findById(
            "BRG000114"
        )

    );

}

function testFindRowByIdBarangExisting(){

    Logger.log(

        BarangRepository.findRowById(
            "BRG000114"
        )

    );

}

function testBarangExists(){

    Logger.log(

        BarangRepository.exists(
            "BRG000001"
        )

    );

}

function testBarangNotFound(){

    Logger.log(

        BarangRepository.findById(
            "BRG999999"
        )

    );

}

function testFindByBarcodeBarang(){

    Logger.log(

        BarangRepository.findByBarcode(
            "100000001"
        )

    );

}

function testSearchBarang(){

    Logger.log(

        BarangRepository.search(
            "kampas rem"
        )

    );

}

function testGetByKodeBarang(){

    const result =
        BarangRepository.getByKode(
            "BRG000160"
        );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testSaveBarangRepository(){

    const document = {

        barang : {

            id :
                "BRGTEST999",

            barcode :
                "199999999",

            kataKunci :
                "test repository barang",

            namaPendek :
                "Test Repository",

            nama :
                "Barang Test Repository",

            kategori :
                "TEST",

            subkategori :
                "TEST",

            merk :
                "TEST",

            kendaraan :
                "MATIC",

            satuan :
                "PCS",

            hargaModal :
                10000,

            margin :
                0.25,

            hargaJual :
                13500,

            stok :
                5,

            minStok :
                2,

            rak :
                "TEST",

            supplier :
                "SUP000001",

            status :
                "AKTIF",

            catatan :
                "Test save repository",

            createdAt :
                new Date(),

            updatedAt :
                "",

            createdBy :
                "TEST",

            updatedBy :
                ""

        }

    };


    const result =
        BarangRepository.save(
            document
        );


    Logger.log(

        JSON.stringify(
            result,
            null,
            2
        )

    );

}