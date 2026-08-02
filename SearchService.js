const SearchService = {

  search(keyword) {

    const hasil = ProductRepository.search(keyword);

    Logger.log("HASIL = " + hasil.length);

    // Tes kirim object yang sangat sederhana
    return hasil.map(item => ({
      kode: item.kode,
      nama: item.nama
    }));

  }

};