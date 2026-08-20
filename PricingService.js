/**
 * ============================================
 * SAKTI MOTO POS
 * Pricing Service
 * Version : 2.0.0
 * ============================================
 *
 * Mendukung dua mode pricing:
 *
 * MODE MARGIN
 * Harga Modal + Margin -> Harga Jual
 *
 * MODE HARGA PASAR
 * Harga Modal + Harga Jual -> Margin Aktual
 *
 * Opsi B:
 * Margin = profit / harga jual
 *
 * Harga Jual =
 * Harga Modal / (1 - Margin)
 *
 * Pembulatan harga:
 * ke atas ke pecahan Rp100.
 * ============================================
 */

const PricingService = {

  /**
   * ==========================================
   * DEFAULT MARGIN
   * ==========================================
   */

  getDefaultMargin() {

    const margin =
      Number(
        CONFIG.PRICING.DEFAULT_MARGIN
      );

    if (
      !isFinite(margin) ||
      margin < 0 ||
      margin >= 1
    ) {

      throw new Error(
        "Default margin tidak valid."
      );

    }

    return margin;

  },


  /**
   * ==========================================
   * ROUNDING HARGA JUAL
   * ==========================================
   *
   * Selalu dibulatkan ke atas.
   *
   * Contoh:
   * 21.428 -> 21.500
   * 21.501 -> 21.600
   */

  roundSellingPrice(price) {

    const rounding =
      Number(
        CONFIG.PRICING.PRICE_ROUNDING
      );

    if (
      !isFinite(rounding) ||
      rounding <= 0
    ) {

      throw new Error(
        "PRICE_ROUNDING tidak valid."
      );

    }

    const value =
      Number(price);

    if (
      !isFinite(value) ||
      value < 0
    ) {

      throw new Error(
        "Harga tidak valid."
      );

    }

    return (
      Math.ceil(
        value / rounding
      ) * rounding
    );

  },


  /**
   * ==========================================
   * MODE A
   * HARGA MODAL + MARGIN
   * -> HARGA JUAL
   * ==========================================
   */

  calculateSellingPrice(
    hargaModal,
    margin
  ) {

    const modal =
      Number(hargaModal);

    if (
      !isFinite(modal) ||
      modal < 0
    ) {

      throw new Error(
        "Harga modal tidak valid."
      );

    }

    const marginFinal =
      margin === undefined ||
      margin === null ||
      margin === ""
        ? this.getDefaultMargin()
        : Number(margin);

    if (
      !isFinite(marginFinal) ||
      marginFinal < 0 ||
      marginFinal >= 1
    ) {

      throw new Error(
        "Margin harus >= 0 dan < 100%."
      );

    }

    const hargaSebelumPembulatan =
      modal /
      (1 - marginFinal);

    const hargaJual =
      this.roundSellingPrice(
        hargaSebelumPembulatan
      );

    const marginAktual =
      modal === hargaJual
        ? 0
        : (
            (hargaJual - modal) /
            hargaJual
          );

    return {

      hargaModal:
        modal,

      margin:
        marginFinal,

      hargaSebelumPembulatan:
        hargaSebelumPembulatan,

      hargaJual:
        hargaJual,

      marginAktual:
        marginAktual

    };

  },


  /**
   * ==========================================
   * MODE B
   * HARGA MODAL + HARGA JUAL
   * -> MARGIN AKTUAL
   * ==========================================
   */

  calculateMarginFromSellingPrice(
    hargaModal,
    hargaJual
  ) {

    const modal =
      Number(hargaModal);

    const jual =
      Number(hargaJual);

    if (
      !isFinite(modal) ||
      modal < 0
    ) {

      throw new Error(
        "Harga modal tidak valid."
      );

    }

    if (
      !isFinite(jual) ||
      jual <= 0
    ) {

      throw new Error(
        "Harga jual harus lebih dari 0."
      );

    }

    if (jual < modal) {

      return {

        hargaModal:
          modal,

        hargaJual:
          jual,

        profit:
          jual - modal,

        margin:
          (jual - modal) / jual,

        belowCost:
          true

      };

    }

    const profit =
      jual - modal;

    const margin =
      profit / jual;

    return {

      hargaModal:
        modal,

      hargaJual:
        jual,

      profit:
        profit,

      margin:
        margin,

      belowCost:
        false

    };

  }

};


/**
 * ============================================
 * TEST PRICING SERVICE V2
 * ============================================
 */

function testPricingServiceV2() {

  Logger.log(
    "===== MODE A ====="
  );

  const modeA =
    PricingService.calculateSellingPrice(
      15000,
      0.30
    );

  Logger.log(
    JSON.stringify(
      modeA,
      null,
      2
    )
  );


  Logger.log(
    "===== MODE B ====="
  );

  const modeB =
    PricingService.calculateMarginFromSellingPrice(
      15000,
      20000
    );

  Logger.log(
    JSON.stringify(
      modeB,
      null,
      2
    )
  );

}
