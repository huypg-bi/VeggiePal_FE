import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRecipe,
  deleteRecipe,
  publishRecipe,
  updateRecipe,
  uploadRecipeImage,
} from "@/features/recipe/api/recipeApi";
import { recipeFavoriteKeys, recipeKeys } from "@/features/recipe/queryKeys";

// Mọi thay đổi công thức làm mới toàn bộ cache "recipes" (danh sách công khai, chi tiết, của tôi).
function useInvalidateRecipes() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    queryClient.invalidateQueries({ queryKey: recipeFavoriteKeys.all });
  };
}

/** Tạo công thức (luôn là DRAFT). mutate(payload) -> RecipeResponse. */
export function useCreateRecipe() {
  const invalidate = useInvalidateRecipes();
  return useMutation({ mutationFn: createRecipe, onSuccess: invalidate });
}

/** Sửa công thức. mutate({ id, payload }) -> RecipeResponse. */
export function useUpdateRecipe() {
  const invalidate = useInvalidateRecipes();
  return useMutation({
    mutationFn: ({ id, payload }) => updateRecipe(id, payload),
    onSuccess: invalidate,
  });
}

/** Đăng công thức. mutate(id) -> RecipeResponse. */
export function usePublishRecipe() {
  const invalidate = useInvalidateRecipes();
  return useMutation({ mutationFn: publishRecipe, onSuccess: invalidate });
}

/** Xóa công thức. mutate(id). */
export function useDeleteRecipe() {
  const invalidate = useInvalidateRecipes();
  return useMutation({ mutationFn: deleteRecipe, onSuccess: invalidate });
}

/** Tải / thay ảnh công thức. mutate({ id, file }) -> RecipeResponse có imageUrl mới. */
export function useUploadRecipeImage() {
  const invalidate = useInvalidateRecipes();
  return useMutation({
    mutationFn: ({ id, file }) => uploadRecipeImage(id, file),
    onSuccess: invalidate,
  });
}
