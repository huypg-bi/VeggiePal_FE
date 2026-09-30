import { ChevronRight } from "lucide-react";

import iconBmi from "@/assets/img/icon_bmi.png";
import iconFire from "@/assets/img/icon_fire.png";
import iconRun from "@/assets/img/icon_run.png";
import iconWater from "@/assets/img/icon_water.png";
import { mockStats } from "@/features/meal-planner/data/mockHome";
import Reveal from "@/shared/components/Reveal";

const ICONS = {
  bmi: iconBmi,
  fire: iconFire,
  water: iconWater,
  run: iconRun,
};

export default function StatsGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {mockStats.map((stat, index) => (
        <Reveal key={stat.id} delay={index * 80}>
        <article
          className="relative flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-md transition hover:shadow-lg"
        >
          {stat.badge && (
            <span className="absolute right-4 top-4 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand">
              {stat.badge}
            </span>
          )}

          <button
            type="button"
            className="flex items-center gap-2 text-left text-sm font-medium text-subtle transition hover:text-ink"
          >
            <span className="grid size-12 shrink-0 place-items-center">
              <img src={ICONS[stat.icon]} alt="" className="h-full w-full object-contain" />
            </span>
            <span className="flex-1">{stat.label}</span>
            {!stat.badge && <ChevronRight className="h-4 w-4" />}
          </button>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-ink">{stat.value}</span>
            {stat.unit && (
              <span className="text-sm font-medium text-subtle">{stat.unit}</span>
            )}
          </div>

          <p className="text-xs leading-snug text-subtle">{stat.caption}</p>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
            <div
              className={`h-full rounded-full ${stat.barClass}`}
              style={{ width: `${stat.progress}%` }}
            />
          </div>
        </article>
        </Reveal>
      ))}
    </section>
  );
}
