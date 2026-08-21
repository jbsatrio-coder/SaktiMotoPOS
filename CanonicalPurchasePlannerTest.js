/**
 * Canonical Purchase P3 planner regressions.
 * These tests exercise only the pure planner and read-only repositories.
 */

function assertCanonicalPurchaseP3_(condition, message){

    if(!condition){
        throw new Error("Canonical Purchase P3 gagal: " + message);
    }

}

function createCanonicalPurchaseP3Document_(purchaseNumber, items, overrides){

    const fields = overrides || {};

    return {
        header : {
            nomor : purchaseNumber,
            supplier : fields.supplier === undefined ? " Supplier  P3 " : fields.supplier,
            noFaktur : fields.noFaktur === undefined ? " INV-P3 " : fields.noFaktur,
            admin : fields.admin === undefined ? " Admin  P3 " : fields.admin,
            keterangan : fields.keterangan === undefined ? " P3   planner " : fields.keterangan
        },
        status : fields.status || PurchaseStatus.NEW,
        items : items
    };

}

function getCanonicalPurchaseP3FixtureBarangIds_(count){

    const ids = BarangRepository.findAll().map(function(row){
        return String(row[COL_BARANG.ID] || "").trim();
    }).filter(function(id){
        return id;
    });
    const uniqueIds = ids.filter(function(id, index){
        return ids.indexOf(id) === index;
    });

    if(uniqueIds.length < count){
        throw new Error("Fixture Barang development tidak mencukupi.");
    }

    return uniqueIds.slice(0, count);

}

function snapshotCanonicalPurchaseP3State_(barangIds){

    return {
        headerRows : PurchaseRepository.getHeaderSheet().getLastRow(),
        detailRows : PurchaseRepository.getDetailSheet().getLastRow(),
        ledgerRows : StockLedgerRepository.sheet().getLastRow(),
        stocks : barangIds.reduce(function(result, barangId){
            result[barangId] = BarangRepository.getStock(barangId);
            return result;
        }, {}),
        properties : PropertiesService.getScriptProperties().getProperties()
    };

}

function canonicalPurchaseP3PropertiesFingerprint_(properties){

    return Object.keys(properties).sort().map(function(key){
        return [key, properties[key]];
    });

}

function assertCanonicalPurchaseP3StateUnchanged_(snapshot, barangIds){

    assertCanonicalPurchaseP3_(
        PurchaseRepository.getHeaderSheet().getLastRow() === snapshot.headerRows,
        "Jumlah header Purchase berubah."
    );
    assertCanonicalPurchaseP3_(
        PurchaseRepository.getDetailSheet().getLastRow() === snapshot.detailRows,
        "Jumlah detail Purchase berubah."
    );
    assertCanonicalPurchaseP3_(
        StockLedgerRepository.sheet().getLastRow() === snapshot.ledgerRows,
        "Jumlah Stock Ledger berubah."
    );

    barangIds.forEach(function(barangId){
        assertCanonicalPurchaseP3_(
            BarangRepository.getStock(barangId) === snapshot.stocks[barangId],
            "Stok Barang berubah: " + barangId
        );
    });

    assertCanonicalPurchaseP3_(
        JSON.stringify(canonicalPurchaseP3PropertiesFingerprint_(
            PropertiesService.getScriptProperties().getProperties()
        )) === JSON.stringify(canonicalPurchaseP3PropertiesFingerprint_(
            snapshot.properties
        )),
        "ScriptProperties berubah."
    );

}

