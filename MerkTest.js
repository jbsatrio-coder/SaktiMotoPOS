function testGenerateMerkId(){

    Logger.log(
        generateMerkId_()
    );

}

function testMerkDocument(){

    const document =
        MerkDocument.create({

            id:
                "MRK999999",

            nama:
                "Honda"

        });

    Logger.log(
        "===== MERK DOCUMENT ====="
    );

    Logger.log(
        JSON.stringify(
            document,
            null,
            2
        )
    );

}

function testMerkValidator(){

    const document =
        MerkDocument.create({

            id:
                "MRK999999",

            nama:
                "Honda"

        });


    const result =
        MerkValidator.validateCreate(
            document
        );


    Logger.log(
        "===== MERK VALIDATOR ====="
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

function testMerkRepository(){

    const sheet =
        MerkRepository.sheet();

    Logger.log(
        "===== MASTER MERK REPOSITORY ====="
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
            MerkRepository.findAll(),
            null,
            2
        )
    );

}

function testMerkRepositorySave(){

    const document =
        MerkDocument.create({

            id:
                "MRK999999",

            nama:
                "TEST MERK"

        });


    MerkValidator.validateCreate(
        document
    );


    const result =
        MerkRepository.save(
            document.merk
        );


    Logger.log(
        "===== MERK REPOSITORY SAVE ====="
    );


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testMerkFindById(){

    const result =
        MerkRepository.findById(
            "MRK999999"
        );

    Logger.log(
        "===== MERK FIND BY ID ====="
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testMerkDuplicateNama(){

    try {

        MerkRepository.save({

            id:
                "MRK999998",

            nama:
                "TEST MERK"

        });

        Logger.log(
            "ERROR: duplicate nama tidak tertolak."
        );

    } catch(error) {

        Logger.log(
            "===== DUPLICATE NAMA TEST ====="
        );

        Logger.log(
            error.message
        );

    }

}

function testMerkServiceCreate(){

    const result =
        MerkService.create({

            nama:
                "TEST MERK SERVICE"

        });


    Logger.log(
        "===== MERK SERVICE CREATE ====="
    );


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function cleanupMerkTestData(){

    const sheet =
        MerkRepository.sheet();

    const lastRow =
        sheet.getLastRow();

    if(lastRow < 2){

        Logger.log(
            "Tidak ada data untuk dibersihkan."
        );

        return;

    }


    const data =
        sheet
            .getRange(
                2,
                1,
                lastRow - 1,
                COL_MERK.TOTAL
            )
            .getValues();


    let deleted = 0;


    data.forEach(function(row, index){

        const rowNumber =
            index + 2;

        const id =
            String(
                row[COL_MERK.ID] || ""
            ).trim();

        const nama =
            String(
                row[COL_MERK.NAMA] || ""
            ).trim();


        if(
            id === "MRK999999" ||
            id === "MRK1000000" ||
            nama === "TEST MERK" ||
            nama === "TEST MERK SERVICE"
        ){

            sheet
                .getRange(
                    rowNumber,
                    1,
                    1,
                    COL_MERK.TOTAL
                )
                .clearContent();

            Logger.log(
                "[DELETE TEST] " +
                id +
                " | " +
                nama +
                " | Row: " +
                rowNumber
            );

            deleted++;

        }

    });


    Logger.log(
        "===== MERK TEST CLEANUP ====="
    );

    Logger.log(
        "Data test dihapus : " +
        deleted
    );

}

function testGenerateMerkId(){

    const id =
        generateMerkId_();

    Logger.log(
        id
    );

}

function testMasterKendaraanStructure() {

  const sheet =
    getSheet(CONFIG.SHEET.VEHICLE);

  Logger.log(
    "===== MASTER KENDARAAN STRUCTURE ====="
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

function testMasterKendaraanSample(){

  const sheet =
    getSheet(CONFIG.SHEET.VEHICLE);

  Logger.log(
    "===== SAMPLE MASTER KENDARAAN ====="
  );

  const lastRow =
    sheet.getLastRow();

  if(lastRow < 2){

    Logger.log("Tidak ada data.");

    return;

  }

  const data =
    sheet
      .getRange(
        2,
        1,
        lastRow - 1,
        sheet.getLastColumn()
      )
      .getValues();

  data.forEach(function(row, index){

    Logger.log(
      "ROW " +
      (index + 2) +
      " | Merk: " +
      row[3] +
      " | Model: " +
      row[4] +
      " | Tahun: " +
      row[5]
    );

  });

} 