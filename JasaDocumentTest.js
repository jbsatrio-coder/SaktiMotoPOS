function testJasaDocument(){

    const document =
        JasaDocument.create({

            id:
                "JAS999999",

            nama:
                "Test Jasa Service",

            harga:
                50000,

            komisi:
                10000,

            estimasi:
                "60 menit",

            status:
                "aktif "

        });


    Logger.log(
        "===== JASA DOCUMENT ====="
    );


    Logger.log(
        JSON.stringify(
            document,
            null,
            2
        )
    );

}