import apiClient from "@/shared/api/apiClient";

const EMPTY_PAGE = {
  content: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

const VI_MESSAGES = {
  1001: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại các trường đã nhập",
  1008: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  1009: "Bạn không có quyền thực hiện thao tác này",
  4003: "Có nguyên liệu không tồn tại",
  4100: "Công thức không tồn tại",
  4101: "Vui lòng nhập tên công thức",
  4102: "Bạn không thể chỉnh sửa công thức này",
  4103: "Công thức này đã được đăng rồi",
  4104: "Có nguyên liệu đã ngừng sử dụng, vui lòng chọn nguyên liệu khác",
  4105: "Có nguyên liệu bị chọn trùng, mỗi nguyên liệu chỉ được thêm một lần",
  4106: "Các bước thực hiện bị trùng số thứ tự, vui lòng thử lại",
  4107: "Có đơn vị nguyên liệu chưa được hỗ trợ, vui lòng chọn lại đơn vị",
  4108: "Công thức đã bị xóa hoặc đang bị ẩn nên không thể thực hiện thao tác này",
};

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(VI_MESSAGES[res.data?.code] ?? res.data?.message ?? fallbackMessage);
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
