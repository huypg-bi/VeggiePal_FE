// Hàm thuần cho trang thực đơn: chuẩn hóa dữ liệu ai-service trả về và dựng payload gửi đi.

export const DAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const DAY_LABELS = {
  MONDAY: { short: "T2", long: "Thứ Hai" },
  TUESDAY: { short: "T3", long: "Thứ Ba" },
  WEDNESDAY: { short: "T4", long: "Thứ Tư" },
  THURSDAY: { short: "T5", long: "Thứ Năm" },
  FRIDAY: { short: "T6", long: "Thứ Sáu" },
  SATURDAY: { short: "T7", long: "Thứ Bảy" },
  SUNDAY: { short: "CN", long: "Chủ Nhật" },
};

// Thứ tự bữa trong ngày; BE chỉ trả 3 bữa này (chưa có bữa phụ).
export const MEAL_ORDER = ["BREAKFAST", "LUNCH", "DINNER"];

export const MEAL_LABELS = {
  BREAKFAST: "Bữa Sáng",
  LUNCH: "Bữa Trưa",
  DINNER: "Bữa Tối",
};

// BE không có giờ ăn, nên gán giờ gợi ý cố định theo loại bữa.
export const MEAL_TIMES = {
  BREAKFAST: "07:30",
  LUNCH: "12:15",
  DINNER: "19:00",
};

/** "Monday" / " monday " -> "MONDAY". BE không đảm bảo chữ hoa/thường của `day`. */
export function normalizeDay(day) {
  return String(day ?? "").trim().toUpperCase();
}

/** Thứ của một ngày (theo giờ máy người dùng) dưới dạng khóa như "MONDAY". */
export function dayKeyOf(date = new Date()) {
  // Date.getDay(): 0 = Chủ nhật. DAY_ORDER bắt đầu từ thứ Hai.
  return DAY_ORDER[(date.getDay() + 6) % 7];
}

function orderIndex(order, key) {
  const index = order.indexOf(key);
  return index === -1 ? order.length : index;
}

/** Các ngày của thực đơn theo thứ tự T2 -> CN (ngày lạ nằm cuối). Không đổi mảng gốc. */
export function sortedDays(plan) {
  const days = Array.isArray(plan?.plan?.days) ? plan.plan.days : [];
  return [...days].sort(
    (a, b) => orderIndex(DAY_ORDER, normalizeDay(a.day)) - orderIndex(DAY_ORDER, normalizeDay(b.day)),
  );
}

/** Các bữa của một ngày theo thứ tự sáng -> trưa -> tối. */
export function sortedMeals(day) {
  const meals = Array.isArray(day?.meals) ? day.meals : [];
  return [...meals].sort(
    (a, b) =>
      orderIndex(MEAL_ORDER, normalizeDay(a.mealType)) - orderIndex(MEAL_ORDER, normalizeDay(b.mealType)),
  );
}

export function dayLabel(day) {
  const key = normalizeDay(day?.day);
  return DAY_LABELS[key] ?? { short: key.slice(0, 2) || "?", long: String(day?.day ?? "") };
}

/** Nhãn bữa ăn tiếng Việt. */
export function mealLabel(mealType) {
  return MEAL_LABELS[normalizeDay(mealType)] ?? String(mealType ?? "");
}

export function mealTime(mealType) {
  return MEAL_TIMES[normalizeDay(mealType)] ?? "";
}

/** Số nguyên không âm làm tròn; undefined/NaN -> 0. */
export function toRounded(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

/**
 * Tỉ lệ năng lượng (%) của tinh bột / đạm / béo trong một ngày, tổng đúng 100.
 * Quy đổi theo năng lượng: đạm 4 kcal/g, tinh bột 4 kcal/g, béo 9 kcal/g.
 * Trả null khi chưa có dữ liệu (tổng bằng 0).
 */
export function macroPercentages(totals) {
  const energy = {
    carb: Math.max(0, Number(totals?.carbohydrate) || 0) * 4,
    protein: Math.max(0, Number(totals?.protein) || 0) * 4,
    fat: Math.max(0, Number(totals?.fat) || 0) * 9,
  };
  const sum = energy.carb + energy.protein + energy.fat;
  if (sum <= 0) return null;

  const keys = ["carb", "protein", "fat"];
  const exact = keys.map((key) => (energy[key] / sum) * 100);
  const result = exact.map(Math.floor);
  // Chia phần dư còn thiếu để đủ 100, ưu tiên phần thập phân lớn nhất.
  let missing = 100 - result.reduce((a, b) => a + b, 0);
  const byRemainder = exact
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder);
  for (const { index } of byRemainder) {
    if (missing <= 0) break;
    result[index] += 1;
    missing -= 1;
  }
  return { carb: result[0], protein: result[1], fat: result[2] };
}

// Nhãn + đơn vị của từng chất trong `targetDeviations` mà BE gắn vào ngày không đạt mục tiêu.
const TARGET_METRICS = [
  { key: "calories", label: "Năng lượng", unit: "kcal" },
  { key: "protein", label: "Đạm", unit: "g" },
  { key: "carbohydrate", label: "Tinh bột", unit: "g" },
  { key: "fat", label: "Chất béo", unit: "g" },
];

function formatAmount(value) {
  return Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 1 });
}

