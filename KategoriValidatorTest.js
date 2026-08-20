function testKategoriValidator(){

    const document =
        KategoriDocument.create({

            id : "KAT000001",

            nama : "Kelistrikan"

        });

    const valid =
        KategoriValidator.validateCreate(
            document
        );

    Logger.log(
        "VALIDASI : " + valid
    );

    Logger.log(
        JSON.stringify(
            document,
            null,
            2
        )
    );

}
