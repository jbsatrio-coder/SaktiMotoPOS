/**
 * ============================================
 * Customer Migration
 * Version : 1.0.0
 * ============================================
 */

/**
 * Mengisi Customer ID yang masih kosong.
 * Aman dijalankan berkali-kali (idempotent).
 */
function migrateCustomerId() {

    const sheet = CustomerRepository.sheet();

    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {

        Logger.log("Tidak ada data pelanggan.");

        return;

    }

    for (let row = 2; row <= lastRow; row++) {

        const customerId = sheet
            .getRange(
                row,
                SHEET_COL_PELANGGAN.ID
            )
            .getValue();

        if (String(customerId).trim() !== "") {

            continue;

        }

        const newId =
            RunningNumberService.generate(
                DocumentType.CUSTOMER
            );

        sheet
            .getRange(
                row,
                SHEET_COL_PELANGGAN.ID
            )
            .setValue(newId);

        Logger.log(
            "[MIGRATION] Row " +
            row +
            " -> " +
            newId
        );

    }

    Logger.log("Migration selesai.");

}