function runCanonicalPurchaseP3PlannerRegressionCli(){

    const barangIds = getCanonicalPurchaseP3FixtureBarangIds_(2);
    const snapshot = snapshotCanonicalPurchaseP3State_(barangIds);
    const purchaseNumber = "PO-P3-PLAN-001";
    const document = createCanonicalPurchaseP3Document_(purchaseNumber, [
        { kodeBarang : barangIds[1], qty : "3", hargaBeli : "20000" },
        { barangId : barangIds[0], quantity : 2, unitCost : 10000 }
    ]);
    const plan = planCanonicalPurchaseIn({
        submissionId : "SUB-P3-001",
        purchaseDocument : document
    }, { validateBarang : true });
    const repeated = planCanonicalPurchaseIn({
        submissionId : "SUB-P3-001",
        purchaseDocument : createCanonicalPurchaseP3Document_(purchaseNumber, document.items.slice().reverse(), {
            supplier : "Supplier P3", noFaktur : "INV-P3",
            admin : "Admin P3", keterangan : "P3 planner",
            status : PurchaseStatus.POSTED
        })
    }, { validateBarang : true });

    assertCanonicalPurchaseP3_(
        plan.transactionId === "PURCHASE:" + purchaseNumber + ":IN" &&
        plan.transactionType === "PURCHASE_IN" &&
        plan.sourceDocumentType === "PURCHASE" &&
        plan.sourceDocumentId === purchaseNumber &&
        plan.idempotencyKey === "PURCHASE_SUBMIT:SUB-P3-001",
        "Document identity tidak sesuai contract."
    );
    assertCanonicalPurchaseP3_(
        plan.lines.length === 2 && plan.validLines.length === 2 &&
        plan.invalidLines.length === 0 && plan.canExecuteCanonicalPurchase &&
        plan.lines[0].sourceLineId === purchaseNumber + ":L001" &&
        plan.lines[1].sourceLineId === purchaseNumber + ":L002" &&
        plan.totalLineCount === 2 && plan.totalQuantity === 5,
        "Normal/multi different Barang tidak sesuai."
    );
    assertCanonicalPurchaseP3_(
        plan.payloadFingerprint === repeated.payloadFingerprint &&
        JSON.stringify(plan.lines) === JSON.stringify(repeated.lines),
        "Normalisasi whitespace, numerik, atau urutan tidak deterministik."
    );

    const duplicate = planCanonicalPurchaseIn({
        submissionId : "SUB-P3-DUP",
        purchaseDocument : createCanonicalPurchaseP3Document_(purchaseNumber, [
            { kodeBarang : barangIds[0], qty : 2, hargaBeli : 10000 },
            { kodeBarang : barangIds[0], qty : 3, hargaBeli : 10000 }
        ])
    });
    assertCanonicalPurchaseP3_(
        duplicate.lines.length === 2 && duplicate.perBarangSummary.length === 1 &&
        duplicate.perBarangSummary[0].totalQuantity === 5 &&
        duplicate.lines[0].sourceLineId !== duplicate.lines[1].sourceLineId,
        "Duplicate Barang harus tetap line-preserving dan summary harus teragregasi."
    );

    const identicalDuplicate = planCanonicalPurchaseIn({
        submissionId : "SUB-P3-IDENTICAL",
        purchaseDocument : createCanonicalPurchaseP3Document_(purchaseNumber, [
            { kodeBarang : barangIds[0], qty : 2, hargaBeli : 10000 },
            { kodeBarang : barangIds[0], qty : 2, hargaBeli : 10000 }
        ])
    });
    const identicalRepeated = planCanonicalPurchaseIn({
        submissionId : "SUB-P3-IDENTICAL",
        purchaseDocument : createCanonicalPurchaseP3Document_(purchaseNumber, [
            { kodeBarang : barangIds[0], qty : 2, hargaBeli : 10000 },
            { kodeBarang : barangIds[0], qty : 2, hargaBeli : 10000 }
        ])
    });
    assertCanonicalPurchaseP3_(
        identicalDuplicate.lines.length === 2 &&
        identicalDuplicate.lines[0].sourceLineId !== identicalDuplicate.lines[1].sourceLineId &&
        JSON.stringify(identicalDuplicate) === JSON.stringify(identicalRepeated),
        "Identical duplicate lines harus memiliki ID unik dan plan stabil."
    );

    const invalidQty = planCanonicalPurchaseIn({
        submissionId : "SUB-P3-INVALID-QTY",
        purchaseDocument : createCanonicalPurchaseP3Document_(purchaseNumber, [
            { kodeBarang : barangIds[0], qty : 0, hargaBeli : 10000 }
        ])
    });
    const missingBarang = planCanonicalPurchaseIn({
        submissionId : "SUB-P3-MISSING-BARANG",
        purchaseDocument : createCanonicalPurchaseP3Document_(purchaseNumber, [
            { kodeBarang : "", qty : 1, hargaBeli : 10000 }
        ])
    });
    assertCanonicalPurchaseP3_(
        !invalidQty.canExecuteCanonicalPurchase && invalidQty.invalidLines.length === 1 &&
        !missingBarang.canExecuteCanonicalPurchase && missingBarang.invalidLines.length === 1,
        "Qty invalid atau Barang kosong harus dilaporkan tanpa mutasi."
    );

    const sameSubmission = compareCanonicalPurchaseSubmission(plan, repeated);
    const changedPayload = planCanonicalPurchaseIn({
        submissionId : "SUB-P3-001",
        purchaseDocument : createCanonicalPurchaseP3Document_(purchaseNumber, [
            { kodeBarang : barangIds[0], qty : 99, hargaBeli : 10000 }
        ])
    });
    const differentSubmission = planCanonicalPurchaseIn({
        submissionId : "SUB-P3-002",
        purchaseDocument : document
    });
    assertCanonicalPurchaseP3_(
        sameSubmission === "SAME_SUBMISSION" &&
        compareCanonicalPurchaseSubmission(plan, changedPayload) === "CONFLICT" &&
        compareCanonicalPurchaseSubmission(plan, differentSubmission) === "DIFFERENT_SUBMISSION",
        "Submission comparison tidak sesuai contract."
    );

    assertCanonicalPurchaseP3StateUnchanged_(snapshot, barangIds);

    return {
        success : true,
        test : "CANONICAL_PURCHASE_P3_PLANNER",
        message : "PASS"
    };

}
