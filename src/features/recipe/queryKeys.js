// Khóa cache React Query của feature recipe.
export const recipeKeys = {
  all: ["recipes"],
  list: (params) => ["recipes", "list", params],
  feed: (params) => ["recipes", "feed", params],
  detail: (id) => ["recipes", "detail", id],
  mine: (size) => ["recipes", "mine", { size }],
};

// Công thức đã lưu (yêu thích) nằm ngoài gốc "recipes" để lưu / bỏ lưu không làm tải lại mọi danh sách công khai.
export const recipeFavoriteKeys = {
  all: ["recipe-favorites"],
  ids: ["recipe-favorites", "ids"],
  page: (size) => ["recipe-favorites", "page", { size }],
};
