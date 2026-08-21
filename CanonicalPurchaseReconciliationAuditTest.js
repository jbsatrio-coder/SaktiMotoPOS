/**
 * Read-only reconciliation for P5A/P5B canonical Purchase fixtures.
 * This file deliberately performs no stock, ledger, Purchase, or property mutation.
 */
function canonicalPurchaseP5B9IsFixture_(submissionId) {
    return /^(P5A|P5B)/.test(String(submissionId || "").trim());
}

function canonicalPurchaseP5B9Number_(value) {
    return Number(value || 0);
}

function canonicalPurchaseP5B9DateValue_(value) {
    return value instanceof Date ? value.getTime() : String(value || "");
}

function canonicalPurchaseP5B9CleanupReference_(submissionId, purchaseNumber) {
    return "P5B_FINAL_CLEANUP:" + submissionId + ":" + purchaseNumber;
}

function auditCanonicalPurchaseP5B9LedgerReconciliationCli() {
    const barangId = "BRG000001";
    const headerSheet = PurchaseRepository.getHeaderSheet();
    const detailSheet = PurchaseRepository.getDetailSheet();
    const ledgerSheet = StockLedgerRepository.sheet();
    const headerColumns = PurchaseRepository.getColumnMap_(headerSheet);
    const detailColumns = PurchaseRepository.getColumnMap_(detailSheet);
    const headers = headerSheet.getLastRow() < 2 ? [] : headerSheet
        .getRange(2, 1, headerSheet.getLastRow() - 1, headerSheet.getLastColumn())
        .getValues()
        .map(function(row) { return PurchaseRepository.getHeaderRecord_(row, headerColumns); })
        .filter(function(record) { return canonicalPurchaseP5B9IsFixture_(record.submissionId); });
    const details = detailSheet.getLastRow() < 2 ? [] : detailSheet
        .getRange(2, 1, detailSheet.getLastRow() - 1, detailSheet.getLastColumn())
        .getValues();
    const detailsByPurchase = details.reduce(function(map, row) {
        const purchaseNumber = String(row[detailColumns["ID Pembelian"]] || "").trim();
        if (!map[purchaseNumber]) map[purchaseNumber] = [];
        map[purchaseNumber].push({
            barangId: String(row[detailColumns.KodeBarang] || "").trim(),
            lineId: String(row[detailColumns.LineId] || "").trim(),
            qty: canonicalPurchaseP5B9Number_(row[detailColumns.Qty])
        });
        return map;
    }, {});
    const ledgerRows = ledgerSheet.getLastRow() < 2 ? [] : ledgerSheet
        .getRange(2, 1, ledgerSheet.getLastRow() - 1, 14)
        .getValues();
    const fixtureRecords = headers.map(function(header) {
        const purchaseNumber = String(header.purchaseNumber || "").trim();
        const purchaseDetails = detailsByPurchase[purchaseNumber] || [];
        const lineIds = purchaseDetails.map(function(detail) { return detail.lineId; }).filter(Boolean);
        const purchaseLedgers = ledgerRows.filter(function(row) {
            return String(row[COL_STOK.BARANG_ID] || "").trim() === barangId &&
                String(row[COL_STOK.JENISMUTASI] || "").trim() === MovementType.PURCHASE &&
                lineIds.indexOf(String(row[COL_STOK.REFERENSI] || "").trim()) >= 0;
        });
        const cleanupPrefixes = [
            "P5B_TEST_CLEANUP:",
            "P5B_CONCURRENCY_DEFECT_CLEANUP:",
            "P5A_TEST_CLEANUP:"
        ];
        const cleanupLedgers = ledgerRows.filter(function(row) {
            const reference = String(row[COL_STOK.REFERENSI] || "").trim();
            return String(row[COL_STOK.BARANG_ID] || "").trim() === barangId &&
                String(row[COL_STOK.JENISMUTASI] || "").trim() === MovementType.SALE &&
                cleanupPrefixes.some(function(prefix) { return reference === prefix + purchaseNumber; });
        });
        const purchaseQty = purchaseLedgers.reduce(function(total, row) {
            return total + canonicalPurchaseP5B9Number_(row[COL_STOK.QTYMASUK]);
        }, 0);
        const cleanupQty = cleanupLedgers.reduce(function(total, row) {
            return total + canonicalPurchaseP5B9Number_(row[COL_STOK.QTYKELUAR]);
        }, 0);
        return {
            submissionId: String(header.submissionId || ""),
            purchaseNumber: purchaseNumber,
            status: String(header.status || ""),
            transactionId: String(header.transactionId || ""),
            idempotencyKey: String(header.idempotencyKey || ""),
            purchaseQty: purchaseQty,
            purchaseLedgerIds: purchaseLedgers.map(function(row) { return String(row[COL_STOK.ID] || ""); }),
            purchaseLedgerCreatedAt: purchaseLedgers.map(function(row) { return canonicalPurchaseP5B9DateValue_(row[COL_STOK.CREATEDAT]); }),
            cleanupSaleQty: cleanupQty,
            cleanupLedgerIds: cleanupLedgers.map(function(row) { return String(row[COL_STOK.ID] || ""); }),
            netUncleanedContribution: purchaseQty - cleanupQty,
            proposedCleanupReference: canonicalPurchaseP5B9CleanupReference_(header.submissionId, purchaseNumber)
        };
    });

    const duplicateGroup = fixtureRecords.filter(function(record) {
        return record.submissionId === "P5B-PAR-176878" && record.netUncleanedContribution > 0;
    }).sort(function(left, right) {
        return String(left.purchaseLedgerCreatedAt[0] || "").localeCompare(String(right.purchaseLedgerCreatedAt[0] || ""));
    });
    duplicateGroup.forEach(function(record, index) {
        record.cleanupCategory = index === 0 ? "NORMAL TEST" : "DEFECT";
        record.cleanupNote = index === 0 ? "Intended P5B parallel fixture contribution." : "Duplicate parallel commit excess contribution.";
    });
    fixtureRecords.forEach(function(record) {
        if (!record.cleanupCategory) {
            record.cleanupCategory = "NORMAL TEST";
            record.cleanupNote = "Canonical Purchase test fixture contribution.";
        }
        record.proposedCleanupReferenceExists = ledgerRows.some(function(row) {
            return String(row[COL_STOK.REFERENSI] || "").trim() === record.proposedCleanupReference;
        });
    });

    const contributing = fixtureRecords.filter(function(record) {
        return record.netUncleanedContribution !== 0;
    });
    const totalPurchaseIn = fixtureRecords.reduce(function(total, record) {
        return total + record.purchaseQty;
    }, 0);
    const existingCleanupOut = fixtureRecords.reduce(function(total, record) {
        return total + record.cleanupSaleQty;
    }, 0);
    const netUncleanedContribution = contributing.reduce(function(total, record) {
        return total + record.netUncleanedContribution;
    }, 0);
    const freshStock = BarangRepository.getStock(barangId);
    const baseline = 66;
    const currentTestDelta = freshStock - baseline;
    const cleanupTable = contributing.map(function(record) {
        return {
            category: record.cleanupCategory,
            submissionId: record.submissionId,
            purchaseNumber: record.purchaseNumber,
            barangId: barangId,
            qty: record.netUncleanedContribution,
            movementType: MovementType.SALE,
            reference: record.proposedCleanupReference,
            note: record.cleanupNote,
            actor: "P5B_TEST",
            duplicateCleanupReferenceExists: record.proposedCleanupReferenceExists
        };
    });
    return {
        success: true,
        barangId: barangId,
        freshStock: freshStock,
        baseline: baseline,
        allFixtures: fixtureRecords,
        contributingFixtures: contributing,
        totalTestPurchaseIn: totalPurchaseIn,
        existingTestCleanupOut: existingCleanupOut,
        netUncleanedTestContribution: netUncleanedContribution,
        currentTestDelta: currentTestDelta,
        reconciliationMatches: netUncleanedContribution === currentTestDelta,
        cleanupTable: cleanupTable,
        totalProposedCleanup: cleanupTable.reduce(function(total, row) { return total + row.qty; }, 0),
        expectedStockAfterCleanup: freshStock - cleanupTable.reduce(function(total, row) { return total + row.qty; }, 0),
        duplicateCleanupGuardPass: cleanupTable.every(function(row) { return !row.duplicateCleanupReferenceExists; })
    };
}

