/**
 * ======================================================
 * DASHBOARD WORK ORDER
 * ======================================================
 */

/**
 * Membuka Dashboard WO
 */



/**
 * Mengambil seluruh Work Order
 */
function getAllWorkOrder() {

  const shWO = getSheet_(CONFIG.SHEET.WORK_ORDER);
  const shCust = getSheet_(CONFIG.SHEET.MASTER_PELANGGAN);

  if (shWO.getLastRow() < 2) return [];

  const wo = shWO.getDataRange().getDisplayValues();
  const cust = shCust.getDataRange().getDisplayValues();

  // Index pelanggan -> No HP
  const hpMap = {};

  for (let i = 1; i < cust.length; i++) {

    hpMap[cust[i][COL_PELANGGAN.ID]] =
      cust[i][COL_PELANGGAN.NOHP];

  }

  return wo.slice(1).map(row => ({

    noWO: row[COL_WO.NOWO],

    tanggal: row[COL_WO.TANGGAL],

    jam: row[COL_WO.JAM],

    status: row[COL_WO.STATUS],

    prioritas: row[COL_WO.PRIORITAS],

    approval: row[COL_WO.APPROVAL],

    idPelanggan: row[COL_WO.IDPELANGGAN],

    nama: row[COL_WO.NAMAPELANGGAN],

    hp: hpMap[row[COL_WO.IDPELANGGAN]] || "",

    idKendaraan: row[COL_WO.IDKENDARAAN],

    plat: row[COL_WO.PLAT],

    merk: row[COL_WO.MERK],

    model: row[COL_WO.MODEL],

    km: row[COL_WO.KM],

    keluhan: row[COL_WO.KELUHAN],

    diagnosa: row[COL_WO.DIAGNOSA],

    estimasi: row[COL_WO.ESTIMASI],

    estimasiSelesai: row[COL_WO.ESTIMASISELESAI],

    mekanik: row[COL_WO.MEKANIK],

    admin: row[COL_WO.ADMIN],

    catatan: row[COL_WO.CATATAN]

  }));

}

/**
 * Mengambil 1 Work Order
 */
function getWorkOrder(noWO){

  const sh = getSheet_(CONFIG.SHEET.WORK_ORDER);

  if(sh.getLastRow()<2) return null;

  const data = sh.getDataRange().getDisplayValues();

  for(let i=1;i<data.length;i++){

    if(data[i][0]==noWO){

      return {

        noWO:data[i][0],
        tanggal:data[i][1],
        jam:data[i][2],
        status:data[i][3],
        prioritas:data[i][4],
        approval:data[i][5],

        idPelanggan:data[i][6],
        nama:data[i][7],

        idKendaraan:data[i][8],
        plat:data[i][9],

        merk:data[i][10],
        model:data[i][11],

        km:data[i][12],

        keluhan:data[i][13],

        diagnosa:data[i][14],

        estimasi:data[i][15],

        estimasiSelesai:data[i][16],

        mekanik:data[i][17],

        admin:data[i][18],

        catatan:data[i][19]

      };

    }

  }

  return null;

}