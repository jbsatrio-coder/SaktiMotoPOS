const WorkOrderService = {

  create(data) {

    // Validasi
    if (!data.idPelanggan) {
      throw new Error("Pelanggan belum dipilih.");
    }

    if (!data.idKendaraan) {
      throw new Error("Kendaraan belum dipilih.");
    }

    if (!data.keluhan || data.keluhan.trim() === "") {
      throw new Error("Keluhan belum diisi.");
    }

    // TODO:
    // Generate No WO
    // Simpan ke Repository
    // Update statistik pelanggan
    // Tulis log aktivitas

    return true;

  }

};