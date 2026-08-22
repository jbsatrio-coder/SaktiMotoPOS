/**
 * Audit dan regression test-only untuk hardening create Master Barang.
 */

function auditBarangCreateHardeningValidationCli(){
    const sheet = getSheet_(CONFIG.SHEET.BARANG);
    const headers = sheet.getRange(1, 1, 1, COL_BARANG.TOTAL).getDisplayValues()[0];
    const fields = [
        "KATEGORI",
        "SUBKATEGORI",
        "MERK",
        "KENDARAAN",
        "SATUAN",
        "STATUS"
    ];
    const result = {};

    fields.forEach(function(field){
        const column = COL_BARANG[field] + 1;
        const rule = sheet.getRange(2, column).getDataValidation();
        result[field.toLowerCase()] = barangCreateHardeningDescribeValidation_(
            sheet,
            headers[column - 1],
            column,
            rule
        );
    });

    return {
        success: true,
        sheet: sheet.getName(),
        validations: result,
        masterKategori: KategoriService.getAll().map(function(kategori){
            return kategori.nama;
        })
    };
}

function barangCreateHardeningDescribeValidation_(sheet, header, column, rule){
    const result = {
        header: header,
        column: column,
        hasValidation: !!rule,
        criteriaType: rule ? String(rule.getCriteriaType()) : "",
        allowInvalid: rule ? rule.getAllowInvalid() : null,
        helpText: rule ? (rule.getHelpText() || "") : "",
        criteriaValuesJson: "[]"
    };

    if(!rule){
        return result;
    }

    const values = rule.getCriteriaValues().map(function(value){
        if(value && typeof value.getA1Notation === "function"){
            return {
                type: "RANGE",
                sheet: value.getSheet().getName(),
                a1Notation: value.getA1Notation(),
                displayValues: value.getDisplayValues().map(function(row){
                    return row[0];
                })
            };
        }
        return value;
    });

    result.criteriaValuesJson = JSON.stringify(values);
    return result;
}

function auditBarangCreateHardeningPartialRowsCli(){
    const rows = BarangRepository.getAll();
    const candidates = rows.filter(function(row){
        const id = String(row[COL_BARANG.ID] || "").trim();
        if(!id){
            return false;
        }
        return String(row[COL_BARANG.NAMA] || "").trim() &&
            !String(row[COL_BARANG.KATEGORI] || "").trim() &&
            !String(row[COL_BARANG.SATUAN] || "").trim() &&
            !String(row[COL_BARANG.STATUS] || "").trim() &&
            !String(row[COL_BARANG.CREATED_AT] || "").trim() &&
            !String(row[COL_BARANG.CREATED_BY] || "").trim();
    }).map(function(row){
        return {
            id: String(row[COL_BARANG.ID] || "").trim(),
            nama: String(row[COL_BARANG.NAMA] || "").trim(),
            kategori: String(row[COL_BARANG.KATEGORI] || "").trim(),
            satuan: String(row[COL_BARANG.SATUAN] || "").trim(),
            status: String(row[COL_BARANG.STATUS] || "").trim()
        };
    });

    return {
        success: true,
        knownHistoricalTestAnomaliesJson: JSON.stringify(
            candidates.filter(function(row){
                return row.id === "BRG000163" || row.id === "BRG000164";
            })
        ),
        candidateCount: candidates.length,
        candidateIdsRequireHistoricalReviewJson: JSON.stringify(
            candidates.map(function(row){ return row.id; })
        )
    };
}

