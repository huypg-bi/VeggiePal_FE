import { PanelLeft, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ChatHeader({
  title,
  onNewChat,
  onToggleSidebar,
  showSidebarToggle = false,
}) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex min-w-0 items-center gap-2.5">
        {showSidebarToggle && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onToggleSidebar}
            aria-label="Mở lịch sử trò chuyện"
            className="shrink-0 text-subtle hover:text-ink"
          >
            <PanelLeft className="size-4" />
          </Button>
        )}
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
          <Sparkles className="size-4" />
        </span>
        <h1 className="truncate text-sm font-semibold text-ink sm:text-base">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onNewChat}>
          <Plus className="size-4" />
          <span className="hidden sm:inline">Đoạn chat mới</span>
          <span className="sm:hidden">Mới</span>
        </Button>
      </div>
    </header>
  );
}
