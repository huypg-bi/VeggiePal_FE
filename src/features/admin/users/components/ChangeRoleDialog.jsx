import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";
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
import { useChangeUserRole } from "../hooks/useAdminUsers";

// Hộp thoại xác nhận nâng quyền người dùng lên Quản trị viên (ADMIN).
export default function ChangeRoleDialog({ user, onClose }) {
  const changeRoleMutation = useChangeUserRole();
  const isOpen = Boolean(user);

  const handleConfirm = () => {
    if (!user) return;
    changeRoleMutation.mutate(
      { id: user.id, role: "ADMIN" },
      {
        onSuccess: () => {
          toast.success(`Đã nâng quyền Quản trị viên cho "${user.fullName || user.email}"`);
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || "Không thể thay đổi quyền người dùng");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="size-5 shrink-0" />
            <DialogTitle>Nâng quyền Quản trị viên</DialogTitle>
          </div>
          <DialogDescription>
            Bạn có chắc chắn muốn nâng quyền Quản trị viên (ADMIN) cho{" "}
            <span className="font-semibold text-ink">
              {user?.fullName ? `${user.fullName} (${user.email})` : user?.email}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5 py-2">
          <div className="rounded-2xl border border-warning/30 bg-warning/10 p-3 text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-warning" />
              <span>
                Thao tác sẽ hủy refresh token của tài khoản. Quyền mới sẽ có hiệu lực trong vòng tối đa 15 phút khi access token cũ hết hạn.
              </span>
            </div>
          </div>
          <p className="text-xs text-subtle">
            Lưu ý: Không thể hạ quyền tài khoản ADMIN qua giao diện (cần can thiệp trực tiếp qua cơ sở dữ liệu nếu muốn hạ quyền).
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={changeRoleMutation.isPending}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleConfirm}
            disabled={changeRoleMutation.isPending}
            className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            {changeRoleMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Xác nhận nâng quyền
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
