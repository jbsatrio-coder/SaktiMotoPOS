/**
 * ============================================
 * Transaction Controller
 * Sprint 3B
 * ============================================
 */

/**
 * Dipanggil dari Frontend POS
 */
function savePOSTransaction(payload) {

  return TransactionService.saveTransaction(payload);

}