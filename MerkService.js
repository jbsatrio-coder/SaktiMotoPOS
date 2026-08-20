/**
 * ============================================
 * Merk Service
 * Version : 1.0.0
 * ============================================
 */

const MerkService = {

    create(payload){

        if(!payload){

            throw new Error(
                "Payload Merk wajib diisi."
            );

        }

        const id =
            payload.id ||
            generateMerkId_();

        const document =
            MerkDocument.create({

                ...payload,

                id:
                    id

            });

        MerkValidator.validateCreate(
            document
        );

        const result =
            MerkRepository.save(
                document.merk
            );

        Logger.log(
            "[MERK CREATE] " +
            id +
            " | " +
            document.merk.nama
        );

        return result;

    },


    getAll(){

        return MerkRepository.findAll();

    },


    getById(id){

        return MerkRepository.findById(
            id
        );

    }

};