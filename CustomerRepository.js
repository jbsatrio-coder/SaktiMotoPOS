/**
 * ============================================
 * Customer Repository
 * Version : 1.0.0
 * Sprint  : 5B.1
 * ============================================
 */

const CustomerRepository = {

    /**
     * Sheet Master Pelanggan
     */
    sheet(){

        return getSheet_(
            CONFIG.SHEET.PELANGGAN
        );

    },

    /**
     * Ambil semua customer
     */
    findAll(){

        const sh = this.sheet();

        if(sh.getLastRow() < 2){

            return [];

        }

        return sh
            .getDataRange()
            .getValues()
            .slice(1);

    },

    /**
     * Cari nomor baris berdasarkan Customer ID
     * Return:
     * 0 = tidak ditemukan
     * >=2 = nomor baris sheet
     */
    findRowById(customerId){

        const sh = this.sheet();

        const lastRow = sh.getLastRow();

        if(lastRow < 2){

            return 0;

        }

        const idList = sh
            .getRange(
                2,
                SHEET_COL_PELANGGAN.ID,
                lastRow - 1,
                1
            )
            .getValues();

        for(let i=0;i<idList.length;i++){

            if(

                String(idList[i][0]).trim() ===
                String(customerId).trim()

            ){

                return i + 2;

            }

        }

        return 0;

    },

    /**
     * Pastikan Customer ada
     */
    requireRow(customerId){

        const row =
            this.findRowById(customerId);

        if(row === 0){

            throw new Error(

                "Customer tidak ditemukan : " +

                customerId

            );

        }

        return row;

    },

    /**
     * Customer sudah ada?
     */
    exists(customerId){

        return this.findRowById(customerId) > 0;

    },

    /**
     * Cari Customer berdasarkan ID
     */
    findById(customerId){

        return this.findAll().find(r =>

            String(

                r[COL_PELANGGAN.ID]

            ).trim() ===

            String(customerId).trim()

        ) || null;

    },

    /**
     * Cari Customer berdasarkan Nama
     */
    findByName(keyword){

        keyword =

            String(keyword || "")

            .toLowerCase()

            .trim();

        return this.findAll().filter(r =>

            String(

                r[COL_PELANGGAN.NAMA]

            )

            .toLowerCase()

            .includes(keyword)

        );

    },

    /**
     * Cari Customer berdasarkan No HP
     */
    findByPhone(keyword){

        keyword =

            String(keyword || "")

            .trim();

        return this.findAll().filter(r =>

            String(

                r[COL_PELANGGAN.NOHP]

            )

            .includes(keyword)

        );

    },

    /**
     * Simpan Customer Baru
     */
    save(customerDocument){

        const customer =
            customerDocument.customer;

        this.sheet().appendRow([

            customer.id,

            customer.nama,

            customer.noHP,

            customer.alamat,

            customer.tanggalLahir,

            customer.jenisKelamin,

            customer.status,

            customer.catatan,

            customer.createdAt,

            customer.updatedAt

        ]);

        return {

            success : true,

            customerId :
                customer.id

        };

    },

    /**
     * Update Customer
     */
    update(customerDocument){

    const customer =
        customerDocument.customer;

    const row =
        this.requireRow(
            customer.id
        );

    const createdAt =
        this.sheet()
            .getRange(
                row,
                SHEET_COL_PELANGGAN.CREATEDAT
            )
            .getValue();

    this.sheet()
        .getRange(
            row,
            1,
            1,
            10
        )
        .setValues([[

            customer.id,

            customer.nama,

            customer.noHP,

            customer.alamat,

            customer.tanggalLahir,

            customer.jenisKelamin,

            customer.status,

            customer.catatan,

            createdAt,

            new Date()

        ]]);

    return {

        success : true,

        customerId :
            customer.id

    };

}

};