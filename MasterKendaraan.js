/**
 * =====================================================
 * SAKTI MOTO WMS
 * MASTER KENDARAAN
 * =====================================================
 */


/**
 * =====================================================
 * Cari kendaraan berdasarkan plat nomor
 * =====================================================
 */
function findKendaraanByPlat(platNomor) {

  const sh =
    getSheet_(
      SHEET.MASTER_KENDARAAN
    );

  if(
    sh.getLastRow() < 2
  ){

    return null;

  }

  const data =
    sh
      .getDataRange()
      .getDisplayValues();


  const keyword =
    String(
      platNomor || ""
    )
      .replace(/\s+/g, "")
      .toUpperCase();


  for(
    let i = 1;
    i < data.length;
    i++
  ){

    const row =
      data[i];


    /*
     * MASTER KENDARAAN:
     *
     * A = ID Kendaraan
     * B = ID Pelanggan
     * C = Nama Pelanggan
     * D = Plat Nomor
     * E = Merk
     * F = Model
     * G = Tahun
     * H = Warna
     * ...
     * K = Kilometer
     */

    const plat =
      String(
        row[3] || ""
      )
        .replace(/\s+/g, "")
        .toUpperCase();


    if(
      plat !== keyword
    ){

      continue;

    }

    const customer =
  CustomerRepository.findById(
    row[1]
  );


    return {

  idKendaraan :
    row[0],

  idPelanggan :
    row[1],

  nama :
    row[2],

  noHp :
    customer
      ? customer[COL_PELANGGAN.NOHP]
      : "",

  plat :
    row[3],

  merk :
    row[4],

  model :
    row[5],

  tahun :
    row[6],

  warna :
    row[7],

  kilometer :
    row[10]

};

  }


  return null;

}

/**
 * =====================================================
 * Smart Search Kendaraan
 *
 * Bisa mencari berdasarkan:
 * - Nomor Polisi
 * - Nama Pelanggan
 * - ID Pelanggan
 * =====================================================
 */
function searchKendaraan(keyword) {

  const sh =
    getSheet_(
      SHEET.MASTER_KENDARAAN
    );

  if(sh.getLastRow() < 2){

    return [];

  }


  const data =
    sh
      .getDataRange()
      .getDisplayValues();


  keyword =
    String(
      keyword || ""
    )
    .trim()
    .toUpperCase();


  if(keyword === ""){

    return [];

  }


  /**
   * ========================================
   * Ambil Master Pelanggan
   * ========================================
   */

  const pelanggan =
    CustomerRepository.findAll();


  /**
   * ========================================
   * Buat index customer
   *
   * ID Pelanggan → data pelanggan
   * ========================================
   */

  const customerMap = {};


  for(
    let i = 0;
    i < pelanggan.length;
    i++
  ){

    const customer =
      pelanggan[i];


    const customerId =
      String(
        customer[
          COL_PELANGGAN.ID
        ]
      ).trim();


    customerMap[
      customerId
    ] = {

      nama :
        customer[
          COL_PELANGGAN.NAMA
        ],

      nohp :
        customer[
          COL_PELANGGAN.NOHP
        ]

    };

  }


  /**
   * ========================================
   * HASIL SEARCH
   * ========================================
   */

  const hasil = [];


  for(
    let i = 1;
    i < data.length;
    i++
  ){

    const row =
      data[i];


    const idKendaraan =
      row[0];

    const idPelanggan =
      row[1];

    const plat =
      row[2];

    const merk =
      row[3];

    const model =
      row[4];

    const kilometer =
      row[9];


    const customer =
      customerMap[
        String(
          idPelanggan
        ).trim()
      ] || {

        nama : "",
        nohp : ""

      };


    const nama =
      String(
        customer.nama
      );


    const nohp =
      String(
        customer.nohp
      );


    /**
     * ========================================
     * FIELD UNTUK SEARCH
     * ========================================
     */

    const searchPlat =
      String(
        plat
      ).toUpperCase();


    const searchNama =
      nama.toUpperCase();


    const searchIdPelanggan =
      String(
        idPelanggan
      ).toUpperCase();


    const searchNoHp =
      nohp.toUpperCase();


    /**
     * ========================================
     * MATCH
     * ========================================
     */

    const cocok =

      searchPlat.includes(
        keyword
      )

      ||

      searchNama.includes(
        keyword
      )

      ||

      searchIdPelanggan.includes(
        keyword
      )

      ||

      searchNoHp.includes(
        keyword
      );


    if(!cocok){

      continue;

    }


    hasil.push({

      idKendaraan :
        idKendaraan,

      idPelanggan :
        idPelanggan,

      nama :
        nama,

      noHp :
        nohp,

      plat :
        plat,

      merk :
        merk,

      model :
        model,

      kilometer :
        kilometer

    });

  }


  return hasil;

}