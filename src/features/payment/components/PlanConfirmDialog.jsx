import { AlertTriangle, CalendarClock, Loader2, TrendingUp } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCheckoutPreview } from "@/features/payment/hooks";
import { formatDateTime, PLAN_RANK, planName } from "@/features/payment/utils/paymentFormat";

// Xác nhận gia hạn hoặc nâng cấp gói, nội dung lấy từ GET /payments/checkout-preview (ước tính, BE tính lại khi nhận webhook payOS).
export default function PlanConfirmDialog({ open, onOpenChange, onConfirm, targetPlan, loading = false }) {
  const { data: preview, isPending, isError, error } = useCheckoutPreview(targetPlan, { enabled: open });

  const isUpgrade = preview && (PLAN_RANK[preview.targetPlan] ?? 0) > (PLAN_RANK[preview.currentPlan] ?? 0);
  const target = planName(targetPlan);
  const current = preview ? planName(preview.currentPlan) : "";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia
            className={
              isError
                ? "bg-destructive/10 text-destructive"
                : "bg-brand-soft text-brand"
            }
          >
            {isError ? <AlertTriangle className="size-6" /> : isUpgrade ? <TrendingUp className="size-6" /> : <CalendarClock className="size-6" />}
          </AlertDialogMedia>
          <AlertDialogTitle>{isUpgrade ? `Nâng cấp lên ${target}` : `Gia hạn ${target}`}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 text-sm text-body">
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin text-brand" />
                Đang tính thời hạn gói mới…
              </span>
            ) : isError ? (
              <span className="block text-destructive">{error.message}</span>
            ) : isUpgrade ? (
              <>
                <span className="block">
                  Bạn đang dùng <strong className="font-semibold text-ink">{current}</strong>, còn khoảng{" "}
                  <strong className="font-semibold text-ink">{preview.remainingDays} ngày</strong>. {target} được áp
                  dụng ngay sau khi thanh toán, phần còn lại của {current} được quy đổi thành{" "}
                  <strong className="font-semibold text-ink">+{preview.bonusDays} ngày</strong> của {target}.
                </span>
                <span className="block">
                  Hạn dùng dự kiến đến{" "}
                  <strong className="font-semibold text-ink">{formatDateTime(preview.newExpiresAt)}</strong>.
                </span>
              </>
            ) : (
              <>
                <span className="block">
                  Bạn đang dùng <strong className="font-semibold text-ink">{target}</strong>, còn khoảng{" "}
                  <strong className="font-semibold text-ink">{preview.remainingDays} ngày</strong>. Thanh toán sẽ được
                  cộng dồn vào hạn hiện tại.
                </span>
                <span className="block">
                  Hạn dùng dự kiến đến{" "}
                  <strong className="font-semibold text-ink">{formatDateTime(preview.newExpiresAt)}</strong>.
                </span>
              </>
            )}
            {preview && (
              <span className="mt-1 block text-xs text-subtle">
                Đây là số liệu dự kiến, hạn dùng chính thức được tính lại khi thanh toán thành công.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Để sau</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading || isPending || isError} className="gap-2">
            {loading && <Loader2 className="size-4 animate-spin" />}
            Tiếp tục thanh toán
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
