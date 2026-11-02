import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  dismissModerationCase,
  getModerationHistory,
  getPendingModerationCases,
  reviewModerationCase,
} from "@/features/admin/moderation/api/moderationApi";
import { moderationKeys } from "@/features/admin/moderation/queryKeys";

const STALE_MS = 15 * 1000;

/** L?y danh s?ch h?ng ??i c?c case ki?m duy?t (REVIEW_REQUIRED, c? nh?t tr??c). */
export function usePendingModerationCases() {
  return useQuery({
    queryKey: moderationKeys.pending,
    queryFn: getPendingModerationCases,
    staleTime: STALE_MS,
  });
}

/** L?y l?ch s? c?c case ?? x? l? c? ph?n trang v? b? l?c (GET /ai/admin/moderation/history). */
export function useModerationHistory(params = {}, options = {}) {
  return useQuery({
    queryKey: moderationKeys.history(params),
    queryFn: () => getModerationHistory(params),
    staleTime: STALE_MS,
    ...options,
  });
}

/** Mutation duy?t ho?c t? ch?i case ki?m duy?t. */
export function useReviewModeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, decision, reason }) =>
      reviewModerationCase(id, { decision, reason }),
    onSuccess: () => {
      // Invalidate ?? t? ??ng l?m m?i danh s?ch h?ng ??i v? l?ch s?
      queryClient.invalidateQueries({ queryKey: moderationKeys.all });
    },
    onError: (error) => {
      // Khi g?p l?i 6013 (Case ?? ???c x? l?): t? ??ng t?i l?i
      if (error?.code === 6013) {
        queryClient.invalidateQueries({ queryKey: moderationKeys.all });
      }
    },
  });
}

export function useDismissModeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => dismissModerationCase(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moderationKeys.all });
    },
    onError: (error) => {
      // 6013: case ?? ???c x? l? -> t?i l?i
      if (error?.code === 6013) {
        queryClient.invalidateQueries({ queryKey: moderationKeys.all });
      }
    },
  });
}
