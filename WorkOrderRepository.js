/**
 * =====================================================
 * WorkOrder Repository
 * Semua akses ke sheet Work Order dilakukan di sini
 * =====================================================
 */

const WorkOrderRepository = {

  sheet() {
    return getSheet_(CONFIG.SHEET.WORK_ORDER);
  },

  getAll() {
    const sh = this.sheet();

    if (sh.getLastRow() < 2) return [];

    return sh.getDataRange().getDisplayValues().slice(1);
  },

  getByNoWO(noWO) {

    const rows = this.getAll();

    return rows.find(r => r[COL_WO.NOWO] === noWO) || null;

  },

  append(row) {

    this.sheet().appendRow(row);

  }

};