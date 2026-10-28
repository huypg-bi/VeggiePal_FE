import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getVideoJobs, processVideo } from "@/features/video/api/videoJobApi";
import { videoKeys } from "@/features/video/queryKeys";
import { hasProcessingJob, VIDEO_JOB_POLL_MS } from "@/features/video/utils/videoJob";
import { flattenPages, getNextPageNumber } from "@/shared/utils/paging";

export function useVideoJobs({ size = 10 } = {}) {
  const query = useInfiniteQuery({
    queryKey: videoKeys.jobs(size),
    queryFn: ({ pageParam }) => getVideoJobs({ page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: getNextPageNumber,
    refetchInterval: (q) =>
      hasProcessingJob(flattenPages(q.state.data)) ? VIDEO_JOB_POLL_MS : false,
  });

  return {
    ...query,
    jobs: flattenPages(query.data),
    total: query.data?.pages?.[0]?.totalElements ?? 0,
  };
}

export function useStartVideoJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onUploadProgress }) => processVideo(file, { onUploadProgress }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: videoKeys.jobsRoot }),
  });
}
