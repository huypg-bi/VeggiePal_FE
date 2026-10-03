import { Sprout } from "lucide-react";

import iconMacro from "@/assets/img/icon_macro.png";
import { macroBreakdown } from "@/features/meal-planner/data/mockMealPlanner";

const SEGMENT_COLORS = {
  carb: "var(--chart-1)",
  protein: "var(--chart-5)",
  fat: "var(--chart-4)",
};

export default function MacroBalanceCard() {
  // Mỗi đoạn của biểu đồ bắt đầu ngay sau tổng các đoạn đứng trước nó.
  const stops = macroBreakdown.map((item, index) => {
    const start = macroBreakdown
      .slice(0, index)
      .reduce((sum, prev) => sum + prev.value, 0);
    return `${SEGMENT_COLORS[item.id]} ${start}% ${start + item.value}%`;
  });

  return (
    <article className="rounded-[28px] bg-card p-6 shadow-lg sm:p-7">
      <div className="flex items-center gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
          <Sprout className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm font-semibold text-brand">
          Cân Bằng Dinh Dưỡng
        </span>
      </div>
      <h3 className="mt-3 text-lg font-bold text-ink">Tỉ lệ Macro Vàng</h3>
      <p className="mt-1 text-sm text-subtle">
        Phù hợp hoàn hảo cho cơ thể, để đạt trạng thái lý tưởng và duy trì sức
        khoẻ bền vững.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div
            className="relative grid size-32 shrink-0 place-items-center rounded-full"
            style={{ background: `conic-gradient(${stops.join(", ")})` }}
          >
            <div className="flex flex-col items-center justify-center size-[80px] rounded-full bg-card text-center">
              <span className="text-lg font-bold leading-tight text-ink">
                100%
              </span>
              <span className="text-[10px] font-medium text-brand">
                Plant-Power
              </span>
            </div>
          </div>

          <ul className="flex flex-col gap-2.5">
            {macroBreakdown.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: SEGMENT_COLORS[item.id] }}
                />
                <span className="font-semibold text-ink">{item.value}%</span>
                <span className="text-subtle">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <img
          src={iconMacro}
          alt=""
          className="h-28 w-auto shrink-0 select-none sm:h-32"
          draggable={false}
        />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-surface px-4 py-3">
        <span className="text-xs text-subtle">
          Chất xơ tự nhiên:{" "}
          <span className="font-semibold text-ink">38g / ngày</span>{" "}
          <span className="text-brand">(Rất tốt)</span>
        </span>
      </div>
    </article>
  );
}
