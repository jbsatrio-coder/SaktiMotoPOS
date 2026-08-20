function testCreateKategoriDocument(){

    Logger.log(

        JSON.stringify(

            KategoriDocument.create({

                id : "KAT000001",

                nama : "Kelistrikan"

            }),

            null,

            2

        )

    );

}
