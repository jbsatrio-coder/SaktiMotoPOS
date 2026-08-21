/**
 * ============================================
 * Penjualan Repository
 * Sprint 3
 * ============================================
 */

const PenjualanRepository = {

  getHeaderSheet(){
    return getSheet_(CONFIG.SHEET.PENJUALAN);
  },

  getDetailSheet(){
    return getSheet_(CONFIG.SHEET.DETAIL_PENJUALAN);
  },

  getColumnMap_(sheet){
    return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
      .reduce(function(map, header, index){
        const name = String(header || "").trim();
        if(name){ map[name] = index; }
        return map;
      }, {});
  },

  requireColumns_(columns, names, sheetName){
    const missing = names.filter(function(name){ return columns[name] === undefined; });
    if(missing.length){
      throw new Error("Schema canonical Sales belum siap pada " + sheetName + ": " + missing.join(", ") + ".");
    }
  },

  getHeaderRecord_(row, columns){
    return {
      salesNumber : row[columns.NoTransaksi] || "",
      submissionId : columns.SubmissionId === undefined ? "" : row[columns.SubmissionId] || "",
      idempotencyKey : columns.IdempotencyKey === undefined ? "" : row[columns.IdempotencyKey] || "",
      transactionId : columns.TransactionId === undefined ? "" : row[columns.TransactionId] || "",
      payloadFingerprint : columns.PayloadFingerprint === undefined ? "" : row[columns.PayloadFingerprint] || "",
      status : row[columns.Status] || "",
      row : row
    };
  },

  findAllBySubmissionId(submissionId){
    const sheet = this.getHeaderSheet();
    const columns = this.getColumnMap_(sheet);
    if(columns.SubmissionId === undefined || !String(submissionId || "").trim() || sheet.getLastRow() < 2){ return []; }
    return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues()
      .filter(function(row){ return String(row[columns.SubmissionId] || "").trim() === String(submissionId).trim(); })
      .map(function(row){ return PenjualanRepository.getHeaderRecord_(row, columns); });
  },

  findBySubmissionId(submissionId){
    const matches = this.findAllBySubmissionId(submissionId);
    if(matches.length > 1){ throw new Error("AUDIT_ANOMALY: duplicate canonical Sales submissionId."); }
    return matches.length ? matches[0] : null;
  },

  findBySalesNumber(noTransaksi){
    const sheet = this.getHeaderSheet();
    const columns = this.getColumnMap_(sheet);
    if(!String(noTransaksi || "").trim() || sheet.getLastRow() < 2){ return null; }
    const row = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues()
      .find(function(item){ return String(item[columns.NoTransaksi] || "").trim() === String(noTransaksi).trim(); });
    return row ? this.getHeaderRecord_(row, columns) : null;
  },

  findItemsBySalesNumber(noTransaksi){
    const sheet = this.getDetailSheet();
    const columns = this.getColumnMap_(sheet);
    if(sheet.getLastRow() < 2){ return []; }
    return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues()
      .filter(function(row){ return String(row[columns.NoTransaksi] || "").trim() === String(noTransaksi).trim(); })
      .map(function(row){
        return {
          idDetail : row[columns.IDDetail] || "", salesNumber : row[columns.NoTransaksi] || "",
          lineId : columns.LineId === undefined ? "" : row[columns.LineId] || "",
          itemType : row[columns.Tipe] || "", itemId : row[columns.KodeItem] || "",
          quantity : row[columns.Qty], unitPrice : row[columns.Harga], lineDiscount : row[columns.Diskon],
          subtotal : row[columns.Subtotal], fulfillmentSource : columns.FulfillmentSource === undefined ? "" : row[columns.FulfillmentSource] || "",
          workOrderPartId : columns.WorkOrderPartId === undefined ? "" : row[columns.WorkOrderPartId] || ""
        };
      });
  },

  saveCanonicalHeader(header){
    const sheet = this.getHeaderSheet();
    const columns = this.getColumnMap_(sheet);
    this.requireColumns_(columns, SALES_CANONICAL_SCHEMA.headerRequired.concat(SALES_CANONICAL_SCHEMA.headerAppend), sheet.getName());
    const row = Array(sheet.getLastColumn()).fill("");
    const put = function(name, value){ row[columns[name]] = value === undefined || value === null ? "" : value; };
    put("NoTransaksi", header.noTransaksi); put("Tanggal", header.tanggal); put("Jam", header.jam);
    put("IDPelanggan", header.idPelanggan); put("NamaPelanggan", header.namaPelanggan); put("IDKendaraan", header.idKendaraan);
    put("PlatNomor", header.platNomor); put("MekanikUtama", header.mekanikUtama); put("Subtotal", header.subtotal);
    put("DiskonNota", header.diskonNota); put("GrandTotal", header.grandTotal); put("Bayar", header.bayar);
    put("Kembalian", header.kembalian); put("MetodeBayar", header.metodeBayar); put("Admin", header.admin);
    put("Status", header.status); put("CreatedAt", header.createdAt); put("WorkOrder", header.workOrder); put("UpdatedAt", header.updatedAt);
    put("SubmissionId", header.submissionId); put("IdempotencyKey", header.idempotencyKey); put("TransactionId", header.transactionId); put("PayloadFingerprint", header.payloadFingerprint);
    sheet.appendRow(row);
  },

  saveCanonicalDetails(payload){
    if(!payload || !payload.noTransaksi || !Array.isArray(payload.items) || !payload.items.length){
      throw new Error("Detail canonical Sales tidak lengkap.");
    }
    const sheet = this.getDetailSheet();
    const columns = this.getColumnMap_(sheet);
    this.requireColumns_(columns, SALES_CANONICAL_SCHEMA.detailRequired.concat(SALES_CANONICAL_SCHEMA.detailAppend), sheet.getName());
    const rows = payload.items.map(function(item){
      const row = Array(sheet.getLastColumn()).fill("");
      const put = function(name, value){ row[columns[name]] = value === undefined || value === null ? "" : value; };
      put("IDDetail", item.lineId); put("NoTransaksi", payload.noTransaksi); put("Tipe", item.itemType); put("KodeItem", item.itemId);
      put("NamaItem", item.nameSnapshot); put("Qty", item.quantity); put("Harga", item.unitPriceIntent); put("Diskon", item.lineDiscountIntent);
      put("Subtotal", item.calculatedLineTotal); put("Mekanik", item.mechanicIntent); put("KomisiMekanik", 0);
      put("HargaModal", 0); put("LabaKotor", 0); put("CreatedAt", payload.createdAt); put("UpdatedAt", "");
      put("LineId", item.lineId); put("FulfillmentSource", item.fulfillmentSource); put("WorkOrderPartId", item.workOrderPartId);
      return row;
    });
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, sheet.getLastColumn()).setValues(rows);
  },

  updateCanonicalStatus(noTransaksi, status, updatedAt){
    const sheet=this.getHeaderSheet(), columns=this.getColumnMap_(sheet), record=this.findBySalesNumber(noTransaksi);
    if(!record){ throw new Error("Sales canonical tidak ditemukan: " + noTransaksi); }
    const rows=sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).getValues();
    const index=rows.findIndex(function(row){return String(row[columns.NoTransaksi]||"").trim()===String(noTransaksi).trim();});
    sheet.getRange(index+2,columns.Status+1).setValue(status);
    sheet.getRange(index+2,columns.UpdatedAt+1).setValue(updatedAt||new Date());
    return true;
  },

  /**
   * Simpan Header Penjualan
   */
  saveHeader(header) {

    if (!header) {
      throw new Error("Header transaksi kosong.");
    }

    const sh = getSheet_(CONFIG.SHEET.PENJUALAN);

    sh.appendRow([

      header.noTransaksi,

      header.tanggal,
      header.jam,

      header.idPelanggan,
      header.namaPelanggan,

      header.idKendaraan,
      header.platNomor,

      header.mekanikUtama,

      parseNumber(header.subtotal),
      parseNumber(header.diskonNota),
      parseNumber(header.grandTotal),

      parseNumber(header.bayar),
      parseNumber(header.kembalian),

      header.metodeBayar,

      header.admin,

      header.status,

      header.createdAt,

      header.workOrder || "",

      header.updatedAt || ""

    ]);

    return true;

  },

  /**
   * Simpan Detail Penjualan
   */
 /**
 * Simpan Detail Penjualan
 */
