import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import iconBmi from "@/assets/img/icon_bmi.png";
import iconFire from "@/assets/img/icon_fire.png";
import iconRun from "@/assets/img/icon_run.png";
import iconWater from "@/assets/img/icon_water.png";
import { mockStats } from "@/features/meal-planner/data/mockMealPlanner";
import { toRounded } from "@/features/meal-planner/utils/mealPlan";
import { useLatestHealthRecord } from "@/features/profile/hooks/useHealthRecords";
import { bmiInfo } from "@/features/profile/utils/editProfileHelpers";
import Reveal from "@/shared/components/Reveal";

const ICONS = {
  bmi: iconBmi,
  fire: iconFire,
  water: iconWater,
  run: iconRun,
};

// Thanh tiến độ BMI chạy trên dải 15 -> 35 để giá trị thường gặp nằm giữa thanh.
const BMI_BAR_MIN = 15;
const BMI_BAR_MAX = 35;

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function bmiStat(record, isPending) {
  const bmi = Number(record?.bmi);
  const hasBmi = Number.isFinite(bmi) && bmi > 0;
  const info = bmiInfo(hasBmi ? bmi : null);

  return {
    id: "bmi",
    icon: "bmi",
    label: "Chỉ số BMI",
    value: hasBmi ? bmi.toFixed(1) : "—",
    caption: hasBmi
      ? `${info.text} • chuẩn ${info.range}`
      : isPending
        ? "Đang tải chỉ số..."
        : "Chưa có chỉ số, hãy cập nhật hồ sơ sức khỏe",
    progress: hasBmi ? clampPercent(((bmi - BMI_BAR_MIN) / (BMI_BAR_MAX - BMI_BAR_MIN)) * 100) : 0,
    barClass: "bg-chart-1",
    to: hasBmi ? undefined : "/profile/edit",
  };
}

function calorieStat(dayTotals, target, dayLong) {
  const calories = toRounded(dayTotals?.calories);
  const max = Number(target?.maxCalories);
  const min = Number(target?.minCalories);
  const hasMax = Number.isFinite(max) && max > 0;
  const hasMin = Number.isFinite(min) && min > 0;

  let caption = "Chưa có thực đơn, hãy nhờ Bé Bông Cải lên thực đơn nhé";
  if (dayTotals) {
    if (hasMax && hasMin) caption = `Mục tiêu ${min.toLocaleString("en-US")} - ${max.toLocaleString("en-US")} kcal/ngày`;
    else if (hasMax) caption = `Mục tiêu tối đa ${max.toLocaleString("en-US")} kcal/ngày`;
    else caption = `Tổng năng lượng ${dayLong} theo thực đơn`;
  }

  return {
    id: "calo",
    icon: "fire",
    label: "Calo Trong Ngày",
    value: dayTotals ? calories.toLocaleString("en-US") : "—",
    unit: hasMax && dayTotals ? `/ ${max.toLocaleString("en-US")} kcal` : dayTotals ? "kcal" : undefined,
    caption,
    // Chỉ có thanh tiến độ khi người dùng đặt mục tiêu calo tối đa để so sánh.
    progress: hasMax && dayTotals ? clampPercent((calories / max) * 100) : null,
    barClass: "bg-chart-4",
  };
}

/**
 * Bốn thẻ chỉ số đầu trang.
 * - BMI: thật, từ nutrition-service (bản ghi sức khỏe mới nhất).
 * - Calo: thật, tổng calo của ngày đang xem trong thực đơn.
 * - Nước & Vận động: vẫn là dữ liệu mẫu, BE chưa có API theo dõi.
 * `dayTotals`: nutritionTotals của ngày đang xem; `target`: dailyNutritionTarget của thực đơn.
 */
export default function StatsGrid({ dayTotals, target, dayLong = "hôm nay" }) {
  const { data: latestRecord, isPending } = useLatestHealthRecord();
  const stats = [bmiStat(latestRecord, isPending), calorieStat(dayTotals, target, dayLong), ...mockStats];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Reveal key={stat.id} delay={index * 80}>
          <article className="relative flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-md transition hover:shadow-lg">
            {stat.badge && (
              <span className="absolute right-4 top-4 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand">
                {stat.badge}
              </span>
            )}

            <StatHeader stat={stat} />

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-ink">{stat.value}</span>
              {stat.unit && <span className="text-sm font-medium text-subtle">{stat.unit}</span>}
            </div>

            <p className="text-xs leading-snug text-subtle">{stat.caption}</p>

            {stat.progress != null && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div className={`h-full rounded-full ${stat.barClass}`} style={{ width: `${stat.progress}%` }} />
              </div>
            )}
          </article>
        </Reveal>
      ))}
    </section>
  );
}

// Thẻ BMI chưa có số liệu dẫn sang trang cập nhật hồ sơ; các thẻ còn lại giữ nút như trước.
function StatHeader({ stat }) {
  const content = (
    <>
      <span className="grid size-12 shrink-0 place-items-center">
        <img src={ICONS[stat.icon]} alt="" className="h-full w-full object-contain" />
      </span>
      <span className="flex-1">{stat.label}</span>
      {!stat.badge && <ChevronRight className="h-4 w-4" />}
    </>
  );
  const className = "flex items-center gap-2 text-left text-sm font-medium text-subtle transition hover:text-ink";

  if (stat.to) {
    return (
      <Link to={stat.to} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={className}>
      {content}
    </button>
  );
}
