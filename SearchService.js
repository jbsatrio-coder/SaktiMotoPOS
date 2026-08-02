/**
 * ============================================
 * Search Service
 * ============================================
 */

const SearchService = {

  search(keyword) {

    keyword = String(keyword || "").trim();

    if (!keyword) return [];

    return ProductRepository.search(keyword);

  }

};