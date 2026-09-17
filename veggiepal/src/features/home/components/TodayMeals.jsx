import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Heart, RefreshCw } from "lucide-react";

import { todayMeals, weekDays } from "@/features/home/data/mockHome";
import { cn } from "@/lib/utils";

export default function TodayMeals() {
  const [activeDay, setActiveDay] = useState("t4");
  const [likedMeals, setLikedMeals] = useState(() => new Set());

  const toggleLike = (id) => {
    setLikedMeals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink sm:text-2xl">
            Thực Đơn 4 Bữa Hôm Nay 🌱
          </h2>
          <p className="mt-1 text-sm text-subtle">
            Lên kế hoạch năng lượng từng bữa, cùng sống xanh mỗi ngày!
          </p>
        </div>

        <div className="flex items-center gap-1 self-start sm:self-auto">
          <button
            type="button"
            aria-label="Tuần trước"
            className="grid size-7 place-items-center rounded-full text-subtle transition hover:bg-[#F5F8F3] hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {weekDays.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => setActiveDay(day.id)}
              className={cn(
                "grid size-9 place-items-center rounded-full text-sm font-semibold transition",
                activeDay === day.id
                  ? "bg-[#1D6C3D] text-white"
                  : "text-subtle hover:bg-[#F5F8F3] hover:text-ink"
              )}
            >
              {day.label}
            </button>
          ))}
          <button
            type="button"
            aria-label="Tuần sau"
            className="grid size-7 place-items-center rounded-full text-subtle transition hover:bg-[#F5F8F3] hover:text-ink"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {todayMeals.map((meal) => (
          <article
            key={meal.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-black/15 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:shadow-md"
          >
            <div className="relative h-40 w-full">
              <img
                src={meal.image}
                alt={meal.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm">
                <Clock className="h-3 w-3" />
                {meal.meal} • {meal.time}
              </span>
              <button
                type="button"
                aria-label="Yêu thích món này"
                onClick={() => toggleLike(meal.id)}
                className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-white/95 shadow-sm transition hover:scale-105"
              >
                <Heart
                  className={cn(
                    "h-3.5 w-3.5 transition",
                    likedMeals.has(meal.id)
                      ? "fill-[#EF6461] text-[#EF6461]"
                      : "text-subtle"
                  )}
                />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="text-sm font-bold leading-snug text-ink">
                {meal.title}
              </h3>
              <p className="text-xs leading-relaxed text-subtle">
                {meal.description}
              </p>

              <div className="mt-1 grid grid-cols-4 gap-1 text-center">
                <MacroStat value={meal.kcal} unit="Kcal" />
                <MacroStat value={`${meal.protein}g`} unit="Đạm" />
                <MacroStat value={`${meal.carb}g`} unit="Carb" />
                <MacroStat value={`${meal.fat}g`} unit="Béo" />
              </div>

              <button
                type="button"
                className="mt-3 flex items-center justify-center gap-1.5 rounded-full border border-black/10 py-2 text-xs font-semibold text-ink transition hover:bg-[#F5F8F3]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Đổi món (AI gợi ý)
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MacroStat({ value, unit }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-bold text-ink">{value}</span>
      <span className="text-[10px] text-subtle">{unit}</span>
    </div>
  );
}
