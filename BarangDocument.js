/**
 * ============================================
 * Barang Document
 * Phase 2
 * ============================================
 */

const BarangDocument = {

    create(payload){

        const now = new Date();

        return {

            barang : {

                id :
                    payload.id,

                barcode :
                    payload.barcode,

                kataKunci :
                    payload.kataKunci || "",

                namaPendek :
                    payload.namaPendek || "",

                nama :
                    payload.nama,

                kategori :
                    payload.kategori || "",

                subkategori :
                    payload.subkategori || "",

                merk :
                    payload.merk || "",

                kendaraan :
                    payload.kendaraan || "",

                satuan :
                    payload.satuan,

                hargaModal :
                    Number(
                        payload.hargaModal || 0
                    ),

                margin :
                    Number(
                        payload.margin || 0
                    ),

                hargaJual :
                    Number(
                        payload.hargaJual || 0
                    ),

                stok :
                    Number(
                        payload.stok || 0
                    ),

                minStok :
                    Number(
                        payload.minStok || 0
                    ),

                rak :
                    payload.rak || "",

                supplier :
                    payload.supplier || "",

                status :
                    payload.status || "AKTIF",

                catatan :
                    payload.catatan || "",

                createdAt :
                    now,

                updatedAt :
                    "",

                createdBy :
                    payload.createdBy || "SYSTEM",

                updatedBy :
                    ""

            }

        };

    }

};


/**
 * ============================================
 * TEST
 * ============================================
 */

function testCreateBarangDocument(){

    const barang =
        BarangDocument.create({

            id :
                "BRG999998",

            barcode :
                "199999998",

            kataKunci :
                "oli oli mesin",

            namaPendek :
                "Federal 10W-40",

            nama :
                "Federal Matic 10W-40 0.8L",

            kategori :
                "OLI",

            subkategori :
                "OLI MESIN",

            merk :
                "FEDERAL",

            kendaraan :
                "MATIC",

            satuan :
                "PCS",

            hargaModal :
                15000,

            margin :
                0.25,

            hargaJual :
                20000,

            stok :
                10,

            minStok :
                3,

            rak :
                "A-01",

            supplier :
                "SUP000001",

            status :
                "AKTIF",

            catatan :
                "Barang test",

            createdBy :
                "TEST"

        });


    Logger.log(

        JSON.stringify(

            barang,

            null,

            2

        )

    );

}