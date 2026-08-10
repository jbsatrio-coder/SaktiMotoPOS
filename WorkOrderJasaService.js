/**
 * ============================================
 * Work Order Jasa Service
 * Version : 1.0.0
 * ============================================
 */

const WorkOrderJasaService = {

    create(request){

        this.validate(request);

        const workOrder =

            this.loadWorkOrder(
                request
            );

        const jasa =

            this.loadJasa(
                request
            );

        const mekanik =

            this.loadMekanik(
                request
            );

        const workOrderJasa =

            this.buildDocument(

                request,

                workOrder,

                jasa,

                mekanik

            );

        return WorkOrderJasaRepository.save(

            workOrderJasa

        );

    },

   /**
 * ============================================
 * Mengubah Status Work Order Jasa
 * ============================================
 */
changeStatus(
    workOrderJasaId,
    nextStatus
){

    /**
     * ========================================
     * VALIDASI ID
     * ========================================
     */

    if(!workOrderJasaId){

        throw new Error(
            "Work Order Jasa ID wajib diisi."
        );

    }


    /**
     * ========================================
     * AMBIL WORK ORDER JASA
     * ========================================
     */

    const row =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    if(!row){

        throw new Error(
            "Work Order Jasa tidak ditemukan : " +
            workOrderJasaId
        );

    }


    /**
     * ========================================
     * STATUS SAAT INI
     * ========================================
     */

    const currentStatus =
        row[
            COL_WO_JASA.STATUS
        ];


    /**
     * ========================================
     * VALIDASI TRANSITION
     * ========================================
     */

    WorkOrderJasaStatusService.validateTransition(

        currentStatus,

        nextStatus

    );


    /**
     * ========================================
     * UPDATE STATUS PADA ROW
     * ========================================
     */

    row[
        COL_WO_JASA.STATUS
    ] =
        nextStatus;


    /**
     * ========================================
     * BENTUK OBJECT UNTUK REPOSITORY
     * ========================================
     */

    const workOrderJasa = {

        id :
            row[COL_WO_JASA.ID],

        workOrderId :
            row[COL_WO_JASA.WORK_ORDER_ID],

        urutan :
            row[COL_WO_JASA.URUTAN],

        jasaId :
            row[COL_WO_JASA.JASA_ID],

        namaJasaSnapshot :
            row[COL_WO_JASA.NAMA_JASA_SNAPSHOT],

        keluhan :
            row[COL_WO_JASA.KELUHAN],

        diagnosa :
            row[COL_WO_JASA.DIAGNOSA],

        mekanikId :
            row[COL_WO_JASA.MEKANIK_ID],

        mekanikNameSnapshot :
            row[COL_WO_JASA.MEKANIK_NAME_SNAPSHOT],

        qty :
            row[COL_WO_JASA.QTY],

        harga :
            row[COL_WO_JASA.HARGA],

        diskon :
            row[COL_WO_JASA.DISKON],

        subtotal :
            row[COL_WO_JASA.SUBTOTAL],

        status :
            row[COL_WO_JASA.STATUS],

        catatan :
            row[COL_WO_JASA.CATATAN],

        createdAt :
            row[COL_WO_JASA.CREATED_AT],

        updatedAt :
            row[COL_WO_JASA.UPDATED_AT]

    };


    /**
     * ========================================
     * SIMPAN
     * ========================================
     */

    const result =
        WorkOrderJasaRepository.update(
            workOrderJasa
        );


    /**
     * ========================================
     * RETURN
     * ========================================
     */

    return {

        success :
            true,

        workOrderJasaId :
            workOrderJasaId,

        previousStatus :
            currentStatus,

        status :
            nextStatus

    };

},
/**
 * ============================================
 * Mengubah Status Work Order Jasa
 * ============================================
 */
changeStatus(
    workOrderJasaId,
    nextStatus
){

    /**
     * ========================================
     * VALIDASI ID
     * ========================================
     */

    if(!workOrderJasaId){

        throw new Error(
            "Work Order Jasa ID wajib diisi."
        );

    }


    /**
     * ========================================
     * LOAD DATA
     * ========================================
     *
     * Repository.findById()
     * mengembalikan array row.
     */

    const row =
        WorkOrderJasaRepository.findById(
            workOrderJasaId
        );


    if(!row){

        throw new Error(
            "Work Order Jasa tidak ditemukan : " +
            workOrderJasaId
        );

    }


    /**
     * ========================================
     * STATUS SAAT INI
     * ========================================
     */

    const currentStatus =
        row[
            COL_WO_JASA.STATUS
        ];


    /**
     * ========================================
     * VALIDASI TRANSITION
     * ========================================
     */

    WorkOrderJasaStatusService.validateTransition(

        currentStatus,

        nextStatus

    );


    /**
     * ========================================
     * UPDATE STATUS
     * ========================================
     */

    row[
        COL_WO_JASA.STATUS
    ] =
        nextStatus;


    /**
     * ========================================
     * BENTUK OBJECT WORK ORDER JASA
     * ========================================
     */

    const workOrderJasa = {

        id :
            row[
                COL_WO_JASA.ID
            ],

        workOrderId :
            row[
                COL_WO_JASA.WORK_ORDER_ID
            ],

        urutan :
            row[
                COL_WO_JASA.URUTAN
            ],

        jasaId :
            row[
                COL_WO_JASA.JASA_ID
            ],

        namaJasaSnapshot :
            row[
                COL_WO_JASA.NAMA_JASA
            ],

        keluhan :
            row[
                COL_WO_JASA.KELUHAN
            ],

        diagnosa :
            row[
                COL_WO_JASA.DIAGNOSA
            ],

        mekanikId :
            row[
                COL_WO_JASA.MEKANIK_ID
            ],

        mekanikNameSnapshot :
            row[
                COL_WO_JASA.MEKANIK_NAMA
            ],

        qty :
            row[
                COL_WO_JASA.QTY
            ],

        harga :
            row[
                COL_WO_JASA.HARGA
            ],

        diskon :
            row[
                COL_WO_JASA.DISKON
            ],

        subtotal :
            row[
                COL_WO_JASA.SUBTOTAL
            ],

        status :
            row[
                COL_WO_JASA.STATUS
            ],

        catatan :
            row[
                COL_WO_JASA.CATATAN
            ],

        createdAt :
            row[
                COL_WO_JASA.CREATED_AT
            ],

        updatedAt :
            row[
                COL_WO_JASA.UPDATED_AT
            ]

    };


    /**
     * ========================================
     * UPDATE REPOSITORY
     * ========================================
     */

    const result =
        WorkOrderJasaRepository.update(
            workOrderJasa
        );


    /**
     * ========================================
     * RETURN
     * ========================================
     */

    return {

        success :
            true,

        workOrderJasaId :
            workOrderJasaId,

        previousStatus :
            currentStatus,

        status :
            nextStatus

    };

},

validate(request){

    if(!request){

        throw new Error(
            "Request wajib diisi."
        );

    }

    if(!request.workOrderId){

        throw new Error(
            "Work Order belum dipilih."
        );

    }

    if(!request.jasaId){

        throw new Error(
            "Jasa belum dipilih."
        );

    }

    if(!request.qty){

        throw new Error(
            "Qty belum diisi."
        );

    }

    if(Number(request.qty) <= 0){

        throw new Error(
            "Qty harus lebih besar dari 0."
        );

    }

    if(

        !WorkOrderRepository.exists(
            request.workOrderId
        )

    ){

        throw new Error(
            "Work Order tidak ditemukan."
        );

    }

    if(

        !JasaRepository.exists(
            request.jasaId
        )

    ){

        throw new Error(
            "Jasa tidak ditemukan."
        );

    }

    if(
    request.mekanikId
){

    if(
        !MekanikRepository.exists(
            request.mekanikId
        )
    ){

        throw new Error(
            "Mekanik tidak ditemukan."
        );

    }


    if(
        !MekanikRepository.isActive(
            request.mekanikId
        )
    ){

        throw new Error(
            "Mekanik tidak aktif."
        );

    }

}

    if(

        WorkOrderJasaRepository

            .existsByWorkOrderAndJasa(

                request.workOrderId,

                request.jasaId

            )

    ){

        throw new Error(

            "Jasa sudah ada pada Work Order."

        );

    }

},

    loadWorkOrder(request){

       return WorkOrderRepository.findById(

        request.workOrderId

    );
    },

    loadJasa(request){

    return JasaRepository.findById(

        request.jasaId

    );

    },

    loadMekanik(request){

    if(!request.mekanikId){

        return null;

    }

    return MekanikRepository.findById(

        request.mekanikId

    );

},

   buildDocument(

    request,

    workOrder,

    jasa,

    mekanik

){

    const id =

        RunningNumberService.generate(

            DocumentType.WORK_ORDER_JASA

        );

    const urutan =

        WorkOrderJasaRepository

            .countByWorkOrderId(

                request.workOrderId

            ) + 1;

    return WorkOrderJasaDocument.create({

        id : id,

        workOrderId :

            request.workOrderId,

        urutan :

            urutan,

        jasaId :

            jasa[COL_JASA.ID],

        namaJasaSnapshot :

            jasa[COL_JASA.NAMA],

        keluhan :

            request.keluhan || "",

        diagnosa :

            request.diagnosa || "",

        mekanikId :

            mekanik ?

            mekanik[COL_MEKANIK.ID]

            : "",

        mekanikNameSnapshot :

            mekanik ?

            mekanik[COL_MEKANIK.NAMA]

            : "",

        qty :

            request.qty,

        harga :

            Number(

                jasa[COL_JASA.HARGA]

            ),

        diskon :

            Number(

                request.diskon || 0

            ),

        status :

            WorkOrderJasaStatus.OPEN,

        catatan :

            request.catatan || ""

    }).workOrderJasa;

},

};