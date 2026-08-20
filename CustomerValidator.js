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

    this.validateNoHP(document);

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

    this.validateNoHP(document);

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
 * ============================================
 * Validasi Nomor HP
 *
 * No HP boleh kosong.
 *
 * Jika diisi:
 * - CREATE : tidak boleh dimiliki customer lain
 * - UPDATE : tidak boleh dimiliki customer lain
 * ============================================
 */
validateNoHP(document){

    const customer =
        document.customer;

    const noHP =
        String(
            customer.noHP || ""
        ).trim();

    // No HP optional
    if(!noHP){

        return;

    }

    const existingCustomers =
        CustomerRepository.findByPhone(
            noHP
        );

    const duplicate =
        existingCustomers.find(
            row => {

                const existingNoHP =
                    String(
                        row[
                            COL_PELANGGAN.NOHP
                        ] || ""
                    ).trim();

                const existingId =
                    String(
                        row[
                            COL_PELANGGAN.ID
                        ] || ""
                    ).trim();

                return (

                    existingNoHP === noHP

                    &&

                    existingId !==
                        String(
                            customer.id
                        ).trim()

                );

            }
        );

    if(duplicate){

        throw new Error(

            "Nomor HP " +
            noHP +
            " sudah terdaftar pada customer lain."

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