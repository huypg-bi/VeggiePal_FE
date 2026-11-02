import { useSearchParams } from "react-router-dom";

import PromptDetail from "@/features/admin/prompts/components/PromptDetail";
import { usePrompts } from "@/features/admin/prompts/hooks/usePrompts";
import { versionLabel } from "@/features/admin/prompts/utils/promptFormat";
import { cn } from "@/lib/utils";

// Quản lý prompt AI (ai-service /ai/admin/prompts): soạn nháp, chạy thử, publish, kích hoạt lại và khôi phục mặc định.
export default function AdminPromptsScreen() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: prompts = [], isPending, isError, error } = usePrompts();

  const selected = prompts.find((p) => p.key === searchParams.get("key")) ?? prompts[0] ?? null;

  const handleSelect = (key) => setSearchParams({ key }, { replace: true });

  return (
    <div className="flex flex-col gap-6">


      {isError ? (
        <p role="alert" className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          {error.message}
        </p>
      ) : isPending ? (
        <div aria-hidden className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <div className="h-96 animate-pulse rounded-3xl border border-border bg-card" />
          <div className="h-96 animate-pulse rounded-3xl border border-border bg-card" />
        </div>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[300px_1fr]">
          <nav aria-label="Danh sách prompt" className="flex flex-col gap-2 lg:sticky lg:top-24">
            {prompts.map((prompt) => {
              const active = prompt.key === selected?.key;
              return (
                <button
                  key={prompt.key}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => handleSelect(prompt.key)}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-left transition",
                    active ? "border-brand/40 bg-brand-soft" : "border-border bg-card hover:bg-surface",
                  )}
                >
                  <span className="min-w-0">
                    <span className={cn("block truncate text-sm font-semibold", active ? "text-brand" : "text-ink")}>
                      {prompt.title}
                    </span>
                    <span className="block truncate font-mono text-[10px] text-subtle">{prompt.key}</span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
                      prompt.activeVersion === 0 ? "bg-surface text-subtle" : "bg-brand text-brand-foreground",
                    )}
                  >
                    {versionLabel(prompt.activeVersion)}
                  </span>
                </button>
              );
            })}
          </nav>

          {selected && <PromptDetail key={selected.key} prompt={selected} />}
        </div>
      )}
    </div>
  );
}
