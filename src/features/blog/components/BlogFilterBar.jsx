import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { useCategories } from "@/features/blog/hooks/useCategories";
import { SORT_OPTIONS, flattenCategories } from "@/features/blog/utils/feedFilters";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 400;

const pillClass = (active) =>
  cn(
    "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition",
    active ? "bg-brand-soft text-brand" : "text-subtle hover:bg-surface hover:text-ink"
  );

/**
 * Thanh tìm kiếm + sắp xếp + lọc danh mục của feed.
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

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <form onSubmit={handleSubmit} role="search" className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          value={text}
          onChange={handleTextChange}
          placeholder="Tìm bài viết theo tiêu đề hoặc nội dung..."
          aria-label="Tìm bài viết"
          className="h-11 w-full rounded-full border border-border bg-surface pl-10 pr-10 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 [&::-webkit-search-cancel-button]:hidden"
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

      <div className="no-scrollbar mt-3 flex items-center gap-1 overflow-x-auto">
        {SORT_OPTIONS.map(({ value, label }) => (
          <button
            key={label}
            type="button"
            onClick={() => onChange({ sort: value })}
            aria-pressed={filters.sort === value}
            className={pillClass(filters.sort === value)}
          >
            {label}
          </button>
        ))}
      </div>

      {categories.length > 0 && (
        <div className="no-scrollbar mt-2 flex items-center gap-2 overflow-x-auto border-t border-border pt-3">
          <button
            type="button"
            onClick={() => onChange({ categoryId: undefined })}
            aria-pressed={!filters.categoryId}
            className={pillClass(!filters.categoryId)}
          >
            Tất cả
          </button>
          {categories.map(({ id, name }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ categoryId: id })}
              aria-pressed={filters.categoryId === id}
              className={pillClass(filters.categoryId === id)}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
