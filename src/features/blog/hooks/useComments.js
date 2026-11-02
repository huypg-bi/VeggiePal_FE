import { useInfiniteQuery } from "@tanstack/react-query";

import { getComments, getReplies } from "@/features/blog/api/commentApi";
import { blogKeys } from "@/features/blog/queryKeys";
import { flattenPages, getNextPageNumber } from "@/shared/utils/paging";

// Lấy danh sách bình luận gốc của bài viết hoặc video theo targetType.
export function useComments(target, options = {}) {
  const isObject = typeof target === "object" && target !== null;
  const targetType = isObject ? (target.targetType ?? "BLOG") : (options.targetType ?? "BLOG");
  const targetId = isObject ? (target.targetId ?? target.blogId) : target;
  const size = options.size ?? 20;

  const query = useInfiniteQuery({
    queryKey: blogKeys.commentList(targetId, { targetType, size }),
    queryFn: ({ pageParam }) =>
      getComments({ targetType, targetId, page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    enabled: targetId != null,
  });

  return {
    ...query,
    comments: flattenPages(query.data),
    total: query.data?.pages?.[0]?.totalElements ?? 0,
  };
}

// Lấy danh sách phản hồi con dưới một bình luận gốc.
export function useReplies(commentId, { size = 20, enabled = true } = {}) {
  const query = useInfiniteQuery({
    queryKey: blogKeys.replies(commentId, { size }),
    queryFn: ({ pageParam }) => getReplies(commentId, { page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    enabled: enabled && commentId != null,
  });

  return { ...query, replies: flattenPages(query.data) };
}
