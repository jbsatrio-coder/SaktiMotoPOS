/**
 * S6.3 dedicated development fixtures.
 *
 * This file is test infrastructure only. It intentionally creates data only
 * through the existing domain services and records no fixture IDs in runtime
 * production configuration.
 */
const CANONICAL_WO_S63_FIXTURE = {
    customerMarker: "S63_TEST_CUSTOMER",
    vehicleMarker: "S63_TEST_VEHICLE",
    barangMarker: "S63_TEST_BARANG_WOP",
    seedReference: "S63_TEST_SEED:S63_TEST_BARANG_WOP",
    actor: "S6.3_TEST",
    woJasaMarker: "S63_TEST_WO_JASA",
    woWopMarker: "S63_TEST_WO_WOP",
    woRecoveryMarker: "S63_TEST_WO_RECOVERY"
};

function canonicalWoS63FixtureText_(value){
    return String(value === undefined || value === null ? "" : value).trim();
}

function canonicalWoS63FixtureContains_(value, marker){
    return canonicalWoS63FixtureText_(value).indexOf(marker) >= 0;
}

function canonicalWoS63FixtureUnique_(rows, label){
    if(rows.length > 1){
        throw new Error("Fixture " + label + " duplikat: " + rows.length);
    }
    return rows.length ? rows[0] : null;
}

function canonicalWoS63FixtureFindCustomer_(){
    return canonicalWoS63FixtureUnique_(CustomerRepository.findAll().filter(function(row){
        return canonicalWoS63FixtureContains_(row[COL_PELANGGAN.NAMA], CANONICAL_WO_S63_FIXTURE.customerMarker) ||
            canonicalWoS63FixtureContains_(row[COL_PELANGGAN.CATATAN], CANONICAL_WO_S63_FIXTURE.customerMarker);
    }), "Customer");
}

function canonicalWoS63FixtureFindVehicle_(){
    return canonicalWoS63FixtureUnique_(VehicleRepository.findAll().filter(function(row){
        return canonicalWoS63FixtureContains_(row[COL_VEHICLE.NOTE], CANONICAL_WO_S63_FIXTURE.vehicleMarker) ||
            canonicalWoS63FixtureContains_(row[COL_VEHICLE.PLATE], "S63TEST");
    }), "Vehicle");
}

function canonicalWoS63FixtureFindBarang_(){
    return canonicalWoS63FixtureUnique_(BarangRepository.findAll().filter(function(row){
        return canonicalWoS63FixtureContains_(row[COL_BARANG.NAMA], CANONICAL_WO_S63_FIXTURE.barangMarker) ||
            canonicalWoS63FixtureContains_(row[COL_BARANG.CATATAN], CANONICAL_WO_S63_FIXTURE.barangMarker);
    }), "Barang");
}

function canonicalWoS63FixtureFindWorkOrder_(marker){
    return canonicalWoS63FixtureUnique_(WorkOrderRepository.findAll().filter(function(row){
        return canonicalWoS63FixtureContains_(row[COL_WORK_ORDER.CATATAN], marker);
    }), marker);
}

function canonicalWoS63FixtureSelectMerkModel_(){
    const models = ModelRepository.findAll().filter(function(model){
        return canonicalWoS63FixtureText_(model.status).toUpperCase() === "AKTIF" && MerkRepository.exists(model.merkId);
    });
    if(!models.length){
        throw new Error("Tidak ada pasangan Merk/Model AKTIF yang valid.");
    }
    const model = models[0];
    const merk = MerkRepository.findById(model.merkId);
    if(!merk){
        throw new Error("Merk fixture tidak ditemukan: " + model.merkId);
    }
    return {merkId:merk.id, merkName:merk.nama, modelId:model.id, modelName:model.nama, status:model.status};
}

function canonicalWoS63FixtureSelectJasa_(){
    const rows = JasaRepository.findAll().filter(function(row){
        return canonicalWoS63FixtureText_(row[COL_JASA.ID]) && canonicalWoS63FixtureText_(row[COL_JASA.STATUS]).toUpperCase() === "AKTIF";
    });
    if(!rows.length){
        throw new Error("Tidak ada Master Jasa AKTIF untuk fixture S6.3.");
    }
    const row = rows[0];
    return {jasaId:canonicalWoS63FixtureText_(row[COL_JASA.ID]), nama:canonicalWoS63FixtureText_(row[COL_JASA.NAMA]), harga:Number(row[COL_JASA.HARGA]), status:canonicalWoS63FixtureText_(row[COL_JASA.STATUS])};
}

