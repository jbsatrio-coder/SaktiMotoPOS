/**
 * Canonical Sales planner.
 *
 * S2 is planning only. This module never persists a Sales document, changes
 * stock, writes Stock Ledger, allocates a running number, or writes
 * ScriptProperties. Optional authority validation is read-only.
 */

const CanonicalSalesPlanner = {

    planCanonicalSale : function(request, options){

        if(!request){
            throw new Error("Canonical Sales request wajib diisi.");
        }

        const normalized = canonicalSalesNormalizeRequest_(request);

        if(!normalized.submissionId || !normalized.salesNumber){
            throw new Error("submissionId dan salesNumber wajib diisi untuk Canonical Sales plan.");
        }

        const lines = [];
        const invalidLines = [];
        const structuralValidLines = [];

        normalized.items.forEach(function(item, index){
            const sourceLineId = normalized.salesNumber + ":L" +
                String(index + 1).padStart(3, "0");
            const line = canonicalSalesBuildLine_(item, sourceLineId);
            const errors = canonicalSalesGetLineErrors_(line, normalized);

            lines.push(line);

            if(errors.length > 0){
                invalidLines.push({
                    sourceLineId : sourceLineId,
                    itemId : line.itemId,
                    reason : errors.join(" ")
                });
                return;
            }

            structuralValidLines.push(line);
        });

        if(normalized.items.length === 0){
            invalidLines.push({
                sourceLineId : "",
                itemId : "",
                reason : "Sales items wajib diisi."
            });
        }

        const authority = canonicalSalesValidateAuthorities_(
            structuralValidLines,
            options
        );
        const validLines = authority.validLines;
        const allInvalidLines = invalidLines.concat(authority.invalidLines);
        const commercial = canonicalSalesCalculateCommercial_(
            validLines,
            normalized.transactionDiscountIntent,
            normalized.paymentMethod,
            normalized.amountPaid
        );

        return {
            salesNumber : normalized.salesNumber,
            submissionId : normalized.submissionId,
            transactionId : "SALE:" + normalized.salesNumber + ":OUT",
            transactionType : "SALE_OUT",
            sourceDocumentType : "SALES",
            sourceDocumentId : normalized.salesNumber,
            idempotencyKey : "SALE_SUBMIT:" + normalized.submissionId,
            payloadFingerprint : JSON.stringify(canonicalSalesFingerprintPayload_(normalized)),
            normalizedHeaderIntent : {
                customerId : normalized.customerId,
                vehicleId : normalized.vehicleId,
                workOrderId : normalized.workOrderId,
                mechanicId : normalized.mechanicId,
                paymentMethod : normalized.paymentMethod,
                amountPaid : normalized.amountPaid,
                transactionDiscountIntent : normalized.transactionDiscountIntent
            },
            lines : lines,
            validLines : validLines,
            invalidLines : allInvalidLines,
            validationErrors : commercial.validationErrors,
            authorityValidation : authority.performed,
            inventoryLines : validLines.filter(function(line){
                return line.requiresInventoryMovement;
            }),
            nonInventoryLines : validLines.filter(function(line){
                return !line.requiresInventoryMovement;
            }),
            perBarangSummary : canonicalSalesBuildPerBarangSummary_(validLines),
            calculatedSubtotal : commercial.subtotal,
            calculatedDiscount : commercial.discount,
            calculatedTotal : commercial.total,
            paymentIntent : commercial.paymentIntent,
            canExecuteCanonicalSale : allInvalidLines.length === 0 &&
                commercial.validationErrors.length === 0
        };

    },

    compareCanonicalSalesSubmission : function(existingPlan, incomingPlan){

        if(!existingPlan || !incomingPlan){
            throw new Error("Existing dan incoming Canonical Sales plan wajib diisi.");
        }

        if(existingPlan.idempotencyKey !== incomingPlan.idempotencyKey){
            return "DIFFERENT_SUBMISSION";
        }

        return existingPlan.payloadFingerprint === incomingPlan.payloadFingerprint ?
            "SAME_SUBMISSION" : "CONFLICT";

    }

};

function canonicalSalesText_(value){
    return String(value === undefined || value === null ? "" : value)
        .trim()
        .replace(/\s+/g, " ");
}

