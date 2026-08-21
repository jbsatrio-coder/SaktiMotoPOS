/**
 * Read-only runtime audit untuk Sheet Naming Cleanup Phase 1B.
 * Tidak mengubah data, struktur spreadsheet, Properties, atau trigger.
 */

function getSheetNamingAuditExpected_(){

    return Object.keys(CONFIG.SHEET).map(
        function(key){

            return {
                key : key,
                name : CONFIG.SHEET[key]
            };

        }
    );

}

function getSheetNamingAuditSpreadsheet_(){

    return SpreadsheetApp.getActiveSpreadsheet();

}

function runSheetNamingAuditPhysicalInventoryCli(){

    const spreadsheet = getSheetNamingAuditSpreadsheet_();
    const expected = getSheetNamingAuditExpected_();
    const expectedByName = {};

    expected.forEach(function(item){
        expectedByName[item.name] = item.key;
    });

    const sheets = spreadsheet.getSheets().map(
        function(sheet){

            return {
                name : sheet.getName(),
                sheetId : sheet.getSheetId(),
                maxRows : sheet.getMaxRows(),
                maxColumns : sheet.getMaxColumns(),
                hidden : sheet.isSheetHidden(),
                frozenRows : sheet.getFrozenRows(),
                frozenColumns : sheet.getFrozenColumns(),
                configKey : expectedByName[sheet.getName()] || null,
                representedInConfig : !!expectedByName[sheet.getName()]
            };

        }
    );

    const physicalNames = sheets.map(function(sheet){ return sheet.name; });

    return {
        spreadsheetId : spreadsheet.getId(),
        sheetCount : sheets.length,
        sheets : sheets,
        missingConfiguredSheets : expected.filter(function(item){
            return physicalNames.indexOf(item.name) === -1;
        }),
        unexpectedSheets : sheets.filter(function(sheet){
            return !sheet.representedInConfig;
        })
    };

}

function getSheetNamingAuditSheet_(sheetName){

    const sheet = getSheetNamingAuditSpreadsheet_().getSheetByName(sheetName);

    if(!sheet){
        throw new Error("Sheet audit tidak ditemukan: " + sheetName);
    }

    return sheet;

}

function runSheetNamingAuditSheetPreviewCli(sheetName, rowCount, columnCount){

    const sheet = getSheetNamingAuditSheet_(sheetName);
    const rows = Math.min(Number(rowCount) || 3, sheet.getMaxRows());
    const columns = Math.min(Number(columnCount) || 26, sheet.getMaxColumns());

    return {
        sheet : sheet.getName(),
        range : sheet.getRange(1, 1, rows, columns).getA1Notation(),
        values : sheet.getRange(1, 1, rows, columns).getDisplayValues()
    };

}

function getSheetNamingAuditFormulaFlags_(formula){

    const markers = [
        "INDIRECT(",
        "IMPORTRANGE(",
        "QUERY(",
        "FILTER(",
        "ARRAYFORMULA("
    ];

    const flags = markers.filter(function(marker){
        return String(formula).toUpperCase().indexOf(marker) !== -1;
    });

    getSheetNamingAuditExpected_().forEach(function(item){
        if(String(formula).indexOf(item.name) !== -1){
            flags.push("SHEET:" + item.name);
        }
    });

    if(String(formula).indexOf("!") !== -1){
        flags.push("CROSS_SHEET_REFERENCE");
    }

    return flags;

}

function runSheetNamingAuditFormulaCli(sheetName){

    const sheet = getSheetNamingAuditSheet_(sheetName);
    const range = sheet.getDataRange();
    const formulas = range.getFormulas();
    const findings = [];

    for(let row = 0; row < formulas.length; row++){
        for(let column = 0; column < formulas[row].length; column++){
            const formula = formulas[row][column];

            if(!formula){
                continue;
            }

            findings.push({
                sourceSheet : sheet.getName(),
                cell : sheet.getRange(row + 1, column + 1).getA1Notation(),
                formula : formula,
                flags : getSheetNamingAuditFormulaFlags_(formula)
            });
        }
    }

    return {
        sheet : sheet.getName(),
        formulaCount : findings.length,
        findings : findings
    };

}

function runSheetNamingAuditAllFormulasCli(){

    return getSheetNamingAuditSpreadsheet_().getSheets().map(
        function(sheet){
            return runSheetNamingAuditFormulaCli(sheet.getName());
        }
    );

}

function runSheetNamingAuditFormulaDependenciesCli(){

    return getSheetNamingAuditSpreadsheet_().getSheets().map(
        function(sheet){
            const result = runSheetNamingAuditFormulaCli(sheet.getName());

            return {
                sheet : result.sheet,
                findings : result.findings.filter(function(finding){
                    return finding.flags.length > 0;
                })
            };
        }
    ).filter(function(result){
        return result.findings.length > 0;
    });

}

function serializeSheetNamingAuditValidationValue_(value){

    if(value && typeof value.getA1Notation === "function"){
        try{
            return {
                range : value.getSheet().getName() + "!" + value.getA1Notation()
            };
        }
        catch(error){
            return {
                rangeError : String(error.message || error)
            };
        }
    }

    if(value instanceof Date){
        return value.toISOString();
    }

    return value === undefined ? null : value;

}

