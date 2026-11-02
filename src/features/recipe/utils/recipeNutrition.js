const GRAM_UNITS = new Set(["G", "GR", "GAM", "GRAM", "GRAMS", "KG", "KILO", "KILOGRAM", "KILOGRAMS", "MG"]);

/** Đơn vị khối lượng (gram, kg, mg): BE luôn quy đổi được, các đơn vị khác chỉ quy đổi được với một số nguyên liệu quen thuộc. */
export function isGramUnit(unit) {
  return GRAM_UNITS.has(String(unit ?? "").trim().toUpperCase());
}

/**
 * Đọc dinh dưỡng mỗi khẩu phần do BE tính (`recipe.nutritionPerServing`).
 * Trả { nutrition: { kcal, protein, carbs, fat } | null, gap: string | null }; thiếu quy đổi thì không hiện số
 * (BE bỏ dòng đó khỏi tổng nên con số sẽ thấp hơn thật) mà nêu tên nguyên liệu chưa tính được.
 */
export function readRecipeNutrition(recipe) {
  const perServing = recipe?.nutritionPerServing;
  if (!perServing || (recipe.ingredients ?? []).length === 0) return { nutrition: null, gap: null };

  if (!perServing.complete) {
    const names = perServing.missingIngredients ?? [];
    return {
      nutrition: null,
      gap: names.length > 0 ? `Chưa tính được dinh dưỡng vì chưa quy đổi được số lượng của: ${names.join(", ")}.` : null,
    };
  }

  return {
    nutrition: {
      kcal: Math.round(Number(perServing.calories)),
      protein: Number(perServing.protein),
      carbs: Number(perServing.carbs),
      fat: Number(perServing.fat),
    },
    gap: null,
  };
}

/** Tổng thời gian chuẩn bị + nấu (phút); 0 nếu BE không có dữ liệu. */
export function totalMinutes(recipe) {
  return (recipe?.prepTime ?? 0) + (recipe?.cookTime ?? 0);
}
