// Chuyển đổi giữa dữ liệu form danh mục và CategoryRequest / CategoryResponse của BE.

export const CATEGORY_TYPE_OPTIONS = [
  { value: "FOOD_TYPE", label: "Loại món ăn" },
  { value: "RECIPE_TYPE", label: "Loại công thức" },
];

export const categoryTypeLabel = (type) =>
  CATEGORY_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;

export function emptyCategoryForm(type = "FOOD_TYPE") {
  return { name: "", type, displayOrder: "", active: true };
}

/** CategoryResponse -> giá trị ban đầu của form sửa. */
export function categoryToFormValues(category) {
  return {
    name: category.name ?? "",
    type: category.type,
    displayOrder: category.displayOrder == null ? "" : String(category.displayOrder),
    active: category.active ?? true,
  };
}

export function formValuesToCategoryPayload(values, { parentId, isEdit } = {}) {
  const payload = {
    name: values.name.trim(),
    active: values.active,
  };
  if (values.displayOrder.trim() !== "") payload.displayOrder = Number(values.displayOrder);
  if (!isEdit) {
    if (parentId) payload.parentId = parentId;
    else payload.type = values.type;
  }
  return payload;
}