function canonicalWoS63FixtureCreateCustomer_(){
    const existing = canonicalWoS63FixtureFindCustomer_();
    if(existing){
        return {row:existing, created:false};
    }
    const result = CustomerService.createCustomer({
        nama:CANONICAL_WO_S63_FIXTURE.customerMarker,
        noHP:"089963000001",
        alamat:"S6.3_TEST non-production fixture",
        tanggalLahir:"",
        jenisKelamin:CustomerGender.PRIA,
        status:CustomerStatus.AKTIF,
        catatan:"S6.3_TEST non-production fixture"
    });
    const row = CustomerRepository.findById(result.customerId);
    if(!row){throw new Error("Customer fixture gagal dibuat.");}
    return {row:row, created:true};
}

function canonicalWoS63FixtureCreateVehicle_(customerId, merkModel){
    const existing = canonicalWoS63FixtureFindVehicle_();
    if(existing){
        if(canonicalWoS63FixtureText_(existing[COL_VEHICLE.CUSTOMER_ID]) !== customerId){
            throw new Error("Vehicle fixture tidak dimiliki Customer fixture.");
        }
        return {row:existing, created:false};
    }
    const result = VehicleService.createVehicle({
        customerId:customerId,
        noPolisi:"S63TEST",
        merkId:merkModel.merkId,
        modelId:merkModel.modelId,
        tahun:"2026",
        warna:"TEST",
        noMesin:"S63TESTENGINE001",
        noRangka:"S63TESTFRAME0001",
        lastKilometer:0,
        status:VehicleStatus.AKTIF,
        catatan:"S63_TEST_VEHICLE | S6.3_TEST non-production fixture"
    });
    const row = VehicleRepository.findById(result.vehicleId);
    if(!row){throw new Error("Vehicle fixture gagal dibuat.");}
    return {row:row, created:true};
}

function canonicalWoS63FixtureCreateBarang_(){
    const existing = canonicalWoS63FixtureFindBarang_();
    if(existing){return {row:existing, created:false};}
    BarangService.createBarang({
        nama:CANONICAL_WO_S63_FIXTURE.barangMarker,
        namaPendek:"S63 WOP",
        kataKunci:"s63 test barang wop",
        kategori:"TEST",
        subkategori:"S6.3",
        merk:"S6.3_TEST",
        kendaraan:"TEST",
        satuan:"PCS",
        hargaModal:10000,
        hargaJual:20000,
        pricingMode:"HARGA_JUAL",
        stok:0,
        minStok:0,
        rak:"S6.3_TEST",
        supplier:"",
        status:"AKTIF",
        catatan:"S63_TEST_BARANG_WOP | S6.3_TEST non-production fixture",
        createdBy:CANONICAL_WO_S63_FIXTURE.actor
    });
    const row = canonicalWoS63FixtureFindBarang_();
    if(!row){throw new Error("Barang fixture gagal dibuat.");}
    return {row:row, created:true};
}

function canonicalWoS63FixtureSeedBarang_(barangId){
    const rows = StockLedgerRepository.findByReferensiFresh(CANONICAL_WO_S63_FIXTURE.seedReference);
    if(rows.length > 1){throw new Error("Seed ledger fixture duplikat.");}
    if(!rows.length){
        if(Number(BarangRepository.getStock(barangId)) !== 0){
            throw new Error("Barang fixture belum seeded tetapi stok bukan 0.");
        }
        InventoryService.moveStock({
            kodeBarang:barangId,
            movementType:MovementType.PURCHASE,
            qty:10,
            reference:CANONICAL_WO_S63_FIXTURE.seedReference,
            performedBy:CANONICAL_WO_S63_FIXTURE.actor,
            note:"S6.3 dedicated fixture stock seed; non-production test inventory"
        });
    }
    const after = StockLedgerRepository.findByReferensiFresh(CANONICAL_WO_S63_FIXTURE.seedReference);
    if(after.length !== 1 || canonicalWoS63FixtureText_(after[0][COL_STOK.BARANG_ID]) !== barangId || Number(after[0][COL_STOK.QTYMASUK]) !== 10 || Number(after[0][COL_STOK.QTYKELUAR]) !== 0){
        throw new Error("Bukti seed ledger fixture tidak valid.");
    }
    if(Number(BarangRepository.getStock(barangId)) !== 10){
        throw new Error("Stok fixture sesudah seed harus 10.");
    }
    return after[0];
}

