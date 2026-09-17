import { CalendarDays, Lightbulb, Settings2 } from "lucide-react";

import iconLeaf from "@/assets/img/icon_leaf.png";
import iconSleep from "@/assets/img/icon_sleep.png";
import iconWater from "@/assets/img/icon_water.png";
import { dailyAdviceStats } from "@/features/home/data/mockHome";

const STAT_ICONS = {
  veggie: iconLeaf,
  water: iconWater,
  sleep: iconSleep,
};

export default function AdviceCard() {
  return (
    <article className="flex flex-col rounded-[28px] border border-black/15 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#EAF7E6] text-[#1D6C3D]">
          <Lightbulb className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-bold text-ink">Lời Khuyên Của Bé Bông Cải</h3>
      </div>

      <blockquote className="mt-4 rounded-3xl bg-gradient-to-br from-[#EFFBEA] to-[#F7FBF3] p-5 text-sm italic leading-relaxed text-body">
        "Hãy bắt đầu từ những thay đổi nhỏ như thêm rau xanh vào bữa ăn, uống
        đủ nước và ngủ đủ giấc. Cơ thể khoẻ mạnh không chỉ đến từ thực phẩm, mà
        còn từ thói quen tốt mỗi ngày!" 💚
      </blockquote>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {dailyAdviceStats.map((stat) => {
          const icon = STAT_ICONS[stat.id];
          return (
            <div
              key={stat.id}
              className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ring-1 ring-black/5"
            >
              <img src={icon} alt="" className="h-8 w-8 shrink-0" />
              <span className="flex flex-col leading-tight">
                <span className="text-[11px] font-medium text-subtle">
                  {stat.label}
                </span>
                <span className="text-xs font-bold text-ink">{stat.value}</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          className="flex flex-[1.6] items-center justify-center gap-2 rounded-full bg-[#1D6C3D] py-3 text-sm font-semibold text-white transition hover:bg-[#17542F]"
        >
          <CalendarDays className="h-4 w-4" />
          Xem Kế Hoạch Chi Tiết
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#F5F8F3] py-3 text-sm font-semibold text-ink transition hover:bg-black/5"
        >
          <Settings2 className="h-4 w-4" />
          Chỉnh Sửa Nhu Cầu
        </button>
      </div>
    </article>
  );
}
