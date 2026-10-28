import { useInfiniteQuery } from "@tanstack/react-query";

import { getComments, getReplies } from "@/features/blog/api/commentApi";
import { blogKeys } from "@/features/blog/queryKeys";
import { flattenPages, getNextPageNumber } from "@/shared/utils/paging";

export function useComments(blogId, { size = 20 } = {}) {
  const query = useInfiniteQuery({
    queryKey: blogKeys.commentList(blogId, { size }),
    queryFn: ({ pageParam }) =>
      getComments({ targetType: "BLOG", targetId: blogId, page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    enabled: blogId != null,
  });

  return {
    ...query,
    comments: flattenPages(query.data),
    total: query.data?.pages?.[0]?.totalElements ?? 0,
  };
}

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
