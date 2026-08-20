/**
 * ============================================
 * Customer Vehicle Service Test
 * ============================================
 */

function testCreateCustomerWithVehicle(){

    const testStamp = Date.now();

    const result =
        CustomerVehicleService
            .createCustomerWithVehicle({

                nama :
                    "TEST CUSTOMER " + testStamp,

                noHP :
                    "08" + String(testStamp).slice(-10),

                alamat :
                    "Legoso",

                noPolisi :
                    "B" + String(testStamp).slice(-4) + "TEST",

                merk :
                    "Honda",

                model :
                    "Beat",

                tahun :
                    "",

                warna :
                    ""

            });

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function testCreateCustomerWithDuplicatePlate(){

    try {

        const result =
            CustomerVehicleService
                .createCustomerWithVehicle({

                    nama :
                        "TEST DUPLICATE",

                    noHP :
                        "",

                    alamat :
                        "TEST DUPLICATE",

                    noPolisi :
                        "B9999CV",

                    merk :
                        "Yamaha",

                    model :
                        "NMAX"

                });

        Logger.log(
            "UNEXPECTED SUCCESS:"
        );

        Logger.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );

    } catch(error){

        Logger.log(
            "EXPECTED ERROR:"
        );

        Logger.log(
            error.message ||
            error
        );

    }

}

