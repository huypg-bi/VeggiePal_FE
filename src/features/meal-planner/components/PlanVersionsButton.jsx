import { useState } from "react";
import { History, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMealPlanVersions } from "@/features/meal-planner/hooks/useMealPlans";
import { averageDailyTotals } from "@/features/meal-planner/utils/mealPlan";

function formatDateTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "TB mỗi ngày: 1.650 kcal · đạm 51g · tinh bột 201g · béo 41g" hoặc chuỗi rỗng khi bản cũ không có số liệu. */
function describeAverage(plan) {
  const average = averageDailyTotals(plan);
  if (!average) return "";
  const n = (value) => value.toLocaleString("vi-VN");
  return `TB mỗi ngày: ${n(average.calories)} kcal · đạm ${n(average.protein)}g · tinh bột ${n(
    average.carbohydrate,
  )}g · béo ${n(average.fat)}g`;
}

/**
 * Nút "Lịch sử" + hộp thoại liệt kê các phiên bản cũ của một thực đơn (chỉ xem, BE chưa có API khôi phục).
 * BE chỉ lưu phiên bản khi thực đơn được cập nhật theo sức khỏe hoặc sửa thủ công; đổi món bằng AI thì không.
 * `plan` là một MealPlan trong danh sách của useMealPlans (có `version` hiện tại).
 */
export default function PlanVersionsButton({ plan }) {
  const [open, setOpen] = useState(false);
  const { data: versions, isPending, isError, error, refetch } = useMealPlanVersions(plan.id, open);

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <History className="size-4" />
        Lịch sử
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lịch sử phiên bản</DialogTitle>
            <DialogDescription>
              “{plan.name}” đang ở phiên bản {plan.version ?? 1}. Mỗi lần cập nhật theo chỉ số sức khỏe, bản trước đó
              được lưu lại ở đây.
            </DialogDescription>
          </DialogHeader>

          {isPending && (
            <p className="flex items-center gap-2 py-6 text-sm text-subtle">
              <Loader2 className="size-4 animate-spin" />
              Đang tải lịch sử...
            </p>
          )}

          {isError && (
            <div className="flex flex-col items-start gap-3 rounded-2xl bg-destructive/10 px-4 py-3">
              <p className="text-sm text-destructive">{error.message}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
                Thử lại
              </Button>
            </div>
          )}

          {versions && versions.length === 0 && (
            <p className="rounded-2xl bg-surface px-4 py-6 text-center text-sm text-subtle">
              Thực đơn này chưa có phiên bản cũ nào.
            </p>
          )}

          {versions && versions.length > 0 && (
            <ul className="flex flex-col gap-2">
              {versions.map((item) => {
                const average = describeAverage(item.plan);
                return (
                  <li key={item.id ?? item.version} className="rounded-2xl border border-border px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="font-semibold text-ink">Phiên bản {item.version}</span>
                      <span className="text-xs text-subtle">Thay thế lúc {formatDateTime(item.createdAt)}</span>
                    </div>
                    {item.changeSummary && <p className="mt-1 text-body">{item.changeSummary}</p>}
                    {average && <p className="mt-1 text-xs text-subtle">{average}</p>}
                  </li>
                );
              })}
            </ul>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
