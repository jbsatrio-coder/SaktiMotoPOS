/**
 * ============================================
 * Sales Service
 * Version : 1.0.0
 * Sprint  : 4D.5
 * ============================================
 */

const SalesService = {

    saveSale(payload){

        // 1. Buat Sales Document
        const salesDocument =
            SalesDocument.create(payload);

        // 2. Simpan Header
        PenjualanRepository.saveHeader(
            salesDocument.header
        );

        // 3. Simpan Detail
        PenjualanRepository.saveDetail({

            noTransaksi :
                salesDocument.header.noTransaksi,

            createdAt :
                salesDocument.header.createdAt,

            items :
                salesDocument.items

        });

        // 4. Buat Inventory Movements
        const movements =
            this.createSalesMovements(
                salesDocument
            );

        // 5. Update Inventory
        const batchResult =
            InventoryService.moveStockBatch(
                movements
            );

        // 6. Return Result
        return SalesResult.create(

            batchResult,

            salesDocument

        );

    },

    /**
 * Membuat satu Inventory Movement
 */
createSalesMovement(item, salesDocument){

    return {

        kodeBarang : item.kode,

        movementType : MovementType.SALE,

        qty : item.qty,

        reference :

            salesDocument.header.noTransaksi,

        note : "Sales",

        performedBy :

            salesDocument.header.admin

    };

},

/**
 * Membuat seluruh Inventory Movement
 */
createSalesMovements(salesDocument){

    return salesDocument.items

        .filter(item =>

            item.jenis === "BARANG"

        )

        .map(item =>

            this.createSalesMovement(

                item,

                salesDocument

            )

        );

},

};

function testCreateSalesMovements(){

    const salesDocument = SalesDocument.create({

        pelanggan : {

            id : "PLG001",

            nama : "TEST"

        },

        kendaraan : {

            id : "KND001",

            platNomor : "B1234XYZ"

        },

        transaksi : {

            diskonNota : 0,

            bayar : 100000,

            metodeBayar : "TUNAI",

            admin : "Developer",

            mekanikUtama : "MKN001"

        },

        items : [

            {

                jenis : "BARANG",

                kode : "BRG000114",

                nama : "Oli",

                qty : 2,

                subtotal : 40000

            },

            {

                jenis : "JASA",

                kode : "JSA000001",

                nama : "Service",

                qty : 1,

                subtotal : 60000

            }

        ]

    });

    Logger.log(

        JSON.stringify(

            SalesService.createSalesMovements(

                salesDocument

            ),

            null,

            2

        )

    );

}

function testSaveSale(){

    const result =
        SalesService.saveSale({

            pelanggan : {
                id : "PLG000001",
                nama : "TEST"
            },

            kendaraan : {
                id : "KND000001",
                platNomor : "B1234XYZ"
            },

            transaksi : {
                diskonNota : 5000,
                bayar : 150000,
                metodeBayar : "TUNAI",
                admin : "Developer",
                mekanikUtama : "MKN001",
                workOrder : ""
            },

            items : [

                {
                    jenis : "BARANG",
                    kode : "BRG000114",
                    nama : "Barang Test",
                    qty : 2,
                    harga : 50000,
                    diskon : 0,
                    subtotal : 100000,
                    mekanik : "MKN001",
                    komisi : 0,
                    hargaModal : 30000,
                    labaKotor : 40000
                },

                {
                    jenis : "JASA",
                    kode : "JSA000001",
                    nama : "Service Ringan",
                    qty : 1,
                    harga : 35000,
                    diskon : 0,
                    subtotal : 35000,
                    mekanik : "MKN001",
                    komisi : 15000,
                    hargaModal : 0,
                    labaKotor : 35000
                }

            ]

        });

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}