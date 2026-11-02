import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { selectIsAuthenticated, useAuthStore } from "@/features/auth/store/authStore";
import { checkInChallenge, getChallengeProgress, joinChallenge } from "@/features/blog/api/challengeApi";
import { blogKeys } from "@/features/blog/queryKeys";
import { CHALLENGE_DAYS } from "@/features/blog/utils/challenge";
import { profileKeys } from "@/features/profile/queryKeys";

/**
 * Thử thách 7 ngày của tôi (BE tính ngày theo Asia/Ho_Chi_Minh).
 * `status`: NONE (chưa tham gia / chưa đăng nhập), IN_PROGRESS, COMPLETED, FAILED.
 */
export function useChallenge() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const key = blogKeys.challenge(userId);

  const query = useQuery({
    queryKey: key,
    queryFn: getChallengeProgress,
    enabled: isAuthenticated && userId != null,
  });

  // Quay lại tab sau lúc ngủ hoặc qua nửa đêm thì hỏi lại BE để nút check-in và chuỗi ngày đúng.
  const { refetch } = query;
  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const refresh = () => {
      if (document.visibilityState === "visible") refetch();
    };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, [isAuthenticated, refetch]);

  const applyProgress = (progress) => {
    queryClient.setQueryData(key, progress);
    // Hoàn thành 7/7 thì BE cấp huy hiệu ACHIEVEMENT nên làm mới hồ sơ (huy hiệu nằm trong GET /users/me).
    if (progress?.status === "COMPLETED") queryClient.invalidateQueries({ queryKey: profileKeys.me });
  };

  // Lỗi (đã check-in, đang có lượt khác...) thường do tiến độ trên màn hình đã cũ nên tải lại từ BE.
  const refresh = () => queryClient.invalidateQueries({ queryKey: key });
  const join = useMutation({ mutationFn: joinChallenge, onSuccess: applyProgress, onError: refresh });
  const checkIn = useMutation({ mutationFn: checkInChallenge, onSuccess: applyProgress, onError: refresh });

  const progress = query.data ?? null;
  return {
    status: progress?.status ?? "NONE",
    days: progress?.completedDays ?? 0,
    total: progress?.totalDays ?? CHALLENGE_DAYS,
    points: progress?.points ?? 0,
    checkedToday: Boolean(progress?.checkedInToday),
    loading: isAuthenticated && query.isPending,
    error: query.isError ? query.error.message : "",
    join,
    checkIn,
  };
}