/** Khoảng mục tiêu dạng chữ: "1.500–1.800 kcal", "≥ 80 g" hoặc "≤ 60 g". */
function describeRange(min, max, unit) {
  const hasMin = min != null && Number.isFinite(Number(min));
  const hasMax = max != null && Number.isFinite(Number(max));
  if (hasMin && hasMax) return `${formatAmount(min)}–${formatAmount(max)} ${unit}`;
  if (hasMin) return `≥ ${formatAmount(min)} ${unit}`;
  if (hasMax) return `≤ ${formatAmount(max)} ${unit}`;
  return "";
}

/**
 * Các chất mà ngày này lệch khỏi mục tiêu (ngoài dung sai của BE), lấy từ `day.targetDeviations`.
 * BE không từ chối thực đơn mà chỉ đánh dấu: `targetMet: false` + `targetDeviations: { protein: { actual, min?, max? } }`.
 * Trả mảng { key, label, unit, actual, range } theo thứ tự năng lượng, đạm, tinh bột, béo; rỗng khi ngày đạt
 * mục tiêu, không đặt mục tiêu hoặc thực đơn cũ chưa có hai trường này.
 */
export function dayTargetDeviations(day) {
  const deviations = day?.targetDeviations;
  if (day?.targetMet === true || !deviations || typeof deviations !== "object") return [];

  return TARGET_METRICS.filter(({ key }) => deviations[key] && typeof deviations[key] === "object").map(
    ({ key, label, unit }) => {
      const { actual, min, max } = deviations[key];
      return { key, label, unit, actual: Number(actual) || 0, range: describeRange(min, max, unit) };
    },
  );
}

/** Số ngày của thực đơn không đạt mục tiêu dinh dưỡng. */
export function countMissedDays(plan) {
  return sortedDays(plan).filter((day) => dayTargetDeviations(day).length > 0).length;
}

// Các mốc mục tiêu dinh dưỡng mỗi ngày, đúng tên field của GenerateRequest.dailyNutritionTarget.
export const TARGET_FIELDS = [
  "minCalories",
  "maxCalories",
  "minProtein",
  "maxProtein",
  "minCarbohydrate",
  "maxCarbohydrate",
  "minFat",
  "maxFat",
];

/** "1,500" / "1500,5" / "1500.5" -> số. Chuỗi rỗng hoặc không phải số -> NaN. */
export function parseTargetNumber(text) {
  const clean = String(text ?? "").trim().replace(",", ".");
  return clean === "" ? Number.NaN : Number(clean);
}

/**
 * Dựng dailyNutritionTarget từ các ô nhập (chuỗi). Ô trống bị bỏ qua; không có ô nào thì
 * trả undefined để KHÔNG gửi mục tiêu (khỏi ràng buộc thực đơn không cần thiết).
 */
export function buildNutritionTarget(values) {
  const target = {};
  for (const field of TARGET_FIELDS) {
    const n = parseTargetNumber(values?.[field]);
    if (Number.isFinite(n)) target[field] = n;
  }
  return Object.keys(target).length > 0 ? target : undefined;
}

/** Payload cho POST /ai/meal-plans từ giá trị form + nguyên liệu/khẩu vị đã chọn. */
export function buildGeneratePayload({ name, healthGoal, preferences, ingredients, target }) {
  const payload = {
    name: name.trim(),
    healthGoal: healthGoal.trim(),
    preferences: preferences.map((p) => p.trim()).filter(Boolean),
    availableIngredients: ingredients.map((i) => i.trim()).filter(Boolean),
  };
  const dailyNutritionTarget = buildNutritionTarget(target);
  if (dailyNutritionTarget) payload.dailyNutritionTarget = dailyNutritionTarget;
  return payload;
}

/** "dd/MM" của một ngày, ví dụ "07/10". */
export function formatDayMonth(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

/** Thứ Hai của tuần (T2 -> CN) chứa `date`, lúc 00:00 giờ máy người dùng. */
export function weekStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - ((date.getDay() + 6) % 7));
}

/**
 * Tên gợi ý cho thực đơn mới: cả tuần T2 -> CN chứa ngày tạo, ví dụ tạo ngày 17/10 -> "Thực đơn 12/10 - 18/10".
 * BE chỉ lưu thứ (MONDAY..SUNDAY) chứ không lưu ngày cụ thể, nên lấy tuần lịch là khớp nhất với dữ liệu.
 */
export function defaultPlanName(date = new Date()) {
  const start = weekStart(date);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  return `Thực đơn ${formatDayMonth(start)} - ${formatDayMonth(end)}`;
}

/**
 * Ngày cụ thể của một thứ trong thực đơn, tính theo tuần chứa ngày tạo (`plan.createdAt`).
 * Trả null khi thiếu createdAt / thứ lạ.
 */
export function planDayDate(plan, dayKey) {
  const index = DAY_ORDER.indexOf(normalizeDay(dayKey));
  const created = new Date(plan?.createdAt);
  if (index === -1 || Number.isNaN(created.getTime())) return null;
  const start = weekStart(created);
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
}

/** Hai ngày có cùng ngày-tháng-năm (bỏ qua giờ) không. */
export function isSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

/** Thay một thực đơn trong danh sách đã cache bằng bản mới (theo id). */
export function replacePlanInList(list, updated) {
  if (!Array.isArray(list)) return list;
  return list.map((plan) => (plan.id === updated.id ? updated : plan));
}
