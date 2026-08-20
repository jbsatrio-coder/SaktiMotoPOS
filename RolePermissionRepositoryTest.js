function testRolePermissionRepository(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "ROLE PERMISSION REPOSITORY TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * SHEET
     * ========================================
     */

    const sheet =
        RolePermissionRepository.sheet();

    Logger.log(
        "SHEET NAME:"
    );

    Logger.log(
        sheet.getName()
    );


    /**
     * ========================================
     * FIND ALL
     * ========================================
     */

    const all =
        RolePermissionRepository.findAll();

    Logger.log(
        "TOTAL ROW:"
    );

    Logger.log(
        all.length
    );


    /**
     * ========================================
     * TEST EXISTING PERMISSION
     * ========================================
     */

    const adminViewWO =
        RolePermissionRepository
            .findPermission(
                "ADMIN",
                "VIEW_WO"
            );

    Logger.log(
        "ADMIN VIEW_WO:"
    );

    Logger.log(
        JSON.stringify(
            adminViewWO
        )
    );


    /**
     * ========================================
     * TEST HAS PERMISSION
     * ========================================
     */

    const hasAdminViewWO =
        RolePermissionRepository
            .hasPermission(
                "ADMIN",
                "VIEW_WO"
            );

    Logger.log(
        "ADMIN HAS VIEW_WO:"
    );

    Logger.log(
        hasAdminViewWO
    );


    /**
     * ========================================
     * TEST ROLE
     * ========================================
     */

    const adminPermissions =
        RolePermissionRepository
            .findByRole(
                "ADMIN"
            );

    Logger.log(
        "ADMIN PERMISSION COUNT:"
    );

    Logger.log(
        adminPermissions.length
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "ROLE PERMISSION REPOSITORY TEST SELESAI"
    );

    Logger.log(
        "================================"
    );

}

function testRolePermissionDisableRestore(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "ROLE PERMISSION DISABLE / RESTORE TEST"
    );

    Logger.log(
        "================================"
    );


    const role =
        UserRole.MEKANIK;

    const permission =
        Permission.ASSIGN_MEKANIK;


    Logger.log(
        "ROLE:"
    );

    Logger.log(
        role
    );


    Logger.log(
        "PERMISSION:"
    );

    Logger.log(
        permission
    );


    /**
     * ========================================
     * FIND PERMISSION
     * ========================================
     */

    const row =
        RolePermissionRepository.findPermission(
            role,
            permission
        );


    if(!row){

        throw new Error(
            "Role Permission tidak ditemukan."
        );

    }


    const rolePermissionId =
        row[
            COL_ROLE_PERMISSION.ID
        ];


    const originalStatus =
        String(
            row[
                COL_ROLE_PERMISSION.STATUS
            ] || ""
        )
        .trim()
        .toUpperCase();


    Logger.log(
        "ROLE PERMISSION ID:"
    );

    Logger.log(
        rolePermissionId
    );


    Logger.log(
        "ORIGINAL STATUS:"
    );

    Logger.log(
        originalStatus
    );


    /**
     * ========================================
     * HARUS AKTIF SEBELUM TEST
     * ========================================
     */

    if(
        originalStatus !==
        "AKTIF"
    ){

        throw new Error(
            "Permission awal bukan AKTIF. " +
            "Test dibatalkan agar tidak mengubah " +
            "konfigurasi permission yang sudah ada."
        );

    }


    /**
     * ========================================
     * TEST DISABLE
     * ========================================
     */

    try {

        Logger.log(
            "DISABLE PERMISSION"
        );


        RolePermissionRepository.updateStatus(
            rolePermissionId,
            "NONAKTIF"
        );


        const hasPermissionAfterDisable =
            RolePermissionRepository.hasPermission(
                role,
                permission
            );


        Logger.log(
            "HAS PERMISSION AFTER DISABLE:"
        );

        Logger.log(
            hasPermissionAfterDisable
        );


        if(
            hasPermissionAfterDisable
        ){

            throw new Error(
                "Permission masih terbaca AKTIF " +
                "setelah diubah menjadi NONAKTIF."
            );

        }


        Logger.log(
            "DISABLE TEST PASS"
        );


    } finally {

        /**
         * ====================================
         * RESTORE
         * ====================================
         */

        Logger.log(
            "RESTORE ORIGINAL STATUS"
        );


        RolePermissionRepository.updateStatus(
            rolePermissionId,
            originalStatus
        );


        const hasPermissionAfterRestore =
            RolePermissionRepository.hasPermission(
                role,
                permission
            );


        Logger.log(
            "HAS PERMISSION AFTER RESTORE:"
        );

        Logger.log(
            hasPermissionAfterRestore
        );


        if(
            originalStatus === "AKTIF" &&
            !hasPermissionAfterRestore
        ){

            throw new Error(
                "Permission gagal dikembalikan ke status awal."
            );

        }


        Logger.log(
            "RESTORE PASS"
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "ROLE PERMISSION DISABLE / RESTORE TEST PASS"
    );

    Logger.log(
        "================================"
    );

}