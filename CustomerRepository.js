const CustomerRepository = {

  sheet() {
    return getSheet_(CONFIG.SHEET.MASTER_PELANGGAN);
  },

  getAll() {

    const sh = this.sheet();

    if (sh.getLastRow() < 2) return [];

    return sh.getDataRange().getDisplayValues().slice(1);

  },

  getById(id) {

    return this.getAll().find(r =>
      r[COL_PELANGGAN.ID] == id
    ) || null;

  },

  findByName(keyword) {

    keyword = keyword.toLowerCase();

    return this.getAll().filter(r =>
      r[COL_PELANGGAN.NAMA]
      .toLowerCase()
      .includes(keyword)
    );

  },

  findByPhone(keyword) {

    return this.getAll().filter(r =>
      String(r[COL_PELANGGAN.NOHP])
      .includes(keyword)
    );

  }

};