function runBarangCreateHardeningInvalidCategoryRegressionCli(){
    const marker = "BARANG_CREATE_HARDENING_INVALID_CATEGORY";
    const before = barangCreateHardeningSnapshot_(marker);
    let errorMessage = "";

    try{
        BarangService.createBarang(
            barangCreateHardeningPayload_(marker, "TEST")
        );
        throw new Error("Request kategori invalid tidak ditolak.");
    } catch(error){
        errorMessage = String(error.message || error);
    }

    if(errorMessage.indexOf("Kategori Barang tidak valid : TEST") === -1){
        throw new Error("Error kategori invalid tidak spesifik: " + errorMessage);
    }

    const after = barangCreateHardeningSnapshot_(marker);
    if(before.markerRows !== after.markerRows){
        throw new Error("Kategori invalid membuat row MasterBarang baru.");
    }
    if(before.stockLedgerRows !== after.stockLedgerRows){
        throw new Error("Kategori invalid membuat Stock Ledger baru.");
    }

    return {
        success: true,
        marker: marker,
        errorMessage: errorMessage,
        markerRowsBefore: before.markerRows,
        markerRowsAfter: after.markerRows,
        stockLedgerRowsBefore: before.stockLedgerRows,
        stockLedgerRowsAfter: after.stockLedgerRows
    };
}

function runBarangCreateHardeningValidCreateRegressionCli(){
    const marker = "BARANG_CREATE_HARDENING_TEST";
    const stockLedgerRowsBefore = Math.max(
        StockLedgerRepository.sheet().getLastRow() - 1,
        0
    );
    const matches = barangCreateHardeningFindAllByMarker_(marker);
    if(matches.length > 1){
        throw new Error("Marker valid create memiliki lebih dari satu row.");
    }
    const existing = matches[0] || null;
    const result = existing ? {
        id: existing[COL_BARANG.ID]
    } : BarangService.createBarang(
        barangCreateHardeningPayload_(
            marker,
            "Pelumas & Fluida"
        )
    );
    const id = String(result.id || "").trim();
    const repositoryRow = BarangRepository.findById(id);
    const freshRow = barangCreateHardeningFreshById_(id);

    if(!repositoryRow || !freshRow){
        throw new Error("Barang valid tidak dapat dibaca kembali.");
    }

    const checks = {
        hargaModal: Number(repositoryRow[COL_BARANG.HARGAMODAL]) === 10000 && Number(freshRow[COL_BARANG.HARGAMODAL]) === 10000,
        hargaJual: Number(repositoryRow[COL_BARANG.HARGAJUAL]) === 20000 && Number(freshRow[COL_BARANG.HARGAJUAL]) === 20000,
        stok: Number(repositoryRow[COL_BARANG.STOK]) === 0 && Number(freshRow[COL_BARANG.STOK]) === 0,
        satuan: String(repositoryRow[COL_BARANG.SATUAN] || "").trim() === "PCS" && String(freshRow[COL_BARANG.SATUAN] || "").trim() === "PCS",
        status: String(repositoryRow[COL_BARANG.STATUS] || "").trim() === "AKTIF" && String(freshRow[COL_BARANG.STATUS] || "").trim() === "AKTIF",
        kategori: String(repositoryRow[COL_BARANG.KATEGORI] || "").trim() === "Pelumas & Fluida" && String(freshRow[COL_BARANG.KATEGORI] || "").trim() === "Pelumas & Fluida",
        catatan: String(repositoryRow[COL_BARANG.CATATAN] || "").trim() === marker
    };

    Object.keys(checks).forEach(function(key){
        if(!checks[key]){
            throw new Error("Valid create field tidak lengkap: " + key);
        }
    });

    const stockLedgerRowsAfter = Math.max(
        StockLedgerRepository.sheet().getLastRow() - 1,
        0
    );
    if(stockLedgerRowsAfter !== stockLedgerRowsBefore){
        throw new Error("Create MasterBarang tidak boleh membuat Stock Ledger.");
    }

    return {
        success: true,
        barangId: id,
        marker: marker,
        created: !existing,
        markerRowCount: barangCreateHardeningFindAllByMarker_(marker).length,
        stockLedgerRowsBefore: stockLedgerRowsBefore,
        stockLedgerRowsAfter: stockLedgerRowsAfter,
        checksJson: JSON.stringify(checks)
    };
}

