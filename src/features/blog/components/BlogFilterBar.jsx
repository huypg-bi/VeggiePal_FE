import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/features/blog/hooks/useCategories";
import { SORT_OPTIONS, flattenCategories } from "@/features/blog/utils/feedFilters";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 400;

// Giá trị rỗng/undefined ("Mới nhất", "Tất cả danh mục") cùng được coi là mặc định khi so sánh.
const toKey = (value) => (value === "" || value == null ? "" : String(value));

/**
 * Ô chọn dạng dropdown cùng kiểu với ô tìm kiếm. `active` tô nhẹ nút khi đang lọc khác mặc định.
 * options: [{ value, label }]; onSelect(value) nhận lại đúng `value` của option được bấm.
 */
function FilterDropdown({ label, options, value, onSelect, active = false, menuClassName }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => toKey(o.value) === toKey(value)) ?? options[0];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label={label}
        className={cn(
          "flex h-11 min-w-0 items-center justify-between gap-2 rounded-full border px-4 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-brand/30",
          active
            ? "border-brand/40 bg-brand-soft text-brand"
            : "border-border bg-surface text-ink hover:border-brand/40"
        )}
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
      </DropdownMenuTrigger>

      {/* Menu rộng bằng nút (mặc định của DropdownMenuContent); mục đang chọn được tô sáng, không có dấu tick. */}
      <DropdownMenuContent align="start" className={cn("rounded-2xl p-1.5", menuClassName)}>
        {options.map((option) => (
          <DropdownMenuItem
            key={toKey(option.value)}
            onClick={() => onSelect(option.value)}
            className={toKey(option.value) === toKey(value) ? "bg-brand-soft font-semibold text-brand" : undefined}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Thanh tìm kiếm + hai dropdown sắp xếp / lọc danh mục của feed, cùng một hàng.
 * - filters: { keyword, sort, categoryId } (nguồn sự thật nằm ở URL, xem BlogScreen)
 * - onChange(patch): gộp patch vào bộ lọc hiện tại
 * Ô tìm kiếm giữ chữ đang gõ ở state cục bộ và chỉ báo lên sau khi ngừng gõ,
 * nên cha muốn xóa ô này phải remount component bằng `key`.
 */
export default function BlogFilterBar({ filters, onChange }) {
  const [text, setText] = useState(filters.keyword);
  const timerRef = useRef(undefined);
  const { data: categoryTree } = useCategories();
  const categories = flattenCategories(categoryTree);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const pushKeyword = (value) => {
    clearTimeout(timerRef.current);
    onChange({ keyword: value.trim() });
  };

  const handleTextChange = (event) => {
    const value = event.target.value;
    setText(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => onChange({ keyword: value.trim() }),
      SEARCH_DEBOUNCE_MS
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    pushKeyword(text);
  };

  const handleClear = () => {
    setText("");
    pushKeyword("");
  };

  const categoryOptions = [
    { value: undefined, label: "Tất cả danh mục" },
    ...categories.map(({ id, name }) => ({ value: id, label: name })),
  ];

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSubmit} role="search" className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={text}
            onChange={handleTextChange}
            placeholder="Tìm theo tiêu đề hoặc nội dung..."
            aria-label="Tìm bài viết"
            className={cn(
              "h-11 w-full rounded-full border border-border bg-surface pl-10 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 [&::-webkit-search-cancel-button]:hidden",
              // Chỉ chừa chỗ cho nút xóa khi đã có chữ, để placeholder được dùng hết bề ngang.
              text ? "pr-10" : "pr-4"
            )}
          />
          {text && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Xóa từ khóa"
              className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-subtle transition hover:bg-card hover:text-ink"
            >
              <X className="size-4" />
            </button>
          )}
        </form>

        <FilterDropdown
          label="Sắp xếp bài viết"
          options={SORT_OPTIONS}
          value={filters.sort}
          onSelect={(sort) => onChange({ sort })}
          active={Boolean(filters.sort)}
        />

        {categories.length > 0 && (
          <FilterDropdown
            label="Lọc theo danh mục"
            options={categoryOptions}
            value={filters.categoryId}
            onSelect={(categoryId) => onChange({ categoryId })}
            active={Boolean(filters.categoryId)}
            menuClassName="max-h-72"
          />
        )}
      </div>
    </section>
  );
}
