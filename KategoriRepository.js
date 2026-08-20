/**
 * ============================================
 * Kategori Repository
 * Version : 1.0.0
 * ============================================
 */

const KategoriRepository = {

    sheet(){

        return getSheet_(
            CONFIG.SHEET.KATEGORI
        );

    },

    findAll(){

        const sh = this.sheet();

        if(sh.getLastRow() <= 1){
            return [];
        }

        return sh
            .getRange(
                2,
                1,
                sh.getLastRow() - 1,
                COL_KATEGORI.TOTAL
            )
            .getValues();

    },

    findRowById(id){

        const targetId =
            String(id || "").trim();

        const data =
            this.findAll();

        for(let i = 0; i < data.length; i++){

            if(
                String(
                    data[i][COL_KATEGORI.ID] || ""
                ).trim() === targetId
            ){

                return i + 2;

            }

        }

        return 0;

    },

    exists(id){

        return this.findRowById(id) > 0;

    },

    findById(id){

        const row =
            this.findRowById(id);

        if(row === 0){
            return null;
        }

        return this.sheet()
            .getRange(
                row,
                1,
                1,
                COL_KATEGORI.TOTAL
            )
            .getValues()[0];

    },

    search(keyword){

        keyword =
            String(keyword || "")
                .toLowerCase()
                .trim();

        return this.findAll()
            .filter(row =>

                String(
                    row[COL_KATEGORI.ID] || ""
                )
                .toLowerCase()
                .includes(keyword)

                ||

                String(
                    row[COL_KATEGORI.NAMA] || ""
                )
                .toLowerCase()
                .includes(keyword)

            );

    },

    save(kategori){

        if(!kategori){
            throw new Error(
                "Data kategori wajib diisi."
            );
        }

        const id =
            String(
                kategori.id || ""
            ).trim();

        const nama =
            String(
                kategori.nama || ""
            ).trim();

        if(!id){
            throw new Error(
                "ID Kategori wajib diisi."
            );
        }

        if(!nama){
            throw new Error(
                "Nama Kategori wajib diisi."
            );
        }

        if(this.exists(id)){
            throw new Error(
                "Kategori sudah terdaftar : " + id
            );
        }

        const sheet =
            this.sheet();

        const maxRows =
            sheet.getMaxRows();

        const ids =
            sheet
                .getRange(
                    2,
                    1,
                    maxRows - 1,
                    1
                )
                .getValues();

        let targetRow = 0;

        for(let i = 0; i < ids.length; i++){

            if(
                !String(ids[i][0] || "").trim()
            ){

                targetRow = i + 2;
                break;

            }

        }

        if(targetRow === 0){

            sheet.insertRowAfter(maxRows);

            targetRow =
                maxRows + 1;

        }

        sheet
            .getRange(
                targetRow,
                1,
                1,
                COL_KATEGORI.TOTAL
            )
            .setValues([
                [
                    id,
                    nama
                ]
            ]);

        Logger.log(
            "[KATEGORI SAVE] " +
            id +
            " | " +
            nama +
            " | Row: " +
            targetRow
        );

        return {
            id: id,
            nama: nama
        };

    }

};
