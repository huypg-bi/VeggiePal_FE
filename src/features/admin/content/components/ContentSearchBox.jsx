import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 400;

// Ô tìm trong bảng nội dung: chờ gõ xong rồi mới đẩy từ khóa lên cho trang cha.
export default function ContentSearchBox({ placeholder, ariaLabel, onChange }) {
  const [text, setText] = useState("");
  const timerRef = useRef(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const push = (value) => {
    clearTimeout(timerRef.current);
    onChange(value.trim());
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setText(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(value.trim()), DEBOUNCE_MS);
  };

  const handleClear = () => {
    setText("");
    push("");
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        push(text);
      }}
      className="relative min-w-56 max-w-md flex-1"
    >
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
      <input
        type="search"
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "h-10 w-full rounded-full border border-border bg-surface pl-10 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 [&::-webkit-search-cancel-button]:hidden",
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
  );
}
