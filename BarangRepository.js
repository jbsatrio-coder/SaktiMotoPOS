/**
 * ============================================
 * Barang Repository
 * Version : 2.0.0
 * ============================================
 */

const BarangRepository = {

    /**
     * Mengambil Sheet Master Barang
     */
    sheet(){

        return getSheet_(
            CONFIG.SHEET.BARANG
        );

    },


    /**
     * Membaca satu cell
     */
    getCellValue(
        row,
        column
    ){

        return this.sheet()

            .getRange(
                row,
                column
            )

            .getValue();

    },


    /**
     * Mengubah satu cell
     */
    setCellValue(
        row,
        column,
        value
    ){

        this.sheet()

            .getRange(
                row,
                column
            )

            .setValue(value);

    },


    /**
     * Mengambil seluruh barang
     */
    getAll(){

        const sh = this.sheet();

        if(
            sh.getLastRow() < 2
        ){

            return [];

        }

        return sh

            .getDataRange()

            .getValues()

            .slice(1);

    },


    /**
     * Alias findAll
     */
    findAll(){

        return this.getAll();

    },


    /**
     * Mencari nomor baris berdasarkan ID Barang
     */
    findRowById(
        barangId
    ){

        const data =
            this.getAll();

        for(
            let i = 0;
            i < data.length;
            i++
        ){

            if(

                String(
                    data[i][
                        COL_BARANG.ID
                    ]
                ).trim()

                ===

                String(
                    barangId
                ).trim()

            ){

                return i + 2;

            }

        }

        return 0;

    },


    /**
     * Mengecek apakah barang ada
     */
    exists(
        barangId
    ){

        return (

            this.findRowById(
                barangId
            ) > 0

        );

    },


    /**
     * Mengambil barang berdasarkan ID
     */
    findById(
        barangId
    ){

        const row =
            this.findRowById(
                barangId
            );

        if(
            row === 0
        ){

            return null;

        }

        return this.sheet()

            .getRange(
                row,
                1,
                1,
                COL_BARANG.TOTAL
            )

            .getValues()[0];

    },


    /**
     * Alias getById
     */
    getById(
        barangId
    ){

        return this.findById(
            barangId
        );

    },

        /**
     * Mencari barang berdasarkan Kode Barang
     *
     * Kode Barang saat ini menggunakan
     * COL_BARANG.ID
     */
    getByKode(
        kode
    ){

        return this.findById(
            kode
        );

    },

    /**
     * Mencari barang berdasarkan barcode
     */
    findByBarcode(
        barcode
    ){

        const data =
            this.getAll();

        for(
            let i = 0;
            i < data.length;
            i++
        ){

            if(

                String(
                    data[i][
                        COL_BARANG.BARCODE
                    ]
                ).trim()

                ===

                String(
                    barcode
                ).trim()

            ){

                return data[i];

            }

        }

        return null;

    },


    /**
     * Mencari nomor baris berdasarkan barcode
     */
    findRowByBarcode(
        barcode
    ){

        const data =
            this.getAll();

        for(
            let i = 0;
            i < data.length;
            i++
        ){

            if(

                String(
                    data[i][
                        COL_BARANG.BARCODE
                    ]
                ).trim()

                ===

                String(
                    barcode
                ).trim()

            ){

                return i + 2;

            }

        }

        return 0;

    },


    /**
     * Mencari barang berdasarkan kata kunci
     */
    search(
        keyword
    ){

        keyword =

            String(
                keyword || ""
            )

            .toLowerCase()

            .trim();

        if(!keyword){

            return this.getAll();

        }

        return this.getAll()

            .filter(row =>

                String(
                    row[
                        COL_BARANG.KATAKUNCI
                    ]
                )

                .toLowerCase()

                .includes(keyword)

            );

    },


    /**
     * Memastikan barang ada
     */
    requireRow(
        barangId
    ){

        const row =
            this.findRowById(
                barangId
            );

        if(
            row === 0
        ){

            throw new Error(

                "Barang tidak ditemukan : " +

                barangId

            );

        }

        return row;

    },


    /**
     * Mengambil stok
     */
    getStock(
        barangId
    ){

        const row =
            this.requireRow(
                barangId
            );

        return Number(

            this.getCellValue(

                row,

                COL_BARANG.STOK + 1

            )

        ) || 0;

    },

    /**
     * ==========================================
     * Menyimpan Barang Baru
     * ==========================================
     */

    save(
        document
    ){

        if(
            !document ||
            !document.barang
        ){

            throw new Error(
                "Document Barang wajib diisi."
            );

        }


        const lock =
            LockService.getScriptLock();

        lock.waitLock(30000);

        try{

        const barang =
            document.barang;

        const sheet =
            this.sheet();


        // ======================================
        // CEK DUPLIKAT ID
        // ======================================

        if(
            this.exists(
                barang.id
            )
        ){

            throw new Error(

                "ID Barang sudah terdaftar : " +

                barang.id

            );

        }


        // ======================================
        // CEK DUPLIKAT BARCODE
        // ======================================

        if(
            this.findRowByBarcode(
                barang.barcode
            ) > 0
        ){

            throw new Error(

                "Barcode Barang sudah terdaftar : " +

                barang.barcode

            );

        }


        // ======================================
        // SUSUN DATA SESUAI COL_BARANG
        // ======================================

        const row = [

            barang.id,

            barang.barcode,

            barang.kataKunci,

            barang.namaPendek,

            barang.nama,

            barang.kategori,

            barang.subkategori,

            barang.merk,

            barang.kendaraan,

            barang.satuan,

            barang.hargaModal,

            barang.margin,

            barang.hargaJual,

            barang.stok,

            barang.minStok,

            barang.rak,

            barang.supplier,

            barang.status,

            barang.catatan,

            barang.createdAt,

            barang.updatedAt,

            barang.createdBy,

            barang.updatedBy

        ];


        // ======================================
        // SIMPAN
        // ======================================

        const targetRow =
            sheet.getLastRow() + 1;

        const targetRange =
            sheet.getRange(
                targetRow,
                1,
                1,
                COL_BARANG.TOTAL
            );

        const occupied =
            targetRange.getValues()[0]
                .some(function(value){
                    return String(value || "").trim() !== "";
                });

        if(occupied){
            throw new Error(
                "Baris append MasterBarang tidak kosong : " + targetRow
            );
        }

        try{

            targetRange.setValues([
                row
            ]);

            if(typeof this.__testAfterWriteFailure === "function"){
                this.__testAfterWriteFailure(
                    targetRow,
                    barang
                );
            }

        } catch(error){

            // Apps Script dapat menulis sebagian nilai sebelum data validation
            // menolak satu cell. Target selalu baris append baru di dalam lock.
            const persisted =
                targetRange.getValues()[0]
                    .some(function(value){
                        return String(value || "").trim() !== "";
                    });

            if(persisted){
                targetRange.clearContent();
                SpreadsheetApp.flush();
            }

            throw error;

        }


        Logger.log(

            "[BARANG SAVE] " +

            barang.id +

            " | " +

            barang.nama

        );


        return barang;

        } finally {

            lock.releaseLock();

        }

    },
    /**
     * Mengurangi stok
     */
    updateStock(
        barangId,
        qtyKeluar
    ){

        const row =
            this.requireRow(
                barangId
            );

        const sheet =
            this.sheet();

        const currentStock =
            Number(

                sheet.getRange(

                    row,

                    COL_BARANG.STOK + 1

                ).getValue()

            ) || 0;

        const qty =
            Number(
                qtyKeluar
            );

        if(
            qty <= 0
        ){

            throw new Error(
                "Qty keluar harus lebih dari 0."
            );

        }

        const newStock =
            currentStock - qty;

        sheet

            .getRange(

                row,

                COL_BARANG.STOK + 1

            )

            .setValue(
                newStock
            );

        Logger.log(

            "[STOCK] " +

            barangId +

            " : " +

            currentStock +

            " -> " +

            newStock

        );

        return newStock;

    },


    /**
     * Update stok absolut
     */
    updateStockAbsolute(
        barangId,
        newStock
    ){

        const row =
            this.requireRow(
                barangId
            );

        const sheet =
            this.sheet();

        const currentStock =
            Number(

                sheet.getRange(

                    row,

                    COL_BARANG.STOK + 1

                ).getValue()

            ) || 0;

        this.setCellValue(

            row,

            COL_BARANG.STOK + 1,

            newStock

        );

        Logger.log(

            "[STOCK ABSOLUTE] " +

            barangId +

            " : " +

            currentStock +

            " -> " +

            newStock

        );

        return newStock;

    }

};
