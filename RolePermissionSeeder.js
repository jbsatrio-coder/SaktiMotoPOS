/**
 * ============================================
 * Role Permission Seeder
 * Version : 1.0.0
 * Sprint  : 6I
 * ============================================
 *
 * Membuat default permission matrix.
 *
 * Seeder bersifat IDEMPOTENT:
 * - tidak membuat duplicate
 * - permission yang sudah ada dilewati
 * ============================================
 */

const RolePermissionSeeder = {

    /**
     * ============================================
     * DEFAULT MATRIX
     * ============================================
     */

    getDefaultMatrix(){

        return {

            [UserRole.ADMIN] : [

                ...Object.values(Permission)

            ],


            [UserRole.SUPERVISOR] : [

                // WORK ORDER

                Permission.VIEW_WO,
                Permission.CREATE_WO,
                Permission.EDIT_WO,
                Permission.ASSIGN_MEKANIK,
                Permission.CHANGE_STATUS,
                Permission.COMPLETE_WO,
                Permission.CANCEL_WO,


                // MASTER BARANG

                Permission.VIEW_BARANG,
                Permission.CREATE_BARANG,
                Permission.EDIT_BARANG,
                Permission.EDIT_HARGA_JUAL_BARANG,
                Permission.EDIT_HARGA_MODAL_BARANG,
                Permission.EDIT_STOK_MINIMUM,
                Permission.DEACTIVATE_BARANG,


                // MASTER JASA

                Permission.VIEW_JASA,
                Permission.CREATE_JASA,
                Permission.EDIT_JASA,
                Permission.EDIT_HARGA_JASA,
                Permission.DEACTIVATE_JASA

            ],


            [UserRole.KEPALA_MEKANIK] : [

                // WORK ORDER

                Permission.VIEW_WO,
                Permission.CREATE_WO,
                Permission.EDIT_WO,
                Permission.ASSIGN_MEKANIK,
                Permission.CHANGE_STATUS,
                Permission.COMPLETE_WO,
                Permission.CANCEL_WO,


                // MASTER BARANG

                Permission.VIEW_BARANG,
                Permission.EDIT_BARANG,
                Permission.EDIT_HARGA_JUAL_BARANG,
                Permission.EDIT_STOK_MINIMUM,


                // MASTER JASA

                Permission.VIEW_JASA,
                Permission.EDIT_JASA

            ],


            [UserRole.MEKANIK] : [

                // WORK ORDER

                Permission.VIEW_WO,
                Permission.CREATE_WO,
                Permission.EDIT_WO,
                Permission.ASSIGN_MEKANIK,
                Permission.CHANGE_STATUS,
                Permission.COMPLETE_WO,
                Permission.CANCEL_WO,


                // MASTER DATA - READ ONLY

                Permission.VIEW_BARANG,
                Permission.VIEW_JASA

            ]

        };

    },


    /**
     * ============================================
     * SEED
     * ============================================
     */

    seed(){

        const matrix =
            this.getDefaultMatrix();

        let created = 0;

        let skipped = 0;


        Object.keys(matrix)
            .forEach(
                role => {

                    const permissions =
                        matrix[role];

                    permissions.forEach(
                        permission => {

                            const exists =
                                RolePermissionRepository
                                    .existsPermission(
                                        role,
                                        permission
                                    );

                            if(exists){

                                skipped++;

                                return;

                            }


                            const id =
                                RunningNumberService.generate(
                                    DocumentType.ROLE_PERMISSION
                                );


                            RolePermissionRepository.save({

                                id :
                                    id,

                                role :
                                    role,

                                permission :
                                    permission,

                                status :
                                    "AKTIF",

                                updatedAt :
                                    new Date()

                            });


                            created++;

                        }
                    );

                }
            );


        return {

            success :
                true,

            created :
                created,

            skipped :
                skipped

        };

    }

};