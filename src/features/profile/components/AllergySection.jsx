import { useMemo, useState } from "react";
import { AlertTriangle, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useAllergens,
  useMyAllergies,
  useReplaceMyAllergies,
} from "@/features/profile/hooks/useAllergies";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL = {
  GRAIN: "Ngũ cốc",
  NUT: "Hạt",
  LEGUME: "Đậu",
  DAIRY: "Sữa",
  SEAFOOD: "Hải sản",
  OTHER: "Khác",
  FRUIT: "Trái cây",
  VEGETABLE: "Rau củ",
  SPICE: "Gia vị",
};

/**
 * Danh mục dị ứng + chọn dị ứng của user.
 * GET /nutrition/allergens, GET/PUT /nutrition/me/allergies
 */
export default function AllergySection() {
  const catalogQuery = useAllergens();
  const myQuery = useMyAllergies();
  const save = useReplaceMyAllergies();

  // Khi user chưa chỉnh gì thì mục đang chọn lấy từ server (savedIds);
  // khi user bấm chọn/bỏ thì giữ bản nháp riêng ở draft (null = chưa chỉnh).
  const [draft, setDraft] = useState(null);

  const catalog = catalogQuery.data;
  const loading = catalogQuery.isPending || myQuery.isPending;
  const loadError = catalogQuery.error || myQuery.error;

  const savedIds = useMemo(
    () => new Set((myQuery.data ?? []).map((a) => a.id)),
    [myQuery.data]
  );
  const selected = draft ?? savedIds;

  const grouped = useMemo(() => {
    const map = {};
    for (const a of catalog ?? []) {
      const key = a.category || "OTHER";
      if (!map[key]) map[key] = [];
      map[key].push(a);
    }
    return map;
  }, [catalog]);

  const dirty =
    selected.size !== savedIds.size ||
    [...selected].some((id) => !savedIds.has(id));

  const toggle = (id) => {
    save.reset(); // ẩn thông báo thành công / lỗi của lần lưu trước
    setDraft((prev) => {
      const next = new Set(prev ?? savedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    save.mutate([...selected], { onSuccess: () => setDraft(null) });
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <AlertTriangle className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-ink">Dị ứng thực phẩm</h2>
          <p className="text-xs text-subtle">
            Chọn các mục bạn cần tránh — dùng cho gợi ý bữa ăn
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-subtle">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang tải…
        </div>
      ) : loadError ? (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {loadError.message || "Không tải được danh mục dị ứng"}
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">
                  {CATEGORY_LABEL[cat] || cat}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((a) => {
                    const on = selected.has(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggle(a.id)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                          on
                            ? "border-rose-300 bg-rose-50 text-rose-700"
                            : "border-border bg-surface text-body hover:border-emerald-200 hover:bg-emerald-50/50"
                        )}
                      >
                        {a.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {save.isError && (
            <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {save.error.message || "Cập nhật dị ứng thất bại"}
            </p>
          )}
          {save.isSuccess && (
            <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Đã cập nhật danh sách dị ứng.
            </p>
          )}

          <Button
            type="button"
            size="lg"
            onClick={handleSave}
            disabled={save.isPending || !dirty}
            className="mt-5 rounded-xl"
          >
            {save.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Lưu dị ứng
          </Button>
        </>
      )}
    </section>
  );
}
