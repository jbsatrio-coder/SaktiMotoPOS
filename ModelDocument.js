/**
 * ============================================
 * Model Document
 * Version : 1.0.0
 * ============================================
 */

const ModelDocument = {

    create(payload){

        if(!payload){

            throw new Error(
                "Payload Model wajib diisi."
            );

        }

        const document = {

            model: {

                id:
                    String(
                        payload.id || ""
                    ).trim(),

                merkId:
                    String(
                        payload.merkId || ""
                    ).trim(),

                nama:
                    String(
                        payload.nama || ""
                    ).trim(),

                status:
                    String(
                        payload.status || "AKTIF"
                    )
                    .trim()
                    .toUpperCase(),

                createdAt:
                    payload.createdAt || "",

                updatedAt:
                    payload.updatedAt || ""

            }

        };

        return document;

    }

};
