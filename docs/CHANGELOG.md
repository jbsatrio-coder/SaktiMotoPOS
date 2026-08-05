# SAKTI MOTO POS

# v0.5.1

Date    : 2026-08-05
Sprint  : 4D.0
Status  : Stable

---

## Added

### Transaction Safety

- Rollback engine
- try/catch transaction flow
- Automatic stock restoration

---

### InventoryException

New custom exception.

Features:

- Error Code
- Message
- Details
- Timestamp
- toString()

---

### Testing

PASS

- Rollback Test
- Transaction Failure Test
- InventoryException Test

---

### Architecture

Inventory Platform completed.

Pipeline:

Validation

↓

Calculation

↓

Update Stock

↓

Write Ledger

↓

Rollback (if needed)

↓

MovementResult

# v0.5.0

Date    : 2026-08-05
Sprint  : 4C.5
Status  : Stable

---

## 🎉 Major Milestone

Inventory Engine v1 completed.

The POS application now uses the new Inventory Engine for all stock movements.

---

## 🚀 New Features

### Inventory Engine

- Movement validation
- Stock calculation engine
- Absolute stock update
- Inventory movement orchestration
- Automatic Stock Ledger writing
- MovementResult pipeline

---

### Repository

Added:

- BarangRepository.updateStockAbsolute()

Completed:

- StockLedgerRepository.addHistory()

---

### POS Integration

POS no longer updates stock directly.

POS now delegates every inventory movement through InventoryService.

---

### MovementResult

Introduced a unified DTO for inventory processing.

```javascript
{
    movement,
    currentStock,
    newStock,
    qty,
    qtyIn,
    qtyOut,
    updated,
    ledgerWritten
}
```

---

## Architecture

```
POS

↓

InventoryService

↓

Validation

↓

Calculation

↓

Master Stock

↓

Stock Ledger

↓

MovementResult
```

---

## Testing

Unit Test

PASS

- Validation
- Current Stock
- Calculation
- Update Stock
- Write Ledger
- Move Stock

Regression Test

PASS

- POS Transaction
- Multi Item Transaction
- Automatic Stock Update
- Automatic Stock Ledger

---

## Next Version

v0.5.1

Transaction Safety

- try/catch
- rollback strategy
- centralized error logging

# v0.4.5

Date    : 2026-08-05
Sprint  : 4C.3
Status  : Stable

---

## 🚀 NEW

### Inventory Engine

- Added `getCurrentStock()`
- Added `calculateNewStock()`
- Added `updateCurrentStock()`
- Added `updateStockAbsolute()` in BarangRepository
- Completed `moveStock()` orchestration flow

---

## 🏗 Architecture

Inventory Engine now follows a layered architecture.

```
moveStock()

↓

validateMovement()

↓

getCurrentStock()

↓

calculateNewStock()

↓

updateCurrentStock()

↓

return CalculationResult
```

---

## ✨ New Internal DTO

CalculationResult

```javascript
{
    movement,
    qty,
    qtyIn,
    qtyOut,
    currentStock,
    newStock
}
```

---

## 🔧 Repository

Added:

- updateStockAbsolute()

Separated business logic from persistence layer.

InventoryService performs calculations.

BarangRepository only writes data.

---

## ✅ Unit Test

PASS

- testReduceStock()
- testReduceStockInsufficient()
- testMoveStockValidation()
- testGetCurrentStock()
- testCalculateNewStockSale()
- testCalculateNewStockPurchase()
- testUpdateStockAbsolute()
- testUpdateCurrentStock()
- testMoveStockSale()

All tests passed.

---

## 📌 Next Sprint

Sprint 4C.4

Migration Layer

reduceStock()

↓

moveStock()

No POS changes required.


# v0.4.4

Date    : 2026-08-04
Sprint  : 4C.2
Status  : Stable

## 🚀 NEW

- Introduced InventoryService as the new inventory engine.
- Added `moveStock()` as the future single entry point for all stock movements.
- Added `validateMovement()` for centralized movement validation.
- Introduced Inventory Movement API (ADR-002).

## 🔧 IMPROVED

- Separated public API (`reduceStock`) from internal inventory engine.
- Improved service architecture following Single Responsibility Principle.
- Prepared architecture for Stock Ledger integration.

## 🛡 FIXED

- Clean rewrite of InventoryService.
- Removed obsolete `recordMutation()` implementation.
- Resolved syntax issues introduced during architecture refactoring.

## ✅ TESTED

- testReduceStock()
- testReduceStockInsufficient()
- testMoveStockValidation()

All tests passed successfully.

## 📋 NEXT

Sprint 4C.3

- getCurrentStock()
- calculateNewStock()
- updateCurrentStock()
---

## v0.4.2

Date    : 2026-08-04
Sprint  : 4B.2
Status  : Stable

### 🚀 NEW

- Early Stock Validation pada POS Cart
- Helper `canIncrease()` untuk validasi penambahan Qty
- Informasi `stok` disimpan pada object Cart
- Validasi Qty saat tombol (+) ditekan
- Validasi Qty saat memilih kembali barang dari hasil pencarian

### 🔧 IMPROVED

- Arsitektur validasi stok dipisahkan menjadi:
  - Browser (Early Validation)
  - Server (Final Validation)
- Pengalaman kasir lebih baik karena kesalahan diketahui sebelum transaksi disimpan
- Struktur POSCart menjadi lebih mudah dikembangkan untuk fitur berikutnya

### 🛡 FIXED

- Mencegah Qty melebihi stok melalui tombol (+)
- Mencegah Qty melebihi stok saat memilih barang yang sama dari hasil pencarian
- Mencegah stok menjadi negatif
- Mencegah transaksi disimpan apabila stok tidak mencukupi

### 🏗 ARCHITECTURE

- Menambahkan helper `canIncrease()` untuk menghindari duplikasi business logic
- Browser hanya bertugas melakukan Early Validation
- StockService tetap menjadi Final Validation untuk menjaga integritas data
- Business Rule stok dipusatkan sehingga mudah digunakan kembali pada modul lain

### ✅ TESTED

- Penambahan Qty melalui tombol (+)
- Penambahan barang melalui hasil pencarian
- Validasi barang dengan stok terbatas
- Validasi item Jasa (tidak menggunakan stok)
- Final Validation saat Save Transaction
- Sinkronisasi Browser dan Server Validation

### 📋 NEXT

- Stock History
- StockHistoryService
- StockHistoryRepository
- Integrasi Stock History ke TransactionService

---

## v0.4.1

Date    : 2026-08-04
Sprint  : 4B.1
Status  : Stable

### 🚀 NEW

- BarangRepository.getStock()
- BarangRepository.updateStock()
- Automatic Stock Reduction
- Final Stock Validation pada StockService

### 🔧 IMPROVED

- Performa proses Save Transaction
- Struktur StockService
- Pembacaan stok melalui Repository

### 🛡 FIXED

- Duplicate Stock Reduction
- Mencegah stok menjadi negatif saat transaksi
---

## v0.4.0
Date : 2026-08-04

### NEW
- Inventory Foundation
- BarangRepository
- StockService
- Automatic Stock Reduction

### IMPROVED
- Transaction Save Performance
- Payment Formatting
- Reset POS
- Prevent Double Click

### FIXED
- Duplicate Save
- Duplicate Stock Reduction
- Search Reset