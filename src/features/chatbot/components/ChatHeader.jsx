import { Sparkles, Plus, Globe } from "lucide-react";

export default function ChatHeader({ title, onNewChat }) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand dark:bg-[#16301f]">
          <Sparkles className="h-4.5 w-4.5" />
        </span>
        <h1 className="truncate text-base font-semibold text-ink">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onNewChat}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-ink transition hover:bg-surface"
        >
          <Plus className="h-4 w-4" />
          Mới
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-ink transition hover:bg-surface"
        >
          <Globe className="h-4 w-4" />
          Khám phá
        </button>
      </div>
    </header>
  );
}
