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
 * ============================================
 * Simpan Customer Baru
 * ============================================
 */
save(customerDocument){

    const customer =
        customerDocument.customer;

    const sh =
        this.sheet();

    // ============================================
    // NORMALISASI NO HP
    // ============================================

    const noHP =
        String(
            customer.noHP || ""
        ).trim();


    // ============================================
    // BARIS BARU
    // ============================================

    const targetRow =
        sh.getLastRow() + 1;


    // ============================================
    // PAKSA KOLOM NO HP MENJADI TEXT
    // SEBELUM DATA DITULIS
    // ============================================

    sh.getRange(
        targetRow,
        SHEET_COL_PELANGGAN.NOHP
    ).setNumberFormat("@");


    // ============================================
    // SIMPAN CUSTOMER
    // ============================================

    sh.getRange(
        targetRow,
        1,
        1,
        9
    ).setValues([[
        customer.id,
        customer.nama,
        noHP,
        customer.alamat,
        customer.tanggalLahir,
        customer.jenisKelamin,
        customer.status,
        customer.catatan,
        customer.createdAt
    ]]);


    // ============================================
    // PASTIKAN NO HP TETAP TEXT
    // ============================================

    sh.getRange(
        targetRow,
        SHEET_COL_PELANGGAN.NOHP
    ).setNumberFormat("@");

    sh.getRange(
        targetRow,
        SHEET_COL_PELANGGAN.NOHP
    ).setValue(noHP);


    // ============================================
    // RETURN CUSTOMER RESULT
    // ============================================

    return {

        success :
            true,

        customerId :
            customer.id,

        nama :
            customer.nama,

        noHP :
            noHP,

        alamat :
            customer.alamat,

        tanggalLahir :
            customer.tanggalLahir,

        jenisKelamin :
            customer.jenisKelamin,

        status :
            customer.status,

        catatan :
            customer.catatan,

        createdAt :
            customer.createdAt

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