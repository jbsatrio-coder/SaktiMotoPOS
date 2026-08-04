# SAKTI MOTO POS


# SAKTI MOTO POS

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