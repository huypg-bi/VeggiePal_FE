import { useQueries } from "@tanstack/react-query";

import { getRecipe } from "@/features/recipe/api/recipeApi";
import { recipeKeys } from "@/features/recipe/queryKeys";

export function useDayRecipes(recipeIds) {
  const queries = useQueries({
    queries: recipeIds.map((id) => ({
      queryKey: recipeKeys.detail(id),
      queryFn: () => getRecipe(id),
      staleTime: 60 * 1000,
    })),
  });

  const byId = new Map();
  recipeIds.forEach((id, index) => {
    const query = queries[index];
    byId.set(id, { recipe: query.data, isPending: query.isPending, isError: query.isError });
  });
  return byId;
}
