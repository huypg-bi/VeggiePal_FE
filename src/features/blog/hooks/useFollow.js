import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { selectIsAuthenticated, useAuthStore } from "@/features/auth/store/authStore";
import {
  followUser,
  getFollowingIds,
  getFollowList,
  getFollowStats,
  unfollowUser,
} from "@/features/blog/api/followApi";
import { blogKeys } from "@/features/blog/queryKeys";
import { flattenPages, getNextPageNumber } from "@/shared/utils/paging";

const toIdSet = (ids) => new Set(ids);

/** Tập id những người tôi theo dõi (một lần gọi cho cả feed); chỉ tải khi đã đăng nhập. */
export function useFollowingIds() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  return useQuery({
    queryKey: blogKeys.followingIds,
    queryFn: getFollowingIds,
    select: toIdSet,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

/** { followers, following, followedByMe } của một người; BE bắt đăng nhập nên khách không gọi. */
export function useFollowStats(userId) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  return useQuery({
    queryKey: blogKeys.followStats(userId),
    queryFn: () => getFollowStats(userId),
    enabled: isAuthenticated && userId != null,
    staleTime: 60 * 1000,
  });
}

/**
 * mutate({ userId, follow }): follow=true gọi PUT, false gọi DELETE (BE không có toggle).
 * BE trả luôn số liệu mới nên ghi thẳng vào cache; feed "Đang theo dõi" đổi nội dung nên bỏ cache để tải lại.
 */
export function useSetFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, follow }) => (follow ? followUser(userId) : unfollowUser(userId)),
    onSuccess: (stats, { userId, follow }) => {
      queryClient.setQueryData(blogKeys.followStats(userId), stats);
      queryClient.setQueryData(blogKeys.followingIds, (old) => {
        if (!Array.isArray(old)) return old;
        const rest = old.filter((id) => id !== userId);
        return follow ? [...rest, userId] : rest;
      });
      queryClient.invalidateQueries({ queryKey: blogKeys.followingFeeds });
      // Hộp thoại danh sách đang mở thì giữ nguyên hàng vừa bỏ theo dõi (để còn theo dõi lại), chỉ đánh dấu cũ để lần mở sau tải mới.
      queryClient.invalidateQueries({ queryKey: blogKeys.followLists, refetchType: "none" });
    },
  });
}

/** Danh sách người theo dõi / đang theo dõi của `userId` ("me" = tôi), phân trang kiểu "Xem thêm". */
export function useFollowList({ userId, kind, size = 20 }) {
  const query = useInfiniteQuery({
    queryKey: blogKeys.followList(userId, kind),
    queryFn: ({ pageParam }) => getFollowList({ userId, kind, page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    staleTime: 0,
  });

  return { ...query, users: flattenPages(query.data), total: query.data?.pages[0]?.totalElements ?? 0 };
}
