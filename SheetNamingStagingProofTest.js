/**
 * Temporary, staging-only rename proof.
 * This file must not be used against the development spreadsheet.
 */
const SHEET_NAMING_STAGING_SPREADSHEET_ID =
    "18cKT7x3waN5Ml6TNRV7hIuPmon1exFnJJgVjy2Id50U";

const SHEET_NAMING_STAGING_RENAMES = [
    { original : "06_MasterPelanggan", renamed : "MasterPelanggan" },
    { original : "07_MasterKendaraan", renamed : "MasterKendaraan" },
    { original : "09_MasterMekanik", renamed : "MasterMekanik" },
    { original : "11_Penjualan", renamed : "Penjualan" }
];

function getSheetNamingStagingSpreadsheet_(){

    const ss = SpreadsheetApp.openById(
        SHEET_NAMING_STAGING_SPREADSHEET_ID
    );

    if(ss.getId() !== SHEET_NAMING_STAGING_SPREADSHEET_ID){
        throw new Error("Staging spreadsheet ID mismatch.");
    }

    return ss;

}

function runSheetNamingStagingInventoryCli(){

    const ss = getSheetNamingStagingSpreadsheet_();

    return {
        stagingSpreadsheetId : ss.getId(),
        stagingSpreadsheetName : ss.getName(),
        sheetNames : ss.getSheets().map(function(sheet){
            return sheet.getName();
        })
    };

}

function getSheetNamingStagingSheet_(ss, name){

    const sheet = ss.getSheetByName(name);

    if(!sheet){
        throw new Error("Staging sheet tidak ditemukan: " + name);
    }

    return sheet;

}

function serializeSheetNamingStagingValidation_(rule){

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
        }),
        allowInvalid : rule.getAllowInvalid(),
        helpText : rule.getHelpText() || ""
    };

}

function captureSheetNamingStagingFormulaSnapshot_(ss){

    const pos = getSheetNamingStagingSheet_(ss, "10_POS");
    const komisi = getSheetNamingStagingSheet_(ss, "16_KomisiMekanik");
    const formulas = {};

    ["AA2", "AB2", "AZ2", "B3"].forEach(function(cell){
        formulas["10_POS!" + cell] = pos.getRange(cell).getFormula();
    });

    formulas["16_KomisiMekanik!G2:J2"] =
        komisi.getRange("G2:J2").getFormulas()[0];

    return formulas;

}

function captureSheetNamingStagingValidationSnapshot_(ss){

    const pos = getSheetNamingStagingSheet_(ss, "10_POS");
    const result = {};

    ["H3", "H4", "I11:I25", "B4", "E4", "B8"].forEach(function(a1){
        result["10_POS!" + a1] = pos.getRange(a1)
            .getDataValidations()
            .map(function(row){
                return row.map(serializeSheetNamingStagingValidation_);
            });
    });

    return result;

}

function captureSheetNamingStagingSnapshot_(ss){

    return {
        sheetNames : ss.getSheets().map(function(sheet){
            return sheet.getName();
        }),
        formulas : captureSheetNamingStagingFormulaSnapshot_(ss),
        validations : captureSheetNamingStagingValidationSnapshot_(ss)
    };

}

function findNewSheetNamingStagingRefErrors_(beforeFormulas, afterFormulas){

    const newRefErrors = [];

    Object.keys(afterFormulas).forEach(function(key){
        const before = JSON.stringify(beforeFormulas[key]);
        const after = JSON.stringify(afterFormulas[key]);

        if(after.indexOf("#REF!") >= 0 && before.indexOf("#REF!") < 0){
            newRefErrors.push({
                location : key,
                formula : afterFormulas[key]
            });
        }
    });

    return newRefErrors;

}

function summarizeSheetNamingStagingValidations_(validations){

    const summary = {};

    Object.keys(validations).forEach(function(key){
        const unique = {};

        validations[key].forEach(function(row){
            row.forEach(function(rule){
                const serialized = JSON.stringify(rule);
                unique[serialized] = true;
            });
        });

        summary[key] = Object.keys(unique).map(function(serialized){
            return JSON.parse(serialized);
        });
    });

    return summary;

}

