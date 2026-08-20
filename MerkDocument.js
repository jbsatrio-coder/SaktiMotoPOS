/**
 * ============================================
 * Merk Document
 * Version : 1.0.0
 * ============================================
 */

const MerkDocument = {

    create(payload){

        if(!payload){

            throw new Error(
                "Payload Merk wajib diisi."
            );

        }

        const document = {

            merk: {

                id:
                    String(
                        payload.id || ""
                    ).trim(),

                nama:
                    String(
                        payload.nama || ""
                    ).trim()

            }

        };

        return document;

    }

};