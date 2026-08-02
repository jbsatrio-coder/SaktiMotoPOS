const SearchService = {

 search(keyword) {

  const hasil = ProductRepository.search(keyword);

  Logger.log("HASIL = " + hasil.length);

  return hasil.map(item => ({

    kode: item.kode,
    barcode: item.barcode || "",

    nama: item.nama,
    jenis: item.jenis,

    kategori: item.kategori || "",
    satuan: item.satuan || "",

    // sementara kirim apa adanya
    harga: item.harga,

    stok: item.stok || 0

  }));

}

};