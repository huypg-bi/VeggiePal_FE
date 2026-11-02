import { Clock, Eye, ShieldAlert, Unlock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime } from "../utils/adminUserFormat";

// Hộp thoại hiển thị chi tiết lý do khóa tài khoản của người dùng.
export default function LockReasonDialog({ user, onClose, onUnlock }) {
  const isOpen = Boolean(user);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="size-5 shrink-0" />
            <DialogTitle>Lý do khóa tài khoản</DialogTitle>
          </div>
          <DialogDescription>
            Thông tin chi tiết về việc tài khoản{" "}
            <span className="font-semibold text-ink">
              {user?.fullName ? `${user.fullName} (${user.email})` : user?.email}
            </span>{" "}
            đang bị khóa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Hộp lý do vi phạm */}
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold text-destructive mb-1 text-xs uppercase tracking-wide">
              Lý do vi phạm:
            </p>
            <p className="text-ink leading-relaxed break-words whitespace-pre-wrap font-medium">
              {user?.lockedReason || "Không có lý do chi tiết được ghi nhận trong hệ thống."}
            </p>
          </div>

          {/* Thời điểm khóa */}
          {user?.lockedAt && (
            <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-xs text-subtle border border-border">
              <Clock className="size-3.5 text-subtle shrink-0" />
              <span>Thời điểm khóa:</span>
              <span className="font-medium text-ink tabular-nums">
                {formatDateTime(user.lockedAt)}
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl cursor-pointer">
            Đóng
          </Button>
          {onUnlock && (
            <Button
              type="button"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
              onClick={() => {
                onClose();
                onUnlock(user);
              }}
            >
              <Unlock className="size-4 shrink-0" />
              Mở khóa tài khoản
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
