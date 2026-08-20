/**
 * ============================================
 * Model Validator
 * Version : 1.0.0
 * ============================================
 */

const ModelValidator = {

    validateCreate(document){

        if(!document){

            throw new Error(
                "Document Model wajib diisi."
            );

        }

        if(!document.model){

            throw new Error(
                "Data Model wajib diisi."
            );

        }

        if(!document.model.id){

            throw new Error(
                "ID Model wajib diisi."
            );

        }

        if(!document.model.merkId){

            throw new Error(
                "MerkID Model wajib diisi."
            );

        }

        if(!document.model.nama){

            throw new Error(
                "Nama Model wajib diisi."
            );

        }

        if(
            document.model.status !== "AKTIF" &&
            document.model.status !== "NONAKTIF"
        ){

            throw new Error(
                "Status Model harus AKTIF atau NONAKTIF."
            );

        }

        return true;

    }

};
