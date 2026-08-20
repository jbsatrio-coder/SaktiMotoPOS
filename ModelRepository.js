/**
 * ============================================
 * Model Repository
 * Version : 1.0.0
 * ============================================
 */

const ModelRepository = {

    sheet(){

        return getSheet(
            CONFIG.SHEET.MODEL
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
            sheet
                .getRange(
                    2,
                    1,
                    lastRow - 1,
                    COL_MODEL.TOTAL
                )
                .getValues();

        return data
            .filter(row =>
                String(
                    row[COL_MODEL.ID] || ""
                ).trim() !== ""
            )
            .map(row => ({

                id:
                    String(
                        row[COL_MODEL.ID]
                    ).trim(),

                merkId:
                    String(
                        row[COL_MODEL.MERK_ID] || ""
                    ).trim(),

                nama:
                    String(
                        row[COL_MODEL.NAMA] || ""
                    ).trim(),

                status:
                    String(
                        row[COL_MODEL.STATUS] || ""
                    )
                    .trim()
                    .toUpperCase(),

                createdAt:
                    row[COL_MODEL.CREATED_AT] || "",

                updatedAt:
                    row[COL_MODEL.UPDATED_AT] || ""

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
                model =>
                    model.id === target
            ) || null;

    },


    exists(id){

        return !!this.findById(id);

    },


    existsByMerkAndNama(
        merkId,
        nama
    ){

        const targetMerk =
            String(
                merkId || ""
            )
            .trim();

        const targetNama =
            String(
                nama || ""
            )
            .trim()
            .toLowerCase();

        if(
            !targetMerk ||
            !targetNama
        ){

            return false;

        }

        return this.findAll()
            .some(model =>
                model.merkId === targetMerk &&
                String(
                    model.nama || ""
                )
                .trim()
                .toLowerCase() === targetNama
            );

    },


    save(model){

        if(!model){

            throw new Error(
                "Data Model wajib diisi."
            );

        }

        if(
            this.exists(
                model.id
            )
        ){

            throw new Error(
                "Model sudah terdaftar : " +
                model.id
            );

        }

        if(
            this.existsByMerkAndNama(
                model.merkId,
                model.nama
            )
        ){

            throw new Error(
                "Model sudah terdaftar untuk Merk tersebut : " +
                model.merkId +
                " | " +
                model.nama
            );

        }

        const sheet =
            this.sheet();

        const row =
            sheet.getLastRow() + 1;

        const now =
            new Date();

        sheet
            .getRange(
                row,
                1,
                1,
                COL_MODEL.TOTAL
            )
            .setValues([[
                model.id,
                model.merkId,
                model.nama,
                model.status || "AKTIF",
                model.createdAt || now,
                model.updatedAt || now
            ]]);

        Logger.log(
            "[MODEL SAVE] " +
            model.id +
            " | " +
            model.merkId +
            " | " +
            model.nama +
            " | Row: " +
            row
        );

        return {

            id:
                model.id,

            merkId:
                model.merkId,

            nama:
                model.nama,

            status:
                model.status || "AKTIF"

        };

    }

};
