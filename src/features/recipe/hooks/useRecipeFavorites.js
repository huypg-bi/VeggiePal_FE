import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { selectIsAuthenticated, useAuthStore } from "@/features/auth/store/authStore";
import { favoriteRecipe, getFavoriteRecipeIds, getFavoriteRecipes, unfavoriteRecipe } from "@/features/recipe/api/recipeApi";
import { recipeFavoriteKeys, recipeKeys } from "@/features/recipe/queryKeys";
import { patchFavoriteCount, setFavoriteId } from "@/features/recipe/utils/recipeFavorite";

const toIdSet = (ids) => new Set(ids);

/** Tập id công thức tôi đã lưu (một lần gọi cho cả danh sách); chỉ tải khi đã đăng nhập. */
export function useFavoriteRecipeIds() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  return useQuery({
    queryKey: recipeFavoriteKeys.ids,
    queryFn: getFavoriteRecipeIds,
    select: toIdSet,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

/** Một trang công thức tôi đã lưu (GET /recipes/favorites), mới lưu trước. */
export function useFavoriteRecipes({ size = 6 } = {}) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  return useQuery({
    queryKey: recipeFavoriteKeys.page(size),
    queryFn: () => getFavoriteRecipes({ page: 0, size }),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

/**
 * mutate({ recipeId, favorite }): favorite=true gọi POST, false gọi DELETE (BE không có toggle, gọi lặp không lỗi).
 * BE trả luôn `favoriteCount` mới nên ghi thẳng vào mọi danh sách / chi tiết đang có trong cache.
 */
export function useSetRecipeFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeId, favorite }) => (favorite ? favoriteRecipe(recipeId) : unfavoriteRecipe(recipeId)),
    onSuccess: (result, { recipeId, favorite }) => {
      queryClient.setQueryData(recipeFavoriteKeys.ids, (old) => setFavoriteId(old, recipeId, favorite));
      queryClient.setQueriesData({ queryKey: recipeKeys.all }, (old) =>
        patchFavoriteCount(old, recipeId, result.favoriteCount),
      );
      // Bộ sưu tập đã đổi nội dung nên bỏ cache để lần xem sau tải lại.
      queryClient.invalidateQueries({ queryKey: recipeFavoriteKeys.all, predicate: (q) => q.queryKey[1] !== "ids" });
    },
  });
}
