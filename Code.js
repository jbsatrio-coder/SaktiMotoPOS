const SHEET = {

  SETTING: "01_Setting",

  MASTER_BARANG: "02_MasterBarang",
  MASTER_KATEGORI: "03_MasterKategori",
  MASTER_MERK: "04_MasterMerk",
  MASTER_SUPPLIER: "05_MasterSupplier",
  MASTER_PELANGGAN: "06_MasterPelanggan",
  MASTER_KENDARAAN: "07_MasterKendaraan",
  MASTER_JASA: "08_MasterJasa",
  MASTER_MEKANIK: "09_MasterMekanik",

  POS: "10_POS",

  PENJUALAN: "11_Penjualan",
  DETAIL_PENJUALAN: "12_DetailPenjualan",

  PEMBELIAN: "13_Pembelian",
  STOK: "14_Stok",

  DASHBOARD: "15_Dashboard",
  KOMISI: "16_KomisiMekanik",

  WORK_ORDER: "17_WorkOrder",
  DETAIL_WORK_ORDER: "18_DetailWorkOrder",
  MASTER_KELUHAN: "19_MasterKeluhan",
  MASTER_STATUS_WO: "20_MasterStatusWO"

};


function testBarcode(){

  const barang = findProductByBarcode("100000001");

  Logger.log(barang);

}

function tambahItem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const pos = ss.getSheetByName(CONFIG.SHEET.POS);
  const masterBarang = ss.getSheetByName(CONFIG.SHEET.BARANG);
  const masterJasa = ss.getSheetByName(CONFIG.SHEET.JASA);

  const pilihan = String(pos.getRange("B8").getValue()).trim();
  const qtyTambah = Number(pos.getRange("G7").getValue());
  const mekanik = pos.getRange("H4").getValue();

  // =========================
  // VALIDASI
  // =========================
  if (!pilihan) {
    SpreadsheetApp.getUi().alert("Pilih item terlebih dahulu.");
    return;
  }

  if (!qtyTambah || qtyTambah <= 0) {
    SpreadsheetApp.getUi().alert("Qty harus lebih dari 0.");
    return;
  }

  // Format pilihan:
  // BARANG | BRG000001 | Nama | Rp45.000 | Stok 8
  // JASA   | JSA000001 | Nama | Rp50.000

  const bagian = pilihan.split(" | ");

  const tipe = bagian[0].trim();
  const kode = bagian[1].trim();

  let nama = "";
  let harga = 0;
  let stok = 0;

  // =========================
  // JIKA BARANG
  // =========================
  if (tipe === "BARANG") {

    const lastRow = masterBarang.getLastRow();

    if (lastRow < 2) {
      SpreadsheetApp.getUi().alert("MasterBarang masih kosong.");
      return;
    }

    const data = masterBarang
      .getRange(2, 1, lastRow - 1, masterBarang.getLastColumn())
      .getValues();

    const item = data.find(
      row => String(row[2]).trim() === kode
    );

    if (!item) {
      SpreadsheetApp.getUi().alert(
        "Barang dengan kode " + kode + " tidak ditemukan."
      );
      return;
    }

    // MasterBarang:
    // C = KodeBarang
    // E = NamaPendek
    // N = HargaJual
    // O = Stok

    nama = item[4];
    harga = Number(item[13]);
    stok = Number(item[14]);

  }

  // =========================
  // JIKA JASA
  // =========================
  else if (tipe === "JASA") {

    const lastRow = masterJasa.getLastRow();

    if (lastRow < 2) {
      SpreadsheetApp.getUi().alert("MasterJasa masih kosong.");
      return;
    }

    const data = masterJasa
      .getRange(2, 1, lastRow - 1, masterJasa.getLastColumn())
      .getValues();

    const item = data.find(
      row => String(row[1]).trim() === kode
    );

    if (!item) {
      SpreadsheetApp.getUi().alert(
        "Jasa dengan kode " + kode + " tidak ditemukan."
      );
      return;
    }

    // MasterJasa:
    // B = KodeJasa
    // C = NamaJasa
    // E = Harga

    nama = item[2];
    harga = Number(item[4]);

  }

  else {
    SpreadsheetApp.getUi().alert(
      "Tipe item tidak dikenali: " + tipe
    );
    return;
  }

  // =========================
  // CEK ITEM DI KERANJANG
  // =========================
  const startRow = 11;
  const endRow = 25;

  const dataKeranjang = pos
    .getRange(startRow, 1, endRow - startRow + 1, 9)
    .getValues();

  let rowItemSama = null;

  for (let i = 0; i < dataKeranjang.length; i++) {

    const tipeKeranjang =
      String(dataKeranjang[i][1]).trim();

    const kodeKeranjang =
      String(dataKeranjang[i][2]).trim();

    if (
      tipeKeranjang === tipe &&
      kodeKeranjang === kode
    ) {
      rowItemSama = startRow + i;
      break;
    }
  }

  // =========================
  // ITEM SUDAH ADA
  // =========================
  if (rowItemSama) {

    const qtyLama =
      Number(pos.getRange(rowItemSama, 5).getValue()) || 0;

    const qtyBaru = qtyLama + qtyTambah;

    // Cek stok hanya untuk BARANG
    if (tipe === "BARANG" && qtyBaru > stok) {
      SpreadsheetApp.getUi().alert(
        "Stok tidak mencukupi.\n\n" +
        "Stok tersedia: " + stok +
        "\nSudah di keranjang: " + qtyLama +
        "\nQty tambahan: " + qtyTambah
      );
      return;
    }

    pos.getRange(rowItemSama, 5).setValue(qtyBaru);

    const diskon =
      Number(pos.getRange(rowItemSama, 7).getValue()) || 0;

    const subtotal =
      (qtyBaru * harga) - diskon;

    pos.getRange(rowItemSama, 8).setValue(subtotal);

  }

  // =========================
  // ITEM BARU
  // =========================
  else {

    // Cek stok hanya untuk barang
    if (tipe === "BARANG" && qtyTambah > stok) {
      SpreadsheetApp.getUi().alert(
        "Stok tidak mencukupi.\nStok tersedia: " + stok
      );
      return;
    }

    let targetRow = null;

    for (let row = startRow; row <= endRow; row++) {
      if (pos.getRange(row, 3).getValue() === "") {
        targetRow = row;
        break;
      }
    }

    if (!targetRow) {
      SpreadsheetApp.getUi().alert(
        "Keranjang POS sudah penuh."
      );
      return;
    }

    const nomor = targetRow - 10;
    const subtotal = qtyTambah * harga;

    pos.getRange(targetRow, 1, 1, 9).setValues([[
      nomor,       // A No
      tipe,        // B BARANG / JASA
      kode,        // C Kode
      nama,        // D Nama Item
      qtyTambah,   // E Qty
      harga,       // F Harga
      0,           // G Diskon
      subtotal,    // H Subtotal
      mekanik      // I Mekanik
    ]]);
  }

  // =========================
  // RESET INPUT
  // =========================
  pos.getRange("B7").clearContent();
  pos.getRange("B8").clearContent();
  pos.getRange("G7").setValue(1);
}

function hapusItem() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const pos = ss.getSheetByName(CONFIG.SHEET.POS);
  const ui = SpreadsheetApp.getUi();

  const activeSheet = ss.getActiveSheet();
  const activeRange = activeSheet.getActiveRange();

  // Pastikan sedang berada di sheet POS
  if (activeSheet.getName() !== CONFIG.SHEET.POS) {
    ui.alert("Silakan pilih item pada sheet " + CONFIG.SHEET.POS + ".");
    return;
  }

  const row = activeRange.getRow();

  // Keranjang hanya baris 11–25
  if (row < 11 || row > 25) {
    ui.alert(
      "Pilih salah satu cell pada item yang ingin dihapus."
    );
    return;
  }

  const kode = pos.getRange(row, 3).getValue();
  const nama = pos.getRange(row, 4).getValue();

  if (!kode) {
    ui.alert("Baris tersebut tidak berisi item.");
    return;
  }

  // Konfirmasi
  const response = ui.alert(
    "Hapus Item",
    "Hapus " + nama + " dari keranjang?",
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  // Ambil item di bawah baris yang dipilih
  if (row < 25) {
    const jumlahBaris = 25 - row;

    const dataBawah = pos
      .getRange(row + 1, 1, jumlahBaris, 9)
      .getValues();

    // Naikkan item-item di bawah
    pos
      .getRange(row, 1, jumlahBaris, 9)
      .setValues(dataBawah);
  }

  // Kosongkan baris terakhir keranjang
  pos.getRange(25, 1, 1, 9).clearContent();

  // Rapikan nomor urut
  let nomor = 1;

  for (let r = 11; r <= 25; r++) {
    const kodeItem = pos.getRange(r, 3).getValue();

    if (kodeItem !== "") {
      pos.getRange(r, 1).setValue(nomor);
      nomor++;
    } else {
      pos.getRange(r, 1).clearContent();
    }
  }
}

