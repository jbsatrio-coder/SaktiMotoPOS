/**
 * ============================================
 * Inventory Service
 * Version : 0.4.4
 * Sprint  : 4C.2
 * ============================================
 */

const InventoryService = {

  /**
   * =====================================================
   * Public API
   * =====================================================
   * Dipakai oleh POS saat ini.
   * Nantinya akan menjadi wrapper ke moveStock().
   */
  reduceStock(items) {

    if (!items || items.length === 0) return;

    items.forEach(item => {

      // Item jasa tidak memiliki stok
      if (item.jenis !== "BARANG") return;

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

      BarangRepository.updateStock(
        item.kode,
        item.qty
      );

    });

  },

  /**
   * =====================================================
   * Inventory Movement Engine
   * (Belum digunakan oleh POS)
   * =====================================================
   */
  moveStock(movement) {

    this.validateMovement(movement);

    Logger.log("Validation OK");

  },

  /**
   * =====================================================
   * Movement Validation
   * =====================================================
   */
  validateMovement(movement) {

    if (!movement) {

      throw new Error(
        "Movement wajib diisi."
      );

    }

    if (!movement.kodeBarang) {

      throw new Error(
        "Kode barang wajib diisi."
      );

    }

    if (movement.qty == null) {

      throw new Error(
        "Qty wajib diisi."
      );

    }

    if (movement.qty <= 0) {

      throw new Error(
        "Qty harus lebih besar dari 0."
      );

    }

    if (!movement.movementType) {

      throw new Error(
        "Movement Type wajib diisi."
      );

    }

    Logger.log("validateMovement()");

  }

};


/**
 * =====================================================
 * Unit Test
 * =====================================================
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


function testMoveStockValidation() {

  InventoryService.moveStock({

    kodeBarang: "BRG000114",

    qty: 1,

    movementType: "SALE",

    reference: "TEST001",

    note: "Unit Test",

    performedBy: "Developer"

  });

}