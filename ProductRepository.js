/**
 * ============================================
 * Product Repository
 * Menggabungkan Barang + Jasa
 * ============================================
 */

const ProductRepository = {

  /**
   * Cari produk (Barang + Jasa)
   */
  search(keyword) {

    keyword = String(keyword || "").trim();

    const barang = BarangRepository
      .search(keyword)
      .map(r => ({

        sumber: "BARANG",
        jenis: "BARANG",

        kode: r[COL_BARANG.KODE],
        barcode: r[COL_BARANG.BARCODE],
        nama: r[COL_BARANG.NAMA],

        kategori: r[COL_BARANG.KATEGORI],
        satuan: r[COL_BARANG.SATUAN],

        harga: Number(r[COL_BARANG.HARGAJUAL] || 0),
        stok: Number(r[COL_BARANG.STOK])

      }));


    const jasa = JasaRepository
      .search(keyword)
      .map(r => ({

        sumber: "JASA",
        jenis: "JASA",

        kode: r[COL_JASA.KODE],
        nama: r[COL_JASA.NAMA],

        kategori: r[COL_JASA.KATEGORI],

        harga: Number(r[COL_JASA.HARGA] || 0),
        komisi: Number(r[COL_JASA.KOMISI]),
        estimasi: Number(r[COL_JASA.ESTIMASI])

      }));


    return [...barang, ...jasa]
      .sort((a, b) => a.nama.localeCompare(b.nama));

  },

  /**
   * Cari berdasarkan kode
   */
  getByKode(kode) {

    let barang = BarangRepository.getByKode(kode);

    if (barang) {

      return {
        sumber: "BARANG",
        jenis: "BARANG",

        kode: barang[COL_BARANG.KODE],
        barcode: barang[COL_BARANG.BARCODE],
        nama: barang[COL_BARANG.NAMA],

        kategori: barang[COL_BARANG.KATEGORI],
        satuan: barang[COL_BARANG.SATUAN],

        harga: Number(barang[COL_BARANG.HARGAJUAL]),
        stok: Number(barang[COL_BARANG.STOK])
      };

    }

    let jasa = JasaRepository.getByKode(kode);

    if (jasa) {

      return {
        sumber: "JASA",
        jenis: "JASA",

        kode: jasa[COL_JASA.KODE],
        nama: jasa[COL_JASA.NAMA],

        kategori: jasa[COL_JASA.KATEGORI],

        harga: Number(jasa[COL_JASA.HARGA]),
        komisi: Number(jasa[COL_JASA.KOMISI]),
        estimasi: Number(jasa[COL_JASA.ESTIMASI])
      };

    }

    return null;

  }

};