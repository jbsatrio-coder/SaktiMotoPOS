/**
 * ============================================
 * Jasa Validator
 * Version : 1.0.0
 * ============================================
 */

const JasaValidator = {

    /**
     * ==========================================
     * VALIDATE CREATE
     * ==========================================
     */

    validateCreate(document){

        if(!document){

            throw new Error(
                "Document Jasa wajib diisi."
            );

        }


        if(!document.jasa){

            throw new Error(
                "Document Jasa tidak memiliki object jasa."
            );

        }


        const jasa =
            document.jasa;


        // ======================================
        // ID
        // ======================================

        if(
            jasa.id &&
            String(jasa.id).trim() !== ""
        ){

            if(
                !/^JAS\d{6}$/.test(
                    String(jasa.id).trim()
                )
            ){

                throw new Error(
                    "ID Jasa tidak valid: " +
                    jasa.id
                );

            }

        }


        // ======================================
        // NAMA
        // ======================================

        if(
            !String(
                jasa.nama || ""
            ).trim()
        ){

            throw new Error(
                "Nama Jasa wajib diisi."
            );

        }


        // ======================================
        // HARGA
        // ======================================

        const harga =
            Number(jasa.harga);


        if(
            !isFinite(harga) ||
            harga <= 0
        ){

            throw new Error(
                "Harga Jasa harus lebih dari 0."
            );

        }


       // ======================================
// MODE KOMISI
// ======================================

const modeKomisi =
    String(
        jasa.modeKomisi || "MEKANIK"
    )
    .trim()
    .toUpperCase();


const allowedModeKomisi = [
    "MEKANIK",
    "JASA"
];


if(
    !allowedModeKomisi.includes(
        modeKomisi
    )
){

    throw new Error(
        "Mode Komisi Jasa tidak valid: " +
        modeKomisi
    );

}


jasa.modeKomisi =
    modeKomisi;


// ======================================
// KOMISI
// ======================================

if(
    modeKomisi === "JASA"
){

    if(
        jasa.komisi === "" ||
        jasa.komisi === null ||
        jasa.komisi === undefined
    ){

        throw new Error(
            "Komisi Jasa wajib diisi jika Mode Komisi = JASA."
        );

    }


    const komisi =
        Number(jasa.komisi);


    if(
        !isFinite(komisi) ||
        komisi < 0
    ){

        throw new Error(
            "Komisi Jasa tidak valid."
        );

    }


    if(
        komisi > harga
    ){

        throw new Error(
            "Komisi tidak boleh lebih besar dari harga jasa."
        );

    }

}
else {

    // Mode MEKANIK tidak menggunakan
    // komisi khusus pada MasterJasa.

    if(
        jasa.komisi === "" ||
        jasa.komisi === null ||
        jasa.komisi === undefined
    ){

        jasa.komisi = 0;

    }

}


        // ======================================
        // STATUS
        // ======================================

        const status =
            String(
                jasa.status || "AKTIF"
            )
            .trim()
            .toUpperCase();


        const allowedStatus = [
            "AKTIF",
            "NONAKTIF"
        ];


        if(
            !allowedStatus.includes(status)
        ){

            throw new Error(
                "Status Jasa tidak valid: " +
                status
            );

        }


        // ======================================
        // NORMALISASI STATUS
        // ======================================

        jasa.status =
            status;


        return true;

    }

};