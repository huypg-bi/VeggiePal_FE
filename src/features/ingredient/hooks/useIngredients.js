import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getIngredients } from "@/features/ingredient/api/ingredientApi";
import { ingredientKeys } from "@/features/ingredient/queryKeys";

export function useIngredients(params = {}) {
  return useQuery({
    queryKey: ingredientKeys.list(params),
    queryFn: () => getIngredients(params),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}
