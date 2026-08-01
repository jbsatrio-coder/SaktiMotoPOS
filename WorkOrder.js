/**
 * ==================================================
 * SAKTI MOTO WMS
 * WORK ORDER MODULE
 * ==================================================
 */

/**
 * Membuka Form Work Order
 */
function showFormWorkOrder() {

  const template = HtmlService
    .createTemplateFromFile("FormWorkOrder");

  const html = template
    .evaluate()
    .setWidth(700)
    .setHeight(760);

  SpreadsheetApp
    .getUi()
    .showModalDialog(
      html,
      "Work Order Baru"
    );

}

/**
 * Mengambil daftar keluhan
 */
function getMasterKeluhan_() {

  const sh = getSheet_(SHEET.MASTER_KELUHAN);

  if (sh.getLastRow() < 2) return [];

  return sh
    .getRange(
      2,
      1,
      sh.getLastRow() - 1,
      3
    )
    .getDisplayValues();

}


/**
 * Mengambil daftar mekanik aktif
 */
function getMasterMekanik() {
  const sh = getSheet_(SHEET.MASTER_MEKANIK);

  if (sh.getLastRow() < 2) return [];

  const data = sh
    .getRange(2, 1, sh.getLastRow() - 1, 9)
    .getDisplayValues();

  return data.filter(row => row[0] !== "");

}

function testGetMasterMekanik() {

  const data = getMasterMekanik_();

  Logger.log(data);

  SpreadsheetApp.getUi().alert(JSON.stringify(data));

}

/**
 * Cari kendaraan berdasarkan nomor polisi
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

    const plat = String(row[3])   // Kolom D = Plat Nomor
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

function saveWorkOrder(data){

  const sh = getSheet_(CONFIG.SHEET.WORK_ORDER);

  const noWO = generateRunningNumber_("WO");

  const sekarang = new Date();

  sh.appendRow([

    noWO,                              // A No WO
    sekarang,                          // B Tanggal
    Utilities.formatDate(
      sekarang,
      Session.getScriptTimeZone(),
      "HH:mm:ss"
    ),                                 // C Jam

    STATUS_WO.MENUNGGU,                // D Status
    data.prioritas,                    // E Prioritas
    APPROVAL.BELUM,                    // F Approval

    data.idPelanggan,                  // G ID Pelanggan
    data.namaPelanggan,                // H Nama Pelanggan

    data.idKendaraan,                  // I ID Kendaraan
    data.plat,                         // J Plat

    data.merk,                         // K Merk
    data.model,                        // L Model

    data.km,                           // M KM
    data.keluhan,                      // N Keluhan

    "",                                // O Diagnosa
    "",                                // P Estimasi
    "",                                // Q Estimasi Selesai

    data.idMekanik,                    // R Mekanik

    Session.getActiveUser().getEmail(),// S Admin

    data.catatan,                      // T Catatan

    sekarang,                          // U Created At
    sekarang                           // V Updated At

  ]);

  return noWO;

}

/**
 * ======================================================
 * SIMPAN WORK ORDER
 * ======================================================
 */
function saveWorkOrder(data) {

  const sh = getSheet_(CONFIG.SHEET.WORK_ORDER);

  const noWO = generateRunningNumber_("WO");

  const now = new Date();

  sh.appendRow([

    noWO,                  // A NoWO
    now,                   // B Tanggal
    Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm:ss"), // C Jam

    data.idPelanggan,       // D
    data.idKendaraan,       // E
    data.plat,              // F
    data.km,                // G
    data.keluhan,           // H
    data.catatan,           // I
    data.idMekanik,         // J
    data.prioritas,         // K

    STATUS_WO.MENUNGGU,     // L Status

    Session.getActiveUser().getEmail(), // M
    now                    // N

  ]);

  return noWO;

}

/**
 * =====================================================
 * SIMPAN WORK ORDER
 * =====================================================
 */
function saveWorkOrder(data) {

  validateWorkOrder_(data);

  const sh = getSheet_(CONFIG.SHEET.WORK_ORDER);

  const now = new Date();

  const noWO = generateRunningNumber_("WO");

  sh.appendRow([

    noWO,                                   // A NoWO

    formatDate_(now),                       // B TanggalMasuk

    formatTime_(now),                       // C JamMasuk

    STATUS_WO.MENUNGGU,                     // D Status

    data.prioritas,                         // E Prioritas

    APPROVAL.BELUM,                         // F Approval

    data.idPelanggan,                       // G

    data.namaPelanggan,                     // H

    data.idKendaraan,                       // I

    data.plat,                              // J

    data.merk,                              // K

    data.model,                             // L

    data.km,                                // M

    data.keluhan,                           // N

    "",                                     // O Diagnosa

    0,                                      // P Estimasi Biaya

    "",                                     // Q Estimasi Selesai

    data.idMekanik,                         // R Mekanik

    Session.getActiveUser().getEmail(),     // S Admin

    data.catatan,                           // T Catatan

    now,                                    // U CreatedAt

    now                                     // V UpdatedAt

  ]);

  return noWO;

}

function showDetailWO(noWO){

  const template =
    HtmlService.createTemplateFromFile("DetailWO");

  template.noWO = noWO;

  const html =
    template
      .evaluate()
      .setWidth(800)
      .setHeight(700);

  SpreadsheetApp
    .getUi()
    .showModalDialog(
      html,
      "Detail Work Order"
    );

}

/**
 * Update Detail Work Order
 */
function updateWorkOrder(data){

  const sh = getSheet_(CONFIG.SHEET.WORK_ORDER);

  const values = sh.getDataRange().getValues();

  for(let i = 1; i < values.length; i++){

    if(values[i][0] == data.noWO){

      // Kolom D = Status
      sh.getRange(i + 1, 4).setValue(data.status);

      // Kolom O = Diagnosa
      sh.getRange(i + 1, 15).setValue(data.diagnosa);

      // Kolom R = Mekanik
      sh.getRange(i + 1, 18).setValue(data.idMekanik);

      // Kolom V = UpdatedAt
      sh.getRange(i + 1, 22).setValue(new Date());

      return "OK";

    }

  }

  throw new Error("Work Order tidak ditemukan.");

}