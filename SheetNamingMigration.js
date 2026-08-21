/**
 * Controlled main-spreadsheet migration for Sheet Naming Phase 3.
 * This helper is intentionally bound to the one verified main spreadsheet.
 */
const SHEET_NAMING_MAIN_SPREADSHEET_ID =
    "1x_brII27Hs5gZYhz4wiN6KoEO9MCzEjESWzWNX8RGvE";

const SHEET_NAMING_MAIN_RENAME_MAP = [
    { key : "SETTING", oldName : "01_Setting", newName : "Setting", group : "MASTER" },
    { key : "BARANG", oldName : "02_MasterBarang", newName : "MasterBarang", group : "MASTER" },
    { key : "KATEGORI", oldName : "03_MasterKategori", newName : "MasterKategori", group : "MASTER" },
    { key : "MERK", oldName : "04_MasterMerk", newName : "MasterMerk", group : "MASTER" },
    { key : "SUPPLIER", oldName : "05_MasterSupplier", newName : "MasterSupplier", group : "MASTER" },
    { key : "PELANGGAN", oldName : "06_MasterPelanggan", newName : "MasterPelanggan", group : "MASTER" },
    { key : "VEHICLE", oldName : "07_MasterKendaraan", newName : "MasterKendaraan", group : "MASTER" },
    { key : "JASA", oldName : "08_MasterJasa", newName : "MasterJasa", group : "MASTER" },
    { key : "MEKANIK", oldName : "09_MasterMekanik", newName : "MasterMekanik", group : "MASTER" },
    { key : "MASTER_KELUHAN", oldName : "19_MasterKeluhan", newName : "MasterKeluhan", group : "MASTER" },
    { key : "MASTER_STATUS_WO", oldName : "20_MasterStatusWO", newName : "MasterStatusWO", group : "MASTER" },
    { key : "POS", oldName : "10_POS", newName : "POS", group : "SALES_POS" },
    { key : "PENJUALAN", oldName : "11_Penjualan", newName : "Penjualan", group : "SALES_POS" },
    { key : "DETAIL_PENJUALAN", oldName : "12_DetailPenjualan", newName : "DetailPenjualan", group : "SALES_POS" },
    { key : "KOMISI_MEKANIK", oldName : "16_KomisiMekanik", newName : "KomisiMekanik", group : "SALES_POS" },
    { key : "STOK", oldName : "14_Stok", newName : "Stok", group : "INVENTORY_PURCHASE" },
    { key : "PEMBELIAN", oldName : "22_Pembelian", newName : "Pembelian", group : "INVENTORY_PURCHASE" },
    { key : "DETAIL_PEMBELIAN", oldName : "23_DetailPembelian", newName : "DetailPembelian", group : "INVENTORY_PURCHASE" },
    { key : "WORK_ORDER", oldName : "17_WorkOrder", newName : "WorkOrder", group : "WORK_ORDER" },
    { key : "WORK_ORDER_JASA", oldName : "18_WorkOrderJasa", newName : "WorkOrderJasa", group : "WORK_ORDER" },
    { key : "WORK_ORDER_PART", oldName : "19_WorkOrderPart", newName : "WorkOrderPart", group : "WORK_ORDER" },
    { key : "DASHBOARD", oldName : "15_Dashboard", newName : "Dashboard", group : "SUPPORT" },
    { key : "LAPORAN", oldName : "21_Laporan", newName : "Laporan", group : "SUPPORT" },
    { key : "RUNNING_NUMBER", oldName : "99_RunningNumber", newName : "RunningNumber", group : "SUPPORT" }
];

const SHEET_NAMING_MAIN_EXCLUDED_NAMES = [
    "13_Pembelian_Legacy",
    "MasterModel",
    "MasterUser",
    "RolePermission",
    "02_MasterBarang_BACKUP",
    "19_WorkOrderPart_BACKUP",
    "08_MasterJasa_BACKUP_20260818_153725",
    "03_MasterKategori_BACKUP_20260818_205036",
    "03_MasterKategori_BACKUP_20260818_211356",
    "02_MasterBarang_BACKUP_KATEGORI_20260818_211356",
    "08_MasterJasa_BACKUP_SCHEMA_20260818_225806"
];

function getSheetNamingMainSpreadsheet_(){

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if(ss.getId() !== SHEET_NAMING_MAIN_SPREADSHEET_ID){
        throw new Error("Main spreadsheet ID mismatch; rename dibatalkan.");
    }

    return ss;

}

function serializeSheetNamingMainValidation_(rule){

    if(!rule){
        return null;
    }

    return {
        criteriaType : String(rule.getCriteriaType()),
        criteriaValues : rule.getCriteriaValues().map(function(value){
            if(value && typeof value.getA1Notation === "function"){
                try{
                    return value.getSheet().getName() + "!" + value.getA1Notation();
                }
                catch(error){
                    return "RANGE_ERROR: " + String(error.message || error);
                }
            }

            return value === undefined ? null : String(value);
        })
    };

}

