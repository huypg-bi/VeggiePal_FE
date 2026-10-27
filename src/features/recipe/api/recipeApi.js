import apiClient from "@/shared/api/apiClient";
import { RECIPE_ERROR_MESSAGES } from "@/shared/api/errorMessages";

const EMPTY_PAGE = {
  content: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(RECIPE_ERROR_MESSAGES[res.data?.code] ?? res.data?.message ?? fallbackMessage);
  }
  return res.data?.result;
}

/** GET /recipes — công thức đã publish, mới nhất trước. keyword "" coi như không lọc. */
export async function getRecipes({ keyword, page = 0, size = 10 } = {}) {
  const res = await apiClient.get("/recipes", {
    params: { keyword: keyword?.trim() || undefined, page, size },
  });
  return unwrap(res, "Không lấy được danh sách công thức") ?? EMPTY_PAGE;
}

/** GET /recipes/:id */
export async function getRecipe(id) {
  const res = await apiClient.get(`/recipes/${id}`);
  return unwrap(res, "Không lấy được công thức");
}

export async function getMyRecipes({ page = 0, size = 10 } = {}) {
  const res = await apiClient.get("/recipes/me", { params: { page, size } });
  return unwrap(res, "Không lấy được công thức của bạn") ?? EMPTY_PAGE;
}

/** POST /recipes — tạo công thức ở trạng thái DRAFT. */
export async function createRecipe(payload) {
  const res = await apiClient.post("/recipes", payload);
  return unwrap(res, "Tạo công thức thất bại");
}

/** PUT /recipes/:id */
export async function updateRecipe(id, payload) {
  const res = await apiClient.put(`/recipes/${id}`, payload);
  return unwrap(res, "Cập nhật công thức thất bại");
}

/** POST /recipes/:id/publish — đăng công thức (lỗi 4103 nếu đã đăng rồi). */
export async function publishRecipe(id) {
  const res = await apiClient.post(`/recipes/${id}/publish`);
  return unwrap(res, "Đăng công thức thất bại");
}

/** DELETE /recipes/:id */
export async function deleteRecipe(id) {
  const res = await apiClient.delete(`/recipes/${id}`);
  unwrap(res, "Xóa công thức thất bại");
}
