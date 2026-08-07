const WorkOrderJasaRepository = {

    sheet(){

        return SpreadsheetApp

            .getActive()

            .getSheetByName(

                CONFIG.SHEET.WORK_ORDER_JASA

            );

    },

    findAll(){

        const lastRow =

            this.sheet().getLastRow();

        if(lastRow <= 1){

            return [];

        }

        return this.sheet()

            .getRange(

                2,

                1,

                lastRow - 1,

                17

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

                data[i][COL_WO_JASA.ID] == id

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

                17

            )

            .getValues()[0];

    },

    findByWorkOrderId(workOrderId){

    const data = this.findAll();

    const result = [];

    for(

        let i = 0;

        i < data.length;

        i++

    ){

        if(

            data[i][COL_WO_JASA.WORK_ORDER_ID] ==

            workOrderId

        ){

            result.push(

                data[i]

            );

        }

    }

    return result;

},

countByWorkOrderId(workOrderId){

    return this

        .findByWorkOrderId(
            workOrderId
        )

        .length;

},

    save(workOrderJasa){

    if(

        this.exists(
            workOrderJasa.id
        )

    ){

        throw new Error(

            "Work Order Jasa sudah ada : " +

            workOrderJasa.id

        );

    }

    this.sheet()

        .appendRow([

            workOrderJasa.id,

            workOrderJasa.workOrderId,

            workOrderJasa.urutan,

            workOrderJasa.jasaId,

            workOrderJasa.namaJasaSnapshot,

            workOrderJasa.keluhan,

            workOrderJasa.diagnosa,

            workOrderJasa.mekanikId,

            workOrderJasa.mekanikNameSnapshot,

            workOrderJasa.qty,

            workOrderJasa.harga,

            workOrderJasa.diskon,

            workOrderJasa.subtotal,

            workOrderJasa.status,

            workOrderJasa.catatan,

            workOrderJasa.createdAt,

            workOrderJasa.updatedAt

        ]);

    return {

        success : true,

        workOrderJasaId :

            workOrderJasa.id

    };

},

update(workOrderJasa){

    const row =

        this.findRowById(
            workOrderJasa.id
        );

    if(row === 0){

        throw new Error(

            "Work Order Jasa tidak ditemukan : " +

            workOrderJasa.id

        );

    }

    workOrderJasa.updatedAt =

        new Date();

    this.sheet()

        .getRange(

            row,

            1,

            1,

            17

        )

        .setValues([

            [

                workOrderJasa.id,

                workOrderJasa.workOrderId,

                workOrderJasa.urutan,

                workOrderJasa.jasaId,

                workOrderJasa.namaJasaSnapshot,

                workOrderJasa.keluhan,

                workOrderJasa.diagnosa,

                workOrderJasa.mekanikId,

                workOrderJasa.mekanikNameSnapshot,

                workOrderJasa.qty,

                workOrderJasa.harga,

                workOrderJasa.diskon,

                workOrderJasa.subtotal,

                workOrderJasa.status,

                workOrderJasa.catatan,

                workOrderJasa.createdAt,

                workOrderJasa.updatedAt

            ]

        ]);

    return {

        success : true,

        workOrderJasaId :

            workOrderJasa.id

    };

},

existsByWorkOrderAndJasa(

    workOrderId,

    jasaId

){

    const data =

        this.findByWorkOrderId(

            workOrderId

        );

    for(

        let i = 0;

        i < data.length;

        i++

    ){

        if(

            data[i][COL_WO_JASA.JASA_ID] ==

            jasaId

        ){

            return true;

        }

    }

    return false;

},

};