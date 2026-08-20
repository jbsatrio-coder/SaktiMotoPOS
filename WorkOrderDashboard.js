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
 * ======================================================
 */

function getAllWorkOrder(){

  const shWO =
    getSheet_(
      CONFIG.SHEET.WORK_ORDER
    );

  const shCust =
    getSheet_(
      CONFIG.SHEET.PELANGGAN
    );


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
   * MAPPING WORK ORDER BARU
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

          mekanikNama :
            getMekanikByWorkOrder_(
            row[
              COL_WORK_ORDER.ID
            ]
            ).join(", "),

            
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

function getMekanikByWorkOrder_(
  workOrderId
){

  const jasaRows =
    WorkOrderJasaRepository
      .findByWorkOrderId(
        workOrderId
      );


  const names = [];


  (jasaRows || []).forEach(
    function(row){

      const nama =
        String(
          row[
            COL_WO_JASA.MEKANIK_NAMA
          ] || ""
        ).trim();


      if(
        nama &&
        !names.includes(nama)
      ){

        names.push(nama);

      }

    }
  );


  return names;

}


/**
 * ======================================================
 * MENGAMBIL SATU WORK ORDER
 * ======================================================
 */

function getWorkOrder(noWO) {

  // ============================================
  // 1. MASTER WORK ORDER
  // ============================================

  const shWO = getSheet_(
    CONFIG.SHEET.WORK_ORDER
  );

  if (shWO.getLastRow() < 2) {
    return null;
  }

  const woData =
    shWO
      .getDataRange()
      .getDisplayValues();


  // ============================================
  // 2. CARI WORK ORDER
  // ============================================

  let wo = null;

  for (let i = 1; i < woData.length; i++) {

    const row = woData[i];

    if (
      String(row[COL_WORK_ORDER.ID]).trim() ===
      String(noWO).trim()
    ) {

      wo = row;

      break;

    }

  }


  if (!wo) {

    return null;

  }


  // ============================================
  // 3. AMBIL DATA JASA
  // ============================================

  const shJasa = getSheet_(
    CONFIG.SHEET.WORK_ORDER_JASA
  );

  const jasaList = [];


  if (shJasa.getLastRow() >= 2) {

    const jasaData =
      shJasa
        .getDataRange()
        .getDisplayValues();


    for (let i = 1; i < jasaData.length; i++) {

      const row = jasaData[i];


      // Hanya jasa milik WO ini
      if (
        String(
          row[COL_WO_JASA.WORK_ORDER_ID]
        ).trim() !==
        String(noWO).trim()
      ) {

        continue;

      }


      jasaList.push({

        id:
          row[COL_WO_JASA.ID],

        urutan:
          row[COL_WO_JASA.URUTAN],

        jasaId:
          row[COL_WO_JASA.JASA_ID],

        namaJasa:
          row[COL_WO_JASA.NAMA_JASA],

        keluhan:
          row[COL_WO_JASA.KELUHAN],

        diagnosa:
          row[COL_WO_JASA.DIAGNOSA],

        mekanikId:
          row[COL_WO_JASA.MEKANIK_ID],

        mekanik:
          row[COL_WO_JASA.MEKANIK_NAMA],

        qty:
          row[COL_WO_JASA.QTY],

        harga:
          row[COL_WO_JASA.HARGA],

        diskon:
          row[COL_WO_JASA.DISKON],

        subtotal:
          row[COL_WO_JASA.SUBTOTAL],

        status:
          row[COL_WO_JASA.STATUS],

        catatan:
          row[COL_WO_JASA.CATATAN]

      });

    }

  }


    // ============================================
  // 4. MASTER MEKANIK
  // ============================================

  const masterMekanik =
    getMasterMekanik();

  
  // ============================================
  // 5. RETURN DATA WO + JASA + MEKANIK
  // ============================================

  return {

    noWO:
      wo[COL_WORK_ORDER.ID],

    idPelanggan:
      wo[COL_WORK_ORDER.ID_PELANGGAN],

    nama:
      wo[COL_WORK_ORDER.NAMA_PELANGGAN],

    idKendaraan:
      wo[COL_WORK_ORDER.ID_KENDARAAN],

    plat:
      wo[COL_WORK_ORDER.NO_POLISI],

    merk:
      wo[COL_WORK_ORDER.MERK],

    model:
      wo[COL_WORK_ORDER.MODEL],

    km:
      wo[COL_WORK_ORDER.KILOMETER_MASUK],

    status:
      wo[COL_WORK_ORDER.STATUS],

    prioritas:
      wo[COL_WORK_ORDER.PRIORITAS],

    estimasiSelesai:
      wo[COL_WORK_ORDER.ESTIMASI_SELESAI],

    admin:
      wo[COL_WORK_ORDER.ADMIN],

    catatan:
      wo[COL_WORK_ORDER.CATATAN],

    dibuatPada:
      wo[COL_WORK_ORDER.DIBUAT_PADA],

    diubahPada:
      wo[COL_WORK_ORDER.DIUBAH_PADA],

        jasa:
      jasaList,

    masterMekanik:
      masterMekanik

  };

}



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

function testGetWorkOrderDetail() {

  const data =
    getWorkOrder("WO2608070001");

  Logger.log(
    JSON.stringify(data, null, 2)
  );

}

 function testGetAllWorkOrderDashboard(){

  const data =
    getAllWorkOrder();

  Logger.log(
    JSON.stringify(
      data.slice(0, 5),
      null,
      2
    )
  );

}

