/**
 * =====================================================
 * SAKTI MOTO WMS
 * MASTER KENDARAAN
 * =====================================================
 */

/**
 * Cari kendaraan berdasarkan plat nomor
 */
function findKendaraanByPlat(platNomor) {

  const sh = getSheet_(SHEET.MASTER_KENDARAAN);

  if (sh.getLastRow() < 2) return null;

  const data = sh.getDataRange().getDisplayValues();

  const keyword = String(platNomor)
    .replace(/\s+/g, "")
    .toUpperCase();

  for (let i = 1; i < data.length; i++) {

    const row = data[i];

    const plat = String(row[3])
      .replace(/\s+/g, "")
      .toUpperCase();

    if (plat === keyword) {

      return {
        idKendaraan : row[0],
        idPelanggan : row[1],
        nama        : row[2],
        plat        : row[3],
        merk        : row[4],
        model       : row[5],
        tahun       : row[6],
        warna       : row[7],
        kilometer   : row[10]
      };

    }

  }

  return null;

}

/**
 * Smart Search Kendaraan
 */
function searchKendaraan(keyword) {

  const sh = getSheet_(SHEET.MASTER_KENDARAAN);

  if (sh.getLastRow() < 2) return [];

  const data = sh.getDataRange().getDisplayValues();

  keyword = String(keyword)
    .trim()
    .toUpperCase();

  const hasil = [];

  for (let i = 1; i < data.length; i++) {

    const row = data[i];

    const nama = String(row[2]).toUpperCase();
    const plat = String(row[3]).toUpperCase();

    if (
      nama.includes(keyword) ||
      plat.includes(keyword)
    ) {

      hasil.push({

        idKendaraan: row[0],
        idPelanggan: row[1],
        nama: row[2],
        plat: row[3],
        merk: row[4],
        model: row[5],
        kilometer: row[10]

      });

    }

  }

  return hasil;

}