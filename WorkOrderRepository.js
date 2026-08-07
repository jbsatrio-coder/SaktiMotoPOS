/**
 * ============================================
 * Work Order Repository
 * Version : 1.0.0
 * ============================================
 */

const WorkOrderRepository = {

    /**
     * Mengambil Sheet Work Order
     */
    sheet(){

        return getSheet_(
            CONFIG.SHEET.WORK_ORDER
        );

    },

    /**
     * Mengambil seluruh Work Order
     */
    findAll(){

        const sh = this.sheet();

        if(sh.getLastRow() < 2){

            return [];

        }

        return sh
            .getDataRange()
            .getValues()
            .slice(1);

    },

    /**
 * Mencari nomor baris berdasarkan ID Work Order
 */
findRowById(workOrderId){

    const sh = this.sheet();

    const lastRow = sh.getLastRow();

    if(lastRow < 2){

        return 0;

    }

    const ids = sh

        .getRange(

            2,

            SHEET_COL_WORK_ORDER.ID,

            lastRow - 1,

            1

        )

        .getValues();

    for(let i = 0; i < ids.length; i++){

        if(

            String(ids[i][0]).trim() ===

            String(workOrderId).trim()

        ){

            return i + 2;

        }

    }

    return 0;

},

/**
 * Memastikan Work Order ada
 */
requireRow(workOrderId){

    const row = this.findRowById(workOrderId);

    if(row === 0){

        throw new Error(

            "Work Order tidak ditemukan : " +

            workOrderId

        );

    }

    return row;

},

/**
 * Mengecek apakah Work Order ada
 */
exists(workOrderId){

    return this.findRowById(
        workOrderId
    ) > 0;

},

/**
 * Mengambil satu Work Order berdasarkan ID
 */
findById(workOrderId){

    const row = this.findRowById(
        workOrderId
    );

    if(row === 0){

        return null;

    }

    return this.sheet()

        .getRange(
            row,
            1,
            1,
            15
        )

        .getValues()[0];

},

/**
 * Menyimpan Work Order baru
 */
save(workOrder){

    this.sheet()

        .appendRow([

            workOrder.id,

            workOrder.customerId,

            workOrder.customerNameSnapshot,

            workOrder.vehicleId,

            workOrder.noPolisiSnapshot,

            workOrder.merkSnapshot,

            workOrder.modelSnapshot,

            workOrder.kilometerMasuk,

            workOrder.status,

            workOrder.prioritas,

            workOrder.estimasiSelesai,

            workOrder.admin,

            workOrder.catatan,

            workOrder.createdAt,

            workOrder.updatedAt

        ]);

    return {

        success : true,

        workOrderId : workOrder.id

    };

},

};

