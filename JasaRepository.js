/**
 * ============================================
 * Jasa Repository
 * Version : 2.0.0
 * ============================================
 */

const JasaRepository = {

    sheet(){

        return getSheet_(
            CONFIG.SHEET.JASA
        );

    },


    /**
     * ==========================================
     * FIND ALL
     * ==========================================
     */

    findAll(){

        const sh = this.sheet();

        if(
            sh.getLastRow() <= 1
        ){

            return [];

        }

        return sh

            .getRange(

                2,

                1,

                sh.getLastRow() - 1,

                COL_JASA.TOTAL

            )

            .getValues();

    },


    getAll(){

        return this.findAll();

    },


    /**
     * ==========================================
     * FIND ROW BY ID
     * ==========================================
     */

    findRowById(id){

        const data =
            this.findAll();

        const targetId =
            String(id || "").trim();


        for(
            let i = 0;
            i < data.length;
            i++
        ){

            if(
                String(
                    data[i][COL_JASA.ID] || ""
                ).trim() === targetId
            ){

                return i + 2;

            }

        }


        return 0;

    },


    /**
     * ==========================================
     * EXISTS
     * ==========================================
     */

    exists(id){

        return this.findRowById(id) > 0;

    },


    /**
     * ==========================================
     * FIND BY ID
     * ==========================================
     */

    findById(id){

        const row =
            this.findRowById(id);


        if(
            row === 0
        ){

            return null;

        }


        return this.sheet()

            .getRange(

                row,

                1,

                1,

                COL_JASA.TOTAL

            )

            .getValues()[0];

    },


    /**
     * ==========================================
     * SEARCH
     * ==========================================
     */

    search(keyword){

    keyword =
        String(
            keyword || ""
        )
        .toLowerCase()
        .trim();


    return this.findAll()

        .filter(r =>

            String(
                r[COL_JASA.ID] || ""
            )
            .toLowerCase()
            .includes(keyword)

            ||

            String(
                r[COL_JASA.NAMA] || ""
            )
            .toLowerCase()
            .includes(keyword)

        );

},


    /**
     * ==========================================
     * CARI ROW KOSONG PERTAMA
     *
     * Tidak menggunakan appendRow().
     *
     * Ini menghindari masalah data masuk
     * ke row 1003 karena formatting sheet.
     * ==========================================
     */

    findFirstEmptyRow_(){

        const sheet =
            this.sheet();


        const maxRows =
            sheet.getMaxRows();


        if(
            maxRows < 2
        ){

            return 2;

        }


        const ids =
            sheet
                .getRange(
                    2,
                    COL_JASA.ID + 1,
                    maxRows - 1,
                    1
                )
                .getValues();


        for(
            let i = 0;
            i < ids.length;
            i++
        ){

            const id =
                String(
                    ids[i][0] || ""
                ).trim();


            if(!id){

                return i + 2;

            }

        }


        // Jika semua row terisi,
        // tambahkan satu row baru.

        sheet.insertRowAfter(
            maxRows
        );


        return maxRows + 1;

    },


    /**
     * ==========================================
     * SAVE JASA BARU
     * ==========================================
     */

    save(document){

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
        // CEK ID
        // ======================================

        const id =
            String(
                jasa.id || ""
            ).trim();


        if(!id){

            throw new Error(
                "ID Jasa wajib diisi."
            );

        }


        // ======================================
        // CEK DUPLIKAT
        // ======================================

        if(
            this.exists(id)
        ){

            throw new Error(
                "Jasa sudah terdaftar : " +
                id
            );

        }


        // ======================================
        // MODE KOMISI
        // ======================================

        const modeKomisi =
            String(
                jasa.modeKomisi ||
                "MEKANIK"
            )
            .trim()
            .toUpperCase();


        if(
            modeKomisi !== "MEKANIK" &&
            modeKomisi !== "JASA"
        ){

            throw new Error(
                "Mode Komisi tidak valid : " +
                modeKomisi
            );

        }


        // ======================================
        // KOMISI
        // ======================================

        let komisi = 0;


        if(
            modeKomisi === "JASA"
        ){

            if(
                jasa.komisi === "" ||
                jasa.komisi === null ||
                jasa.komisi === undefined
            ){

                throw new Error(
                    "Komisi wajib diisi untuk Mode Komisi JASA."
                );

            }


            komisi =
                Number(
                    jasa.komisi
                );


            if(
                !isFinite(komisi) ||
                komisi < 0
            ){

                throw new Error(
                    "Nilai Komisi Jasa tidak valid."
                );

            }

        }


        // ======================================
        // DATA
        // ======================================

        const now =
            new Date();


        const row = [

            id,

            String(
                jasa.nama || ""
            ).trim(),

            "", // Kategori — sudah dihapus dari modul

            Number(
                jasa.harga || 0
            ),

            komisi,

            String(
                jasa.estimasi || ""
            ).trim(),

            String(
                jasa.status || "AKTIF"
            )
            .trim()
            .toUpperCase(),

            modeKomisi,

            String(
                jasa.catatan || ""
            ).trim(),

            jasa.createdAt ||
                now,

            jasa.updatedAt ||
                ""

        ];


        // ======================================
        // LOCK
        // ======================================

        const lock =
            LockService.getScriptLock();


        lock.waitLock(
            30000
        );


        try {

            // ==================================
            // CARI ROW KOSONG
            // ==================================

            const targetRow =
                this.findFirstEmptyRow_();


            // ==================================
            // TULIS DATA
            // ==================================

            this.sheet()

                .getRange(
                    targetRow,
                    1,
                    1,
                    COL_JASA.TOTAL
                )

                .setValues([
                    row
                ]);


            // ==================================
            // LOG
            // ==================================

            Logger.log(

                "[JASA SAVE] " +

                id +

                " | " +

                jasa.nama +

                " | ModeKomisi: " +

                modeKomisi +

                " | Row: " +

                targetRow

            );


            return {

                id:
                    id,

                nama:
                    row[
                        COL_JASA.NAMA
                    ],


                harga:
                    row[
                        COL_JASA.HARGA
                    ],

                komisi:
                    row[
                        COL_JASA.KOMISI
                    ],

                estimasi:
                    row[
                        COL_JASA.ESTIMASI
                    ],

                status:
                    row[
                        COL_JASA.STATUS
                    ],

                modeKomisi:
                    row[
                        COL_JASA.MODE_KOMISI
                    ],

                catatan:
                    row[
                        COL_JASA.CATATAN
                    ]

            };

        }

        finally {

            lock.releaseLock();

        }

    }

};