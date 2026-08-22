/**
 * S6.3 Work Order settlement schema foundation.
 *
 * Preflight is read-only. The apply function is intentionally separate and
 * must only be called after explicit Product Owner approval.
 */
const WORK_ORDER_SETTLEMENT_SCHEMA = {
  // The physical WorkOrder sheet uses `ID` as its authoritative document
  // column (not the legacy `NoWorkOrder` label).
  workOrderRequired:["ID","Status"],
  workOrderAppend:["SettlementStatus","SettlementIdentity","SettlementSalesNumber","SettlementFingerprint","SettledAt"],
  salesHeaderRequired:["NoTransaksi","WorkOrder","PayloadFingerprint"],
  salesHeaderAppend:[],
  salesDetailRequired:["IDDetail","NoTransaksi","LineId","FulfillmentSource","WorkOrderPartId"],
  salesDetailAppend:["SourceDocumentType","SourceDocumentId","SourceDocumentLineId"]
};

function canonicalWoSettlementHeaderName_(value){return String(value||"").trim().toLowerCase();}

function analyzeCanonicalWoSettlementSheet_(sheet,required,append){
  const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0], normalized=headers.map(canonicalWoSettlementHeaderName_);
  const duplicates=headers.filter(function(header,index){const value=normalized[index];return value&&normalized.indexOf(value)!==index;});
  return {sheetName:sheet.getName(),currentHeaders:headers,rowCount:sheet.getLastRow(),missingRequired:required.filter(function(name){return normalized.indexOf(canonicalWoSettlementHeaderName_(name))<0;}),missingAppendOnly:append.filter(function(name){return normalized.indexOf(canonicalWoSettlementHeaderName_(name))<0;}),duplicateHeaders:duplicates,hasDuplicateHeaders:duplicates.length>0};
}

function getCanonicalWorkOrderSettlementSchemaPreflight_(){
  const workOrder=analyzeCanonicalWoSettlementSheet_(WorkOrderRepository.sheet(),WORK_ORDER_SETTLEMENT_SCHEMA.workOrderRequired,WORK_ORDER_SETTLEMENT_SCHEMA.workOrderAppend);
  const salesHeader=analyzeCanonicalWoSettlementSheet_(PenjualanRepository.getHeaderSheet(),WORK_ORDER_SETTLEMENT_SCHEMA.salesHeaderRequired,WORK_ORDER_SETTLEMENT_SCHEMA.salesHeaderAppend);
  const salesDetail=analyzeCanonicalWoSettlementSheet_(PenjualanRepository.getDetailSheet(),WORK_ORDER_SETTLEMENT_SCHEMA.salesDetailRequired,WORK_ORDER_SETTLEMENT_SCHEMA.salesDetailAppend);
  return {success:true,mutationPerformed:false,workOrder:workOrder,salesHeader:salesHeader,salesDetail:salesDetail,safeToApplyAppendOnly:workOrder.missingRequired.length===0&&salesHeader.missingRequired.length===0&&salesDetail.missingRequired.length===0&&!workOrder.hasDuplicateHeaders&&!salesHeader.hasDuplicateHeaders&&!salesDetail.hasDuplicateHeaders,proposedColumns:{workOrder:WORK_ORDER_SETTLEMENT_SCHEMA.workOrderAppend,salesHeader:WORK_ORDER_SETTLEMENT_SCHEMA.salesHeaderAppend,salesDetail:WORK_ORDER_SETTLEMENT_SCHEMA.salesDetailAppend}};
}

function runCanonicalWorkOrderSettlementSchemaPreflightCli(){return getCanonicalWorkOrderSettlementSchemaPreflight_();}

function appendCanonicalWoSettlementColumns_(sheet,names){
  const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0].map(canonicalWoSettlementHeaderName_);
  const missing=names.filter(function(name){return headers.indexOf(canonicalWoSettlementHeaderName_(name))<0;});
  if(missing.length)sheet.getRange(1,sheet.getLastColumn()+1,1,missing.length).setValues([missing]);
  return missing;
}

function applyCanonicalWorkOrderSettlementSchemaMigrationCli(){
  const before=getCanonicalWorkOrderSettlementSchemaPreflight_();
  if(!before.safeToApplyAppendOnly)throw new Error("Schema settlement Work Order tidak aman untuk append-only migration.");
  const workOrderAdded=appendCanonicalWoSettlementColumns_(WorkOrderRepository.sheet(),WORK_ORDER_SETTLEMENT_SCHEMA.workOrderAppend);
  const detailAdded=appendCanonicalWoSettlementColumns_(PenjualanRepository.getDetailSheet(),WORK_ORDER_SETTLEMENT_SCHEMA.salesDetailAppend);
  SpreadsheetApp.flush();
  const after=getCanonicalWorkOrderSettlementSchemaPreflight_();
  if(after.workOrder.missingAppendOnly.length||after.salesDetail.missingAppendOnly.length)throw new Error("Schema settlement Work Order tidak lengkap setelah migration.");
  return {success:true,workOrderAdded:workOrderAdded,detailAdded:detailAdded,after:after};
}
