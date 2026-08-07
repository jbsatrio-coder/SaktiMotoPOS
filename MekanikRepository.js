/**
 * ============================================
 * Mekanik Repository
 * Version : 2.0.0
 * ============================================
 */

const MekanikRepository = {

    sheet(){

        return getSheet_(

            CONFIG.SHEET.MEKANIK

        );

    },

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

                COL_MEKANIK.TOTAL

            )

            .getValues();

    },

    findRowById(id){

        const data =

            this.findAll();

        for(

            let i = 0;

            i < data.length;

            i++

        ){

            if(

                data[i][COL_MEKANIK.ID] == id

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

                COL_MEKANIK.TOTAL

            )

            .getValues()[0];

    },

    search(keyword){

        keyword =

            String(

                keyword || ""

            )

            .toLowerCase()

            .trim();

        return this.findAll()

            .filter(row =>

                String(

                    row[COL_MEKANIK.NAMA]

                )

                .toLowerCase()

                .includes(keyword)

            );

    },

    save(mekanik){

        if(

            this.exists(

                mekanik.id

            )

        ){

            throw new Error(

                "Mekanik sudah ada : " +

                mekanik.id

            );

        }

        this.sheet()

            .appendRow([

                mekanik.id,

                mekanik.nama,

                mekanik.noHp,

                mekanik.jabatan,

                mekanik.tanggalMasuk,

                mekanik.gajiPokok,

                mekanik.tipeKomisi,

                mekanik.persentase,

                mekanik.status,

                mekanik.createdAt,

                mekanik.updatedAt

            ]);

        return {

            success : true,

            mekanikId :

                mekanik.id

        };

    },

    update(mekanik){

        const row =

            this.findRowById(

                mekanik.id

            );

        if(row === 0){

            throw new Error(

                "Mekanik tidak ditemukan : " +

                mekanik.id

            );

        }

        mekanik.updatedAt =

            new Date();

        this.sheet()

            .getRange(

                row,

                1,

                1,

                COL_MEKANIK.TOTAL

            )

            .setValues([

                [

                    mekanik.id,

                    mekanik.nama,

                    mekanik.noHp,

                    mekanik.jabatan,

                    mekanik.tanggalMasuk,

                    mekanik.gajiPokok,

                    mekanik.tipeKomisi,

                    mekanik.persentase,

                    mekanik.status,

                    mekanik.createdAt,

                    mekanik.updatedAt

                ]

            ]);

        return {

            success : true,

            mekanikId :

                mekanik.id

        };

    }

};