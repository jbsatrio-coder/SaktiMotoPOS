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