function auditCanonicalPurchaseP5B9LedgerReconciliationSummaryCli() {
    const audit = auditCanonicalPurchaseP5B9LedgerReconciliationCli();
    const ledgerRows = StockLedgerRepository.sheet().getLastRow() < 2 ? [] : StockLedgerRepository.sheet()
        .getRange(2, 1, StockLedgerRepository.sheet().getLastRow() - 1, 14)
        .getValues();
    const cleanupRows = ledgerRows.filter(function(row) {
        return String(row[COL_STOK.BARANG_ID] || "").trim() === "BRG000001" &&
            String(row[COL_STOK.JENISMUTASI] || "").trim() === MovementType.SALE &&
            /^(P2_TEST_CLEANUP|P4_TEST_CLEANUP|P5A_TEST_CLEANUP|P5B_TEST_CLEANUP|P5B_CONCURRENCY_DEFECT_CLEANUP):/.test(String(row[COL_STOK.REFERENSI] || "").trim());
    }).map(function(row) {
        return {
            ledgerId: String(row[COL_STOK.ID] || ""),
            reference: String(row[COL_STOK.REFERENSI] || ""),
            qtyOut: canonicalPurchaseP5B9Number_(row[COL_STOK.QTYKELUAR]),
            note: String(row[COL_STOK.KETERANGAN] || ""),
            actor: String(row[COL_STOK.ADMIN] || "")
        };
    });
    return {
        freshStock: audit.freshStock,
        baseline: audit.baseline,
        currentTestDelta: audit.currentTestDelta,
        totalTestPurchaseIn: audit.totalTestPurchaseIn,
        existingTestCleanupOut: audit.existingTestCleanupOut,
        netUncleanedTestContribution: audit.netUncleanedTestContribution,
        reconciliationMatches: audit.reconciliationMatches,
        contributingFixtures: audit.contributingFixtures,
        cleanupRows: cleanupRows,
        fixtureCount: audit.allFixtures.length,
        zeroFixtureP5BPar176879: audit.allFixtures.filter(function(record) {
            return record.submissionId === "P5B-PAR-176879";
        })
    };
}

