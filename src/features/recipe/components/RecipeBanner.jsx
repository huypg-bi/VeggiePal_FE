import { Link } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";

import recipeIllustration from "@/assets/img/icon_recipe_banner.png";
import tag from "@/assets/img/tag.png";

export default function RecipeBanner() {
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

      <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex max-w-2xl flex-col items-center gap-3 text-center lg:items-start lg:text-left">
          <img
            src={tag}
            alt="Đồng hành cùng bạn"
            className="h-16 w-auto select-none sm:h-20"
            draggable={false}
          />

          <h1 className="text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
            Vào bếp nấu món chay ngon cùng{" "}
            <span className="text-brand">Bé Bông Cải</span> nhé!
          </h1>

          <p className="max-w-lg text-xs leading-relaxed text-subtle sm:text-sm">
            Khám phá hàng trăm công thức thuần chay thanh lành, giàu dinh dưỡng
            và trổ tài vào bếp mỗi ngày cho bữa ăn tràn ngập yêu thương!
          </p>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              to="/recipes/new"
              className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90"
            >
              <Plus className="size-4" />
              Chia sẻ công thức
            </Link>
            <Link
              to="/meal-planner"
              className="flex items-center gap-2 rounded-full bg-brand-soft px-5 py-2.5 text-sm font-semibold text-brand transition hover:brightness-95"
            >
              <Sparkles className="size-4 text-brand" />
              Gợi ý thực đơn AI
            </Link>
          </div>
        </div>

        <div className="relative flex shrink-0 items-center justify-center lg:justify-end lg:-mr-2">
          <img
            src={recipeIllustration}
            alt="Bé Bông Cải vào bếp nấu món chay"
            className="h-56 w-auto shrink-0 select-none drop-shadow-md sm:h-64 md:h-72 lg:h-[290px] xl:h-[310px] object-contain"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
