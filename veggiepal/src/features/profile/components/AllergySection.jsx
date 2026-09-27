import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, Save } from "lucide-react";

import {
  getAllergens,
  getMyAllergies,
  replaceMyAllergies,
} from "@/features/profile/api/profileApi";
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
  const [catalog, setCatalog] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [initial, setInitial] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [all, mine] = await Promise.all([getAllergens(), getMyAllergies()]);
      setCatalog(all ?? []);
      const ids = new Set((mine ?? []).map((a) => a.id));
      setSelected(ids);
      setInitial(new Set(ids));
    } catch (err) {
      setError(err.message || "Không tải được danh mục dị ứng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    const map = {};
    for (const a of catalog) {
      const key = a.category || "OTHER";
      if (!map[key]) map[key] = [];
      map[key].push(a);
    }
    return map;
  }, [catalog]);

  const dirty =
    selected.size !== initial.size ||
    [...selected].some((id) => !initial.has(id));

  const toggle = (id) => {
    setSuccess(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const result = await replaceMyAllergies([...selected]);
      const ids = new Set((result ?? []).map((a) => a.id));
      setSelected(ids);
      setInitial(new Set(ids));
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Cập nhật dị ứng thất bại");
    } finally {
      setSaving(false);
    }
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
      ) : error && catalog.length === 0 ? (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
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

          {error && (
            <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Đã cập nhật danh sách dị ứng.
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty}
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Lưu dị ứng
          </button>
        </>
      )}
    </section>
  );
}
