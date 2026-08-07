/**
 * ============================================
 * Work Order Aggregate
 * Version : 1.0.0
 * ============================================
 */

const WorkOrderAggregate = {

    create({

        workOrder,

        items,

        parts,

        timeline

    }){

        return {

            workOrder,

            items :

                items || [],

            parts :

                parts || [],

            timeline :

                timeline || []

        };

    }

};