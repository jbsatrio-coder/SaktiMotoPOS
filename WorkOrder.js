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

  return data.filter(function(row){

    return (
      row[COL_MEKANIK.ID] !== "" &&
      String(
        row[COL_MEKANIK.STATUS] || ""
      ).toUpperCase() === "AKTIF"
    );

  });

}

function testGetMasterMekanik() {

  const data = getMasterMekanik_();

  Logger.log(data);

  SpreadsheetApp.getUi().alert(JSON.stringify(data));

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

/**
 * ============================================
 * WEB ENTRY POINT
 * CREATE WORK ORDER
 * ============================================
 */

function createWorkOrder(request){

  const result =
    WorkOrderService.create(
      request
    );


  if(
    result &&
    result.success &&
    result.workOrderId
  ){

    setPendingWorkOrderToast(
      result.workOrderId
    );

  }


  return result;

}

/**
 * ============================================
 * WORK ORDER TOAST
 * ============================================
 */

function setPendingWorkOrderToast(
  workOrderId
){

  if(!workOrderId){

    return false;

  }

  Logger.log(

    "SET PENDING TOAST: " +

    workOrderId
  );

  const props =
    PropertiesService
      .getUserProperties();


  props.setProperty(
    "PENDING_WO_TOAST",
    JSON.stringify({

      workOrderId :
        String(workOrderId),

      readyAt :
        Date.now() + 1500

    })
  );

  Logger.log(

    "PENDING_WO_TOAST SAVED"

  );

  return true;

}


/**
 * Ambil notifikasi WO yang pending
 */

function getPendingWorkOrderToast(){

  const props =
    PropertiesService
      .getUserProperties();


  const raw =
    props.getProperty(
      "PENDING_WO_TOAST"
    );

     Logger.log(

    "GET PENDING TOAST RAW: " +

    raw

  );


  if(!raw){

    Logger.log(

      "GET PENDING TOAST: NULL"

    );

    return null;

  }


  let data;

  try{

    data =
      JSON.parse(raw);

  }catch(e){

     Logger.log(

      "GET PENDING TOAST JSON ERROR: " +

      e.message

    );

    props.deleteProperty(
      "PENDING_WO_TOAST"
    );

    return null;

  }

   Logger.log(

    "GET PENDING TOAST DATA: " +

    JSON.stringify(data)

  );


  /*
   * Beri waktu agar FormWorkOrder
   * benar-benar selesai ditutup.
   */

  if(
    Date.now() <
    Number(data.readyAt || 0)
  ){

     Logger.log(

      "GET PENDING TOAST: BELUM READY"

    );
    return null;

  }


  /*
   * Hapus setelah diambil.
   * Dengan demikian toast tidak
   * muncul berulang-ulang.
   */

  props.deleteProperty(
    "PENDING_WO_TOAST"
  );


   Logger.log(

    "GET PENDING TOAST: RETURN " +

    data.workOrderId

  );
  
  return {

    workOrderId :
      data.workOrderId

  };

}