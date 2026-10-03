// Khóa cache React Query của feature recipe.
export const recipeKeys = {
  all: ["recipes"],
  list: (params) => ["recipes", "list", params],
  detail: (id) => ["recipes", "detail", id],
  mine: (size) => ["recipes", "mine", { size }],
};
