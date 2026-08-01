/**
 * =====================================
 * MODEL
 * =====================================
 */


function mapWorkOrder(row){

  return Object.freeze({

    noWO : row[COL_WO.NOWO],

    tanggal : row[COL_WO.TANGGAL],

    jam : row[COL_WO.JAM],

    status : row[COL_WO.STATUS],

    prioritas : row[COL_WO.PRIORITAS],

    approval : row[COL_WO.APPROVAL],

    idPelanggan : row[COL_WO.IDPELANGGAN],

    nama : row[COL_WO.NAMAPELANGGAN],

    idKendaraan : row[COL_WO.IDKENDARAAN],

    plat : row[COL_WO.PLAT],

    merk : row[COL_WO.MERK],

    model : row[COL_WO.MODEL],

    km : row[COL_WO.KM],

    keluhan : row[COL_WO.KELUHAN],

    diagnosa : row[COL_WO.DIAGNOSA],

    estimasi : row[COL_WO.ESTIMASI],

    estimasiSelesai : row[COL_WO.ESTIMASISELESAI],

    mekanik : row[COL_WO.MEKANIK],

    admin : row[COL_WO.ADMIN],

    catatan : row[COL_WO.CATATAN]

  });

}