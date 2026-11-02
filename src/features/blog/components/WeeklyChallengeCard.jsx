import { useState } from "react";
import { CalendarCheck, Check, Gift, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRequireLogin } from "@/features/auth/hooks/useRequireLogin";
import ChallengeRewardDialog from "@/features/blog/components/ChallengeRewardDialog";
import { useChallenge } from "@/features/blog/hooks/useChallenge";
import { CHALLENGE_BADGE_NAME } from "@/features/blog/utils/challenge";

// Thử thách 7 ngày: tiến độ lưu ở identity-service (GET / POST /users/me/challenges/7-day).
export default function WeeklyChallengeCard() {
  const { status, days, total, points, checkedToday, loading, error, join, checkIn } = useChallenge();
  const { requireLogin } = useRequireLogin();
  const [rewardOpen, setRewardOpen] = useState(false);

  const busy = join.isPending || checkIn.isPending;
  const failed = status === "FAILED";
  const completed = status === "COMPLETED";

  const handleJoin = () => {
    if (!requireLogin()) return;
    join.mutate(undefined, {
      onSuccess: () => toast.success("Đã bắt đầu thử thách 7 ngày, check-in ngay hôm nay nhé"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleCheckIn = () => {
    checkIn.mutate(undefined, {
      onSuccess: (progress) => {
        if (progress.status === "COMPLETED") setRewardOpen(true);
        else if (progress.status === "FAILED") toast.warning("Bạn đã lỡ một ngày nên thử thách này thất bại");
        else toast.success(`Đã check-in ${progress.completedDays}/${progress.totalDays} ngày (+10 điểm)`);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const spinner = busy && <Loader2 className="size-4 animate-spin" />;

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand">
          <CalendarCheck className="size-3" />
          Thử thách 7 ngày
        </span>
        <span className="text-sm font-bold text-brand">
          {days} / {total} Ngày
        </span>
      </div>

      <h2 className="mt-3 font-heading text-lg font-bold leading-snug text-ink">
        7 Ngày Sống Thuần Chay Tươi Mới
      </h2>
      <p className="mt-1.5 text-xs leading-relaxed text-body">
        Check-in mỗi ngày trong 7 ngày liên tiếp để mở khóa huy hiệu độc quyền “{CHALLENGE_BADGE_NAME}”
        và nhận voucher quán chay đối tác. Bỏ lỡ một ngày là thử thách thất bại và bạn có thể bắt đầu lượt mới.
      </p>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={days}
        className="mt-4 h-2 overflow-hidden rounded-full bg-surface"
      >
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${(days / total) * 100}%` }}
        />
      </div>

      {status !== "NONE" && <p className="mt-2 text-[11px] text-subtle">{points} điểm tích lũy (10 điểm mỗi ngày)</p>}

      {failed && (
        <p className="mt-2 text-[11px] text-subtle">
          Bạn đã lỡ một ngày nên lượt này thất bại. Bắt đầu lượt mới để thử lại từ ngày 1.
        </p>
      )}

      {error && <p className="mt-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}

      {loading ? (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-subtle">
          <Loader2 className="size-4 animate-spin text-brand" />
          Đang tải tiến độ…
        </div>
      ) : completed ? (
        <div className="mt-4 flex flex-col gap-2">
          <Button type="button" variant="soft" className="w-full" onClick={() => setRewardOpen(true)}>
            <Gift className="size-4" />
            Xem phần thưởng
          </Button>
          <Button type="button" variant="ghost" className="w-full" disabled={busy} onClick={handleJoin}>
            {spinner}
            Tham gia lượt mới
          </Button>
        </div>
      ) : status === "NONE" || failed ? (
        <Button type="button" className="mt-4 w-full" disabled={busy} onClick={handleJoin}>
          {spinner}
          {failed ? "Bắt đầu lại thử thách" : "Tham gia thử thách"}
        </Button>
      ) : (
        <Button type="button" className="mt-4 w-full" disabled={checkedToday || busy} onClick={handleCheckIn}>
          {spinner}
          {checkedToday ? (
            <>
              <Check className="size-4" />
              Đã check-in hôm nay
            </>
          ) : (
            "Check-in Bữa Tối Hôm Nay"
          )}
        </Button>
      )}

      <ChallengeRewardDialog open={rewardOpen} onOpenChange={setRewardOpen} />
    </section>
  );
}
