/**
 * Pure Work Order settlement planner.
 *
 * This module only reads authoritative Work Order, line, ledger and master
 * data. It never writes a Sales document, changes stock, or persists a
 * settlement relation. S6.3 owns durable settlement persistence.
 */
const CanonicalWorkOrderSettlementPlanner = {
  text_:function(value){return String(value===undefined||value===null?"":value).trim().replace(/\s+/g," ");},
  number_:function(value){const number=Number(value);return Number.isFinite(number)?number:null;},
  settlementIdentity_:function(workOrderId){return "WO_SETTLEMENT:"+this.text_(workOrderId);},
  readers_:function(options){
    const input=options||{};
    return {
      workOrder:input.findWorkOrder||function(id){return WorkOrderRepository.findById(id);},
      jasa:input.findWorkOrderJasa||function(id){return WorkOrderJasaRepository.findByWorkOrderId(id);},
      part:input.findWorkOrderPart||function(id){return WorkOrderPartRepository.findByWorkOrderId(id);},
      ledger:input.findLedgerByReference||function(reference){return StockLedgerRepository.findByReferensi(reference);},
      barang:input.findBarang||function(id){return BarangRepository.findById(id);},
      masterJasa:input.findJasa||function(id){return JasaRepository.findById(id);}
    };
  },
  fingerprint_:function(value){return JSON.stringify(value);},
  priceFromBarang_:function(row){return row?Number(row[COL_BARANG.HARGAJUAL]):null;},
  priceFromJasa_:function(row){return row?Number(row[COL_JASA.HARGA]):null;},
  buildWoJasaLine_:function(row,workOrderId){return {
    sourceLineType:"WORK_ORDER_JASA",sourceLineId:String(row[COL_WO_JASA.ID]||""),workOrderJasaId:String(row[COL_WO_JASA.ID]||""),workOrderId:workOrderId,itemType:"JASA",itemId:String(row[COL_WO_JASA.JASA_ID]||""),jasaId:String(row[COL_WO_JASA.JASA_ID]||""),nameSnapshot:String(row[COL_WO_JASA.NAMA_JASA]||""),quantity:Number(row[COL_WO_JASA.QTY]||0),unitPriceIntent:Number(row[COL_WO_JASA.HARGA]||0),lineDiscountIntent:Number(row[COL_WO_JASA.DISKON]||0),lineSubtotal:Number(row[COL_WO_JASA.SUBTOTAL]||0),mechanicId:String(row[COL_WO_JASA.MEKANIK_ID]||""),fulfillmentSource:"WORK_ORDER_FULFILLED",requiresInventoryMovement:false
  };},
  buildWoPartLine_:function(row,workOrderId){return {
    sourceLineType:"WORK_ORDER_PART",sourceLineId:String(row[COL_WORK_ORDER_PART.ID]||""),workOrderPartId:String(row[COL_WORK_ORDER_PART.ID]||""),workOrderId:workOrderId,itemType:"BARANG",itemId:String(row[COL_WORK_ORDER_PART.BARANG_ID]||""),barangId:String(row[COL_WORK_ORDER_PART.BARANG_ID]||""),nameSnapshot:String(row[COL_WORK_ORDER_PART.NAMA_BARANG_SNAPSHOT]||""),quantity:Number(row[COL_WORK_ORDER_PART.QTY]||0),unitPriceIntent:Number(row[COL_WORK_ORDER_PART.HARGA]||0),lineDiscountIntent:Number(row[COL_WORK_ORDER_PART.DISKON]||0),lineSubtotal:Number(row[COL_WORK_ORDER_PART.TOTAL]||0),fulfillmentSource:"WORK_ORDER_FULFILLED",requiresInventoryMovement:false
  };},
  validatePartLedger_:function(row,ledgers){
    const partId=String(row[COL_WORK_ORDER_PART.ID]||""),barangId=String(row[COL_WORK_ORDER_PART.BARANG_ID]||""),qty=Number(row[COL_WORK_ORDER_PART.QTY]||0),rows=Array.isArray(ledgers)?ledgers:[];
    const service=rows.filter(function(ledger){return String(ledger[COL_STOK.JENISMUTASI]||"").trim()==="SERVICE"&&String(ledger[COL_STOK.REFERENSI]||"").trim()===partId;});
    const reversal=rows.filter(function(ledger){return String(ledger[COL_STOK.JENISMUTASI]||"").trim()==="REVERSAL"&&String(ledger[COL_STOK.REFERENSI]||"").trim()===partId;});
    if(service.length!==1)return "WOP harus memiliki tepat satu SERVICE OUT: "+partId;
    if(String(service[0][COL_STOK.BARANG_ID]||"").trim()!==barangId||Number(service[0][COL_STOK.QTYKELUAR]||0)!==qty)return "SERVICE OUT WOP tidak cocok dengan Barang/qty: "+partId;
    if(reversal.length>0)return "WOP sudah memiliki REVERSAL dan tidak dapat ditagihkan: "+partId;
    return "";
  },
  directLines_:function(items,readers,errors){
    return (Array.isArray(items)?items:[]).map(function(raw){
      const item=raw||{},type=String(item.itemType||item.jenis||"").trim().toUpperCase(),id=String(item.itemId||item.kode||(type==="BARANG"?item.barangId:item.jasaId)||"").trim(),qty=Number(item.quantity===undefined?item.qty:item.quantity),discount=Number(item.lineDiscount===undefined?(item.diskon||0):item.lineDiscount);
      const master=type==="BARANG"?readers.barang(id):(type==="JASA"?readers.masterJasa(id):null),price=type==="BARANG"?CanonicalWorkOrderSettlementPlanner.priceFromBarang_(master):CanonicalWorkOrderSettlementPlanner.priceFromJasa_(master);
      if((type!=="BARANG"&&type!=="JASA")||!id||!Number.isFinite(qty)||qty<=0||!master||!Number.isFinite(price)||!Number.isFinite(discount)||discount<0){errors.push("Direct Sale item tidak valid: "+(id||"(blank)"));return null;}
      if(discount>qty*price){errors.push("Diskon Direct Sale melebihi subtotal: "+id);return null;}
      return {sourceLineType:"DIRECT_SALE",sourceLineId:"DIRECT:"+type+":"+id+":"+qty+":"+discount,itemType:type,itemId:id,barangId:type==="BARANG"?id:"",jasaId:type==="JASA"?id:"",quantity:qty,unitPriceIntent:price,lineDiscountIntent:discount,lineSubtotal:qty*price-discount,mechanicId:String(item.mechanicId||item.mekanik||""),fulfillmentSource:"DIRECT_SALE",requiresInventoryMovement:type==="BARANG"};
    }).filter(function(item){return !!item;});
  },
  plan:function(input,options){
    const request=input||{},readers=this.readers_(options),workOrderId=this.text_(request.workOrderId),errors=[],warnings=[];
    const plan={workOrderId:workOrderId,submissionId:this.text_(request.submissionId),settlementIdentity:this.settlementIdentity_(workOrderId),settlementFingerprint:"",workOrderStatus:"",eligible:false,woJasaLines:[],woPartLines:[],directSaleLines:[],salesItems:[],inventoryLines:[],nonInventoryLines:[],subtotal:0,discountType:this.text_(request.discountType||"NOMINAL").toUpperCase()||"NOMINAL",discountValue:this.number_(request.discountValue===undefined?0:request.discountValue),paymentIntent:request.paymentIntent||{},errors:errors,warnings:warnings};
    if(!workOrderId){errors.push("Work Order ID wajib diisi.");return plan;}
    const workOrder=readers.workOrder(workOrderId);
    if(!workOrder){errors.push("Work Order tidak ditemukan: "+workOrderId);return plan;}
    plan.workOrderStatus=String(workOrder[COL_WORK_ORDER.STATUS]||"").trim();
    if(plan.workOrderStatus!==WorkOrderStatus.SELESAI){errors.push("Work Order hanya dapat diselesaikan saat status SELESAI.");}
    const jasaRows=readers.jasa(workOrderId)||[],partRows=readers.part(workOrderId)||[];
    jasaRows.forEach(function(row){const jasaWorkOrderId=String(row[COL_WO_JASA.WORK_ORDER_ID]||"").trim(),status=String(row[COL_WO_JASA.STATUS]||"").trim();if(jasaWorkOrderId!==workOrderId){errors.push("Relasi WorkOrderJasa tidak sesuai: "+String(row[COL_WO_JASA.ID]||""));return;}if(status===WorkOrderJasaStatus.CANCEL)return;if(status!==WorkOrderJasaStatus.DONE){errors.push("WorkOrderJasa belum DONE: "+String(row[COL_WO_JASA.ID]||""));return;}const line=CanonicalWorkOrderSettlementPlanner.buildWoJasaLine_(row,workOrderId);if(!line.sourceLineId||!line.itemId||line.quantity<=0||line.unitPriceIntent<0||line.lineSubtotal<0){errors.push("Snapshot WorkOrderJasa tidak valid: "+line.sourceLineId);return;}plan.woJasaLines.push(line);});
    partRows.forEach(function(row){const partWorkOrderId=String(row[COL_WORK_ORDER_PART.WORK_ORDER_ID]||"").trim(),status=String(row[COL_WORK_ORDER_PART.STATUS]||"").trim();if(partWorkOrderId!==workOrderId){errors.push("Relasi WorkOrderPart tidak sesuai: "+String(row[COL_WORK_ORDER_PART.ID]||""));return;}if(status===WorkOrderPartStatus.CANCEL)return;if(status!==WorkOrderPartStatus.DONE){errors.push("WorkOrderPart belum DONE: "+String(row[COL_WORK_ORDER_PART.ID]||""));return;}const issue=CanonicalWorkOrderSettlementPlanner.validatePartLedger_(row,readers.ledger(String(row[COL_WORK_ORDER_PART.ID]||"")));if(issue){errors.push(issue);return;}const line=CanonicalWorkOrderSettlementPlanner.buildWoPartLine_(row,workOrderId);if(!line.sourceLineId||!line.itemId||line.quantity<=0||line.unitPriceIntent<0||line.lineSubtotal<0){errors.push("Snapshot WorkOrderPart tidak valid: "+line.sourceLineId);return;}plan.woPartLines.push(line);});
    plan.directSaleLines=this.directLines_(request.directSaleItems,readers,errors).sort(function(a,b){const ak=[a.itemType,a.itemId,a.quantity,a.lineDiscountIntent,a.mechanicId].join(":"),bk=[b.itemType,b.itemId,b.quantity,b.lineDiscountIntent,b.mechanicId].join(":");return ak<bk?-1:(ak>bk?1:0);});
    plan.salesItems=plan.woJasaLines.concat(plan.woPartLines,plan.directSaleLines).sort(function(a,b){const ak=[a.sourceLineType,a.sourceLineId].join(":"),bk=[b.sourceLineType,b.sourceLineId].join(":");return ak<bk?-1:(ak>bk?1:0);}).map(function(line){return Object.assign({},line,{qty:line.quantity,unitPrice:line.unitPriceIntent,lineDiscount:line.lineDiscountIntent});});
    plan.inventoryLines=plan.salesItems.filter(function(line){return line.requiresInventoryMovement===true;});plan.nonInventoryLines=plan.salesItems.filter(function(line){return line.requiresInventoryMovement!==true;});plan.subtotal=plan.salesItems.reduce(function(total,line){return total+Number(line.lineSubtotal||0);},0);
    if(plan.discountValue===null||plan.discountValue<0)errors.push("Discount settlement tidak valid.");
    const fingerprint={workOrderId:plan.workOrderId,settlementIdentity:plan.settlementIdentity,workOrderStatus:plan.workOrderStatus,woJasaLines:plan.woJasaLines,woPartLines:plan.woPartLines,directSaleLines:plan.directSaleLines,discountType:plan.discountType,discountValue:plan.discountValue};plan.settlementFingerprint=this.fingerprint_(fingerprint);plan.eligible=errors.length===0;return plan;
  },
  compare:function(existingPlan,incomingPlan){
    if(!existingPlan||!incomingPlan)throw new Error("Settlement plans wajib diisi.");
    if(existingPlan.settlementIdentity!==incomingPlan.settlementIdentity)return "DIFFERENT_SETTLEMENT";
    return existingPlan.settlementFingerprint===incomingPlan.settlementFingerprint?"SAME_SETTLEMENT":"SETTLEMENT_CONFLICT";
  }
};

function planCanonicalWorkOrderSettlement(input,options){return CanonicalWorkOrderSettlementPlanner.plan(input,options);}
function compareWorkOrderSettlement(existingPlan,incomingPlan){return CanonicalWorkOrderSettlementPlanner.compare(existingPlan,incomingPlan);}
