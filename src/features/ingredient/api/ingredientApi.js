import apiClient from "@/shared/api/apiClient";
import { INGREDIENT_ERROR_MESSAGES } from "@/shared/api/errorMessages";

const EMPTY_PAGE = { items: [], page: 0, size: 10, totalElements: 0, totalPages: 0 };

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(INGREDIENT_ERROR_MESSAGES[res.data?.code] ?? res.data?.message ?? fallbackMessage);
  }
  return res.data?.result;
}

export async function getIngredients({
  keyword,
  vegan,
  allergen,
  page = 0,
  size = 10,
} = {}) {
  const res = await apiClient.get("/ingredients", {
    params: {
      keyword: keyword?.trim() || undefined,
      vegan,
      allergen,
      page,
      size,
    },
  });
  return unwrap(res, "Không lấy được danh sách nguyên liệu") ?? EMPTY_PAGE;
}

/** GET /ingredients/:id */
export async function getIngredient(id) {
  const res = await apiClient.get(`/ingredients/${id}`);
  return unwrap(res, "Không lấy được thông tin nguyên liệu");
}

/** POST /ingredients */
export async function createIngredient(payload) {
  const res = await apiClient.post("/ingredients", payload);
  return unwrap(res, "Tạo nguyên liệu thất bại");
}

/** PUT /ingredients/:id */
export async function updateIngredient(id, payload) {
  const res = await apiClient.put(`/ingredients/${id}`, payload);
  return unwrap(res, "Cập nhật nguyên liệu thất bại");
}

export async function deleteIngredient(id) {
  const res = await apiClient.delete(`/ingredients/${id}`);
  if (res.status >= 500) {
    throw new Error(
      "Không xóa được nguyên liệu, có thể nó đang được dùng trong công thức. Hãy tắt “Đang sử dụng” để ẩn thay vì xóa."
    );
  }
  unwrap(res, "Xóa nguyên liệu thất bại");
}
