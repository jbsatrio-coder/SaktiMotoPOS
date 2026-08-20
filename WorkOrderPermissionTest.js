/**
 * ============================================
 * Work Order Permission Test
 * Version : 1.0.0
 * ============================================
 */

function testWorkOrderPermissionCurrentUser(){

    const result =
        WorkOrderPermission
            .inspectCurrentUser();

    if(!result){

        throw new Error(
            "Permission resolver tidak mengembalikan result."
        );

    }

    Logger.log(
        "PERMISSION USER TEST PASS"
    );

}

/**
 * ============================================
 * TEST PERMISSION MATRIX V1
 * ============================================
 *
 * Memastikan seluruh role memiliki permission
 * sesuai policy V1.
 *
 * Role:
 * - ADMIN
 * - SUPERVISOR
 * - KEPALA_MEKANIK
 * - MEKANIK
 *
 * Permission:
 * - VIEW_WO
 * - CREATE_WO
 * - EDIT_WO
 * - ASSIGN_MEKANIK
 * - CHANGE_STATUS
 * - COMPLETE_WO
 * - CANCEL_WO
 *
 * Test ini TIDAK menggunakan MasterUser.
 * Kita test langsung MATRIX agar tidak
 * bergantung pada akun Google yang sedang login.
 * ============================================
 */
function testWorkOrderPermissionMatrixV1(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "WORK ORDER PERMISSION MATRIX V1 TEST"
    );

    Logger.log(
        "================================"
    );


    /**
     * ========================================
     * EXPECTED ROLES
     * ========================================
     */
    const roles = [

        "ADMIN",

        "SUPERVISOR",

        "KEPALA_MEKANIK",

        "MEKANIK"

    ];


    /**
     * ========================================
     * EXPECTED PERMISSIONS
     * ========================================
     */
    const permissions = [

        "VIEW_WO",

        "CREATE_WO",

        "EDIT_WO",

        "ASSIGN_MEKANIK",

        "CHANGE_STATUS",

        "COMPLETE_WO",

        "CANCEL_WO"

    ];


    /**
     * ========================================
     * TEST SETIAP ROLE
     * ========================================
     */
    for(
        let i = 0;
        i < roles.length;
        i++
    ){

        const role =
            roles[i];


        Logger.log(
            "ROLE: " +
            role
        );


        /**
         * Pastikan role ada
         * di Permission Matrix.
         */
        if(
            !WorkOrderPermission.MATRIX[
                role
            ]
        ){

            throw new Error(
                "Role tidak ditemukan di MATRIX: " +
                role
            );

        }


        /**
         * ====================================
         * TEST SETIAP PERMISSION
         * ====================================
         */
        for(
            let j = 0;
            j < permissions.length;
            j++
        ){

            const permission =
                permissions[j];


            const allowed =
                WorkOrderPermission.MATRIX[
                    role
                ][
                    permission
                ];


            Logger.log(
                "  " +
                permission +
                " = " +
                allowed
            );


            /**
             * V1:
             * Semua role memiliki akses.
             */
            if(
                allowed !== true
            ){

                throw new Error(
                    "Permission V1 gagal: " +
                    role +
                    " -> " +
                    permission
                );

            }

        }

    }


    /**
     * ========================================
     * FINAL ASSERT
     * ========================================
     */
    Logger.log(
        "================================"
    );

    Logger.log(
        "PERMISSION MATRIX V1 TEST PASS"
    );

    Logger.log(
        "================================"
    );

}

function testRolePermissionMatrixV1(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "ROLE PERMISSION MATRIX V1 VERIFY"
    );

    Logger.log(
        "================================"
    );


    const tests = [

        ["ADMIN", "VIEW_WO", true],
        ["ADMIN", "VIEW_REPORT", true],
        ["ADMIN", "MANAGE_PERMISSION", true],

        ["SUPERVISOR", "VIEW_WO", true],
        ["SUPERVISOR", "VIEW_REPORT", false],

        ["KEPALA_MEKANIK", "COMPLETE_WO", true],
        ["KEPALA_MEKANIK", "VIEW_REPORT", false],

        ["MEKANIK", "CREATE_WO", true],
        ["MEKANIK", "CHANGE_STATUS", true],
        ["MEKANIK", "COMPLETE_WO", true],
        ["MEKANIK", "VIEW_REPORT", false],
        ["MEKANIK", "EDIT_HARGA_JUAL_BARANG", false]

    ];


    let passed = 0;
    let failed = 0;


    tests.forEach(function(test){

        const role =
            test[0];

        const permission =
            test[1];

        const expected =
            test[2];


        const actual =
            RolePermissionRepository
                .hasPermission(
                    role,
                    permission
                );


        const pass =
            actual === expected;


        Logger.log(
            role +
            " → " +
            permission +
            " = " +
            actual +
            " | EXPECTED = " +
            expected +
            " | " +
            (
                pass
                    ? "PASS"
                    : "FAIL"
            )
        );


        if(pass){

            passed++;

        }
        else{

            failed++;

        }

    });


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


    if(
        failed > 0
    ){

        throw new Error(
            "ROLE PERMISSION MATRIX V1 TEST FAILED."
        );

    }


    Logger.log(
        "================================"
    );

    Logger.log(
        "ROLE PERMISSION MATRIX V1 TEST PASS"
    );

    Logger.log(
        "================================"
    );

}