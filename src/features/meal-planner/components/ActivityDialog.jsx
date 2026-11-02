import { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useAddActivity, useDeleteActivity, useUpdateActivity } from "@/features/meal-planner/hooks/useDiary";
import { cn } from "@/lib/utils";

// Gợi ý nhanh; loại vận động là chuỗi tự do (tối đa 100 ký tự) nên vẫn gõ loại khác được.
const ACTIVITY_PRESETS = ["Đi bộ", "Chạy bộ", "Đạp xe", "Yoga", "Bơi lội", "Tập gym"];
const TYPE_MAX = 100;
const MINUTES_MAX = 1440;

/** Ghi thêm, sửa và xóa các hoạt động của một ngày. `entries` là `diary.activities` của ngày đó (cập nhật sau mỗi lần ghi). */
export default function ActivityDialog({ date, entries, onClose }) {
  const [activityType, setActivityType] = useState("");
  const [minutes, setMinutes] = useState("");
  // Id hoạt động đang sửa; null là đang thêm mới.
  const [editingId, setEditingId] = useState(null);
  const add = useAddActivity();
  const update = useUpdateActivity();
  const remove = useDeleteActivity();

  const type = activityType.trim();
  const minutesNumber = Number(minutes);
  const minutesValid = Number.isInteger(minutesNumber) && minutesNumber >= 1 && minutesNumber <= MINUTES_MAX;
  const saving = add.isPending || update.isPending;
  const canSubmit = type.length > 0 && minutesValid && !saving;
  const isEditing = editingId !== null;

  const resetForm = () => {
    setEditingId(null);
    setActivityType("");
    setMinutes("");
  };

  const handleStartEdit = (entry) => {
    setEditingId(entry.id);
    setActivityType(entry.activityType);
    setMinutes(String(entry.minutes));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    try {
      if (isEditing) {
        await update.mutateAsync({ id: editingId, date, activityType: type, minutes: minutesNumber });
      } else {
        await add.mutateAsync({ date, activityType: type, minutes: minutesNumber });
      }
      resetForm();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove.mutateAsync({ date, id });
      if (id === editingId) resetForm();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Sửa vận động" : "Ghi vận động"}</DialogTitle>
          <DialogDescription>
            Thêm hoặc chỉnh hoạt động bạn đã làm trong ngày. Vận động chỉ để theo dõi, không trừ vào calo đã ăn.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {ACTIVITY_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={type === preset}
                onClick={() => setActivityType(preset)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm font-medium transition",
                  type === preset
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border text-body hover:bg-surface",
                )}
              >
                {preset}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              aria-label="Loại vận động"
              placeholder="Loại vận động"
              maxLength={TYPE_MAX}
              value={activityType}
              onChange={(event) => setActivityType(event.target.value)}
            />
            <Input
              aria-label="Số phút"
              aria-invalid={minutes !== "" && !minutesValid}
              placeholder="Số phút"
              type="number"
              inputMode="numeric"
              min={1}
              max={MINUTES_MAX}
              className="w-32 shrink-0"
              value={minutes}
              onChange={(event) => setMinutes(event.target.value)}
            />
          </div>
          {minutes !== "" && !minutesValid && (
            <p className="text-xs text-destructive">Số phút phải là số nguyên từ 1 đến {MINUTES_MAX}.</p>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={!canSubmit}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? "Lưu" : "Thêm"}
            </Button>
            {isEditing && (
              <Button type="button" variant="ghost" disabled={saving} onClick={resetForm}>
                Hủy sửa
              </Button>
            )}
          </div>
        </form>

        <section>
          <h3 className="text-sm font-semibold text-ink">Đã ghi trong ngày</h3>
          {entries.length === 0 ? (
            <p className="mt-2 text-sm text-subtle">Chưa có hoạt động nào.</p>
          ) : (
            <ul className="mt-2 flex max-h-48 flex-col gap-1.5 overflow-y-auto pr-1">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl bg-surface px-3 py-2 text-sm",
                    entry.id === editingId && "ring-2 ring-brand/40",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate text-ink">
                    {entry.activityType} · {entry.minutes} phút
                  </span>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Sửa ${entry.activityType}`}
                    disabled={saving}
                    onClick={() => handleStartEdit(entry)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Xóa ${entry.activityType}`}
                    disabled={remove.isPending}
                    onClick={() => handleDelete(entry.id)}
                  >
                    {remove.isPending && remove.variables?.id === entry.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
