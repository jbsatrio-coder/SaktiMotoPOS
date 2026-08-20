function testJasaValidator(){

    const document =
        JasaDocument.create({

            id:
                "JAS999999",

            nama:
                "Test Jasa Validator",


            harga:
                50000,

            komisi:
                10000,

            estimasi:
                "60 menit",

            status:
                "aktif "

        });


    const result =
        JasaValidator.validateCreate(
            document
        );


    Logger.log(
        "===== JASA VALIDATOR ====="
    );


    Logger.log(
        "VALIDASI : " +
        result
    );


    Logger.log(
        JSON.stringify(
            document,
            null,
            2
        )
    );

}