function testMasterModelStructure(){

    const sheet =
        getSheet(
            CONFIG.SHEET.MODEL
        );

    Logger.log(
        "===== MASTER MODEL STRUCTURE ====="
    );

    Logger.log(
        "Sheet: " +
        sheet.getName()
    );

    Logger.log(
        "Last Column: " +
        sheet.getLastColumn()
    );

    Logger.log(
        "Last Row: " +
        sheet.getLastRow()
    );

    const headers =
        sheet
            .getRange(
                1,
                1,
                1,
                sheet.getLastColumn()
            )
            .getValues()[0];

    Logger.log(
        JSON.stringify(
            headers,
            null,
            2
        )
    );

}
function testGenerateModelId(){

    Logger.log(
        generateModelId_()
    );

}


function testModelDocument(){

    const document =
        ModelDocument.create({

            id:
                "MOD999999",

            merkId:
                "MRK000001",

            nama:
                "TEST MODEL",

            status:
                "AKTIF"

        });

    Logger.log(
        "===== MODEL DOCUMENT ====="
    );

    Logger.log(
        JSON.stringify(
            document,
            null,
            2
        )
    );

}


function testModelValidator(){

    const document =
        ModelDocument.create({

            id:
                "MOD999999",

            merkId:
                "MRK000001",

            nama:
                "TEST MODEL",

            status:
                "AKTIF"

        });

    const result =
        ModelValidator.validateCreate(
            document
        );

    Logger.log(
        "===== MODEL VALIDATOR ====="
    );

    Logger.log(
        "VALIDASI : " +
        result
    );

    Logger.log(
        JSON.stringify(
            document,
            null,
            2
        )
    );

}

function testModelRepository(){

    const sheet =
        ModelRepository.sheet();

    Logger.log(
        "===== MASTER MODEL REPOSITORY ====="
    );

    Logger.log(
        "Sheet: " +
        sheet.getName()
    );

    Logger.log(
        "Last Column: " +
        sheet.getLastColumn()
    );

    Logger.log(
        "Last Row: " +
        sheet.getLastRow()
    );

    Logger.log(
        "FIND ALL:"
    );

    Logger.log(
        JSON.stringify(
            ModelRepository.findAll(),
            null,
            2
        )
    );

}

