/**
 * Mencari barang berdasarkan barcode
 */
function findProductByBarcode(barcode) {

  const sheet = getSheet(CONFIG.SHEET.BARANG);

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return null;

  const data = sheet.getRange(2,1,lastRow-1,19).getValues();

  for(let i=0;i<data.length;i++){

    if(String(data[i][1]) === String(barcode)){ // kolom B

      return {

        id:data[i][0],
        barcode:data[i][1],
        kode:data[i][2],
        nama:data[i][3],
        kategori:data[i][5],
        merk:data[i][7],
        harga:data[i][12],
        stok:data[i][13]

      };

    }

  }

  return null;

}