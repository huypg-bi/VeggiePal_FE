import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import mascotWave from "@/assets/img/icon_map_page_1.png";
import { mockRestaurants } from "@/features/restaurant-map/data/mockRestaurantMap";
import RestaurantCard from "@/features/restaurant-map/components/RestaurantCard";
import Reveal from "@/shared/components/Reveal";

export default function RestaurantList() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-15 shrink-0 place-items-center overflow-hidden rounded-full bg-[#E8F5E9] dark:bg-[#16301f]">
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

        <Button type="button" variant="outline" className="h-9 shadow-sm">
          Gần nhất
          <ChevronDown className="size-4 text-subtle" />
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {mockRestaurants.map((restaurant, index) => (
          <Reveal key={restaurant.id} delay={index * 80}>
            <RestaurantCard restaurant={restaurant} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
