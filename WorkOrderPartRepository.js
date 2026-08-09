/**
 * ============================================
 * Work Order Part Repository
 * Version : 2.0.1
 * ============================================
 */

const WorkOrderPartRepository = {

    /**
     * Mengambil Sheet WorkOrderPart
     */
    sheet(){

        return getSheet_(
            CONFIG.SHEET.WORK_ORDER_PART
        );

    },


    /**
     * Mengambil seluruh WorkOrderPart
     */
    findAll(){

        const sh = this.sheet();

        if(sh.getLastRow() < 2){

            return [];

        }

        return sh

            .getRange(

                2,
                1,
                sh.getLastRow() - 1,
                COL_WORK_ORDER_PART.TOTAL + 1

            )

            .getValues();

    },


    /**
     * Mencari nomor baris berdasarkan ID
     */
    findRowById(workOrderPartId){

        const data =
            this.findAll();

        for(
            let i = 0;
            i < data.length;
            i++
        ){

            if(

                String(
                    data[i][
                        COL_WORK_ORDER_PART.ID
                    ]
                ).trim()

                ===

                String(
                    workOrderPartId
                ).trim()

            ){

                return i + 2;

            }

        }

        return 0;

    },


    /**
     * Mengecek apakah WorkOrderPart ada
     */
    exists(workOrderPartId){

        return (

            this.findRowById(
                workOrderPartId
            ) > 0

        );

    },


    /**
     * Mengambil WorkOrderPart berdasarkan ID
     */
    findById(workOrderPartId){

        const row =
            this.findRowById(
                workOrderPartId
            );

        if(row === 0){

            return null;

        }

        return this.sheet()

            .getRange(

                row,
                1,
                1,
                COL_WORK_ORDER_PART.TOTAL + 1 

            )

            .getValues()[0];

    },


    /**
     * Mencari semua Part berdasarkan Work Order
     */
    findByWorkOrderId(workOrderId){

        return this.findAll()

            .filter(row =>

                String(

                    row[
                        COL_WORK_ORDER_PART
                            .WORK_ORDER_ID
                    ]

                ).trim()

                ===

                String(
                    workOrderId
                ).trim()

            );

    },


    /**
     * Mencari semua Part berdasarkan WorkOrderJasa
     */
    findByWorkOrderJasaId(workOrderJasaId){

        return this.findAll()

            .filter(row =>

                String(

                    row[
                        COL_WORK_ORDER_PART
                            .WORK_ORDER_JASA_ID
                    ]

                ).trim()

                ===

                String(
                    workOrderJasaId
                ).trim()

            );

    },


    /**
     * Menyimpan WorkOrderPart baru
     */
    save(workOrderPart){

        if(!workOrderPart){

            throw new Error(
                "WorkOrderPart wajib diisi."
            );

        }


        if(!workOrderPart.id){

            throw new Error(
                "ID WorkOrderPart wajib diisi."
            );

        }


        if(this.exists(workOrderPart.id)){

            throw new Error(
                "WorkOrderPart sudah ada : " +
                workOrderPart.id
            );

        }


        this.sheet()

            .appendRow([

                workOrderPart.id,

                workOrderPart.workOrderId,

                workOrderPart.workOrderJasaId,

                workOrderPart.barangId,

                workOrderPart.namaBarangSnapshot,

                workOrderPart.qty,

                workOrderPart.harga,

                workOrderPart.diskon,

                workOrderPart.status,

                workOrderPart.catatan,

                workOrderPart.createdAt,

                workOrderPart.updatedAt,

                workOrderPart.total

            ]);


        return {

            success : true,

            workOrderPartId :
                workOrderPart.id

        };

    }

};