/**
 * S6.3M3D clean WOP V2 fixture. Test infrastructure only.
 * The legacy BRG000163/BRG000164 fixtures are intentionally never referenced.
 */

const CANONICAL_WO_S63_CLEAN_WOP_V2 = {
    barangId: "BRG000165",
    barangMarker: "BARANG_CREATE_HARDENING_TEST",
    seedReference: "S63_TEST_SEED:BRG000165:S63_WOP_V2",
    workOrderMarker: "S63_TEST_WO_WOP_V2",
    customerId: "CUS2608220001",
    vehicleId: "VEH2608220001",
    actor: "S6.3_TEST"
};

function canonicalWoS63CleanWopV2Text_(value){
    return String(value === undefined || value === null ? "" : value).trim();
}

function canonicalWoS63CleanWopV2Assert_(condition, message){
    if(!condition){
        throw new Error(message);
    }
}

function canonicalWoS63CleanWopV2FreshBarang_(){
    const id = CANONICAL_WO_S63_CLEAN_WOP_V2.barangId;
    const active = SpreadsheetApp.getActiveSpreadsheet();
    const spreadsheet = SpreadsheetApp.openById(active.getId());
    const sheet = spreadsheet.getSheetByName(CONFIG.SHEET.BARANG);
    const rows = sheet.getRange(
        2,
        1,
        Math.max(sheet.getLastRow() - 1, 1),
        COL_BARANG.TOTAL
    ).getValues();
    return rows.find(function(row){
        return canonicalWoS63CleanWopV2Text_(row[COL_BARANG.ID]) === id;
    }) || null;
}

function canonicalWoS63CleanWopV2LedgersByBarang_(){
    const sheet = StockLedgerRepository.sheet();
    if(sheet.getLastRow() < 2){
        return [];
    }
    return sheet.getRange(2, 1, sheet.getLastRow() - 1, 14)
        .getValues()
        .filter(function(row){
            return canonicalWoS63CleanWopV2Text_(row[COL_STOK.BARANG_ID]) ===
                CANONICAL_WO_S63_CLEAN_WOP_V2.barangId;
        });
}

function canonicalWoS63CleanWopV2FindWorkOrder_(){
    const matches = WorkOrderRepository.findAll().filter(function(row){
        return canonicalWoS63CleanWopV2Text_(row[COL_WORK_ORDER.CATATAN])
            .indexOf(CANONICAL_WO_S63_CLEAN_WOP_V2.workOrderMarker) >= 0;
    });
    if(matches.length > 1){
        throw new Error("Fixture clean WOP V2 memiliki Work Order duplikat.");
    }
    return matches[0] || null;
}

