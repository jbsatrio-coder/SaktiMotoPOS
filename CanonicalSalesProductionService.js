/** Canonical S5 live orchestration for DIRECT_SALE only. */
const CanonicalSalesProductionService={
  testHooks_:null,
  setTestHooksForTest_:function(hooks){this.testHooks_=hooks||null;},
  text_:function(value){return String(value===undefined||value===null?"":value).trim();},
  number_:function(value){const n=Number(value);return Number.isFinite(n)?n:null;},
  rejectWop_:function(payload){
    const items=Array.isArray(payload&&payload.items)?payload.items:[];
    if(items.some(function(item){return String(item&&item.fulfillmentSource||"").trim().toUpperCase()==="WORK_ORDER_FULFILLED";})){
      throw new Error("WOP_SETTLEMENT_NOT_AVAILABLE");
    }
  },
  normalizeDiscount_:function(type,value,subtotal){
    const discountType=this.text_(type||"NOMINAL").toUpperCase(), raw=this.number_(value===undefined?0:value);
    if(raw===null||raw<0){throw new Error("Discount harus berupa angka nol atau positif.");}
    let nominal;
    if(discountType==="NOMINAL"){nominal=Math.round(raw);}
    else if(discountType==="PERCENT"){if(raw>100)throw new Error("Discount percent tidak boleh lebih dari 100.");nominal=Math.round(subtotal*raw/100);}
    else throw new Error("Discount type tidak dikenali.");
    if(nominal>subtotal)throw new Error("Discount tidak boleh melebihi subtotal.");
    return {discountType:discountType,discountValue:raw,nominal:nominal};
  },
  buildAuthoritativeRequest_:function(payload){
    if(!payload||!this.text_(payload.submissionId))throw new Error("submissionId wajib diisi untuk canonical Sales.");
    this.rejectWop_(payload);
    const self=this, tx=payload.transaksi||{}, rawItems=Array.isArray(payload.items)?payload.items:[];
    if(!rawItems.length)throw new Error("Item Sales wajib diisi.");
    const items=rawItems.map(function(raw){
      const type=self.text_(raw.itemType||raw.jenis).toUpperCase(), id=self.text_(raw.itemId||raw.kode||(type==="BARANG"?raw.barangId:raw.jasaId)), qty=self.number_(raw.quantity===undefined?raw.qty:raw.quantity);
      if(qty===null||qty<=0)throw new Error("Qty Sales harus lebih dari 0.");
      if(type==="BARANG"){
        const barang=BarangRepository.findById(id);if(!barang)throw new Error("Barang tidak ditemukan: "+id);
        if(self.text_(barang[COL_BARANG.STATUS]).toUpperCase()==="NONAKTIF")throw new Error("Barang tidak aktif: "+id);
        return {jenis:"BARANG",kode:id,qty:qty,harga:Number(barang[COL_BARANG.HARGAJUAL]),nama:barang[COL_BARANG.NAMA],fulfillmentSource:"DIRECT_SALE",diskon:0,mekanik:raw.mekanik||raw.mechanicId||""};
      }
      if(type==="JASA"){
        const jasa=JasaRepository.findById(id);if(!jasa)throw new Error("Jasa tidak ditemukan: "+id);
        if(self.text_(jasa[COL_JASA.STATUS]).toUpperCase()==="NONAKTIF")throw new Error("Jasa tidak aktif: "+id);
        return {jenis:"JASA",kode:id,qty:qty,harga:Number(jasa[COL_JASA.HARGA]),nama:jasa[COL_JASA.NAMA],diskon:0,mekanik:raw.mekanik||raw.mechanicId||""};
      }
      throw new Error("Tipe item Sales tidak dikenali.");
    });
    const subtotal=items.reduce(function(total,item){return total+item.qty*item.harga;},0), discount=this.normalizeDiscount_(payload.discountType||tx.discountType||"NOMINAL",payload.discountValue===undefined?(tx.discountValue===undefined?(tx.diskonNota||0):tx.discountValue):payload.discountValue,subtotal), total=subtotal-discount.nominal, method=this.text_(tx.metodeBayar||payload.paymentMethod).toUpperCase();
    let amount=this.number_(tx.bayar===undefined?payload.amountPaid:tx.bayar), change=0;
    if(method==="TUNAI"){if(amount===null||amount<total)throw new Error("Pembayaran TUNAI tidak mencukupi.");change=amount-total;}
    else if(method==="QRIS"){amount=total;change=0;}
    else throw new Error("Metode pembayaran tidak didukung.");
    return {submissionId:this.text_(payload.submissionId),pelanggan:payload.pelanggan||{},kendaraan:payload.kendaraan||{},admin:tx.admin||payload.admin||"",customerId:payload.pelanggan&&payload.pelanggan.id||payload.customerId||"",vehicleId:payload.kendaraan&&payload.kendaraan.id||payload.vehicleId||"",mechanicId:tx.mekanikUtama||payload.mechanicId||"",workOrderId:"",paymentMethod:method,amountPaid:amount,transactionDiscount:discount.nominal,items:items,commercial:{subtotal:subtotal,discount:discount.nominal,total:total,amountPaid:amount,change:change,discountType:discount.discountType}};
  },
  finalize_:function(number){if(this.testHooks_&&typeof this.testHooks_.beforeFinalize==="function")this.testHooks_.beforeFinalize(number);PenjualanRepository.updateCanonicalStatus(number,SalesStatus.LUNAS,new Date());SpreadsheetApp.flush();},
  saveCanonicalDirectSale:function(payload){
    const request=this.buildAuthoritativeRequest_(payload), prepared=CanonicalSalesPreparationService.prepareCanonicalSalesSubmission(request), header=PenjualanRepository.findBySalesNumber(prepared.salesNumber);
    if(header.status===SalesStatus.LUNAS)return {success:true,transactionNumber:prepared.salesNumber,salesNumber:prepared.salesNumber,status:SalesStatus.LUNAS,submissionId:request.submissionId,transactionId:prepared.plan.transactionId,alreadyPrepared:true,alreadyRecorded:true,subtotal:prepared.plan.calculatedSubtotal,discount:prepared.plan.calculatedDiscount,total:prepared.plan.calculatedTotal,amountPaid:prepared.plan.paymentIntent.amountPaid,change:prepared.plan.paymentIntent.change};
    PenjualanRepository.updateCanonicalStatus(prepared.salesNumber,SalesStatus.POSTING,new Date());
    const receipt=CanonicalSalesInventoryService.recordSaleOutBatchAtomic(prepared.plan);
    this.finalize_(prepared.salesNumber);
    return {success:true,transactionNumber:prepared.salesNumber,salesNumber:prepared.salesNumber,status:SalesStatus.LUNAS,submissionId:request.submissionId,transactionId:prepared.plan.transactionId,alreadyPrepared:prepared.alreadyPrepared,alreadyRecorded:receipt.alreadyRecorded,subtotal:prepared.plan.calculatedSubtotal,discount:prepared.plan.calculatedDiscount,total:prepared.plan.calculatedTotal,amountPaid:prepared.plan.paymentIntent.amountPaid,change:prepared.plan.paymentIntent.change,batchResult:receipt};
  }
};