function simpanTransaksi() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const pos = ss.getSheetByName(CONFIG.SHEET.POS);
  const penjualan = ss.getSheetByName(CONFIG.SHEET.PENJUALAN);
  const detail = ss.getSheetByName(CONFIG.SHEET.DETAIL_PENJUALAN);
  const masterBarang = ss.getSheetByName(CONFIG.SHEET.BARANG);
  const masterJasa = ss.getSheetByName(CONFIG.SHEET.JASA);
  const masterMekanik = ss.getSheetByName(CONFIG.SHEET.MEKANIK);
  const pelanggan = ss.getSheetByName(CONFIG.SHEET.PELANGGAN);
  const kendaraan = ss.getSheetByName(CONFIG.SHEET.VEHICLE);
  const stokSheet = ss.getSheetByName(CONFIG.SHEET.STOK);

  // ==========================================
  // AMBIL DATA HEADER POS
  // ==========================================
  const noTransaksi = String(pos.getRange("B3").getValue()).trim();
  const tanggal = pos.getRange("E3").getValue();
  const namaPelanggan = String(pos.getRange("B4").getValue()).trim();
  const platNomor = String(pos.getRange("E4").getValue()).trim();
  const mekanikUtama = String(pos.getRange("H4").getValue()).trim();
  const admin = String(pos.getRange("H3").getValue()).trim();

  const subtotal = Number(pos.getRange("H27").getValue()) || 0;
  const diskonNota = Number(pos.getRange("H28").getValue()) || 0;
  const grandTotal = Number(pos.getRange("H29").getValue()) || 0;
  const bayar = Number(pos.getRange("H30").getValue()) || 0;
  const kembalian = Number(pos.getRange("H31").getValue()) || 0;
  const metodeBayar = String(pos.getRange("H32").getValue()).trim();

  // ==========================================
  // VALIDASI HEADER
  // ==========================================
  if (!noTransaksi) {
    ui.alert("No. transaksi belum tersedia.");
    return;
  }

  if (!namaPelanggan) {
    ui.alert("Pelanggan belum dipilih.");
    return;
  }

  if (!mekanikUtama) {
    ui.alert("Mekanik belum dipilih.");
    return;
  }

  if (!admin) {
    ui.alert("Admin belum dipilih.");
    return;
  }

  if (!metodeBayar) {
    ui.alert("Metode pembayaran belum dipilih.");
    return;
  }

  // ==========================================
  // AMBIL KERANJANG
  // ==========================================
  const keranjang = pos.getRange("A11:I25").getValues();

  const itemAktif = keranjang.filter(row =>
    String(row[2]).trim() !== ""
  );

  if (itemAktif.length === 0) {
    ui.alert("Keranjang masih kosong.");
    return;
  }

  if (grandTotal <= 0) {
    ui.alert("Grand Total tidak valid.");
    return;
  }

  if (bayar < grandTotal) {
    ui.alert(
      "Pembayaran kurang.\n\n" +
      "Grand Total: Rp" + grandTotal.toLocaleString("id-ID") +
      "\nBayar: Rp" + bayar.toLocaleString("id-ID")
    );
    return;
  }

  // ==========================================
  // CEK TRANSAKSI DUPLIKAT
  // ==========================================
  if (penjualan.getLastRow() >= 2) {
    const daftarTransaksi = penjualan
      .getRange(2, 1, penjualan.getLastRow() - 1, 1)
      .getValues()
      .flat()
      .map(v => String(v).trim());

    if (daftarTransaksi.includes(noTransaksi)) {
      ui.alert(
        "Transaksi " + noTransaksi +
        " sudah pernah disimpan."
      );
      return;
    }
  }

  // ==========================================
  // LOAD MASTER BARANG
  // ==========================================
  const barangData = masterBarang.getLastRow() >= 2
    ? masterBarang.getRange(
        2,
        1,
        masterBarang.getLastRow() - 1,
        masterBarang.getLastColumn()
      ).getValues()
    : [];

  // ==========================================
  // LOAD MASTER JASA
  // ==========================================
  const jasaData = masterJasa.getLastRow() >= 2
    ? masterJasa.getRange(
        2,
        1,
        masterJasa.getLastRow() - 1,
        masterJasa.getLastColumn()
      ).getValues()
    : [];

// ==========================================
// LOAD MASTER MEKANIK
// ==========================================
const mekanikData = masterMekanik.getLastRow() >= 2
  ? masterMekanik.getRange(
      2,
      1,
      masterMekanik.getLastRow() - 1,
      masterMekanik.getLastColumn()
    ).getValues()
  : [];


  // ==========================================
  // VALIDASI SEMUA ITEM + STOK
  // SEBELUM MENULIS TRANSAKSI
  // ==========================================
  for (const row of itemAktif) {
    const tipe = String(row[1]).trim();
    const kode = String(row[2]).trim();
    const qty = Number(row[4]) || 0;

    if (qty <= 0) {
      ui.alert("Qty tidak valid untuk item " + kode);
      return;
    }

    if (tipe === "BARANG") {
      const barang = barangData.find(r =>
        String(r[2]).trim() === kode
      );

      if (!barang) {
        ui.alert(
          "Barang " + kode +
          " tidak ditemukan di MasterBarang."
        );
        return;
      }

      // O = Stok = index 14
      const stokSekarang = Number(barang[14]) || 0;

      if (qty > stokSekarang) {
        ui.alert(
          "Stok tidak mencukupi.\n\n" +
          "Barang: " + barang[4] +
          "\nStok tersedia: " + stokSekarang +
          "\nQty transaksi: " + qty
        );
        return;
      }
    }

    else if (tipe === "JASA") {
      const jasa = jasaData.find(r =>
        String(r[1]).trim() === kode
      );

      if (!jasa) {
        ui.alert(
          "Jasa " + kode +
          " tidak ditemukan di MasterJasa."
        );
        return;
      }
    }

    else {
      ui.alert("Tipe item tidak dikenali: " + tipe);
      return;
    }
  }

  // ==========================================
  // CARI ID PELANGGAN
  // ==========================================
  let idPelanggan = "";

  if (pelanggan.getLastRow() >= 2) {
    const dataPelanggan = pelanggan
      .getRange(2, 1, pelanggan.getLastRow() - 1, 2)
      .getValues();

    const found = dataPelanggan.find(r =>
      String(r[1]).trim() === namaPelanggan
    );

    if (found) idPelanggan = found[0];
  }

  // ==========================================
  // CARI ID KENDARAAN
  // ==========================================
  let idKendaraan = "";

  if (platNomor && kendaraan.getLastRow() >= 2) {
    const dataKendaraan = kendaraan
      .getRange(
        2,
        1,
        kendaraan.getLastRow() - 1,
        kendaraan.getLastColumn()
      )
      .getValues();

    // D = PlatNomor
    const found = dataKendaraan.find(r =>
      String(r[3]).trim() === platNomor
    );

    if (found) idKendaraan = found[0];
  }

  // ==========================================
  // NOMOR DETAIL & MUTASI BERIKUTNYA
  // ==========================================
  let nomorDetail = Math.max(1, detail.getLastRow());

  let nomorMutasi = Math.max(1, stokSheet.getLastRow());

  const now = new Date();

  const detailRows = [];
  const mutasiRows = [];

  // Menyimpan update stok yang akan dilakukan
  const updateStok = [];

  // ==========================================
  // PROSES ITEM
  // ==========================================
  for (const row of itemAktif) {
    const tipe = String(row[1]).trim();
    const kode = String(row[2]).trim();
    const nama = row[3];

    const qty = Number(row[4]) || 0;
    const harga = Number(row[5]) || 0;
    const diskon = Number(row[6]) || 0;
    const sub = Number(row[7]) || 0;
    const mekanik = String(row[8]).trim();

    let hargaModal = 0;
    let komisi = 0;
    let labaKotor = 0;

    // ========================================
    // BARANG
    // ========================================
    if (tipe === "BARANG") {
      const indexBarang = barangData.findIndex(r =>
        String(r[2]).trim() === kode
      );

      const barang = barangData[indexBarang];

      // L = HargaModal = index 11
      hargaModal = Number(barang[11]) || 0;

      // O = Stok = index 14
      const stokAwal = Number(barang[14]) || 0;
      const stokAkhir = stokAwal - qty;

      // Laba barang:
      // subtotal setelah diskon - total modal
      labaKotor = sub - (hargaModal * qty);

      // Row aktual MasterBarang
      const rowMaster = indexBarang + 2;

      updateStok.push({
        row: rowMaster,
        stokAkhir: stokAkhir
      });

      const idMutasi =
        "MTS" + String(nomorMutasi).padStart(6, "0");

      mutasiRows.push([
        idMutasi,          // A IDMutasi
        tanggal,           // B Tanggal
        now,               // C Jam
        kode,              // D KodeBarang
        nama,              // E NamaBarang
        "PENJUALAN",       // F JenisMutasi
        noTransaksi,       // G Referensi
        stokAwal,          // H StokAwal
        0,                 // I QtyMasuk
        qty,               // J QtyKeluar
        stokAkhir,         // K StokAkhir
        "Penjualan POS",   // L Keterangan
        admin,             // M Admin
        now                // N CreatedAt
      ]);

      nomorMutasi++;
    }

   // ========================================
// JASA
// ========================================
if (tipe === "JASA") {

  const dataMekanik = mekanikData.find(r =>
    String(r[1]).trim() === mekanik
  );

  if (!dataMekanik) {
    ui.alert(
      "Mekanik " + mekanik +
      " tidak ditemukan di MasterMekanik."
    );
    return;
  }

  // H = Persentase
  const persentaseKomisi = Number(dataMekanik[7]) || 0;

  // Komisi dihitung dari nilai jasa setelah diskon item
  komisi = sub * persentaseKomisi;

  hargaModal = 0;

  // Pendapatan jasa setelah komisi mekanik
  labaKotor = sub - komisi;
}

    const idDetail =
      "DTL" + String(nomorDetail).padStart(6, "0");

    detailRows.push([
      idDetail,        // A IDDetail
      noTransaksi,     // B NoTransaksi
      tipe,            // C Tipe
      kode,            // D KodeItem
      nama,            // E NamaItem
      qty,             // F Qty
      harga,           // G Harga
      diskon,          // H Diskon
      sub,              // I Subtotal
      mekanik,         // J Mekanik
      komisi,          // K KomisiMekanik
      hargaModal,      // L HargaModal
      labaKotor        // M LabaKotor
    ]);

    nomorDetail++;
  }

  // ==========================================
  // KONFIRMASI SEBELUM SIMPAN
  // ==========================================
  const konfirmasi = ui.alert(
    "Simpan Transaksi",
    "No. Transaksi: " + noTransaksi +
    "\nGrand Total: Rp" +
    grandTotal.toLocaleString("id-ID") +
    "\n\nSimpan transaksi ini?",
    ui.ButtonSet.YES_NO
  );

  if (konfirmasi !== ui.Button.YES) {
    return;
  }

  // ==========================================
  // SIMPAN HEADER PENJUALAN
  // ==========================================
  penjualan.appendRow([
    noTransaksi,
    tanggal,
    now,
    idPelanggan,
    namaPelanggan,
    idKendaraan,
    platNomor,
    mekanikUtama,
    subtotal,
    diskonNota,
    grandTotal,
    bayar,
    kembalian,
    metodeBayar,
    admin,
    "SELESAI",
    now
  ]);

  // ==========================================
  // SIMPAN DETAIL
  // ==========================================
  detail
    .getRange(
      detail.getLastRow() + 1,
      1,
      detailRows.length,
      13
    )
    .setValues(detailRows);

  // ==========================================
  // UPDATE STOK MASTERBARANG
  // ==========================================
  updateStok.forEach(item => {
    // O = kolom 15
    masterBarang
      .getRange(item.row, 15)
      .setValue(item.stokAkhir);
  });

  // ==========================================
  // SIMPAN MUTASI STOK
  // ==========================================
  if (mutasiRows.length > 0) {
    stokSheet
      .getRange(
        stokSheet.getLastRow() + 1,
        1,
        mutasiRows.length,
        14
      )
      .setValues(mutasiRows);
  }

  // ==========================================
