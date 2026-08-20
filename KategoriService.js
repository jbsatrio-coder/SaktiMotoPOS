/**
 * ============================================
 * Kategori Service
 * Version : 1.1.0
 * ============================================
 */

const KategoriService = {

    /**
     * ==========================================
     * GET ALL KATEGORI
     * ==========================================
     */

    getAll(){

        const data =
            KategoriRepository.findAll();

        return data.map(function(row){

            return {

                id:
                    String(
                        row[COL_KATEGORI.ID] || ""
                    ).trim(),

                nama:
                    String(
                        row[COL_KATEGORI.NAMA] || ""
                    ).trim()

            };

        }).filter(function(kategori){

            return kategori.id &&
                   kategori.nama;

        });

    },

    getAll(){

    const rows =
        KategoriRepository.findAll();

    return rows
        .filter(row =>
            String(
                row[COL_KATEGORI.NAMA] || ""
            ).trim() !== ""
        )
        .map(row => ({
            id:
                String(
                    row[COL_KATEGORI.ID] || ""
                ).trim(),

            nama:
                String(
                    row[COL_KATEGORI.NAMA] || ""
                ).trim()
        }));

},


    /**
     * ==========================================
     * CREATE KATEGORI
     * ==========================================
     */

    create(payload){

        if(!payload){

            throw new Error(
                "Payload Kategori wajib diisi."
            );

        }


        // ======================================
        // 1. GENERATE ID
        // ======================================

        const id =
            payload.id ||
            generateKategoriId_();


        // ======================================
        // 2. CREATE DOCUMENT
        // ======================================

        const document =
            KategoriDocument.create({

                ...payload,

                id : id

            });


        // ======================================
        // 3. VALIDATE
        // ======================================

        KategoriValidator.validateCreate(
            document
        );


        // ======================================
        // 4. SAVE
        // ======================================

        const result =
            KategoriRepository.save(
                document.kategori
            );


        // ======================================
        // 5. LOG
        // ======================================

        Logger.log(

            "[KATEGORI CREATE] " +

            id +

            " | " +

            document.kategori.nama

        );


        return result;

    }

};
