/**
 * ============================================
 * Merk Repository
 * Version : 1.0.0
 * ============================================
 */

const MerkRepository = {

    sheet(){

        return getSheet(
            CONFIG.SHEET.MERK
        );

    },


    findAll(){

        const sheet =
            this.sheet();

        const lastRow =
            sheet.getLastRow();

        if(lastRow < 2){

            return [];

        }

        const data =
            sheet.getRange(
                2,
                1,
                lastRow - 1,
                COL_MERK.TOTAL
            ).getValues();

        return data
            .filter(row =>
                String(
                    row[COL_MERK.ID] || ""
                ).trim() !== ""
            )
            .map(row => ({

                id:
                    String(
                        row[COL_MERK.ID]
                    ).trim(),

                nama:
                    String(
                        row[COL_MERK.NAMA] || ""
                    ).trim()

            }));

    },


    findById(id){

        const target =
            String(
                id || ""
            ).trim();

        if(!target){

            return null;

        }

        return this.findAll()
            .find(
                merk =>
                    merk.id === target
            ) || null;

    },


    exists(id){

        return !!this.findById(id);

    },


    existsByNama(nama){

        const target =
            String(
                nama || ""
            )
            .trim()
            .toLowerCase();

        if(!target){

            return false;

        }

        return this.findAll()
            .some(
                merk =>
                    String(
                        merk.nama || ""
                    )
                    .trim()
                    .toLowerCase() === target
            );

    },


    save(merk){

        if(!merk){

            throw new Error(
                "Data Merk wajib diisi."
            );

        }

        if(
            this.exists(
                merk.id
            )
        ){

            throw new Error(
                "Merk sudah terdaftar : " +
                merk.id
            );

        }

        if(
            this.existsByNama(
                merk.nama
            )
        ){

            throw new Error(
                "Nama Merk sudah terdaftar : " +
                merk.nama
            );

        }

        const sheet =
            this.sheet();

        const row =
            sheet.getLastRow() + 1;

        sheet
            .getRange(
                row,
                1,
                1,
                COL_MERK.TOTAL
            )
            .setValues([[
                merk.id,
                merk.nama
            ]]);

        Logger.log(
            "[MERK SAVE] " +
            merk.id +
            " | " +
            merk.nama +
            " | Row: " +
            row
        );

        return {

            id:
                merk.id,

            nama:
                merk.nama

        };

    }

};