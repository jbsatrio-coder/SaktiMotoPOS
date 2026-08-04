/**
 * ============================================
 * Stock Service
 * Sprint 4A
 * ============================================
 */

const StockService = {

  /**
   * Kurangi stok barang
   */
  reduceStock(items) {

    if (!items || items.length === 0) return;

    items.forEach(item => {

      if (item.jenis !== "BARANG") return;

      const stok =
         BarangRepository.getStock(
             item.kode
      );

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

      BarangRepository.updateStock(
        item.kode,
        item.qty
);

    });

  }

};

function testReduceStock(){

  StockService.reduceStock([
    {
      jenis: "BARANG",
      kode: "BRG000114",
      qty: 1
    }
  ]);

}

function testReduceStockInsufficient(){

  StockService.reduceStock([
    {
      jenis: "BARANG",
      kode: "BRG000114",
      nama: "TEST BARANG",
      qty: 999999
    }
  ]);

}