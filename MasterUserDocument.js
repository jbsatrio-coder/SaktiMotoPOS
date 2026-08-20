/**
 * ============================================
 * Master User Document
 * Version : 1.0.0
 * Sprint  : 6F
 * ============================================
 */

const MasterUserDocument = {

    create(payload){

        if(!payload){

            throw new Error(
                "Payload Master User wajib diisi."
            );

        }

        const user = {

            id :
                String(
                    payload.id || ""
                ).trim(),

            email :
                String(
                    payload.email || ""
                ).trim().toLowerCase(),

            nama :
                String(
                    payload.nama || ""
                ).trim(),

            role :
                String(
                    payload.role || ""
                ).trim().toUpperCase(),

            status :
                String(
                    payload.status ||
                    "AKTIF"
                )
                .trim()
                .toUpperCase(),

            createdAt :
                payload.createdAt ||
                new Date(),

            updatedAt :
                payload.updatedAt ||
                ""

        };

        return {

            user :
                user

        };

    }

};