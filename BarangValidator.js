/**
 * ============================================
 * Barang Validator
 * Phase 2
 * ============================================
 */

const BarangValidator = {

    /**
     * ==========================================
     * VALIDATE CREATE
     * ==========================================
     */

    validateCreate(document){

        this.validateId(document);

        this.validateBarcode(document);

        this.validateNama(document);

        this.validateSatuan(document);

        this.validateHargaModal(document);

        this.validateMargin(document);

        this.validateHargaJual(document);

        this.validateStok(document);

        this.validateMinStok(document);

        this.validateStatus(document);

        this.validateDuplicateId(document);

        this.validateDuplicateBarcode(document);

    },


    /**
     * ==========================================
     * VALIDATE ID
     * ==========================================
     */

    validateId(document){

        const barang =
            document.barang;

        if(
            !String(
                barang.id || ""
            ).trim()
        ){

            throw new Error(
                "ID Barang wajib diisi."
            );

        }

    },


    /**
     * ==========================================
     * VALIDATE BARCODE
     * ==========================================
     */

    validateBarcode(document){

        const barang =
            document.barang;

        if(
            !String(
                barang.barcode || ""
            ).trim()
        ){

            throw new Error(
                "Barcode Barang wajib diisi."
            );

        }

    },


    /**
     * ==========================================
     * VALIDATE NAMA
     * ==========================================
     */

    validateNama(document){

        const barang =
            document.barang;

        if(
            !String(
                barang.nama || ""
            ).trim()
        ){

            throw new Error(
                "Nama Barang wajib diisi."
            );

        }

    },


    /**
     * ==========================================
     * VALIDATE SATUAN
     * ==========================================
     */

    validateSatuan(document){

        const barang =
            document.barang;

        if(
            !String(
                barang.satuan || ""
            ).trim()
        ){

            throw new Error(
                "Satuan Barang wajib diisi."
            );

        }

    },


    /**
     * ==========================================
     * VALIDATE HARGA MODAL
     * ==========================================
     */

    validateHargaModal(document){

        const barang =
            document.barang;

        const hargaModal =
            Number(
                barang.hargaModal
            );

        if(
            !Number.isFinite(
                hargaModal
            )
            ||
            hargaModal < 0
        ){

            throw new Error(
                "Harga Modal tidak valid."
            );

        }

    },


    /**
     * ==========================================
     * VALIDATE MARGIN
     * ==========================================
     */

    validateMargin(document){

        const barang =
            document.barang;

        const margin =
            Number(
                barang.margin
            );

        if(
            !Number.isFinite(
                margin
            )
            ||
            margin < 0
        ){

            throw new Error(
                "Margin tidak valid."
            );

        }

    },


    /**
     * ==========================================
     * VALIDATE HARGA JUAL
     * ==========================================
     */

    validateHargaJual(document){

        const barang =
            document.barang;

        const hargaJual =
            Number(
                barang.hargaJual
            );

        if(
            !Number.isFinite(
                hargaJual
            )
            ||
            hargaJual < 0
        ){

            throw new Error(
                "Harga Jual tidak valid."
            );

        }

    },


    /**
     * ==========================================
     * VALIDATE STOK
     * ==========================================
     */

    validateStok(document){

        const barang =
            document.barang;

        const stok =
            Number(
                barang.stok
            );

        if(
            !Number.isFinite(
                stok
            )
            ||
            stok < 0
        ){

            throw new Error(
                "Stok tidak valid."
            );

        }

    },


    /**
     * ==========================================
     * VALIDATE MIN STOK
     * ==========================================
     */

    validateMinStok(document){

        const barang =
            document.barang;

        const minStok =
            Number(
                barang.minStok
            );

        if(
            !Number.isFinite(
                minStok
            )
            ||
            minStok < 0
        ){

            throw new Error(
                "Minimum Stok tidak valid."
            );

        }

    },


    /**
     * ==========================================
     * VALIDATE STATUS
     * ==========================================
     */

    validateStatus(document){

        const barang =
            document.barang;

        const validStatus = [

            "AKTIF",

            "NONAKTIF"

        ];

        if(
            validStatus.indexOf(
                barang.status
            ) === -1
        ){

            throw new Error(
                "Status Barang tidak valid."
            );

        }

    },


    /**
     * ==========================================
     * VALIDATE DUPLICATE ID
     * ==========================================
     */

    validateDuplicateId(document){

        const barang =
            document.barang;

        if(
            BarangRepository.exists(
                barang.id
            )
        ){

            throw new Error(

                "ID Barang sudah terdaftar : " +

                barang.id

            );

        }

    },


    /**
     * ==========================================
     * VALIDATE DUPLICATE BARCODE
     * ==========================================
     */

    validateDuplicateBarcode(document){

        const barang =
            document.barang;

        if(
            BarangRepository.findRowByBarcode(
                barang.barcode
            ) > 0
        ){

            throw new Error(

                "Barcode Barang sudah terdaftar : " +

                barang.barcode

            );

        }

    }

};


/**
 * ============================================
 * TEST
 * ============================================
 */

function testValidateBarangOK(){

    const document = {

        barang : {

            id : "BRG999999",

            barcode : "199999999",

            nama :
                "Barang Test Validator",

            satuan :
                "PCS",

            hargaModal :
                15000,

            margin :
                0.25,

            hargaJual :
                20000,

            stok :
                10,

            minStok :
                3,

            status :
                "AKTIF"

        }

    };


    BarangValidator.validateCreate(
        document
    );


    Logger.log(
        "VALIDASI BARANG : OK"
    );

}