function canonicalWoS63FixtureAdvanceWorkOrderToComplete_(workOrderId){
    const sequence = [WorkOrderStatus.MENUNGGU_DIAGNOSA, WorkOrderStatus.MENUNGGU_APPROVAL, WorkOrderStatus.DALAM_PENGERJAAN, WorkOrderStatus.QC, WorkOrderStatus.SELESAI];
    sequence.forEach(function(next){
        const row = WorkOrderRepository.findById(workOrderId);
        const current = row ? canonicalWoS63FixtureText_(row[COL_WORK_ORDER.STATUS]) : "";
        if(current === next){return;}
        if(current === WorkOrderStatus.SELESAI){return;}
        WorkOrderService.changeStatus(workOrderId, next);
    });
    const finalRow = WorkOrderRepository.findById(workOrderId);
    if(!finalRow || canonicalWoS63FixtureText_(finalRow[COL_WORK_ORDER.STATUS]) !== WorkOrderStatus.SELESAI){
        throw new Error("Work Order fixture tidak mencapai SELESAI: " + workOrderId);
    }
}

function canonicalWoS63FixtureNewWorkOrder_(customerId, vehicleId, marker){
    const existing = canonicalWoS63FixtureFindWorkOrder_(marker);
    if(existing){return {row:existing, created:false};}
    const result = WorkOrderService.create({
        jenisTransaksi:WorkOrderType.SERVICE,
        customerId:customerId,
        vehicleId:vehicleId,
        kilometerMasuk:0,
        prioritas:WorkOrderPriority.NORMAL,
        estimasiSelesai:"",
        admin:CANONICAL_WO_S63_FIXTURE.actor,
        catatan:marker + " | S6.3_TEST non-production fixture"
    });
    const row = WorkOrderRepository.findById(result.workOrderId);
    if(!row){throw new Error("Work Order fixture gagal dibuat: " + marker);}
    return {row:row, created:true};
}

function canonicalWoS63FixtureEnsureJasaWorkOrder_(customerId, vehicleId, jasa, marker){
    const result = canonicalWoS63FixtureNewWorkOrder_(customerId, vehicleId, marker);
    const workOrderId = canonicalWoS63FixtureText_(result.row[COL_WORK_ORDER.ID]);
    const lines = WorkOrderJasaRepository.findByWorkOrderId(workOrderId);
    if(lines.length > 1){throw new Error("Fixture " + marker + " memiliki lebih dari satu Jasa.");}
    let line = lines[0];
    if(!line){
        const create = WorkOrderJasaService.create({workOrderId:workOrderId,jasaId:jasa.jasaId,qty:1,diskon:0,mekanikId:"",keluhan:"S6.3_TEST",diagnosa:"S6.3_TEST",catatan:marker + " | S6.3_TEST"});
        line = WorkOrderJasaRepository.findById(create.workOrderJasaId);
    }
    if(canonicalWoS63FixtureText_(line[COL_WO_JASA.JASA_ID]) !== jasa.jasaId){throw new Error("Jasa fixture tidak sesuai marker " + marker);}
    const lineId = canonicalWoS63FixtureText_(line[COL_WO_JASA.ID]);
    let status = canonicalWoS63FixtureText_(line[COL_WO_JASA.STATUS]);
    if(status === WorkOrderJasaStatus.OPEN){WorkOrderJasaService.changeStatus(lineId, WorkOrderJasaStatus.PROGRESS);status=WorkOrderJasaStatus.PROGRESS;}
    if(status === WorkOrderJasaStatus.PROGRESS){WorkOrderJasaService.changeStatus(lineId, WorkOrderJasaStatus.DONE);status=WorkOrderJasaStatus.DONE;}
    if(status !== WorkOrderJasaStatus.DONE){throw new Error("Jasa fixture tidak dapat mencapai DONE: " + marker);}
    canonicalWoS63FixtureAdvanceWorkOrderToComplete_(workOrderId);
    return {workOrderId:workOrderId,workOrderJasaId:lineId,created:result.created,storedPrice:Number(WorkOrderJasaRepository.findById(lineId)[COL_WO_JASA.HARGA])};
}

