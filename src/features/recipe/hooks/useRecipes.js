import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getRecipe, getRecipes } from "@/features/recipe/api/recipeApi";
import { recipeKeys } from "@/features/recipe/queryKeys";

/**
 * Danh sách công thức đã publish (GET /recipes). params: { keyword, page, size }.
 * Giữ dữ liệu trang cũ trong lúc tải trang/từ khóa mới để danh sách không bị nháy.
 */
export function useRecipes(params = {}) {
  return useQuery({
    queryKey: recipeKeys.list(params),
    queryFn: () => getRecipes(params),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

/** Chi tiết công thức (GET /recipes/:id). */
export function useRecipe(id) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => getRecipe(id),
    enabled: id != null,
    staleTime: 60 * 1000,
  });
}