// RESET POS AMAN
// ==========================================

// 1. Kosongkan keranjang
pos.getRange("A11:I25").clearContent();

// 2. Kosongkan pencarian & pilihan item
pos.getRange("B7").clearContent();
pos.getRange("B8").clearContent();

// 3. Qty kembali ke 1
pos.getRange("G7").setValue(1);

// 4. Reset Diskon Nota
pos.getRange("H28").setValue(0);

// 5. Reset pembayaran
pos.getRange("H30").clearContent();
pos.getRange("H32").clearContent();

// 6. Pastikan rumus Kembalian tetap ada
pos.getRange("H31").setFormula(
  '=IF(H30="";"";MAX(0;H30-H29))'
);

// 7. Kosongkan data pelanggan/transaksi
pos.getRange("B4").clearContent(); // Pelanggan
pos.getRange("E4").clearContent(); // Kendaraan
pos.getRange("H4").clearContent(); // Mekanik

// 8. Jangan hapus:
// B3  = NoTransaksi
// E3  = Tanggal
// H3  = Admin
// H27 = Subtotal
// H29 = Grand Total
}

function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();

  if (sheet.getName() !== CONFIG.SHEET.POS) return;

  const cell = range.getA1Notation();

  // ==========================================
  // PELANGGAN BERUBAH
  // ==========================================
  if (cell === "B4") {

  const cellKendaraan = sheet.getRange("E4");

  // Simpan data validation E4
  const validation = cellKendaraan.getDataValidation();

  // Lepaskan validation sementara
  cellKendaraan.clearDataValidations();

  // Hapus kendaraan pelanggan sebelumnya
  cellKendaraan.clearContent();

  SpreadsheetApp.flush();

  // Pasang kembali validation
  if (validation) {
    cellKendaraan.setDataValidation(validation);
  }

  SpreadsheetApp.flush();

  return;
}


  // ==========================================
  // METODE PEMBAYARAN BERUBAH
  // ==========================================
  if (cell === "H32") {

    const metode = String(range.getValue()).trim();

    const grandTotal =
      Number(sheet.getRange("H29").getValue()) || 0;

    // Pastikan formula kembalian selalu ada
    sheet.getRange("H31").setFormula(
      '=IF(H30="";"";MAX(0;H30-H29))'
    );

    // -------------------------
    // NON TUNAI
    // -------------------------
    if (
      metode === "QRIS" ||
      metode === "TRANSFER" ||
      metode === "DEBIT"
    ) {

      // Bayar otomatis = Grand Total
      sheet.getRange("H30").setValue(grandTotal);

    }

    // -------------------------
    // TUNAI
    // -------------------------
    else if (metode === "TUNAI") {

      // Kasir memasukkan uang diterima
      sheet.getRange("H30").clearContent();

    }

    // -------------------------
    // METODE DIKOSONGKAN
    // -------------------------
    else {

      sheet.getRange("H30").clearContent();

    }
  }
}

/**
 * ============================================
 * BUKA FORM PELANGGAN BARU
 * DARI MENU UTAMA
 * ============================================
 */
function bukaFormPelanggan(){

  PropertiesService
    .getUserProperties()
    .setProperty(
      "FORM_PELANGGAN_SOURCE",
      "MENU"
    );

  const html =
    HtmlService
      .createHtmlOutputFromFile(
        "FormPelanggan"
      )
      .setWidth(480)
      .setHeight(650);

  SpreadsheetApp
    .getUi()
    .showModalDialog(
      html,
      "Tambah Pelanggan Baru"
    );

}


/**
 * ============================================
 * BUKA FORM PELANGGAN
 * DARI WORK ORDER
 * ============================================
 */
function bukaFormPelangganDariWorkOrder(){

  PropertiesService
    .getUserProperties()
    .setProperty(
      "FORM_PELANGGAN_SOURCE",
      "WORK_ORDER"
    );

  const html =
    HtmlService
      .createHtmlOutputFromFile(
        "FormPelanggan"
      )
      .setWidth(480)
      .setHeight(650);

  SpreadsheetApp
    .getUi()
    .showModalDialog(
      html,
      "Tambah Pelanggan Baru"
    );

}


/**
 * ============================================
 * AMBIL SOURCE FORM PELANGGAN
 * ============================================
 */
function getFormPelangganSource(){

  const props =
    PropertiesService
      .getUserProperties();

  const source =
    props.getProperty(
      "FORM_PELANGGAN_SOURCE"
    ) || "MENU";

  return source;

}

/**
 * ============================================
 * SIMPAN HASIL CREATE CUSTOMER + VEHICLE
 * UNTUK WORK ORDER
 * ============================================
 */

function setPendingWorkOrderCustomer(result){

  if(!result){

    throw new Error(
      "Hasil Customer + Vehicle tidak tersedia."
    );

  }


  if(!result.customerId){

    throw new Error(
      "Customer ID tidak tersedia."
    );

  }


  if(!result.vehicleId){

    throw new Error(
      "Vehicle ID tidak tersedia."
    );

  }


  PropertiesService
    .getUserProperties()
    .setProperty(

      "PENDING_WORK_ORDER_CUSTOMER",

      JSON.stringify({

        customerId :
          result.customerId,

        vehicleId :
          result.vehicleId,

        nama :
          result.nama || "",

        noHP :
          result.noHP || "",

        plat :
          result.plat || "",

        merk :
          result.merk || "",

        model :
          result.model || ""

      })

    );


  return true;

}


/**
 * ============================================
 * AMBIL HASIL CREATE CUSTOMER + VEHICLE
 * UNTUK WORK ORDER
 * ============================================
 *
 * Setelah berhasil diambil, property langsung
 * dihapus agar tidak digunakan kembali.
 * ============================================
 */

function getPendingWorkOrderCustomer(){

  const properties =
    PropertiesService
      .getUserProperties();


  const raw =
    properties.getProperty(
      "PENDING_WORK_ORDER_CUSTOMER"
    );


  if(!raw){

    return null;

  }


  properties.deleteProperty(
    "PENDING_WORK_ORDER_CUSTOMER"
  );


  try {

    return JSON.parse(raw);

  } catch(error){

    return null;

  }

}
/**
 * ============================================
 * CREATE CUSTOMER + VEHICLE
 * CANONICAL ENDPOINT
 * ============================================
 *
 * FormPelanggan
 *      ↓
 * createCustomerWithVehicle()
 *      ↓
 * CustomerVehicleService
 *
 * Tidak melakukan perubahan langsung
 * ke sheet Master Customer / Vehicle.
 *
 * Tidak melakukan side effect ke POS.
 * ============================================
 */

function createCustomerWithVehicle(data){

  if(!data){

    throw new Error(
      "Data customer dan kendaraan wajib diisi."
    );

  }

  return CustomerVehicleService
    .createCustomerWithVehicle({

      // =========================
      // CUSTOMER
      // =========================

      nama :
        data.nama,

      noHP :
        data.noHP || "",

      alamat :
        data.alamat || "",

      tanggalLahir :
        data.tanggalLahir || "",

      jenisKelamin :
        data.jenisKelamin ||
        CustomerGender.PRIA,

      status :
        data.status ||
        CustomerStatus.AKTIF,

      catatan :
        data.catatan || "",


      // =========================
      // VEHICLE
      // =========================

      noPolisi :
        data.plat,

      merk :
        data.merk,

      model :
        data.model,

      tahun :
        data.tahun || "",

      warna :
        data.warna || "",

      noMesin :
        data.noMesin || "",

      noRangka :
        data.noRangka || "",

      lastKilometer :
        Number(
          data.lastKilometer || 0
        ),

      vehicleStatus :
        data.vehicleStatus ||
        VehicleStatus.AKTIF,

      vehicleCatatan :
        data.vehicleCatatan || ""

    });

}