function canonicalWoS63FixtureEnsureWopWorkOrder_(customerId, vehicleId, barangId){
    const marker = CANONICAL_WO_S63_FIXTURE.woWopMarker;
    const result = canonicalWoS63FixtureNewWorkOrder_(customerId, vehicleId, marker);
    const workOrderId = canonicalWoS63FixtureText_(result.row[COL_WORK_ORDER.ID]);
    const lines = WorkOrderPartRepository.findByWorkOrderId(workOrderId);
    if(lines.length > 1){throw new Error("Fixture WOP memiliki lebih dari satu WOP.");}
    let line = lines[0];
    if(!line){
        const create = WorkOrderPartService.create({workOrderId:workOrderId,barangId:barangId,qty:1,harga:20000,diskon:0,catatan:marker + " | S6.3_TEST"});
        line = WorkOrderPartRepository.findById(create.workOrderPartId);
    }
    const partId = canonicalWoS63FixtureText_(line[COL_WORK_ORDER_PART.ID]);
    if(canonicalWoS63FixtureText_(line[COL_WORK_ORDER_PART.BARANG_ID]) !== barangId || Number(line[COL_WORK_ORDER_PART.QTY]) !== 1){throw new Error("WOP fixture Barang/qty tidak sesuai.");}
    let status = canonicalWoS63FixtureText_(line[COL_WORK_ORDER_PART.STATUS]);
    if(status === WorkOrderPartStatus.OPEN){WorkOrderPartService.changeStatus(partId, WorkOrderPartStatus.PROGRESS);status=WorkOrderPartStatus.PROGRESS;}
    if(status === WorkOrderPartStatus.PROGRESS){
        const before = Number(BarangRepository.getStock(barangId));
        if(before !== 10){throw new Error("Stok dedicated Barang sebelum SERVICE OUT harus 10, aktual: " + before);}
        WorkOrderPartService.consumeStock(partId);
        status = canonicalWoS63FixtureText_(WorkOrderPartRepository.findById(partId)[COL_WORK_ORDER_PART.STATUS]);
    }
    if(status === WorkOrderPartStatus.PROGRESS){WorkOrderPartService.changeStatus(partId, WorkOrderPartStatus.DONE);status=WorkOrderPartStatus.DONE;}
    if(status !== WorkOrderPartStatus.DONE){throw new Error("WOP fixture tidak mencapai DONE.");}
    const ledger = StockLedgerRepository.findByReferensiFresh(partId).filter(function(row){return canonicalWoS63FixtureText_(row[COL_STOK.JENISMUTASI]) === "SERVICE";});
    if(ledger.length !== 1 || Number(ledger[0][COL_STOK.QTYKELUAR]) !== 1 || canonicalWoS63FixtureText_(ledger[0][COL_STOK.BARANG_ID]) !== barangId){throw new Error("SERVICE OUT WOP fixture tidak valid.");}
    if(Number(BarangRepository.getStock(barangId)) !== 9){throw new Error("Stok dedicated Barang sesudah SERVICE OUT harus 9.");}
    canonicalWoS63FixtureAdvanceWorkOrderToComplete_(workOrderId);
    return {workOrderId:workOrderId,workOrderPartId:partId,created:result.created,ledger:ledger[0]};
}