function auditCanonicalPurchaseP5B9ExternalTestDeltaCli() {
    const rows = StockLedgerRepository.sheet().getLastRow() < 2 ? [] : StockLedgerRepository.sheet()
        .getRange(2, 1, StockLedgerRepository.sheet().getLastRow() - 1, 14)
        .getValues();
    const barangId = "BRG000001";
    const families = [
        { name: "P2", purchaseReference: /^PO26082100(?:0[1-9]|10)$/, cleanupPrefix: "P2_TEST_CLEANUP:" },
        { name: "P4", purchaseReference: /^PO-P4-/, cleanupPrefix: "P4_TEST_CLEANUP:" }
    ].map(function(family) {
        const purchases = rows.filter(function(row) {
            return String(row[COL_STOK.BARANG_ID] || "").trim() === barangId &&
                String(row[COL_STOK.JENISMUTASI] || "").trim() === MovementType.PURCHASE &&
                family.purchaseReference.test(String(row[COL_STOK.REFERENSI] || "").trim());
        });
        const cleanups = rows.filter(function(row) {
            return String(row[COL_STOK.BARANG_ID] || "").trim() === barangId &&
                String(row[COL_STOK.JENISMUTASI] || "").trim() === MovementType.SALE &&
                String(row[COL_STOK.REFERENSI] || "").trim().indexOf(family.cleanupPrefix) === 0;
        });
        return {
            family: family.name,
            purchaseIn: purchases.reduce(function(total, row) { return total + canonicalPurchaseP5B9Number_(row[COL_STOK.QTYMASUK]); }, 0),
            cleanupOut: cleanups.reduce(function(total, row) { return total + canonicalPurchaseP5B9Number_(row[COL_STOK.QTYKELUAR]); }, 0),
            net: purchases.reduce(function(total, row) { return total + canonicalPurchaseP5B9Number_(row[COL_STOK.QTYMASUK]); }, 0) - cleanups.reduce(function(total, row) { return total + canonicalPurchaseP5B9Number_(row[COL_STOK.QTYKELUAR]); }, 0),
            purchaseLedgerIds: purchases.map(function(row) { return String(row[COL_STOK.ID] || ""); })
        };
    });
    return {
        families: families,
        purchaseFixtureSnapshot: auditCanonicalPurchaseP5B9LedgerReconciliationSummaryCli().contributingFixtures.map(function(record) {
            return {
                submissionId: record.submissionId,
                purchaseNumber: record.purchaseNumber,
                status: record.status,
                purchaseQty: record.purchaseQty,
                purchaseLedgerIds: record.purchaseLedgerIds,
                cleanupSaleQty: record.cleanupSaleQty,
                cleanupLedgerIds: record.cleanupLedgerIds,
                netUncleanedContribution: record.netUncleanedContribution
            };
        })
    };
}

