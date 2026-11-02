import { useState } from "react";
import { Loader2 } from "lucide-react";
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
import { useConfirmMeal } from "@/features/meal-planner/hooks/useDiary";
import { formatServing, SERVING_OPTIONS, toRounded } from "@/features/meal-planner/utils/mealPlan";
import { cn } from "@/lib/utils";

export default function ConfirmMealDialog({ planId, meal, mealLabel, title, date, onClose }) {
  const planned = Number(meal.servingMultiplier) || 1;
  const [servings, setServings] = useState(planned);
  const confirm = useConfirmMeal();

  // Khẩu phần thực đơn có thể nằm ngoài các mức chọn sẵn (vd 0,9) nên thêm vào danh sách.
  const options = [...new Set([...SERVING_OPTIONS, planned])].sort((a, b) => a - b);
  // Dinh dưỡng của bữa trong thực đơn đã nhân sẵn khẩu phần `planned`, đổi sang khẩu phần thực ăn theo tỉ lệ.
  const scale = servings / planned;
  const kcal = toRounded(Number(meal.nutrition?.calories) * scale);

  const handleConfirm = async () => {
    try {
      await confirm.mutateAsync({ planId, mealType: meal.mealType, date, servings });
      toast.success(`Đã ghi ${mealLabel.toLowerCase()} vào nhật ký`);
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open onOpenChange={(next) => !next && !confirm.isPending && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ghi {mealLabel} vào nhật ký</DialogTitle>
          <DialogDescription>
            {title ? `${title}. ` : ""}Chọn số khẩu phần bạn đã ăn. Sau khi ghi, muốn đổi khẩu phần thì bỏ đánh dấu rồi ghi
            lại.
          </DialogDescription>
        </DialogHeader>

        <section>
          <h3 className="text-sm font-semibold text-ink">Khẩu phần</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={servings === option}
                onClick={() => setServings(option)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm font-medium transition",
                  servings === option
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border text-body hover:bg-surface",
                )}
              >
                {formatServing(option)}
                {option === planned ? " (theo thực đơn)" : ""}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-subtle">
            Khoảng <span className="font-semibold text-ink">{kcal.toLocaleString("vi-VN")} kcal</span> sẽ được ghi.
          </p>
        </section>

        <DialogFooter>
          <Button type="button" variant="ghost" disabled={confirm.isPending} onClick={onClose}>
            Hủy
          </Button>
          <Button type="button" disabled={confirm.isPending} onClick={handleConfirm}>
            {confirm.isPending && <Loader2 className="size-4 animate-spin" />}
            Ghi vào nhật ký
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