function canonicalWoS63FixtureAssertPreparationBaseline_(workOrderId){
    const plan = planCanonicalWorkOrderSettlement({workOrderId:workOrderId,directSaleItems:[]});
    const metadata = WorkOrderRepository.getSettlementMetadata(workOrderId);
    const reservation = getCanonicalWorkOrderSettlementReservationCli(workOrderId);
    const sales = PenjualanRepository.findSettlementSalesByWorkOrder(workOrderId);
    if(!plan.eligible || sales.length || reservation.propertyExists || canonicalWoS63FixtureText_(metadata.settlementIdentity) || canonicalWoS63FixtureText_(metadata.settlementSalesNumber)){
        throw new Error("Baseline preparation fixture tidak bersih/eligible: " + workOrderId + " | " + plan.errors.join(" | "));
    }
    return {eligible:plan.eligible, salesCount:sales.length, reservationExists:reservation.propertyExists, settlementIdentity:canonicalWoS63FixtureText_(metadata.settlementIdentity), settlementSalesNumber:canonicalWoS63FixtureText_(metadata.settlementSalesNumber)};
}

function runCanonicalWorkOrderSettlementS63CreateFixturesCli(){
    const merkModel = canonicalWoS63FixtureSelectMerkModel_();
    const customer = canonicalWoS63FixtureCreateCustomer_();
    const customerId = canonicalWoS63FixtureText_(customer.row[COL_PELANGGAN.ID]);
    const vehicle = canonicalWoS63FixtureCreateVehicle_(customerId, merkModel);
    const vehicleId = canonicalWoS63FixtureText_(vehicle.row[COL_VEHICLE.ID]);
    const barang = canonicalWoS63FixtureCreateBarang_();
    const barangId = canonicalWoS63FixtureText_(barang.row[COL_BARANG.ID]);
    const seed = canonicalWoS63FixtureSeedBarang_(barangId);
    const jasa = canonicalWoS63FixtureSelectJasa_();
    const woJasa = canonicalWoS63FixtureEnsureJasaWorkOrder_(customerId, vehicleId, jasa, CANONICAL_WO_S63_FIXTURE.woJasaMarker);
    const woWop = canonicalWoS63FixtureEnsureWopWorkOrder_(customerId, vehicleId, barangId);
    const woRecovery = canonicalWoS63FixtureEnsureJasaWorkOrder_(customerId, vehicleId, jasa, CANONICAL_WO_S63_FIXTURE.woRecoveryMarker);
    const baselines = {
        woJasa:canonicalWoS63FixtureAssertPreparationBaseline_(woJasa.workOrderId),
        woWop:canonicalWoS63FixtureAssertPreparationBaseline_(woWop.workOrderId),
        woRecovery:canonicalWoS63FixtureAssertPreparationBaseline_(woRecovery.workOrderId)
    };
    const dedicatedStock = Number(BarangRepository.getStock(barangId));
    const guard001 = Number(BarangRepository.getStock("BRG000001"));
    const guard097 = Number(BarangRepository.getStock("BRG000097"));
    if(dedicatedStock !== 9 || guard001 !== 66 || guard097 !== 30){throw new Error("Guard fixture akhir tidak sesuai. dedicated=" + dedicatedStock + ", BRG000001=" + guard001 + ", BRG000097=" + guard097);}
    return {
        success:true,
        merkId:merkModel.merkId,merkName:merkModel.merkName,modelId:merkModel.modelId,modelName:merkModel.modelName,modelStatus:merkModel.status,
        customerId:customerId,customerCreated:customer.created,vehicleId:vehicleId,vehicleCreated:vehicle.created,
        barangId:barangId,barangCreated:barang.created,seedLedgerId:canonicalWoS63FixtureText_(seed[COL_STOK.ID]),seedStokAwal:Number(seed[COL_STOK.STOKAWAL]),seedStokAkhir:Number(seed[COL_STOK.STOKAKHIR]),
        jasaId:jasa.jasaId,jasaName:jasa.nama,jasaMasterPrice:jasa.harga,
        woJasaId:woJasa.workOrderId,workOrderJasaId:woJasa.workOrderJasaId,woJasaSnapshotPrice:woJasa.storedPrice,
        woWopId:woWop.workOrderId,workOrderPartId:woWop.workOrderPartId,serviceLedgerId:canonicalWoS63FixtureText_(woWop.ledger[COL_STOK.ID]),serviceStokAwal:Number(woWop.ledger[COL_STOK.STOKAWAL]),serviceStokAkhir:Number(woWop.ledger[COL_STOK.STOKAKHIR]),
        woRecoveryId:woRecovery.workOrderId,workOrderJasaRecoveryId:woRecovery.workOrderJasaId,
        plannerEligibleJasa:baselines.woJasa.eligible,plannerEligibleWop:baselines.woWop.eligible,plannerEligibleRecovery:baselines.woRecovery.eligible,
        dedicatedBarangStock:dedicatedStock,guardBRG000001:guard001,guardBRG000097:guard097,message:"S6.3 approved development fixtures READY"
    };
}