function simpanPelangganBaru(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const pelanggan = ss.getSheetByName(CONFIG.SHEET.PELANGGAN);
  const kendaraan = ss.getSheetByName(CONFIG.SHEET.VEHICLE);
  const pos = ss.getSheetByName(CONFIG.SHEET.POS);

  // =========================
  // BERSIHKAN INPUT
  // =========================
  const nama = String(data.nama || "").trim();
  const noHP = String(data.noHP || "").trim();
  const tanggalLahir = data.tanggalLahir || "";
  const alamat = String(data.alamat || "").trim();

  const plat = String(data.plat || "")
    .trim()
    .toUpperCase();

  const merk = String(data.merk || "").trim();
  const model = String(data.model || "").trim();
  const tahun = String(data.tahun || "").trim();
  const warna = String(data.warna || "").trim();

  // =========================
  // VALIDASI
  // =========================
  if (!nama) {
    throw new Error("Nama pelanggan wajib diisi.");
  }

  if (!plat) {
    throw new Error("Plat nomor wajib diisi.");
  }

  // =========================
  // CARI BARIS KOSONG
  // MASTER PELANGGAN
  // berdasarkan kolom B = Nama
  // =========================
  let rowPelanggan = 2;

  while (
    pelanggan.getRange(rowPelanggan, 2).getValue() !== ""
  ) {
    rowPelanggan++;
  }

  // =========================
  // CEK NO HP DUPLIKAT
  // =========================
  if (noHP && rowPelanggan > 2) {

    const daftarHP = pelanggan
      .getRange(2, 3, rowPelanggan - 2, 1)
      .getDisplayValues()
      .flat()
      .map(v => String(v).trim());

    if (daftarHP.includes(noHP)) {
      throw new Error(
        "Nomor HP " + noHP + " sudah terdaftar."
      );
    }
  }

  // =========================
  // CARI BARIS KOSONG
  // MASTER KENDARAAN
  // berdasarkan D = PlatNomor
  // =========================
  let rowKendaraan = 2;

  while (
    kendaraan.getRange(rowKendaraan, 4).getValue() !== ""
  ) {
    rowKendaraan++;
  }

  // =========================
  // CEK PLAT DUPLIKAT
  // =========================
  if (rowKendaraan > 2) {

    const daftarPlat = kendaraan
      .getRange(2, 4, rowKendaraan - 2, 1)
      .getDisplayValues()
      .flat()
      .map(v =>
        String(v).trim().toUpperCase()
      );

    if (daftarPlat.includes(plat)) {
      throw new Error(
        "Plat nomor " + plat + " sudah terdaftar."
      );
    }
  }

  const now = new Date();

  // =========================
// SIMPAN MASTER PELANGGAN
// =========================

pelanggan
  .getRange(rowPelanggan, 3)
  .setNumberFormat("@");

pelanggan
  .getRange(rowPelanggan, 2, 1, 6)
  .setValues([[
    nama,
    noHP,
    tanggalLahir,
    alamat,
    now,
    "AKTIF"
  ]]);

  SpreadsheetApp.flush();

  // =========================
  // AMBIL ID PELANGGAN
  // HASIL ARRAYFORMULA
  // =========================
  const idPelanggan = pelanggan
    .getRange(rowPelanggan, 1)
    .getDisplayValue();

  if (!idPelanggan) {
    throw new Error(
      "Data pelanggan sudah ditulis, tetapi IDPelanggan tidak terbentuk. Periksa ARRAYFORMULA di " +
      CONFIG.SHEET.PELANGGAN + "!A2."
    );
  }

  // =========================
  // SIMPAN MASTER KENDARAAN
  //
  // B IDPelanggan sebenarnya
  // sudah ARRAYFORMULA dari NamaPelanggan.
  //
  // C NamaPelanggan
  // D PlatNomor
  // E Merk
  // F Model
  // G Tahun
  // H Warna
  //
  // A dan B TIDAK DISENTUH
  // =========================
  kendaraan
    .getRange(rowKendaraan, 3, 1, 6)
    .setValues([[
      nama,
      plat,
      merk,
      model,
      tahun,
      warna
    ]]);

  SpreadsheetApp.flush();

  // =========================
  // CEK ID KENDARAAN
  // =========================
  const idKendaraan = kendaraan
    .getRange(rowKendaraan, 1)
    .getDisplayValue();

  if (!idKendaraan) {
    throw new Error(
      "Kendaraan tersimpan, tetapi IDKendaraan tidak terbentuk. Periksa ARRAYFORMULA di " +
      CONFIG.SHEET.VEHICLE + "!A2."
    );
  }

  // =========================
// PILIH OTOMATIS DI POS
// =========================

// Pilih pelanggan baru
pos.getRange("B4").setValue(nama);

SpreadsheetApp.flush();

// Beri waktu helper/dropdown kendaraan update
Utilities.sleep(500);

SpreadsheetApp.flush();

// Ambil cell kendaraan
const cellKendaraan = pos.getRange("E4");

// Simpan data validation
const validation = cellKendaraan.getDataValidation();

// Hapus validation sementara
cellKendaraan.clearDataValidations();

// Masukkan plat kendaraan baru
cellKendaraan.setValue(plat);

// Pasang kembali validation
if (validation) {
  cellKendaraan.setDataValidation(validation);
}

SpreadsheetApp.flush();

return {
  sukses: true,
  nama: nama,
  plat: plat,
  idPelanggan: idPelanggan,
  idKendaraan: idKendaraan
};

} 



/**
 * ============================================
 * FORM KENDARAAN - MASTER MERK / MODEL
 * ============================================
 */

function getMasterMerkKendaraan() {

  return MerkService.getAll();

}


function getMasterModelKendaraan(merkId) {

  const models =
    ModelService.getByMerkId(
      merkId
    );

  /*
   * API khusus untuk HTML FormKendaraan.
   *
   * Jangan kirim createdAt / updatedAt
   * karena field tersebut berasal dari
   * Google Sheets sebagai Date object.
   *
   * Form hanya membutuhkan:
   * - id
   * - merkId
   * - nama
   * - status
   */

  return models.map(function(model) {

    return {

      id:
        String(
          model.id || ""
        ).trim(),

      merkId:
        String(
          model.merkId || ""
        ).trim(),

      nama:
        String(
          model.nama || ""
        ).trim(),

      status:
        String(
          model.status || ""
        ).trim()

    };

  });

}



/**
 * ============================================
 * KENDARAAN BARU DARI WORK ORDER
 * ============================================
 */

function bukaFormKendaraanDariWorkOrder(customerId){

  customerId =
    String(customerId || "").trim();

  if(!customerId){

    throw new Error(
      "Customer ID wajib tersedia."
    );

  }

  if(
    !CustomerRepository.exists(
      customerId
    )
  ){

    throw new Error(
      "Customer tidak ditemukan : " +
      customerId
    );

  }

  PropertiesService
    .getUserProperties()
    .setProperty(
      "FORM_KENDARAAN_SOURCE",
      "WORK_ORDER"
    );

  PropertiesService
    .getUserProperties()
    .setProperty(
      "PENDING_WORK_ORDER_VEHICLE",
      JSON.stringify({
        customerId : customerId
      })
    );

  const html =
    HtmlService
      .createHtmlOutputFromFile(
        "FormKendaraan"
      )
      .setWidth(480)
      .setHeight(650);

  SpreadsheetApp
  .getUi()
  .showModelessDialog(
    html,
    "Tambah Kendaraan"
  );

}


function getPendingWorkOrderVehicle(){

  const properties =
    PropertiesService
      .getUserProperties();

  const raw =
    properties.getProperty(
      "PENDING_WORK_ORDER_VEHICLE"
    );

  if(!raw){

    return null;

  }

  properties.deleteProperty(
    "PENDING_WORK_ORDER_VEHICLE"
  );

  return JSON.parse(raw);

}


/**
 * ============================================
 * SIMPAN HASIL KENDARAAN BARU
 * UNTUK WORK ORDER
 * ============================================
 */

function setPendingWorkOrderVehicle(result){

  if(!result){

    throw new Error(
      "Hasil kendaraan baru tidak tersedia."
    );

  }

  const customerId =
    String(
      result.customerId || ""
    ).trim();

  const vehicleId =
    String(
      result.idKendaraan ||
      result.vehicleId ||
      ""
    ).trim();

  if(!customerId){

    throw new Error(
      "Customer ID kendaraan baru tidak tersedia."
    );

  }

  if(!vehicleId){

    throw new Error(
      "Vehicle ID kendaraan baru tidak tersedia."
    );

  }

  PropertiesService
    .getUserProperties()
    .setProperty(

      "PENDING_WORK_ORDER_VEHICLE",

      JSON.stringify({

        customerId :
          customerId,

        vehicleId :
          vehicleId,

        plat :
          result.plat || "",

        merk :
          result.merk || "",

        model :
          result.model || ""

      })

    );

  Logger.log(
    "[PENDING WO VEHICLE] " +
    customerId +
    " | " +
    vehicleId +
    " | " +
    result.plat
  );

  return true;

}


