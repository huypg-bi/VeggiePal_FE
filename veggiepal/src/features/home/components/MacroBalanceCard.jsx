import { Sprout } from "lucide-react";

import iconMacro from "@/assets/img/icon_macro.png";
import { macroBreakdown } from "@/features/home/data/mockHome";

const SEGMENT_COLORS = {
  carb: "#1D6C3D",
  protein: "#5CB85C",
  fat: "#F0883E",
};

export default function MacroBalanceCard() {
  let cursor = 0;
  const stops = macroBreakdown.map((item) => {
    const start = cursor;
    cursor += item.value;
    return `${SEGMENT_COLORS[item.id]} ${start}% ${cursor}%`;
  });

  return (
    <article className="rounded-[28px] border border-black/15 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-7">
      <div className="flex items-center gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#E8F5E9] text-[#1D6C3D]">
          <Sprout className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm font-semibold text-[#1D6C3D]">
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
            <div className="flex flex-col items-center justify-center size-[80px] rounded-full bg-white text-center">
              <span className="text-lg font-bold leading-tight text-ink">
                100%
              </span>
              <span className="text-[10px] font-medium text-[#1D6C3D]">
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

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#F5F8F3] px-4 py-3">
        <span className="text-xs text-subtle">
          Chất xơ tự nhiên:{" "}
          <span className="font-semibold text-ink">38g / ngày</span>{" "}
          <span className="text-[#1D6C3D]">(Rất tốt)</span>
        </span>
      </div>
    </article>
  );
}
