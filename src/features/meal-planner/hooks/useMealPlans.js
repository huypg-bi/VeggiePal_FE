import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getFavoriteMealPlan,
  getFavoriteMealPlans,
  getMealPlan,
  getMealPlanUsage,
  getMealPlanVersion,
  getMealPlans,
  getMealPlanVersions,
  getNutritionTarget,
} from "@/features/meal-planner/api/mealPlanApi";
import { mealPlanKeys } from "@/features/meal-planner/queryKeys";

/** Các thực đơn đã lưu của tôi, mới nhất trước (GET /ai/meal-plans). */
export function useMealPlans() {
  return useQuery({
    queryKey: mealPlanKeys.list,
    queryFn: getMealPlans,
    staleTime: 60 * 1000,
  });
}

/** Số lượt tạo thực đơn đã dùng / còn lại trong tháng (GET /ai/meal-plans/usage). */
export function useMealPlanUsage(enabled = true) {
  return useQuery({
    queryKey: mealPlanKeys.usage,
    queryFn: getMealPlanUsage,
    enabled: Boolean(enabled),
    staleTime: 60 * 1000,
  });
}

export function useNutritionTarget(goalType, enabled = true) {
  return useQuery({
    queryKey: mealPlanKeys.nutritionTarget(goalType),
    queryFn: () => getNutritionTarget(goalType),
    enabled: Boolean(enabled) && Boolean(goalType),
    staleTime: 0,
    retry: false,
  });
}

export function useMealPlanVersions(planId, enabled) {
  return useQuery({
    queryKey: mealPlanKeys.versions(planId),
    queryFn: () => getMealPlanVersions(planId),
    enabled: Boolean(enabled) && planId != null,
    staleTime: 0,
  });
}

export function useMealPlan(planId, enabled) {
  return useQuery({
    queryKey: mealPlanKeys.detail(planId),
    queryFn: () => getMealPlan(planId),
    enabled: Boolean(enabled) && planId != null,
    staleTime: 0,
  });
}

/** Nội dung đầy đủ của một phiên bản cũ (GET /ai/meal-plans/:id/versions/:version), chỉ tải khi `enabled`. */
export function useMealPlanVersion(planId, version, enabled) {
  return useQuery({
    queryKey: mealPlanKeys.version(planId, version),
    queryFn: () => getMealPlanVersion(planId, version),
    enabled: Boolean(enabled) && planId != null && version != null,
    // Phiên bản cũ không đổi sau khi được lưu nên giữ cache lâu.
    staleTime: 5 * 60 * 1000,
  });
}

export function useFavoriteMealPlans(page, size, enabled) {
  return useQuery({
    queryKey: mealPlanKeys.favorites(page),
    queryFn: () => getFavoriteMealPlans({ page, size }),
    enabled: Boolean(enabled),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });
}

/** Một thực đơn yêu thích (GET /ai/meal-plans/favorites/:id), chỉ tải khi `enabled` (mục đang được mở xem). */
export function useFavoriteMealPlan(planId, enabled) {
  return useQuery({
    queryKey: mealPlanKeys.favorite(planId),
    queryFn: () => getFavoriteMealPlan(planId),
    enabled: Boolean(enabled) && planId != null,
    staleTime: 0,
  });
}
