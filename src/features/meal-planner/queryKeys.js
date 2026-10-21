// Khóa cache React Query của feature meal-planner.
export const mealPlanKeys = {
  list: ["meal-plans", "list"],
  versions: (planId) => ["meal-plans", "versions", planId],
};
