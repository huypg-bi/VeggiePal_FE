import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import iconSearch from "@/assets/img/icon_video_page_2.png";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 300;

export default function VideoSearchBar({ keyword, onChange }) {
  const [text, setText] = useState(keyword);
  const timerRef = useRef(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const push = (value) => {
    clearTimeout(timerRef.current);
    onChange(value.trim());
  };

  const handleTextChange = (event) => {
    const value = event.target.value;
    setText(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(value.trim()), SEARCH_DEBOUNCE_MS);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    push(text);
  };

  const handleClear = () => {
    setText("");
    push("");
  };

  return (
    <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-sm">
      <img
        src={iconSearch}
        alt=""
        className="h-11 w-11 shrink-0 select-none rounded-full bg-white"
        draggable={false}
      />
      <form onSubmit={handleSubmit} role="search" className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          value={text}
          onChange={handleTextChange}
          placeholder="Tìm video theo tên món, ví dụ: nấm, đậu hũ, salad..."
          aria-label="Tìm video"
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
    </div>
  );
}