function bukaFormKendaraan() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const pos = ss.getSheetByName(CONFIG.SHEET.POS);

  const namaPelanggan = String(
    pos.getRange("B4").getValue()
  ).trim();

  // Pelanggan harus dipilih dulu
  if (!namaPelanggan) {
    SpreadsheetApp.getUi().alert(
      "Pilih pelanggan terlebih dahulu di POS."
    );
    return;
  }

  const html = HtmlService
    .createHtmlOutputFromFile("FormKendaraan")
    .setWidth(480)
    .setHeight(520);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Tambah Kendaraan - " + namaPelanggan
  );
}


function simpanKendaraanBaru(data) {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const pos =
    ss.getSheetByName(
      CONFIG.SHEET.POS
    );

  data =
    data || {};

  // ============================================
  // 1. RESOLVE CUSTOMER
  //
  // WORK ORDER V2:
  //   customerId dikirim langsung dari FormWorkOrder
  //
  // LEGACY:
  //   sementara masih menggunakan 10_POS!B4
  // ============================================

  let customerId =
    String(
      data.customerId || ""
    ).trim();

  let namaPelanggan = "";

  if(customerId){

    const customer =
      CustomerRepository.findById(
        customerId
      );

    if(!customer){

      throw new Error(
        "Customer tidak ditemukan : " +
        customerId
      );

    }

    namaPelanggan =
      String(
        customer[COL_PELANGGAN.NAMA] || ""
      ).trim();

  } else {

    namaPelanggan =
      String(
        pos.getRange("B4").getValue()
      ).trim();

    if(!namaPelanggan){

      throw new Error(
        "Pelanggan belum dipilih."
      );

    }

    const customers =
      CustomerRepository.findByName(
        namaPelanggan
      );

    if(
      !customers ||
      customers.length === 0
    ){

      throw new Error(
        "Customer tidak ditemukan : " +
        namaPelanggan
      );

    }

    if(customers.length > 1){

      throw new Error(
        "Nama Customer tidak unik : " +
        namaPelanggan +
        ". Gunakan Customer ID."
      );

    }

    customerId =
      String(
        customers[0][COL_PELANGGAN.ID] || ""
      ).trim();

  }

  // ============================================
  // 2. NORMALISASI INPUT
  // ============================================

  data = data || {};

  const plat =
    String(
      data.plat || ""
    )
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();

  const merkNama =
    String(
      data.merk || ""
    ).trim();

  const modelNama =
    String(
      data.model || ""
    ).trim();

  const tahun =
    String(
      data.tahun || ""
    ).trim();

  const warna =
    String(
      data.warna || ""
    ).trim();


  // ============================================
  // 3. VALIDASI INPUT DASAR
  // ============================================

  if (!plat) {

    throw new Error(
      "Plat nomor wajib diisi."
    );

  }

  if (!merkNama) {

    throw new Error(
      "Merk kendaraan wajib dipilih."
    );

  }

  if (!modelNama) {

    throw new Error(
      "Model kendaraan wajib dipilih."
    );

  }


  // ============================================
  // 5. RESOLVE MERK → MERK ID
  // ============================================

  const daftarMerk =
    MerkRepository.findAll();

  const merk =
    daftarMerk.find(function(item) {

      return String(
        item.nama || ""
      )
      .trim()
      .toLowerCase() ===
      merkNama.toLowerCase();

    });


  if (!merk) {

    throw new Error(
      "Merk tidak ditemukan di MasterMerk : " +
      merkNama
    );

  }

  const merkId =
    String(
      merk.id || ""
    ).trim();

  if (!merkId) {

    throw new Error(
      "Merk ID tidak terbentuk untuk : " +
      merkNama
    );

  }


  // ============================================
  // 6. RESOLVE MODEL → MODEL ID
  // ============================================

  const daftarModel =
    ModelRepository.findAll();

  const model =
    daftarModel.find(function(item) {

      return (
        String(
          item.merkId || ""
        ).trim() === merkId
      ) &&
      String(
        item.nama || ""
      )
      .trim()
      .toLowerCase() ===
      modelNama.toLowerCase();

    });


  if (!model) {

    throw new Error(
      "Model " +
      modelNama +
      " tidak ditemukan untuk Merk " +
      merkNama +
      "."
    );

  }

  const modelId =
    String(
      model.id || ""
    ).trim();

  if (!modelId) {

    throw new Error(
      "Model ID tidak terbentuk untuk : " +
      modelNama
    );

  }


  // ============================================
  // 7. CREATE VEHICLE MELALUI SERVICE
  // ============================================

  const result =
    VehicleService.createVehicle({

      customerId :
        customerId,

      noPolisi :
        plat,

      merkId :
        merkId,

      modelId :
        modelId,

      tahun :
        tahun,

      warna :
        warna,

      noMesin :
        data.noMesin || "",

      noRangka :
        data.noRangka || "",

      lastKilometer :
        Number(
          data.lastKilometer || 0
        ),

      status :
        VehicleStatus.AKTIF,

      catatan :
        data.catatan || ""

    });


  // ============================================
  // 8. VALIDASI RESULT
  // ============================================

  if (
    !result ||
    !result.vehicleId
  ) {

    throw new Error(
      "Kendaraan gagal menghasilkan Vehicle ID."
    );

  }


  // ============================================
  // 9. PILIH KENDARAAN BARU DI POS
  // ============================================

  SpreadsheetApp.flush();

  Utilities.sleep(300);

  SpreadsheetApp.flush();

  const cellKendaraan =
    pos.getRange("E4");

  const validation =
    cellKendaraan.getDataValidation();

  cellKendaraan.clearDataValidations();

  cellKendaraan.setValue(plat);

  if (validation) {

    cellKendaraan.setDataValidation(
      validation
    );

  }

  SpreadsheetApp.flush();


  // ============================================
  // 10. RETURN
  // ============================================

  return {

    sukses :
      true,

    pelanggan :
      namaPelanggan,

    customerId :
      customerId,

    plat :
      plat,

    merk :
      merk.nama,

    merkId :
      merkId,

    model :
      model.nama,

    modelId :
      modelId,

    idKendaraan :
      result.vehicleId

  };

}

function generateDetailKomisi() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const laporan = ss.getSheetByName(CONFIG.SHEET.KOMISI_MEKANIK);
  const penjualan = ss.getSheetByName(CONFIG.SHEET.PENJUALAN);
  const detail = ss.getSheetByName(CONFIG.SHEET.DETAIL_PENJUALAN);

  // ==========================================
  // AMBIL FILTER
  // ==========================================
  const tanggalMulai = laporan.getRange("B3").getValue();
  const tanggalAkhir = laporan.getRange("E3").getValue();
  const namaMekanik = String(
    laporan.getRange("B12").getValue()
  ).trim();

  if (!(tanggalMulai instanceof Date)) {
    ui.alert("Tanggal Mulai B3 tidak valid.");
    return;
  }

  if (!(tanggalAkhir instanceof Date)) {
    ui.alert("Tanggal Akhir E3 tidak valid.");
    return;
  }

  if (!namaMekanik) {
    ui.alert("Pilih mekanik terlebih dahulu di B12.");
    return;
  }

  // Supaya perbandingan tanggal aman
  const mulai = new Date(tanggalMulai);
  mulai.setHours(0, 0, 0, 0);

  const akhir = new Date(tanggalAkhir);
  akhir.setHours(23, 59, 59, 999);


  // ==========================================
  // BACA DATA PENJUALAN
  // ==========================================
  if (penjualan.getLastRow() < 2) {
    ui.alert("Belum ada data penjualan.");
    return;
  }

  const dataPenjualan = penjualan
    .getRange(
      2,
      1,
      penjualan.getLastRow() - 1,
      penjualan.getLastColumn()
    )
    .getValues();


  // ==========================================
  // BUAT MAP:
  // NoTransaksi -> Tanggal
  //
  // 11_Penjualan:
  // A = NoTransaksi
  // B = Tanggal
  // ==========================================
  const mapTanggal = {};

  dataPenjualan.forEach(row => {

    const noTransaksi = String(row[0]).trim();
    const tanggal = row[1];

    if (noTransaksi) {
      mapTanggal[noTransaksi] = tanggal;
    }

  });


  // ==========================================
  // BACA DETAIL PENJUALAN
  // ==========================================
  if (detail.getLastRow() < 2) {

    bersihkanDetailKomisi_(laporan);

    ui.alert("Belum ada detail penjualan.");
    return;
  }

  const dataDetail = detail
    .getRange(
      2,
      1,
      detail.getLastRow() - 1,
      detail.getLastColumn()
    )
    .getValues();


  // ==========================================
  // FILTER DETAIL KOMISI
  //
  // 12_DetailPenjualan:
  //
  // B = NoTransaksi
  // C = Tipe
  // E = NamaItem
  // F = Qty
  // I = Subtotal
  // J = Mekanik
  // K = KomisiMekanik
  // ==========================================
  const hasil = [];

  dataDetail.forEach(row => {

    const noTransaksi = String(row[1]).trim();
    const tipe = String(row[2]).trim().toUpperCase();
    const namaJasa = row[4];

    const qty = Number(row[5]) || 0;
    const nilaiJasa = Number(row[8]) || 0;

    const mekanik = String(row[9]).trim();
    const komisi = Number(row[10]) || 0;

    // Hanya JASA
    if (tipe !== "JASA") return;

    // Hanya mekanik yang dipilih
    if (mekanik !== namaMekanik) return;

    // Cari tanggal transaksi
    const tanggal = mapTanggal[noTransaksi];

    if (!(tanggal instanceof Date)) return;

    const tgl = new Date(tanggal);
    tgl.setHours(12, 0, 0, 0);

    // Filter periode
    if (tgl < mulai || tgl > akhir) return;


    hasil.push([
      tanggal,       // A Tanggal
      noTransaksi,   // B NoTransaksi
      namaJasa,      // C Nama Jasa
      mekanik,       // D Mekanik
      qty,           // E Qty
      nilaiJasa,     // F Nilai Jasa
      komisi         // G Komisi
    ]);

  });


  // ==========================================
  // URUTKAN BERDASARKAN TANGGAL
  // ==========================================
  hasil.sort((a, b) => {

    const tanggalA = new Date(a[0]);
    const tanggalB = new Date(b[0]);

    return tanggalA - tanggalB;

  });


  // ==========================================
  // HAPUS LAPORAN LAMA
  // ==========================================
  bersihkanDetailKomisi_(laporan);


  // ==========================================
  // JIKA TIDAK ADA DATA
  // ==========================================
  if (hasil.length === 0) {

    laporan.getRange("A15").setValue(
      "Tidak ada transaksi jasa untuk periode dan mekanik tersebut."
    );

    ui.alert(
      "Tidak ada data komisi untuk " +
      namaMekanik +
      " pada periode tersebut."
    );

    return;
  }


  // ==========================================
  // TULIS LAPORAN
  // ==========================================
  laporan
    .getRange(
      15,
      1,
      hasil.length,
      7
    )
    .setValues(hasil);


  // ==========================================
  // FORMAT
  // ==========================================

  // Tanggal
  laporan
    .getRange(15, 1, hasil.length, 1)
    .setNumberFormat("dd/MM/yyyy");

  // Qty
  laporan
    .getRange(15, 5, hasil.length, 1)
    .setNumberFormat("0");

  // Nilai Jasa + Komisi
  laporan
    .getRange(15, 6, hasil.length, 2)
    .setNumberFormat('"Rp" #,##0');


  SpreadsheetApp.flush();


  // ==========================================
  // SELESAI
  // ==========================================
  const totalKomisi = hasil.reduce(
    (total, row) => total + Number(row[6] || 0),
    0
  );

  ui.alert(
    "Laporan komisi berhasil dibuat.\n\n" +
    "Mekanik: " + namaMekanik +
    "\nJumlah pekerjaan: " + hasil.length +
    "\nTotal komisi: Rp" +
    totalKomisi.toLocaleString("id-ID")
  );
}