function inspectCustomerVehicleSheets(){

    const ss =
        SpreadsheetApp.getActiveSpreadsheet();

    const customerSheet =
        ss.getSheetByName("06_MasterPelanggan");

    const vehicleSheet =
        ss.getSheetByName("07_MasterKendaraan");


    Logger.log(
        "===== 06_MasterPelanggan ====="
    );

    Logger.log(
        JSON.stringify(
            customerSheet
                .getRange(
                    1,
                    1,
                    Math.min(
                        customerSheet.getLastRow(),
                        3
                    ),
                    customerSheet.getLastColumn()
                )
                .getDisplayValues(),
            null,
            2
        )
    );


    Logger.log(
        "===== 07_MasterKendaraan ====="
    );

    Logger.log(
        JSON.stringify(
            vehicleSheet
                .getRange(
                    1,
                    1,
                    Math.min(
                        vehicleSheet.getLastRow(),
                        3
                    ),
                    vehicleSheet.getLastColumn()
                )
                .getDisplayValues(),
            null,
            2
        )
    );

}
function auditLegacyCustomerVehicleData(){

    const ss =
        SpreadsheetApp.getActiveSpreadsheet();

    const customerSheet =
        ss.getSheetByName("06_MasterPelanggan");

    const vehicleSheet =
        ss.getSheetByName("07_MasterKendaraan");


    /*
     * ========================================
     * CUSTOMER
     * ========================================
     */

    const customerData =
        customerSheet
            .getDataRange()
            .getDisplayValues();

    const customers =
        customerData.slice(1);


    const customerIds = {};

    let customerWithoutId = 0;
    let customerDuplicateId = 0;


    customers.forEach(function(row){

        const id =
            String(row[0] || "").trim();

        if(!id){

            customerWithoutId++;

            return;

        }

        if(customerIds[id]){

            customerDuplicateId++;

        }

        customerIds[id] = true;

    });


    /*
     * ========================================
     * VEHICLE
     * ========================================
     */

    const vehicleData =
        vehicleSheet
            .getDataRange()
            .getDisplayValues();

    const vehicles =
        vehicleData.slice(1);


    const vehicleIds = {};
    const plates = {};

    let vehicleWithoutId = 0;
    let vehicleWithoutCustomer = 0;
    let vehicleInvalidCustomer = 0;
    let vehicleDuplicateId = 0;
    let vehicleDuplicatePlate = 0;


    vehicles.forEach(function(row){

        const vehicleId =
            String(row[0] || "").trim();

        const customerId =
            String(row[1] || "").trim();

        const plate =
            String(row[2] || "")
                .trim()
                .replace(/\s+/g, "")
                .toUpperCase();


        /*
         * Vehicle ID
         */

        if(!vehicleId){

            vehicleWithoutId++;

        } else {

            if(vehicleIds[vehicleId]){

                vehicleDuplicateId++;

            }

            vehicleIds[vehicleId] = true;

        }


        /*
         * Customer ID
         */

        if(!customerId){

            vehicleWithoutCustomer++;

        } else if(!customerIds[customerId]){

            vehicleInvalidCustomer++;

        }


        /*
         * Plate
         */

        if(plate){

            if(plates[plate]){

                vehicleDuplicatePlate++;

            }

            plates[plate] = true;

        }

    });


    /*
     * ========================================
     * SUMMARY
     * ========================================
     */

    const result = {

        customer: {

            total :
                customers.length,

            withoutId :
                customerWithoutId,

            duplicateId :
                customerDuplicateId

        },

        vehicle: {

            total :
                vehicles.length,

            withoutId :
                vehicleWithoutId,

            withoutCustomerId :
                vehicleWithoutCustomer,

            invalidCustomerId :
                vehicleInvalidCustomer,

            duplicateId :
                vehicleDuplicateId,

            duplicatePlate :
                vehicleDuplicatePlate

        }

    };


    Logger.log(
        "===== LEGACY DATA AUDIT ====="
    );

    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function auditLegacyDetail(){

    const ss =
        SpreadsheetApp.getActiveSpreadsheet();

    const customerSheet =
        ss.getSheetByName("06_MasterPelanggan");

    const vehicleSheet =
        ss.getSheetByName("07_MasterKendaraan");


    /*
     * ========================================
     * CUSTOMER DETAIL
     * ========================================
     */

    const customerData =
        customerSheet
            .getDataRange()
            .getDisplayValues();

    const customers =
        customerData.slice(1);

    Logger.log(
        "===== CUSTOMER WITHOUT ID ====="
    );

    customers.forEach(function(row, index){

        const id =
            String(row[0] || "").trim();

        if(!id){

            Logger.log(
                JSON.stringify({

                    row :
                        index + 2,

                    nama :
                        row[1],

                    noHP :
                        row[2],

                    alamat :
                        row[3],

                    status :
                        row[6]

                })
            );

        }

    });


    /*
     * ========================================
     * VEHICLE DETAIL
     * ========================================
     */

    const vehicleData =
        vehicleSheet
            .getDataRange()
            .getDisplayValues();

    const vehicles =
        vehicleData.slice(1);


    Logger.log(
        "===== VEHICLE WITHOUT ID / CUSTOMER ====="
    );

    vehicles.forEach(function(row, index){

        const vehicleId =
            String(row[0] || "").trim();

        const customerId =
            String(row[1] || "").trim();

        if(
            !vehicleId ||
            !customerId
        ){

            Logger.log(
                JSON.stringify({

                    row :
                        index + 2,

                    vehicleId :
                        vehicleId,

                    customerId :
                        customerId,

                    plat :
                        row[2],

                    merk :
                        row[3],

                    model :
                        row[4],

                    tahun :
                        row[5],

                    warna :
                        row[6],

                    kilometer :
                        row[9],

                    status :
                        row[10]

                })
            );

        }

    });


    /*
     * ========================================
     * DUPLICATE PLATE DETAIL
     * ========================================
     */

    const plateMap = {};


    vehicles.forEach(function(row, index){

        const plate =
            String(row[2] || "")
                .trim()
                .replace(/\s+/g, "")
                .toUpperCase();

        if(!plate){

            return;

        }

        if(!plateMap[plate]){

            plateMap[plate] = [];

        }

        plateMap[plate].push({

            row :
                index + 2,

            vehicleId :
                row[0],

            customerId :
                row[1],

            plat :
                row[2],

            merk :
                row[3],

            model :
                row[4],

            tahun :
                row[5],

            warna :
                row[6]

        });

    });


    Logger.log(
        "===== DUPLICATE PLATE ====="
    );


    Object.keys(plateMap).forEach(function(plate){

        if(
            plateMap[plate].length > 1
        ){

            Logger.log(
                JSON.stringify({

                    plate :
                        plate,

                    records :
                        plateMap[plate]

                })
            );

        }

    });

}

function resetMasterKendaraanForDevelopment(){

    const ss =
        SpreadsheetApp.getActiveSpreadsheet();

    const sh =
        ss.getSheetByName(
            "07_MasterKendaraan"
        );

    if(!sh){

        throw new Error(
            "Sheet 07_MasterKendaraan tidak ditemukan."
        );

    }


    /*
     * ========================================
     * HEADER YANG HARUS DIPERTAHANKAN
     * ========================================
     */

    const expectedHeaders = [

        "IDKendaraan",
        "IDPelanggan",
        "No Polisi",
        "Merk",
        "Model",
        "Tahun",
        "Warna",
        "NoMesin",
        "NoRangka",
        "KilometerTerakhir",
        "Status",
        "Catatan",
        "CreatedAt",
        "UpdatedAt"

    ];


    /*
     * ========================================
     * VALIDASI HEADER
     * ========================================
     */

    const actualHeaders =
        sh
            .getRange(
                1,
                1,
                1,
                expectedHeaders.length
            )
            .getDisplayValues()[0];


    const headerValid =
        expectedHeaders.every(
            function(header, index){

                return header ===
                    actualHeaders[index];

            }
        );


    if(!headerValid){

        throw new Error(

            "RESET DIBATALKAN. " +
            "Header 07_MasterKendaraan " +
            "tidak sesuai struktur canonical."

        );

    }


    /*
     * ========================================
     * HAPUS DATA DI BAWAH HEADER
     * ========================================
     */

    const lastRow =
        sh.getLastRow();


    if(lastRow >= 2){

        sh
            .getRange(
                2,
                1,
                lastRow - 1,
                expectedHeaders.length
            )
            .clearContent();

    }


    SpreadsheetApp.flush();


    Logger.log(
        "07_MasterKendaraan berhasil di-reset."
    );

    Logger.log(
        "Header dipertahankan."
    );

    Logger.log(
        "Jumlah data tersisa: " +
        Math.max(
            sh.getLastRow() - 1,
            0
        )
    );

}

function resetMasterPelangganForDevelopment(){

    const ss =
        SpreadsheetApp.getActiveSpreadsheet();

    const sh =
        ss.getSheetByName(
            "06_MasterPelanggan"
        );

    if(!sh){

        throw new Error(
            "Sheet 06_MasterPelanggan tidak ditemukan."
        );

    }


    /*
     * ========================================
     * HEADER CANONICAL
     * ========================================
     */

    const expectedHeaders = [

        "IDPelanggan",
        "Nama",
        "NoHP",
        "Alamat",
        "Tanggal Lahir",
        "Jenis Kelamin",
        "Status",
        "Catatan",
        "CreatedAt",
        "UpdatedAt"

    ];


    /*
     * ========================================
     * VALIDASI HEADER
     * ========================================
     */

    const actualHeaders =
        sh
            .getRange(
                1,
                1,
                1,
                expectedHeaders.length
            )
            .getDisplayValues()[0];


    const headerValid =
        expectedHeaders.every(
            function(header, index){

                return header ===
                    actualHeaders[index];

            }
        );


    if(!headerValid){

        throw new Error(

            "RESET DIBATALKAN. " +
            "Header 06_MasterPelanggan " +
            "tidak sesuai struktur canonical."

        );

    }


    /*
     * ========================================
     * HAPUS DATA DI BAWAH HEADER
     * ========================================
     */

    const lastRow =
        sh.getLastRow();


    if(lastRow >= 2){

        sh
            .getRange(
                2,
                1,
                lastRow - 1,
                expectedHeaders.length
            )
            .clearContent();

    }


    SpreadsheetApp.flush();


    Logger.log(
        "06_MasterPelanggan berhasil di-reset."
    );

    Logger.log(
        "Header dipertahankan."
    );

    Logger.log(
        "Jumlah data tersisa: " +
        Math.max(
            sh.getLastRow() - 1,
            0
        )
    );

}

function testCreateCustomerWithVehicleEndpoint(){

    const result =
        createCustomerWithVehicle({

            nama :
                "TEST FORM ENDPOINT",

            noHP :
                "081234567891",

            alamat :
                "Legoso",

            tanggalLahir :
                "",

            plat :
                "B5678FORM",

            merk :
                "Yamaha",

            model :
                "NMAX",

            tahun :
                "",

            warna :
                ""

        });


    Logger.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

}

function verifyLatestUITestRecord(){

    const ss =
        SpreadsheetApp.getActiveSpreadsheet();


    const customerSheet =
        ss.getSheetByName(
            "06_MasterPelanggan"
        );

    const vehicleSheet =
        ss.getSheetByName(
            "07_MasterKendaraan"
        );


    Logger.log(
        "===== DIRECT UI TEST VERIFICATION ====="
    );


    /*
     * ========================================
     * CUSTOMER
     * ========================================
     */

    const customerData =
        customerSheet
            .getDataRange()
            .getDisplayValues();


    for(let i = 1; i < customerData.length; i++){

        const row =
            customerData[i];

        if(
            String(row[0]).trim() ===
            "CUS2608160004"
        ){

            Logger.log(
                "CUSTOMER FOUND:"
            );

            Logger.log(
                JSON.stringify(
                    row,
                    null,
                    2
                )
            );

        }

    }


    /*
     * ========================================
     * VEHICLE
     * ========================================
     */

    const vehicleData =
        vehicleSheet
            .getDataRange()
            .getDisplayValues();


    for(let i = 1; i < vehicleData.length; i++){

        const row =
            vehicleData[i];

        if(
            String(row[0]).trim() ===
            "VEH2608160004"
        ){

            Logger.log(
                "VEHICLE FOUND:"
            );

            Logger.log(
                JSON.stringify(
                    row,
                    null,
                    2
                )
            );

        }

    }

}

function testSearchKendaraanV2() {

  Logger.log(
    "===== SEARCH KENDARAAN V2 ====="
  );

  const hasil =
    searchKendaraan("BTESTV2001");

  Logger.log(
    JSON.stringify(
      hasil,
      null,
      2
    )
  );

}