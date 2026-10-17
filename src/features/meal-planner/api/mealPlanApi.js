import apiClient from "@/shared/api/apiClient";

/**
 * Meal plan APIs (ai-service qua api-gateway). Tất cả cần đăng nhập.
 * FE gọi `/ai/...` vì baseURL đã là `.../api` (gateway có route /api/ai/** -> /ai/**).
 *   POST /ai/meal-plans              tạo thực đơn 7 ngày (gọi LLM nên chậm, có thể vài chục giây)
 *   GET  /ai/meal-plans              các thực đơn đã lưu (kèm đủ nội dung), mới nhất trước
 *   POST /ai/meal-plans/:id/replace  đổi một món, trả về cả thực đơn sau khi cập nhật
 *
 * MealPlan: { id, name, goal, createdAt, updatedAt, plan: {
 *   days: [{ day: "MONDAY", meals: [{ mealType: "BREAKFAST"|"LUNCH"|"DINNER", recipeId, note?,
 *     servingMultiplier?, nutrition: { calories, protein, carbohydrate, fat } }], nutritionTotals: { ... } }],
 *   constraints: { preferences, availableIngredients, allergies, healthRecord, dailyNutritionTarget } } }
 * nutrition do BE cộng từ nguyên liệu (không phải AI tự bịa) và ĐÃ nhân `servingMultiplier`.
 * servingMultiplier (0.75 - 1.5) chỉ có khi BE co giãn khẩu phần để tổng calo ngày gần mục tiêu.
 * BE luôn trả đủ 7 ngày × 3 bữa; `day` là "MONDAY".."SUNDAY" (vẫn chuẩn hóa ở utils/mealPlan.js).
 * Nếu AI lỗi, BE tự lập thực đơn bằng thuật toán cố định nên FE không phân biệt được hai trường hợp.
 * Lỗi cần xử lý riêng: 6010 (chưa có hồ sơ sức khỏe), 6011 (không còn món phù hợp),
 * 6012 (mục tiêu dinh dưỡng không đạt được, dung sai 15%).
 * Meal chỉ có recipeId, tên/ảnh món lấy qua GET /recipes/:id.
 */

// Tạo thực đơn gọi LLM (đọc tối đa 45s, thử lại 2 lần) nên cho chờ lâu hơn mặc định.
const CREATE_TIMEOUT_MS = 120_000;

// ai-service dùng dải mã 60xx. Message gốc của BE là tiếng Anh nên đổi sang tiếng Việt theo `code`.
const VI_MESSAGES = {
  6000: "Thông tin chưa hợp lệ, vui lòng kiểm tra lại các mục đã nhập (ví dụ mục tiêu dinh dưỡng có mức tối thiểu lớn hơn tối đa)",
  6001: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
  6002: "Không tìm thấy thực đơn này",
  6003: "Bạn đã dùng hết lượt AI hôm nay, vui lòng quay lại vào ngày mai",
  6004: "AI đang tạm thời quá tải, vui lòng thử lại sau ít phút",
  6005: "Tính năng AI chưa được cấu hình trên máy chủ",
  6006: "Chưa lấy được dữ liệu công thức hoặc sức khỏe của bạn, vui lòng thử lại sau",
  6007: "AI chưa xếp được thực đơn đạt yêu cầu, vui lòng thử lại",
  6010: "Bạn cần cập nhật chiều cao và cân nặng trong hồ sơ sức khỏe trước khi lên thực đơn",
  6011: "Không tìm thấy món chay nào phù hợp với dị ứng và yêu cầu dinh dưỡng của bạn",
  6012: "Mục tiêu dinh dưỡng quá chặt so với các món hiện có. Hãy nới khoảng calo, đạm, tinh bột hoặc béo rồi thử lại",
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

function unwrap(res, fallbackMessage) {
  if (res.status >= 400) {
    throw new Error(toMessage(res, fallbackMessage));
  }
  return res.data?.result;
}

/**
 * POST /ai/meal-plans
 * Body: { name, healthGoal, preferences?: string[], availableIngredients?: string[],
 *   dailyNutritionTarget?: { minCalories, maxCalories, minProtein, maxProtein,
 *   minCarbohydrate, maxCarbohydrate, minFat, maxFat } } (mọi mốc đều tùy chọn)
 */
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

/**
 * POST /ai/meal-plans/:id/replace — đổi một bữa sang món khác.
 * Body: { day, mealType, currentRecipeId } (day lấy đúng chuỗi BE đã trả trong plan.days[].day).
 */
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
