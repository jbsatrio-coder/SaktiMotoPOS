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

        request.mekanikId &&

        !MekanikRepository.exists(
            request.mekanikId
        )

    ){

        throw new Error(
            "Mekanik tidak ditemukan."
        );

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