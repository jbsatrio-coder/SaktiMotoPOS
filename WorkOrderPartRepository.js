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
     * Fresh read untuk critical section canonical
     * yang perlu melihat status WOP dari execution
     * sebelumnya setelah ScriptLock diperoleh.
     * Method findAll() lama tidak diubah.
     */
    findAllFresh(){

        SpreadsheetApp.flush();

        const activeSpreadsheet =
            SpreadsheetApp.getActiveSpreadsheet();

        const ss =
            SpreadsheetApp.openById(
                activeSpreadsheet.getId()
            );

        const sh =
            ss.getSheetByName(
                CONFIG.SHEET.WORK_ORDER_PART
            );

        if(!sh || sh.getLastRow() < 2){

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

    findByIdFresh(workOrderPartId){

        const targetId =
            String(workOrderPartId || "").trim();

        if(!targetId){

            return null;

        }

        const data =
            this.findAllFresh();

        for(
            let i = 0;
            i < data.length;
            i++
        ){

            if(
                String(
                    data[i][COL_WORK_ORDER_PART.ID] || ""
                ).trim() === targetId
            ){

                return data[i];

            }

        }

        return null;

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

    },

        /**
     * ========================================
     * UPDATE WORK ORDER PART
     * ========================================
     */
    update(workOrderPart){

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


        const row =
            this.findRowById(
                workOrderPart.id
            );


        if(row === 0){

            throw new Error(
                "WorkOrderPart tidak ditemukan : " +
                workOrderPart.id
            );

        }


        const current =
            this.findById(
                workOrderPart.id
            );


        /**
         * ====================================
         * BUILD UPDATED ROW
         * ====================================
         *
         * Field yang tidak diberikan oleh
         * caller dipertahankan dari row lama.
         * ====================================
         */

        const updatedRow = [

            workOrderPart.id,

            workOrderPart.workOrderId !== undefined
                ?
            workOrderPart.workOrderId
                :
            current[
                COL_WORK_ORDER_PART.WORK_ORDER_ID
            ],


            workOrderPart.workOrderJasaId !== undefined
                ?
            workOrderPart.workOrderJasaId
                :
            current[
                COL_WORK_ORDER_PART.WORK_ORDER_JASA_ID
            ],


            workOrderPart.barangId !== undefined
                ?
            workOrderPart.barangId
                :
            current[
                COL_WORK_ORDER_PART.BARANG_ID
            ],


            workOrderPart.namaBarangSnapshot !== undefined
                ?
            workOrderPart.namaBarangSnapshot
                :
            current[
                COL_WORK_ORDER_PART.NAMA_BARANG_SNAPSHOT
            ],


            workOrderPart.qty !== undefined
                ?
            workOrderPart.qty
                :
            current[
                COL_WORK_ORDER_PART.QTY
            ],


            workOrderPart.harga !== undefined
                ?
            workOrderPart.harga
                :
            current[
                COL_WORK_ORDER_PART.HARGA
            ],


            workOrderPart.diskon !== undefined
                ?
            workOrderPart.diskon
                :
            current[
                COL_WORK_ORDER_PART.DISKON
            ],


            workOrderPart.status !== undefined
                ?
            workOrderPart.status
                :
            current[
                COL_WORK_ORDER_PART.STATUS
            ],


            workOrderPart.catatan !== undefined
                ?
            workOrderPart.catatan
                :
            current[
                COL_WORK_ORDER_PART.CATATAN
            ],


            current[
                COL_WORK_ORDER_PART.DIBUAT_PADA
            ],


            workOrderPart.updatedAt !== undefined
                ?
            workOrderPart.updatedAt
                :
            new Date(),


            workOrderPart.total !== undefined
                ?
            workOrderPart.total
                :
            current[
                COL_WORK_ORDER_PART.TOTAL
            ]

        ];


        this.sheet()
            .getRange(
                row,
                1,
                1,
                COL_WORK_ORDER_PART.TOTAL + 1
            )
            .setValues([
                updatedRow
            ]);


        return {

            success :
                true,

            workOrderPartId :
                workOrderPart.id

        };

    },

};
