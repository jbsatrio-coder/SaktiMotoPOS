/**
 * ============================================
 * Customer Validator
 * Version : 1.0.0
 * Sprint  : 5C.1
 * ============================================
 */

const CustomerValidator = {

    /**
     * Validasi umum
     */
    validate(document){

        this.validateId(document);

        this.validateNama(document);

        this.validateStatus(document);

        this.validateGender(document);

    },

    /**
     * Validasi Create
     */
    validateCreate(document){

        this.validate(document);

        this.validateDuplicate(document);

    },

    /**
     * Validasi Update
     */
    validateUpdate(document){

        this.validate(document);

        const customer =
            document.customer;

        if(

            !CustomerRepository.exists(
                customer.id
            )

        ){

            throw new Error(

                "Customer tidak ditemukan."

            );

        }

    },

    /**
     * Validasi ID
     */
    validateId(document){

        const customer =
            document.customer;

        if(

            !String(
                customer.id || ""
            ).trim()

        ){

            throw new Error(
                "ID Customer wajib diisi."
            );

        }

    },

    /**
     * Validasi Nama
     */
    validateNama(document){

        const customer =
            document.customer;

        if(

            !String(
                customer.nama || ""
            ).trim()

        ){

            throw new Error(
                "Nama Customer wajib diisi."
            );

        }

    },

    /**
     * Validasi Status
     */
    validateStatus(document){

        const customer =
            document.customer;

        const validStatus = [

            CustomerStatus.AKTIF,

            CustomerStatus.NONAKTIF

        ];

        if(

            !validStatus.includes(
                customer.status
            )

        ){

            throw new Error(

                "Status Customer tidak valid."

            );

        }

    },

    /**
     * Validasi Jenis Kelamin
     */
    validateGender(document){

        const customer =
            document.customer;

        const validGender = [

            CustomerGender.PRIA,

            CustomerGender.WANITA

        ];

        if(

            !validGender.includes(
                customer.jenisKelamin
            )

        ){

            throw new Error(

                "Jenis Kelamin Customer tidak valid."

            );

        }

    },

    /**
     * Validasi Duplicate
     */
    validateDuplicate(document){

        const customer =
            document.customer;

        if(

            CustomerRepository.exists(
                customer.id
            )

        ){

            throw new Error(

                "Customer ID sudah digunakan."

            );

        }

    }

};