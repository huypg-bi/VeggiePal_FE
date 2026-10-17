import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createMealPlan, replaceMeal } from "@/features/meal-planner/api/mealPlanApi";
import { mealPlanKeys } from "@/features/meal-planner/queryKeys";
import { replacePlanInList } from "@/features/meal-planner/utils/mealPlan";

/**
 * Tạo thực đơn mới. mutate(payload) -> MealPlan.
 * Thực đơn mới được đặt lên đầu danh sách cache (BE sắp mới nhất trước) nên không cần tải lại.
 */
export function useCreateMealPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMealPlan,
    onSuccess: (created) => {
      queryClient.setQueryData(mealPlanKeys.list, (old) => [
        created,
        ...(Array.isArray(old) ? old.filter((plan) => plan.id !== created.id) : []),
      ]);
    },
  });
}

/** Đổi một món. mutate({ planId, day, mealType, currentRecipeId }) -> MealPlan sau khi cập nhật. */
export function useReplaceMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, ...body }) => replaceMeal(planId, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(mealPlanKeys.list, (old) => replacePlanInList(old, updated));
    },
  });
}
