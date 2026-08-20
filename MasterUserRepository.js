/**
 * ============================================
 * Master User Repository
 * Version : 1.0.0
 * Sprint  : 6E
 * ============================================
 */

const MasterUserRepository = {

    /**
     * ============================================
     * SHEET
     * ============================================
     */
    sheet(){

        return getSheet_(
            CONFIG.SHEET.MASTER_USER
        );

    },


    /**
     * ============================================
     * FIND ALL
     * ============================================
     */
    findAll(){

        const sh = this.sheet();

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
                COL_MASTER_USER.TOTAL
            )
            .getValues();

    },


    /**
     * ============================================
     * FIND ROW BY ID
     * ============================================
     */
    findRowById(userId){

        const data =
            this.findAll();

        for(
            let i = 0;
            i < data.length;
            i++
        ){

            if(

                String(
                    data[i][
                        COL_MASTER_USER.ID
                    ]
                )
                .trim() ===

                String(
                    userId
                )
                .trim()

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
    findById(userId){

        const row =
            this.findRowById(
                userId
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
                COL_MASTER_USER.TOTAL
            )
            .getValues()[0];

    },


    /**
     * ============================================
     * FIND BY EMAIL
     * ============================================
     *
     * Email digunakan sebagai identity utama
     * untuk menghubungkan akun Google dengan
     * MasterUser.
     * ============================================
     */
    findByEmail(email){

        const keyword =
            String(
                email || ""
            )
            .trim()
            .toLowerCase();

        if(
            !keyword
        ){

            return null;

        }

        const data =
            this.findAll();

        for(
            let i = 0;
            i < data.length;
            i++
        ){

            const rowEmail =
                String(
                    data[i][
                        COL_MASTER_USER.EMAIL
                    ] || ""
                )
                .trim()
                .toLowerCase();

            if(
                rowEmail === keyword
            ){

                return data[i];

            }

        }

        return null;

    },


    /**
     * ============================================
     * EXISTS
     * ============================================
     */
    exists(userId){

        return (
            this.findRowById(
                userId
            ) > 0
        );

    },


    /**
     * ============================================
     * EXISTS BY EMAIL
     * ============================================
     */
    existsByEmail(email){

        return (
            this.findByEmail(
                email
            ) !== null
        );

    },


    /**
     * ============================================
     * IS ACTIVE
     * ============================================
     */
    isActive(userId){

        const user =
            this.findById(
                userId
            );

        if(
            !user
        ){

            return false;

        }

        return (

            String(
                user[
                    COL_MASTER_USER.STATUS
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
     * IS ACTIVE BY EMAIL
     * ============================================
     */
    isActiveByEmail(email){

        const user =
            this.findByEmail(
                email
            );

        if(
            !user
        ){

            return false;

        }

        return (

            String(
                user[
                    COL_MASTER_USER.STATUS
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
     * GET ROLE BY EMAIL
     * ============================================
     */
    getRoleByEmail(email){

        const user =
            this.findByEmail(
                email
            );

        if(
            !user
        ){

            return "";

        }

        if(
            !this.isActiveByEmail(
                email
            )
        ){

            return "";

        }

        return String(
            user[
                COL_MASTER_USER.ROLE
            ] || ""
        )
        .trim()
        .toUpperCase();

    }

};