/**
 * ============================================
 * Kategori Document
 * Version : 1.0.0
 * ============================================
 */

const KategoriDocument = {

    create(payload){

        if(!payload){

            throw new Error(
                "Payload Kategori wajib diisi."
            );

        }

        const kategori = {

            id:
                String(
                    payload.id || ""
                ).trim(),

            nama:
                String(
                    payload.nama || ""
                ).trim()

        };

        return {

            kategori:
                kategori

        };

    }

};
