import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createMealPlan,
  editMealPlan,
  favoriteMealPlan,
  replaceMeal,
  unfavoriteMealPlan,
  updatePlanFromHealth,
} from "@/features/meal-planner/api/mealPlanApi";
import { mealPlanKeys } from "@/features/meal-planner/queryKeys";
import { replacePlanInList, setPlanFavorite } from "@/features/meal-planner/utils/mealPlan";

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

export function useSetPlanFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, favorite }) => (favorite ? favoriteMealPlan(planId) : unfavoriteMealPlan(planId)),
    onSuccess: (_data, { planId, favorite }) => {
      queryClient.setQueryData(mealPlanKeys.list, (old) => setPlanFavorite(old, planId, favorite));
      // Danh sách yêu thích (hộp thoại "Yêu thích của tôi") đã đổi nên bỏ cache để lần mở sau lấy lại.
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.favoritesRoot });
    },
  });
}

export function usePreviewHealthUpdate() {
  return useMutation({
    mutationFn: ({ planId, customTarget }) => updatePlanFromHealth(planId, { confirm: false, customTarget }),
  });
}

export function useApplyHealthUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, customTarget, changeSummary }) =>
      updatePlanFromHealth(planId, { confirm: true, customTarget, changeSummary }),
    onSuccess: (result, { planId }) => {
      if (!result?.updatedMealPlan) return;
      queryClient.setQueryData(mealPlanKeys.list, (old) => replacePlanInList(old, result.updatedMealPlan));
      // Bản trước đó vừa được BE lưu vào lịch sử phiên bản.
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.versions(planId) });
    },
  });
}

/** Xem trước chỉnh sửa thủ công (không lưu). mutate({ planId, edits }) -> { plan } sau khi áp dụng thử. */
export function usePreviewMealEdit() {
  return useMutation({
    mutationFn: ({ planId, edits }) => editMealPlan(planId, { edits, preview: true }),
  });
}

/** Lưu chỉnh sửa thủ công. mutate({ planId, edits, changeSummary }); thành công thì thay thực đơn trong cache. */
export function useSaveMealEdit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, edits, changeSummary }) => editMealPlan(planId, { edits, changeSummary, preview: false }),
    onSuccess: (result, { planId }) => {
      if (!result?.updatedMealPlan) return;
      queryClient.setQueryData(mealPlanKeys.list, (old) => replacePlanInList(old, result.updatedMealPlan));
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.versions(planId) });
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