function auditCanonicalWorkOrderSettlementCleanWopV2CandidateCli(){
    const barang = BarangRepository.findById(
        CANONICAL_WO_S63_CLEAN_WOP_V2.barangId
    );
    const fresh = canonicalWoS63CleanWopV2FreshBarang_();
    const ledgers = canonicalWoS63CleanWopV2LedgersByBarang_();
    const workOrderParts = WorkOrderPartRepository.findAll().filter(function(row){
        return canonicalWoS63CleanWopV2Text_(row[COL_WORK_ORDER_PART.BARANG_ID]) ===
            CANONICAL_WO_S63_CLEAN_WOP_V2.barangId;
    });
    const detailSheet = PenjualanRepository.getDetailSheet();
    const detailColumns = PenjualanRepository.getColumnMap_(detailSheet);
    const sales = detailSheet.getLastRow() < 2 ? [] : detailSheet
        .getRange(2, 1, detailSheet.getLastRow() - 1, detailSheet.getLastColumn())
        .getValues()
        .filter(function(row){
            return canonicalWoS63CleanWopV2Text_(row[detailColumns.KodeItem]) ===
                CANONICAL_WO_S63_CLEAN_WOP_V2.barangId;
        });
    let validationError = "";

    try{
        BarangValidator.validateKategori({barang:{kategori:barang && barang[COL_BARANG.KATEGORI]}});
        BarangValidator.validateMerk({barang:{merk:barang && barang[COL_BARANG.MERK]}});
        BarangValidator.validateSatuan({barang:{satuan:barang && barang[COL_BARANG.SATUAN]}});
        BarangValidator.validateStatus({barang:{status:barang && barang[COL_BARANG.STATUS]}});
    } catch(error){
        validationError = String(error.message || error);
    }

    const suitable = !!barang && !!fresh &&
        canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.NAMA]) === CANONICAL_WO_S63_CLEAN_WOP_V2.barangMarker &&
        canonicalWoS63CleanWopV2Text_(fresh[COL_BARANG.NAMA]) === CANONICAL_WO_S63_CLEAN_WOP_V2.barangMarker &&
        canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.KATEGORI]) === canonicalWoS63CleanWopV2Text_(fresh[COL_BARANG.KATEGORI]) &&
        canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.MERK]) === canonicalWoS63CleanWopV2Text_(fresh[COL_BARANG.MERK]) &&
        Number(barang[COL_BARANG.HARGAMODAL]) === 10000 &&
        Number(fresh[COL_BARANG.HARGAMODAL]) === 10000 &&
        Number(barang[COL_BARANG.HARGAJUAL]) === 20000 &&
        Number(fresh[COL_BARANG.HARGAJUAL]) === 20000 &&
        Number(barang[COL_BARANG.STOK]) === 0 &&
        Number(fresh[COL_BARANG.STOK]) === 0 &&
        canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.SATUAN]) === "PCS" &&
        canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.STATUS]) === "AKTIF" &&
        !validationError && ledgers.length === 0 && workOrderParts.length === 0 && sales.length === 0;

    return {
        success: true,
        classification: suitable ? "SAFE_TO_REUSE_AS_S63_WOP_V2" : "UNSAFE",
        barangId: CANONICAL_WO_S63_CLEAN_WOP_V2.barangId,
        nama: barang ? canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.NAMA]) : "",
        kategori: barang ? canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.KATEGORI]) : "",
        subkategori: barang ? canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.SUBKATEGORI]) : "",
        merk: barang ? canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.MERK]) : "",
        satuan: barang ? canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.SATUAN]) : "",
        hargaModal: barang ? Number(barang[COL_BARANG.HARGAMODAL]) : null,
        hargaJual: barang ? Number(barang[COL_BARANG.HARGAJUAL]) : null,
        stok: barang ? Number(barang[COL_BARANG.STOK]) : null,
        status: barang ? canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.STATUS]) : "",
        catatan: barang ? canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.CATATAN]) : "",
        createdBy: barang ? canonicalWoS63CleanWopV2Text_(barang[COL_BARANG.CREATED_BY]) : "",
        freshHargaJual: fresh ? Number(fresh[COL_BARANG.HARGAJUAL]) : null,
        validationError: validationError,
        ledgerCount: ledgers.length,
        workOrderPartCount: workOrderParts.length,
        salesSettlementReferenceCount: sales.length
    };
}

function canonicalWoS63CleanWopV2AdvanceWorkOrder_(workOrderId){
    [
        WorkOrderStatus.MENUNGGU_DIAGNOSA,
        WorkOrderStatus.MENUNGGU_APPROVAL,
        WorkOrderStatus.DALAM_PENGERJAAN,
        WorkOrderStatus.QC,
        WorkOrderStatus.SELESAI
    ].forEach(function(nextStatus){
        const row = WorkOrderRepository.findById(workOrderId);
        const current = row ? canonicalWoS63CleanWopV2Text_(row[COL_WORK_ORDER.STATUS]) : "";
        if(current !== WorkOrderStatus.SELESAI && current !== nextStatus){
            WorkOrderService.changeStatus(workOrderId, nextStatus);
        }
    });
}