function canonicalSalesNumber_(value){
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function canonicalSalesNormalizeRequest_(request){

    const header = request.header || request.transaksi || {};
    const pelanggan = request.pelanggan || request.customer || {};
    const kendaraan = request.kendaraan || request.vehicle || {};
    const rawItems = Array.isArray(request.items) ? request.items : [];

    const items = rawItems.map(function(raw){
        const item = raw || {};
        const itemType = canonicalSalesText_(item.itemType || item.jenis).toUpperCase();
        const fulfillmentSource = canonicalSalesText_(item.fulfillmentSource || "DIRECT_SALE").toUpperCase();

        return {
            itemType : itemType,
            barangId : canonicalSalesText_(item.barangId || (itemType === "BARANG" ? item.kode : "")),
            jasaId : canonicalSalesText_(item.jasaId || (itemType === "JASA" ? item.kode : "")),
            quantity : canonicalSalesNumber_(item.quantity === undefined ? item.qty : item.quantity),
            unitPriceIntent : canonicalSalesNumber_(item.unitPrice === undefined ? item.harga : item.unitPrice),
            lineDiscountIntent : canonicalSalesNumber_(item.lineDiscount === undefined ? (item.diskon || 0) : item.lineDiscount),
            mechanicId : canonicalSalesText_(item.mechanicId || item.mekanik),
            fulfillmentSource : fulfillmentSource,
            workOrderPartId : canonicalSalesText_(item.workOrderPartId),
            workOrderId : canonicalSalesText_(item.workOrderId)
        };
    });

    items.sort(canonicalSalesCompareNormalizedItems_);

    return {
        salesNumber : canonicalSalesText_(request.salesNumber || request.noTransaksi),
        submissionId : canonicalSalesText_(request.submissionId),
        customerId : canonicalSalesText_(request.customerId || pelanggan.id),
        vehicleId : canonicalSalesText_(request.vehicleId || kendaraan.id),
        workOrderId : canonicalSalesText_(request.workOrderId || header.workOrder),
        mechanicId : canonicalSalesText_(request.mechanicId || header.mekanikUtama),
        paymentMethod : canonicalSalesText_(request.paymentMethod || header.metodeBayar).toUpperCase(),
        amountPaid : canonicalSalesNumber_(request.amountPaid === undefined ? header.bayar : request.amountPaid),
        transactionDiscountIntent : canonicalSalesNumber_(request.transactionDiscount === undefined ? (header.diskonNota || 0) : request.transactionDiscount),
        items : items
    };
}

function canonicalSalesCompareNormalizedItems_(left, right){
    const leftKey = JSON.stringify([
        left.itemType, left.barangId, left.jasaId, left.quantity,
        left.unitPriceIntent, left.lineDiscountIntent, left.mechanicId,
        left.fulfillmentSource, left.workOrderId, left.workOrderPartId
    ]);
    const rightKey = JSON.stringify([
        right.itemType, right.barangId, right.jasaId, right.quantity,
        right.unitPriceIntent, right.lineDiscountIntent, right.mechanicId,
        right.fulfillmentSource, right.workOrderId, right.workOrderPartId
    ]);
    return leftKey < rightKey ? -1 : (leftKey > rightKey ? 1 : 0);
}

function canonicalSalesBuildLine_(item, sourceLineId){
    const isBarang = item.itemType === "BARANG";
    const isWopFulfilled = isBarang && item.fulfillmentSource === "WORK_ORDER_FULFILLED";
    const grossAmount = item.quantity === null || item.unitPriceIntent === null ?
        null : item.quantity * item.unitPriceIntent;
    const lineTotal = grossAmount === null || item.lineDiscountIntent === null ?
        null : grossAmount - item.lineDiscountIntent;

    return {
        sourceLineId : sourceLineId,
        itemType : item.itemType,
        itemId : isBarang ? item.barangId : item.jasaId,
        barangId : item.barangId,
        jasaId : item.jasaId,
        quantity : item.quantity,
        unitPriceIntent : item.unitPriceIntent,
        lineDiscountIntent : item.lineDiscountIntent,
        grossAmount : grossAmount,
        calculatedLineTotal : lineTotal,
        mechanicIntent : item.mechanicId,
        fulfillmentSource : item.fulfillmentSource,
        workOrderId : item.workOrderId,
        workOrderPartId : item.workOrderPartId,
        requiresInventoryMovement : isBarang && !isWopFulfilled,
        direction : isBarang && !isWopFulfilled ? "OUT" : null
    };
}

function canonicalSalesGetLineErrors_(line, normalized){
    const errors = [];
    if(line.itemType !== "BARANG" && line.itemType !== "JASA"){
        errors.push("Item type harus BARANG atau JASA.");
    }
    if(!line.itemId){
        errors.push("Item ID wajib diisi.");
    }
    if(line.quantity === null || line.quantity <= 0){
        errors.push("Qty Sales harus lebih dari 0.");
    }
    if(line.unitPriceIntent === null || line.unitPriceIntent < 0){
        errors.push("Harga intent harus berupa angka nol atau positif.");
    }
    if(line.lineDiscountIntent === null || line.lineDiscountIntent < 0){
        errors.push("Diskon line harus berupa angka nol atau positif.");
    }
    if(line.grossAmount !== null && line.lineDiscountIntent > line.grossAmount){
        errors.push("Diskon line tidak boleh melebihi nilai line.");
    }
    if(line.itemType === "BARANG" &&
        line.fulfillmentSource !== "DIRECT_SALE" &&
        line.fulfillmentSource !== "WORK_ORDER_FULFILLED"){
        errors.push("Fulfillment source Barang tidak dikenali.");
    }
    if(line.itemType === "BARANG" &&
        line.fulfillmentSource === "WORK_ORDER_FULFILLED"){
        if(!normalized.workOrderId || !line.workOrderPartId){
            errors.push("Barang WORK_ORDER_FULFILLED wajib memiliki workOrderId dan workOrderPartId.");
        }
    }
    return errors;
}

function canonicalSalesValidateAuthorities_(lines, options){
    if(!options || options.validateAuthorities !== true){
        return { performed : false, validLines : lines.slice(), invalidLines : [] };
    }

    const resolver = typeof options.resolveItem === "function" ?
        options.resolveItem : canonicalSalesReadOnlyResolveItem_;
    const validLines = [];
    const invalidLines = [];

    lines.forEach(function(line){
        const authoritative = resolver(line);
        if(!authoritative || authoritative.exists === false){
            invalidLines.push({ sourceLineId : line.sourceLineId, itemId : line.itemId, reason : "Item tidak ditemukan." });
            return;
        }
        if(authoritative.active === false){
            invalidLines.push({ sourceLineId : line.sourceLineId, itemId : line.itemId, reason : "Item tidak aktif." });
            return;
        }
        validLines.push(line);
    });

    return { performed : true, validLines : validLines, invalidLines : invalidLines };
}

function canonicalSalesReadOnlyResolveItem_(line){
    if(line.itemType === "BARANG"){
        const barang = BarangRepository.findById(line.barangId);
        if(!barang){ return { exists : false }; }
        return {
            exists : true,
            active : canonicalSalesText_(barang[COL_BARANG.STATUS]).toUpperCase() !== "NONAKTIF",
            name : barang[COL_BARANG.NAMA],
            unitPrice : Number(barang[COL_BARANG.HARGAJUAL]),
            stock : Number(barang[COL_BARANG.STOK])
        };
    }
    const jasa = JasaRepository.findById(line.jasaId);
    if(!jasa){ return { exists : false }; }
    return {
        exists : true,
        active : canonicalSalesText_(jasa[COL_JASA.STATUS]).toUpperCase() !== "NONAKTIF",
        name : jasa[COL_JASA.NAMA],
        unitPrice : Number(jasa[COL_JASA.HARGA])
    };
}

function canonicalSalesBuildPerBarangSummary_(lines){
    const summary = {};
    lines.filter(function(line){ return line.requiresInventoryMovement; }).forEach(function(line){
        if(!summary[line.barangId]){
            summary[line.barangId] = { barangId : line.barangId, totalQuantity : 0, sourceLineIds : [] };
        }
        summary[line.barangId].totalQuantity += line.quantity;
        summary[line.barangId].sourceLineIds.push(line.sourceLineId);
    });
    return Object.keys(summary).sort().map(function(barangId){ return summary[barangId]; });
}

function canonicalSalesCalculateCommercial_(lines, transactionDiscount, paymentMethod, amountPaid){
    const subtotal = lines.reduce(function(total, line){ return total + line.calculatedLineTotal; }, 0);
    const validationErrors = [];
    if(transactionDiscount === null || transactionDiscount < 0){
        validationErrors.push("Diskon transaksi harus berupa angka nol atau positif.");
    }
    if(transactionDiscount !== null && transactionDiscount > subtotal){
        validationErrors.push("Diskon transaksi tidak boleh melebihi subtotal.");
    }
    const safeDiscount = transactionDiscount === null ? 0 : transactionDiscount;
    const total = subtotal - safeDiscount;
    if(!paymentMethod){ validationErrors.push("Payment method wajib diisi."); }
    if(amountPaid === null || amountPaid < 0){ validationErrors.push("Amount paid harus berupa angka nol atau positif."); }
    if(paymentMethod === "TUNAI" && amountPaid !== null && amountPaid < total){
        validationErrors.push("Pembayaran TUNAI tidak mencukupi.");
    }
    return {
        subtotal : subtotal,
        discount : safeDiscount,
        total : total,
        validationErrors : validationErrors,
        paymentIntent : {
            paymentMethod : paymentMethod,
            amountPaid : amountPaid,
            change : paymentMethod === "TUNAI" && amountPaid !== null ? Math.max(0, amountPaid - total) : null,
            validationStatus : paymentMethod === "TUNAI" ? "VALIDATED_INTENT" : "DEFERRED_NON_CASH"
        }
    };
}

function canonicalSalesFingerprintPayload_(normalized){
    return {
        customerId : normalized.customerId,
        vehicleId : normalized.vehicleId,
        workOrderId : normalized.workOrderId,
        mechanicId : normalized.mechanicId,
        paymentMethod : normalized.paymentMethod,
        amountPaid : normalized.amountPaid,
        transactionDiscountIntent : normalized.transactionDiscountIntent,
        items : normalized.items
    };
}
