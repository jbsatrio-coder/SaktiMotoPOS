/**
 * ============================================
 * Role Permission Repository
 * Version : 1.0.0
 * Sprint  : 6G
 * ============================================
 */

const RolePermissionRepository = {

    /**
     * ============================================
     * SHEET
     * ============================================
     */

    sheet(){

        return getSheet_(
            CONFIG.SHEET.ROLE_PERMISSION
        );

    },


    /**
     * ============================================
     * FIND ALL
     * ============================================
     */

    findAll(){

        const sh =
            this.sheet();

        if(
            sh.getLastRow() < 2
        ){

            return [];

        }

        return sh
            .getRange(
                2,
                1,
                sh.getLastRow() - 1,
                COL_ROLE_PERMISSION.TOTAL
            )
            .getValues();

    },


    /**
     * ============================================
     * FIND ROW BY ID
     * ============================================
     */

    findRowById(id){

        const data =
            this.findAll();

        const target =
            String(
                id || ""
            )
            .trim();

        for(
            let i = 0;
            i < data.length;
            i++
        ){

            if(

                String(
                    data[i][
                        COL_ROLE_PERMISSION.ID
                    ] || ""
                )
                .trim()

                ===

                target

            ){

                return i + 2;

            }

        }

        return 0;

    },


    /**
     * ============================================
     * FIND BY ID
     * ============================================
     */

    findById(id){

        const row =
            this.findRowById(
                id
            );

        if(
            row === 0
        ){

            return null;

        }

        return this.sheet()
            .getRange(
                row,
                1,
                1,
                COL_ROLE_PERMISSION.TOTAL
            )
            .getValues()[0];

    },


    /**
     * ============================================
     * FIND BY ROLE
     * ============================================
     */

    findByRole(role){

        const target =
            String(
                role || ""
            )
            .trim()
            .toUpperCase();

        if(!target){

            return [];

        }

        return this.findAll()
            .filter(
                row =>

                    String(
                        row[
                            COL_ROLE_PERMISSION.ROLE
                        ] || ""
                    )
                    .trim()
                    .toUpperCase()

                    ===

                    target

            );

    },


    /**
     * ============================================
     * FIND PERMISSION
     * ============================================
     *
     * Mencari satu permission
     * berdasarkan ROLE + PERMISSION.
     */

    findPermission(
        role,
        permission
    ){

        const targetRole =
            String(
                role || ""
            )
            .trim()
            .toUpperCase();

        const targetPermission =
            String(
                permission || ""
            )
            .trim()
            .toUpperCase();

        if(
            !targetRole ||
            !targetPermission
        ){

            return null;

        }

        const data =
            this.findByRole(
                targetRole
            );

        for(
            let i = 0;
            i < data.length;
            i++
        ){

            const currentPermission =
                String(
                    data[i][
                        COL_ROLE_PERMISSION.PERMISSION
                    ] || ""
                )
                .trim()
                .toUpperCase();

            if(
                currentPermission ===
                targetPermission
            ){

                return data[i];

            }

        }

        return null;

    },


    /**
     * ============================================
     * HAS PERMISSION
     * ============================================
     */

    hasPermission(
        role,
        permission
    ){

        const row =
            this.findPermission(
                role,
                permission
            );

        if(!row){

            return false;

        }

        return (

            String(
                row[
                    COL_ROLE_PERMISSION.STATUS
                ] || ""
            )
            .trim()
            .toUpperCase()

            ===

            "AKTIF"

        );

    },


    /**
     * ============================================
     * EXISTS
     * ============================================
     */

    exists(id){

        return (

            this.findRowById(
                id
            ) > 0

        );

    },


    /**
     * ============================================
     * EXISTS ROLE + PERMISSION
     * ============================================
     */

    existsPermission(
        role,
        permission
    ){

        return (

            this.findPermission(
                role,
                permission
            ) !== null

        );

    },


    /**
     * ============================================
     * SAVE
     * ============================================
     */

    save(data){

        if(!data){

            throw new Error(
                "Data Role Permission wajib diisi."
            );

        }

        const id =
            String(
                data.id || ""
            )
            .trim();

        const role =
            String(
                data.role || ""
            )
            .trim()
            .toUpperCase();

        const permission =
            String(
                data.permission || ""
            )
            .trim()
            .toUpperCase();

        if(!id){

            throw new Error(
                "ID Role Permission wajib diisi."
            );

        }

        if(!role){

            throw new Error(
                "Role wajib diisi."
            );

        }

        if(!permission){

            throw new Error(
                "Permission wajib diisi."
            );

        }

        if(
            this.exists(id)
        ){

            throw new Error(
                "Role Permission sudah ada : " +
                id
            );

        }

        if(
            this.existsPermission(
                role,
                permission
            )
        ){

            throw new Error(
                "Permission untuk role tersebut sudah ada : " +
                role +
                " / " +
                permission
            );

        }

        this.sheet().appendRow([

            id,

            role,

            permission,

            String(
                data.status ||
                "AKTIF"
            )
            .trim()
            .toUpperCase(),

            data.updatedAt ||
                new Date()

        ]);

        return {

            success :
                true,

            rolePermissionId :
                id

        };

    },


    /**
     * ============================================
     * UPDATE STATUS
     * ============================================
     */

    updateStatus(
        id,
        status
    ){

        const row =
            this.findRowById(
                id
            );

        if(
            row === 0
        ){

            throw new Error(
                "Role Permission tidak ditemukan : " +
                id
            );

        }

        const normalizedStatus =
            String(
                status || ""
            )
            .trim()
            .toUpperCase();

        if(
            normalizedStatus !==
                "AKTIF" &&

            normalizedStatus !==
                "NONAKTIF"
        ){

            throw new Error(
                "Status Role Permission tidak valid."
            );

        }

        const sh =
            this.sheet();

        sh.getRange(
            row,
            COL_ROLE_PERMISSION.STATUS + 1
        )
        .setValue(
            normalizedStatus
        );

        sh.getRange(
            row,
            COL_ROLE_PERMISSION.UPDATED_AT + 1
        )
        .setValue(
            new Date()
        );

        return {

            success :
                true,

            rolePermissionId :
                id,

            status :
                normalizedStatus

        };

    }

};