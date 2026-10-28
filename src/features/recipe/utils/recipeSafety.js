/** Nguyên liệu này có được đánh dấu dễ gây dị ứng không. */
export function isAllergenIngredient(item) {
  return item?.allergen === true;
}

/** Nguyên liệu này bị đánh dấu không thuần chay không (thiếu cờ thì coi như không biết, không cảnh báo). */
export function isNonVeganIngredient(item) {
  return item?.vegan === false;
}

/** Tên các nguyên liệu cần cảnh báo của một công thức: { allergens: string[], nonVegan: string[] }. */
export function collectIngredientWarnings(recipe) {
  const allergens = [];
  const nonVegan = [];
  for (const item of recipe?.ingredients ?? []) {
    const name = String(item.ingredientName ?? "").trim() || "Nguyên liệu";
    if (isAllergenIngredient(item)) allergens.push(name);
    if (isNonVeganIngredient(item)) nonVegan.push(name);
  }
  return { allergens, nonVegan };
}
