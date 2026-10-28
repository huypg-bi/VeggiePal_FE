import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import { describeBlogOutcome } from "@/features/blog/utils/blogForm";
import { isAiReviewing, nextReviewPollInterval } from "@/features/blog/utils/blogModeration";

/** Trả hàm (active) -> refetchInterval cho React Query; tính giờ từ lần đầu active, dừng sau REVIEW_POLL_MAX_MS. */
export function useReviewPollInterval() {
  const sinceRef = useRef(null);
  return useCallback((active) => {
    if (!active) {
      sinceRef.current = null;
      return false;
    }
    sinceRef.current ??= Date.now();
    return nextReviewPollInterval(true, sinceRef.current, Date.now());
  }, []);
}

/** Báo toast khi bài chuyển từ "AI đang xét" sang kết quả (đã đăng / bị từ chối / chờ admin). */
export function useReviewResultToast(blog) {
  const wasReviewing = useRef(false);
  useEffect(() => {
    const reviewing = isAiReviewing(blog);
    if (wasReviewing.current && !reviewing && blog) {
      const { tone, message } = describeBlogOutcome(blog);
      if (tone === "error") toast.error(message);
      else if (tone === "info") toast.info(message);
      else toast.success(message);
    }
    wasReviewing.current = reviewing;
  }, [blog]);
}