function auditCanonicalPurchaseP5B9FixtureTableJsonCli() {
    const audit = auditCanonicalPurchaseP5B9LedgerReconciliationCli();
    return JSON.stringify(audit.allFixtures.filter(function(record) {
        return record.purchaseQty !== 0 || record.cleanupSaleQty !== 0 || record.submissionId === "P5B-PAR-176879";
    }).map(function(record) {
        return {
            submissionId: record.submissionId,
            purchaseNumber: record.purchaseNumber,
            status: record.status,
            purchaseQty: record.purchaseQty,
            purchaseLedgerIds: record.purchaseLedgerIds,
            cleanupSaleQty: record.cleanupSaleQty,
            cleanupLedgerIds: record.cleanupLedgerIds,
            netUncleanedContribution: record.netUncleanedContribution,
            cleanupCategory: record.cleanupCategory
        };
    }));
}

/** Read-only forensic trace: physical sheet order is the ledger chronology. */
function auditCanonicalPurchaseP5B9ForensicStockDeltaCli() {
    const barangId = "BRG000001";
    const targetIds = [
        "STK2608210596", "STK2608210597",
        "STK2608210602", "STK2608210603"
    ];
    const sheet = StockLedgerRepository.sheet();
    const rows = sheet.getLastRow() < 2 ? [] : sheet
        .getRange(2, 1, sheet.getLastRow() - 1, 14)
        .getValues();
    const itemRows = rows.map(function(row, index) {
        return { rowNumber: index + 2, row: row };
    }).filter(function(item) {
        return String(item.row[COL_STOK.BARANG_ID] || "").trim() === barangId;
    });
    const targetIndex = itemRows.findIndex(function(item) {
        return String(item.row[COL_STOK.ID] || "").trim() === "STK2608210596";
    });
    if (targetIndex < 0) throw new Error("Ledger awal forensic STK2608210596 tidak ditemukan.");
    function toTrace(item) {
        const row = item.row;
        const stokAwal = Number(row[COL_STOK.STOKAWAL] || 0);
        const stokAkhir = Number(row[COL_STOK.STOKAKHIR] || 0);
        const qtyMasuk = Number(row[COL_STOK.QTYMASUK] || 0);
        const qtyKeluar = Number(row[COL_STOK.QTYKELUAR] || 0);
        return {
            sheetRow: item.rowNumber,
            ledgerId: String(row[COL_STOK.ID] || ""),
            movementType: String(row[COL_STOK.JENISMUTASI] || ""),
            reference: String(row[COL_STOK.REFERENSI] || ""),
            stokAwal: stokAwal,
            qtyMasuk: qtyMasuk,
            qtyKeluar: qtyKeluar,
            stokAkhir: stokAkhir,
            actualDelta: stokAkhir - stokAwal,
            nominalDelta: qtyMasuk - qtyKeluar
        };
    }
    const trace = itemRows.slice(Math.max(0, targetIndex - 1)).map(toTrace);
    const targetRows = trace.filter(function(row) {
        return targetIds.indexOf(row.ledgerId) >= 0;
    });
    const continuityAnomalies = trace.slice(1).reduce(function(result, row, index) {
        const previous = trace[index];
        if (previous.stokAkhir !== row.stokAwal) {
            result.push({
                previousLedgerId: previous.ledgerId,
                previousStokAkhir: previous.stokAkhir,
                nextLedgerId: row.ledgerId,
                nextStokAwal: row.stokAwal,
                gap: row.stokAwal - previous.stokAkhir
            });
        }
        return result;
    }, []);
    const traceWithoutPredecessor = trace.slice(1);
    const actualDeltaSum = traceWithoutPredecessor.reduce(function(total, row) {
        return total + row.actualDelta;
    }, 0);
    const nominalDeltaSum = traceWithoutPredecessor.reduce(function(total, row) {
        return total + row.nominalDelta;
    }, 0);
    return {
        success: true,
        barangId: barangId,
        targetRows: targetRows,
        traceStartPredecessor: trace[0],
        trace: traceWithoutPredecessor,
        continuityAnomalies: continuityAnomalies,
        actualDeltaSum: actualDeltaSum,
        nominalDeltaSum: nominalDeltaSum,
        freshMasterStock: BarangRepository.getStock(barangId),
        traceExpectedEndingStock: trace[0].stokAkhir + actualDeltaSum
    };
}

