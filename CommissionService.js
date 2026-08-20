/**
 * ============================================
 * Commission Service
 * Version : 2.0.0
 *
 * Aturan:
 *
 * 1. Default = MEKANIK
 *    → mengambil NilaiKomisi dari MasterMekanik
 *
 * 2. JASA
 *    → mengambil Komisi dari MasterJasa
 *
 * MasterJasa:
 * MODE_KOMISI = MEKANIK / JASA
 * ============================================
 */

const CommissionService = {

  calculate(payload) {

    if (!payload) {

      throw new Error(
        "Payload komisi wajib diisi."
      );

    }


    // ======================================
    // BASIC DATA
    // ======================================

    const subtotal =
      Number(payload.subtotal || 0);


    if (
      !Number.isFinite(subtotal) ||
      subtotal < 0
    ) {

      throw new Error(
        "Subtotal komisi tidak valid."
      );

    }


    const mekanikId =
      String(
        payload.mekanikId || ""
      ).trim();


    const jasaId =
      String(
        payload.jasaId || ""
      ).trim();


    if (!mekanikId) {

      throw new Error(
        "Mekanik wajib diisi untuk menghitung komisi."
      );

    }


    if (!jasaId) {

      throw new Error(
        "Jasa wajib diisi untuk menghitung komisi."
      );

    }


    // ======================================
    // LOAD MEKANIK
    // ======================================

    const mekanik =
      MekanikRepository.findById(
        mekanikId
      );


    if (!mekanik) {

      throw new Error(
        "Mekanik tidak ditemukan: " +
        mekanikId
      );

    }


    if (
      String(
        mekanik[COL_MEKANIK.STATUS] || ""
      )
      .trim()
      .toUpperCase() !== "AKTIF"
    ) {

      throw new Error(
        "Mekanik tidak aktif: " +
        mekanikId
      );

    }


    // ======================================
    // LOAD JASA
    // ======================================

    const jasa =
      JasaRepository.findById(
        jasaId
      );


    if (!jasa) {

      throw new Error(
        "Jasa tidak ditemukan: " +
        jasaId
      );

    }


    // ======================================
    // BACA MODE KOMISI
    //
    // MasterJasa:
    // H = MODE_KOMISI
    // ======================================

    let modeKomisi =
      String(
        jasa[COL_JASA.MODE_KOMISI] ||
        "MEKANIK"
      )
      .trim()
      .toUpperCase();


    // ======================================
    // VALIDASI MODE
    // ======================================

    if (
      modeKomisi !== "MEKANIK" &&
      modeKomisi !== "JASA"
    ) {

      throw new Error(
        "Mode Komisi Jasa tidak valid: " +
        modeKomisi
      );

    }


    // ======================================
    // MODE MEKANIK
    // ======================================

    if (
      modeKomisi === "MEKANIK"
    ) {

      let tipeKomisi =
        String(
          mekanik[COL_MEKANIK.TIPE_KOMISI] ||
          "PERSENTASE"
        )
        .trim()
        .toUpperCase();


      let nilaiKomisi =
        Number(
          mekanik[COL_MEKANIK.NILAI_KOMISI] || 0
        );


      // ------------------------------------
      // NORMALISASI
      // ------------------------------------

      if (
        tipeKomisi === "PERSEN"
      ) {

        tipeKomisi =
          "PERSENTASE";

      }


      // ------------------------------------
      // VALIDASI
      // ------------------------------------

      if (
        !Number.isFinite(nilaiKomisi)
      ) {

        throw new Error(
          "Nilai komisi mekanik tidak valid: " +
          mekanikId
        );

      }


      if (
        tipeKomisi === "PERSENTASE"
      ) {

        if (
          nilaiKomisi < 0 ||
          nilaiKomisi > 100
        ) {

          throw new Error(
            "Nilai komisi mekanik harus antara 0% dan 100%."
          );

        }

      }


      // ------------------------------------
      // HITUNG
      // ------------------------------------

      let komisi = 0;


      if (
        tipeKomisi === "PERSENTASE"
      ) {

        komisi =
          subtotal *
          (
            nilaiKomisi / 100
          );

      }

      else if (
        tipeKomisi === "NOMINAL"
      ) {

        komisi =
          Math.min(
            nilaiKomisi,
            subtotal
          );

      }

      else if (
        tipeKomisi === "NONE"
      ) {

        nilaiKomisi = 0;

        komisi = 0;

      }

      else {

        throw new Error(
          "Tipe komisi mekanik tidak dikenali: " +
          tipeKomisi
        );

      }


      komisi =
        Math.round(komisi);


      return {

        modeKomisi:
          "MEKANIK",

        mekanikId:
          mekanikId,

        jasaId:
          jasaId,

        tipeKomisi:
          tipeKomisi,

        nilaiKomisi:
          nilaiKomisi,

        subtotal:
          subtotal,

        komisi:
          komisi,

        labaSetelahKomisi:
          subtotal - komisi

      };

    }


    // ======================================
    // MODE JASA
    // ======================================

    if (
      modeKomisi === "JASA"
    ) {

      const komisiJasa =
        Number(
          jasa[COL_JASA.KOMISI] || 0
        );


      if (
        !Number.isFinite(komisiJasa) ||
        komisiJasa < 0
      ) {

        throw new Error(
          "Komisi jasa tidak valid: " +
          jasaId
        );

      }


      const komisi =
        Math.round(
          Math.min(
            komisiJasa,
            subtotal
          )
        );


      return {

        modeKomisi:
          "JASA",

        mekanikId:
          mekanikId,

        jasaId:
          jasaId,

        tipeKomisi:
          "NOMINAL",

        nilaiKomisi:
          komisiJasa,

        subtotal:
          subtotal,

        komisi:
          komisi,

        labaSetelahKomisi:
          subtotal - komisi

      };

    }

  }

};