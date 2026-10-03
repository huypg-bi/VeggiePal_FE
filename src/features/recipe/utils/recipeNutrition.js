// BE không trả kcal/đạm của công thức, chỉ có danh sách nguyên liệu (số lượng + đơn vị)
// và dinh dưỡng trên 100g của từng nguyên liệu -> FE tự cộng lại.

// Quy đổi về gram. Đơn vị khác (ml, muỗng, quả...) không quy đổi được nên bỏ qua.
const GRAMS_PER_UNIT = { GRAM: 1, G: 1, KG: 1000 };

/** Số gram của một nguyên liệu trong công thức; null nếu không quy đổi được. */
export function toGrams(quantity, unit) {
  const factor = GRAMS_PER_UNIT[String(unit ?? "").trim().toUpperCase()];
  const amount = Number(quantity);
  if (factor == null || !Number.isFinite(amount) || amount <= 0) return null;
  return amount * factor;
}

/** Đơn vị này có quy đổi được ra gram (để tính kcal) không: GRAM / G / KG. */
export function isGramUnit(unit) {
  return toGrams(1, unit) !== null;
}

/**
 * Dinh dưỡng MỖI KHẨU PHẦN của công thức: { kcal, protein } (kcal làm tròn, đạm 1 số lẻ).
 * - ingredientsById: Map<id, Ingredient> (cần caloriesPer100g, proteinPer100g)
 * - Trả null nếu có bất kỳ nguyên liệu nào chưa tính được (thiếu dữ liệu hoặc đơn vị lạ),
 *   vì cộng thiếu sẽ ra con số thấp hơn thực tế và gây hiểu nhầm.
 */
export function calcRecipeNutrition(recipe, ingredientsById) {
  const items = recipe?.ingredients ?? [];
  if (items.length === 0) return null;

  let kcal = 0;
  let protein = 0;
  for (const item of items) {
    const grams = toGrams(item.quantity, item.unit);
    const ingredient = ingredientsById.get(item.ingredientId);
    if (grams == null || !ingredient) return null;

    kcal += (grams / 100) * Number(ingredient.caloriesPer100g ?? 0);
    protein += (grams / 100) * Number(ingredient.proteinPer100g ?? 0);
  }

  const servings = recipe.servings > 0 ? recipe.servings : 1;
  return {
    kcal: Math.round(kcal / servings),
    protein: Math.round((protein / servings) * 10) / 10,
  };
}

/** Tổng thời gian chuẩn bị + nấu (phút); 0 nếu BE không có dữ liệu. */
export function totalMinutes(recipe) {
  return (recipe?.prepTime ?? 0) + (recipe?.cookTime ?? 0);
}
