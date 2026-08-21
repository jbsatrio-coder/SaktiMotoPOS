/**
 * Purchase Canonical Inventory P2
 * Characterization and identity-contract tests only.
 * Does not migrate PurchaseService or alter spreadsheet schema.
 */
const CANONICAL_PURCHASE_P2_TEST_ACTOR = "P2_TEST_ACTOR";

function normalizeCanonicalPurchaseP2Text_(value){

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");

}

function normalizeCanonicalPurchaseP2Payload_(payload){

    if(!payload){
        throw new Error("Purchase payload wajib diisi.");
    }

    const normalizedItems = (payload.items || []).map(function(item){
        const barangId = normalizeCanonicalPurchaseP2Text_(
            item.barangId || item.kodeBarang
        );
        const quantity = Number(item.quantity === undefined ? item.qty : item.quantity);
        const unitCost = Number(item.unitCost === undefined ? item.hargaBeli : item.unitCost);

        if(!barangId || !Number.isFinite(quantity) || quantity <= 0 ||
            !Number.isFinite(unitCost)){
            throw new Error("Canonical Purchase item tidak valid.");
        }

        return {
            barangId : barangId,
            quantity : quantity,
            unitCost : unitCost
        };
    });

    if(normalizedItems.length === 0){
        throw new Error("Canonical Purchase items wajib diisi.");
    }

    // Current Purchase has no persisted line ID and no order-dependent behavior.
    // Sorting defines stable, retry-safe line numbering without merging duplicates.
    normalizedItems.sort(function(left, right){
        return JSON.stringify(left).localeCompare(JSON.stringify(right));
    });

    return {
        supplier : normalizeCanonicalPurchaseP2Text_(payload.supplier),
        noFaktur : normalizeCanonicalPurchaseP2Text_(payload.noFaktur),
        admin : normalizeCanonicalPurchaseP2Text_(payload.admin),
        keterangan : normalizeCanonicalPurchaseP2Text_(payload.keterangan),
        items : normalizedItems
    };

}

function buildCanonicalPurchaseP2Identity_(purchaseNumber, submissionId, payload){

    return planCanonicalPurchaseIn({
        submissionId : submissionId,
        purchaseDocument : {
            header : {
                nomor : purchaseNumber,
                supplier : payload && payload.supplier,
                noFaktur : payload && payload.noFaktur,
                admin : payload && payload.admin,
                keterangan : payload && payload.keterangan
            },
            items : payload && payload.items
        }
    });

}

function assertCanonicalPurchaseP2_(condition, message){

    if(!condition){
        throw new Error(message);
    }

}

function getCanonicalPurchaseP2FixtureBarangIds_(count){

    const ids = BarangRepository.findAll()
        .map(function(row){ return String(row[COL_BARANG.ID] || "").trim(); })
        .filter(function(id){ return id; });

    const uniqueIds = ids.filter(function(id, index){
        return ids.indexOf(id) === index;
    });

    if(uniqueIds.length < count){
        throw new Error("Fixture Barang development tidak mencukupi.");
    }

    return uniqueIds.slice(0, count);

}

function getCanonicalPurchaseP2Header_(purchaseNumber){

    const sheet = PurchaseRepository.getHeaderSheet();
    const rows = sheet.getDataRange().getValues();

    return rows.slice(1).find(function(row){
        return String(row[0]).trim() === String(purchaseNumber).trim();
    }) || null;

}

function getCanonicalPurchaseP2Details_(purchaseNumber){

    const sheet = PurchaseRepository.getDetailSheet();

    return sheet.getDataRange().getValues().slice(1).filter(function(row){
        return String(row[0]).trim() === String(purchaseNumber).trim();
    });

}

function getCanonicalPurchaseP2Ledger_(purchaseNumber){

    return StockLedgerRepository.findByReference(purchaseNumber).filter(function(row){
        return String(row[COL_STOK.JENISMUTASI]).trim() === MovementType.PURCHASE;
    });

}

function createCanonicalPurchaseP2Payload_(items, noFaktur){

    return {
        supplier : "P2_TEST_SUPPLIER",
        noFaktur : noFaktur,
        admin : CANONICAL_PURCHASE_P2_TEST_ACTOR,
        keterangan : "Canonical Purchase P2 characterization",
        items : items
    };

}

function cleanupCanonicalPurchaseP2Stock_(purchaseNumber, items){

    items.forEach(function(item){
        InventoryService.moveStock({
            kodeBarang : item.kodeBarang,
            movementType : MovementType.SALE,
            qty : Number(item.qty),
            reference : "P2_TEST_CLEANUP:" + purchaseNumber,
            note : "Canonical Purchase P2 stock baseline cleanup",
            performedBy : CANONICAL_PURCHASE_P2_TEST_ACTOR
        });
    });

}

