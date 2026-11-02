/** Ghi `favoriteCount` mới của một công thức vào dữ liệu cache (chi tiết, một trang, hoặc nhiều trang của danh sách vô hạn). */
export function patchFavoriteCount(data, recipeId, favoriteCount) {
  if (!data || typeof data !== "object") return data;

  if (Array.isArray(data.pages)) {
    return { ...data, pages: data.pages.map((page) => patchFavoriteCount(page, recipeId, favoriteCount)) };
  }
  if (Array.isArray(data.items)) {
    return {
      ...data,
      items: data.items.map((item) => (item.id === recipeId ? { ...item, favoriteCount } : item)),
    };
  }
  if (data.id === recipeId) return { ...data, favoriteCount };
  return data;
}

/** Thêm / bớt `recipeId` khỏi mảng id đã lưu mà không tạo bản trùng. */
export function setFavoriteId(ids, recipeId, favorited) {
  if (!Array.isArray(ids)) return ids;
  const rest = ids.filter((id) => id !== recipeId);
  return favorited ? [...rest, recipeId] : rest;
}