saveDetail(payload) {

  if (!payload) {
    throw new Error("Payload kosong.");
  }

  const { noTransaksi, items, createdAt } = payload;

  if (!noTransaksi) {
    throw new Error("No transaksi kosong.");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Detail transaksi kosong.");
  }

  const sh = getSheet_(CONFIG.SHEET.DETAIL_PENJUALAN);

  // Cari baris terakhir
  const lastRow = sh.getLastRow();

  // Mulai nomor ID berikutnya
  let running = Math.max(1, lastRow);

  const rows = items.map(item => {

    running++;

    const idDetail =
      "DTL" + String(running).padStart(8, "0");

    return [

      idDetail,

      noTransaksi,

      item.jenis,

      item.kode,

      item.nama,

      parseNumber(item.qty),

      parseNumber(item.harga),

      parseNumber(item.diskon || 0),

      parseNumber(item.subtotal),

      item.mekanik || "",

      parseNumber(item.komisi || 0),

      parseNumber(item.hargaModal || 0),

      parseNumber(item.labaKotor || 0),

      createdAt,

      ""

    ];

  });

  sh
    .getRange(
      lastRow + 1,
      1,
      rows.length,
      rows[0].length
    )
    .setValues(rows);

  return {

    success: true,

    inserted: rows.length

  };

},

};

function testSaveHeader() {

  const ok = PenjualanRepository.saveHeader({

    noTransaksi: "TEST000001",

    tanggal: new Date(),
    jam: new Date(),

    idPelanggan: "PLG000001",
    namaPelanggan: "TEST PELANGGAN",

    idKendaraan: "KND000001",
    platNomor: "B1234XYZ",

    mekanikUtama: "Kiki",

    subtotal: 100000,
    diskonNota: 5000,
    grandTotal: 95000,

    bayar: 100000,
    kembalian: 5000,

    metodeBayar: "TUNAI",

    admin: "TEST",

    status: "SELESAI",

    createdAt: new Date(),

    workOrder: "",

    updatedAt: ""

  });

  Logger.log(ok);

}

function testSaveDetail() {

  const result = PenjualanRepository.saveDetail({

    noTransaksi: "TEST000001",

    createdAt: new Date(),

    items: [

      {

        jenis: "BARANG",

        kode: "BRG000001",

        nama: "Barang Test",

        qty: 2,

        harga: 50000,

        diskon: 0,

        subtotal: 100000,

        mekanik: "MKN001",

        komisi: 0,

        hargaModal: 30000,

        labaKotor: 40000

      },

      {

        jenis: "JASA",

        kode: "JSA000001",

        nama: "Service Ringan",

        qty: 1,

        harga: 35000,

        diskon: 0,

        subtotal: 35000,

        mekanik: "MKN001",

        komisi: 10000,

        hargaModal: 0,

        labaKotor: 35000

      }

    ]

  });

  Logger.log(result);

}
