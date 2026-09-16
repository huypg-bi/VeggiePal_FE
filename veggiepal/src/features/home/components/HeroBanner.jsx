import { Leaf } from "lucide-react";

import iconBanner from "@/assets/img/icon_banner.png";
import textBanner from "@/assets/img/text_banner.png";

export default function HeroBanner({ userName }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#EAF7E6] to-[#F3FBEF] px-6 py-8 sm:px-5 sm:py-5">

      <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-md text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#1D6C3D] shadow-sm ring-1 ring-black/5">
            <Leaf className="h-3.5 w-3.5" />
            Đồng Hành Cùng Bạn
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Chào {userName}, hôm nay{" "} <br />
            <span className="text-[#1D6C3D]">Bé Bông Cải</span> đã sẵn sàng
            lên thực đơn cho bạn nè!
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-subtle sm:text-base">
            Chỉ cần vài thao tác đơn giản, mình sẽ giúp bạn lên thực đơn lành
            mạnh, cân bằng dinh dưỡng và phù hợp với mục tiêu của bạn!
          </p>
        </div>

        <img
          src={iconBanner}
          alt="Bé Bông Cải chào đón bạn"
          className="h-48 w-auto shrink-0 select-none drop-shadow-sm sm:h-70"
          draggable={false}
        />

        <img
          src={textBanner}
          alt="Ăn ngon, sống khoẻ, cùng Bé Bông Cải"
          className="h-24 w-auto shrink-0 select-none sm:h-50"
          draggable={false}
        />
      </div>
    </section>
  );
}
