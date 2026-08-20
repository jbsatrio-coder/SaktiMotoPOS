/**
 * ============================================
 * Customer Service
 * Version : 1.0.0
 * ============================================
 */

const CustomerService = {

    /**
     * Membuat customer baru
     */
    createCustomer(payload){

        const customerDocument =

            CustomerDocument.create({

                ...payload,

                id :

                    RunningNumberService.generate(

                        DocumentType.CUSTOMER

                    )

            });

        CustomerValidator.validateCreate(
            customerDocument
        );

        return CustomerRepository.save(
            customerDocument
        );

    },

    /**
     * Update customer
     */
    updateCustomer(payload){

        const customerDocument =

            CustomerDocument.create(
                payload
            );

        CustomerValidator.validateUpdate(
            customerDocument
        );

        return CustomerRepository.update(
            customerDocument
        );

    }

};
