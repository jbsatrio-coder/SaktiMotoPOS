/**
 * ============================================
 * Barang Service
 * Phase 2
 * ============================================
 */

const BarangService = {

    /**
     * ==========================================
     * CREATE BARANG
     * ==========================================
     */

    createBarang(payload){

        // ======================================
        // 1. VALIDASI PAYLOAD DASAR
        // ======================================

        if(!payload){

            throw new Error(
                "Payload Barang wajib diisi."
            );

        }


        // ======================================
        // 2. GENERATE ID BARANG
        // ======================================

        const id =
            payload.id ||

            generateBarangId_();


        // ======================================
        // 3. GENERATE BARCODE
        // ======================================

        const barcode =
            payload.barcode ||

            generateBarcode_();


       // ======================================
// 4. SIAPKAN PRICING
// ======================================

let pricing;

const pricingMode =
    String(
        payload.pricingMode ||
        "HARGA_JUAL"
    ).trim().toUpperCase();


// ======================================
// MODE A
// HARGA MODAL + MARGIN
// -> HARGA JUAL
// ======================================

if (
    pricingMode === "MARGIN"
) {

    pricing =
        PricingService.calculateSellingPrice(

            payload.hargaModal,

            payload.margin

        );

}


// ======================================
// MODE B
// HARGA MODAL + HARGA JUAL
// -> MARGIN AKTUAL
// ======================================

else if (
    pricingMode === "HARGA_JUAL"
) {

    pricing =
        PricingService.calculateMarginFromSellingPrice(

            payload.hargaModal,

            payload.hargaJual

        );

}


// ======================================
// MODE TIDAK DIKENAL
// ======================================

else {

    throw new Error(

        "Pricing mode tidak valid : " +

        pricingMode

    );

}


        // ======================================
        // 5. BUAT DOCUMENT
        // ======================================

        const document =
            BarangDocument.create({

                ...payload,

                id :
                    id,

                barcode :
                    barcode,

                margin :
                    pricing.margin,

                hargaJual :
                    pricing.hargaJual

            });


        // ======================================
        // 6. VALIDASI DOCUMENT
        // ======================================

        BarangValidator.validateCreate(
            document
        );


        // ======================================
        // 7. SIMPAN KE MASTER BARANG
        // ======================================

        const result =
            BarangRepository.save(
                document
            );


        // ======================================
        // 8. LOG
        // ======================================

        Logger.log(

            "[BARANG CREATE] " +

            id +

            " | " +

            document.barang.nama

        );


        return result;

    }

};


/**
 * ============================================
 * TEST CREATE BARANG
 * ============================================
 *
 * TEST INI BELUM DISARANKAN DIJALANKAN
 * sebelum kita memastikan method save()
 * di BarangRepository sudah tersedia.
 *
 * ============================================
 */

function testCreateBarangService(){

    const result =

        BarangService.createBarang({

            nama :
                "Barang Test Service",

            namaPendek :
                "Test Service",

            kataKunci :
                "test service barang",

            kategori :
                "TEST",

            subkategori :
                "TEST",

            merk :
                "TEST",

            kendaraan :
                "MATIC",

            satuan :
                "PCS",

            hargaModal :
                15000,

            hargaJual :
                20000,

            margin :
                0.25,

            pricingMode :
                "HARGA_JUAL",

            stok :
                10,

            minStok :
                3,

            rak :
                "TEST",

            supplier :
                "SUP000001",

            status :
                "AKTIF",

            catatan :
                "Test BarangService",

            createdBy :
                "TEST"

        });


    Logger.log(

        JSON.stringify(

            result,

            null,

            2

        )

    );

}

function testCreateBarangServiceMargin(){

    const result =
        BarangService.createBarang({

            nama :
                "Barang Test Margin",

            namaPendek :
                "Test Margin",

            kataKunci :
                "test margin barang",

            kategori :
                "TEST",

            subkategori :
                "TEST",

            merk :
                "TEST",

            kendaraan :
                "MATIC",

            satuan :
                "PCS",

            hargaModal :
                15000,

            margin :
                0.30,

            pricingMode :
                "MARGIN",

            stok :
                10,

            minStok :
                3,

            rak :
                "TEST",

            supplier :
                "SUP000001",

            status :
                "AKTIF",

            catatan :
                "Test Mode Margin",

            createdBy :
                "TEST"

        });


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testCreateBarangServiceHargaJual(){

    const result =
        BarangService.createBarang({

            nama :
                "Barang Test Harga Pasar",

            namaPendek :
                "Test Harga Pasar",

            kataKunci :
                "test harga pasar barang",

            kategori :
                "TEST",

            subkategori :
                "TEST",

            merk :
                "TEST",

            kendaraan :
                "MATIC",

            satuan :
                "PCS",

            hargaModal :
                15000,

            hargaJual :
                20000,

            pricingMode :
                "HARGA_JUAL",

            stok :
                10,

            minStok :
                3,

            rak :
                "TEST",

            supplier :
                "SUP000001",

            status :
                "AKTIF",

            catatan :
                "Test Mode Harga Pasar",

            createdBy :
                "TEST"

        });


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}