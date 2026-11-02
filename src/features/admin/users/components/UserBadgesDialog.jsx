import { useState } from "react";
import { Award, BadgeCheck, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CHALLENGE_BADGE_NAME } from "@/features/blog/utils/challenge";
import { cn } from "@/lib/utils";
import { useGrantVerification, useRevokeBadge, useUserBadges } from "../hooks/useAdminUsers";
import { formatDateTime } from "../utils/adminUserFormat";

const MAX_REASON_LENGTH = 500;

const BADGE_LABELS = {
  VERIFIED: { label: "Tài khoản được xác minh", icon: BadgeCheck },
  ACHIEVEMENT: { label: CHALLENGE_BADGE_NAME, icon: Heart },
};

// Hộp thoại xem lịch sử huy hiệu, cấp huy hiệu xác minh và thu hồi huy hiệu của một người dùng.
export default function UserBadgesDialog({ user, onClose }) {
  const [revokingId, setRevokingId] = useState(null);
  const [reason, setReason] = useState("");

  const badgesQuery = useUserBadges(user?.id);
  const grantMutation = useGrantVerification();
  const revokeMutation = useRevokeBadge();

  const badges = badgesQuery.data ?? [];
  const hasActiveVerified = badges.some((b) => b.type === "VERIFIED" && !b.revokedAt);
  const trimmedReason = reason.trim();
  const userName = user?.fullName || user?.email;

  const handleClose = () => {
    setRevokingId(null);
    setReason("");
    onClose();
  };

  const handleGrant = () => {
    grantMutation.mutate(user.id, {
      onSuccess: () => toast.success(`Đã cấp huy hiệu xác minh cho "${userName}"`),
      onError: (err) => toast.error(err.message || "Không thể cấp huy hiệu xác minh"),
    });
  };

  const handleRevoke = (badge) => {
    if (!trimmedReason) return;
    revokeMutation.mutate(
      { id: user.id, badgeId: badge.id, reason: trimmedReason },
      {
        onSuccess: () => {
          toast.success("Đã thu hồi huy hiệu");
          setRevokingId(null);
          setReason("");
        },
        onError: (err) => toast.error(err.message || "Không thể thu hồi huy hiệu"),
      },
    );
  };

  return (
    <Dialog open={Boolean(user)} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-brand">
            <Award className="size-5 shrink-0" />
            <DialogTitle>Huy hiệu của người dùng</DialogTitle>
          </div>
          <DialogDescription>
            <span className="font-semibold text-ink">{userName}</span>. Thu hồi không xóa bản ghi, lịch sử vẫn được giữ.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[50vh] flex-col gap-2.5 overflow-y-auto py-1">
          {badgesQuery.isPending ? (
            <div className="flex items-center gap-2 text-sm text-subtle">
              <Loader2 className="size-4 animate-spin text-brand" />
              Đang tải huy hiệu…
            </div>
          ) : badgesQuery.isError ? (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {badgesQuery.error.message}
            </p>
          ) : badges.length === 0 ? (
            <p className="rounded-2xl bg-surface p-3 text-sm text-subtle">Người dùng này chưa có huy hiệu nào.</p>
          ) : (
            badges.map((badge) => {
              const meta = BADGE_LABELS[badge.type] ?? { label: badge.type, icon: Award };
              const Icon = meta.icon;
              const revoked = Boolean(badge.revokedAt);
              const revoking = revokingId === badge.id;
              return (
                <div key={badge.id} className="rounded-2xl border border-border bg-surface p-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-xl",
                        revoked ? "bg-card text-subtle" : "bg-brand-soft text-brand",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-ink">{meta.label}</p>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            revoked ? "bg-destructive/10 text-destructive" : "bg-brand-soft text-brand",
                          )}
                        >
                          {revoked ? "Đã thu hồi" : "Đang hiệu lực"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-subtle">Cấp lúc {formatDateTime(badge.grantedAt)}</p>
                      {revoked && (
                        <p className="mt-0.5 text-xs text-subtle">
                          Thu hồi lúc {formatDateTime(badge.revokedAt)}
                          {badge.revocationReason ? `. Lý do: ${badge.revocationReason}` : ""}
                        </p>
                      )}
                    </div>
                    {!revoked && !revoking && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRevokingId(badge.id);
                          setReason("");
                        }}
                      >
                        Thu hồi
                      </Button>
                    )}
                  </div>

                  {revoking && (
                    <div className="mt-3 flex flex-col gap-2">
                      <textarea
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        maxLength={MAX_REASON_LENGTH}
                        aria-label="Lý do thu hồi"
                        placeholder="Nhập lý do thu hồi (bắt buộc, tối đa 500 ký tự)..."
                        className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-subtle">
                          {reason.length}/{MAX_REASON_LENGTH}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={revokeMutation.isPending}
                            onClick={() => setRevokingId(null)}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={!trimmedReason || revokeMutation.isPending}
                            onClick={() => handleRevoke(badge)}
                          >
                            {revokeMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                            Xác nhận thu hồi
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleClose}>
            Đóng
          </Button>
          <Button
            type="button"
            onClick={handleGrant}
            disabled={hasActiveVerified || grantMutation.isPending || badgesQuery.isPending}
            title={hasActiveVerified ? "Người dùng đã có huy hiệu xác minh còn hiệu lực" : undefined}
          >
            {grantMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <BadgeCheck className="size-4" />}
            Cấp huy hiệu xác minh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
