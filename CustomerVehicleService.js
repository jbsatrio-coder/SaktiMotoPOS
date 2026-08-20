/**
 * ============================================
 * Customer Vehicle Service
 * Version : 1.0.0
 *
 * Membuat Customer + Kendaraan sekaligus
 * ============================================
 */

const CustomerVehicleService = {

    /**
     * ============================================
     * Membuat Customer baru beserta kendaraan
     * ============================================
     */
    createCustomerWithVehicle(payload){

        payload = payload || {};


        /**
         * ========================================
         * 1. NORMALISASI INPUT
         * ========================================
         */

        const nama =
            String(
                payload.nama || ""
            ).trim();

        const noHP =
            String(
                payload.noHP || ""
            ).trim();

        const alamat =
            String(
                payload.alamat || ""
            ).trim();

        const tanggalLahir =
            payload.tanggalLahir || "";

        const plat =
            String(
                payload.noPolisi || ""
            )
            .trim()
            .replace(/\s+/g, " ")
            .toUpperCase();

        const merk =
            String(
                payload.merk || ""
            ).trim();

        const model =
            String(
                payload.model || ""
            ).trim();

        const tahun =
            String(
                payload.tahun || ""
            ).trim();

        const warna =
            String(
                payload.warna || ""
            ).trim();


        /**
         * ========================================
         * 2. VALIDASI FIELD CUSTOMER
         * ========================================
         */

        if(!nama){

            throw new Error(
                "Nama Customer wajib diisi."
            );

        }


        /**
         * ========================================
         * 3. VALIDASI FIELD VEHICLE
         * ========================================
         *
         * Plat, Merk dan Model wajib untuk
         * workflow Customer Baru dari WO.
         *
         * Tahun dan Warna optional.
         */

        if(!plat){

            throw new Error(
                "Nomor Polisi wajib diisi."
            );

        }

        if(!merk){

            throw new Error(
                "Merk kendaraan wajib diisi."
            );

        }

        if(!model){

            throw new Error(
                "Model kendaraan wajib diisi."
            );

        }


        /**
         * ========================================
         * 4. PRE-VALIDATION VEHICLE
         * ========================================
         *
         * Dilakukan SEBELUM Customer dibuat.
         *
         * Tujuannya mengurangi kemungkinan:
         *
         * Customer berhasil dibuat
         * tetapi Vehicle gagal dibuat.
         *
         * validateCustomerId() belum dijalankan
         * di tahap ini karena Customer memang
         * belum dibuat.
         */

        const vehicleDraft = {

            id :
                "PREVIEW",

            customerId :
                "__PENDING_CUSTOMER__",

            noPolisi :
                plat,

            merk :
                merk,

            model :
                model,

            tahun :
                tahun,

            warna :
                warna,

            noMesin :
                "",

            noRangka :
                "",

            lastKilometer :
                0,

            status :
                VehicleStatus.AKTIF,

            catatan :
                ""

        };


        VehicleValidator.validateIdentity(
            vehicleDraft
        );

        VehicleValidator.validateStatus(
            vehicleDraft.status
        );

        VehicleValidator.validateDuplicatePlate(
            vehicleDraft,
            true
        );


        /**
         * ========================================
         * 5. CREATE CUSTOMER
         * ========================================
         */

        const customerResult =
            CustomerService.createCustomer({

                nama :
                    nama,

                noHP :
                    noHP,

                alamat :
                    alamat,

                tanggalLahir :
                    tanggalLahir,

                jenisKelamin :
                    payload.jenisKelamin ||
                    CustomerGender.PRIA,

                status :
                    payload.status ||
                    CustomerStatus.AKTIF,

                catatan :
                    payload.catatan || ""

            });


        const customerId =
            customerResult.customerId;


        if(!customerId){

            throw new Error(
                "Customer berhasil dibuat tetapi Customer ID tidak terbentuk."
            );

        }


        /**
         * ========================================
         * 6. CREATE VEHICLE
         * ========================================
         */

        const vehicleResult =
            VehicleService.createVehicle({

                customerId :
                    customerId,

                noPolisi :
                    plat,

                merk :
                    merk,

                model :
                    model,

                tahun :
                    tahun,

                warna :
                    warna,

                noMesin :
                    payload.noMesin || "",

                noRangka :
                    payload.noRangka || "",

                lastKilometer :
                    payload.lastKilometer || 0,

                status :
                    payload.vehicleStatus ||
                    VehicleStatus.AKTIF,

                catatan :
                    payload.vehicleCatatan || ""

            });


        const vehicleId =
            vehicleResult.vehicleId;


        if(!vehicleId){

            throw new Error(
                "Kendaraan gagal menghasilkan Vehicle ID."
            );

        }


        /**
         * ========================================
         * 7. RETURN RESULT
         * ========================================
         */

        return {

            success :
                true,

            customerId :
                customerId,

            vehicleId :
                vehicleId,

            nama :
                nama,

            noHP :
                noHP,

            plat :
                plat,

            merk :
                merk,

            model :
                model,

            tahun :
                tahun,

            warna :
                warna

        };

    }

};
