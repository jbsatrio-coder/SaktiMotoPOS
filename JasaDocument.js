/**
 * ============================================
 * Jasa Document
 * Version : 2.0.0
 * ============================================
 */

const JasaDocument = {

    create(payload){

        if(!payload){

            throw new Error(
                "Payload Jasa wajib diisi."
            );

        }


        const modeKomisi =
            String(
                payload.modeKomisi || "MEKANIK"
            )
            .trim()
            .toUpperCase();


        const jasa = {

            id:
                String(
                    payload.id || ""
                ).trim(),

            nama:
                String(
                    payload.nama || ""
                ).trim(),


            harga:
                Number(
                    payload.harga || 0
                ),

            komisi:
                payload.komisi === "" ||
                payload.komisi === undefined ||
                payload.komisi === null
                    ? ""
                    : Number(payload.komisi),

            estimasi:
                String(
                    payload.estimasi || ""
                ).trim(),

            status:
                String(
                    payload.status || "AKTIF"
                )
                .trim()
                .toUpperCase(),

            modeKomisi:
                modeKomisi

        };


        return {

            jasa:
                jasa

        };

    }

};