/**
 * ============================================
 * Work Order Repository
 * Version : 1.1.0
 * ============================================
 */

const WorkOrderRepository = {

    getColumnMap_:function(){
        return this.sheet().getRange(1,1,1,this.sheet().getLastColumn()).getDisplayValues()[0].reduce(function(map,name,index){name=String(name||"").trim();if(name)map[name]=index;return map;},{});
    },

    getSettlementMetadata:function(workOrderId){
        const row=this.findRowById(workOrderId), columns=this.getColumnMap_();
        if(!row)return null;
        const values=this.sheet().getRange(row,1,1,this.sheet().getLastColumn()).getValues()[0], get=function(name){return columns[name]===undefined?"":values[columns[name]]||"";};
        return {workOrderId:String(values[columns.ID===undefined?0:columns.ID]||""),settlementStatus:get("SettlementStatus"),settlementIdentity:get("SettlementIdentity"),settlementSalesNumber:get("SettlementSalesNumber"),settlementFingerprint:get("SettlementFingerprint"),settledAt:get("SettledAt")};
    },

    updateSettlementMetadata:function(workOrderId,metadata){
        const row=this.requireRow(workOrderId), columns=this.getColumnMap_(), required=["SettlementStatus","SettlementIdentity","SettlementSalesNumber","SettlementFingerprint","SettledAt"], missing=required.filter(function(name){return columns[name]===undefined;});
        if(missing.length)throw new Error("Schema settlement Work Order belum siap: "+missing.join(", "));
        const data=metadata||{}, values=required.map(function(name){const key=name.charAt(0).toLowerCase()+name.slice(1);return data[key]===undefined||data[key]===null?"":data[key];});
        this.sheet().getRange(row,columns.SettlementStatus+1,1,required.length).setValues([values]);
        return this.getSettlementMetadata(workOrderId);
    },

    isWorkOrderSettled:function(workOrderId){const metadata=this.getSettlementMetadata(workOrderId);return !!metadata&&String(metadata.settlementStatus||"").trim()==="SETTLED";},

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

        const row = this.findRowById(
            workOrderId
        );

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

                COL_WORK_ORDER.TOTAL

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

                workOrder.updatedAt,

                workOrder.jenisTransaksi

            ]);

        return {

            success : true,

            workOrderId : workOrder.id

        };

    },
/**
 * ============================================
 * Mengubah Status Work Order
 * ============================================
 */
updateStatus(
    workOrderId,
    status
){

    /**
     * ========================================
     * Pastikan Work Order ada
     * ========================================
     */

    const row =
        this.requireRow(
            workOrderId
        );


    const sh =
        this.sheet();


    /**
     * ========================================
     * UPDATE STATUS
     * ========================================
     */

    sh.getRange(
        row,
        COL_WORK_ORDER.STATUS + 1
    ).setValue(
        status
    );


    /**
     * ========================================
     * UPDATE WAKTU PERUBAHAN
     * ========================================
     */

    sh.getRange(
        row,
        COL_WORK_ORDER.DIUBAH_PADA + 1
    ).setValue(
        new Date()
    );


    /**
     * ========================================
     * RETURN
     * ========================================
     */

    return {

        success :
            true,

        workOrderId :
            workOrderId,

        status :
            status

    };

}
   
};
