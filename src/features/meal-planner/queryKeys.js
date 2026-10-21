// Khóa cache React Query của feature meal-planner.
export const mealPlanKeys = {
  list: ["meal-plans", "list"],
  detail: (planId) => ["meal-plans", "detail", planId],
  versions: (planId) => ["meal-plans", "versions", planId],
  version: (planId, version) => ["meal-plans", "version", planId, version],
  // Gốc chung của mọi trang yêu thích, để làm mới cả danh sách khi bật / tắt yêu thích.
  favoritesRoot: ["meal-plans", "favorites"],
  favorites: (page) => ["meal-plans", "favorites", "page", page],
  favorite: (planId) => ["meal-plans", "favorites", "detail", planId],
};