// ==========================================
// HELPER MEMBERSIHKAN DETAIL
// ==========================================
function bersihkanDetailKomisi_(sheet) {

  const lastRow = Math.max(sheet.getLastRow(), 15);

  sheet
    .getRange(
      15,
      1,
      lastRow - 14,
      7
    )
    .clearContent();
}


function bukaFormPembelian() {
  const html = HtmlService
    .createHtmlOutputFromFile("FormPembelian")
    .setWidth(500)
    .setHeight(620);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Pembelian / Stok Masuk"
  );
}


function getDaftarBarangPembelian() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const barang =
    ss.getSheetByName(
      CONFIG.SHEET.BARANG
    );

  if (
    barang.getLastRow() < 2
  ) {
    return [];
  }

  const data =
    barang
      .getRange(
        2,
        1,
        barang.getLastRow() - 1,
        barang.getLastColumn()
      )
      .getValues();

  return data

    .filter(row =>
      String(
        row[COL_BARANG.ID]
      ).trim() !== ""
    )

    .map(row => ({

      // A - ID
      // ID saat ini berfungsi sebagai KodeBarang
      kode:
        String(
          row[COL_BARANG.ID]
        ).trim(),

      // E - NamaBarang
      nama:
        String(
          row[COL_BARANG.NAMA]
        ).trim(),

      // D - NamaPendek
      namaPendek:
        String(
          row[COL_BARANG.NAMAPENDEK]
        ).trim(),

      // C - KataKunci
      kataKunci:
        String(
          row[COL_BARANG.KATAKUNCI]
        ).trim(),

      // I - Kendaraan
      // Ditampilkan di UI sebagai
      // Kompatibilitas / Model Motor
      kompatibilitas:
        String(
          row[COL_BARANG.KENDARAAN]
        ).trim(),

      // K - HargaModal
      hargaModal:
        Number(
          row[COL_BARANG.HARGAMODAL]
        ) || 0,

      // M - HargaJual
      hargaJual:
        Number(
          row[COL_BARANG.HARGAJUAL]
        ) || 0,

      // N - Stok
      stok:
        Number(
          row[COL_BARANG.STOK]
        ) || 0

    }));

}

function testGetDaftarBarangPembelianV2() {

  const data =
    getDaftarBarangPembelian();

  Logger.log(
    "[SEARCH BARANG V2] TOTAL = " +
    data.length
  );

  if (data.length === 0) {

    Logger.log(
      "[SEARCH BARANG V2] MasterBarang kosong."
    );

    return;
  }

  Logger.log(
    "[SEARCH BARANG V2] SAMPLE:"
  );

  Logger.log(
    JSON.stringify(
      data.slice(0, 5),
      null,
      2
    )
  );

}


function simpanPembelian(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const pembelian = ss.getSheetByName("13_Pembelian");
  const masterBarang = ss.getSheetByName(CONFIG.SHEET.BARANG);
  const stokSheet = ss.getSheetByName(CONFIG.SHEET.STOK);

  // ==========================================
  // INPUT
  // ==========================================
  const supplier = String(data.supplier || "").trim();
  const noFaktur = String(data.noFaktur || "").trim();
  const kodeBarang = String(data.kodeBarang || "").trim();
  const qty = Number(data.qty) || 0;
  const hargaBeli = Number(data.hargaBeli) || 0;
  const admin = String(data.admin || "").trim();
  const keterangan = String(data.keterangan || "").trim();

  if (!supplier) {
    throw new Error("Supplier wajib diisi.");
  }

  if (!kodeBarang) {
    throw new Error("Barang wajib dipilih.");
  }

  if (qty <= 0) {
    throw new Error("Qty harus lebih dari 0.");
  }

  if (hargaBeli <= 0) {
    throw new Error("Harga beli harus lebih dari 0.");
  }

  if (!admin) {
    throw new Error("Admin wajib diisi.");
  }

  // ==========================================
  // CARI BARANG
  // ==========================================
  const dataBarang = masterBarang
    .getRange(
      2,
      1,
      masterBarang.getLastRow() - 1,
      masterBarang.getLastColumn()
    )
    .getValues();

  const indexBarang = dataBarang.findIndex(row =>
    String(row[2]).trim() === kodeBarang
  );

  if (indexBarang === -1) {
    throw new Error(
      "Kode barang " + kodeBarang +
      " tidak ditemukan di MasterBarang."
    );
  }

  const barang = dataBarang[indexBarang];
  const rowMaster = indexBarang + 2;

  const namaBarang = String(barang[4]).trim();

  // L = HargaModal
  const modalLama = Number(barang[11]) || 0;

  // O = Stok
  const stokAwal = Number(barang[14]) || 0;

  // ==========================================
  // HITUNG STOK & MOVING AVERAGE
  // ==========================================
  const stokAkhir = stokAwal + qty;

  let modalBaru;

  if (stokAwal <= 0) {
    modalBaru = hargaBeli;
  } else {
    modalBaru =
      (
        (stokAwal * modalLama) +
        (qty * hargaBeli)
      ) / stokAkhir;
  }

  const subtotal = qty * hargaBeli;

  // ==========================================
  // BUAT NO PEMBELIAN
  // ==========================================
  const now = new Date();

  const tz = ss.getSpreadsheetTimeZone();

  const kodeTanggal = Utilities.formatDate(
    now,
    tz,
    "yyMMdd"
  );

  let urutan = 1;

  if (pembelian.getLastRow() >= 2) {
    const daftarNo = pembelian
      .getRange(
        2,
        1,
        pembelian.getLastRow() - 1,
        1
      )
      .getDisplayValues()
      .flat();

    const prefix = "PB-" + kodeTanggal + "-";

    const nomorHariIni = daftarNo.filter(no =>
      String(no).startsWith(prefix)
    );

    if (nomorHariIni.length > 0) {
      const nomor = nomorHariIni
        .map(no =>
          Number(String(no).split("-").pop()) || 0
        );

      urutan = Math.max(...nomor) + 1;
    }
  }

  const noPembelian =
    "PB-" +
    kodeTanggal +
    "-" +
    String(urutan).padStart(4, "0");

  // ==========================================
  // BUAT ID MUTASI
  // ==========================================
  const nomorMutasi = Math.max(
    1,
    stokSheet.getLastRow()
  );

  const idMutasi =
    "MTS" +
    String(nomorMutasi).padStart(6, "0");

  // ==========================================
  // SIMPAN PEMBELIAN
  // ==========================================
  pembelian.appendRow([
    noPembelian,      // A
    now,              // B Tanggal
    supplier,         // C
    noFaktur,         // D
    kodeBarang,       // E
    namaBarang,       // F
    qty,              // G
    hargaBeli,        // H
    subtotal,         // I
    admin,            // J
    keterangan,       // K
    now               // L CreatedAt
  ]);

  // ==========================================
  // UPDATE MASTER BARANG
  // ==========================================

  // HargaModal = L = kolom 12
  masterBarang
    .getRange(rowMaster, 12)
    .setValue(modalBaru);

  // Stok = O = kolom 15
  masterBarang
    .getRange(rowMaster, 15)
    .setValue(stokAkhir);

  // ==========================================
  // MUTASI STOK
  // ==========================================
  stokSheet.appendRow([
    idMutasi,          // A IDMutasi
    now,               // B Tanggal
    now,               // C Jam
    kodeBarang,        // D
    namaBarang,        // E
    "PEMBELIAN",       // F
    noPembelian,       // G Referensi
    stokAwal,          // H
    qty,               // I QtyMasuk
    0,                 // J QtyKeluar
    stokAkhir,         // K
    keterangan || "Pembelian " + supplier,
    admin,             // M
    now                // N
  ]);

  SpreadsheetApp.flush();

  return {
    sukses: true,
    noPembelian: noPembelian,
    namaBarang: namaBarang,
    qty: qty,
    stokAwal: stokAwal,
    stokAkhir: stokAkhir,
    modalLama: modalLama,
    modalBaru: modalBaru,
    subtotal: subtotal
  };
}