function runCanonicalWorkOrderSettlementCleanWopV2FixtureCli(){
    const candidate = auditCanonicalWorkOrderSettlementCleanWopV2CandidateCli();
    canonicalWoS63CleanWopV2Assert_(
        candidate.classification === "SAFE_TO_REUSE_AS_S63_WOP_V2",
        "BRG000165 tidak aman untuk fixture V2."
    );

    const barangId = candidate.barangId;
    const seedReference = CANONICAL_WO_S63_CLEAN_WOP_V2.seedReference;
    const beforeSeed = StockLedgerRepository.findByReferensiFresh(seedReference);
    canonicalWoS63CleanWopV2Assert_(beforeSeed.length === 0, "Seed V2 sudah ada sebelum preflight.");
    canonicalWoS63CleanWopV2Assert_(Number(BarangRepository.getStock(barangId)) === 0, "Stok V2 sebelum seed harus 0.");

    InventoryService.moveStock({
        kodeBarang: barangId,
        movementType: MovementType.PURCHASE,
        qty: 10,
        reference: seedReference,
        note: "S6.3 clean WOP V2 fixture stock seed; non-production test inventory",
        performedBy: CANONICAL_WO_S63_CLEAN_WOP_V2.actor
    });

    const seed = StockLedgerRepository.findByReferensiFresh(seedReference);
    canonicalWoS63CleanWopV2Assert_(
        seed.length === 1 && Number(seed[0][COL_STOK.STOKAWAL]) === 0 &&
        Number(seed[0][COL_STOK.QTYMASUK]) === 10 && Number(seed[0][COL_STOK.STOKAKHIR]) === 10,
        "Seed V2 tidak memiliki chain 0 ke 10."
    );

    canonicalWoS63CleanWopV2Assert_(
        !canonicalWoS63CleanWopV2FindWorkOrder_(),
        "Work Order V2 sudah ada sebelum create."
    );
    const createdWorkOrder = WorkOrderService.create({
        jenisTransaksi: WorkOrderType.SERVICE,
        customerId: CANONICAL_WO_S63_CLEAN_WOP_V2.customerId,
        vehicleId: CANONICAL_WO_S63_CLEAN_WOP_V2.vehicleId,
        kilometerMasuk: 0,
        prioritas: WorkOrderPriority.NORMAL,
        estimasiSelesai: "",
        admin: CANONICAL_WO_S63_CLEAN_WOP_V2.actor,
        catatan: CANONICAL_WO_S63_CLEAN_WOP_V2.workOrderMarker + " | S6.3_TEST non-production fixture"
    });
    const workOrderId = String(createdWorkOrder.workOrderId || "").trim();
    const masterBarang = BarangRepository.findById(barangId);
    const createdPart = WorkOrderPartService.create({
        workOrderId: workOrderId,
        barangId: barangId,
        qty: 1,
        harga: Number(masterBarang[COL_BARANG.HARGAJUAL]),
        diskon: 0,
        catatan: CANONICAL_WO_S63_CLEAN_WOP_V2.workOrderMarker + " | S6.3_TEST"
    });
    const workOrderPartId = String(createdPart.workOrderPartId || "").trim();

    WorkOrderPartService.changeStatus(workOrderPartId, WorkOrderPartStatus.PROGRESS);
    WorkOrderPartService.consumeStock(workOrderPartId);
    WorkOrderPartService.changeStatus(workOrderPartId, WorkOrderPartStatus.DONE);
    canonicalWoS63CleanWopV2AdvanceWorkOrder_(workOrderId);

    const service = StockLedgerRepository.findByReferensiFresh(workOrderPartId)
        .filter(function(row){
            return canonicalWoS63CleanWopV2Text_(row[COL_STOK.JENISMUTASI]) === "SERVICE";
        });
    const reversal = StockLedgerRepository.findByReferensiFresh(workOrderPartId)
        .filter(function(row){
            return canonicalWoS63CleanWopV2Text_(row[COL_STOK.JENISMUTASI]) === "REVERSAL";
        });
    const workOrder = WorkOrderRepository.findById(workOrderId);
    const part = WorkOrderPartRepository.findById(workOrderPartId);
    const settlementMetadata = WorkOrderRepository.getSettlementMetadata(workOrderId);
    const reservation = getCanonicalWorkOrderSettlementReservationCli(workOrderId);
    const sales = PenjualanRepository.findSettlementSalesByWorkOrder(workOrderId);
    const plan = planCanonicalWorkOrderSettlement({
        workOrderId: workOrderId,
        directSaleItems: []
    });

    canonicalWoS63CleanWopV2Assert_(
        service.length === 1 && reversal.length === 0 &&
        Number(service[0][COL_STOK.QTYKELUAR]) === 1 &&
        Number(service[0][COL_STOK.STOKAWAL]) === 10 && Number(service[0][COL_STOK.STOKAKHIR]) === 9,
        "SERVICE OUT V2 tidak valid."
    );
    canonicalWoS63CleanWopV2Assert_(
        canonicalWoS63CleanWopV2Text_(part[COL_WORK_ORDER_PART.STATUS]) === WorkOrderPartStatus.DONE &&
        canonicalWoS63CleanWopV2Text_(workOrder[COL_WORK_ORDER.STATUS]) === WorkOrderStatus.SELESAI,
        "Lifecycle WOP/WO V2 tidak selesai."
    );
    canonicalWoS63CleanWopV2Assert_(
        plan.eligible && sales.length === 0 && !reservation.propertyExists &&
        !canonicalWoS63CleanWopV2Text_(settlementMetadata.settlementIdentity) &&
        !canonicalWoS63CleanWopV2Text_(settlementMetadata.settlementSalesNumber),
        "Fixture V2 tidak clean untuk settlement planner."
    );
    canonicalWoS63CleanWopV2Assert_(Number(BarangRepository.getStock(barangId)) === 9, "Stok BRG000165 harus 9.");
    canonicalWoS63CleanWopV2Assert_(Number(BarangRepository.getStock("BRG000001")) === 66, "Guard BRG000001 berubah.");
    canonicalWoS63CleanWopV2Assert_(Number(BarangRepository.getStock("BRG000097")) === 30, "Guard BRG000097 berubah.");

    return {
        success: true,
        barangId: barangId,
        seedLedgerId: canonicalWoS63CleanWopV2Text_(seed[0][COL_STOK.ID]),
        workOrderId: workOrderId,
        workOrderPartId: workOrderPartId,
        serviceLedgerId: canonicalWoS63CleanWopV2Text_(service[0][COL_STOK.ID]),
        stockBeforeSeed: 0,
        stockAfterSeed: 10,
        stockAfterService: Number(BarangRepository.getStock(barangId)),
        plannerEligible: plan.eligible,
        authoritativeDirectSalePrice: CanonicalWorkOrderSettlementPlanner.priceFromBarang_(masterBarang),
        salesCount: sales.length,
        reservationExists: reservation.propertyExists,
        settlementIdentity: canonicalWoS63CleanWopV2Text_(settlementMetadata.settlementIdentity),
        settlementSalesNumber: canonicalWoS63CleanWopV2Text_(settlementMetadata.settlementSalesNumber)
    };
}

