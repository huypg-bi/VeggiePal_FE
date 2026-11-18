import mapIllustration from "@/assets/img/icon_map_page_2.png";
import tag from "@/assets/img/tag.png";

// Cùng khung (viền, nền gradient, hai quầng sáng) với banner của công thức, video, cộng đồng và thực đơn.
export default function MapBanner() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-border/40 bg-gradient-to-br from-brand-soft/40 via-card to-brand-soft/20 px-6 py-5 sm:px-8 sm:py-6 lg:pr-6 shadow-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-brand-2/25 blur-3xl dark:bg-brand-2/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brand-2/30 blur-3xl dark:bg-brand-2/35"
      />

      <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center lg:items-start lg:text-left">
          <img
            src={tag}
            alt="Đồng hành cùng bạn"
            className="h-16 w-auto select-none sm:h-20"
            draggable={false}
          />

          <h1 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Khám phá các quán ăn "ngon lành" quanh bạn cùng{" "}
            <span className="text-brand">Bé Bông Cải</span> nhé.
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-subtle sm:text-base">
            Tìm quán chay gần bạn, xem đánh giá và chọn nơi phù hợp nhất cho
            bữa ăn xanh hôm nay!
          </p>
        </div>

        <img
          src={mapIllustration}
          alt="Bản đồ quán chay cùng Bé Bông Cải"
          className="h-auto w-full max-w-xs shrink-0 select-none drop-shadow-sm sm:max-w-sm lg:max-w-md"
          draggable={false}
        />
      </div>
    </section>
  );
}