function captureSheetNamingMainBaseline_(ss){

    const pos = ss.getSheetByName("POS") || ss.getSheetByName("10_POS");
    const komisi = ss.getSheetByName("KomisiMekanik") ||
        ss.getSheetByName("16_KomisiMekanik");

    if(!pos || !komisi){
        throw new Error("Baseline POS/Komisi tidak ditemukan.");
    }

    const formulas = {};
    ["AA2", "AB2", "AZ2", "B3", "AD2"].forEach(function(cell){
        formulas["POS!" + cell] = pos.getRange(cell).getFormula();
    });
    formulas["KomisiMekanik!G2:J2"] =
        komisi.getRange("G2:J2").getFormulas()[0];

    const validations = {};
    ["B4", "H3", "H4", "I11:I25", "E4", "B8"].forEach(function(a1){
        validations["POS!" + a1] = pos.getRange(a1)
            .getDataValidations()
            .map(function(row){
                return row.map(serializeSheetNamingMainValidation_);
            });
    });

    return { formulas : formulas, validations : validations };

}

function assertSheetNamingMainConfigTargets_(){

    SHEET_NAMING_MAIN_RENAME_MAP.forEach(function(rename){
        if(CONFIG.SHEET[rename.key] !== rename.newName){
            throw new Error("CONFIG target tidak sesuai: " + rename.key);
        }
    });

    if(CONFIG.SHEET.PEMBELIAN_LEGACY !== "13_Pembelian_Legacy"){
        throw new Error("PEMBELIAN_LEGACY tidak boleh berubah.");
    }

}

function assertSheetNamingMainPreflight_(ss){

    const targetNames = {};

    assertSheetNamingMainConfigTargets_();

    SHEET_NAMING_MAIN_RENAME_MAP.forEach(function(rename){
        if(!ss.getSheetByName(rename.oldName)){
            throw new Error("Source sheet tidak ada: " + rename.oldName);
        }
        if(ss.getSheetByName(rename.newName)){
            throw new Error("Target collision: " + rename.newName);
        }
        if(targetNames[rename.newName]){
            throw new Error("Duplicate target: " + rename.newName);
        }
        targetNames[rename.newName] = true;
    });

    SHEET_NAMING_MAIN_EXCLUDED_NAMES.forEach(function(name){
        if(!ss.getSheetByName(name)){
            throw new Error("Excluded sheet hilang: " + name);
        }
    });

    return captureSheetNamingMainBaseline_(ss);

}

function hasNewSheetNamingMainRefError_(baseline, current){

    return Object.keys(current.formulas).some(function(key){
        return JSON.stringify(current.formulas[key]).indexOf("#REF!") >= 0 &&
            JSON.stringify(baseline.formulas[key]).indexOf("#REF!") < 0;
    });

}

function runSheetNamingMainPreflightCli(){

    const ss = getSheetNamingMainSpreadsheet_();
    const baseline = assertSheetNamingMainPreflight_(ss);

    return {
        success : true,
        spreadsheetId : ss.getId(),
        spreadsheetName : ss.getName(),
        renameCount : SHEET_NAMING_MAIN_RENAME_MAP.length,
        baseline : baseline
    };

}

function rollbackSheetNamingMainRenames_(ss, completed){

    completed.slice().reverse().forEach(function(rename){
        const renamed = ss.getSheetByName(rename.newName);
        const original = ss.getSheetByName(rename.oldName);

        if(renamed && !original){
            renamed.setName(rename.oldName);
            SpreadsheetApp.flush();
        }
        else if(renamed && original){
            throw new Error("Rollback ambiguous: " + rename.oldName);
        }
    });

    completed.forEach(function(rename){
        if(!ss.getSheetByName(rename.oldName) || ss.getSheetByName(rename.newName)){
            throw new Error("Rollback verification gagal: " + rename.oldName);
        }
    });

}

