import { useState } from "react";
import { Check, Loader2, Pencil, Trash2, X } from "lucide-react";
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
import { useDeleteWater, useUpdateWater } from "@/features/meal-planner/hooks/useDiary";

const WATER_MAX_ML = 100000;

/** Sửa và xóa từng lần uống nước của một ngày. `entries` là `diary.water` của ngày đó (cập nhật sau mỗi lần ghi). */
export default function WaterDialog({ date, entries, onClose }) {
  // Id lần uống đang sửa; null là chưa sửa mục nào.
  const [editingId, setEditingId] = useState(null);
  const [milliliters, setMilliliters] = useState("");
  const update = useUpdateWater();
  const remove = useDeleteWater();

  const amount = Number(milliliters);
  const amountValid = Number.isInteger(amount) && amount >= 1 && amount <= WATER_MAX_ML;

  const handleStartEdit = (entry) => {
    setEditingId(entry.id);
    setMilliliters(String(entry.milliliters));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMilliliters("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!amountValid || update.isPending) return;
    try {
      await update.mutateAsync({ id: editingId, date, milliliters: amount });
      handleCancelEdit();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove.mutateAsync({ date, id });
      if (id === editingId) handleCancelEdit();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nước đã uống trong ngày</DialogTitle>
          <DialogDescription>Chỉnh lại lượng nước của từng lần uống hoặc xóa lần ghi nhầm.</DialogDescription>
        </DialogHeader>

        {entries.length === 0 ? (
          <p className="text-sm text-subtle">Chưa có lần uống nào.</p>
        ) : (
          <ul className="flex max-h-60 flex-col gap-1.5 overflow-y-auto pr-1">
            {entries.map((entry, index) => (
              <li key={entry.id} className="flex items-center justify-between gap-2 rounded-xl bg-surface px-3 py-2 text-sm">
                {entry.id === editingId ? (
                  <form onSubmit={handleSave} className="flex flex-1 items-center gap-2">
                    <Input
                      aria-label="Lượng nước (ml)"
                      aria-invalid={milliliters !== "" && !amountValid}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={WATER_MAX_ML}
                      autoFocus
                      className="h-8 w-28"
                      value={milliliters}
                      onChange={(event) => setMilliliters(event.target.value)}
                    />
                    <span className="text-subtle">ml</span>
                    <Button
                      type="submit"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Lưu lượng nước"
                      disabled={!amountValid || update.isPending}
                    >
                      {update.isPending ? <Loader2 className="animate-spin" /> : <Check />}
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label="Hủy sửa"
                      disabled={update.isPending}
                      onClick={handleCancelEdit}
                    >
                      <X />
                    </Button>
                  </form>
                ) : (
                  <>
                    <span className="min-w-0 flex-1 truncate text-ink">
                      Lần {index + 1} · {entry.milliliters.toLocaleString("vi-VN")} ml
                    </span>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Sửa lần uống ${index + 1}`}
                      disabled={update.isPending}
                      onClick={() => handleStartEdit(entry)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Xóa lần uống ${index + 1}`}
                      disabled={remove.isPending}
                      onClick={() => handleDelete(entry.id)}
                    >
                      {remove.isPending && remove.variables?.id === entry.id ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
                    </Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        {milliliters !== "" && !amountValid && (
          <p className="text-xs text-destructive">Lượng nước phải là số nguyên từ 1 đến {WATER_MAX_ML.toLocaleString("vi-VN")} ml.</p>
        )}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