function auditCanonicalWorkOrderSettlementCleanWopV2FixtureCli(){
    const barangId = CANONICAL_WO_S63_CLEAN_WOP_V2.barangId;
    const workOrder = canonicalWoS63CleanWopV2FindWorkOrder_();
    const workOrderId = workOrder ? canonicalWoS63CleanWopV2Text_(workOrder[COL_WORK_ORDER.ID]) : "";
    const parts = workOrderId ? WorkOrderPartRepository.findByWorkOrderId(workOrderId) : [];
    const part = parts.length === 1 ? parts[0] : null;
    const workOrderPartId = part ? canonicalWoS63CleanWopV2Text_(part[COL_WORK_ORDER_PART.ID]) : "";
    const seed = StockLedgerRepository.findByReferensiFresh(
        CANONICAL_WO_S63_CLEAN_WOP_V2.seedReference
    );
    const partLedgers = workOrderPartId ? StockLedgerRepository.findByReferensiFresh(workOrderPartId) : [];
    const service = partLedgers.filter(function(row){
        return canonicalWoS63CleanWopV2Text_(row[COL_STOK.JENISMUTASI]) === "SERVICE";
    });
    const reversal = partLedgers.filter(function(row){
        return canonicalWoS63CleanWopV2Text_(row[COL_STOK.JENISMUTASI]) === "REVERSAL";
    });
    const metadata = workOrderId ? WorkOrderRepository.getSettlementMetadata(workOrderId) : {};
    const reservation = workOrderId ? getCanonicalWorkOrderSettlementReservationCli(workOrderId) : {propertyExists:false};
    const sales = workOrderId ? PenjualanRepository.findSettlementSalesByWorkOrder(workOrderId) : [];
    const plan = workOrderId ? planCanonicalWorkOrderSettlement({workOrderId:workOrderId,directSaleItems:[]}) : {eligible:false,errors:["Work Order belum ada"]};
    const master = BarangRepository.findById(barangId);

    return {
        success: true,
        barangId: barangId,
        stock: Number(BarangRepository.getStock(barangId)),
        seedCount: seed.length,
        seedLedgerId: seed.length ? canonicalWoS63CleanWopV2Text_(seed[0][COL_STOK.ID]) : "",
        seedStokAwal: seed.length ? Number(seed[0][COL_STOK.STOKAWAL]) : null,
        seedQtyMasuk: seed.length ? Number(seed[0][COL_STOK.QTYMASUK]) : null,
        seedStokAkhir: seed.length ? Number(seed[0][COL_STOK.STOKAKHIR]) : null,
        workOrderId: workOrderId,
        workOrderStatus: workOrder ? canonicalWoS63CleanWopV2Text_(workOrder[COL_WORK_ORDER.STATUS]) : "",
        workOrderPartCount: parts.length,
        workOrderPartId: workOrderPartId,
        workOrderPartStatus: part ? canonicalWoS63CleanWopV2Text_(part[COL_WORK_ORDER_PART.STATUS]) : "",
        serviceCount: service.length,
        serviceLedgerId: service.length ? canonicalWoS63CleanWopV2Text_(service[0][COL_STOK.ID]) : "",
        serviceQtyKeluar: service.length ? Number(service[0][COL_STOK.QTYKELUAR]) : null,
        serviceStokAwal: service.length ? Number(service[0][COL_STOK.STOKAWAL]) : null,
        serviceStokAkhir: service.length ? Number(service[0][COL_STOK.STOKAKHIR]) : null,
        reversalCount: reversal.length,
        plannerEligible: !!plan.eligible,
        plannerErrorsJson: JSON.stringify(plan.errors || []),
        authoritativeDirectSalePrice: master ? CanonicalWorkOrderSettlementPlanner.priceFromBarang_(master) : null,
        salesCount: sales.length,
        reservationExists: !!reservation.propertyExists,
        settlementIdentity: canonicalWoS63CleanWopV2Text_(metadata.settlementIdentity),
        settlementSalesNumber: canonicalWoS63CleanWopV2Text_(metadata.settlementSalesNumber),
        guardBRG000001: Number(BarangRepository.getStock("BRG000001")),
        guardBRG000097: Number(BarangRepository.getStock("BRG000097"))
    };
}