function simpanPembelianMulti(data) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const pembelian =
    ss.getSheetByName(CONFIG.SHEET.PEMBELIAN_LEGACY);

  const masterBarang =
    ss.getSheetByName(CONFIG.SHEET.BARANG);

  const stokSheet =
    ss.getSheetByName(CONFIG.SHEET.STOK);


  // ==========================================
  // VALIDASI DATA UTAMA
  // ==========================================

  const supplier =
    String(data.supplier || "").trim();

  const noFaktur =
    String(data.noFaktur || "").trim();

  const admin =
    String(data.admin || "").trim();

  const keterangan =
    String(data.keterangan || "").trim();

  const items =
    Array.isArray(data.items)
      ? data.items
      : [];


  if (!supplier) {
    throw new Error("Supplier wajib diisi.");
  }

  if (!admin) {
    throw new Error("Admin wajib diisi.");
  }

  if (items.length === 0) {
    throw new Error(
      "Keranjang pembelian masih kosong."
    );
  }


  // ==========================================
  // LOAD MASTER BARANG
  // ==========================================

  if (masterBarang.getLastRow() < 2) {
    throw new Error(
      "MasterBarang masih kosong."
    );
  }


  const dataBarang =
    masterBarang
      .getRange(
        2,
        1,
        masterBarang.getLastRow() - 1,
        masterBarang.getLastColumn()
      )
      .getValues();


  // ==========================================
  // VALIDASI SEMUA ITEM DULU
  //
  // Belum ada data yang ditulis pada tahap ini.
  // ==========================================

  const prosesItems = [];


  items.forEach(function(item) {

    const kodeBarang =
      String(item.kodeBarang || "").trim();

    const qty =
      Number(item.qty) || 0;

    const hargaBeli =
      Number(item.hargaBeli) || 0;


    if (!kodeBarang) {
      throw new Error(
        "Ada item tanpa KodeBarang."
      );
    }

    if (qty <= 0) {
      throw new Error(
        "Qty " + kodeBarang +
        " tidak valid."
      );
    }

    if (hargaBeli <= 0) {
      throw new Error(
        "Harga beli " + kodeBarang +
        " tidak valid."
      );
    }


    const indexBarang =
      dataBarang.findIndex(row =>
        String(row[2]).trim() === kodeBarang
      );


    if (indexBarang === -1) {
      throw new Error(
        "Barang " + kodeBarang +
        " tidak ditemukan di MasterBarang."
      );
    }


    const row =
      dataBarang[indexBarang];

    const rowMaster =
      indexBarang + 2;


    const namaBarang =
      String(row[4]).trim();

    // L = HargaModal
    const modalLama =
      Number(row[11]) || 0;

    // O = Stok
    const stokAwal =
      Number(row[14]) || 0;


    const stokAkhir =
      stokAwal + qty;


    // ========================================
    // MOVING AVERAGE
    // ========================================

    let modalBaru;

    if (stokAwal <= 0) {

      modalBaru = hargaBeli;

    } else {

      modalBaru =
        (
          (stokAwal * modalLama) +
          (qty * hargaBeli)
        ) / stokAkhir;

    }


    prosesItems.push({

      kodeBarang: kodeBarang,

      namaBarang: namaBarang,

      qty: qty,

      hargaBeli: hargaBeli,

      subtotal:
        qty * hargaBeli,

      rowMaster: rowMaster,

      stokAwal: stokAwal,

      stokAkhir: stokAkhir,

      modalLama: modalLama,

      modalBaru: modalBaru

    });

  });


  // ==========================================
  // BUAT NOMOR PEMBELIAN
  // ==========================================

  const now =
    new Date();

  const tz =
    ss.getSpreadsheetTimeZone();


  const kodeTanggal =
    Utilities.formatDate(
      now,
      tz,
      "yyMMdd"
    );


  const prefix =
    "PB-" +
    kodeTanggal +
    "-";


  let urutan = 1;


  if (pembelian.getLastRow() >= 2) {

    const daftarNo =
      pembelian
        .getRange(
          2,
          1,
          pembelian.getLastRow() - 1,
          1
        )
        .getDisplayValues()
        .flat();


    const nomorHariIni =
      daftarNo
        .filter(no =>
          String(no).startsWith(prefix)
        )
        .map(no =>
          Number(
            String(no).split("-").pop()
          ) || 0
        );


    if (nomorHariIni.length > 0) {

      urutan =
        Math.max(...nomorHariIni) + 1;

    }

  }


  const noPembelian =
    prefix +
    String(urutan).padStart(4, "0");


  // ==========================================
  // SIAPKAN DATA PEMBELIAN
  // ==========================================

  const rowsPembelian =
    prosesItems.map(item => [

      noPembelian,          // A
      now,                  // B Tanggal
      supplier,             // C
      noFaktur,             // D
      item.kodeBarang,      // E
      item.namaBarang,      // F
      item.qty,             // G
      item.hargaBeli,       // H
      item.subtotal,        // I
      admin,                // J
      keterangan,           // K
      now                   // L CreatedAt

    ]);


  // ==========================================
  // SIAPKAN DATA MUTASI
  // ==========================================

  const rowsMutasi = [];


  prosesItems.forEach(function(item, index) {

    const nomorMutasi =
      stokSheet.getLastRow() +
      index;


    const idMutasi =
      "MTS" +
      String(
        Math.max(1, nomorMutasi)
      ).padStart(6, "0");


    rowsMutasi.push([

      idMutasi,                 // A IDMutasi
      now,                      // B Tanggal
      now,                      // C Jam
      item.kodeBarang,          // D
      item.namaBarang,          // E
      "PEMBELIAN",              // F
      noPembelian,              // G Referensi
      item.stokAwal,            // H
      item.qty,                 // I QtyMasuk
      0,                        // J QtyKeluar
      item.stokAkhir,           // K
      keterangan ||
        "Pembelian " + supplier,// L
      admin,                    // M
      now                       // N

    ]);

  });


  // ==========================================
  // TULIS 13_PEMBELIAN
  // SEKALIGUS
  // ==========================================

  const rowPembelian =
    Math.max(
      pembelian.getLastRow() + 1,
      2
    );


  pembelian
    .getRange(
      rowPembelian,
      1,
      rowsPembelian.length,
      12
    )
    .setValues(rowsPembelian);


  // ==========================================
  // UPDATE MASTER BARANG
  // ==========================================

  prosesItems.forEach(function(item) {

    // L = HargaModal
    masterBarang
      .getRange(
        item.rowMaster,
        12
      )
      .setValue(
        item.modalBaru
      );


    // O = Stok
    masterBarang
      .getRange(
        item.rowMaster,
        15
      )
      .setValue(
        item.stokAkhir
      );

  });


  // ==========================================
  // TULIS MUTASI STOK
  // ==========================================

  const rowMutasi =
    Math.max(
      stokSheet.getLastRow() + 1,
      2
    );


  stokSheet
    .getRange(
      rowMutasi,
      1,
      rowsMutasi.length,
      14
    )
    .setValues(rowsMutasi);


  SpreadsheetApp.flush();


  // ==========================================
  // TOTAL PEMBELIAN
  // ==========================================

  const total =
    prosesItems.reduce(
      (sum, item) =>
        sum + item.subtotal,
      0
    );


  return {

    sukses: true,

    noPembelian:
      noPembelian,

    jumlahItem:
      prosesItems.length,

    total:
      total

  };
}


function getDaftarSupplier() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET.SUPPLIER);

  if (!sheet) {
    throw new Error(
      "Sheet " + CONFIG.SHEET.SUPPLIER + " tidak ditemukan."
    );
  }

  if (sheet.getLastRow() < 2) {
    return [];
  }

  const data = sheet
    .getRange(
      2,
      1,
      sheet.getLastRow() - 1,
      8
    )
    .getValues();

  return data
    .filter(row => {

      const nama = String(row[1]).trim();
      const status = String(row[6]).trim().toUpperCase();

      // Supplier tanpa status tetap dianggap aktif
      return nama && status !== "NONAKTIF";

    })
    .map(row => ({

      id: String(row[0]).trim(),
      nama: String(row[1]).trim(),
      noHP: String(row[2]).trim(),
      sales: String(row[4]).trim()

    }));
}

