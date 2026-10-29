import { useState } from "react";
import { History, Loader2, RotateCcw } from "lucide-react";
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
import PlanDaysPreview from "@/features/meal-planner/components/PlanDaysPreview";
import { useRestoreMealPlanVersion } from "@/features/meal-planner/hooks/useMealPlanMutations";
import { useMealPlan, useMealPlanVersion, useMealPlanVersions } from "@/features/meal-planner/hooks/useMealPlans";
import { averageDailyTotals, formatDateTime } from "@/features/meal-planner/utils/mealPlan";

/** "TB mỗi ngày: 1.650 kcal · đạm 51g · tinh bột 201g · béo 41g" hoặc chuỗi rỗng khi bản cũ không có số liệu. */
function describeAverage(plan) {
  const average = averageDailyTotals(plan);
  if (!average) return "";
  const n = (value) => value.toLocaleString("vi-VN");
  return `TB mỗi ngày: ${n(average.calories)} kcal · đạm ${n(average.protein)}g · tinh bột ${n(
    average.carbohydrate,
  )}g · béo ${n(average.fat)}g`;
}

export default function PlanVersionsButton({ plan }) {
  const [open, setOpen] = useState(false);
  const [expandedVersion, setExpandedVersion] = useState(null);
  // Số phiên bản đang chờ xác nhận khôi phục (chỉ một dòng được hỏi một lúc).
  const [confirmVersion, setConfirmVersion] = useState(null);
  const restore = useRestoreMealPlanVersion();
  const { data: versions, isPending, isError, error, refetch } = useMealPlanVersions(plan.id, open);
  const { data: current } = useMealPlan(plan.id, open);
  // Phiên bản hiện tại lấy mới từ server; chưa tải xong thì dùng bản đã có trong danh sách trang.
  const currentPlan = current ?? plan;

  const handleOpenChange = (next) => {
    setOpen(next);
    if (!next) {
      setExpandedVersion(null);
      setConfirmVersion(null);
    }
  };

  const handleRestore = async (version) => {
    try {
      await restore.mutateAsync({ planId: plan.id, version });
      toast.success(`Đã khôi phục phiên bản ${version} thành phiên bản mới của thực đơn`);
      setConfirmVersion(null);
      setExpandedVersion(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <History className="size-4" />
        Lịch sử
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lịch sử phiên bản</DialogTitle>
            <DialogDescription>
              “{currentPlan.name}” đang ở phiên bản {currentPlan.version ?? 1}
              {currentPlan.updatedAt && ` (cập nhật lúc ${formatDateTime(currentPlan.updatedAt)})`}. Mỗi lần cập nhật
              theo chỉ số sức khỏe, sửa thủ công hoặc khôi phục, bản trước đó được lưu lại ở đây.
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
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-expanded={expandedVersion === item.version}
                        onClick={() => setExpandedVersion((value) => (value === item.version ? null : item.version))}
                      >
                        {expandedVersion === item.version ? "Ẩn nội dung" : "Xem nội dung"}
                      </Button>
                      <Button
                        type="button"
                        variant="soft"
                        size="sm"
                        disabled={restore.isPending}
                        onClick={() => setConfirmVersion(item.version)}
                      >
                        <RotateCcw className="size-4" />
                        Khôi phục
                      </Button>
                    </div>
                    {confirmVersion === item.version && (
                      <div className="mt-3 flex flex-col items-start gap-2 rounded-2xl bg-warning/10 px-3 py-2.5">
                        <p className="text-xs text-body">
                          Khôi phục phiên bản {item.version} thành phiên bản {(currentPlan.version ?? 1) + 1}? Bản đang
                          dùng được lưu vào lịch sử nên bạn vẫn quay lại được. Món trong bản này được kiểm tra lại theo
                          dị ứng hiện tại của bạn. Nhật ký đã ghi không bị đổi và không tốn lượt tạo thực đơn.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            disabled={restore.isPending}
                            onClick={() => handleRestore(item.version)}
                          >
                            {restore.isPending && <Loader2 className="size-4 animate-spin" />}
                            {restore.isPending ? "Đang khôi phục..." : "Xác nhận khôi phục"}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={restore.isPending}
                            onClick={() => setConfirmVersion(null)}
                          >
                            Hủy
                          </Button>
                        </div>
                      </div>
                    )}
                    {expandedVersion === item.version && <VersionDetail planId={plan.id} version={item.version} />}
                  </li>
                );
              })}
            </ul>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Tách riêng để chỉ gọi GET /ai/meal-plans/:id/versions/:version khi người dùng mở phiên bản đó.
function VersionDetail({ planId, version }) {
  const { data, isPending, isError, error, refetch } = useMealPlanVersion(planId, version, true);

  return (
    <div className="mt-3">
      {isPending && (
        <p className="flex items-center gap-2 py-2 text-xs text-subtle">
          <Loader2 className="size-4 animate-spin" />
          Đang tải phiên bản...
        </p>
      )}
      {isError && (
        <div className="flex flex-col items-start gap-2 rounded-2xl bg-destructive/10 px-3 py-2">
          <p className="text-xs text-destructive">{error.message}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Thử lại
          </Button>
        </div>
      )}
      {data && <PlanDaysPreview plan={data.plan} />}
    </div>
  );
}