function auditCanonicalWorkOrderSettlementLegacyS63FixtureCli(){
    const legacyBarangIds = ["BRG000163", "BRG000164"];
    const ledgerSheet = StockLedgerRepository.sheet();
    const ledgers = ledgerSheet.getLastRow() < 2 ? [] : ledgerSheet
        .getRange(2, 1, ledgerSheet.getLastRow() - 1, 14)
        .getValues();
    const part = WorkOrderPartRepository.findById("WOP2608220003");
    const workOrder = WorkOrderRepository.findById("WO2608220004");

    return {
        success: true,
        classification: "LEGACY_S63_TEST_FIXTURE_ANOMALY",
        barang163Exists: !!BarangRepository.findById(legacyBarangIds[0]),
        barang164Exists: !!BarangRepository.findById(legacyBarangIds[1]),
        workOrderId: workOrder ? canonicalWoS63CleanWopV2Text_(workOrder[COL_WORK_ORDER.ID]) : "",
        workOrderStatus: workOrder ? canonicalWoS63CleanWopV2Text_(workOrder[COL_WORK_ORDER.STATUS]) : "",
        workOrderPartId: part ? canonicalWoS63CleanWopV2Text_(part[COL_WORK_ORDER_PART.ID]) : "",
        workOrderPartBarangId: part ? canonicalWoS63CleanWopV2Text_(part[COL_WORK_ORDER_PART.BARANG_ID]) : "",
        workOrderPartStatus: part ? canonicalWoS63CleanWopV2Text_(part[COL_WORK_ORDER_PART.STATUS]) : "",
        stk0118Count: ledgers.filter(function(row){ return canonicalWoS63CleanWopV2Text_(row[COL_STOK.ID]) === "STK2608220118"; }).length,
        stk0119Count: ledgers.filter(function(row){ return canonicalWoS63CleanWopV2Text_(row[COL_STOK.ID]) === "STK2608220119"; }).length
    };
}
