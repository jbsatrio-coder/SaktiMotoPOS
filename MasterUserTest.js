/**
 * ============================================
 * Master User Test
 * Version : 1.0.0
 * Sprint  : 6G
 * ============================================
 */

function testMasterUserDocument(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "MASTER USER DOCUMENT TEST"
    );

    Logger.log(
        "================================"
    );


    const document =
        MasterUserDocument.create({

            id :
                "USR2608200001",

            email :
                "JB.SATRIO@GMAIL.COM",

            nama :
                "Satrio",

            role :
                "admin",

            status :
                "aktif"

        });


    Logger.log(
        "DOCUMENT:"
    );

    Logger.log(
        JSON.stringify(
            document,
            null,
            2
        )
    );


    if(
        !document ||
        !document.user
    ){

        throw new Error(
            "MasterUserDocument gagal dibuat."
        );

    }


    if(
        document.user.email !==
        "jb.satrio@gmail.com"
    ){

        throw new Error(
            "Normalisasi email gagal."
        );

    }


    if(
        document.user.role !==
        "ADMIN"
    ){

        throw new Error(
            "Normalisasi role gagal."
        );

    }


    if(
        document.user.status !==
        "AKTIF"
    ){

        throw new Error(
            "Normalisasi status gagal."
        );

    }


    Logger.log(
        "MASTER USER DOCUMENT TEST PASS"
    );

}


/**
 * ============================================
 * TEST MASTER USER SHEET
 * ============================================
 *
 * Test ini hanya untuk memastikan
 * CONFIG.SHEET.MASTER_USER dapat
 * di-resolve.
 *
 * Sheet fisik harus sudah ada.
 * ============================================
 */
function testMasterUserSheet(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "MASTER USER SHEET TEST"
    );

    Logger.log(
        "================================"
    );


    const sh =
        MasterUserRepository.sheet();


    Logger.log(
        "SHEET NAME:"
    );

    Logger.log(
        sh.getName()
    );


    if(
        sh.getName() !==
        CONFIG.SHEET.MASTER_USER
    ){

        throw new Error(
            "Nama Sheet MasterUser tidak sesuai."
        );

    }


    Logger.log(
        "MASTER USER SHEET TEST PASS"
    );

}


/**
 * ============================================
 * TEST MASTER USER FIND ALL
 * ============================================
 */
function testMasterUserFindAll(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "MASTER USER FIND ALL TEST"
    );

    Logger.log(
        "================================"
    );


    const users =
        MasterUserRepository.findAll();


    Logger.log(
        "JUMLAH USER:"
    );

    Logger.log(
        users.length
    );


    users.forEach(
        function(user, index){

            Logger.log(
                "USER #" +
                (index + 1) +
                " : " +
                JSON.stringify(user)
            );

        }
    );


    Logger.log(
        "MASTER USER FIND ALL TEST SELESAI"
    );

}