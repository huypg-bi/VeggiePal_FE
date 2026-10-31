import apiClient from "@/shared/api/apiClient";
import { DIARY_ERROR_MESSAGES } from "@/shared/api/errorMessages";

function toMessage(res, fallbackMessage) {
  const byCode = DIARY_ERROR_MESSAGES[res.data?.code];
  if (byCode) return byCode;
  if (res.status === 401) return DIARY_ERROR_MESSAGES[1008];
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

export async function updateWater({ id, date, milliliters }) {
  const res = await apiClient.put(`/nutrition/me/diary/water/${id}`, { date, milliliters });
  return unwrap(res, "Không sửa được lượng nước");
}

export async function deleteWater(id) {
  const res = await apiClient.delete(`/nutrition/me/diary/water/${id}`);
  unwrap(res, "Không xóa được lần uống nước");
}

export async function addActivity({ date, activityType, minutes }) {
  const res = await apiClient.post("/nutrition/me/diary/activities", { date, activityType, minutes });
  return unwrap(res, "Không ghi được hoạt động");
}

export async function updateActivity({ id, date, activityType, minutes }) {
  const res = await apiClient.put(`/nutrition/me/diary/activities/${id}`, { date, activityType, minutes });
  return unwrap(res, "Không sửa được hoạt động");
}

export async function deleteActivity(id) {
  const res = await apiClient.delete(`/nutrition/me/diary/activities/${id}`);
  unwrap(res, "Không xóa được hoạt động");
}
