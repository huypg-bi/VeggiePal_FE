import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  changeBlogStatus,
  changeVideoStatus,
  getAdminBlogs,
  getAdminRecipes,
  getAdminVideos,
} from "@/features/admin/content/api/contentApi";
import { adminContentKeys } from "@/features/admin/content/queryKeys";
import { blogKeys } from "@/features/blog/queryKeys";
import { videoKeys } from "@/features/video/queryKeys";

export const CONTENT_PAGE_SIZE = 10;
const STALE_MS = 30 * 1000;

function useAdminList(queryKey, queryFn) {
  return useQuery({ queryKey, queryFn, placeholderData: keepPreviousData, staleTime: STALE_MS });
}

/** Bài viết ở mọi trạng thái. params: { status, keyword, page }. */
export function useAdminBlogs({ status, keyword, page }) {
  return useAdminList(adminContentKeys.blogs({ status, keyword, page }), () =>
    getAdminBlogs({ status, keyword, page, size: CONTENT_PAGE_SIZE })
  );
}

/** Công thức ở mọi trạng thái. params: { status, keyword, page }. */
export function useAdminRecipes({ status, keyword, page }) {
  return useAdminList(adminContentKeys.recipes({ status, keyword, page }), () =>
    getAdminRecipes({ status, keyword, page, size: CONTENT_PAGE_SIZE })
  );
}

/** Video ở mọi trạng thái. params: { status, keyword, page }. */
export function useAdminVideos({ status, keyword, page }) {
  return useAdminList(adminContentKeys.videos({ status, keyword, page }), () =>
    getAdminVideos({ status, keyword, page, size: CONTENT_PAGE_SIZE })
  );
}

/** Duyệt / từ chối bài viết. mutate({ id, status: "PUBLISHED" | "REJECTED", reason }). */
export function useChangeBlogStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }) => changeBlogStatus(id, { status, reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: blogKeys.blogs }),
  });
}

/** Duyệt / từ chối video. mutate({ id, status: "PUBLISHED" | "REJECTED", reason }). */
export function useChangeVideoStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }) => changeVideoStatus(id, { status, reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: videoKeys.all }),
  });
}
