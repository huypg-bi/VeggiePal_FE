import { useState } from "react";
import { CheckCircle2, CircleAlert, Copy, FlaskConical, Loader2, Rocket, Save, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDateTime } from "@/features/admin/monitoring/utils/monitoringFormat";
import {
  useActivateVersion,
  useCreateDraft,
  usePreviewDraft,
  usePublishDraft,
  useUpdateDraft,
} from "@/features/admin/prompts/hooks/usePrompts";
import {
  findVariables,
  initialVariableValues,
  PROMPT_MAX_LENGTH,
  SAMPLE_INPUT_FIELDS,
  STATUS_CLASS,
  STATUS_LABELS,
  validatePromptContent,
  versionLabel,
} from "@/features/admin/prompts/utils/promptFormat";
import { cn } from "@/lib/utils";
import UserDisplayName from "@/shared/components/UserDisplayName";

const textareaClass =
  "w-full rounded-2xl border border-border bg-surface p-3 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 read-only:opacity-90";

// Soạn / xem một phiên bản prompt (bản nháp sửa và publish được, bản khác chỉ xem); cha đặt key theo phiên bản để dựng lại khi đổi bản.
export default function PromptEditorDialog({ prompt, entry, isActive, userMap, onClose, onOpenVersion }) {
  const isDraft = entry.status === "DRAFT";
  const [content, setContent] = useState(entry.content);
  const [confirm, setConfirm] = useState(null); // "publish" | "activate"
  const [sampleInput, setSampleInput] = useState(SAMPLE_INPUT_FIELDS[prompt.key]?.initial ?? "");
  const [variableValues, setVariableValues] = useState(() => initialVariableValues(prompt.variables));
  const [result, setResult] = useState(null);
  const [previewError, setPreviewError] = useState("");

  const updateMutation = useUpdateDraft();
  const publishMutation = usePublishDraft();
  const activateMutation = useActivateVersion();
  const createMutation = useCreateDraft();
  const previewMutation = usePreviewDraft();

  const sampleField = SAMPLE_INPUT_FIELDS[prompt.key];
  const requiredVariables = prompt.variables ?? [];
  const present = findVariables(content);
  const dirty = content !== entry.content;
  const problem = isDraft ? validatePromptContent(content, requiredVariables) : null;
  const busy = updateMutation.isPending || publishMutation.isPending || activateMutation.isPending || createMutation.isPending;
  const canPreview = isDraft && !dirty && !problem && (!sampleField || sampleInput.trim().length > 0);

  const fail = (error) => toast.error(error.message);

  const handleSave = () =>
    updateMutation.mutate(
      { key: prompt.key, version: entry.version, content },
      { onSuccess: () => toast.success("Đã lưu bản nháp"), onError: fail },
    );

  const handlePreview = () => {
    setResult(null);
    setPreviewError("");
    previewMutation.mutate(
      { key: prompt.key, version: entry.version, sampleInput: sampleField ? sampleInput : undefined, variables: variableValues },
      { onSuccess: setResult, onError: (error) => setPreviewError(error.message) },
    );
  };

  const handlePublish = () =>
    publishMutation.mutate(
      { key: prompt.key, version: entry.version },
      {
        onSuccess: () => {
          toast.success(`Đã publish ${versionLabel(entry.version)} và áp dụng ngay`);
          onClose();
        },
        onError: fail,
      },
    );

  const handleActivate = () =>
    activateMutation.mutate(
      { key: prompt.key, version: entry.version },
      {
        onSuccess: () => {
          toast.success(entry.version === 0 ? "Đã khôi phục prompt mặc định" : `Đã kích hoạt ${versionLabel(entry.version)}`);
          onClose();
        },
        onError: fail,
      },
    );

  const handleCreateFromThis = () =>
    createMutation.mutate(
      { key: prompt.key, content: entry.content },
      {
        onSuccess: (created) => {
          toast.success(`Đã tạo bản nháp ${versionLabel(created.version)} từ ${versionLabel(entry.version)}`);
          onOpenVersion(created.version);
        },
        onError: fail,
      },
    );

  return (
    <Dialog open onOpenChange={(open) => !open && !busy && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle>
              {prompt.title} · {versionLabel(entry.version)}
            </DialogTitle>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", STATUS_CLASS[entry.status])}>
              {STATUS_LABELS[entry.status] ?? entry.status}
            </span>
            {isActive && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-brand-foreground">
                Đang dùng
              </span>
            )}
          </div>
          <DialogDescription>
            {entry.status === "DEFAULT" ? (
              "Prompt có sẵn trong code, không sửa được. Tạo bản nháp từ đây để chỉnh sửa."
            ) : (
              <>
                Tạo bởi <UserDisplayName userId={entry.createdBy} userMap={userMap} className="font-semibold text-ink" />
                {entry.createdAt && ` lúc ${formatDateTime(entry.createdAt)}`}
                {entry.publishedAt && (
                  <>
                    . Publish bởi{" "}
                    <UserDisplayName userId={entry.publishedBy} userMap={userMap} className="font-semibold text-ink" />
                    {` lúc ${formatDateTime(entry.publishedAt)}`}
                  </>
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {requiredVariables.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-subtle">Biến bắt buộc (phải giữ đủ, không thêm biến lạ):</span>
            {requiredVariables.map((name) => (
              <code
                key={name}
                className={cn(
                  "rounded-md px-1.5 py-0.5 font-mono text-[11px]",
                  !isDraft || present.has(name) ? "bg-brand-soft text-brand" : "bg-destructive/10 text-destructive",
                )}
              >
                {`{{${name}}}`}
              </code>
            ))}
          </div>
        ) : (
          <p className="text-xs text-subtle">Prompt này không có biến, không được thêm {"{{...}}"} vào nội dung.</p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="prompt-content" className="text-xs font-semibold uppercase tracking-wider text-subtle">
            Nội dung prompt
          </label>
          <textarea
            id="prompt-content"
            rows={14}
            value={content}
            readOnly={!isDraft}
            onChange={(e) => setContent(e.target.value)}
            className={cn(textareaClass, "font-mono text-xs leading-relaxed")}
          />
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className={cn(problem ? "text-destructive" : "text-subtle")}>
              {isDraft ? (problem ?? (dirty ? "Có thay đổi chưa lưu" : "Nội dung hợp lệ")) : "Chỉ xem"}
            </span>
            <span className={cn("tabular-nums", content.length > PROMPT_MAX_LENGTH ? "font-semibold text-destructive" : "text-subtle")}>
              {content.length.toLocaleString("vi-VN")}/{PROMPT_MAX_LENGTH.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        {isDraft && (
          <section aria-label="Chạy thử" className="flex flex-col gap-3 rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2">
              <FlaskConical className="size-4 text-brand" />
              <h3 className="text-sm font-bold text-ink">Chạy thử bản nháp</h3>
            </div>
            <p className="text-xs leading-relaxed text-subtle">
              Gọi AI thật với dữ liệu mẫu bên dưới, không ảnh hưởng người dùng nhưng có tốn token nhà cung cấp. Chạy thử dùng nội dung
              đã lưu nên cần lưu nháp trước.
            </p>

            {sampleField && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prompt-sample" className="text-xs font-semibold text-ink">
                  {sampleField.label}
                </label>
                <textarea
                  id="prompt-sample"
                  rows={4}
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                  placeholder={sampleField.placeholder}
                  className={textareaClass}
                />
              </div>
            )}

            {Object.keys(variableValues).map((name) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label htmlFor={`prompt-var-${name}`} className="font-mono text-xs font-semibold text-ink">
                  {`{{${name}}}`}
                </label>
                <textarea
                  id={`prompt-var-${name}`}
                  rows={2}
                  value={variableValues[name]}
                  onChange={(e) => setVariableValues((prev) => ({ ...prev, [name]: e.target.value }))}
                  className={cn(textareaClass, "font-mono text-xs")}
                />
              </div>
            ))}

            <div>
              <Button type="button" size="sm" onClick={handlePreview} disabled={!canPreview || previewMutation.isPending}>
                {previewMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <FlaskConical className="size-4" />}
                Chạy thử
              </Button>
              {!canPreview && (
                <span className="ml-3 text-xs text-subtle">
                  {dirty ? "Lưu nháp trước khi chạy thử" : problem ? "Sửa lỗi nội dung trước" : "Nhập dữ liệu mẫu để chạy thử"}
                </span>
              )}
            </div>

            {previewError && (
              <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {previewError}
              </p>
            )}

            {result && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {prompt.key !== "CHAT_SYSTEM" && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold",
                        result.jsonShapeValid ? "bg-brand-soft text-brand" : "bg-destructive/10 text-destructive",
                      )}
                    >
                      {result.jsonShapeValid ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                      {result.jsonShapeValid ? "Đúng cấu trúc JSON cơ bản" : "Sai cấu trúc JSON"}
                    </span>
                  )}
                  <span className="text-subtle tabular-nums">
                    {result.promptTokens.toLocaleString("vi-VN")} token vào · {result.completionTokens.toLocaleString("vi-VN")} token ra
                  </span>
                </div>
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-surface p-3 font-mono text-xs text-ink">
                  {result.output}
                </pre>
                <p className="flex items-start gap-1.5 text-[11px] text-subtle">
                  <CircleAlert className="mt-0.5 size-3 shrink-0" />
                  Kiểm tra kỹ nội dung kết quả trước khi publish; BE chỉ kiểm tra cấu trúc cơ bản.
                </p>
              </div>
            )}
          </section>
        )}

        {confirm && (
          <div role="alert" className="flex flex-col gap-2 rounded-2xl border border-warning/30 bg-warning/10 p-3 text-sm text-ink">
            <p>
              {confirm === "publish"
                ? `Publish ${versionLabel(entry.version)} sẽ áp dụng ngay cho toàn bộ người dùng và không sửa lại được bản này. Bạn chắc chắn chứ?`
                : entry.version === 0
                  ? "Khôi phục prompt mặc định sẽ áp dụng ngay cho toàn bộ người dùng. Bạn chắc chắn chứ?"
                  : `Kích hoạt ${versionLabel(entry.version)} sẽ áp dụng ngay cho toàn bộ người dùng. Bạn chắc chắn chứ?`}
            </p>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setConfirm(null)}>
                Hủy
              </Button>
              <Button type="button" size="sm" disabled={busy} onClick={confirm === "publish" ? handlePublish : handleActivate}>
                {busy && <Loader2 className="size-4 animate-spin" />}
                Xác nhận
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
            Đóng
          </Button>
          {isDraft ? (
            <>
              <Button type="button" variant="outline" onClick={handleSave} disabled={busy || !dirty || Boolean(problem)}>
                {updateMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Lưu nháp
              </Button>
              <Button type="button" onClick={() => setConfirm("publish")} disabled={busy || dirty || Boolean(problem)}>
                <Rocket className="size-4" />
                Publish
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={handleCreateFromThis} disabled={busy}>
                {createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Copy className="size-4" />}
                Tạo nháp từ bản này
              </Button>
              {!isActive && (
                <Button type="button" onClick={() => setConfirm("activate")} disabled={busy}>
                  <Rocket className="size-4" />
                  {entry.version === 0 ? "Khôi phục mặc định" : "Kích hoạt"}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
