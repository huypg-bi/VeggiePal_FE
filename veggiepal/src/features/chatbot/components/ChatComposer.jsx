import { ArrowUp } from "lucide-react";

export default function ChatComposer({ value, onChange, onSend, disabled }) {
  const canSend = value.trim().length > 0 && !disabled;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  return (
    <div className="border-t border-border px-6 py-4">
      <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-3xl border border-border bg-surface px-4 py-2.5">
        <textarea
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hỏi về món chay, dinh dưỡng, thực đơn..."
          className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-sm text-ink outline-none placeholder:text-subtle"
        />
        <button
          type="button"
          onClick={() => canSend && onSend()}
          disabled={!canSend}
          aria-label="Gửi"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground transition hover:opacity-90 disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-auto mt-2 flex w-full max-w-3xl items-center justify-between text-xs text-subtle">
        <span>
          Nhấn <kbd className="rounded border border-border px-1">Enter</kbd> để gửi
        </span>
        <span>
          <kbd className="rounded border border-border px-1">Shift + Enter</kbd> xuống dòng
        </span>
      </div>
    </div>
  );
}
