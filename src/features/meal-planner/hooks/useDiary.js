import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addActivity,
  addWater,
  cancelMeal,
  confirmMeal,
  deleteActivity,
  deleteWater,
  getDiary,
} from "@/features/meal-planner/api/diaryApi";
import { diaryKeys } from "@/features/meal-planner/queryKeys";

/** Nhật ký của một ngày ("YYYY-MM-DD"). */
export function useDiary(date) {
  return useQuery({
    queryKey: diaryKeys.day(date),
    queryFn: () => getDiary(date),
    staleTime: 30 * 1000,
  });
}

function useDiaryMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (_data, { date }) => queryClient.invalidateQueries({ queryKey: diaryKeys.day(date) }),
  });
}

/** mutate({ planId, mealType, date, servings }) */
export const useConfirmMeal = () => useDiaryMutation(confirmMeal);

/** mutate({ planId, mealType, date }) */
export const useCancelMeal = () => useDiaryMutation(cancelMeal);

/** mutate({ date, milliliters }) */
export const useAddWater = () => useDiaryMutation(addWater);

/** mutate({ date, id }) */
export const useDeleteWater = () => useDiaryMutation(({ id }) => deleteWater(id));

/** mutate({ date, activityType, minutes }) */
export const useAddActivity = () => useDiaryMutation(addActivity);

/** mutate({ date, id }) */
export const useDeleteActivity = () => useDiaryMutation(({ id }) => deleteActivity(id));
