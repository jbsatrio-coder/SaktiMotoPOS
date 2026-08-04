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

      const stok = this.getCurrentStock(item.kode);

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

    // 1. Validasi input
    this.validateMovement(movement);

    // 2. Ambil stok saat ini
    const currentStock =
        this.getCurrentStock(
            movement.kodeBarang
        );

    // 3. Hitung stok baru
    const result =
        this.calculateNewStock(
            currentStock,
            movement
        );
Logger.log(result);

    // 4. Update stok master
    this.updateCurrentStock(result);

    // 5. Return hasil
    return result;

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

  },

getCurrentStock(kodeBarang){

    return BarangRepository.getStock(

        kodeBarang

    );

},

calculateNewStock(currentStock, movement){

    let qtyIn = 0;
    let qtyOut = 0;
    let newStock = currentStock;

    switch (movement.movementType) {

        case "SALE":

            qtyOut = movement.qty;
            newStock = currentStock - movement.qty;
            break;

        case "PURCHASE":

            qtyIn = movement.qty;
            newStock = currentStock + movement.qty;
            break;

        default:

            throw new Error(
                "Movement Type tidak dikenali : " +
                movement.movementType
            );

    }

    return {

        movement : movement,

        qty : movement.qty,

        qtyIn : qtyIn,

        qtyOut : qtyOut,

        currentStock : currentStock,

        newStock : newStock

    };

},


updateCurrentStock(result){

    BarangRepository.updateStockAbsolute(

        result.movement.kodeBarang,

        result.newStock

    );

    Logger.log(

        "[UPDATE STOCK] " +

        result.currentStock +

        " -> " +

        result.newStock

    );
    return result;

},

}


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

function testGetCurrentStock(){

  const stok =
      InventoryService.getCurrentStock(
          "BRG000114"
      );

  Logger.log(stok);

}

function testCalculateNewStockSale(){

    const result =
        InventoryService.calculateNewStock(
            23,
            {
                movementType : "SALE",
                qty : 2
            }
        );

    Logger.log(result);

}

function testCalculateNewStockPurchase(){

    const result =
        InventoryService.calculateNewStock(
            23,
            {
                movementType : "PURCHASE",
                qty : 5
            }
        );

    Logger.log(result);

}

function testUpdateCurrentStock(){

    const result = {

        movement : {

            kodeBarang : "BRG000114"

        },

        currentStock : 50,

        newStock : 30

    };

    const stok =
        InventoryService.updateCurrentStock(
            result
        );

    Logger.log(stok);

}

function testMoveStockSale(){

    const result =
        InventoryService.moveStock({

            kodeBarang : "BRG000114",

            movementType : "SALE",

            qty : 2,

            reference : "TEST001",

            note : "Sprint 4C.3",

            performedBy : "Developer"

        });

    Logger.log(result);

}