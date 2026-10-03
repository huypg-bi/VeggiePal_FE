import { ChevronRight, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

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

        <Button type="button" size="xl" className="px-6 text-sm">
          <Search className="size-4" />
          Tìm quán ngon
        </Button>
      </div>
    </section>
  );
}
