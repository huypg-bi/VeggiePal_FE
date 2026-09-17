import { Bookmark, MapPin, Navigation, Star } from "lucide-react";

export default function RestaurantCard({ restaurant }) {
  const { name, rating, address, distance, kcal, veganTag, note, image } =
    restaurant;

  return (
    <article className="flex gap-4 rounded-2xl border border-black/15 bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:shadow-md sm:p-4">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-32">
        <img src={image} alt={name} className="h-full w-full object-cover" />
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-bold text-ink shadow">
          <Star className="h-3 w-3 fill-[#F5B93D] text-[#F5B93D]" />
          {rating}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold leading-snug text-ink">
            {name}
          </h3>
          <button
            type="button"
            aria-label="Lưu quán"
            className="grid size-8 shrink-0 place-items-center rounded-full text-subtle transition hover:bg-[#F5F8F3] hover:text-ink"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>

        <p className="flex items-center gap-1 text-xs text-subtle">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{address}</span>
          <span className="shrink-0">• {distance}</span>
        </p>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-subtle">{kcal}</span>
          {veganTag && (
            <span className="rounded-full bg-[#E8F5E9] px-2 py-0.5 font-medium text-[#1D6C3D]">
              {veganTag}
            </span>
          )}
        </div>

        {note && <p className="text-xs text-subtle">{note}</p>}

        <div className="mt-auto flex items-center gap-2 pt-1">
          <button
            type="button"
            className="flex-1 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-ink transition hover:bg-[#F5F8F3]"
          >
            Xem thực đơn
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1D6C3D] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
          >
            <Navigation className="h-3.5 w-3.5" />
            Chỉ đường đi
          </button>
        </div>
      </div>
    </article>
  );
}
