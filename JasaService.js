/**
 * ============================================
 * Jasa Service
 * Version : 1.0.0
 * ============================================
 */

const JasaService = {

    /**
     * ==========================================
     * CREATE JASA
     * ==========================================
     */

    create(payload){

        // ======================================
        // 1. VALIDASI PAYLOAD
        // ======================================

        if(!payload){

            throw new Error(
                "Payload Jasa wajib diisi."
            );

        }


        // ======================================
        // 2. GENERATE ID JASA
        // ======================================

        const id =
            payload.id ||
            generateJasaId_();


        // ======================================
        // 3. BUAT DOCUMENT
        // ======================================

        const document =
            JasaDocument.create({

                ...payload,

                id:
                    id

            });


        // ======================================
        // 4. VALIDASI DOCUMENT
        // ======================================

        JasaValidator.validateCreate(
            document
        );


        // ======================================
        // 5. SIMPAN
        // ======================================

        const result =
            JasaRepository.save(
                document
            );


        // ======================================
        // 6. LOG
        // ======================================

        Logger.log(

            "[JASA CREATE] " +

            id +

            " | " +

            document.jasa.nama

        );


        return result;

    }

};