/**
 * ============================================
 * JASA FORM SERVICE
 * ============================================
 */

function simpanJasaBaru(payload) {

  const result =
    JasaService.create(
      payload
    );

  return {

    id:
      result.id,

    nama:
      result.nama,

    harga:
      result.harga,

    komisi:
      result.komisi,

    estimasi:
      result.estimasi,

    status:
      result.status

  };

}