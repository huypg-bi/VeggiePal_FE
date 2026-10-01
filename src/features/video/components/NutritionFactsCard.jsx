import { ShoppingCart } from "lucide-react";

import iconNutrition from "@/assets/img/icon_video_page.png";
import { nutritionFacts } from "@/features/video/data/mockVideo";

export default function NutritionFactsCard() {
  const { servingLabel, kcal, protein, fiber, ingredients } = nutritionFacts;

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img src={iconNutrition} alt="" className="h-9 w-9 shrink-0" />
          <h2 className="text-sm font-bold leading-snug text-ink">
            Giá Trị Dinh Dưỡng / 1 Khẩu Phần
          </h2>
        </div>
        <span className="rounded-full bg-[#E8F5E9] px-2.5 py-1 text-[11px] font-semibold text-brand dark:bg-[#16301f]">
          {servingLabel}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <NutritionStat value={kcal} label="Năng lượng (Kcal)" valueClass="text-ink" />
        <NutritionStat value={protein} label="Đạm đậu & nấm" valueClass="text-[#E38B29]" />
        <NutritionStat value={fiber} label="Chất xơ tự nhiên" valueClass="text-[#8A5A00]" />
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {ingredients.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 text-xs text-body"
          >
            <span className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-[#1D6C3D]" />
              {item.name}
            </span>
            <span className="shrink-0 font-medium text-subtle">{item.amount}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90"
      >
        <ShoppingCart className="h-4 w-4" />
        Chép vào giỏ đi chợ
      </button>
    </section>
  );
}

function NutritionStat({ value, label, valueClass }) {
  return (
    <div className="rounded-xl bg-surface px-2 py-2.5">
      <p className={`text-lg font-bold ${valueClass}`}>{value}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-subtle">{label}</p>
    </div>
  );
}
