/**
 * ============================================
 * MASTER MERK + MASTER MODEL SEED V1
 * SAKTI MOTO POS
 *
 * Seed operasional bengkel:
 * - 8 merek utama
 * - Model umum + beberapa model historis
 * - Aman dijalankan ulang
 * - Tidak membuat duplicate
 * ============================================
 */

const MASTER_MERK_MODEL_SEED_V1 = {

    Honda: [

        "Beat",
        "Beat Street",
        "Scoopy",
        "Genio",

        "Vario 110",
        "Vario",
        "Vario 125",
        "Vario 150",
        "Vario 160",

        "PCX 150",
        "PCX 160",

        "ADV 150",
        "ADV 160",

        "Revo",
        "Supra X 125",
        "Supra GTR 150",
        "Sonic 150R",

        "CB150R",
        "CB150X",
        "CBR150R",
        "CBR250RR",
        "CRF150L",

        "CT125",
        "Forza 250"

    ],


    Yamaha: [

        "Mio",
        "Mio M3",
        "Mio Sporty",
        "Mio Soul",
        "Mio Soul GT",

        "Fino",
        "X-Ride",
        "Gear 125",
        "Gear Ultima",
        "FreeGo 125",

        "Fazzio",
        "Grand Filano",

        "NMAX",
        "NMAX 155",
        "Aerox",
        "Aerox 155",
        "Aerox Alpha",
        "Lexi",
        "Lexi LX 155",
        "XMAX",

        "Jupiter Z",
        "Jupiter MX",
        "Vega",

        "Vixion",
        "R15",
        "R25",
        "MT-15",
        "MT-25",

        "Scorpio",
        "RX-King",
        "WR155R"

    ],


    Suzuki: [

        "NEX",
        "NEX II",
        "NEX Crossover",
        "Address",
        "Address FI",
        "Access 125",

        "Smash",
        "Shogun",
        "Satria F150",
        "Satria Pro",

        "GSX-R150",
        "GSX-S150",

        "Burgman Street",
        "Burgman Street 125EX",

        "Avenis 125",
        "V-Strom 250 SX",
        "Gixxer SF 250"

    ],


    Kawasaki: [

        "Ninja 150",
        "Ninja 250",
        "Ninja 250 FI",
        "Ninja ZX-25R",
        "Ninja 650",

        "Z250",
        "Z650",

        "KLX150",
        "KLX230",
        "D-Tracker 150",

        "W175",
        "Versys-X 250",
        "Vulcan S"

    ],


    Vespa: [

        "Super 150 Classic",
        "Sprint 150 Classic",
        "Primavera Classic",

        "PX",
        "Excel",
        "PS",

        "LX 125",
        "S 125",
        "Primavera 150",
        "Sprint 150",
        "Sprint S 150",

        "GTS 150",
        "GTS Super",
        "GTS Super Sport",
        "GTV"

    ],


    Piaggio: [

        "Liberty",
        "Medley",
        "MP3",
        "Beverly"

    ],


    TVS: [

        "Dazz",
        "Callisto 110",
        "Callisto 125",
        "Ntorq 125",
        "Ntorq 125 XP",
        "iQube",
        "Ronin",
        "Max 125",
        "XL100",
        "Neo XR"

    ],


    Bajaj: [

        "Pulsar 125",
        "Pulsar 150",
        "Pulsar 180",
        "Pulsar 220F",

        "Pulsar NS125",
        "Pulsar NS160",
        "Pulsar NS200",
        "Pulsar NS400",

        "Pulsar RS200",

        "Dominar 250",
        "Dominar 400",

        "Avenger 160",
        "Avenger 220",

        "Platina 100",
        "Platina 110",

        "CT110X"

    ]

};


/**
 * ============================================
 * NORMALIZE
 * ============================================
 */

function normalizeSeedName_(value){

    return String(
        value || ""
    )
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

}


/**
 * ============================================
 * SEED MASTER MERK
 * ============================================
 */

function seedMasterMerkV1_(){

    const existing =
        MerkRepository.findAll();

    const map = {};

    existing.forEach(function(merk){

        const key =
            normalizeSeedName_(
                merk.nama
            );

        if(key){

            map[key] =
                merk.id;

        }

    });


    let created = 0;
    let skipped = 0;


    Object.keys(
        MASTER_MERK_MODEL_SEED_V1
    )
    .forEach(function(namaMerk){

        const key =
            normalizeSeedName_(
                namaMerk
            );


        if(map[key]){

            skipped++;

            Logger.log(
                "[MERK SKIP] " +
                namaMerk +
                " | " +
                map[key]
            );

            return;

        }


        const result =
            MerkService.create({

                nama:
                    namaMerk,

                status:
                    "AKTIF"

            });


        map[key] =
            result.id;


        created++;


        Logger.log(
            "[MERK CREATE] " +
            result.id +
            " | " +
            namaMerk
        );

    });


    Logger.log(
        "===== SEED MASTER MERK ====="
    );

    Logger.log(
        "Merk dibuat  : " +
        created
    );

    Logger.log(
        "Merk dilewati: " +
        skipped
    );


    return map;

}


/**
 * ============================================
 * SEED MASTER MODEL
 * ============================================
 */

function seedMasterModelV1_(
    merkMap
){

    let created = 0;
    let skipped = 0;


    Object.keys(
        MASTER_MERK_MODEL_SEED_V1
    )
    .forEach(function(namaMerk){

        const merkId =
            merkMap[
                normalizeSeedName_(
                    namaMerk
                )
            ];


        if(!merkId){

            throw new Error(
                "MerkID tidak ditemukan untuk : " +
                namaMerk
            );

        }


        const models =
            MASTER_MERK_MODEL_SEED_V1[
                namaMerk
            ];


        models.forEach(function(namaModel){

            const duplicate =
                ModelRepository.existsByMerkAndNama(
                    merkId,
                    namaModel
                );


            if(duplicate){

                skipped++;

                Logger.log(
                    "[MODEL SKIP] " +
                    namaMerk +
                    " | " +
                    namaModel
                );

                return;

            }


            const result =
                ModelService.create({

                    merkId:
                        merkId,

                    nama:
                        namaModel,

                    status:
                        "AKTIF"

                });


            created++;


            Logger.log(
                "[MODEL CREATE] " +
                result.id +
                " | " +
                namaMerk +
                " | " +
                namaModel
            );

        });

    });


    Logger.log(
        "===== SEED MASTER MODEL ====="
    );

    Logger.log(
        "Model dibuat  : " +
        created
    );

    Logger.log(
        "Model dilewati: " +
        skipped
    );

}


/**
 * ============================================
 * MAIN SEED
 * ============================================
 */

function seedMasterMerkModelV1(){

    Logger.log(
        "================================"
    );

    Logger.log(
        "===== MASTER MERK MODEL SEED ====="
    );

    Logger.log(
        "================================"
    );


    const merkMap =
        seedMasterMerkV1_();


    seedMasterModelV1_(
        merkMap
    );


    Logger.log(
        "================================"
    );

    Logger.log(
        "===== SEED SELESAI ====="
    );

    Logger.log(
        "================================"
    );

}
