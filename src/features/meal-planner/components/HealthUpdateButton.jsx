import { useState } from "react";
import { HeartPulse, Loader2 } from "lucide-react";
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
import { useApplyHealthUpdate, usePreviewHealthUpdate } from "@/features/meal-planner/hooks/useMealPlanMutations";
import {
  averageDailyTotals,
  countMissedDays,
  MACRO_ROWS,
  targetRangeLines,
} from "@/features/meal-planner/utils/mealPlan";

const formatNumber = (value) => (value == null ? "—" : Number(value).toLocaleString("vi-VN"));

/**
 * Nút "Cập nhật theo chỉ số mới" + hộp thoại xem trước của một thực đơn.
 * Bấm nút: BE tính lại mục tiêu dinh dưỡng theo chỉ số sức khỏe mới nhất và co giãn lại khẩu phần, nhưng CHƯA lưu
 * (update-from-health với confirm=false). Người dùng xem so sánh rồi bấm "Áp dụng" mới lưu (confirm=true);
 * BE giữ bản cũ trong lịch sử phiên bản. `plan` là một MealPlan trong danh sách của useMealPlans.
 */
export default function HealthUpdateButton({ plan }) {
  const [open, setOpen] = useState(false);
  const preview = usePreviewHealthUpdate();
  const apply = useApplyHealthUpdate();

  const openDialog = () => {
    setOpen(true);
    preview.mutate(plan.id);
  };

  const handleOpenChange = (next) => {
    // Đang lưu thì không cho đóng, tránh người dùng tưởng đã hủy.
    if (apply.isPending) return;
    setOpen(next);
    if (!next) preview.reset();
  };

  const handleApply = async () => {
    try {
      await apply.mutateAsync(plan.id);
      toast.success("Đã cập nhật thực đơn theo chỉ số sức khỏe mới");
      setOpen(false);
      preview.reset();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const result = preview.data;
  const before = averageDailyTotals(result?.currentPlan);
  const after = averageDailyTotals(result?.proposedPlan);
  const targetLines = targetRangeLines(result?.recalculatedTarget);
  const missedDays = result?.proposedPlan ? countMissedDays({ plan: result.proposedPlan }) : 0;

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={openDialog}>
        <HeartPulse className="size-4" />
        Cập nhật theo chỉ số mới
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật theo chỉ số sức khỏe</DialogTitle>
            <DialogDescription>
              Tính lại mục tiêu dinh dưỡng theo chiều cao, cân nặng mới nhất của bạn rồi điều chỉnh khẩu phần các món.
            </DialogDescription>
          </DialogHeader>

          {preview.isPending && (
            <p className="flex items-center gap-2 py-6 text-sm text-subtle">
              <Loader2 className="size-4 animate-spin" />
              Đang tính lại thực đơn theo chỉ số mới...
            </p>
          )}

          {preview.isError && (
            <div className="flex flex-col items-start gap-3 rounded-2xl bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">{preview.error.message}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => preview.mutate(plan.id)}>
                Thử lại
              </Button>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-4 text-sm">
              <section>
                <h3 className="font-semibold text-ink">Mục tiêu mỗi ngày sau khi cập nhật</h3>
                {targetLines.length > 0 ? (
                  <ul className="mt-1 list-inside list-disc text-subtle">
                    {targetLines.map((line) => (
                      <li key={line.key}>
                        {line.label}: {line.range}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-subtle">Không có mục tiêu cụ thể.</p>
                )}
              </section>

              {before && after && (
                <section>
                  <h3 className="font-semibold text-ink">Trung bình mỗi ngày</h3>
                  <div className="mt-2 overflow-hidden rounded-2xl border border-border">
                    <div className="grid grid-cols-3 bg-surface px-3 py-2 text-xs font-semibold text-subtle">
                      <span />
                      <span className="text-right">Hiện tại</span>
                      <span className="text-right">Sau khi cập nhật</span>
                    </div>
                    {MACRO_ROWS.map((row) => (
                      <div key={row.key} className="grid grid-cols-3 border-t border-border px-3 py-2">
                        <span className="text-body">{row.label}</span>
                        <span className="text-right text-subtle">
                          {formatNumber(before[row.key])} {row.unit}
                        </span>
                        <span className="text-right font-semibold text-ink">
                          {formatNumber(after[row.key])} {row.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {missedDays > 0 && (
                <p className="rounded-xl bg-warning/10 px-3 py-2 text-warning">
                  {missedDays}/7 ngày vẫn chưa đạt hết mục tiêu mới, bạn xem chi tiết từng ngày sau khi áp dụng.
                </p>
              )}

              <p className="text-xs text-subtle">
                Mục tiêu dinh dưỡng bạn đặt trước đó sẽ được thay bằng mục tiêu mới ở trên. Thực đơn hiện tại được lưu lại
                thành phiên bản cũ.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" disabled={apply.isPending} onClick={() => handleOpenChange(false)}>
              Hủy
            </Button>
            <Button type="button" disabled={!result || apply.isPending} onClick={handleApply}>
              {apply.isPending && <Loader2 className="size-4 animate-spin" />}
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
