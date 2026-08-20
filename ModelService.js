/**
 * ============================================
 * Model Service
 * Version : 1.0.0
 * ============================================
 */

const ModelService = {

    create(payload){

        if(!payload){

            throw new Error(
                "Payload Model wajib diisi."
            );

        }

        const id =
            payload.id ||
            generateModelId_();

        const document =
            ModelDocument.create({

                ...payload,

                id:
                    id

            });

        ModelValidator.validateCreate(
            document
        );

        const result =
            ModelRepository.save(
                document.model
            );

        Logger.log(
            "[MODEL CREATE] " +
            id +
            " | " +
            document.model.merkId +
            " | " +
            document.model.nama
        );

        return result;

    },


    getAll(){

        return ModelRepository.findAll();

    },


    getById(id){

        return ModelRepository.findById(
            id
        );

    },


    getByMerkId(merkId){

        const target =
            String(
                merkId || ""
            ).trim();

        if(!target){

            return [];

        }

        return ModelRepository
            .findAll()
            .filter(
                model =>
                    model.merkId === target
            );

    }

};
