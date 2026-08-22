/** S6.3 isolated Work Order settlement preparation. No inventory execution. */
const CanonicalWorkOrderSettlementPreparationService={
  text_:function(value){return String(value===undefined||value===null?"":value).trim();},
  reservationKey_:function(workOrderId){return "CANONICAL_WO_SETTLEMENT:PREPARE:"+this.text_(workOrderId);},
  readReservation_:function(workOrderId){const raw=PropertiesService.getScriptProperties().getProperty(this.reservationKey_(workOrderId));return raw?JSON.parse(raw):null;},
  writeReservation_:function(plan,salesNumber,state,createdAt){const now=new Date().toISOString(),previous=createdAt||now,value={workOrderId:plan.workOrderId,settlementIdentity:plan.settlementIdentity,settlementFingerprint:plan.settlementFingerprint,salesNumber:salesNumber,state:state,createdAt:previous,updatedAt:now};PropertiesService.getScriptProperties().setProperty(this.reservationKey_(plan.workOrderId),JSON.stringify(value));return value;},
  assertSingle_:function(rows){if(rows.length>1)throw new Error("AUDIT_ANOMALY: lebih dari satu Sales untuk Work Order settlement.");},
  buildHeader_:function(plan,salesNumber,now){
    const payment=plan.paymentIntent||{};
    return {noTransaksi:salesNumber,tanggal:now,jam:now,idPelanggan:"",namaPelanggan:"",idKendaraan:"",platNomor:"",mekanikUtama:"",subtotal:plan.subtotal,diskonNota:0,grandTotal:plan.subtotal,bayar:0,kembalian:0,metodeBayar:this.text_(payment.paymentMethod||payment.metodeBayar||""),admin:this.text_(payment.admin||""),status:SalesStatus.DRAFT,createdAt:now,workOrder:plan.workOrderId,updatedAt:now,submissionId:plan.submissionId,idempotencyKey:plan.settlementIdentity,transactionId:"SALE:"+salesNumber+":OUT",payloadFingerprint:plan.settlementFingerprint};
  },
  buildLines_:function(plan,salesNumber){return plan.salesItems.map(function(line,index){const lineId=salesNumber+":L"+String(index+1).padStart(3,"0"), type=line.sourceLineType;return {lineId:lineId,itemType:line.itemType,itemId:line.itemId,nameSnapshot:line.nameSnapshot,quantity:line.quantity,unitPriceIntent:line.unitPriceIntent,lineDiscountIntent:line.lineDiscountIntent,calculatedLineTotal:line.lineSubtotal,mechanicIntent:line.mechanicId||"",fulfillmentSource:line.fulfillmentSource,workOrderPartId:line.workOrderPartId||"",sourceDocumentType:type,sourceDocumentId:type==="DIRECT_SALE"?salesNumber:plan.workOrderId,sourceDocumentLineId:type==="DIRECT_SALE"?lineId:line.sourceLineId};});},
  assertExisting_:function(existing,plan){
    if(existing.payloadFingerprint!==plan.settlementFingerprint)throw new Error("SETTLEMENT_CONFLICT");
    const details=PenjualanRepository.findItemsBySalesNumber(existing.salesNumber);
    if(details.length!==plan.salesItems.length)throw new Error("AUDIT_ANOMALY: detail settlement tidak konsisten.");
    return details;
  },
  prepare:function(input){
    const request=input||{}, workOrderId=this.text_(request.workOrderId);if(!workOrderId)throw new Error("workOrderId wajib diisi.");
    const lock=LockService.getScriptLock();lock.waitLock(30000);
    try{
      const plan=planCanonicalWorkOrderSettlement(request);if(!plan.eligible)throw new Error("Settlement preparation ditolak: "+plan.errors.join(" "));
      const metadata=WorkOrderRepository.getSettlementMetadata(workOrderId), candidates=PenjualanRepository.findSettlementSalesByWorkOrder(workOrderId), reservation=this.readReservation_(workOrderId);this.assertSingle_(candidates);
      if(metadata&&this.text_(metadata.settlementSalesNumber)&&!candidates.length)throw new Error("RECOVERY_REQUIRED: Work Order relation tanpa Sales.");
      if(candidates.length){
        this.assertExisting_(candidates[0],plan);
        if(reservation&&(this.text_(reservation.salesNumber)!==this.text_(candidates[0].salesNumber)||this.text_(reservation.settlementFingerprint)!==plan.settlementFingerprint))throw new Error("AUDIT_ANOMALY: reservation settlement tidak cocok dengan Sales.");
        if(!metadata||this.text_(metadata.settlementSalesNumber)!==this.text_(candidates[0].salesNumber))WorkOrderRepository.updateSettlementMetadata(workOrderId,{settlementStatus:"UNSETTLED",settlementIdentity:plan.settlementIdentity,settlementSalesNumber:candidates[0].salesNumber,settlementFingerprint:plan.settlementFingerprint,settledAt:""});
        if(!reservation||reservation.state!=="PREPARED")this.writeReservation_(plan,candidates[0].salesNumber,"PREPARED",reservation&&reservation.createdAt);
        return {success:true,state:"RESUMED",alreadyPrepared:true,salesNumber:candidates[0].salesNumber,plan:plan};
      }
      if(metadata&&this.text_(metadata.settlementFingerprint)&&this.text_(metadata.settlementFingerprint)!==plan.settlementFingerprint)throw new Error("SETTLEMENT_CONFLICT");
      if(reservation&&reservation.state==="PREPARED")throw new Error("RECOVERY_REQUIRED: PREPARED reservation tanpa Sales.");
      if(reservation&&this.text_(reservation.settlementFingerprint)!==plan.settlementFingerprint)throw new Error("SETTLEMENT_CONFLICT");
      const salesNumber=reservation?this.text_(reservation.salesNumber):RunningNumberService.generateNoLock_(DocumentType.SALES), now=new Date();
      if(!salesNumber)throw new Error("RECOVERY_REQUIRED: RESERVED settlement tanpa Sales number.");
      this.writeReservation_(plan,salesNumber,"RESERVED",reservation&&reservation.createdAt);
      PenjualanRepository.saveCanonicalHeader(this.buildHeader_(plan,salesNumber,now));
      PenjualanRepository.saveCanonicalDetails({noTransaksi:salesNumber,items:this.buildLines_(plan,salesNumber),createdAt:now});SpreadsheetApp.flush();
      const verified=PenjualanRepository.findSettlementSalesByWorkOrder(workOrderId);this.assertSingle_(verified);this.assertExisting_(verified[0],plan);
      WorkOrderRepository.updateSettlementMetadata(workOrderId,{settlementStatus:"UNSETTLED",settlementIdentity:plan.settlementIdentity,settlementSalesNumber:salesNumber,settlementFingerprint:plan.settlementFingerprint,settledAt:""});SpreadsheetApp.flush();
      this.writeReservation_(plan,salesNumber,"PREPARED",reservation&&reservation.createdAt);
      return {success:true,state:"PREPARED",alreadyPrepared:false,salesNumber:salesNumber,plan:plan};
    }finally{lock.releaseLock();}
  }
};
function prepareCanonicalWorkOrderSettlement(input){return CanonicalWorkOrderSettlementPreparationService.prepare(input);}
