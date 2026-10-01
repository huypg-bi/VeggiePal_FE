import {
  ChevronRight,
  Flame,
  Leaf,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  UtensilsCrossed,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { mapFilterChips } from "@/features/restaurant-map/data/mockRestaurantMap";

const CHIP_ICONS = {
  leaf: Leaf,
  utensils: UtensilsCrossed,
  flame: Flame,
  pin: MapPin,
  star: Star,
  shield: ShieldCheck,
};

export default function MapSearchBar() {
  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-4 h-4 w-4 text-subtle" />
          <input
            type="search"
            placeholder="Bạn thêm món gì? Lẩu nấm, phở chay, bún bò huế chay..."
            className="h-12 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/30 focus:bg-card focus:ring-2 focus:ring-brand/10"
          />
        </label>

        <button
          type="button"
          className="flex h-12 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 text-left transition hover:bg-[#EEF3EC] dark:hover:bg-white/5"
        >
          <MapPin className="h-4 w-4 shrink-0 text-brand" />
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] text-subtle">Vị trí hiện tại</span>
            <span className="text-sm font-medium text-ink">
              Quận 1, TP. Hồ Chí Minh
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-subtle" />
        </button>

        <button
          type="button"
          className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground transition hover:opacity-90"
        >
          <Search className="h-4 w-4" />
          Tìm quán ngon
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {mapFilterChips.map((chip) => {
          const Icon = CHIP_ICONS[chip.icon];
          return (
            <button
              key={chip.id}
              type="button"
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition",
                chip.id === "verified"
                  ? "border-transparent bg-[#FDECEC] text-[#D5443B] hover:bg-[#FBDFDF] dark:bg-[#3a1616] dark:text-[#ff8a80] dark:hover:bg-[#4a1d1d]"
                  : chip.active
                  ? "border-transparent bg-[#E8F5E9] text-brand dark:bg-[#16301f]"
                  : "border-border bg-surface text-ink hover:bg-[#EEF3EC] dark:hover:bg-white/5"
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    chip.id === "rating" && "fill-[#F5B93D] text-[#F5B93D]"
                  )}
                />
              )}
              {chip.label}
              {(chip.id === "verified" || chip.id === "vegan100") && (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
