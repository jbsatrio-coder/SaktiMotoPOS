/**
 * ======================================================
 * DASHBOARD WORK ORDER
 * Version : 2.0.0
 * ======================================================
 */


/**
 * ======================================================
 * MEMBUKA DASHBOARD WORK ORDER
 * ======================================================
 */

function showDashboardWO(){

  const template =
    HtmlService
      .createTemplateFromFile(
        "DashboardWO"
      );

  const html =
    template
      .evaluate()
      .setWidth(1200)
      .setHeight(700);

  SpreadsheetApp
    .getUi()
    .showModalDialog(
      html,
      "Dashboard Work Order"
    );

}


/**
 * ======================================================
 * MENGAMBIL SELURUH WORK ORDER
 *
 * Menggunakan schema baru 17_WorkOrder
 * melalui COL_WORK_ORDER.
 * ======================================================
 */

function getAllWorkOrder(){

  const shWO =
    getSheet_(
      CONFIG.SHEET.WORK_ORDER
    );

  if(!shWO){

    throw new Error(
      "Sheet Work Order tidak ditemukan: " +
      CONFIG.SHEET.WORK_ORDER
    );

  }


  const shCust =
    getSheet_(
      CONFIG.SHEET.PELANGGAN
    );

  if(!shCust){

    throw new Error(
      "Sheet Pelanggan tidak ditemukan: " +
      CONFIG.SHEET.PELANGGAN
    );

  }


  if(
    shWO.getLastRow() < 2
  ){

    return [];

  }


  const wo =
    shWO
      .getDataRange()
      .getDisplayValues();


  const cust =
    shCust
      .getDataRange()
      .getDisplayValues();


  /**
   * ============================================
   * INDEX PELANGGAN → NO HP
   * ============================================
   */

  const hpMap = {};


  for(
    let i = 1;
    i < cust.length;
    i++
  ){

    const customerId =
      cust[i][
        COL_PELANGGAN.ID
      ];


    hpMap[customerId] =
      cust[i][
        COL_PELANGGAN.NOHP
      ] || "";

  }


  /**
   * ============================================
   * MAPPING WORK ORDER
   * ============================================
   */

  return wo
    .slice(1)
    .map(
      function(row){

        const customerId =
          row[
            COL_WORK_ORDER.ID_PELANGGAN
          ];


        return {

          noWO :
            row[
              COL_WORK_ORDER.ID
            ],

          idPelanggan :
            customerId,

          nama :
            row[
              COL_WORK_ORDER.NAMA_PELANGGAN
            ],

          hp :
            hpMap[customerId] || "",

          idKendaraan :
            row[
              COL_WORK_ORDER.ID_KENDARAAN
            ],

          plat :
            row[
              COL_WORK_ORDER.NO_POLISI
            ],

          merk :
            row[
              COL_WORK_ORDER.MERK
            ],

          model :
            row[
              COL_WORK_ORDER.MODEL
            ],

          km :
            row[
              COL_WORK_ORDER.KILOMETER_MASUK
            ],

          status :
            row[
              COL_WORK_ORDER.STATUS
            ],

          prioritas :
            row[
              COL_WORK_ORDER.PRIORITAS
            ],

          estimasiSelesai :
            row[
              COL_WORK_ORDER.ESTIMASI_SELESAI
            ],

          admin :
            row[
              COL_WORK_ORDER.ADMIN
            ],

          catatan :
            row[
              COL_WORK_ORDER.CATATAN
            ],

          dibuatPada :
            row[
              COL_WORK_ORDER.DIBUAT_PADA
            ],

          diubahPada :
            row[
              COL_WORK_ORDER.DIUBAH_PADA
            ]

        };

      }
    );

}


/**
 * ======================================================
 * MENGAMBIL SATU WORK ORDER
 * ======================================================
 */



/**
 * ======================================================
 * MEMBUKA DETAIL WORK ORDER
 * ======================================================
 */


/**
 * ======================================================
 * TEST
 * ======================================================
 */

function testGetAllWorkOrder(){

  const data =
    getAllWorkOrder();

  Logger.log(
    "Jumlah WO = " +
    data.length
  );

  Logger.log(
    data
  );

}

function testDashboardSheets(){

  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();

  Logger.log(
    "WORK_ORDER CONFIG = " +
    CONFIG.SHEET.WORK_ORDER
  );

  Logger.log(
    "PELANGGAN CONFIG = " +
    CONFIG.SHEET.PELANGGAN
  );

  const shWO =
    ss.getSheetByName(
      CONFIG.SHEET.WORK_ORDER
    );

  const shCust =
    ss.getSheetByName(
      CONFIG.SHEET.PELANGGAN
    );

  Logger.log(
    "shWO = " +
    (shWO ? shWO.getName() : "NULL")
  );

  Logger.log(
    "shCust = " +
    (shCust ? shCust.getName() : "NULL")
  );

}