function testModelRepositorySave(){

    const document =
        ModelDocument.create({

            id:
                "MOD999999",

            merkId:
                "MRK000001",

            nama:
                "TEST MODEL",

            status:
                "AKTIF"

        });


    ModelValidator.validateCreate(
        document
    );


    const result =
        ModelRepository.save(
            document.model
        );


    Logger.log(
        "===== MODEL REPOSITORY SAVE ====="
    );


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testModelFindById(){

    const result =
        ModelRepository.findById(
            "MOD999999"
        );

    Logger.log(
        "===== MODEL FIND BY ID ====="
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}


function testModelDuplicateMerkNama(){

    try {

        ModelRepository.save({

            id:
                "MOD999998",

            merkId:
                "MRK000001",

            nama:
                "TEST MODEL",

            status:
                "AKTIF"

        });

        Logger.log(
            "ERROR: duplicate model tidak tertolak."
        );

    } catch(error) {

        Logger.log(
            "===== DUPLICATE MODEL TEST ====="
        );

        Logger.log(
            error.message
        );

    }

}

function testModelServiceCreate(){

    const result =
        ModelService.create({

            merkId:
                "MRK000001",

            nama:
                "TEST MODEL SERVICE",

            status:
                "AKTIF"

        });

    Logger.log(
        "===== MODEL SERVICE CREATE ====="
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function cleanupModelTestData(){

    const sheet =
        ModelRepository.sheet();

    const lastRow =
        sheet.getLastRow();

    let deleted = 0;

    if(lastRow < 2){

        Logger.log(
            "===== MODEL TEST CLEANUP ====="
        );

        Logger.log(
            "Tidak ada data test."
        );

        return;

    }

    const data =
        sheet
            .getRange(
                2,
                1,
                lastRow - 1,
                COL_MODEL.TOTAL
            )
            .getValues();


    data.forEach(function(row, index){

        const modelId =
            String(
                row[COL_MODEL.ID] || ""
            ).trim();

        const nama =
            String(
                row[COL_MODEL.NAMA] || ""
            ).trim();


        if(
            modelId &&
            nama.startsWith("TEST ")
        ){

            const rowNumber =
                index + 2;

            sheet
                .getRange(
                    rowNumber,
                    1,
                    1,
                    COL_MODEL.TOTAL
                )
                .clearContent();


            Logger.log(
                "[DELETE TEST] " +
                modelId +
                " | " +
                nama +
                " | Row: " +
                rowNumber
            );

            deleted++;

        }

    });


    Logger.log(
        "===== MODEL TEST CLEANUP ====="
    );

    Logger.log(
        "Data test dihapus : " +
        deleted
    );

}


function testMasterModelSeedAudit(){

    const merks =
        MerkRepository.findAll();

    const models =
        ModelRepository.findAll();

    Logger.log(
        "===== MASTER MODEL SEED AUDIT ====="
    );

    Logger.log(
        "TOTAL MERK  : " +
        merks.length
    );

    Logger.log(
        "TOTAL MODEL : " +
        models.length
    );


    const merkMap = {};

    merks.forEach(function(merk){

        merkMap[
            String(merk.id)
        ] = merk.nama;

    });


    let invalidMerk = 0;
    let emptyModel = 0;

    const duplicateMap = {};
    let duplicates = 0;


    models.forEach(function(model){

        if(
            !model.merkId ||
            !merkMap[
                String(model.merkId)
            ]
        ){

            invalidMerk++;

            Logger.log(
                "[INVALID MERK] " +
                JSON.stringify(model)
            );

        }


        if(
            !String(model.nama || "").trim()
        ){

            emptyModel++;

            Logger.log(
                "[EMPTY MODEL] " +
                JSON.stringify(model)
            );

        }


        const key =
            String(model.merkId)
            .trim()
            .toLowerCase()
            +
            "|"
            +
            String(model.nama || "")
            .trim()
            .toLowerCase();


        if(duplicateMap[key]){

            duplicates++;

            Logger.log(
                "[DUPLICATE MODEL] " +
                key
            );

        }


        duplicateMap[key] = true;

    });


    Logger.log(
        "INVALID MERK : " +
        invalidMerk
    );

    Logger.log(
        "EMPTY MODEL   : " +
        emptyModel
    );

    Logger.log(
        "DUPLICATE     : " +
        duplicates
    );


    Logger.log(
        "===== AUDIT SELESAI ====="
    );

}

function testModelByHonda(){

    Logger.log(
        "===== TEST MODEL BY HONDA ====="
    );

    const merks =
        MerkRepository.findAll();

    const honda =
        merks.find(function(merk){

            return String(
                merk.nama || ""
            )
            .trim()
            .toUpperCase() === "HONDA";

        });

    if(!honda){

        throw new Error(
            "Honda tidak ditemukan di Master Merk."
        );

    }

    Logger.log(
        "HONDA = " +
        JSON.stringify(honda)
    );

    const allModels =
        ModelRepository.findAll();

    Logger.log(
        "TOTAL MODEL = " +
        allModels.length
    );

    const hondaModels =
        allModels.filter(function(model){

            return String(
                model.merkId || ""
            ).trim() ===
            String(
                honda.id || ""
            ).trim();

        });

    Logger.log(
        "MODEL HONDA = " +
        JSON.stringify(
            hondaModels,
            null,
            2
        )
    );

    Logger.log(
        "SERVICE RESULT = " +
        JSON.stringify(
            ModelService.getByMerkId(
                honda.id
            ),
            null,
            2
        )
    );

}

function testGetMasterModelKendaraanHonda(){

    Logger.log(
        "===== TEST GET MASTER MODEL KENDARAAN ====="
    );

    const result =
        getMasterModelKendaraan(
            "MRK000001"
        );

    Logger.log(
        "RESULT COUNT = " +
        result.length
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testMasterModelSerialization(){

    Logger.log(
        "===== TEST MODEL SERIALIZATION ====="
    );

    const result =
        getMasterModelKendaraan(
            "MRK000001"
        );

    try {

        const json =
            JSON.stringify(result);

        Logger.log(
            "SERIALIZATION OK"
        );

        Logger.log(
            json.substring(
                0,
                1000
            )
        );

    } catch(error){

        Logger.log(
            "SERIALIZATION FAILED"
        );

        Logger.log(
            error.message || error
        );

        throw error;

    }

}

function testGetMasterModelKendaraanSafe(){

    Logger.log(
        "===== TEST MASTER MODEL HTML API ====="
    );

    const result =
        getMasterModelKendaraan(
            "MRK000001"
        );

    Logger.log(
        "COUNT = " +
        result.length
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

    if(!result.length){

        throw new Error(
            "Model Honda tidak ditemukan."
        );

    }

    const first =
        result[0];

    if(first.createdAt !== undefined){

        throw new Error(
            "createdAt masih ikut dikirim."
        );

    }

    if(first.updatedAt !== undefined){

        throw new Error(
            "updatedAt masih ikut dikirim."
        );

    }

    Logger.log(
        "SAFE HTML API = OK"
    );

}
