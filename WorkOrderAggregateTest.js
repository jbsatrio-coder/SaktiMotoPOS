function testWorkOrderAggregate(){

    const aggregate =

        WorkOrderAggregate.create({

            workOrder :

                WorkOrderDocument.create({

                    id : "WO000001"

                }).workOrder,

            items : [

                WorkOrderJasaDocument.create({

                    id : "WOJ000001"

                }).workOrderJasa,

                WorkOrderJasaDocument.create({

                    id : "WOJ000002"

                }).workOrderJasa

            ],

            parts : [

                WorkOrderPartDocument.create({

                    id : "WOP000001"

                }).workOrderPart

            ],

            timeline : []

        });

    Logger.log(

        JSON.stringify(

            aggregate,

            null,

            2

        )

    );

}