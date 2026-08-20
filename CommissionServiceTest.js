/**
 * ============================================
 * Commission Service Test
 * ============================================
 */

function testCommissionServiceMekanik() {

  const result =
    CommissionService.calculate({

      subtotal:
        100000,

      mekanikId:
        "MEC000001",

      jasaId:
        "JAS000001"

    });


  Logger.log(
    "===== COMMISSION SERVICE ====="
  );

  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}
