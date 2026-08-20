/**
 * ============================================
 * Merk Validator
 * Version : 1.0.0
 * ============================================
 */

const MerkValidator = {

    validateCreate(document){

        if(!document){

            throw new Error(
                "Document Merk wajib diisi."
            );

        }

        if(!document.merk){

            throw new Error(
                "Data Merk wajib diisi."
            );

        }

        if(!document.merk.id){

            throw new Error(
                "ID Merk wajib diisi."
            );

        }

        if(!document.merk.nama){

            throw new Error(
                "Nama Merk wajib diisi."
            );

        }

        return true;

    }

};