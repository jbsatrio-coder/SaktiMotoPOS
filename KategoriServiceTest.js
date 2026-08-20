function testKategoriServiceGetAll(){

    const result =
        KategoriService.getAll();

    Logger.log(
        "===== KATEGORI SERVICE GET ALL ====="
    );

    Logger.log(
        "Jumlah : " +
        result.length
    );

    result.forEach(function(kategori){

        Logger.log(
            kategori.id +
            " | " +
            kategori.nama
        );

    });

}

function testGetDaftarKategori(){

    const result =
        getDaftarKategori();

    Logger.log(
        "===== KATEGORI FORM ====="
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}