function testJasaSheet(){

    Logger.log(
        JasaRepository.sheet().getName()
    );

}

function testJasaFindAll(){

    Logger.log(
        JasaRepository.findAll()
    );

}

function testJasaFindById(){

    Logger.log(

        JasaRepository.findById(

            "JAS000001"

        )

    );

}

function testJasaExists(){

    Logger.log(

        JasaRepository.exists(

            "JAS000001"

        )

    );

}