const SearchService = {

  search(keyword) {

    Logger.log("=== SEARCH SERVICE ===");
    Logger.log(keyword);

    const hasil = ProductRepository.search(keyword);

    Logger.log("HASIL = " + hasil.length);

    return hasil;

  }

};