function runBarangCreateHardeningFailedWriteRollbackCli(){
    const marker = "BARANG_CREATE_HARDENING_FORCED_WRITE_FAILURE";
    const before = barangCreateHardeningSnapshot_(marker);
    const protectedRowBefore = BarangRepository.findById("BRG000001");
    let errorMessage = "";

    BarangRepository.__testAfterWriteFailure = function(){
        throw new Error("BARANG_CREATE_HARDENING_FORCED_WRITE_FAILURE");
    };

    try{
        BarangService.createBarang(
            barangCreateHardeningPayload_(
                marker,
                "Pelumas & Fluida"
            )
        );
        throw new Error("Failure seam tidak memicu error.");
    } catch(error){
        errorMessage = String(error.message || error);
    } finally {
        BarangRepository.__testAfterWriteFailure = null;
    }

    if(errorMessage.indexOf("BARANG_CREATE_HARDENING_FORCED_WRITE_FAILURE") === -1){
        throw new Error("Failure seam menghasilkan error tidak terduga: " + errorMessage);
    }

    const after = barangCreateHardeningSnapshot_(marker);
    const protectedRowAfter = BarangRepository.findById("BRG000001");
    if(before.markerRows !== after.markerRows){
        throw new Error("Failure write meninggalkan row MasterBarang.");
    }
    if(before.stockLedgerRows !== after.stockLedgerRows){
        throw new Error("Failure write membuat Stock Ledger.");
    }
    if(JSON.stringify(protectedRowBefore) !== JSON.stringify(protectedRowAfter)){
        throw new Error("Failure write mengubah Barang yang sudah ada.");
    }

    return {
        success: true,
        marker: marker,
        errorMessage: errorMessage,
        markerRowsBefore: before.markerRows,
        markerRowsAfter: after.markerRows,
        stockLedgerRowsBefore: before.stockLedgerRows,
        stockLedgerRowsAfter: after.stockLedgerRows
    };
}

function runBarangCreateHardeningRepositoryReadSmokeCli(){
    const barangId = "BRG000165";
    const barang = BarangRepository.findById(barangId);
    const product = ProductRepository.getByKode(barangId);

    if(!barang || !product){
        throw new Error("Barang/ProductRepository tidak dapat membaca Barang hardening test.");
    }
    if(
        String(product.kode || "").trim() !== barangId ||
        String(product.jenis || "").trim() !== "BARANG"
    ){
        throw new Error("ProductRepository mengembalikan data Barang tidak sesuai.");
    }

    return {
        success: true,
        barangId: barangId,
        nama: String(product.nama || "").trim(),
        harga: Number(product.harga || 0),
        stok: Number(product.stok || 0)
    };
}

function barangCreateHardeningPayload_(marker, kategori){
    return {
        nama: marker,
        namaPendek: "BCH Test",
        kataKunci: marker.toLowerCase(),
        kategori: kategori,
        subkategori: "TEST",
        merk: "Honda",
        kendaraan: "",
        satuan: "PCS",
        hargaModal: 10000,
        hargaJual: 20000,
        pricingMode: "HARGA_JUAL",
        stok: 0,
        minStok: 0,
        rak: "TEST",
        supplier: "",
        status: "AKTIF",
        catatan: marker,
        createdBy: "BARANG_CREATE_HARDENING_TEST"
    };
}

function barangCreateHardeningSnapshot_(marker){
    return {
        markerRows: BarangRepository.getAll().filter(function(row){
            return String(row[COL_BARANG.NAMA] || "").trim() === marker;
        }).length,
        stockLedgerRows: Math.max(
            StockLedgerRepository.sheet().getLastRow() - 1,
            0
        )
    };
}

function barangCreateHardeningFindByMarker_(marker){
    return barangCreateHardeningFindAllByMarker_(marker)[0] || null;
}

function barangCreateHardeningFindAllByMarker_(marker){
    return BarangRepository.getAll().filter(function(row){
        return String(row[COL_BARANG.NAMA] || "").trim() === marker;
    });
}

function barangCreateHardeningFreshById_(barangId){
    const ss = SpreadsheetApp.openById(
        SpreadsheetApp.getActiveSpreadsheet().getId()
    );
    const sheet = ss.getSheetByName(CONFIG.SHEET.BARANG);
    const rows = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), COL_BARANG.TOTAL).getValues();
    return rows.find(function(row){
        return String(row[COL_BARANG.ID] || "").trim() === barangId;
    }) || null;
}