function assertCanonicalPurchaseP2Stock_(barangId, expected, label){

    assertCanonicalPurchaseP2_(
        InventoryService.getCurrentStock(barangId) === expected,
        label + ": stock tidak sesuai."
    );

}

function characterizeCanonicalPurchaseP2NormalOne_(){

    const barangId = getCanonicalPurchaseP2FixtureBarangIds_(1)[0];
    const baseline = InventoryService.getCurrentStock(barangId);
    const items = [{ kodeBarang : barangId, qty : 2, hargaBeli : 12345 }];
    const result = PurchaseService.receivePurchase(
        createCanonicalPurchaseP2Payload_(items, "P2-ONE-" + new Date().getTime())
    );

    assertCanonicalPurchaseP2_(result.status === PurchaseStatus.POSTED, "Normal one tidak POSTED.");
    assertCanonicalPurchaseP2_(!!getCanonicalPurchaseP2Header_(result.purchaseNumber), "Header tidak ada.");
    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Details_(result.purchaseNumber).length === 1, "Detail tidak ada.");
    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Ledger_(result.purchaseNumber).length === 1, "Ledger PURCHASE tidak ada.");
    assertCanonicalPurchaseP2Stock_(barangId, baseline + 2, "Normal one after purchase");

    cleanupCanonicalPurchaseP2Stock_(result.purchaseNumber, items);
    assertCanonicalPurchaseP2Stock_(barangId, baseline, "Normal one cleanup");

    return result.purchaseNumber;

}

function characterizeCanonicalPurchaseP2DifferentBarang_(){

    const barangIds = getCanonicalPurchaseP2FixtureBarangIds_(2);
    const baseline = barangIds.map(InventoryService.getCurrentStock.bind(InventoryService));
    const items = [
        { kodeBarang : barangIds[0], qty : 2, hargaBeli : 11111 },
        { kodeBarang : barangIds[1], qty : 3, hargaBeli : 22222 }
    ];
    const result = PurchaseService.receivePurchase(
        createCanonicalPurchaseP2Payload_(items, "P2-MULTI-" + new Date().getTime())
    );

    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Details_(result.purchaseNumber).length === 2, "Detail multi tidak lengkap.");
    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Ledger_(result.purchaseNumber).length === 2, "Ledger multi tidak lengkap.");
    assertCanonicalPurchaseP2Stock_(barangIds[0], baseline[0] + 2, "Multi barang 1");
    assertCanonicalPurchaseP2Stock_(barangIds[1], baseline[1] + 3, "Multi barang 2");

    cleanupCanonicalPurchaseP2Stock_(result.purchaseNumber, items);
    assertCanonicalPurchaseP2Stock_(barangIds[0], baseline[0], "Multi cleanup 1");
    assertCanonicalPurchaseP2Stock_(barangIds[1], baseline[1], "Multi cleanup 2");

    return result.purchaseNumber;

}

function characterizeCanonicalPurchaseP2DuplicateBarang_(){

    const barangId = getCanonicalPurchaseP2FixtureBarangIds_(1)[0];
    const baseline = InventoryService.getCurrentStock(barangId);
    const items = [
        { kodeBarang : barangId, qty : 2, hargaBeli : 10000 },
        { kodeBarang : barangId, qty : 3, hargaBeli : 10000 }
    ];
    const result = PurchaseService.receivePurchase(
        createCanonicalPurchaseP2Payload_(items, "P2-DUP-BARANG-" + new Date().getTime())
    );

    assertCanonicalPurchaseP2Stock_(barangId, baseline + 5, "Duplicate barang current behavior");
    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Details_(result.purchaseNumber).length === 2, "Duplicate detail tidak line-preserving.");
    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Ledger_(result.purchaseNumber).length === 2, "Duplicate ledger tidak per movement.");

    cleanupCanonicalPurchaseP2Stock_(result.purchaseNumber, items);
    assertCanonicalPurchaseP2Stock_(barangId, baseline, "Duplicate barang cleanup");

    return result.purchaseNumber;

}

function characterizeCanonicalPurchaseP2Retry_(sameInvoice){

    const barangId = getCanonicalPurchaseP2FixtureBarangIds_(1)[0];
    const baseline = InventoryService.getCurrentStock(barangId);
    const items = [{ kodeBarang : barangId, qty : 1, hargaBeli : 10000 }];
    const invoice = sameInvoice ? "P2-SAME-INVOICE" : "P2-RETRY-" + new Date().getTime();
    const first = PurchaseService.receivePurchase(createCanonicalPurchaseP2Payload_(items, invoice));
    const second = PurchaseService.receivePurchase(createCanonicalPurchaseP2Payload_(items, invoice));

    assertCanonicalPurchaseP2_(first.purchaseNumber !== second.purchaseNumber, "Retry tidak membuat nomor baru.");
    assertCanonicalPurchaseP2Stock_(barangId, baseline + 2, "Retry current duplicate behavior");
    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Ledger_(first.purchaseNumber).length === 1, "Ledger retry pertama tidak ada.");
    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Ledger_(second.purchaseNumber).length === 1, "Ledger retry kedua tidak ada.");

    cleanupCanonicalPurchaseP2Stock_(first.purchaseNumber, items);
    cleanupCanonicalPurchaseP2Stock_(second.purchaseNumber, items);
    assertCanonicalPurchaseP2Stock_(barangId, baseline, "Retry cleanup");

    return [first.purchaseNumber, second.purchaseNumber];

}

