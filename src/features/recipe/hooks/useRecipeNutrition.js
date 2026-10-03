import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import { getIngredient } from "@/features/ingredient/api/ingredientApi";
import { ingredientKeys } from "@/features/ingredient/queryKeys";
import { calcRecipeNutrition } from "@/features/recipe/utils/recipeNutrition";

/**
 * Dinh dưỡng mỗi khẩu phần của danh sách công thức.
 * Lấy dinh dưỡng/100g của từng nguyên liệu qua GET /ingredients/:id (dùng chung cache
 * với useIngredient nên nguyên liệu trùng giữa các công thức chỉ gọi 1 lần).
 *
 * Trả về: { nutritionById: Map<recipeId, { kcal, protein } | null>, loading }
 * null nghĩa là chưa tính được (đang tải, lỗi, hoặc nguyên liệu có đơn vị không quy đổi được).
 */
export function useRecipeNutrition(recipes) {
  const ingredientIds = useMemo(() => {
    const ids = new Set();
    for (const recipe of recipes ?? []) {
      for (const item of recipe.ingredients ?? []) ids.add(item.ingredientId);
    }
    return [...ids].sort((a, b) => a - b);
  }, [recipes]);

  const results = useQueries({
    queries: ingredientIds.map((id) => ({
      queryKey: ingredientKeys.detail(id),
      queryFn: () => getIngredient(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const loading = results.some((r) => r.isPending);
  // `results` đổi tham chiếu mỗi lần render, nên khóa theo dữ liệu đã tải thay vì theo mảng.
  const loadedKey = results.map((r) => r.dataUpdatedAt).join(",");

  const nutritionById = useMemo(() => {
    const byId = new Map(
      results.filter((r) => r.data).map((r) => [r.data.id, r.data])
    );
    return new Map(
      (recipes ?? []).map((recipe) => [recipe.id, calcRecipeNutrition(recipe, byId)])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, loadedKey]);

  return { nutritionById, loading };
}
