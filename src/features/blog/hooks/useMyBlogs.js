import { useInfiniteQuery } from "@tanstack/react-query";

import { getMyBlogs } from "@/features/blog/api/blogApi";
import { useReviewPollInterval } from "@/features/blog/hooks/useReviewPolling";
import { needsReviewPolling } from "@/features/blog/utils/blogModeration";
import { blogKeys } from "@/features/blog/queryKeys";
import { flattenPages, getNextPageNumber } from "@/shared/utils/paging";

export function useMyBlogs({ status, size = 10 } = {}) {
  const pollInterval = useReviewPollInterval();
  const query = useInfiniteQuery({
    queryKey: blogKeys.mine(status, size),
    queryFn: ({ pageParam }) => getMyBlogs({ status, page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    // Chỉ hỏi lại khi còn bài AI đang xét (aiReviewInProgress), có giới hạn thời gian.
    refetchInterval: (q) => pollInterval(flattenPages(q.state.data).some(needsReviewPolling)),
  });

  return {
    ...query,
    posts: flattenPages(query.data),
    total: query.data?.pages?.[0]?.totalElements ?? 0,
  };
}
