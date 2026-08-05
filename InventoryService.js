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

        // Jasa tidak memiliki stok
        if (item.jenis !== "BARANG") return;

        this.moveStock({

            kodeBarang : item.kode,

            movementType : "SALE",

            qty : item.qty,

            reference : "",

            note : "POS",

            performedBy : "SYSTEM"

        });

    });

},

  /**
   * =====================================================
   * Inventory Movement Engine
   * (Belum digunakan oleh POS)
   * =====================================================
   */
  moveStock(movement) {

    // Validasi
    this.validateMovement(movement);

    // Ambil stok saat ini
    const currentStock =
        this.getCurrentStock(
            movement.kodeBarang
        );

    // Hitung stok baru
    const movementResult =
        this.calculateNewStock(
            currentStock,
            movement
        );

    try {

        // Update stok master
        this.updateCurrentStock(
            movementResult
        );

        // Tulis ledger
        this.writeLedger(
            movementResult
        );

        return movementResult;

    } catch (error) {

        // Jika stok sudah ter-update,
        // tetapi ledger gagal,
        // kembalikan stok.

        if (movementResult.updated) {

            this.rollbackStock(
                movementResult
            );

        }

        Logger.log(
            "[TRANSACTION FAILED] " +
            error.message
        );

        throw error;

    }

},

  /**
   * =====================================================
   * Movement Validation
   * =====================================================
   */
  validateMovement(movement) {

    if (!movement) {

     throw new InventoryException(
    "INV000",
    "Movement wajib diisi."
);

    }

    if (!movement.kodeBarang) {

      throw new InventoryException(
    "INV001",
    "Kode barang wajib diisi."
);

    }

    if (movement.qty == null) {

      throw new InventoryException(
    "INV002",
    "Qty wajib diisi."
);

    }

    if (movement.qty <= 0) {

      throw new InventoryException(
    "INV003",
    "Qty harus lebih besar dari 0."
);

    }

    if (!movement.movementType) {

     throw new InventoryException(
    "INV004",
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

    result.updated = true;
    return result;

},

writeLedger(movementResult){

    const now = new Date();

    const ledger = {

        id : Utilities.getUuid(),

        tanggal : Utilities.formatDate(
            now,
            Session.getScriptTimeZone(),
            "yyyy-MM-dd"
        ),

        jam : Utilities.formatDate(
            now,
            Session.getScriptTimeZone(),
            "HH:mm:ss"
        ),

        kodeBarang : movementResult.movement.kodeBarang,

        namaBarang : "",

        jenisMutasi : movementResult.movement.movementType,

        referensi : movementResult.movement.reference,

        stokAwal : movementResult.currentStock,

        qtyMasuk : movementResult.qtyIn,

        qtyKeluar : movementResult.qtyOut,

        stokAkhir : movementResult.newStock,

        keterangan : movementResult.movement.note,

        admin : movementResult.movement.performedBy,

        createdAt : now

    };

    

    StockLedgerRepository.addHistory(ledger);

    movementResult.ledgerWritten = true;

    Logger.log("[LEDGER] OK");

    return movementResult;

},

/**
 * Rollback perubahan stok
 */
rollbackStock(movementResult){

    BarangRepository.updateStockAbsolute(
      

        movementResult.movement.kodeBarang,

        movementResult.currentStock

    );

    movementResult.updated = false;

    movementResult.rolledBack = true;

    Logger.log(

        "[ROLLBACK] " +

        movementResult.newStock +

        " -> " +

        movementResult.currentStock

    );

    return movementResult;

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

function testWriteLedger(){

    const movementResult = {

        movement : {

            kodeBarang : "BRG000114",

            movementType : "SALE",

            reference : "TEST-LEDGER",

            note : "Unit Test",

            performedBy : "Developer"

        },

        currentStock : 30,

        newStock : 29,

        qty : 1,

        qtyIn : 0,

        qtyOut : 1,

        updated : true

    };

    const result =
        InventoryService.writeLedger(
            movementResult
        );

    Logger.log(result);

}

function testRollbackStock(){

    const movementResult = {

        movement : {

            kodeBarang : "BRG000114"

        },

        currentStock : 25,

        newStock : 23,

        updated : true,

        ledgerWritten : false

    };

    const result =
        InventoryService.rollbackStock(
            movementResult
        );

    Logger.log(result);

}

function testInventoryException(){

    try{

        InventoryService.moveStock({

            kodeBarang : "",

            qty : 1,

            movementType : "SALE"

        });

    }catch(error){

        Logger.log(error.name);

        Logger.log(error.code);

        Logger.log(error.message);

        Logger.log(error.toString());

    }

}