function characterizeCanonicalPurchaseP2InvalidAfterValid_(){

    const barangId = getCanonicalPurchaseP2FixtureBarangIds_(1)[0];
    const baseline = InventoryService.getCurrentStock(barangId);
    const items = [
        { kodeBarang : barangId, qty : 2, hargaBeli : 10000 },
        { kodeBarang : "P2_INVALID_BARANG", qty : 1, hargaBeli : 10000 }
    ];
    let purchaseNumber = "";

    try{
        PurchaseService.receivePurchase(
            createCanonicalPurchaseP2Payload_(items, "P2-INVALID-" + new Date().getTime())
        );
        throw new Error("Invalid after valid seharusnya gagal.");
    }
    catch(error){
        const headers = PurchaseRepository.getHeaderSheet().getDataRange().getValues().slice(1);
        const header = headers[headers.length - 1];
        purchaseNumber = String(header[0]).trim();
        assertCanonicalPurchaseP2_(header[6] === PurchaseStatus.FAILED, "Header invalid tidak FAILED.");
    }

    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Details_(purchaseNumber).length === 2, "Detail invalid tidak tersimpan penuh.");
    assertCanonicalPurchaseP2Stock_(barangId, baseline + 2, "Item valid tidak committed.");
    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Ledger_(purchaseNumber).length === 1, "Ledger partial tidak sesuai.");

    cleanupCanonicalPurchaseP2Stock_(purchaseNumber, [items[0]]);
    assertCanonicalPurchaseP2Stock_(barangId, baseline, "Invalid cleanup");

    return purchaseNumber;

}

function characterizeCanonicalPurchaseP2LedgerFailure_(){

    const barangId = getCanonicalPurchaseP2FixtureBarangIds_(1)[0];
    const baseline = InventoryService.getCurrentStock(barangId);
    const items = [{ kodeBarang : barangId, qty : 2, hargaBeli : 10000 }];
    const originalAddHistory = StockLedgerRepository.addHistory;
    let purchaseNumber = "";

    try{
        StockLedgerRepository.addHistory = function(){
            throw new Error("P2 forced ledger failure");
        };

        PurchaseService.receivePurchase(
            createCanonicalPurchaseP2Payload_(items, "P2-LEDGER-" + new Date().getTime())
        );
        throw new Error("Ledger failure seharusnya gagal.");
    }
    catch(error){
        const headers = PurchaseRepository.getHeaderSheet().getDataRange().getValues().slice(1);
        purchaseNumber = String(headers[headers.length - 1][0]).trim();
    }
    finally{
        StockLedgerRepository.addHistory = originalAddHistory;
    }

    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Header_(purchaseNumber)[6] === PurchaseStatus.FAILED, "Ledger failure tidak FAILED.");
    assertCanonicalPurchaseP2Stock_(barangId, baseline, "Ledger failure rollback per item");
    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Ledger_(purchaseNumber).length === 0, "Ledger failure tetap menulis PURCHASE ledger.");

    return purchaseNumber;

}

function characterizeCanonicalPurchaseP2PostedFailure_(){

    const barangId = getCanonicalPurchaseP2FixtureBarangIds_(1)[0];
    const baseline = InventoryService.getCurrentStock(barangId);
    const items = [{ kodeBarang : barangId, qty : 2, hargaBeli : 10000 }];
    const originalUpdateStatus = PurchaseRepository.updateStatus;
    let purchaseNumber = "";

    try{
        PurchaseRepository.updateStatus = function(number, status){
            if(status === PurchaseStatus.POSTED){
                throw new Error("P2 forced POSTED failure");
            }
            return originalUpdateStatus.call(PurchaseRepository, number, status);
        };

        PurchaseService.receivePurchase(
            createCanonicalPurchaseP2Payload_(items, "P2-POSTED-" + new Date().getTime())
        );
        throw new Error("POSTED failure seharusnya gagal.");
    }
    catch(error){
        const headers = PurchaseRepository.getHeaderSheet().getDataRange().getValues().slice(1);
        purchaseNumber = String(headers[headers.length - 1][0]).trim();
    }
    finally{
        PurchaseRepository.updateStatus = originalUpdateStatus;
    }

    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Header_(purchaseNumber)[6] === PurchaseStatus.FAILED, "POSTED failure tidak menjadi FAILED.");
    assertCanonicalPurchaseP2Stock_(barangId, baseline + 2, "POSTED failure stock tidak committed.");
    assertCanonicalPurchaseP2_(getCanonicalPurchaseP2Ledger_(purchaseNumber).length === 1, "POSTED failure ledger tidak committed.");

    cleanupCanonicalPurchaseP2Stock_(purchaseNumber, items);
    assertCanonicalPurchaseP2Stock_(barangId, baseline, "POSTED failure cleanup");

    return purchaseNumber;

}