function runSheetNamingMainMigrationCli(){

    const ss = getSheetNamingMainSpreadsheet_();
    const baseline = assertSheetNamingMainPreflight_(ss);
    const completed = [];
    let operationError = null;
    let rollbackError = null;

    try{
        SHEET_NAMING_MAIN_RENAME_MAP.forEach(function(rename){
            ss.getSheetByName(rename.oldName).setName(rename.newName);
            SpreadsheetApp.flush();

            if(!ss.getSheetByName(rename.newName) || ss.getSheetByName(rename.oldName)){
                throw new Error("Rename verification gagal: " + rename.oldName);
            }

            completed.push(rename);

            if(hasNewSheetNamingMainRefError_(
                baseline,
                captureSheetNamingMainBaseline_(ss)
            )){
                throw new Error("New #REF! terdeteksi setelah: " + rename.newName);
            }
        });
    }
    catch(error){
        operationError = error;
    }
    finally{
        if(operationError){
            try{
                rollbackSheetNamingMainRenames_(ss, completed);
            }
            catch(error){
                rollbackError = error;
            }
        }
    }

    if(operationError){
        if(rollbackError){
            operationError.message += " Rollback gagal: " +
                String(rollbackError.message || rollbackError);
        }
        throw operationError;
    }

    return {
        success : true,
        spreadsheetId : ss.getId(),
        groupsExecuted : completed.map(function(rename){ return rename.group; }),
        renameCount : completed.length
    };

}

function inspectSheetNamingMainRenameState_(ss){

    let pendingSeen = false;
    const pending = [];
    const completed = [];

    SHEET_NAMING_MAIN_RENAME_MAP.forEach(function(rename){
        const hasOld = !!ss.getSheetByName(rename.oldName);
        const hasNew = !!ss.getSheetByName(rename.newName);

        if(hasNew && !hasOld){
            if(pendingSeen){
                throw new Error("Rename state bukan prefix valid: " + rename.key);
            }
            completed.push(rename);
            return;
        }

        if(hasOld && !hasNew){
            pendingSeen = true;
            pending.push(rename);
            return;
        }

        throw new Error("Rename state ambiguous/invalid: " + rename.key);
    });

    return {
        completed : completed,
        pending : pending
    };

}

function runSheetNamingMainRenameStateCli(){

    const ss = getSheetNamingMainSpreadsheet_();
    const state = inspectSheetNamingMainRenameState_(ss);

    return {
        success : true,
        spreadsheetId : ss.getId(),
        completed : state.completed.map(function(rename){ return rename.key; }),
        pending : state.pending.map(function(rename){ return rename.key; })
    };

}

function runSheetNamingMainResumeCli(){

    const ss = getSheetNamingMainSpreadsheet_();
    assertSheetNamingMainConfigTargets_();

    const state = inspectSheetNamingMainRenameState_(ss);
    const baseline = captureSheetNamingMainBaseline_(ss);
    const resumed = [];
    let operationError = null;
    let rollbackError = null;

    try{
        state.pending.forEach(function(rename){
            ss.getSheetByName(rename.oldName).setName(rename.newName);
            SpreadsheetApp.flush();

            if(!ss.getSheetByName(rename.newName) || ss.getSheetByName(rename.oldName)){
                throw new Error("Resume verification gagal: " + rename.key);
            }

            resumed.push(rename);

            if(hasNewSheetNamingMainRefError_(
                baseline,
                captureSheetNamingMainBaseline_(ss)
            )){
                throw new Error("New #REF! terdeteksi saat resume: " + rename.key);
            }
        });
    }
    catch(error){
        operationError = error;
    }
    finally{
        if(operationError){
            try{
                rollbackSheetNamingMainRenames_(ss, resumed);
            }
            catch(error){
                rollbackError = error;
            }
        }
    }

    if(operationError){
        if(rollbackError){
            operationError.message += " Resume rollback gagal: " +
                String(rollbackError.message || rollbackError);
        }
        throw operationError;
    }

    return {
        success : true,
        spreadsheetId : ss.getId(),
        resumed : resumed.map(function(rename){ return rename.key; })
    };

}

function runSheetNamingPostRenameValidationCli(){

    const ss = getSheetNamingMainSpreadsheet_();

    assertSheetNamingMainConfigTargets_();

    SHEET_NAMING_MAIN_RENAME_MAP.forEach(function(rename){
        if(!ss.getSheetByName(rename.newName) || ss.getSheetByName(rename.oldName)){
            throw new Error("Post-rename sheet verification gagal: " + rename.key);
        }
    });

    SHEET_NAMING_MAIN_EXCLUDED_NAMES.forEach(function(name){
        if(!ss.getSheetByName(name)){
            throw new Error("Excluded sheet berubah/hilang: " + name);
        }
    });

    const reads = {
        runningNumberSheet : ss.getSheetByName(CONFIG.SHEET.RUNNING_NUMBER).getName(),
        customerRows : CustomerRepository.findAll().length,
        vehicleRows : VehicleRepository.findAll().length,
        purchaseHeaderSheet : PurchaseRepository.getHeaderSheet().getName(),
        purchaseDetailSheet : PurchaseRepository.getDetailSheet().getName(),
        workOrderRows : WorkOrderRepository.findAll().length,
        stockLedgerSheet : StockLedgerRepository.sheet().getName()
    };

    return {
        success : true,
        spreadsheetId : ss.getId(),
        reads : reads,
        baseline : captureSheetNamingMainBaseline_(ss)
    };

}
