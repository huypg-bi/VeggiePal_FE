import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { selectIsAuthenticated, useAuthStore } from "@/features/auth/store/authStore";
import { getBlog, getBlogs, getFollowingBlogs, getRelatedBlogs } from "@/features/blog/api/blogApi";
import { useReviewPollInterval } from "@/features/blog/hooks/useReviewPolling";
import { blogKeys } from "@/features/blog/queryKeys";
import { isAiReviewing } from "@/features/blog/utils/blogModeration";
import { flattenPages, getNextPageNumber } from "@/shared/utils/paging";

// `enabled = false` khi tab "Đang theo dõi" đang mở, để không tải feed chung vô ích.
export function useBlogFeed({ categoryId, keyword, sort, size = 10, enabled = true } = {}) {
  const query = useInfiniteQuery({
    queryKey: blogKeys.feed({ categoryId, keyword, sort, size }),
    queryFn: ({ pageParam }) =>
      getBlogs({ categoryId, keyword, sort, page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    enabled,
    staleTime: 60 * 1000,
  });

  return { ...query, posts: flattenPages(query.data) };
}

/** Feed bài của những người tôi theo dõi (chỉ khi đã đăng nhập và `enabled`). */
export function useFollowingFeed({ size = 10, enabled = true } = {}) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const query = useInfiniteQuery({
    queryKey: blogKeys.followingFeed(size),
    queryFn: ({ pageParam }) => getFollowingBlogs({ page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    enabled: enabled && isAuthenticated,
    staleTime: 60 * 1000,
  });

  return { ...query, posts: flattenPages(query.data) };
}

export function useBlog(id) {
  const pollInterval = useReviewPollInterval();
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => getBlog(id),
    enabled: id != null,
    // Bài đang chờ duyệt thì luôn lấy mới và tự hỏi lại trong lúc AI xét.
    staleTime: (query) => (query.state.data?.status === "PENDING" ? 0 : 5 * 60 * 1000),
    refetchInterval: (query) => pollInterval(isAiReviewing(query.state.data)),
  });
}

/** Tối đa 5 bài cùng danh mục (GET /blogs/:id/related). */
export function useRelatedBlogs(id) {
  return useQuery({
    queryKey: blogKeys.related(id),
    queryFn: () => getRelatedBlogs(id),
    enabled: id != null,
    staleTime: 5 * 60 * 1000,
  });
}
