/**
 * ============================================
 * Global Permission Service
 * Version : 1.0.0
 * Sprint  : 6J
 * ============================================
 *
 * Alur:
 *
 * Google Account
 *      ↓
 * MasterUser
 *      ↓
 * Role
 *      ↓
 * RolePermission
 *      ↓
 * Permission
 *
 * CATATAN:
 * Role TIDAK boleh diberikan dari frontend.
 * Service selalu resolve berdasarkan email
 * Google Account yang sedang menjalankan script.
 * ============================================
 */

const PermissionService = {

    /**
     * ============================================
     * GET CURRENT USER
     * ============================================
     */

    getCurrentUser(){

        const email =
            String(
                Session
                    .getActiveUser()
                    .getEmail() || ""
            )
            .trim()
            .toLowerCase();


        if(!email){

            return {

                email :
                    "",

                role :
                    "",

                resolved :
                    false,

                reason :
                    "EMAIL USER TIDAK TERSEDIA."

            };

        }


        const user =
            MasterUserRepository
                .findByEmail(
                    email
                );


        if(!user){

            return {

                email :
                    email,

                role :
                    "",

                resolved :
                    false,

                reason :
                    "USER TIDAK TERDAFTAR DI MASTER USER."

            };

        }


        const status =
            String(
                user[
                    COL_MASTER_USER.STATUS
                ] || ""
            )
            .trim()
            .toUpperCase();


        if(
            status !==
            "AKTIF"
        ){

            return {

                email :
                    email,

                role :
                    "",

                resolved :
                    false,

                reason :
                    "USER TIDAK AKTIF."

            };

        }


        const role =
            String(
                user[
                    COL_MASTER_USER.ROLE
                ] || ""
            )
            .trim()
            .toUpperCase();


        if(!role){

            return {

                email :
                    email,

                role :
                    "",

                resolved :
                    false,

                reason :
                    "ROLE USER BELUM DITENTUKAN."

            };

        }


        return {

            email :
                email,

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
     * GET CURRENT ROLE
     * ============================================
     */

    getCurrentRole(){

        const user =
            this.getCurrentUser();

        if(
            !user.resolved
        ){

            return "";

        }

        return user.role;

    },


    /**
     * ============================================
     * CAN
     * ============================================
     *
     * Return:
     * true  = memiliki permission
     * false = tidak memiliki permission
     *
     * Role selalu berasal dari current user.
     */

    can(permission){

        const currentUser =
            this.getCurrentUser();


        if(
            !currentUser.resolved
        ){

            return false;

        }


        const normalizedPermission =
            String(
                permission || ""
            )
            .trim()
            .toUpperCase();


        if(
            !normalizedPermission
        ){

            return false;

        }


        return (

            RolePermissionRepository
                .hasPermission(
                    currentUser.role,
                    normalizedPermission
                )

        );

    },

        /**
     * ============================================
     * REQUIRE
     * ============================================
     *
     * Memastikan current user memiliki permission.
     *
     * Jika memiliki permission:
     *     → proses dilanjutkan
     *
     * Jika tidak:
     *     → throw Error
     *
     * Permission selalu diperiksa berdasarkan:
     *
     * Google Account
     *      ↓
     * MasterUser
     *      ↓
     * Role
     *      ↓
     * RolePermission
     * ============================================
     */

    require(permission){

        const normalizedPermission =
            String(
                permission || ""
            )
            .trim()
            .toUpperCase();


        if(!normalizedPermission){

            throw new Error(
                "Permission wajib diisi."
            );

        }


        const currentUser =
            this.getCurrentUser();


        if(
            !currentUser.resolved
        ){

            throw new Error(
                "User tidak dapat di-resolve. " +
                currentUser.reason
            );

        }


        const allowed =
            RolePermissionRepository
                .hasPermission(
                    currentUser.role,
                    normalizedPermission
                );


        if(!allowed){

            throw new Error(
                "User tidak memiliki permission: " +
                normalizedPermission
            );

        }


        return true;

    },


    /**
     * ============================================
     * REQUIRE
     * ============================================
     *
     * Digunakan untuk operation yang wajib
     * memiliki permission.
     *
     * Jika tidak memiliki permission,
     * langsung throw Error.
     */

    require(permission){

        const currentUser =
            this.getCurrentUser();


        if(
            !currentUser.resolved
        ){

            throw new Error(
                "User tidak dapat diidentifikasi. " +
                currentUser.reason
            );

        }


        const normalizedPermission =
            String(
                permission || ""
            )
            .trim()
            .toUpperCase();


        if(
            !normalizedPermission
        ){

            throw new Error(
                "Permission wajib diisi."
            );

        }


        const allowed =
            RolePermissionRepository
                .hasPermission(
                    currentUser.role,
                    normalizedPermission
                );


        if(!allowed){

            throw new Error(

                "User dengan role " +
                currentUser.role +
                " tidak memiliki permission: " +
                normalizedPermission

            );

        }


        return true;

    },


    /**
     * ============================================
     * INSPECT
     * ============================================
     *
     * Utility development/debugging.
     */

    inspect(){

        const currentUser =
            this.getCurrentUser();


        Logger.log(
            "================================"
        );

        Logger.log(
            "GLOBAL PERMISSION SERVICE"
        );

        Logger.log(
            "================================"
        );

        Logger.log(
            "EMAIL:"
        );

        Logger.log(
            currentUser.email
        );

        Logger.log(
            "ROLE:"
        );

        Logger.log(
            currentUser.role ||
            "(NONE)"
        );

        Logger.log(
            "RESOLVED:"
        );

        Logger.log(
            currentUser.resolved
        );

        Logger.log(
            "REASON:"
        );

        Logger.log(
            currentUser.reason ||
            "(NONE)"
        );

        Logger.log(
            "================================"
        );


        return currentUser;

    }

};