function auditCanonicalWorkOrderSettlementS63FixturesCli(){
    const merkModel = canonicalWoS63FixtureSelectMerkModel_();
    const jasaMaster = canonicalWoS63FixtureSelectJasa_();
    const customer = canonicalWoS63FixtureFindCustomer_();
    const vehicle = canonicalWoS63FixtureFindVehicle_();
    const barang = canonicalWoS63FixtureFindBarang_();
    const woJasa = canonicalWoS63FixtureFindWorkOrder_(CANONICAL_WO_S63_FIXTURE.woJasaMarker);
    const woWop = canonicalWoS63FixtureFindWorkOrder_(CANONICAL_WO_S63_FIXTURE.woWopMarker);
    const woRecovery = canonicalWoS63FixtureFindWorkOrder_(CANONICAL_WO_S63_FIXTURE.woRecoveryMarker);
    const barangId = barang ? canonicalWoS63FixtureText_(barang[COL_BARANG.ID]) : "";
    const seed = StockLedgerRepository.findByReferensiFresh(CANONICAL_WO_S63_FIXTURE.seedReference);
    const wop = woWop ? WorkOrderPartRepository.findByWorkOrderId(canonicalWoS63FixtureText_(woWop[COL_WORK_ORDER.ID])) : [];
    const service = wop.length === 1 ? StockLedgerRepository.findByReferensiFresh(canonicalWoS63FixtureText_(wop[0][COL_WORK_ORDER_PART.ID])).filter(function(row){return canonicalWoS63FixtureText_(row[COL_STOK.JENISMUTASI]) === "SERVICE";}) : [];
    const ids = {woJasa:woJasa ? canonicalWoS63FixtureText_(woJasa[COL_WORK_ORDER.ID]) : "",woWop:woWop ? canonicalWoS63FixtureText_(woWop[COL_WORK_ORDER.ID]) : "",woRecovery:woRecovery ? canonicalWoS63FixtureText_(woRecovery[COL_WORK_ORDER.ID]) : ""};
    const baseline = function(workOrderId){
        const wo = workOrderId ? WorkOrderRepository.findById(workOrderId) : null;
        const jasa = workOrderId ? WorkOrderJasaRepository.findByWorkOrderId(workOrderId) : [];
        const plan = workOrderId ? planCanonicalWorkOrderSettlement({workOrderId:workOrderId,directSaleItems:[]}) : {eligible:false,errors:["fixture kosong"]};
        const metadata = workOrderId ? WorkOrderRepository.getSettlementMetadata(workOrderId) : null;
        const reservation = workOrderId ? getCanonicalWorkOrderSettlementReservationCli(workOrderId) : {propertyExists:false};
        const sales = workOrderId ? PenjualanRepository.findSettlementSalesByWorkOrder(workOrderId) : [];
        return {status:wo ? canonicalWoS63FixtureText_(wo[COL_WORK_ORDER.STATUS]) : "",jasaId:jasa.length === 1 ? canonicalWoS63FixtureText_(jasa[0][COL_WO_JASA.ID]) : "",jasaStatus:jasa.length === 1 ? canonicalWoS63FixtureText_(jasa[0][COL_WO_JASA.STATUS]) : "",jasaHarga:jasa.length === 1 ? Number(jasa[0][COL_WO_JASA.HARGA]) : null,plannerEligible:!!plan.eligible,plannerErrorsJson:JSON.stringify(plan.errors || []),salesCount:sales.length,reservationExists:!!reservation.propertyExists,settlementIdentity:metadata ? canonicalWoS63FixtureText_(metadata.settlementIdentity) : "",settlementSalesNumber:metadata ? canonicalWoS63FixtureText_(metadata.settlementSalesNumber) : ""};
    };
    const jasaBaseline = baseline(ids.woJasa), wopBaseline = baseline(ids.woWop), recoveryBaseline = baseline(ids.woRecovery);
    const cleanupReference = wop.length === 1 ? "S63_TEST_CLEANUP:" + canonicalWoS63FixtureText_(wop[0][COL_WORK_ORDER_PART.ID]) + ":DONE_WOP" : "";
    const cleanup = cleanupReference ? StockLedgerRepository.findByReferensiFresh(cleanupReference) : [];
    return {merkId:merkModel.merkId,merkName:merkModel.merkName,modelId:merkModel.modelId,modelName:merkModel.modelName,modelStatus:merkModel.status,jasaId:jasaMaster.jasaId,jasaName:jasaMaster.nama,jasaMasterPrice:jasaMaster.harga,jasaMasterStatus:jasaMaster.status,customerId:customer ? canonicalWoS63FixtureText_(customer[COL_PELANGGAN.ID]) : "",vehicleId:vehicle ? canonicalWoS63FixtureText_(vehicle[COL_VEHICLE.ID]) : "",barangId:barangId,dedicatedStock:barangId ? Number(BarangRepository.getStock(barangId)) : null,seedCount:seed.length,seedLedgerId:seed.length ? canonicalWoS63FixtureText_(seed[0][COL_STOK.ID]) : "",seedStokAwal:seed.length ? Number(seed[0][COL_STOK.STOKAWAL]) : null,seedStokAkhir:seed.length ? Number(seed[0][COL_STOK.STOKAKHIR]) : null,woJasaId:ids.woJasa,workOrderJasaId:jasaBaseline.jasaId,woJasaStatus:jasaBaseline.status,woJasaLineStatus:jasaBaseline.jasaStatus,woJasaSnapshotPrice:jasaBaseline.jasaHarga,woJasaPlannerEligible:jasaBaseline.plannerEligible,woJasaSalesCount:jasaBaseline.salesCount,woJasaReservationExists:jasaBaseline.reservationExists,woJasaSettlementIdentity:jasaBaseline.settlementIdentity,woWopId:ids.woWop,woWopStatus:wopBaseline.status,woWopPlannerEligible:wopBaseline.plannerEligible,woWopSalesCount:wopBaseline.salesCount,woWopReservationExists:wopBaseline.reservationExists,woWopSettlementIdentity:wopBaseline.settlementIdentity,woRecoveryId:ids.woRecovery,workOrderJasaRecoveryId:recoveryBaseline.jasaId,woRecoveryStatus:recoveryBaseline.status,woRecoveryLineStatus:recoveryBaseline.jasaStatus,woRecoveryPlannerEligible:recoveryBaseline.plannerEligible,woRecoverySalesCount:recoveryBaseline.salesCount,woRecoveryReservationExists:recoveryBaseline.reservationExists,woRecoverySettlementIdentity:recoveryBaseline.settlementIdentity,workOrderPartId:wop.length === 1 ? canonicalWoS63FixtureText_(wop[0][COL_WORK_ORDER_PART.ID]) : "",wopStatus:wop.length === 1 ? canonicalWoS63FixtureText_(wop[0][COL_WORK_ORDER_PART.STATUS]) : "",serviceCount:service.length,serviceLedgerId:service.length ? canonicalWoS63FixtureText_(service[0][COL_STOK.ID]) : "",serviceStokAwal:service.length ? Number(service[0][COL_STOK.STOKAWAL]) : null,serviceStokAkhir:service.length ? Number(service[0][COL_STOK.STOKAKHIR]) : null,cleanupReference:cleanupReference,cleanupCount:cleanup.length,guardBRG000001:Number(BarangRepository.getStock("BRG000001")),guardBRG000097:Number(BarangRepository.getStock("BRG000097"))};
}

function getCanonicalWorkOrderSettlementS63FixtureMasterCli(){
    const merkModel = canonicalWoS63FixtureSelectMerkModel_();
    const jasa = canonicalWoS63FixtureSelectJasa_();
    return {merkId:merkModel.merkId,merkName:merkModel.merkName,modelId:merkModel.modelId,modelName:merkModel.modelName,modelStatus:merkModel.status,jasaId:jasa.jasaId,jasaName:jasa.nama,jasaMasterPrice:jasa.harga,jasaStatus:jasa.status};
}
