/**
 * ============================================
 * Stock Ledger Service
 * Version : 1.0.0
 * ============================================
 */

const StockLedgerService = {

    /**
     * Membuat catatan mutasi stok
     */
    recordOut(data){

        if(!data){

            throw new Error(
                "Data mutasi stok wajib diisi."
            );

        }


        if(!data.barangId){

            throw new Error(
                "Barang ID wajib diisi."
            );

        }


        if(!data.qty){

            throw new Error(
                "Qty mutasi wajib diisi."
            );

        }


        const qty =
            Number(data.qty);


        if(qty <= 0){

            throw new Error(
                "Qty mutasi harus lebih besar dari 0."
            );

        }


        if(data.stokAwal === undefined){

            throw new Error(
                "Stok awal wajib diisi."
            );

        }


        const stokAwal =
            Number(data.stokAwal);


        const stokAkhir =
            stokAwal - qty;


        if(stokAkhir < 0){

            throw new Error(
                "Stok tidak mencukupi."
            );

        }


        const result = {

            id :
                data.id || "",

            tanggal :
                data.tanggal ||
                new Date(),

            jam :
                data.jam ||
                new Date(),

            barangId :
                data.barangId,

            namaBarang :
                data.namaBarang || "",

            jenisMutasi :
                data.jenisMutasi ||
                "PENGELUARAN",

            referensi :
                data.referensi || "",

            stokAwal :
                stokAwal,

            qtyMasuk :
                0,

            qtyKeluar :
                qty,

            stokAkhir :
                stokAkhir,

            keterangan :
                data.keterangan || "",

            admin :
                data.admin || "",

            createdAt :
                data.createdAt ||
                new Date()

        };


        StockLedgerRepository.addHistory(
            result
        );


        return {

            success : true,

            stockLedgerId :
                result.id,

            barangId :
                result.barangId,

            qtyKeluar :
                result.qtyKeluar,

            stokAwal :
                result.stokAwal,

            stokAkhir :
                result.stokAkhir

        };

    }

};