/** Approved P5B.11 test-data cleanup only. Uses InventoryService; never writes directly. */
function getCanonicalPurchaseP5B11ApprovedCleanup_() {
    return [
        ["DEFECT_TEST", "P5B-PAR-176878", "PO2608210044", 2],
        ["NORMAL_TEST", "P5B-PAR-176878", "PO2608210045", 2],
        ["NORMAL_TEST", "P5B-PAR-176881", "PO2608210048", 2],
        ["NORMAL_TEST", "P5B-CONFLICT-176882", "PO2608210049", 9],
        ["NORMAL_TEST", "P5B-PAR-176883", "PO2608210050", 2],
        ["NORMAL_TEST", "P5B-DIFF-B-176884", "PO2608210051", 3],
        ["NORMAL_TEST", "P5B-DIFF-A-176884", "PO2608210052", 2],
        ["NORMAL_TEST", "P5B-NEW-1787317643564", "PO2608210055", 1],
        ["NORMAL_TEST", "P5B-RETRY-1787317662859", "PO2608210056", 1],
        ["NORMAL_TEST", "P5B-QTY-1787317695295", "PO2608210057", 1],
        ["NORMAL_TEST", "P5B-BARANG-1787317991190", "PO2608210058", 1],
        ["NORMAL_TEST", "P5B-HEADER-1787318010991", "PO2608210059", 1],
        ["NORMAL_TEST", "P5B-HEADER-1787318036831", "PO2608210060", 1],
        ["NORMAL_TEST", "P5B-DUP-1787318038709", "PO2608210061", 5],
        ["NORMAL_TEST", "P5B-HEADER-1787318645008", "PO2608210065", 1],
        ["NORMAL_TEST", "P5B-DUP-1787319742818", "PO2608210066", 5]
    ].map(function(item) {
        return {
            category: item[0], submissionId: item[1], purchaseNumber: item[2], qty: item[3],
            reference: "P5B_FINAL_CLEANUP:" + item[1] + ":" + item[2]
        };
    });
}

function assertCanonicalPurchaseP5B11_(condition, message) {
    if (!condition) throw new Error("P5B.11 cleanup guard gagal: " + message);
}

