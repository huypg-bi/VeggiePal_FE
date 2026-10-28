import { unwrapBlogResponse as unwrap } from "@/features/blog/api/blogErrors";
import apiClient from "@/shared/api/apiClient";

export async function getCategories({ type, activeOnly = true } = {}) {
  const res = await apiClient.get("/categories", {
    params: { type: type || undefined, activeOnly },
  });
  return unwrap(res, "Không lấy được danh mục") ?? [];
}

/** GET /categories/:id */
export async function getCategory(id) {
  const res = await apiClient.get(`/categories/${id}`);
  return unwrap(res, "Không lấy được danh mục");
}

/** POST /categories */
export async function createCategory(payload) {
  const res = await apiClient.post("/categories", payload);
  return unwrap(res, "Tạo danh mục thất bại");
}

/** PUT /categories/:id — chỉ đổi được tên, thứ tự hiển thị và trạng thái. */
export async function updateCategory(id, payload) {
  const res = await apiClient.put(`/categories/${id}`, payload);
  return unwrap(res, "Cập nhật danh mục thất bại");
}

/** DELETE /categories/:id — chỉ xóa được danh mục không còn bài viết và không có danh mục con. */
export async function deleteCategory(id) {
  const res = await apiClient.delete(`/categories/${id}`);
  unwrap(res, "Xóa danh mục thất bại");
}
