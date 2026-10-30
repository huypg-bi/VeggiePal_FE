import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Leaf,
  Pencil,
  Plus,
  RotateCcw,
  Salad,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import IngredientFormDialog from "@/features/admin/components/IngredientFormDialog";
import { useDeleteIngredient } from "@/features/ingredient/hooks/useIngredientMutations";
import { useIngredients } from "@/features/ingredient/hooks/useIngredients";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import SelectField from "@/shared/components/SelectField";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 400;

const VEGAN_OPTIONS = [
  { value: "", label: "Mọi loại" },
  { value: "true", label: "Thuần chay" },
  { value: "false", label: "Không thuần chay" },
];

const ALLERGEN_OPTIONS = [
  { value: "", label: "Dị ứng: tất cả" },
  { value: "true", label: "Có thể gây dị ứng" },
  { value: "false", label: "Không gây dị ứng" },
];

// Giá trị của dropdown lọc -> tham số boolean của BE ("" = không lọc).
const toBool = (value) => (value === "" ? undefined : value === "true");

const num = (value) => (value == null ? "—" : Number(value));

export default function AdminIngredientsScreen() {
  const [text, setText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [vegan, setVegan] = useState("");
  const [allergen, setAllergen] = useState("");
  const [page, setPage] = useState(0);
  const timerRef = useRef(undefined);

  const [formTarget, setFormTarget] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data, isPending, isError, error, isFetching } = useIngredients({
    keyword,
    vegan: toBool(vegan),
    allergen: toBool(allergen),
    page,
    size: PAGE_SIZE,
  });
  const deleteIngredient = useDeleteIngredient();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setText(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setKeyword(value.trim());
      setPage(0);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleClearSearch = () => {
    setText("");
    setKeyword("");
    setPage(0);
  };

  const handleFilter = (setter) => (value) => {
    setter(value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setText("");
    setKeyword("");
    setVegan("");
    setAllergen("");
    setPage(0);
  };

  const hasActiveFilters = Boolean(keyword || vegan || allergen);

  const handleDelete = () =>
    deleteIngredient.mutate(deleting.id, {
      onSuccess: () => {
        setDeleting(null);
        toast.success("Đã xóa nguyên liệu");
      },
      onError: (err) => {
        setDeleting(null);
        toast.error(err.message);
      },
    });

  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Tiêu đề & giới thiệu chức năng */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Salad className="size-6 text-brand" />
            <h1 className="font-heading text-3xl font-bold text-ink">Nguyên liệu</h1>
          </div>
          <p className="mt-1 text-sm text-subtle">
            Danh mục nguyên liệu và dinh dưỡng trên 100g, dùng để người dùng soạn công thức và tính kcal.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setFormTarget({ mode: "create" })}
          className="gap-2 shadow-2xs cursor-pointer"
        >
          <Plus className="size-4" />
          Thêm nguyên liệu
        </Button>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-card p-3.5 shadow-xs">
        <div className="relative min-w-64 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={text}
            onChange={handleSearch}
            placeholder="Tìm theo tên nguyên liệu..."
            aria-label="Tìm nguyên liệu"
            className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-9 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
          {text && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle transition hover:text-ink cursor-pointer"
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <RotateCcw className="size-3.5" />
            </button>
          )}
        </div>

        <SelectField
          aria-label="Lọc thuần chay"
          options={VEGAN_OPTIONS}
          value={vegan}
          onValueChange={handleFilter(setVegan)}
          className="h-10 min-w-44"
        />

        <SelectField
          aria-label="Lọc dị ứng"
          options={ALLERGEN_OPTIONS}
          value={allergen}
          onValueChange={handleFilter(setAllergen)}
          className="h-10 min-w-44"
        />

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-subtle hover:text-ink cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            Đặt lại
          </Button>
        )}
      </div>

      {/* Bảng danh sách nguyên liệu */}
      {isError ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error?.message || "Không thể tải danh sách nguyên liệu"}
        </div>
      ) : isPending ? (
        <div aria-hidden className="h-72 animate-pulse rounded-3xl border border-border bg-card" />
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-subtle">
          Không tìm thấy nguyên liệu nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm border-collapse">
              <thead className="border-b border-border bg-surface/75 text-xs uppercase tracking-wider text-subtle font-semibold">
                <tr className="divide-x divide-border">
                  <th className="px-6 py-3.5 text-left">Nguyên liệu</th>
                  <th className="px-4 py-3.5 text-center">Kcal</th>
                  <th className="px-4 py-3.5 text-center">Đạm (g)</th>
                  <th className="px-4 py-3.5 text-center">Tinh bột (g)</th>
                  <th className="px-4 py-3.5 text-center">Béo (g)</th>
                  <th className="px-4 py-3.5 text-center">Xơ (g)</th>
                  <th className="px-4 py-3.5 text-center">Phân loại</th>
                  <th className="px-6 py-3.5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((ingredient) => (
                  <tr
                    key={ingredient.id}
                    className="divide-x divide-border text-body transition-colors hover:bg-surface/50"
                  >
                    {/* Tên nguyên liệu */}
                    <td className="px-6 py-4 text-left">
                      <div className="flex flex-col">
                        <span className="font-semibold text-ink text-sm">
                          {ingredient.name}
                        </span>
                        {ingredient.description && (
                          <span className="text-xs text-subtle line-clamp-1 mt-0.5">
                            {ingredient.description}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Dinh dưỡng trên 100g */}
                    <td className="px-4 py-4 text-center tabular-nums font-semibold text-ink">
                      {num(ingredient.caloriesPer100g)}
                    </td>
                    <td className="px-4 py-4 text-center tabular-nums font-medium text-body">
                      {num(ingredient.proteinPer100g)}
                    </td>
                    <td className="px-4 py-4 text-center tabular-nums font-medium text-body">
                      {num(ingredient.carbsPer100g)}
                    </td>
                    <td className="px-4 py-4 text-center tabular-nums font-medium text-body">
                      {num(ingredient.fatPer100g)}
                    </td>
                    <td className="px-4 py-4 text-center tabular-nums font-medium text-body">
                      {num(ingredient.fiberPer100g)}
                    </td>

                    {/* Phân loại (Thuần chay / Dị ứng) */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {ingredient.vegan && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-xs font-medium text-emerald-700 shadow-2xs dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <Leaf className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            Thuần chay
                          </span>
                        )}
                        {ingredient.allergen && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/80 px-2.5 py-1 text-xs font-medium text-amber-700 shadow-2xs dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
                            <TriangleAlert className="size-3.5 text-amber-600 dark:text-amber-400" />
                            Dị ứng
                          </span>
                        )}
                        {!ingredient.vegan && !ingredient.allergen && (
                          <span className="text-xs text-subtle font-medium">—</span>
                        )}
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormTarget({ mode: "edit", ingredient })}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand/40 hover:bg-brand-soft/40 hover:text-brand shadow-2xs cursor-pointer"
                          title={`Chỉnh sửa ${ingredient.name}`}
                        >
                          <Pencil className="size-3.5 text-subtle" />
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(ingredient)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 hover:border-rose-300 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 shadow-2xs cursor-pointer"
                          title={`Xóa ${ingredient.name}`}
                        >
                          <Trash2 className="size-3.5 text-rose-500 dark:text-rose-400" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card px-6 py-3.5 text-sm text-subtle">
            <span className="font-medium text-xs sm:text-sm">
              {data.totalElements} nguyên liệu • Trang {data.page + 1}/{Math.max(data.totalPages, 1)}
              {isFetching && " • Đang cập nhật..."}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={data.page <= 0 || isFetching}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                className="rounded-xl border-border px-3 text-xs font-medium hover:bg-surface cursor-pointer"
              >
                <ChevronLeft className="size-4" />
                Trước
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={data.page + 1 >= data.totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border-border px-3 text-xs font-medium hover:bg-surface cursor-pointer"
              >
                Sau
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Ghi chú dưới cùng */}
      <div className="flex items-center gap-2 text-xs text-subtle">
        <Info className="size-3.5 shrink-0 text-brand" />
        <span>Chỉ hiện nguyên liệu đang sử dụng, nguyên liệu đã tắt “Đang sử dụng” sẽ không có trong danh sách này.</span>
      </div>

      <IngredientFormDialog target={formTarget} onClose={() => setFormTarget(null)} />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Xóa nguyên liệu?"
        description={`“${deleting?.name ?? ""}” sẽ bị xóa vĩnh viễn. Nếu nguyên liệu đang nằm trong công thức nào đó, hệ thống sẽ không cho xóa.`}
        loading={deleteIngredient.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
