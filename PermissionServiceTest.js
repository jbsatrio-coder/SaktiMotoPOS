/**
 * ============================================
 * Permission Service Test
 * Version : 1.0.0
 * Sprint  : 6J
 * ============================================
 */

function testPermissionServiceCurrentUser(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "PERMISSION SERVICE CURRENT USER TEST"
    );

    Logger.log(
        "================================"
    );


    const user =
        PermissionService
            .getCurrentUser();


    Logger.log(
        "EMAIL:"
    );

    Logger.log(
        user.email
    );


    Logger.log(
        "ROLE:"
    );

    Logger.log(
        user.role
    );


    Logger.log(
        "RESOLVED:"
    );

    Logger.log(
        user.resolved
    );


    Logger.log(
        "REASON:"
    );

    Logger.log(
        user.reason ||
        "(NONE)"
    );


    if(
        !user.resolved
    ){

        throw new Error(
            "Current user gagal di-resolve."
        );

    }


    Logger.log(
        "PERMISSION SERVICE CURRENT USER TEST PASS"
    );

}

/**
 * ============================================
 * Permission Service Test
 * Version : 1.0.0
 * Sprint  : 6G
 * ============================================
 */

function testPermissionServiceCan(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "PERMISSION SERVICE CAN TEST"
    );

    Logger.log(
        "================================"
    );


    const user =
        PermissionService.getCurrentUser();


    Logger.log(
        "EMAIL:"
    );

    Logger.log(
        user.email
    );


    Logger.log(
        "ROLE:"
    );

    Logger.log(
        user.role
    );


    Logger.log(
        "RESOLVED:"
    );

    Logger.log(
        user.resolved
    );


    if(!user.resolved){

        throw new Error(
            "Current user gagal di-resolve."
        );

    }


    /**
     * ========================================
     * TEST PERMISSION
     * ========================================
     */

    const permissions = [

        Permission.VIEW_WO,

        Permission.CREATE_WO,

        Permission.EDIT_HARGA_JUAL_BARANG,

        Permission.VIEW_REPORT,

        Permission.MANAGE_PERMISSION

    ];


    let passed = 0;
    let failed = 0;


    for(
        let i = 0;
        i < permissions.length;
        i++
    ){

        const permission =
            permissions[i];

        const result =
            PermissionService.can(
                permission
            );


        Logger.log(
            user.role +
            " → " +
            permission +
            " = " +
            result
        );


        /**
         * ====================================
         * EXPECTED UNTUK ADMIN
         * ====================================
         */

        let expected = true;


        if(
            result === expected
        ){

            passed++;

            Logger.log(
                "PASS"
            );

        }else{

            failed++;

            Logger.log(
                "FAIL | EXPECTED = " +
                expected
            );

        }

    }


    /**
     * ========================================
     * SUMMARY
     * ========================================
     */

    Logger.log(
        "================================"
    );

    Logger.log(
        "PASSED:"
    );

    Logger.log(
        passed
    );

    Logger.log(
        "FAILED:"
    );

    Logger.log(
        failed
    );

    Logger.log(
        "================================"
    );


    if(failed > 0){

        throw new Error(
            "PERMISSION SERVICE CAN TEST FAILED."
        );

    }


    Logger.log(
        "PERMISSION SERVICE CAN TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

function testPermissionServiceRequire(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "PERMISSION SERVICE REQUIRE TEST"
    );

    Logger.log(
        "================================"
    );


    const user =
        PermissionService.getCurrentUser();


    Logger.log(
        "EMAIL:"
    );

    Logger.log(
        user.email
    );


    Logger.log(
        "ROLE:"
    );

    Logger.log(
        user.role
    );


    /**
     * ========================================
     * TEST ALLOWED PERMISSION
     * ========================================
     */

    try{

        const result =
            PermissionService.require(
                Permission.VIEW_WO
            );


        Logger.log(
            "VIEW_WO REQUIRE:"
        );

        Logger.log(
            result
        );


        if(result !== true){

            throw new Error(
                "VIEW_WO seharusnya mengembalikan true."
            );

        }


        Logger.log(
            "VIEW_WO REQUIRE PASS"
        );

    }catch(error){

        throw new Error(
            "VIEW_WO REQUIRE gagal: " +
            error.message
        );

    }


    /**
     * ========================================
     * TEST ANOTHER ALLOWED PERMISSION
     * ========================================
     */

    try{

        const result =
            PermissionService.require(
                Permission.MANAGE_PERMISSION
            );


        Logger.log(
            "MANAGE_PERMISSION REQUIRE:"
        );

        Logger.log(
            result
        );


        if(result !== true){

            throw new Error(
                "MANAGE_PERMISSION seharusnya true."
            );

        }


        Logger.log(
            "MANAGE_PERMISSION REQUIRE PASS"
        );

    }catch(error){

        throw new Error(
            "MANAGE_PERMISSION REQUIRE gagal: " +
            error.message
        );

    }


    /**
     * ========================================
     * SUMMARY
     * ========================================
     */

    Logger.log(
        "================================"
    );

    Logger.log(
        "PERMISSION SERVICE REQUIRE TEST PASS"
    );

    Logger.log(
        "================================"
    );

}