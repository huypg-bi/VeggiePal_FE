import { Link } from "react-router-dom";
import { BadgeCheck, BookOpen, PenLine, ShieldCheck, Sparkles } from "lucide-react";

import communityIllustration from "@/assets/img/icon_community_banner.png";
import tag from "@/assets/img/tag.png";
import { communityStats } from "@/features/blog/data/mockBlog";

const STAT_ICONS = { book: BookOpen, check: BadgeCheck, shield: ShieldCheck };

export default function CommunityHero() {
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
            Cộng đồng Bếp Xanh
          </h1>

          <p className="max-w-lg text-xs leading-relaxed text-subtle sm:text-sm">
            Nơi các tín đồ thuần chay cùng sẻ chia dinh dưỡng, lan toả lối sống
            xanh lành và cùng nhau thắp sáng tình yêu thương qua từng bữa ăn!
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {communityStats.map(({ id, icon, value, label }) => {
              const Icon = STAT_ICONS[icon];
              return (
                <li
                  key={id}
                  className="flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs text-body backdrop-blur-sm"
                >
                  <Icon className="size-3.5 text-brand" />
                  <b className="text-ink">{value}</b> {label}
                </li>
              );
            })}
          </ul>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              to="/blog/new"
              className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90"
            >
              <PenLine className="size-4" />
              Viết bài chia sẻ
            </Link>
            <Link
              to="/recipes"
              className="flex items-center gap-2 rounded-full bg-brand-soft px-5 py-2.5 text-sm font-semibold text-brand transition hover:brightness-95"
            >
              <Sparkles className="size-4 text-brand" />
              Khám phá món chay
            </Link>
          </div>
        </div>

        <div className="relative flex shrink-0 items-center justify-center lg:justify-end lg:-mr-2">
          <img
            src={communityIllustration}
            alt="Cộng đồng Bé Bông Cải cùng nâng trái tim yêu thương"
            className="h-56 w-auto shrink-0 select-none drop-shadow-md sm:h-64 md:h-72 lg:h-[290px] xl:h-[310px] object-contain"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
