import { useMemo } from "react";

import { readRecipeNutrition } from "@/features/recipe/utils/recipeNutrition";

/** Dinh dưỡng mỗi khẩu phần của từng công thức (theo id) và lý do khi chưa tính được; số liệu do BE tính sẵn. */
export function useRecipeNutrition(recipes) {
  return useMemo(() => {
    const nutritionById = new Map();
    const gapById = new Map();
    for (const recipe of recipes ?? []) {
      const { nutrition, gap } = readRecipeNutrition(recipe);
      nutritionById.set(recipe.id, nutrition);
      if (gap) gapById.set(recipe.id, gap);
    }
    return { nutritionById, gapById };
  }, [recipes]);
}
