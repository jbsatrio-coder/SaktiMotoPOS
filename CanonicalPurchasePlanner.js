/**
 * Canonical Purchase planner
 *
 * Pure planning only. This module does not create Purchase documents,
 * mutate stock, write Stock Ledger, generate running numbers, or persist
 * submission identity. Authoritative Barang validation is optional and
 * read-only.
 */

function normalizeCanonicalPurchaseText_(value){

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");

}

function normalizeCanonicalPurchaseNumber_(value){

    const number = Number(value);

    return Number.isFinite(number) ? number : null;

}

function compareCanonicalPurchaseItems_(left, right){

    const leftKey = JSON.stringify([
        left.barangId,
        left.quantity,
        left.unitCost
    ]);
    const rightKey = JSON.stringify([
        right.barangId,
        right.quantity,
        right.unitCost
    ]);

    if(leftKey < rightKey){
        return -1;
    }

    if(leftKey > rightKey){
        return 1;
    }

    return 0;

}

function normalizeCanonicalPurchasePayload_(purchaseDocument){

    if(!purchaseDocument){
        throw new Error("Purchase document wajib diisi.");
    }

    const header = purchaseDocument.header || {};
    const rawItems = Array.isArray(purchaseDocument.items) ?
        purchaseDocument.items : [];

    const items = rawItems.map(function(item){
        const source = item || {};

        return {
            barangId : normalizeCanonicalPurchaseText_(
                source.barangId || source.kodeBarang
            ),
            quantity : normalizeCanonicalPurchaseNumber_(
                source.quantity === undefined ? source.qty : source.quantity
            ),
            unitCost : normalizeCanonicalPurchaseNumber_(
                source.unitCost === undefined ? source.hargaBeli : source.unitCost
            )
        };
    });

    items.sort(compareCanonicalPurchaseItems_);

    return {
        supplier : normalizeCanonicalPurchaseText_(header.supplier),
        noFaktur : normalizeCanonicalPurchaseText_(header.noFaktur),
        admin : normalizeCanonicalPurchaseText_(header.admin),
        keterangan : normalizeCanonicalPurchaseText_(header.keterangan),
        items : items
    };

}

function getCanonicalPurchaseStructuralErrors_(item){

    const errors = [];

    if(!item.barangId){
        errors.push("Barang ID wajib diisi.");
    }

    if(item.quantity === null || item.quantity <= 0){
        errors.push("Qty Purchase harus lebih dari 0.");
    }

    if(item.unitCost === null){
        errors.push("Harga beli Purchase harus berupa angka.");
    }

    return errors;

}

function buildCanonicalPurchasePerBarangSummary_(lines){

    const summaries = {};

    lines.forEach(function(line){
        if(!summaries[line.barangId]){
            summaries[line.barangId] = {
                barangId : line.barangId,
                totalQuantity : 0,
                sourceLineIds : []
            };
        }

        summaries[line.barangId].totalQuantity += line.quantity;
        summaries[line.barangId].sourceLineIds.push(line.sourceLineId);
    });

    return Object.keys(summaries).sort().map(function(barangId){
        return summaries[barangId];
    });

}

function validateCanonicalPurchaseBarang_(lines, options){

    if(!options || options.validateBarang !== true){
        return {
            performed : false,
            validLines : lines.slice(),
            invalidLines : []
        };
    }

    const exists = typeof options.barangExists === "function" ?
        options.barangExists : BarangRepository.exists.bind(BarangRepository);
    const validLines = [];
    const invalidLines = [];

    lines.forEach(function(line){
        if(exists(line.barangId)){
            validLines.push(line);
            return;
        }

        invalidLines.push({
            sourceLineId : line.sourceLineId,
            barangId : line.barangId,
            reason : "Barang tidak ditemukan."
        });
    });

    return {
        performed : true,
        validLines : validLines,
        invalidLines : invalidLines
    };

}

/**
 * Builds a deterministic, zero-mutation Purchase IN plan.
 *
 * options.validateBarang is intentionally opt-in. When true, the default
 * BarangRepository.exists() is read-only; tests may inject barangExists.
 */
function planCanonicalPurchaseIn(input, options){

    if(!input){
        throw new Error("Canonical Purchase planner input wajib diisi.");
    }

    const purchaseDocument = input.purchaseDocument;
    const header = purchaseDocument && purchaseDocument.header || {};
    const purchaseNumber = normalizeCanonicalPurchaseText_(header.nomor);
    const submissionId = normalizeCanonicalPurchaseText_(input.submissionId);

    if(!purchaseNumber || !submissionId){
        throw new Error("purchaseNumber dan submissionId wajib diisi.");
    }

    const normalizedPayload =
        normalizeCanonicalPurchasePayload_(purchaseDocument);
    const invalidLines = [];
    const lines = [];
    const structuralLines = [];

    normalizedPayload.items.forEach(function(item, index){
        const sourceLineId = purchaseNumber + ":L" +
            String(index + 1).padStart(3, "0");
        const errors = getCanonicalPurchaseStructuralErrors_(item);
        const line = {
            sourceLineId : sourceLineId,
            barangId : item.barangId,
            quantity : item.quantity,
            direction : "IN",
            unitCost : item.unitCost
        };

        lines.push(line);

        if(errors.length > 0){
            invalidLines.push({
                sourceLineId : sourceLineId,
                barangId : item.barangId,
                reason : errors.join(" ")
            });
            return;
        }

        structuralLines.push(line);
    });

    if(normalizedPayload.items.length === 0){
        invalidLines.push({
            sourceLineId : "",
            barangId : "",
            reason : "Purchase items wajib diisi."
        });
    }

    const authoritativeValidation = validateCanonicalPurchaseBarang_(
        structuralLines,
        options
    );
    const allInvalidLines = invalidLines.concat(
        authoritativeValidation.invalidLines
    );
    const validLines = authoritativeValidation.validLines;

    return {
        purchaseNumber : purchaseNumber,
        submissionId : submissionId,
        transactionId : "PURCHASE:" + purchaseNumber + ":IN",
        transactionType : "PURCHASE_IN",
        sourceDocumentType : "PURCHASE",
        sourceDocumentId : purchaseNumber,
        idempotencyKey : "PURCHASE_SUBMIT:" + submissionId,
        payloadFingerprint : JSON.stringify(normalizedPayload),
        lines : lines,
        validLines : validLines,
        invalidLines : allInvalidLines,
        conflictLines : [],
        perBarangSummary : buildCanonicalPurchasePerBarangSummary_(validLines),
        totalLineCount : lines.length,
        totalQuantity : validLines.reduce(function(total, line){
            return total + line.quantity;
        }, 0),
        canExecuteCanonicalPurchase : allInvalidLines.length === 0
    };

}

function compareCanonicalPurchaseSubmission(existingPlan, incomingPlan){

    if(!existingPlan || !incomingPlan){
        throw new Error("Existing dan incoming Canonical Purchase plan wajib diisi.");
    }

    if(existingPlan.idempotencyKey !== incomingPlan.idempotencyKey){
        return "DIFFERENT_SUBMISSION";
    }

    return existingPlan.payloadFingerprint === incomingPlan.payloadFingerprint ?
        "SAME_SUBMISSION" : "CONFLICT";

}
