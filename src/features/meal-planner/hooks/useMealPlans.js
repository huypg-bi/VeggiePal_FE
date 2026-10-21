import { useQuery } from "@tanstack/react-query";

import { getMealPlans } from "@/features/meal-planner/api/mealPlanApi";
import { mealPlanKeys } from "@/features/meal-planner/queryKeys";

/** Các thực đơn đã lưu của tôi, mới nhất trước (GET /ai/meal-plans). */
export function useMealPlans() {
  return useQuery({
    queryKey: mealPlanKeys.list,
    queryFn: getMealPlans,
    staleTime: 60 * 1000,
  });
}
