import { useState } from "react";
import { Loader2, Pencil, Plus, Undo2 } from "lucide-react";
import { toast } from "sonner";

import iconRun from "@/assets/img/icon_run.png";
import iconWater from "@/assets/img/icon_water.png";
import { Button } from "@/components/ui/button";
import ActivityDialog from "@/features/meal-planner/components/ActivityDialog";
import WaterDialog from "@/features/meal-planner/components/WaterDialog";
import { useAddWater, useDeleteWater } from "@/features/meal-planner/hooks/useDiary";
import { formatLiters, WATER_GOAL_ML, WATER_QUICK_AMOUNTS } from "@/features/meal-planner/utils/mealPlan";

// Hai thẻ ghi nhận nước uống và vận động của ngày đang xem, cùng dáng với các thẻ khác trong StatsGrid.

function CardShell({ icon, label, badge, value, unit, action, caption, children }) {
  return (
    <article className="relative flex h-full flex-col gap-3 rounded-2xl bg-card p-5 shadow-md transition hover:shadow-lg">
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand">
          {badge}
        </span>
      )}
      <div className="flex items-center gap-2 text-sm font-medium text-subtle">
        <span className="grid size-12 shrink-0 place-items-center">
          <img src={icon} alt="" className="h-full w-full object-contain" />
        </span>
        <span className="flex-1">{label}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        <span className="text-2xl font-bold text-ink">{value}</span>
        {unit && <span className="text-sm font-medium text-subtle">{unit}</span>}
        {action && <span className="ml-2">{action}</span>}
      </div>
      {children && <div className="flex flex-wrap gap-1.5">{children}</div>}
      {caption && <p className="mt-auto text-xs leading-snug text-subtle">{caption}</p>}
    </article>
  );
}

export function WaterCard({ diary, date, isFutureDay }) {
  const [open, setOpen] = useState(false);
  const addWater = useAddWater();
  const deleteWater = useDeleteWater();
  const entries = diary?.water ?? [];
  const total = Number(diary?.totalWaterMl) || 0;
  const busy = addWater.isPending || deleteWater.isPending;
  const disabled = !diary || isFutureDay || busy;
  const percent = Math.round((total / WATER_GOAL_ML) * 100);

  const handleAdd = async (milliliters) => {
    try {
      await addWater.mutateAsync({ date, milliliters });
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Xóa lần uống gần nhất (BE trả theo thứ tự ghi nên là phần tử cuối).
  const handleUndo = async () => {
    try {
      await deleteWater.mutateAsync({ date, id: entries.at(-1).id });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
    <CardShell
      icon={iconWater}
      label="Nước & Khoáng"
      badge={diary ? `${percent}% mục tiêu` : undefined}
      value={diary ? formatLiters(total) : "—"}
      unit={`/ ${formatLiters(WATER_GOAL_ML)} L`}
      caption={
        isFutureDay
          ? "Chưa đến ngày này nên chưa ghi được"
          : !diary
            ? "Đang tải nhật ký..."
            : undefined
      }
    >
      {WATER_QUICK_AMOUNTS.map((amount) => (
        <Button key={amount} type="button" size="sm" variant="soft" disabled={disabled} onClick={() => handleAdd(amount)}>
          {addWater.isPending && addWater.variables?.milliliters === amount ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Plus />
          )}
          {amount} ml
        </Button>
      ))}
      {entries.length > 0 && (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Hoàn tác lần uống gần nhất"
          title="Hoàn tác"
          disabled={disabled}
          onClick={handleUndo}
        >
          {deleteWater.isPending ? <Loader2 className="animate-spin" /> : <Undo2 />}
        </Button>
      )}
      {entries.length > 0 && (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Xem và sửa các lần uống"
          title="Xem và sửa các lần uống"
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          <Pencil />
        </Button>
      )}
    </CardShell>
    {open && <WaterDialog date={date} entries={entries} onClose={() => setOpen(false)} />}
    </>
  );
}

export function ActivityCard({ diary, date, isFutureDay }) {
  const [open, setOpen] = useState(false);
  const entries = diary?.activities ?? [];
  const last = entries.at(-1);

  return (
    <>
      <CardShell
        icon={iconRun}
        label="Vận Động"
        value={diary ? (Number(diary.totalActivityMinutes) || 0).toLocaleString("vi-VN") : "—"}
        unit="phút"
        action={
          <Button type="button" size="sm" variant="soft" disabled={!diary || isFutureDay} onClick={() => setOpen(true)}>
            <Plus />
            Ghi vận động
          </Button>
        }
        caption={
          isFutureDay
            ? "Chưa đến ngày này nên chưa ghi được"
            : !diary
              ? "Đang tải nhật ký..."
              : last
                ? `Gần nhất: ${last.activityType} ${last.minutes} phút`
                : "Chưa ghi hoạt động nào"
        }
      />
      {open && <ActivityDialog date={date} entries={entries} onClose={() => setOpen(false)} />}
    </>
  );
}
