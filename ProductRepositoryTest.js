/**
 * ============================================
 * Product Repository Test
 * ============================================
 */

function testProductRepositoryJasa() {

  const result =
    ProductRepository.search(
      "Service ringan kelistrikan"
    );


  Logger.log(
    "===== PRODUCT REPOSITORY JASA ====="
  );


  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}