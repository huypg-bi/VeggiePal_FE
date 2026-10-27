import { useInfiniteQuery } from "@tanstack/react-query";

import { getMyBlogs } from "@/features/blog/api/blogApi";
import { blogKeys } from "@/features/blog/queryKeys";
import { flattenPages, getNextPageNumber } from "@/shared/utils/paging";

export function useMyBlogs({ status, size = 10 } = {}) {
  const query = useInfiniteQuery({
    queryKey: blogKeys.mine(status, size),
    queryFn: ({ pageParam }) => getMyBlogs({ status, page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
  });

  return {
    ...query,
    posts: flattenPages(query.data),
    total: query.data?.pages?.[0]?.totalElements ?? 0,
  };
}
