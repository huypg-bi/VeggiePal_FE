import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

import { useDiary } from "@/features/meal-planner/hooks/useDiary";
import { useMealPlans } from "@/features/meal-planner/hooks/useMealPlans";
import { formatLiters, toDateKey, toRounded } from "@/features/meal-planner/utils/mealPlan";

// Ba chất đa lượng: `suffix` ghép với min / max trong dailyNutritionTarget của thực đơn.
const MACROS = [
  { key: "carbohydrate", suffix: "Carbohydrate", label: "Tinh bột", dot: "bg-brand", bar: "bg-brand" },
  { key: "protein", suffix: "Protein", label: "Đạm", dot: "bg-teal-600 dark:bg-teal-500", bar: "bg-teal-600 dark:bg-teal-500" },
  { key: "fat", suffix: "Fat", label: "Chất béo", dot: "bg-warning", bar: "bg-warning" },
];

const RING_PATH = "M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831";

// Mốc so sánh là mức tối đa của mục tiêu; thiếu thì lấy mức tối thiểu, không có thì null.
function goalOf(target, suffix) {
  const max = Number(target?.[`max${suffix}`]);
  if (Number.isFinite(max) && max > 0) return max;
  const min = Number(target?.[`min${suffix}`]);
  return Number.isFinite(min) && min > 0 ? min : null;
}

function percentOf(value, goal) {
  return goal ? Math.min(100, Math.round((value / goal) * 100)) : 0;
}

function kcalNote(eaten, goal, hasMeals) {
  if (!hasMeals) return "Hôm nay bạn chưa đánh dấu bữa nào";
  if (!goal) return "Chưa có mục tiêu để so sánh";
  return eaten <= goal
    ? `Còn ${(goal - eaten).toLocaleString("en-US")} kcal`
    : `Vượt ${(eaten - goal).toLocaleString("en-US")} kcal`;
}

export default function DailyNutritionCard() {
  const { data: diary, isPending, isError, error } = useDiary(toDateKey(new Date()));
  const { data: plans } = useMealPlans();
  // Mục tiêu lấy từ thực đơn mới nhất; chưa có thực đơn thì chỉ hiện số đã ăn.
  const target = plans?.[0]?.plan?.constraints?.dailyNutritionTarget ?? null;

  const hasMeals = diary?.hasMeals ?? (diary?.meals?.length ?? 0) > 0;
  const eaten = toRounded(diary?.nutrition?.calories);
  const calorieGoal = goalOf(target, "Calories");

  return (
    <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-brand" />
        <h3 className="font-bold text-ink text-sm">Dinh Dưỡng Hôm Nay</h3>
      </div>

      {isError ? (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error.message}</p>
      ) : isPending ? (
        <p className="text-xs text-subtle">Đang tải nhật ký hôm nay...</p>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-border" strokeWidth="3.5" stroke="currentColor" fill="none" d={RING_PATH} />
                <path
                  className="text-brand"
                  strokeDasharray={`${percentOf(eaten, calorieGoal)}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d={RING_PATH}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-sm font-extrabold text-ink">{eaten.toLocaleString("en-US")}</span>
                <span className="text-[9px] text-subtle">kcal</span>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p className="font-semibold text-ink">
                {calorieGoal ? `Mục tiêu: ${calorieGoal.toLocaleString("en-US")} kcal` : "Chưa có mục tiêu"}
              </p>
              <p className="text-brand text-[11px]">{kcalNote(eaten, calorieGoal, hasMeals)}</p>
              <p className="text-subtle text-[10px]">
                Vận động {(Number(diary.totalActivityMinutes) || 0).toLocaleString("vi-VN")} phút · Nước{" "}
                {formatLiters(Number(diary.totalWaterMl) || 0)} L
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {MACROS.map(({ key, suffix, label, dot, bar }) => {
              const value = toRounded(diary.nutrition?.[key]);
              const goal = goalOf(target, suffix);
              const percent = percentOf(value, goal);
              return (
                <div key={key}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-body flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dot}`}></span>
                      {label}
                    </span>
                    <span className="font-semibold text-ink">
                      {goal ? `${value}g / ${goal}g (${percent}%)` : `${value}g`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${bar}`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {!hasMeals && (
            <Link to="/meal-planner" className="mt-4 inline-block text-[11px] font-semibold text-brand hover:underline">
              Đến thực đơn để đánh dấu bữa đã ăn
            </Link>
          )}
        </>
      )}
    </div>
  );
}
