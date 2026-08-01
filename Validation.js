/**
 * =====================================================
 * SAKTI MOTO WMS
 * Validation Library
 * =====================================================
 */

/**
 * Validasi Work Order
 */
function validateWorkOrder_(data){

  if (!data.plat || data.plat.trim() === "") {
    throw new Error("Nomor Polisi belum diisi.");
  }

  if (!data.idPelanggan) {
    throw new Error("Pelanggan belum dipilih.");
  }

  if (!data.idKendaraan) {
    throw new Error("Kendaraan belum dipilih.");
  }

  if (!data.km || isNaN(data.km)) {
    throw new Error("Kilometer harus diisi dengan angka.");
  }

  if (!data.idMekanik) {
    throw new Error("Mekanik belum dipilih.");
  }

  return true;

}