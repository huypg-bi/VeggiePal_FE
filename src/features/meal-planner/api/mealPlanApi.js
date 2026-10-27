import { buildHealthUpdateBody } from "@/features/meal-planner/utils/mealPlan";
import apiClient from "@/shared/api/apiClient";

// Tạo thực đơn gọi LLM (đọc tối đa 45s, thử lại 2 lần) nên cho chờ lâu hơn mặc định.
const CREATE_TIMEOUT_MS = 120_000;

const EMPTY_PAGE = { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0, first: true, last: true };

// ai-service dùng dải mã 60xx. Message gốc của BE là tiếng Anh nên đổi sang tiếng Việt theo `code`.
const VI_MESSAGES = {
  6000: "Thông tin chưa hợp lệ, vui lòng kiểm tra lại các mục đã nhập (ví dụ mục tiêu dinh dưỡng có mức tối thiểu lớn hơn tối đa)",
  6001: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  6002: "Không tìm thấy thực đơn này",
  6003: "Bạn đã dùng hết lượt tạo thực đơn trong tháng này. Bạn có thể nâng cấp gói tại /pricing để tiếp tục hoặc quay lại vào tháng sau",
  6004: "AI đang tạm thời quá tải, vui lòng thử lại sau ít phút",
  6005: "Tính năng AI chưa được cấu hình trên máy chủ",
  6006: "Chưa lấy được dữ liệu công thức hoặc sức khỏe của bạn, vui lòng thử lại sau",
  6007: "AI chưa xếp được thực đơn đạt yêu cầu, vui lòng thử lại",
  6010: "Bạn cần cập nhật chiều cao và cân nặng trong hồ sơ sức khỏe trước khi lên thực đơn",
  6011: "Không tìm thấy món chay nào phù hợp với dị ứng và yêu cầu dinh dưỡng của bạn",
  6020: "Bạn cần cập nhật ngày sinh, giới tính và mức độ vận động trong hồ sơ để tính nhu cầu calo",
  6021: "Mục tiêu calo tự tính hiện chỉ dành cho người từ 18 tuổi trở lên. Bạn có thể tự đặt mục tiêu dinh dưỡng riêng",
  6014: "Thực đơn này đã có trong danh sách yêu thích",
  6015: "Thực đơn này chưa có trong danh sách yêu thích",
  6016: "Bạn không có quyền với thực đơn này",
  6017: "Không tìm thấy phiên bản này của thực đơn",
  6018: "Món này không phải món thuần chay, bạn chọn món khác nhé",
  6019: "Món này chứa thành phần gây dị ứng của bạn, bạn chọn món khác nhé",
  6999: "Máy chủ đang gặp lỗi, vui lòng thử lại sau ít phút",
};

// Lỗi 401/403 do Spring Security trả về có thể không kèm mã 60xx nên dựa thêm vào HTTP status.
function toMessage(res, fallbackMessage) {
  const byCode = VI_MESSAGES[res.data?.code];
  if (byCode) return byCode;
  if (res.status === 401) return VI_MESSAGES[6001];
  if (res.status === 429) return VI_MESSAGES[6003];
  if (res.status === 503) return VI_MESSAGES[6004];
  return res.data?.message || fallbackMessage;
}

// validateStatus tắt throw theo status, nên chỉ còn lỗi mạng / quá thời gian chờ rơi vào catch.
function networkError(error, timeoutMessage) {
  return new Error(
    error?.code === "ECONNABORTED" ? timeoutMessage : "Không kết nối được máy chủ, vui lòng thử lại",
    { cause: error },
  );
}

// Lỗi mang theo `code` của BE để giao diện nhận ra lỗi cần xử lý riêng (vd 6020 -> dẫn tới trang hồ sơ).
function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    const error = new Error(toMessage(res, fallbackMessage));
    error.code = res.data?.code;
    throw error;
  }
  return res.data?.result;
}

export async function createMealPlan(payload) {
  let res;
  try {
    res = await apiClient.post("/ai/meal-plans", payload, { timeout: CREATE_TIMEOUT_MS });
  } catch (error) {
    throw networkError(error, "Bé Bông Cải lên thực đơn hơi lâu, bạn thử lại sau một lát nhé");
  }
  return unwrap(res, "Tạo thực đơn thất bại");
}

