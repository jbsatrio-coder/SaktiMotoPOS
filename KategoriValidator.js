/**
 * ============================================
 * Kategori Validator
 * Version : 1.0.0
 * ============================================
 */

const KategoriValidator = {

    validateCreate(document){

        if(!document){

            throw new Error(
                "Document Kategori wajib diisi."
            );

        }

        if(!document.kategori){

            throw new Error(
                "Document Kategori tidak memiliki object kategori."
            );

        }

        const kategori =
            document.kategori;


        // ======================================
        // ID
        // ======================================

        if(
            kategori.id &&
            String(kategori.id).trim() !== ""
        ){

            if(
                !/^KAT\d{6}$/.test(
                    String(kategori.id).trim()
                )
            ){

                throw new Error(
                    "ID Kategori tidak valid: " +
                    kategori.id
                );

            }

        }


        // ======================================
        // NAMA
        // ======================================

        if(
            !String(
                kategori.nama || ""
            ).trim()
        ){

            throw new Error(
                "Nama Kategori wajib diisi."
            );

        }


        return true;

    }

};
