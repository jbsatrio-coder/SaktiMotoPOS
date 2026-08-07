function testWorkOrderAggregate(){

    const aggregate =

        WorkOrderAggregate.create({

            workOrder :

                WorkOrderDocument.create({

                    id : "WO000001"

                }).workOrder,

            items : [

                WorkOrderItemDocument.create({

                    id : "WOI000001"

                }).workOrderItem,

                WorkOrderItemDocument.create({

                    id : "WOI000002"

                }).workOrderItem

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