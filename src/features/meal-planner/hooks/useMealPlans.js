import { useQuery } from "@tanstack/react-query";

import { getMealPlans, getMealPlanVersions } from "@/features/meal-planner/api/mealPlanApi";
import { mealPlanKeys } from "@/features/meal-planner/queryKeys";

/** Các thực đơn đã lưu của tôi, mới nhất trước (GET /ai/meal-plans). */
export function useMealPlans() {
  return useQuery({
    queryKey: mealPlanKeys.list,
    queryFn: getMealPlans,
    staleTime: 60 * 1000,
  });
}

/**
 * Các phiên bản cũ của một thực đơn (GET /ai/meal-plans/:id/versions). Chỉ tải khi `enabled`
 * (hộp thoại lịch sử đang mở) và luôn lấy mới khi mở lại, vì có thể vừa có bản cũ mới được lưu.
 */
export function useMealPlanVersions(planId, enabled) {
  return useQuery({
    queryKey: mealPlanKeys.versions(planId),
    queryFn: () => getMealPlanVersions(planId),
    enabled: Boolean(enabled) && planId != null,
    staleTime: 0,
  });
}