function findCanonicalPurchaseP5B11LedgerById_(ledgerId) {
    const sheet = StockLedgerRepository.sheet();
    if (sheet.getLastRow() < 2) return null;
    return sheet.getRange(2, 1, sheet.getLastRow() - 1, 14).getValues().find(function(row) {
        return String(row[COL_STOK.ID] || "").trim() === ledgerId;
    }) || null;
}

function runCanonicalPurchaseP5B11ApprovedCleanupCli() {
    const barangId = "BRG000001";
    const approved = getCanonicalPurchaseP5B11ApprovedCleanup_();
    const headerCountBefore = PurchaseRepository.getHeaderSheet().getLastRow();
    const detailCountBefore = PurchaseRepository.getDetailSheet().getLastRow();
    let expectedStock = 105;
    const preflightStock = BarangRepository.getStock(barangId);
    assertCanonicalPurchaseP5B11_(preflightStock === expectedStock, "Stok awal harus 105, actual " + preflightStock + ".");
    approved.forEach(function(item) {
        assertCanonicalPurchaseP5B11_(
            StockLedgerRepository.findByReferensiFresh(item.reference).length === 0,
            "Reference cleanup sudah ada: " + item.reference
        );
    });
    const historicalBefore = ["STK2608210597", "STK2608210603"].map(function(id) {
        const row = findCanonicalPurchaseP5B11LedgerById_(id);
        assertCanonicalPurchaseP5B11_(!!row, "Historical ledger hilang: " + id);
        return { id: id, snapshot: JSON.stringify(row) };
    });
    const results = approved.map(function(item) {
        const beforeStock = BarangRepository.getStock(barangId);
        assertCanonicalPurchaseP5B11_(beforeStock === expectedStock, "Stok sebelum " + item.reference + " harus " + expectedStock + ", actual " + beforeStock + ".");
        assertCanonicalPurchaseP5B11_(StockLedgerRepository.findByReferensiFresh(item.reference).length === 0, "Reference muncul sebelum movement: " + item.reference);
        const result = InventoryService.moveStock({
            kodeBarang: barangId,
            movementType: MovementType.SALE,
            qty: item.qty,
            reference: item.reference,
            note: "Canonical Purchase P5B final auditable test cleanup; preserve Purchase and original ledger history.",
            performedBy: "P5B_TEST"
        });
        SpreadsheetApp.flush();
        const afterStock = BarangRepository.getStock(barangId);
        const rows = StockLedgerRepository.findByReferensiFresh(item.reference);
        assertCanonicalPurchaseP5B11_(afterStock === beforeStock - item.qty, "Stok sesudah " + item.reference + " tidak sesuai.");
        assertCanonicalPurchaseP5B11_(rows.length === 1, "Ledger cleanup harus tepat satu: " + item.reference);
        const ledger = rows[0];
        assertCanonicalPurchaseP5B11_(
            String(ledger[COL_STOK.JENISMUTASI] || "") === MovementType.SALE &&
            Number(ledger[COL_STOK.QTYKELUAR] || 0) === item.qty &&
            Number(ledger[COL_STOK.STOKAWAL]) === beforeStock &&
            Number(ledger[COL_STOK.STOKAKHIR]) === afterStock,
            "Snapshot cleanup tidak sesuai: " + item.reference
        );
        expectedStock = afterStock;
        return {
            reference: item.reference, category: item.category, purchaseNumber: item.purchaseNumber,
            qty: item.qty, ledgerId: String(ledger[COL_STOK.ID] || ""), beforeStock: beforeStock, afterStock: afterStock,
            serviceLedgerWritten: !!result.ledgerWritten
        };
    });
    assertCanonicalPurchaseP5B11_(expectedStock === 66, "Stok chain akhir harus 66, actual " + expectedStock + ".");
    assertCanonicalPurchaseP5B11_(BarangRepository.getStock(barangId) === 66, "Fresh stock akhir harus 66.");
    approved.forEach(function(item) {
        assertCanonicalPurchaseP5B11_(StockLedgerRepository.findByReferensiFresh(item.reference).length === 1, "Reference akhir tidak tepat satu: " + item.reference);
    });
    historicalBefore.forEach(function(item) {
        const current = findCanonicalPurchaseP5B11LedgerById_(item.id);
        assertCanonicalPurchaseP5B11_(JSON.stringify(current) === item.snapshot, "Historical ledger berubah: " + item.id);
    });
    assertCanonicalPurchaseP5B11_(PurchaseRepository.getHeaderSheet().getLastRow() === headerCountBefore, "Purchase header berubah.");
    assertCanonicalPurchaseP5B11_(PurchaseRepository.getDetailSheet().getLastRow() === detailCountBefore, "Purchase detail berubah.");
    return {
        success: true, barangId: barangId, preflightStock: preflightStock, finalStock: 66,
        totalCleanupQty: results.reduce(function(total, item) { return total + item.qty; }, 0), results: results,
        historicalLedgerPreserved: true, purchaseRowsPreserved: true
    };
}

