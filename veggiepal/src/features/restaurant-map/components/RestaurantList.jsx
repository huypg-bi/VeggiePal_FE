import { ChevronDown } from "lucide-react";

import mascotWave from "@/assets/img/icon_map_page_1.png";
import { mockRestaurants } from "@/features/restaurant-map/data/mockRestaurantMap";
import RestaurantCard from "@/features/restaurant-map/components/RestaurantCard";

export default function RestaurantList() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-15 shrink-0 place-items-center overflow-hidden rounded-full bg-[#E8F5E9]">
            <img
              src={mascotWave}
              alt=""
              className="h-15 w-15 select-none object-contain"
              draggable={false}
            />
          </span>
          <div>
            <h2 className="text-lg font-bold leading-tight text-ink">
              {mockRestaurants.length} Điểm Ăn Chay Tuyệt Vời
            </h2>
            <p className="text-xs text-subtle">
              Khu vực Quận 1 • Cập nhật liên tục
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/5 bg-white px-3.5 py-2 text-sm font-medium text-ink shadow-sm transition hover:bg-[#F5F8F3]"
        >
          Gần nhất
          <ChevronDown className="h-4 w-4 text-subtle" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {mockRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
}