function restoreSheetNamingStagingNames_(ss){

    SHEET_NAMING_STAGING_RENAMES.forEach(function(rename){
        const original = ss.getSheetByName(rename.original);
        const renamed = ss.getSheetByName(rename.renamed);

        if(renamed && !original){
            renamed.setName(rename.original);
            SpreadsheetApp.flush();
        }
        else if(renamed && original){
            throw new Error(
                "Rollback ambiguous: kedua nama ada untuk " + rename.original
            );
        }
    });

}

function runSheetNamingStagingRenameProofCli(){

    const ss = getSheetNamingStagingSpreadsheet_();
    const baseline = captureSheetNamingStagingSnapshot_(ss);
    const observations = [];
    let operationError = null;
    let rollbackError = null;
    let rollbackSnapshot = null;

    SHEET_NAMING_STAGING_RENAMES.forEach(function(rename){
        if(!ss.getSheetByName(rename.original)){
            throw new Error("Baseline original sheet tidak ada: " + rename.original);
        }

        if(ss.getSheetByName(rename.renamed)){
            throw new Error("Baseline renamed sheet sudah ada: " + rename.renamed);
        }
    });

    try{
        SHEET_NAMING_STAGING_RENAMES.forEach(function(rename){
            getSheetNamingStagingSheet_(ss, rename.original).setName(rename.renamed);
            SpreadsheetApp.flush();

            const snapshot = captureSheetNamingStagingSnapshot_(ss);

            observations.push({
                renamed : rename.original + " -> " + rename.renamed,
                formulas : snapshot.formulas,
                validations : snapshot.validations,
                newRefErrors : findNewSheetNamingStagingRefErrors_(
                    baseline.formulas,
                    snapshot.formulas
                )
            });
        });
    }
    catch(error){
        operationError = error;
    }
    finally{
        try{
            restoreSheetNamingStagingNames_(ss);
            SpreadsheetApp.flush();
            rollbackSnapshot = captureSheetNamingStagingSnapshot_(ss);
        }
        catch(error){
            rollbackError = error;
        }
    }

    if(operationError){
        if(rollbackError){
            operationError.message += " Rollback gagal: " +
                String(rollbackError.message || rollbackError);
        }

        throw operationError;
    }

    if(rollbackError){
        throw rollbackError;
    }

    const originalNamesRestored =
        JSON.stringify(baseline.sheetNames) ===
        JSON.stringify(rollbackSnapshot.sheetNames);

    if(!originalNamesRestored){
        throw new Error("Rollback tidak mengembalikan physical sheet-name list.");
    }

    return {
        success : true,
        stagingSpreadsheetId : ss.getId(),
        stagingSpreadsheetName : ss.getName(),
        formulaResults : {
            before : baseline.formulas,
            observations : observations,
            afterRollback : rollbackSnapshot.formulas
        },
        validationResults : {
            before : baseline.validations,
            observations : observations.map(function(observation){
                return {
                    renamed : observation.renamed,
                    validations : observation.validations
                };
            }),
            afterRollback : rollbackSnapshot.validations
        },
        newRefErrors : observations.reduce(function(all, observation){
            return all.concat(observation.newRefErrors);
        }, []),
        formulaResultsJson : JSON.stringify({
            before : baseline.formulas,
            observations : observations.map(function(observation){
                return {
                    renamed : observation.renamed,
                    formulas : observation.formulas
                };
            }),
            afterRollback : rollbackSnapshot.formulas
        }),
        validationResultsJson : JSON.stringify({
            before : summarizeSheetNamingStagingValidations_(baseline.validations),
            observations : observations.map(function(observation){
                return {
                    renamed : observation.renamed,
                    validations : summarizeSheetNamingStagingValidations_(
                        observation.validations
                    )
                };
            }),
            afterRollback : summarizeSheetNamingStagingValidations_(
                rollbackSnapshot.validations
            )
        }),
        rollbackSuccessful : true,
        originalNamesRestored : true
    };

}
