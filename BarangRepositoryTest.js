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