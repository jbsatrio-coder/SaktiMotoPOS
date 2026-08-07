/**
 * ============================================
 * Mekanik Document
 * Version : 1.0.0
 * ============================================
 */

const MekanikDocument = {

    create(payload){

        return {

            mekanik : {

                id :

                    payload.id || "",

                nama :

                    payload.nama || "",

                noHp :

                    payload.noHp || "",

                jabatan :

                    payload.jabatan || "",

                tanggalMasuk :

                    payload.tanggalMasuk ||

                    new Date(),

                gajiPokok :

                    Number(
                        payload.gajiPokok || 0
                    ),

                tipeKomisi :

                    payload.tipeKomisi || "",

                persentase :

                    Number(
                        payload.persentase || 0
                    ),

                status :

                    payload.status ||

                    "AKTIF",

                createdAt :

                    payload.createdAt ||

                    new Date(),

                updatedAt :

                    payload.updatedAt || ""

            }

        };

    }

};