/** GET /ai/meal-plans — các thực đơn của tôi, mới nhất trước. */
export async function getMealPlans() {
  const res = await apiClient.get("/ai/meal-plans");
  return unwrap(res, "Không lấy được danh sách thực đơn") ?? [];
}

export async function getNutritionTarget(goalType) {
  const res = await apiClient.get("/ai/meal-plans/nutrition-target", { params: { goalType } });
  return unwrap(res, "Không tính được mục tiêu dinh dưỡng");
}

/** GET /ai/meal-plans/:id — một thực đơn của tôi (dùng để lấy bản mới nhất từ server). */
export async function getMealPlan(id) {
  const res = await apiClient.get(`/ai/meal-plans/${id}`);
  return unwrap(res, "Không lấy được thực đơn");
}

/** GET /ai/meal-plans/favorites — các thực đơn yêu thích (phân trang, mới yêu thích trước). */
export async function getFavoriteMealPlans({ page = 0, size = 5 } = {}) {
  const res = await apiClient.get("/ai/meal-plans/favorites", { params: { page, size } });
  return unwrap(res, "Không lấy được danh sách thực đơn yêu thích") ?? EMPTY_PAGE;
}

/** GET /ai/meal-plans/favorites/:id — một thực đơn yêu thích. */
export async function getFavoriteMealPlan(id) {
  const res = await apiClient.get(`/ai/meal-plans/favorites/${id}`);
  return unwrap(res, "Không lấy được thực đơn yêu thích");
}

export async function favoriteMealPlan(id) {
  const res = await apiClient.post(`/ai/meal-plans/${id}/favorite`);
  if (res.data?.code === 6014) return;
  unwrap(res, "Không thêm được vào danh sách yêu thích");
}

/** DELETE /ai/meal-plans/:id/favorite — bỏ yêu thích. Chưa có trong yêu thích (6015) coi như đã xong. */
export async function unfavoriteMealPlan(id) {
  const res = await apiClient.delete(`/ai/meal-plans/${id}/favorite`);
  if (res.data?.code === 6015) return;
  unwrap(res, "Không bỏ được khỏi danh sách yêu thích");
}

export async function editMealPlan(id, { edits, changeSummary, preview = false }) {
  const res = await apiClient.post(`/ai/meal-plans/${id}/${preview ? "preview-edit" : "edit"}`, {
    preview,
    changeSummary: changeSummary || undefined,
    edits,
  });
  return unwrap(res, preview ? "Không xem trước được thay đổi" : "Lưu thay đổi thất bại");
}

/** GET /ai/meal-plans/:id/versions/:version — nội dung đầy đủ của một phiên bản cũ. */
export async function getMealPlanVersion(id, version) {
  const res = await apiClient.get(`/ai/meal-plans/${id}/versions/${version}`);
  return unwrap(res, "Không lấy được phiên bản này");
}

/** GET /ai/meal-plans/:id/versions — các phiên bản cũ của một thực đơn, mới nhất trước. */
export async function getMealPlanVersions(id) {
  const res = await apiClient.get(`/ai/meal-plans/${id}/versions`);
  return unwrap(res, "Không lấy được lịch sử phiên bản") ?? [];
}

export async function updatePlanFromHealth(id, { confirm = false, customTarget, changeSummary } = {}) {
  const res = await apiClient.post(
    `/ai/meal-plans/${id}/update-from-health`,
    buildHealthUpdateBody({ confirm, customTarget, changeSummary }),
  );
  return unwrap(res, confirm ? "Cập nhật thực đơn thất bại" : "Không xem trước được thực đơn cập nhật");
}

export async function replaceMeal(id, { day, mealType, currentRecipeId }) {
  let res;
  try {
    res = await apiClient.post(
      `/ai/meal-plans/${id}/replace`,
      { day, mealType, currentRecipeId },
      { timeout: CREATE_TIMEOUT_MS },
    );
  } catch (error) {
    throw networkError(error, "Đổi món hơi lâu, bạn thử lại sau một lát nhé");
  }
  return unwrap(res, "Đổi món thất bại");
}
