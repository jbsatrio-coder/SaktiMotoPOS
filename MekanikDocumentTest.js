function testCreateMekanikDocument(){

    Logger.log(

        JSON.stringify(

            MekanikDocument.create({

                id : "MEC000001",

                nama : "Andi",

                noHp : "08123456789",

                jabatan : "Senior Mekanik",

                gajiPokok : 4500000,

                tipeKomisi : "PERSEN",

                persentase : 10

            }),

            null,

            2

        )

    );

}