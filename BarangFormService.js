/**
 * ============================================
 * BARANG FORM SERVICE
 * ============================================
 */

function simpanBarangBaru(payload) {

  const result =
    BarangService.createBarang(
      payload
    );

  return {

    id:
      result.id,

    barcode:
      result.barcode,

    nama:
      result.nama,

    hargaJual:
      result.hargaJual,

    margin:
      result.margin

  };

}