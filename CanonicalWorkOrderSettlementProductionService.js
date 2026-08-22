/** S6.4 production settlement. It reuses S6.2/S6.3/S3; no outer ScriptLock. */
const CanonicalWorkOrderSettlementProductionService={
  testHooks_:null,
  setTestHooksForTest_:function(hooks){this.testHooks_=hooks||null;},
  text_:function(value){return String(value===undefined||value===null?"":value).trim();},
  number_:function(value){const n=Number(value);return Number.isFinite(n)?n:null;},
  assert_:function(condition,message){if(!condition)throw new Error(message);},
  calculatePayment_:function(plan,input){
    const type=this.text_(input.discountType||plan.discountType||"NOMINAL").toUpperCase(), raw=this.number_(input.discountValue===undefined?plan.discountValue:input.discountValue);
    this.assert_(raw!==null&&raw>=0,"Discount settlement tidak valid.");
    let discount;
    if(type==="NOMINAL")discount=Math.round(raw);
    else if(type==="PERCENT"){this.assert_(raw<=100,"Discount percent tidak boleh lebih dari 100.");discount=Math.round(Number(plan.subtotal)*raw/100);}
    else throw new Error("Discount type tidak dikenali.");
    const total=Number(plan.subtotal)-discount;this.assert_(discount<=Number(plan.subtotal)&&total>=0,"Discount settlement melebihi subtotal.");
    const paymentMethod=this.text_(input.paymentMethod).toUpperCase(), supplied=this.number_(input.amountPaid);
    if(paymentMethod==="TUNAI"){this.assert_(supplied!==null&&supplied>=total,"Pembayaran TUNAI tidak mencukupi.");return {paymentMethod:paymentMethod,amountPaid:supplied,change:supplied-total,discount:discount,grandTotal:total};}
    if(paymentMethod==="QRIS")return {paymentMethod:paymentMethod,amountPaid:total,change:0,discount:discount,grandTotal:total};
    throw new Error("Metode pembayaran settlement tidak didukung.");
  },
  buildExecutionPlan_:function(header,details){
    const salesNumber=this.text_(header.salesNumber), submissionId=this.text_(header.submissionId), fingerprint=this.text_(header.payloadFingerprint);
    this.assert_(salesNumber&&submissionId&&fingerprint,"Sales settlement canonical tidak lengkap.");
    const lines=details.slice().sort(function(a,b){return String(a.lineId).localeCompare(String(b.lineId));}).map(function(detail){const direct=String(detail.itemType||"").trim().toUpperCase()==="BARANG"&&String(detail.fulfillmentSource||"").trim()==="DIRECT_SALE"&&String(detail.sourceDocumentType||"").trim()==="DIRECT_SALE";return {sourceLineId:String(detail.lineId||"").trim(),itemType:String(detail.itemType||"").trim().toUpperCase(),barangId:direct?String(detail.itemId||"").trim():"",quantity:Number(detail.quantity),requiresInventoryMovement:direct,fulfillmentSource:String(detail.fulfillmentSource||"").trim(),direction:direct?"OUT":""};});
    const inventoryLines=lines.filter(function(line){return line.requiresInventoryMovement===true;});
    return {canExecuteCanonicalSale:true,executionContext:"WORK_ORDER_SETTLEMENT",salesNumber:salesNumber,submissionId:submissionId,transactionId:"SALE:"+salesNumber+":OUT",transactionType:"SALE_OUT",sourceDocumentType:"SALES",sourceDocumentId:salesNumber,idempotencyKey:"SALE_SUBMIT:"+submissionId,payloadFingerprint:fingerprint,lines:lines,inventoryLines:inventoryLines};
  },
  assertFinalEvidence_:function(plan){return CanonicalSalesInventoryService.verifySaleOutEvidence(plan);},
  updatePosting_:function(salesNumber,payment){if(this.testHooks_&&typeof this.testHooks_.beforePosting==="function")this.testHooks_.beforePosting(salesNumber);return PenjualanRepository.updateCanonicalSettlementPaymentState(salesNumber,{amountPaid:payment.amountPaid,change:payment.change,paymentMethod:payment.paymentMethod,discount:payment.discount,grandTotal:payment.grandTotal,status:SalesStatus.POSTING,updatedAt:new Date()});},
  finalize_:function(salesNumber,payment){if(this.testHooks_&&typeof this.testHooks_.beforeFinalize==="function")this.testHooks_.beforeFinalize(salesNumber);const result=PenjualanRepository.updateCanonicalSettlementPaymentState(salesNumber,{amountPaid:payment.amountPaid,change:payment.change,paymentMethod:payment.paymentMethod,discount:payment.discount,grandTotal:payment.grandTotal,status:SalesStatus.LUNAS,updatedAt:new Date()});SpreadsheetApp.flush();return result;},
  finalizeWorkOrder_:function(plan,salesNumber){if(this.testHooks_&&typeof this.testHooks_.beforeWorkOrderFinalize==="function")this.testHooks_.beforeWorkOrderFinalize(plan.workOrderId);WorkOrderRepository.updateSettlementMetadata(plan.workOrderId,{settlementStatus:"SETTLED",settlementIdentity:plan.settlementIdentity,settlementSalesNumber:salesNumber,settlementFingerprint:plan.settlementFingerprint,settledAt:new Date()});SpreadsheetApp.flush();const metadata=WorkOrderRepository.getSettlementMetadata(plan.workOrderId);this.assert_(metadata&&this.text_(metadata.settlementStatus)==="SETTLED"&&this.text_(metadata.settlementIdentity)===plan.settlementIdentity&&this.text_(metadata.settlementSalesNumber)===salesNumber&&this.text_(metadata.settlementFingerprint)===plan.settlementFingerprint&&!!metadata.settledAt,"Finalisasi Work Order settlement tidak terverifikasi.");return metadata;},
  settle:function(input){
    const request=input||{}, workOrderId=this.text_(request.workOrderId), submissionId=this.text_(request.submissionId);this.assert_(workOrderId,"workOrderId wajib diisi.");this.assert_(submissionId,"submissionId wajib diisi untuk settlement.");
    const planningInput={workOrderId:workOrderId,submissionId:submissionId,directSaleItems:Array.isArray(request.directSaleItems)?request.directSaleItems:[],discountType:request.discountType,discountValue:request.discountValue,paymentIntent:{paymentMethod:request.paymentMethod,amountPaid:request.amountPaid,admin:request.admin||""}}, plan=planCanonicalWorkOrderSettlement(planningInput);this.assert_(plan.eligible,"Settlement ditolak: "+plan.errors.join(" "));
    const payment=this.calculatePayment_(plan,request), beforeMeta=WorkOrderRepository.getSettlementMetadata(workOrderId);
    if(beforeMeta&&this.text_(beforeMeta.settlementStatus)==="SETTLED"&&this.text_(beforeMeta.settlementFingerprint)!==plan.settlementFingerprint)throw new Error("SETTLEMENT_CONFLICT");
    const prepared=prepareCanonicalWorkOrderSettlement(planningInput), salesNumber=prepared.salesNumber, header=PenjualanRepository.findBySalesNumber(salesNumber), details=PenjualanRepository.findItemsBySalesNumber(salesNumber), executionPlan=this.buildExecutionPlan_(header,details);
    this.assert_(this.text_(header.payloadFingerprint)===plan.settlementFingerprint,"Sales settlement fingerprint tidak cocok.");
    const currentMeta=WorkOrderRepository.getSettlementMetadata(workOrderId);
    if(currentMeta&&this.text_(currentMeta.settlementStatus)==="SETTLED"){
      this.assert_(this.text_(currentMeta.settlementIdentity)===plan.settlementIdentity&&this.text_(currentMeta.settlementSalesNumber)===salesNumber&&this.text_(currentMeta.settlementFingerprint)===plan.settlementFingerprint,"SETTLEMENT_CONFLICT");
      this.assert_(this.text_(header.status)===SalesStatus.LUNAS,"Work Order SETTLED dengan Sales belum LUNAS.");
      const evidence=this.assertFinalEvidence_(executionPlan);return {success:true,workOrderId:workOrderId,salesNumber:salesNumber,settlementIdentity:plan.settlementIdentity,status:SalesStatus.LUNAS,settlementStatus:"SETTLED",alreadyPrepared:true,alreadyRecorded:evidence.alreadyRecorded,alreadySettled:true,recoveryState:"ALREADY_SETTLED",inventoryResult:evidence};
    }
    let inventoryResult;
    if(this.text_(header.status)===SalesStatus.LUNAS){inventoryResult=this.assertFinalEvidence_(executionPlan);}
    else {if(this.text_(header.status)===SalesStatus.DRAFT)this.updatePosting_(salesNumber,payment);else this.assert_(this.text_(header.status)===SalesStatus.POSTING,"Status Sales settlement tidak dapat dieksekusi: "+header.status);inventoryResult=CanonicalSalesInventoryService.recordSaleOutBatchAtomic(executionPlan);this.finalize_(salesNumber,payment);}
    const finalHeader=PenjualanRepository.findBySalesNumber(salesNumber);this.assert_(this.text_(finalHeader.status)===SalesStatus.LUNAS,"Sales settlement belum LUNAS.");
    const finalMeta=this.finalizeWorkOrder_(plan,salesNumber);return {success:true,workOrderId:workOrderId,salesNumber:salesNumber,settlementIdentity:plan.settlementIdentity,status:finalHeader.status,settlementStatus:finalMeta.settlementStatus,alreadyPrepared:prepared.alreadyPrepared===true,alreadyRecorded:inventoryResult.alreadyRecorded===true,alreadySettled:false,recoveryState:prepared.state,inventoryResult:inventoryResult};
  }
};
function settleCanonicalWorkOrder(input){return CanonicalWorkOrderSettlementProductionService.settle(input);}
