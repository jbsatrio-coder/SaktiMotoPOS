/**
 * ============================================
 * Work Order Permission
 * Version : 2.0.0
 * Sprint  : Permission Matrix V1
 * ============================================
 *
 * ROLE:
 * - ADMIN
 * - SUPERVISOR
 * - KEPALA_MEKANIK
 * - MEKANIK
 *
 * Permission dipisahkan dari Role.
 *
 * Untuk V1:
 * Semua role memiliki akses penuh terhadap
 * Work Order.
 *
 * Permission dapat diperketat kemudian
 * tanpa mengubah struktur MasterUser.
 * ============================================
 */

const WorkOrderPermission = {

    /**
     * ============================================
     * PERMISSION MATRIX
     * ============================================
     *
     * TRUE  = boleh
     * FALSE = tidak boleh
     *
     * Jangan menggunakan role langsung
     * di WorkOrderService.
     *
     * Gunakan:
     *
     * WorkOrderPermission.can(
     *     "CREATE_WO"
     * );
     *
     * ============================================
     */
    MATRIX : {

        ADMIN : {

            VIEW_WO :
                true,

            CREATE_WO :
                true,

            EDIT_WO :
                true,

            ASSIGN_MEKANIK :
                true,

            CHANGE_STATUS :
                true,

            COMPLETE_WO :
                true,

            CANCEL_WO :
                true

        },


        SUPERVISOR : {

            VIEW_WO :
                true,

            CREATE_WO :
                true,

            EDIT_WO :
                true,

            ASSIGN_MEKANIK :
                true,

            CHANGE_STATUS :
                true,

            COMPLETE_WO :
                true,

            CANCEL_WO :
                true

        },


        KEPALA_MEKANIK : {

            VIEW_WO :
                true,

            CREATE_WO :
                true,

            EDIT_WO :
                true,

            ASSIGN_MEKANIK :
                true,

            CHANGE_STATUS :
                true,

            COMPLETE_WO :
                true,

            CANCEL_WO :
                true

        },


        MEKANIK : {

            VIEW_WO :
                true,

            CREATE_WO :
                true,

            EDIT_WO :
                true,

            ASSIGN_MEKANIK :
                true,

            CHANGE_STATUS :
                true,

            COMPLETE_WO :
                true,

            CANCEL_WO :
                true

        }

    },


    /**
     * ============================================
     * GET CURRENT USER EMAIL
     * ============================================
     */
    getCurrentUserEmail(){

        return String(
            Session
                .getActiveUser()
                .getEmail() || ""
        )
        .trim()
        .toLowerCase();

    },


    /**
     * ============================================
     * RESOLVE ROLE
     * ============================================
     *
     * Identity:
     * Google Account Email
     *
     * Source:
     * MasterUser
     *
     * Syarat:
     * - Email ditemukan
     * - User aktif
     * - Role terdefinisi
     *
     * ============================================
     */
    resolveRole(){

        const email =
            this.getCurrentUserEmail();


        /**
         * USER TANPA EMAIL
         */
        if(!email){

            return {

                email :
                    "",

                user :
                    null,

                role :
                    "",

                resolved :
                    false,

                reason :
                    "Email user tidak tersedia."

            };

        }


        /**
         * CARI USER DI MASTER USER
         */
        const user =
            MasterUserRepository
                .findByEmail(
                    email
                );


        /**
         * EMAIL TIDAK TERDAFTAR
         */
        if(!user){

            return {

                email :
                    email,

                user :
                    null,

                role :
                    "",

                resolved :
                    false,

                reason :
                    "User tidak terdaftar di MasterUser."

            };

        }


        /**
         * AMBIL ROLE
         */
        const role =
            String(
                user[
                    COL_MASTER_USER.ROLE
                ] || ""
            )
            .trim()
            .toUpperCase();


        /**
         * VALIDASI ROLE
         */
        if(!role){

            return {

                email :
                    email,

                user :
                    user,

                role :
                    "",

                resolved :
                    false,

                reason :
                    "Role user belum diisi."

            };

        }


        /**
         * VALIDASI ROLE TERDAFTAR
         */
        if(
            !this.MATRIX[role]
        ){

            return {

                email :
                    email,

                user :
                    user,

                role :
                    role,

                resolved :
                    false,

                reason :
                    "Role tidak dikenali: " +
                    role

            };

        }


        /**
         * VALIDASI STATUS
         */
        const status =
            String(
                user[
                    COL_MASTER_USER.STATUS
                ] || ""
            )
            .trim()
            .toUpperCase();


        if(
            status !== "AKTIF"
        ){

            return {

                email :
                    email,

                user :
                    user,

                role :
                    role,

                resolved :
                    false,

                reason :
                    "User tidak aktif."

            };

        }


        /**
         * ROLE BERHASIL DIRESOLVE
         */
        return {

            email :
                email,

            user :
                user,

            role :
                role,

            resolved :
                true,

            reason :
                ""

        };

    },


    /**
     * ============================================
     * CHECK PERMISSION
     * ============================================
     *
     * Contoh:
     *
     * WorkOrderPermission.can(
     *     "CREATE_WO"
     * );
     *
     * ============================================
     */
    can(permission){

        const result =
            this.resolveRole();


        /**
         * USER TIDAK VALID
         */
        if(
            !result.resolved
        ){

            return false;

        }


        const rolePermissions =
            this.MATRIX[
                result.role
            ];


        if(
            !rolePermissions
        ){

            return false;

        }


        return (
            rolePermissions[
                String(
                    permission || ""
                )
                .trim()
                .toUpperCase()
            ] === true
        );

    },


    /**
     * ============================================
     * GET PERMISSION DETAIL
     * ============================================
     *
     * Utility untuk debugging / UI.
     *
     * ============================================
     */
    getPermission(permission){

        const result =
            this.resolveRole();


        const normalizedPermission =
            String(
                permission || ""
            )
            .trim()
            .toUpperCase();


        return {

            email :
                result.email,

            role :
                result.role,

            resolved :
                result.resolved,

            permission :
                normalizedPermission,

            allowed :
                this.can(
                    normalizedPermission
                ),

            reason :
                result.reason

        };

    },


    /**
     * ============================================
     * INSPECT CURRENT USER
     * ============================================
     */
    inspectCurrentUser(){

        const result =
            this.resolveRole();


        Logger.log(
            "================================"
        );

        Logger.log(
            "WORK ORDER CURRENT USER"
        );

        Logger.log(
            "================================"
        );

        Logger.log(
            "EMAIL:"
        );

        Logger.log(
            result.email
        );

        Logger.log(
            "ROLE:"
        );

        Logger.log(
            result.role ||
            "(BELUM TERDEFINISI)"
        );

        Logger.log(
            "ROLE RESOLVED:"
        );

        Logger.log(
            result.resolved
        );

        Logger.log(
            "REASON:"
        );

        Logger.log(
            result.reason ||
            "(NONE)"
        );

        Logger.log(
            "================================"
        );

        return result;

    }

};