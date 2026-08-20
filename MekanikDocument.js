/**
 * ============================================
 * Mekanik Document
 * Version : 2.0.0
 * ============================================
 */

const MekanikDocument = {

    create(payload){

        if(!payload){

            throw new Error(
                "Payload Mekanik wajib diisi."
            );

        }

        const mekanik = {

            id:
                String(
                    payload.id || ""
                ).trim(),

            nama:
                String(
                    payload.nama || ""
                ).trim(),

            noHp:
                String(
                    payload.noHp || ""
                ).trim(),

            jabatan:
                String(
                    payload.jabatan || ""
                ).trim(),

            tanggalMasuk:
                payload.tanggalMasuk ||
                new Date(),

            gajiPokok:
                Number(
                    payload.gajiPokok || 0
                ),

            tipeKomisi:
                String(
                    payload.tipeKomisi ||
                    "PERSENTASE"
                )
                .trim()
                .toUpperCase(),

            nilaiKomisi:
                Number(
                    payload.nilaiKomisi || 0
                ),

            status:
                String(
                    payload.status ||
                    "AKTIF"
                )
                .trim()
                .toUpperCase(),

            createdAt:
                payload.createdAt ||
                new Date(),

            updatedAt:
                payload.updatedAt || "",

            urutanTampilan:
                Number(
                    payload.urutanTampilan || 0
                )

        };

        return {

            mekanik:
                mekanik

        };

    }

};