function simpanSupplierBaru(data) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET.SUPPLIER);

  if (!sheet) {
    throw new Error(
      "Sheet " + CONFIG.SHEET.SUPPLIER + " tidak ditemukan."
    );
  }

  const nama = String(data.nama || "").trim();
  const noHP = String(data.noHP || "").trim();
  const alamat = String(data.alamat || "").trim();
  const sales = String(data.sales || "").trim();
  const noHPSales = String(data.noHPSales || "").trim();
  const catatan = String(data.catatan || "").trim();

  if (!nama) {
    throw new Error("Nama Supplier wajib diisi.");
  }

  // Cari baris kosong berdasarkan kolom B = NamaSupplier
  let rowBaru = 2;

  while (sheet.getRange(rowBaru, 2).getValue() !== "") {
    rowBaru++;
  }

  // Cek nama supplier duplikat
  if (rowBaru > 2) {

    const daftarNama = sheet
      .getRange(2, 2, rowBaru - 2, 1)
      .getDisplayValues()
      .flat()
      .map(v => String(v).trim().toLowerCase());

    if (daftarNama.includes(nama.toLowerCase())) {
      throw new Error(
        "Supplier " + nama + " sudah terdaftar."
      );
    }
  }

  // A = IDSupplier dikelola ARRAYFORMULA
  // B:H = data supplier
  sheet
    .getRange(rowBaru, 2, 1, 7)
    .setValues([[
      nama,        // B NamaSupplier
      noHP,        // C NoHP
      alamat,      // D Alamat
      sales,       // E Sales
      noHPSales,   // F NoHPSales
      "AKTIF",     // G Status
      catatan      // H Catatan
    ]]);

  SpreadsheetApp.flush();

  const idSupplier = sheet
    .getRange(rowBaru, 1)
    .getDisplayValue();

  if (!idSupplier) {
    throw new Error(
      "Supplier tersimpan tetapi IDSupplier tidak terbentuk."
    );
  }

  return {
    sukses: true,
    id: idSupplier,
    nama: nama
  };
}

function cetakStrukTerakhir() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const penjualan = ss.getSheetByName(CONFIG.SHEET.PENJUALAN);

  if (penjualan.getLastRow() < 2) {
    SpreadsheetApp.getUi().alert("Belum ada transaksi.");
    return;
  }

  // Ambil NoTransaksi terakhir
  const noTransaksi = String(
    penjualan.getRange(
      penjualan.getLastRow(),
      1
    ).getDisplayValue()
  ).trim();

  if (!noTransaksi) {
    SpreadsheetApp.getUi().alert(
      "NoTransaksi terakhir tidak ditemukan."
    );
    return;
  }

  const template =
    HtmlService.createTemplateFromFile("Struk58mm");

  template.noTransaksi = noTransaksi;

  const html = template
    .evaluate()
    .setWidth(400)
    .setHeight(650);

  SpreadsheetApp.getUi().showModalDialog(
    html,
    "Struk " + noTransaksi
  );
}


function getDataStruk(noTransaksi) {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const penjualan =
    ss.getSheetByName(CONFIG.SHEET.PENJUALAN);

  const detail =
    ss.getSheetByName(CONFIG.SHEET.DETAIL_PENJUALAN);

  // ==========================================
  // CARI TRANSAKSI
  // ==========================================

  const dataPenjualan = penjualan
    .getRange(
      2,
      1,
      penjualan.getLastRow() - 1,
      penjualan.getLastColumn()
    )
    .getValues();

  const trx = dataPenjualan.find(row =>
    String(row[0]).trim() === String(noTransaksi).trim()
  );

  if (!trx) {
    throw new Error(
      "Transaksi " + noTransaksi + " tidak ditemukan."
    );
  }


  // ==========================================
  // STRUKTUR 11_PENJUALAN
  //
  // Sesuaikan indeks bila header berbeda:
  //
  // A NoTransaksi
  // B Tanggal
  // C IDPelanggan
  // D NamaPelanggan
  // E IDKendaraan
  // F PlatNomor
  // G Mekanik
  // H Admin
  // I Subtotal
  // J DiskonNota
  // K GrandTotal
  // L Bayar
  // M Kembalian
  // N MetodeBayar
  // O TotalKomisi
  // ==========================================

  const tanggal = trx[1];
const jam = trx[2];

  // E = NamaPelanggan
const namaPelanggan =
  String(trx[4] || "").trim();

// G = PlatNomor
const platNomor =
  String(trx[6] || "").trim();

// H = MekanikUtama
const mekanik =
  String(trx[7] || "").trim();

// O = Admin
const admin =
  String(trx[14] || "").trim();

// I = Subtotal
const subtotal =
  Number(trx[8]) || 0;

// J = DiskonNota
const diskonNota =
  Number(trx[9]) || 0;

// K = GrandTotal
const grandTotal =
  Number(trx[10]) || 0;

// L = Bayar
const bayar =
  Number(trx[11]) || 0;

// M = Kembalian
const kembalian =
  Number(trx[12]) || 0;

// N = MetodeBayar
const metodeBayar =
  String(trx[13] || "").trim();

  // ==========================================
  // DETAIL TRANSAKSI
  // ==========================================

  const dataDetail = detail
    .getRange(
      2,
      1,
      detail.getLastRow() - 1,
      detail.getLastColumn()
    )
    .getValues();


  const items = dataDetail

    .filter(row =>
      String(row[1]).trim() === String(noTransaksi).trim()
    )

    .map(row => ({

      // C = Tipe
      tipe:
        String(row[2] || "").trim(),

      // E = NamaItem
      nama:
        String(row[4] || "").trim(),

      // F = Qty
      qty:
        Number(row[5]) || 0,

      // G = Harga
      harga:
        Number(row[6]) || 0,

      // H = DiskonItem
      diskon:
        Number(row[7]) || 0,

      // I = Subtotal
      subtotal:
        Number(row[8]) || 0,

      // J = Mekanik
      mekanik:
        String(row[9] || "").trim()

    }));


  const timezone =
    ss.getSpreadsheetTimeZone();

  let tanggalText = "";

if (tanggal instanceof Date) {

  const tanggalFormat =
    Utilities.formatDate(
      tanggal,
      timezone,
      "dd/MM/yyyy"
    );

  let jamFormat = "";

  if (jam instanceof Date) {

    jamFormat =
      Utilities.formatDate(
        jam,
        timezone,
        "HH:mm"
      );

  } else {

    jamFormat =
      String(jam || "").trim();

  }

  tanggalText =
    tanggalFormat +
    (jamFormat ? " " + jamFormat : "");

} else {

  tanggalText =
    String(tanggal || "") +
    " " +
    String(jam || "");

}


  return {

    noTransaksi:
      noTransaksi,

    tanggal:
      tanggalText,

    pelanggan:
      namaPelanggan || "UMUM",

    plat:
      platNomor || "-",

    mekanik:
      mekanik || "-",

    admin:
      admin || "-",

    subtotal:
      subtotal,

    diskonNota:
      diskonNota,

    grandTotal:
      grandTotal,

    bayar:
      bayar,

    kembalian:
      kembalian,

    metodeBayar:
      metodeBayar || "-",

    items:
      items
  };
}

function cetakUlangStruk() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const sheet = ss.getActiveSheet();

  // Pastikan dijalankan dari sheet Penjualan yang configured.
  if (sheet.getName() !== CONFIG.SHEET.PENJUALAN) {
    ui.alert(
      "Silakan buka sheet " + CONFIG.SHEET.PENJUALAN +
      " dan pilih transaksi yang ingin dicetak."
    );
    return;
  }

  const range = sheet.getActiveRange();

  if (!range) {
    ui.alert("Pilih salah satu baris transaksi terlebih dahulu.");
    return;
  }

  const row = range.getRow();

  // Row 1 adalah header
  if (row < 2) {
    ui.alert("Pilih salah satu transaksi, bukan header.");
    return;
  }

  // A = NoTransaksi
  const noTransaksi = String(
    sheet.getRange(row, 1).getDisplayValue()
  ).trim();

  if (!noTransaksi) {
    ui.alert(
      "NoTransaksi pada baris tersebut tidak ditemukan."
    );
    return;
  }

  // Gunakan template struk yang sama
  const template =
    HtmlService.createTemplateFromFile("Struk58mm");

  template.noTransaksi = noTransaksi;

  const html = template
    .evaluate()
    .setWidth(400)
    .setHeight(650);

  ui.showModalDialog(
    html,
    "Copy Struk " + noTransaksi
  );
}


function auditSheetNames(){

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheets =
    ss.getSheets();

  Logger.log(
    "===== DAFTAR SHEET ====="
  );

  sheets.forEach(function(sh, index){

    Logger.log(
      (index + 1) +
      " | " +
      sh.getName()
    );

  });

}

function getMasterJasaWO(){

  const data =
    JasaRepository.findAll();

  return data
    .filter(function(row){

      return String(
        row[COL_JASA.ID] || ""
      ).trim() !== "";

    })
    .filter(function(row){

      return String(
        row[COL_JASA.STATUS] || ""
      )
      .trim()
      .toUpperCase() === "AKTIF";

    })
    .map(function(row){

      return {

        id:
          String(
            row[COL_JASA.ID] || ""
          ).trim(),

        nama:
          String(
            row[COL_JASA.NAMA] || ""
          ).trim(),

        harga:
          Number(
            row[COL_JASA.HARGA] || 0
          )

      };

    });

}

function testGetMasterJasaWO(){

  const result =
    getMasterJasaWO();

  Logger.log(
    "TOTAL JASA = " +
    result.length
  );

  Logger.log(
    JSON.stringify(result)
  );

}
