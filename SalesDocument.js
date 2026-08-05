/**
 * ============================================
 * Sales Document
 * Version : 1.0.0
 * Sprint  : 4D.5
 * ============================================
 */

const SalesDocument = {

    create(payload){

    
        const now = new Date();

        const subtotal = payload.items.reduce(
            (sum, item) => sum + parseNumber(item.subtotal),
            0
        );



        const diskonNota =
            parseNumber(
                payload.transaksi.diskonNota
            );

        const grandTotal =
            subtotal - diskonNota;

        const bayar =
            parseNumber(
                payload.transaksi.bayar
            );

        const kembalian =
            bayar - grandTotal;

        return {

            header : {

    noTransaksi :

        RunningNumberService.generate(

            DocumentType.SALES

        ),

    tanggal : now,

    idPelanggan :

        payload.pelanggan.id,

    namaPelanggan :

        payload.pelanggan.nama,

    idKendaraan :

        payload.kendaraan.id,

    platNomor :

        payload.kendaraan.platNomor,

    mekanikUtama :

        payload.transaksi.mekanikUtama,

    metodeBayar :

        payload.transaksi.metodeBayar,

    admin :

        payload.transaksi.admin,

    workOrder :

        payload.transaksi.workOrder || "",

    subtotal,

    diskonNota,

    grandTotal,

    bayar,

    kembalian,

    status :

        SalesStatus.LUNAS,

    createdAt : now,

    updatedAt : ""

},

            items :

                payload.items

        };

    }

};