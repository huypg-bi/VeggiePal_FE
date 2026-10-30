import { parseQuantity } from "../schema.js";

export const RECIPE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const RECIPE_IMAGE_TYPES = ["image/jpeg", "image/png"];

/** Kiểm tra ảnh công thức theo luật của BE (chỉ JPEG / PNG, ≤ 5MB, không nhận WEBP). Trả message lỗi hoặc null nếu hợp lệ. */
export function validateRecipeImage(file) {
  if (!file) return null;
  if (!RECIPE_IMAGE_TYPES.includes(file.type)) return "Ảnh công thức phải là JPEG hoặc PNG";
  if (file.size > RECIPE_IMAGE_MAX_BYTES) return "Ảnh công thức không được vượt quá 5MB";
  return null;
}

export const UNIT_OPTIONS = [
  { value: "GRAM", label: "gram" },
  { value: "KG", label: "kg" },
  { value: "ML", label: "ml" },
  { value: "TBSP", label: "muỗng canh" },
  { value: "TSP", label: "muỗng cà phê" },
  { value: "PIECE", label: "quả / củ / miếng" },
];

export function emptyRecipeForm() {
  return {
    title: "",
    description: "",
    imageUrl: "",
    servings: "2",
    prepTime: "",
    cookTime: "",
    ingredients: [],
    steps: [{ instruction: "" }],
  };
}

/** RecipeResponse (từ GET /recipes/:id) -> giá trị ban đầu của form sửa. */
export function recipeToFormValues(recipe) {
  const steps = [...(recipe.steps ?? [])]
    .sort((a, b) => a.stepNumber - b.stepNumber)
    .map((s) => ({ instruction: s.instruction }));

  return {
    title: recipe.title ?? "",
    description: recipe.description ?? "",
    imageUrl: "",
    servings: String(recipe.servings ?? 1),
    prepTime: recipe.prepTime == null ? "" : String(recipe.prepTime),
    cookTime: recipe.cookTime == null ? "" : String(recipe.cookTime),
    ingredients: (recipe.ingredients ?? []).map((i) => ({
      ingredientId: i.ingredientId,
      ingredientName: i.ingredientName,
      quantity: String(i.quantity),
      unit: i.unit,
      note: i.note ?? "",
    })),
    steps: steps.length > 0 ? steps : [{ instruction: "" }],
  };
}

/** Khi sửa (`isEdit`) không gửi imageUrl: BE giữ ảnh hiện tại và chỉ đổi ảnh qua POST /recipes/:id/image (khác link thì 4119). */
export function formValuesToPayload(values, { isEdit = false } = {}) {
  return {
    title: values.title.trim(),
    description: values.description.trim() || null,
    ...(isEdit ? {} : { imageUrl: values.imageUrl.trim() || null }),
    servings: Number(values.servings),
    prepTime: values.prepTime.trim() === "" ? null : Number(values.prepTime),
    cookTime: values.cookTime.trim() === "" ? null : Number(values.cookTime),
    ingredients: values.ingredients.map((i) => ({
      ingredientId: i.ingredientId,
      quantity: parseQuantity(i.quantity),
      unit: i.unit.trim(),
      note: i.note.trim() || null,
    })),
    steps: values.steps.map((s, index) => ({
      stepNumber: index + 1,
      instruction: s.instruction.trim(),
    })),
  };
}
