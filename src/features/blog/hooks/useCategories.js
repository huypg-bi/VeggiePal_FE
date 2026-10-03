import { useQuery } from "@tanstack/react-query";

import { getCategories, getCategory } from "@/features/blog/api/categoryApi";
import { blogKeys } from "@/features/blog/queryKeys";

/** Cây danh mục (GET /categories) — ít thay đổi nên cache 10 phút. */
export function useCategories({ type, activeOnly = true } = {}) {
  return useQuery({
    queryKey: blogKeys.categoryTree(type, activeOnly),
    queryFn: () => getCategories({ type, activeOnly }),
    staleTime: 10 * 60 * 1000,
  });
}

/** Một danh mục (GET /categories/:id). */
export function useCategory(id) {
  return useQuery({
    queryKey: blogKeys.category(id),
    queryFn: () => getCategory(id),
    enabled: id != null,
    staleTime: 10 * 60 * 1000,
  });
}
