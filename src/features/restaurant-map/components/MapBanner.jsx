import { SlidersHorizontal } from "lucide-react";

import mascotHeart from "@/assets/img/icon_map_page_2.png";
import eatGreenText from "@/assets/img/icon_map_page_3.png";
import tag from "@/assets/img/tag.png";

export default function MapBanner() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-br from-[#EAF7E6] to-[#F3FBEF] px-6 py-4 dark:from-[#12261a] dark:to-[#0d1c13] sm:px-8 sm:py-6">
      {/* Hàng trên đặt absolute để không tốn chiều cao container */}
      <div className="absolute top-4 left-6 right-6 z-10 flex items-center justify-between gap-3 sm:top-5 sm:left-8 sm:right-8">
        <img
          src={tag}
          alt="Đồng hành cùng bạn"
          className="h-20 w-auto select-none"
          draggable={false}
        />

        <button
          type="button"
          className="flex items-center gap-2 whitespace-nowrap rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition hover:opacity-90"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Lọc quán theo yêu cầu
        </button>
      </div>

      {/* Hàng dưới dùng pt-14/pt-16 để chừa khoảng trống cho hàng trên */}
      <div className="relative pt-14 flex flex-col items-center gap-6 sm:pt-16 lg:flex-row lg:items-center lg:justify-start lg:gap-10">
        <h1 className="max-w-lg text-center text-2xl font-bold leading-snug text-ink sm:text-4xl lg:text-left">
          Khám phá các quán ăn ngon, lành mạnh xung quanh bạn cùng{" "}
          <span className="text-brand">Bé Bông Cải</span> nhé.
        </h1>

        <div className="flex shrink-0 items-center gap-4">
          <img
            src={mascotHeart}
            alt="Bé Bông Cải"
            className="h-32 w-auto select-none drop-shadow-sm sm:h-50"
            draggable={false}
          />

          <img
            src={eatGreenText}
            alt="Ăn xanh là yêu bản thân"
            className="hidden h-30 w-auto select-none sm:block"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
