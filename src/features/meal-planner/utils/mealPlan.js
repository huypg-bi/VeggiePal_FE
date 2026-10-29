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

export function dayTargetDeviations(day) {
  return day?.targetMet === true ? [] : listDeviations(day);
}

export function dayMacroNotes(day) {
  return day?.targetMet === true ? listDeviations(day) : [];
}

function listDeviations(day) {
  const deviations = day?.targetDeviations;
  if (!deviations || typeof deviations !== "object") return [];

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

// Bốn chất hiển thị trong các bảng so sánh (key khớp `nutritionTotals` của BE).
export const MACRO_ROWS = [
  { key: "calories", label: "Năng lượng", unit: "kcal" },
  { key: "protein", label: "Đạm", unit: "g" },
  { key: "carbohydrate", label: "Tinh bột", unit: "g" },
  { key: "fat", label: "Chất béo", unit: "g" },
];

// Các mức khẩu phần cho chọn khi sửa thủ công (BE chỉ cần > 0).
export const SERVING_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/** 1.25 -> "×1,25"; 1 -> "×1". */
export function formatServing(value) {
  return `×${Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}`;
}

/** Ngày có thứ `key` trong phần `plan` (có days[]), không phân biệt hoa thường. Không có thì null. */
export function findDayByKey(planBody, key) {
  const days = Array.isArray(planBody?.days) ? planBody.days : [];
  return days.find((day) => normalizeDay(day.day) === normalizeDay(key)) ?? null;
}

export function buildMealEdits({ day, mealType, currentRecipeId, currentMultiplier = 1, recipeId, multiplier }) {
  if (recipeId !== currentRecipeId) {
    return [{ day, mealType, action: "REPLACE", recipeId, servingMultiplier: multiplier }];
  }
  if (Math.abs(multiplier - currentMultiplier) > 0.001) {
    return [{ day, mealType, action: "UPDATE_SERVING", servingMultiplier: multiplier }];
  }
  return [];
}

const TARGET_SUFFIX ={ calories: "Calories", protein: "Protein", carbohydrate: "Carbohydrate", fat: "Fat" };

export function targetRangeLines(target) {
  if (!target) return [];
  return TARGET_METRICS.map(({ key, label, unit }) => ({
    key,
    label,
    unit,
    range: describeRange(target[`min${TARGET_SUFFIX[key]}`], target[`max${TARGET_SUFFIX[key]}`], unit),
  })).filter((line) => line.range);
}

export function averageDailyTotals(planBody) {
  const days = Array.isArray(planBody?.days) ? planBody.days.filter((day) => day?.nutritionTotals) : [];
  if (days.length === 0) return null;
  const average = (key) =>
    Math.round(days.reduce((sum, day) => sum + (Number(day.nutritionTotals[key]) || 0), 0) / days.length);
  return {
    calories: average("calories"),
    protein: average("protein"),
    carbohydrate: average("carbohydrate"),
    fat: average("fat"),
  };
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

// Số có dấu phân cách hàng nghìn: nhóm đúng 3 chữ số, nhóm đầu 1-3 chữ số không bắt đầu bằng 0 (nên "0,500" vẫn là 0,5).
const EN_GROUPED_NUMBER = /^[1-9]\d{0,2}(,\d{3})+(\.\d+)?$/; // 1,500 / 1,500.5
const VI_GROUPED_NUMBER = /^[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/; // 1.500 / 1.500,5

export function parseTargetNumber(text) {
  const clean = String(text ?? "").trim();
  if (clean === "") return Number.NaN;
  if (EN_GROUPED_NUMBER.test(clean)) return Number(clean.replaceAll(",", ""));
  if (VI_GROUPED_NUMBER.test(clean)) return Number(clean.replaceAll(".", "").replace(",", "."));
  return Number(clean.replace(",", "."));
}

export function buildNutritionTarget(values) {
  const target = {};
  for (const field of TARGET_FIELDS) {
    const n = parseTargetNumber(values?.[field]);
    if (Number.isFinite(n)) target[field] = n;
  }
  return Object.keys(target).length > 0 ? target : undefined;
}

/** Hai mục tiêu (kết quả của buildNutritionTarget) có giống nhau không; undefined = không đặt mục tiêu riêng. */
export function sameTarget(a, b) {
  const left = a ?? {};
  const right = b ?? {};
  return TARGET_FIELDS.every((field) => left[field] === right[field]);
}

export function buildHealthUpdateBody({ confirm, customTarget, changeSummary }) {
  const body = { confirm: Boolean(confirm) };
  if (customTarget && Object.keys(customTarget).length > 0) body.customTarget = customTarget;
  const summary = String(changeSummary ?? "").trim();
  if (summary) body.changeSummary = summary;
  return body;
}

// Mục tiêu của thực đơn, giá trị khớp enum GoalType của BE. `label` cũng là mô tả mặc định gửi vào `healthGoal`.
export const GOAL_OPTIONS = [
  { value: "LOSE", label: "Giảm cân", hint: "Ăn ít hơn nhu cầu khoảng 15%" },
  { value: "MAINTAIN", label: "Duy trì", hint: "Ăn đúng nhu cầu mỗi ngày" },
  { value: "GAIN", label: "Tăng cân", hint: "Ăn nhiều hơn nhu cầu khoảng 15%" },
];

/** Nhãn tiếng Việt của goalType; thực đơn cũ chưa có goalType (null) hoặc giá trị lạ thì trả chuỗi rỗng. */
export function goalLabel(goalType) {
  return GOAL_OPTIONS.find((option) => option.value === goalType)?.label ?? "";
}

export function planGoalNote(plan) {
  const goal = String(plan?.goal ?? "").trim();
  const label = goalLabel(plan?.goalType);
  if (!label) return goal;
  if (goal === label) return "";
  return goal.startsWith(`${label}: `) ? goal.slice(label.length + 2) : goal;
}

/** Mục tiêu của thực đơn trên một dòng: "Giảm cân · ăn thanh đạm", "Duy trì", hoặc nguyên `goal` với thực đơn cũ. */
export function planGoalSummary(plan) {
  const label = goalLabel(plan?.goalType);
  const note = planGoalNote(plan);
  if (!label) return note;
  return note ? `${label} · ${note}` : label;
}

// BE chỉ tự tính mục tiêu calo cho người từ 18 tuổi trở lên (lỗi 6021).
const ADULT_AGE = 18;

export function missingProfileFields(profile) {
  if (!profile) return [];
  return ["dateOfBirth", "gender", "activityLevel"].filter((field) => !profile[field]);
}

export function profileFixState(missingFields = []) {
  return { missingFields, returnTo: "/meal-planner", returnLabel: "Quay lại thực đơn" };
}

export function profileTargetIssue(profile, today = new Date()) {
  if (!profile) return null;
  if (!profile.dateOfBirth || !profile.gender || !profile.activityLevel) return "incomplete";

  const [year, month, day] = String(profile.dateOfBirth).slice(0, 10).split("-").map(Number);
  if (![year, month, day].every(Number.isFinite)) return "incomplete";

  const hadBirthday = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);
  const age = today.getFullYear() - year - (hadBirthday ? 0 : 1);
  return age < ADULT_AGE ? "underage" : null;
}

export function buildHealthGoalText(goalType, note) {
  const label = goalLabel(goalType);
  const extra = String(note ?? "").trim();
  return extra ? `${label}: ${extra}` : label;
}

export function buildGeneratePayload({ name, goalType, healthNote, preferences, ingredients, target }) {
  const payload = {
    name: name.trim(),
    goalType,
    healthGoal: buildHealthGoalText(goalType, healthNote),
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

export function defaultPlanName(date = new Date()) {
  const start = weekStart(date);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  return `Thực đơn ${formatDayMonth(start)} - ${formatDayMonth(end)}`;
}

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

/** Đặt cờ yêu thích của một thực đơn trong danh sách đã cache (theo id); thực đơn khác giữ nguyên. */
export function setPlanFavorite(list, planId, favorite) {
  if (!Array.isArray(list)) return list;
  return list.map((plan) => (plan.id === planId ? { ...plan, isFavorite: favorite } : plan));
}

/** "21/10/2026 15:06" từ chuỗi ISO của BE; chuỗi rỗng khi không đọc được. */
export function formatDateTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Thay một thực đơn trong danh sách đã cache bằng bản mới (theo id). */
export function replacePlanInList(list, updated) {
  if (!Array.isArray(list)) return list;
  return list.map((plan) => (plan.id === updated.id ? updated : plan));
}

/** "2026-11-01" -> "01/11/2026"; tách chuỗi thay vì dùng Date để không lệch ngày theo múi giờ. */
export function formatIsoDate(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? "");
  return match ? `${match[3]}/${match[2]}/${match[1]}` : "";
}

/** "YYYY-MM-DD" theo giờ máy người dùng (không dùng toISOString vì nó đổi sang UTC và có thể lệch ngày). */
export function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** `date` có nằm sau hôm nay không (so theo ngày, bỏ qua giờ). BE chưa chặn ngày tương lai (task B02) nên FE tự chặn. */
export function isFutureDate(date, now = new Date()) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return day.getTime() > today.getTime();
}

/** Bản ghi "đã ăn" của một bữa trong thực đơn `planId` ở nhật ký đã tải; không có thì undefined. */
export function findMealEntry(diary, planId, mealType) {
  const entries = Array.isArray(diary?.meals) ? diary.meals : [];
  return entries.find(
    (entry) => entry.mealPlanId === planId && normalizeDay(entry.mealType) === normalizeDay(mealType),
  );
}

// Nhật ký chưa có mục tiêu nước từ BE; lấy theo lời khuyên 2 - 2,5 L/ngày ở AdviceCard.
export const WATER_GOAL_ML = 2000;
export const WATER_QUICK_AMOUNTS = [250, 500];

/** 1750 -> "1,75" (lít). */
export function formatLiters(ml) {
  return (Number(ml) / 1000).toLocaleString("vi-VN", { maximumFractionDigits: 2 });
}
