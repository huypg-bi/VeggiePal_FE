import {
  Ban,
  Bot,
  Check,
  ExternalLink,
  FileText,
  MessageSquare,
  Percent,
  Shield,
  ShieldAlert,
  Video,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import UserDisplayName from "@/shared/components/UserDisplayName";

const CONTENT_TYPE_MAP = {
  BLOG: { label: "Bài viết", icon: FileText, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  VIDEO: { label: "Video", icon: Video, className: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  COMMENT: { label: "Bình luận", icon: MessageSquare, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
};

function formatConfidence(confidence) {
  if (confidence == null) return "—";
  const num = typeof confidence === "number" ? confidence : parseFloat(confidence);
  if (Number.isNaN(num)) return "—";
  return `${(num * 100).toFixed(1)}%`;
}

function formatDateTime(isoString) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "full",
      timeStyle: "medium",
    }).format(d);
  } catch {
    return isoString;
  }
}

export default function ModerationDetailDialog({
  item,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onDismiss,
}) {
  if (!item) return null;

  const typeMeta = CONTENT_TYPE_MAP[item.contentType] || {
    label: item.contentType || "Chưa phân loại",
    icon: ShieldAlert,
    className: "bg-surface text-subtle",
  };
  const Icon = typeMeta.icon;

  const hasExternalId = item.externalContentId != null;
  const isBlog = item.contentType === "BLOG";
  const isHandled = Boolean(item.decision && item.decision !== "REVIEW_REQUIRED");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
              <ShieldAlert className="size-4" />
            </span>
            <DialogTitle>Chi tiết kiểm duyệt #{item.caseId}</DialogTitle>
          </div>
          <DialogDescription>
            {isHandled
              ? "Xem chi tiết nội dung và kết quả xử lý kiểm duyệt đã thực hiện."
              : "Xem xét nội dung vi phạm thực tế và quyết định phê duyệt hoặc từ chối nội dung."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2 text-sm">
          {/* Thông tin thuộc tính */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-surface p-3.5">
            <div>
              <span className="text-xs text-subtle">Loại nội dung:</span>
              <div className="mt-1 flex items-center gap-1.5 font-medium text-ink">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    typeMeta.className
                  )}
                >
                  <Icon className="size-3" />
                  {typeMeta.label}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-subtle">Mã ID nội dung gốc:</span>
              <div className="mt-1 flex items-center gap-1.5">
                {hasExternalId ? (
                  isBlog ? (
                    <a
                      href={`/blog/${item.externalContentId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-sm font-semibold text-ink underline hover:text-brand"
                      title="Mở bài viết trong tab mới (Admin có quyền xem bài chưa đăng)"
                    >
                      #{item.externalContentId}
                      <ExternalLink className="size-3 text-subtle" />
                    </a>
                  ) : (
                    <span className="font-mono text-sm font-semibold text-ink">#{item.externalContentId}</span>
                  )
                ) : (
                  <span className="text-subtle">—</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs text-subtle">Tác giả:</span>
              <p className="mt-1 text-sm font-semibold text-ink">
                {item.authorId != null ? <UserDisplayName userId={item.authorId} /> : "—"}
              </p>
            </div>

            <div>
              <span className="text-xs text-subtle">Độ tin cậy AI:</span>
              <div className="mt-1 flex items-center gap-1 font-mono font-medium text-ink">
                <Percent className="size-3.5 text-subtle" />
                {formatConfidence(item.confidence)}
              </div>
            </div>

            {isHandled && (
              <>
                <div>
                  <span className="text-xs text-subtle">Quyết định:</span>
                  <p className="mt-1 text-sm font-bold text-ink">
                    {item.decision}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-subtle">Người duyệt:</span>
                  <p className="mt-1 text-sm font-semibold text-ink flex items-center gap-1">
                    {item.reviewedBy != null ? (
                      <>
                        <Shield className="size-3 text-blue-600" />
                        <UserDisplayName userId={item.reviewedBy} />
                      </>
                    ) : (
                      <>
                        <Bot className="size-3 text-purple-600" />
                        Hệ thống AI
                      </>
                    )}
                  </p>
                </div>
              </>
            )}

            <div className="col-span-2">
              <span className="text-xs text-subtle">
                {item.reviewedAt ? "Thời gian quyết định:" : "Thời gian phát hiện:"}
              </span>
              <p className="mt-1 text-xs text-subtle">
                {formatDateTime(item.reviewedAt || item.createdAt)}
              </p>
            </div>
          </div>

          {/* Danh mục vi phạm */}
          <div>
            <span className="text-xs font-semibold text-ink">Danh mục vi phạm nhận diện:</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {item.categories && item.categories.length > 0 ? (
                item.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-block rounded-md bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive"
                  >
                    {cat}
                  </span>
                ))
              ) : (
                <span className="text-xs text-subtle italic">Không có danh mục nào bị gắn cờ</span>
              )}
            </div>
          </div>

          {/* Lý do từ AI hoặc người duyệt */}
          {item.reason && (
            <div>
              <span className="text-xs font-semibold text-ink">
                {item.reviewedBy ? "Lý do quyết định:" : "Lý do từ AI:"}
              </span>
              <p className="mt-1 rounded-xl border border-border bg-surface p-3 text-xs leading-relaxed text-body">
                {item.reason}
              </p>
            </div>
          )}

          {/* Nội dung bị gắn cờ */}
          <div>
            <span className="text-xs font-semibold text-ink">Nội dung bị gắn cờ:</span>
            <div className="mt-1.5 max-h-48 overflow-y-auto rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs italic text-body">
              {item.content || <span className="text-subtle not-italic">Không có nội dung văn bản</span>}
            </div>
          </div>

          {/* Liên kết mở nội dung gốc */}
          {hasExternalId && isBlog && (
            <div className="flex justify-end pt-1">
              <a
                href={`/blog/${item.externalContentId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
              >
                <span>Mở bài viết</span>
                <ExternalLink className="size-3.5 text-subtle" />
              </a>
            </div>
          )}
        </div>

        {!isHandled && (
          <p className="text-[11px] leading-relaxed text-subtle">
            <strong className="text-ink">Bỏ qua</strong>: chỉ đưa ca ra khỏi hàng đợi, nội dung gốc không bị đổi trạng thái
            (khác với <strong className="text-ink">Từ chối</strong>).
          </p>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>

          {!isHandled && onDismiss && (
            <Button
              type="button"
              variant="outline"
              title="Chỉ đưa ca ra khỏi hàng đợi, nội dung gốc không bị đổi trạng thái"
              onClick={() => {
                onOpenChange(false);
                onDismiss(item);
              }}
              className="gap-1 cursor-pointer"
            >
              <Ban className="size-3.5" />
              Bỏ qua
            </Button>
          )}

          {!isHandled && onReject && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onOpenChange(false);
                onReject(item);
              }}
              className="gap-1 cursor-pointer"
            >
              <X className="size-3.5" />
              Từ chối
            </Button>
          )}

          {!isHandled && onApprove && (
            <Button
              type="button"
              variant="default"
              onClick={() => {
                onOpenChange(false);
                onApprove(item);
              }}
              className="gap-1 cursor-pointer"
            >
              <Check className="size-3.5" />
              Duyệt nội dung
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
