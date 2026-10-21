import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getPendingModerationCases,
  reviewModerationCase,
} from "@/features/admin/moderation/api/moderationApi";
import { moderationKeys } from "@/features/admin/moderation/queryKeys";

const STALE_MS = 15 * 1000;

/** Lấy danh sách hàng đợi các case kiểm duyệt (REVIEW_REQUIRED, cũ nhất trước). */
export function usePendingModerationCases() {
  return useQuery({
    queryKey: moderationKeys.pending,
    queryFn: getPendingModerationCases,
    staleTime: STALE_MS,
  });
}

/** Mutation duyệt hoặc từ chối case kiểm duyệt. */
export function useReviewModeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, decision, reason }) =>
      reviewModerationCase(id, { decision, reason }),
    onSuccess: () => {
      // Invalidate để tự động làm mới danh sách hàng đợi
      queryClient.invalidateQueries({ queryKey: moderationKeys.all });
    },
    onError: (error) => {
      // Khi gặp lỗi 6013 (Case đã được xử lý): tự động tải lại hàng đợi kiểm duyệt
      if (error?.code === 6013) {
        queryClient.invalidateQueries({ queryKey: moderationKeys.all });
      }
    },
  });
}
