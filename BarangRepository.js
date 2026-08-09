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