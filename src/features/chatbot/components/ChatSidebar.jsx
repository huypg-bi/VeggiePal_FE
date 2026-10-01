import {
  MessageSquare,
  Plus,
  PanelLeftClose,
  PanelLeft,
  Trash2,
} from "lucide-react";

import { formatRelativeTime } from "@/features/chatbot/utils/chatUtils";
import { cn } from "@/lib/utils";

export default function ChatSidebar({
  sessions,
  activeSessionId,
  collapsed,
  onToggleCollapsed,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}) {
  const handleDelete = (session) => {
    const confirmed = window.confirm(
      `Xoá "${session.title}"? Hành động này không thể hoàn tác.`
    );
    if (confirmed) onDeleteSession(session.id);
  };

  if (collapsed) {
    return (
      <div className="flex w-14 shrink-0 flex-col items-center gap-3 border-r border-border bg-surface/60 py-4">
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label="Mở rộng lịch sử trò chuyện"
          className="grid size-9 place-items-center rounded-full text-subtle transition hover:bg-surface hover:text-ink"
        >
          <PanelLeft className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          onClick={onNewChat}
          aria-label="Đoạn chat mới"
          className="grid size-9 place-items-center rounded-full bg-brand text-brand-foreground transition hover:opacity-90"
        >
          <Plus className="h-4.5 w-4.5" />
        </button>
      </div>
    );
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-surface/60">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="text-xs font-semibold tracking-wide text-subtle">
          LỊCH SỬ TRÒ CHUYỆN
        </h2>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label="Thu gọn lịch sử trò chuyện"
          className="grid size-7 place-items-center rounded-md text-subtle transition hover:bg-surface hover:text-ink"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 pt-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Đoạn chat mới
        </button>
      </div>

      <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {sessions.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-subtle">
            Chưa có đoạn chat nào.
          </p>
        )}
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          return (
            <div
              key={session.id}
              className={cn(
                "group relative flex items-center rounded-xl transition",
                isActive
                  ? "bg-brand-soft text-brand dark:bg-[#16301f]"
                  : "hover:bg-surface"
              )}
            >
              <button
                type="button"
                onClick={() => onSelectSession(session.id)}
                aria-current={isActive}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 py-2.5 pl-3 pr-8 text-left text-sm",
                  isActive ? "text-brand" : "text-body hover:text-ink"
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{session.title}</span>
                <span className="shrink-0 text-[11px] text-subtle group-hover:hidden">
                  {formatRelativeTime(session.updatedAt)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDelete(session)}
                aria-label={`Xoá "${session.title}"`}
                className="absolute right-1.5 hidden size-7 shrink-0 place-items-center rounded-full text-subtle transition hover:bg-destructive/10 hover:text-destructive group-hover:grid"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
