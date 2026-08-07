/**
 * ============================================
 * Jasa Repository
 * ============================================
 */

const JasaRepository = {

    sheet(){

        return getSheet_(

            CONFIG.SHEET.JASA

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

                COL_JASA.TOTAL

            )

            .getValues();

    },

    getAll(){

        return this.findAll();

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

                data[i][COL_JASA.ID] == id

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

                COL_JASA.TOTAL

            )

            .getValues()[0];

    },

    getByKode(kode){

        return this.findById(kode);

    },

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

                    r[COL_JASA.NAMA]

                )

                .toLowerCase()

                .includes(keyword)

                ||

                String(

                    r[COL_JASA.KODE]

                )

                .toLowerCase()

                .includes(keyword)

                ||

                String(

                    r[COL_JASA.KATEGORI]

                )

                .toLowerCase()

                .includes(keyword)

            );

    }

};

function testFindAllJasa(){

    Logger.log(

        JasaRepository.findAll()

    );

}