/** Read-only final verification for an approved P5B.11 execution. */
function auditCanonicalPurchaseP5B11FinalStateCli() {
    const approved = getCanonicalPurchaseP5B11ApprovedCleanup_();
    const rows = approved.map(function(item) {
        const matches = StockLedgerRepository.findByReferensiFresh(item.reference);
        return {
            reference: item.reference,
            expectedQty: item.qty,
            count: matches.length,
            ledgerId: matches.length === 1 ? String(matches[0][COL_STOK.ID] || "") : "",
            movementType: matches.length === 1 ? String(matches[0][COL_STOK.JENISMUTASI] || "") : "",
            qtyKeluar: matches.length === 1 ? Number(matches[0][COL_STOK.QTYKELUAR] || 0) : null,
            stokAwal: matches.length === 1 ? Number(matches[0][COL_STOK.STOKAWAL]) : null,
            stokAkhir: matches.length === 1 ? Number(matches[0][COL_STOK.STOKAKHIR]) : null
        };
    });
    const continuity = rows.slice(1).every(function(row, index) {
        return rows[index].stokAkhir === row.stokAwal;
    });
    const historical = {
        STK2608210597: findCanonicalPurchaseP5B11LedgerById_("STK2608210597"),
        STK2608210603: findCanonicalPurchaseP5B11LedgerById_("STK2608210603")
    };
    const purchasesPreserved = approved.every(function(item) {
        return !!PurchaseRepository.findByPurchaseNumber(item.purchaseNumber) &&
            PurchaseRepository.findItemsByPurchaseNumber(item.purchaseNumber).length > 0;
    });
    const validRows = rows.every(function(row) {
        return row.count === 1 && row.movementType === MovementType.SALE &&
            row.qtyKeluar === row.expectedQty && row.stokAkhir === row.stokAwal - row.expectedQty;
    });
    return {
        success: validRows && continuity && BarangRepository.getStock("BRG000001") === 66 && purchasesPreserved,
        finalStock: BarangRepository.getStock("BRG000001"),
        cleanupRows: rows,
        cleanupCount: rows.filter(function(row) { return row.count === 1; }).length,
        totalCleanupQty: rows.reduce(function(total, row) { return total + Number(row.qtyKeluar || 0); }, 0),
        continuous: continuity,
        purchasesPreserved: purchasesPreserved,
        historical: {
            STK2608210597: historical.STK2608210597 ? {
                movementType: historical.STK2608210597[COL_STOK.JENISMUTASI],
                reference: historical.STK2608210597[COL_STOK.REFERENSI],
                stokAwal: historical.STK2608210597[COL_STOK.STOKAWAL],
                stokAkhir: historical.STK2608210597[COL_STOK.STOKAKHIR]
            } : null,
            STK2608210603: historical.STK2608210603 ? {
                movementType: historical.STK2608210603[COL_STOK.JENISMUTASI],
                reference: historical.STK2608210603[COL_STOK.REFERENSI],
                stokAwal: historical.STK2608210603[COL_STOK.STOKAWAL],
                stokAkhir: historical.STK2608210603[COL_STOK.STOKAKHIR]
            } : null
        }
    };
}
