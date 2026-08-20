function testJasaServiceCreate(){

    const result =
        JasaService.create({

            nama:
                "Test Jasa Service",

         
            harga:
                55000,

            komisi:
                12000,

            estimasi:
                "60 menit",

            status:
                "AKTIF"

        });


    Logger.log(
        "===== JASA SERVICE CREATE ====="
    );


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testJasaServiceCreateClean() {

  const result =
    JasaService.create({

      nama:
        "TEST JASA CLEAN",

   
      harga:
        100000,

      komisi:
        0,

      estimasi:
        "30 menit",

      status:
        "AKTIF",

      modeKomisi:
        "MEKANIK",

      catatan:
        "TEST - boleh dihapus"

    });


  Logger.log(
    "===== JASA SERVICE CREATE CLEAN ====="
  );

  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}