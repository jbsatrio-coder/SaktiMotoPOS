/**
 * ============================================
 * Vehicle Repository
 * Version : 1.0.0
 * ============================================
 */

const VehicleRepository = {

    /**
     * Mengambil Sheet Master Kendaraan
     */
    sheet(){

        return getSheet_(
            CONFIG.SHEET.VEHICLE
        );

    },

    /**
     * Mengambil seluruh data kendaraan
     */
    findAll(){

        const sh = this.sheet();

        if(sh.getLastRow() < 2){

            return [];

        }

        return sh
            .getDataRange()
            .getValues()
            .slice(1);

    },

    /**
     * Mencari nomor baris berdasarkan Vehicle ID
     */
    findRowById(vehicleId){

        const sh = this.sheet();

        const lastRow = sh.getLastRow();

        if(lastRow < 2){

            return 0;

        }

        const ids = sh
            .getRange(
                2,
                SHEET_COL_VEHICLE.ID,
                lastRow - 1,
                1
            )
            .getValues();

        for(let i = 0; i < ids.length; i++){

            if(

                String(ids[i][0]).trim() ===
                String(vehicleId).trim()

            ){

                return i + 2;

            }

        }

        return 0;

    },

    /**
     * Memastikan Vehicle ada
     */
    requireRow(vehicleId){

        const row =
            this.findRowById(vehicleId);

        if(row === 0){

            throw new Error(

                "Vehicle tidak ditemukan : " +

                vehicleId

            );

        }

        return row;

    },

    /**
     * Mengecek apakah Vehicle ada
     */
    exists(vehicleId){

        return this.findRowById(
            vehicleId
        ) > 0;

    },

    /**
     * Mengambil satu kendaraan berdasarkan ID
     */
    findById(vehicleId){

        const row =
            this.findRowById(
                vehicleId
            );

        if(row === 0){

            return null;

        }

        return this.sheet()

            .getRange(
                row,
                1,
                1,
                14
            )

            .getValues()[0];

    },

/**
 * ============================================
 * Cari Vehicle berdasarkan Nomor Polisi
 * ============================================
 */
findByPlate(plate){

    const keyword =
        String(
            plate || ""
        )
        .trim()
        .replace(/\s+/g, "")
        .toUpperCase();

    if(!keyword){

        return null;

    }

    const vehicles =
        this.findAll();

    for(let i = 0; i < vehicles.length; i++){

        const vehicle =
            vehicles[i];

        const existingPlate =
            String(
                vehicle[
                    COL_VEHICLE.PLATE
                ] || ""
            )
            .trim()
            .replace(/\s+/g, "")
            .toUpperCase();

        if(
            existingPlate === keyword
        ){

            return vehicle;

        }

    }

    return null;

},

    /**
     * Menyimpan kendaraan baru
     */
    save(vehicleDocument){

        const vehicle =
            vehicleDocument.vehicle;

        this.sheet()

            .appendRow([

                vehicle.id,

                vehicle.customerId,

                vehicle.noPolisi,

                vehicle.merk,

                vehicle.model,

                vehicle.tahun,

                vehicle.warna,

                vehicle.noMesin,

                vehicle.noRangka,

                vehicle.lastKilometer,

                vehicle.status,

                vehicle.catatan,

                vehicle.createdAt,

                vehicle.updatedAt

            ]);

        return {

            success : true,

            vehicleId :
                vehicle.id

        };

    },

    /**
 * Update kendaraan
 */
update(vehicleDocument){

    const vehicle =
        vehicleDocument.vehicle;

    const row =
        this.requireRow(
            vehicle.id
        );

    const createdAt =
        this.sheet()

            .getRange(
                row,
                SHEET_COL_VEHICLE.CREATED_AT
            )

            .getValue();

    this.sheet()

        .getRange(
            row,
            1,
            1,
            14
        )

        .setValues([[

            vehicle.id,

            vehicle.customerId,

            vehicle.noPolisi,

            vehicle.merk,

            vehicle.model,

            vehicle.tahun,

            vehicle.warna,

            vehicle.noMesin,

            vehicle.noRangka,

            vehicle.lastKilometer,

            vehicle.status,

            vehicle.catatan,

            createdAt,

            new Date()

        ]]);

    return {

        success : true,

        vehicleId :
            vehicle.id

    };

}

};

