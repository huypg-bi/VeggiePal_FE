import { useState } from "react";
import { AlertTriangle, Loader2, Lock } from "lucide-react";
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
import { useLockUser } from "../hooks/useAdminUsers";

const MAX_REASON_LENGTH = 500;

// Hộp thoại xác nhận khóa tài khoản người dùng kèm lý do bắt buộc.
export default function LockUserDialog({ user, onClose }) {
  const [reason, setReason] = useState("");
  const lockUserMutation = useLockUser();

  const isOpen = Boolean(user);
  const trimmedReason = reason.trim();
  const isTooLong = reason.length > MAX_REASON_LENGTH;
  const isInvalid = !trimmedReason || isTooLong;

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleConfirm = () => {
    if (isInvalid || !user) return;
    lockUserMutation.mutate(
      { id: user.id, reason: trimmedReason },
      {
        onSuccess: () => {
          toast.success(`Đã khóa tài khoản "${user.fullName || user.email}"`);
          handleClose();
        },
        onError: (err) => {
          toast.error(err.message || "Không thể khóa tài khoản");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <Lock className="size-5 shrink-0" />
            <DialogTitle>Khóa tài khoản người dùng</DialogTitle>
          </div>
          <DialogDescription>
            Bạn đang chuẩn bị khóa tài khoản của{" "}
            <span className="font-semibold text-ink">
              {user?.fullName ? `${user.fullName} (${user.email})` : user?.email}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="rounded-2xl border border-warning/30 bg-warning/10 p-3 text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-4 shrink-0 mt-0.5 text-warning" />
              <span>
                Khóa tài khoản sẽ hủy refresh token ngay lập tức. Tuy nhiên, access token đang hoạt động vẫn có thể còn hiệu lực tối đa 15 phút.
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lock-reason" className="text-xs font-semibold uppercase tracking-wider text-subtle">
              Lý do khóa <span className="text-destructive">*</span>
            </label>
            <textarea
              id="lock-reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do khóa tài khoản (bắt buộc, tối đa 500 ký tự)..."
              maxLength={MAX_REASON_LENGTH}
              className="w-full resize-none rounded-2xl border border-border bg-surface p-3 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
            />
            <div className="flex justify-end text-xs text-subtle">
              <span className={reason.length >= MAX_REASON_LENGTH ? "font-semibold text-destructive" : ""}>
                {reason.length}/{MAX_REASON_LENGTH}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleClose} disabled={lockUserMutation.isPending}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isInvalid || lockUserMutation.isPending}
          >
            {lockUserMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Xác nhận khóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
