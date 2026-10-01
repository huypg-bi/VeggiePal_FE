import { useQuery } from "@tanstack/react-query";

import { getAiSummary } from "@/features/video/api/videoApi";
import { videoKeys } from "@/features/video/queryKeys";

/** Tóm tắt công thức (AI) của một video. Mỗi video được cache riêng theo videoId. */
export function useAiSummary(videoId) {
  return useQuery({
    queryKey: videoKeys.aiSummary(videoId),
    queryFn: () => getAiSummary(videoId),
    enabled: Boolean(videoId),
  });
}
