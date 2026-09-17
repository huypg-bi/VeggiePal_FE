import { ChevronRight } from "lucide-react";

import iconBmi from "@/assets/img/icon_bmi.png";
import iconFire from "@/assets/img/icon_fire.png";
import iconRun from "@/assets/img/icon_run.png";
import iconWater from "@/assets/img/icon_water.png";
import { mockStats } from "@/features/home/data/mockHome";

const ICONS = {
  bmi: iconBmi,
  fire: iconFire,
  water: iconWater,
  run: iconRun,
};

export default function StatsGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {mockStats.map((stat) => (
        <article
          key={stat.id}
          className="relative flex flex-col gap-3 rounded-2xl border border-black/15 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:shadow-md"
        >
          {stat.badge && (
            <span className="absolute right-4 top-4 rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[11px] font-semibold text-[#1D6C3D]">
              {stat.badge}
            </span>
          )}

          <button
            type="button"
            className="flex items-center gap-2 text-left text-sm font-medium text-subtle transition hover:text-ink"
          >
            <img src={ICONS[stat.icon]} alt="" className="h-15 w-15 shrink-0" />
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

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5">
            <div
              className={`h-full rounded-full ${stat.barClass}`}
              style={{ width: `${stat.progress}%` }}
            />
          </div>
        </article>
      ))}
    </section>
  );
}
