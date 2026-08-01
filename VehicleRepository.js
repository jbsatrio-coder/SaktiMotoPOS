const VehicleRepository = {

  sheet() {
    return getSheet_(CONFIG.SHEET.MASTER_KENDARAAN);
  },

  getAll() {

    const sh = this.sheet();

    if (sh.getLastRow() < 2) return [];

    return sh.getDataRange().getDisplayValues().slice(1);

  },

  findByPlate(keyword) {

    keyword = keyword.toLowerCase();

    return this.getAll().filter(r =>
      r[COL_KENDARAAN.PLAT]
      .toLowerCase()
      .includes(keyword)
    );

  },

  findByOwner(idPelanggan) {

    return this.getAll().filter(r =>
      r[COL_KENDARAAN.IDPELANGGAN] == idPelanggan
    );

  }

};