function runSheetNamingAuditValidationCli(sheetName){

    const sheet = getSheetNamingAuditSheet_(sheetName);
    const range = sheet.getDataRange();
    const validations = range.getDataValidations();
    const findings = [];

    for(let row = 0; row < validations.length; row++){
        for(let column = 0; column < validations[row].length; column++){
            const rule = validations[row][column];

            if(!rule){
                continue;
            }

            try{
                findings.push({
                    sourceSheet : sheet.getName(),
                    cell : sheet.getRange(row + 1, column + 1).getA1Notation(),
                    criteriaType : String(rule.getCriteriaType()),
                    criteriaValues : rule.getCriteriaValues().map(
                        serializeSheetNamingAuditValidationValue_
                    ),
                    allowInvalid : rule.getAllowInvalid(),
                    helpText : rule.getHelpText() || ""
                });
            }
            catch(error){
                findings.push({
                    sourceSheet : sheet.getName(),
                    cell : "R" + (row + 1) + "C" + (column + 1),
                    inspectionError : String(error.message || error)
                });
            }
        }
    }

    return {
        sheet : sheet.getName(),
        validationCount : findings.length,
        findings : findings
    };

}

function runSheetNamingAuditCrossSheetValidationsCli(sheetName){

    const findings = [];
    const sheets = sheetName ? [getSheetNamingAuditSheet_(sheetName)] :
        getSheetNamingAuditSpreadsheet_().getSheets();

    sheets.forEach(
        function(sheet){

            const range = sheet.getDataRange();
            const validations = range.getDataValidations();

            for(let row = 0; row < validations.length; row++){
                for(let column = 0; column < validations[row].length; column++){
                    const rule = validations[row][column];

                    if(!rule){
                        continue;
                    }

                    try{
                        const criteriaValues = rule.getCriteriaValues();
                        const serializedValues = criteriaValues.map(
                            serializeSheetNamingAuditValidationValue_
                        );
                        const hasRangeReference = serializedValues.some(
                            function(value){
                                return value && (value.range || value.rangeError);
                            }
                        );

                        if(hasRangeReference){
                            findings.push({
                                sourceSheet : sheet.getName(),
                                cell : sheet.getRange(row + 1, column + 1).getA1Notation(),
                                criteriaType : String(rule.getCriteriaType()),
                                criteriaReferences : serializedValues.map(function(value){
                                    if(value && value.range){
                                        return value.range;
                                    }

                                    if(value && value.rangeError){
                                        return "ERROR: " + value.rangeError;
                                    }

                                    return value;
                                })
                            });
                        }
                    }
                    catch(error){
                        findings.push({
                            sourceSheet : sheet.getName(),
                            cell : "R" + (row + 1) + "C" + (column + 1),
                            inspectionError : String(error.message || error)
                        });
                    }
                }
            }
        }
    );

    return findings;

}

function runSheetNamingAuditNamedRangesCli(){

    return getSheetNamingAuditSpreadsheet_().getNamedRanges().map(
        function(namedRange){

            const range = namedRange.getRange();

            return {
                name : namedRange.getName(),
                sheet : range.getSheet().getName(),
                range : range.getA1Notation()
            };

        }
    );

}

function runSheetNamingAuditVisualAndProtectionCli(sheetName){

    const sheets = sheetName ? [getSheetNamingAuditSheet_(sheetName)] :
        getSheetNamingAuditSpreadsheet_().getSheets();

    return sheets.map(
        function(sheet){

            const charts = sheet.getCharts().map(function(chart){
                return {
                    ranges : chart.getRanges().map(function(range){
                        return range.getSheet().getName() + "!" + range.getA1Notation();
                    })
                };
            });

            const protections = sheet.getProtections(
                SpreadsheetApp.ProtectionType.SHEET
            ).concat(
                sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
            ).map(function(protection){
                const range = protection.getRange();
                return {
                    type : String(protection.getProtectionType()),
                    range : range ? range.getA1Notation() : null,
                    description : protection.getDescription() || "",
                    warningOnly : protection.isWarningOnly()
                };
            });

            let pivots = [];
            let slicers = [];

            if(typeof sheet.getPivotTables === "function"){
                try{
                    pivots = sheet.getPivotTables().map(function(pivot){
                        const source = pivot.getSourceDataRange();
                        return {
                            sourceRange : source.getSheet().getName() + "!" + source.getA1Notation()
                        };
                    });
                }
                catch(error){
                    pivots = [{ inspectionError : String(error.message || error) }];
                }
            }

            if(typeof sheet.getSlicers === "function"){
                try{
                    slicers = sheet.getSlicers().map(function(slicer){
                        const range = slicer.getRange();
                        return {
                            anchorRange : range.getSheet().getName() + "!" + range.getA1Notation()
                        };
                    });
                }
                catch(error){
                    slicers = [{ inspectionError : String(error.message || error) }];
                }
            }

            return {
                sheet : sheet.getName(),
                charts : charts,
                pivots : pivots,
                slicers : slicers,
                protections : protections,
                hasBasicFilter : !!sheet.getFilter(),
                pivotTableApiAvailable : typeof sheet.getPivotTables === "function",
                slicerApiAvailable : typeof sheet.getSlicers === "function"
            };

        }
    );

}

function runSheetNamingAuditTriggersCli(){

    return ScriptApp.getProjectTriggers().map(function(trigger){
        return {
            handler : trigger.getHandlerFunction(),
            eventType : String(trigger.getEventType()),
            source : String(trigger.getTriggerSource()),
            triggerUid : trigger.getUniqueId()
        };
    });

}
