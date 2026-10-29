import { Loader2, Unlock } from "lucide-react";
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
import { useUnlockUser } from "../hooks/useAdminUsers";

// Hộp thoại xác nhận mở khóa tài khoản người dùng đang bị khóa.
export default function UnlockUserDialog({ user, onClose }) {
  const unlockUserMutation = useUnlockUser();
  const isOpen = Boolean(user);

  const handleConfirm = () => {
    if (!user) return;
    unlockUserMutation.mutate(user.id, {
      onSuccess: () => {
        toast.success(`Đã mở khóa tài khoản "${user.fullName || user.email}"`);
        onClose();
      },
      onError: (err) => {
        toast.error(err.message || "Không thể mở khóa tài khoản");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-brand">
            <Unlock className="size-5 shrink-0" />
            <DialogTitle>Mở khóa tài khoản</DialogTitle>
          </div>
          <DialogDescription>
            Bạn có chắc chắn muốn mở khóa tài khoản của{" "}
            <span className="font-semibold text-ink">
              {user?.fullName ? `${user.fullName} (${user.email})` : user?.email}
            </span>
            ? Tài khoản sẽ chuyển về trạng thái hoạt động (ACTIVE).
          </DialogDescription>
        </DialogHeader>

        {user?.lockedReason && (
          <div className="rounded-2xl border border-border bg-surface p-3 text-xs text-subtle">
            <span className="font-semibold text-ink">Lý do đã khóa trước đó: </span>
            <span>{user.lockedReason}</span>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={unlockUserMutation.isPending}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleConfirm}
            disabled={unlockUserMutation.isPending}
          >
            {unlockUserMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Xác nhận mở khóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
