import { useState } from "react";
import { CalendarCheck, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { weeklyChallenge } from "@/features/blog/data/mockBlog";

export default function WeeklyChallengeCard() {
  const { badge, title, description, done, total, streakLabel } = weeklyChallenge;
  // Chưa có API thử thách: check-in chỉ cộng tạm 1 ngày trong phiên xem trang.
  const [checkedIn, setCheckedIn] = useState(false);
  const current = checkedIn ? done + 1 : done;

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand">
          <CalendarCheck className="size-3" />
          {badge}
        </span>
        <span className="text-sm font-bold text-brand">
          {current} / {total} Ngày
        </span>
      </div>

      <h2 className="mt-3 font-heading text-lg font-bold leading-snug text-ink">{title}</h2>
      <p className="mt-1.5 text-xs leading-relaxed text-body">{description}</p>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        className="mt-4 h-2 overflow-hidden rounded-full bg-surface"
      >
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-subtle">
        <span>{streakLabel}</span>
        <span>Còn {total - current} ngày</span>
      </div>

      <Button
        type="button"
        className="mt-4 w-full"
        disabled={checkedIn}
        onClick={() => setCheckedIn(true)}
      >
        {checkedIn ? (
          <>
            <Check className="size-4" />
            Đã check-in hôm nay
          </>
        ) : (
          "Check-in Bữa Tối Hôm Nay"
        )}
      </Button>
    </section>
  );
}
