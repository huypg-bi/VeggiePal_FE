import { useMemo, useState } from "react";
import { Eye, FilePlus2, History, Loader2, Pencil, RotateCcw, Rocket } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/features/admin/monitoring/utils/monitoringFormat";
import PromptConfirmDialog from "@/features/admin/prompts/components/PromptConfirmDialog";
import PromptEditorDialog from "@/features/admin/prompts/components/PromptEditorDialog";
import {
  useActivateVersion,
  useCreateDraft,
  usePromptActivations,
  usePromptVersions,
} from "@/features/admin/prompts/hooks/usePrompts";
import { STATUS_CLASS, STATUS_LABELS, versionLabel } from "@/features/admin/prompts/utils/promptFormat";
import { cn } from "@/lib/utils";
import UserDisplayName from "@/shared/components/UserDisplayName";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

const ACTIVATIONS_COLLAPSED = 5;

// Chi tiết một prompt: bản đang dùng, các phiên bản và lịch sử kích hoạt.
export default function PromptDetail({ prompt }) {
  const versionsQuery = usePromptVersions(prompt.key);
  const activationsQuery = usePromptActivations(prompt.key);
  const createMutation = useCreateDraft();
  const activateMutation = useActivateVersion();

  const [openVersion, setOpenVersion] = useState(null);
  const [activateTarget, setActivateTarget] = useState(null);
  const [showAllActivations, setShowAllActivations] = useState(false);

  const versions = useMemo(() => versionsQuery.data ?? [], [versionsQuery.data]);
  const activations = useMemo(() => activationsQuery.data ?? [], [activationsQuery.data]);
  const openEntry = openVersion == null ? null : versions.find((v) => v.version === openVersion);

  const userIds = useMemo(() => {
    const ids = new Set();
    versions.forEach((v) => {
      if (v.createdBy != null) ids.add(v.createdBy);
      if (v.publishedBy != null) ids.add(v.publishedBy);
    });
    activations.forEach((a) => a.activatedBy != null && ids.add(a.activatedBy));
    return Array.from(ids);
  }, [versions, activations]);
  const { data: userMap } = usePublicUsers(userIds);

  const handleCreateDraft = () =>
    createMutation.mutate(
      { key: prompt.key },
      {
        onSuccess: (created) => {
          toast.success(`Đã tạo bản nháp ${versionLabel(created.version)} từ bản đang dùng`);
          setOpenVersion(created.version);
        },
        onError: (error) => toast.error(error.message),
      },
    );

  const handleActivate = () =>
    activateMutation.mutate(
      { key: prompt.key, version: activateTarget },
      {
        onSuccess: () => {
          toast.success(activateTarget === 0 ? "Đã khôi phục prompt mặc định" : `Đã kích hoạt ${versionLabel(activateTarget)}`);
          setActivateTarget(null);
        },
        onError: (error) => toast.error(error.message),
      },
    );

  const visibleActivations = showAllActivations ? activations : activations.slice(0, ACTIVATIONS_COLLAPSED);

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-xl font-bold text-ink">{prompt.title}</h2>
              <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-brand-foreground">
                Đang dùng: {versionLabel(prompt.activeVersion)}
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-subtle">{prompt.key}</p>
            <p className="mt-2 text-xs text-subtle">
              {prompt.variables.length > 0 ? (
                <>
                  Biến bắt buộc:{" "}
                  {prompt.variables.map((name) => (
                    <code key={name} className="mr-1 rounded-md bg-surface px-1.5 py-0.5 font-mono text-[11px] text-ink">
                      {`{{${name}}}`}
                    </code>
                  ))}
                </>
              ) : (
                "Không có biến."
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {prompt.activeVersion !== 0 && (
              <Button type="button" variant="outline" size="sm" onClick={() => setActivateTarget(0)}>
                <RotateCcw className="size-4" />
                Khôi phục mặc định
              </Button>
            )}
            <Button type="button" size="sm" onClick={handleCreateDraft} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <FilePlus2 className="size-4" />}
              Tạo bản nháp mới
            </Button>
          </div>
        </div>

        <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-subtle">Nội dung đang chạy</h3>
        <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-surface p-3 font-mono text-xs leading-relaxed text-ink">
          {prompt.activeContent}
        </pre>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h3 className="text-sm font-bold text-ink">Các phiên bản</h3>
        {versionsQuery.isPending ? (
          <div aria-hidden className="mt-3 h-24 animate-pulse rounded-2xl bg-surface" />
        ) : versionsQuery.isError ? (
          <p role="alert" className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {versionsQuery.error.message}
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {versions.map((entry) => {
              const active = entry.version === prompt.activeVersion;
              const isDraft = entry.status === "DRAFT";
              return (
                <li
                  key={entry.version}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3",
                    active ? "border-brand/40 bg-brand-soft/40" : "border-border bg-surface",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-ink">{versionLabel(entry.version)}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", STATUS_CLASS[entry.status])}>
                        {STATUS_LABELS[entry.status] ?? entry.status}
                      </span>
                      {active && (
                        <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-brand-foreground">
                          Đang dùng
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-subtle">
                      {entry.status === "DEFAULT" ? (
                        "Prompt có sẵn trong code"
                      ) : (
                        <>
                          Tạo bởi <UserDisplayName userId={entry.createdBy} userMap={userMap} />
                          {entry.createdAt && ` · ${formatDateTime(entry.createdAt)}`}
                          {entry.publishedAt && ` · publish ${formatDateTime(entry.publishedAt)}`}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => setOpenVersion(entry.version)}>
                      {isDraft ? <Pencil className="size-3.5" /> : <Eye className="size-3.5" />}
                      {isDraft ? "Sửa" : "Xem"}
                    </Button>
                    {!active && !isDraft && (
                      <Button type="button" size="sm" onClick={() => setActivateTarget(entry.version)}>
                        <Rocket className="size-3.5" />
                        {entry.version === 0 ? "Khôi phục" : "Kích hoạt"}
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <History className="size-4 text-brand" />
          <h3 className="text-sm font-bold text-ink">Lịch sử kích hoạt</h3>
        </div>
        {activationsQuery.isPending ? (
          <div aria-hidden className="mt-3 h-16 animate-pulse rounded-2xl bg-surface" />
        ) : activationsQuery.isError ? (
          <p role="alert" className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {activationsQuery.error.message}
          </p>
        ) : activations.length === 0 ? (
          <p className="mt-3 text-sm text-subtle">Chưa có lần kích hoạt nào, đang dùng prompt mặc định.</p>
        ) : (
          <>
            <ul className="mt-3 flex flex-col divide-y divide-border text-sm">
              {visibleActivations.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                  <span className="text-ink">
                    <span className="font-semibold">{versionLabel(item.version)}</span> được kích hoạt bởi{" "}
                    <UserDisplayName userId={item.activatedBy} userMap={userMap} className="font-semibold" />
                  </span>
                  <span className="text-xs tabular-nums text-subtle">{formatDateTime(item.activatedAt)}</span>
                </li>
              ))}
            </ul>
            {activations.length > ACTIVATIONS_COLLAPSED && (
              <button
                type="button"
                onClick={() => setShowAllActivations((v) => !v)}
                className="mt-2 text-xs font-semibold text-subtle transition hover:text-ink"
              >
                {showAllActivations ? "Ẩn bớt" : `Hiện thêm (${activations.length - ACTIVATIONS_COLLAPSED} lần)`}
              </button>
            )}
          </>
        )}
      </section>

      {openEntry && (
        <PromptEditorDialog
          key={`${prompt.key}-${openEntry.version}`}
          prompt={prompt}
          entry={openEntry}
          isActive={openEntry.version === prompt.activeVersion}
          userMap={userMap}
          onClose={() => setOpenVersion(null)}
          onOpenVersion={setOpenVersion}
        />
      )}

      <PromptConfirmDialog
        open={activateTarget != null}
        title={activateTarget === 0 ? "Khôi phục prompt mặc định?" : `Kích hoạt ${versionLabel(activateTarget ?? 0)}?`}
        description="Thay đổi áp dụng ngay cho toàn bộ người dùng. Bạn có thể kích hoạt lại phiên bản khác bất cứ lúc nào."
        confirmLabel={activateTarget === 0 ? "Khôi phục" : "Kích hoạt"}
        loading={activateMutation.isPending}
        onConfirm={handleActivate}
        onClose={() => setActivateTarget(null)}
      />
    </div>
  );
}
