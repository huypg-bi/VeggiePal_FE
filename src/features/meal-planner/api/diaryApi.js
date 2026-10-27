import apiClient from "@/shared/api/apiClient";

/**
 * Nhật ký ăn uống (nutrition-service qua api-gateway, cần đăng nhập). Ngày tính theo múi giờ Asia/Ho_Chi_Minh,
 * gửi dạng "YYYY-MM-DD" (BE để trống thì lấy hôm nay).
 *   GET    /nutrition/me/diary?date=                              tổng kết một ngày
 *   PUT    /nutrition/me/diary/meal-plans/:planId/meals/:mealType xác nhận đã ăn { date, servings? }
 *   DELETE /nutrition/me/diary/meal-plans/:planId/meals/:mealType?date=  bỏ xác nhận
 *   POST   /nutrition/me/diary/water                               { date, milliliters }
 *   DELETE /nutrition/me/diary/water/:id
 *   POST   /nutrition/me/diary/activities                          { date, activityType, minutes }
 *   DELETE /nutrition/me/diary/activities/:id
 * DailySummary: { date, timezone, meals, nutrition, water, totalWaterMl, activities, totalActivityMinutes }
 * MealEntry: { id, date, source, mealPlanId, mealType, recipeId, title, servings,
 *   nutrition: { calories, protein, carbohydrate, fat }, recordedAt }
 */

// Mã lỗi nutrition-service (20xx) -> tiếng Việt. Message gốc của BE là tiếng Anh.
const VI_MESSAGES = {
  1001: "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại",
  1008: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  1018: "Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại",
  2010: "Khẩu phần phải từ 0,01 đến 100, tối đa 2 chữ số thập phân",
  2011: "Lượng nước phải là số nguyên ml lớn hơn 0 và tối đa 100.000",
  2012: "Hãy nhập loại vận động (tối đa 100 ký tự) và số phút từ 1 đến 1440",
  2013: "Không tìm thấy bản ghi này trong nhật ký, có thể nó đã bị xóa",
  2014: "Thực đơn hoặc bữa ăn này không có trong ngày đã chọn",
  2015: "Chưa lấy được thực đơn để ghi bữa ăn, vui lòng thử lại sau",
};

function toMessage(res, fallbackMessage) {
  const byCode = VI_MESSAGES[res.data?.code];
  if (byCode) return byCode;
  if (res.status === 401) return VI_MESSAGES[1008];
  if (res.status === 403) return "Bạn không có quyền thực hiện thao tác này";
  if (res.status === 503) return "Hệ thống đang bận, vui lòng thử lại sau";
  return fallbackMessage;
}

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    const error = new Error(toMessage(res, fallbackMessage));
    error.code = res.data?.code;
    throw error;
  }
  return res.data?.result;
}

/** GET /nutrition/me/diary — các bữa đã xác nhận, nước, vận động và tổng dinh dưỡng của `date`. */
export async function getDiary(date) {
  const res = await apiClient.get("/nutrition/me/diary", { params: { date } });
  return unwrap(res, "Không lấy được nhật ký ăn uống");
}

/** Xác nhận đã ăn một bữa của thực đơn. Đã xác nhận rồi thì BE trả lại bản đã lưu, bỏ qua `servings` mới. */
export async function confirmMeal({ planId, mealType, date, servings }) {
  const res = await apiClient.put(`/nutrition/me/diary/meal-plans/${planId}/meals/${mealType}`, { date, servings });
  return unwrap(res, "Không ghi được bữa ăn");
}

/** Bỏ xác nhận (idempotent). */
export async function cancelMeal({ planId, mealType, date }) {
  const res = await apiClient.delete(`/nutrition/me/diary/meal-plans/${planId}/meals/${mealType}`, {
    params: { date },
  });
  unwrap(res, "Không bỏ được đánh dấu bữa ăn");
}

export async function addWater({ date, milliliters }) {
  const res = await apiClient.post("/nutrition/me/diary/water", { date, milliliters });
  return unwrap(res, "Không ghi được lượng nước");
}

export async function deleteWater(id) {
  const res = await apiClient.delete(`/nutrition/me/diary/water/${id}`);
  unwrap(res, "Không xóa được lần uống nước");
}

export async function addActivity({ date, activityType, minutes }) {
  const res = await apiClient.post("/nutrition/me/diary/activities", { date, activityType, minutes });
  return unwrap(res, "Không ghi được hoạt động");
}

export async function deleteActivity(id) {
  const res = await apiClient.delete(`/nutrition/me/diary/activities/${id}`);
  unwrap(res, "Không xóa được hoạt động");
}
