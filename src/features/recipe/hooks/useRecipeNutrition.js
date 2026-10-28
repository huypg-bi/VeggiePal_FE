import { useMemo } from "react";

import { calcRecipeNutrition, nutritionGapHint } from "@/features/recipe/utils/recipeNutrition";

export function useRecipeNutrition(recipes) {
  return useMemo(() => {
    const nutritionById = new Map();
    const gapById = new Map();
    for (const recipe of recipes ?? []) {
      const nutrition = calcRecipeNutrition(recipe);
      nutritionById.set(recipe.id, nutrition);
      const gap = nutrition ? null : nutritionGapHint(recipe);
      if (gap) gapById.set(recipe.id, gap);
    }
    return { nutritionById, gapById };
  }, [recipes]);
}