function runCanonicalPurchaseP2IdentityRegressionCli(){

    const payload = {
        supplier : " Supplier  A ",
        noFaktur : " INV-1 ",
        admin : " Admin ",
        keterangan : " test   note ",
        items : [
            { kodeBarang : "BRG-B", qty : 3, hargaBeli : 20000 },
            { kodeBarang : "BRG-A", qty : 2, hargaBeli : 10000 },
            { kodeBarang : "BRG-A", qty : 3, hargaBeli : 10000 }
        ]
    };
    const same = buildCanonicalPurchaseP2Identity_("PO2608210001", "SUB-1", payload);
    const reordered = buildCanonicalPurchaseP2Identity_("PO2608210001", "SUB-1", {
        supplier : "Supplier A", noFaktur : "INV-1", admin : "Admin",
        keterangan : "test note", items : payload.items.slice().reverse()
    });
    const conflict = buildCanonicalPurchaseP2Identity_("PO2608210001", "SUB-1", {
        supplier : "Supplier A", noFaktur : "INV-1", admin : "Admin",
        keterangan : "test note", items : [{ kodeBarang : "BRG-A", qty : 99, hargaBeli : 10000 }]
    });

    assertCanonicalPurchaseP2_(same.idempotencyKey === reordered.idempotencyKey, "Same submission key berubah.");
    assertCanonicalPurchaseP2_(same.payloadFingerprint === reordered.payloadFingerprint, "Reorder payload bukan identik.");
    assertCanonicalPurchaseP2_(same.payloadFingerprint !== conflict.payloadFingerprint, "Payload conflict tidak terdeteksi.");
    assertCanonicalPurchaseP2_(same.lines[0].sourceLineId === "PO2608210001:L001", "Line ID tidak deterministik.");
    assertCanonicalPurchaseP2_(same.lines.length === 3, "Duplicate barang ter-merge.");

    return { success : true, test : "CANONICAL_PURCHASE_P2_IDENTITY", message : "PASS" };

}

function runCanonicalPurchaseP2StatusRunner_(testName, testFunction){

    const propertyKey = "CANONICAL_PURCHASE:P2:" + testName;
    const propertyStore = PropertiesService.getScriptProperties();

    propertyStore.setProperty(propertyKey, JSON.stringify({
        status : "RUNNING",
        startedAt : new Date().toISOString()
    }));

    try{
        const result = testFunction();

        propertyStore.setProperty(propertyKey, JSON.stringify({
            status : "PASS",
            finishedAt : new Date().toISOString()
        }));

        return result;
    }
    catch(error){
        propertyStore.setProperty(propertyKey, JSON.stringify({
            status : "FAIL",
            finishedAt : new Date().toISOString(),
            error : String(error.message || error)
        }));
        throw error;
    }

}

function getCanonicalPurchaseP2StatusCli(testName){

    const value = PropertiesService.getScriptProperties().getProperty(
        "CANONICAL_PURCHASE:P2:" + testName
    );

    return value ? JSON.parse(value) : { status : "NOT_RUN" };

}

function runCanonicalPurchaseP2Characterization_(){

    return {
        success : true,
        test : "CANONICAL_PURCHASE_P2_CHARACTERIZATION",
        purchaseNumbers : {
            normalOne : characterizeCanonicalPurchaseP2NormalOne_(),
            differentBarang : characterizeCanonicalPurchaseP2DifferentBarang_(),
            duplicateBarang : characterizeCanonicalPurchaseP2DuplicateBarang_(),
            retry : characterizeCanonicalPurchaseP2Retry_(false),
            sameInvoice : characterizeCanonicalPurchaseP2Retry_(true),
            invalidAfterValid : characterizeCanonicalPurchaseP2InvalidAfterValid_(),
            ledgerFailure : characterizeCanonicalPurchaseP2LedgerFailure_(),
            postedFailure : characterizeCanonicalPurchaseP2PostedFailure_()
        }
    };

}

function runCanonicalPurchaseP2CharacterizationCli(){

    return runCanonicalPurchaseP2StatusRunner_(
        "CHARACTERIZATION",
        runCanonicalPurchaseP2Characterization_
    );

}
