function auditBarangKategoriTest(){

    const sheet =
        getSheet_(CONFIG.SHEET.BARANG);

    const lastRow =
        sheet.getLastRow();

    if(lastRow < 2){
        Logger.log("Tidak ada data barang.");
        return;
    }

    const data =
        sheet.getRange(
            2,
            1,
            lastRow - 1,
            COL_BARANG.TOTAL
        ).getValues();

    Logger.log("================================");
    Logger.log("===== BARANG KATEGORI TEST =====");
    Logger.log("================================");

    data.forEach(function(row, index){

        const kategori =
            String(
                row[COL_BARANG.KATEGORI] || ""
            ).trim();

        if(kategori !== "TEST"){
            return;
        }

        Logger.log(
            "ROW " +
            (index + 2) +
            " | ID: " +
            row[COL_BARANG.ID] +
            " | Nama: " +
            row[COL_BARANG.NAMA] +
            " | Status: " +
            row[COL_BARANG.STATUS]
        );

    });

    Logger.log("================================");

}
