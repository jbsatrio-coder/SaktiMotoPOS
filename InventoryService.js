/**
 * ============================================
 * Inventory Service
 * Sprint 4C.0
 * ============================================
 */

const InventoryService = {

  /**
   * Kurangi stok barang
   */
  reduceStock(items) {

    if (!items || items.length === 0) return;

    items.forEach(item => {

      // Jasa tidak memiliki stok
      if (item.jenis !== "BARANG") return;

      // Ambil stok saat ini
      const stok = BarangRepository.getStock(item.kode);

      // Validasi stok
      if (stok < item.qty) {

        throw new Error(

          "Stok tidak mencukupi\n\n" +

          "Kode : " + item.kode + "\n" +

          "Barang : " + item.nama + "\n" +

          "Stok : " + stok + "\n" +

          "Diminta : " + item.qty

        );

      }

      Logger.log(
        "Kurangi stok : " +
        item.kode +
        " Qty : " +
        item.qty
      );

      // Update stok
      BarangRepository.updateStock(
        item.kode,
        item.qty
      );

    });

  }

};

/**
 * ============================================
 * Unit Test
 * ============================================
 */

function testReduceStock() {

  InventoryService.reduceStock([
    {
      jenis: "BARANG",
      kode: "BRG000114",
      qty: 1
    }
  ]);

}

function testReduceStockInsufficient() {

  InventoryService.reduceStock([
    {
      jenis: "BARANG",
      kode: "BRG000114",
      nama: "TEST BARANG",
      qty: 999999
    }
  ]);

}