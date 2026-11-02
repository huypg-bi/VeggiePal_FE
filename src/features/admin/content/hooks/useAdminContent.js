import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { adminContentKeys } from "@/features/admin/content/queryKeys";
import { getBlogs } from "@/features/blog/api/blogApi";
import { getRecipes } from "@/features/recipe/api/recipeApi";
import { getVideos } from "@/features/video/api/videoApi";

export const CONTENT_PAGE_SIZE = 10;
// BE giới hạn tối đa 100 mục mỗi trang.
const FETCH_ALL_SIZE = 100;
const STALE_MS = 30 * 1000;

/** Bài viết đã đăng, tìm theo từ khóa ở BE. params: { keyword, page }. */
export function useAdminBlogs({ keyword, page }) {
  return useQuery({
    queryKey: adminContentKeys.blogs({ keyword, page }),
    queryFn: () => getBlogs({ keyword, page, size: CONTENT_PAGE_SIZE }),
    placeholderData: keepPreviousData,
    staleTime: STALE_MS,
  });
}

/** Công thức đã đăng, tìm theo từ khóa ở BE. params: { keyword, page }. */
export function useAdminRecipes({ keyword, page }) {
  return useQuery({
    queryKey: adminContentKeys.recipes({ keyword, page }),
    queryFn: () => getRecipes({ keyword, page, size: CONTENT_PAGE_SIZE }),
    placeholderData: keepPreviousData,
    staleTime: STALE_MS,
  });
}

// BE chưa có tìm kiếm cho video nên tải đủ mọi trang để lọc và phân trang ở FE.
async function fetchAllVideos() {
  const items = [];
  let page = 0;
  let totalPages = 1;
  while (page < totalPages) {
    const result = await getVideos({ page, size: FETCH_ALL_SIZE });
    items.push(...(result.items ?? []));
    totalPages = result.totalPages ?? 0;
    page += 1;
  }
  return items;
}

/** Toàn bộ video đã đăng (mảng phẳng). */
export function useAdminVideos() {
  return useQuery({
    queryKey: adminContentKeys.videos,
    queryFn: fetchAllVideos,
    staleTime: STALE_MS,
  });
}
