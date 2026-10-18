import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  Info,
  MessageSquare,
  Percent,
  ShieldAlert,
  Video,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

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

/**
 * Modal hiển thị toàn bộ thông tin chi tiết của một case kiểm duyệt.
 * Cung cấp thông tin cảnh báo AI, mã case, id nội dung gốc và hướng dẫn xử lý.
 */
export default function ModerationDetailDialog({
  item,
  open,
  onOpenChange,
  onApprove,
  onReject,
}) {
  if (!item) return null;

  const typeMeta = CONTENT_TYPE_MAP[item.contentType] || {
    label: item.contentType || "Chưa phân loại (Chờ BE bổ sung)",
    icon: ShieldAlert,
    className: "bg-surface text-subtle",
  };
  const Icon = typeMeta.icon;

  const hasExternalId = item.externalContentId != null;
  const isBlog = item.contentType === "BLOG";

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
            Xem xét các tiêu chí AI gắn cờ và quyết định phê duyệt hoặc từ chối nội dung.
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
              <p className="mt-1 font-mono text-sm font-semibold text-ink">
                {hasExternalId ? `#${item.externalContentId}` : "Chưa có (BE chưa trả trường externalContentId)"}
              </p>
            </div>

            <div>
              <span className="text-xs text-subtle">Độ tin cậy AI:</span>
              <div className="mt-1 flex items-center gap-1 font-mono font-medium text-ink">
                <Percent className="size-3.5 text-subtle" />
                {formatConfidence(item.confidence)}
              </div>
            </div>

            <div>
              <span className="text-xs text-subtle">Thời gian phát hiện:</span>
              <p className="mt-1 text-xs text-subtle">
                {formatDateTime(item.createdAt)}
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
                <span className="text-xs text-subtle">Không có danh mục cụ thể</span>
              )}
            </div>
          </div>

          {/* Trích dẫn nội dung kiểm duyệt nếu có (từ mock data hoặc khi BE cung cấp) */}
          {(item.contentTitle || item.contentSnippet) && (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink">Nội dung văn bản bị gắn cờ:</span>
                {item.authorName && (
                  <span className="text-[11px] text-subtle">
                    Tác giả: <strong className="text-ink">{item.authorName}</strong>
                  </span>
                )}
              </div>
              <div className="mt-1.5 rounded-2xl border border-destructive/20 bg-destructive/5 p-3 text-xs leading-relaxed text-body">
                {item.contentTitle && (
                  <p className="font-semibold text-ink mb-1">{item.contentTitle}</p>
                )}
                {item.contentSnippet && (
                  <p className="italic text-subtle">"{item.contentSnippet}"</p>
                )}
              </div>
            </div>
          )}

          {/* Lý do từ AI */}
          <div>
            <span className="text-xs font-semibold text-ink">Lý do từ AI Moderation:</span>
            <div className="mt-1.5 rounded-2xl border border-border bg-card p-3 text-xs leading-relaxed text-body">
              {item.reason || "Cần quản trị viên kiểm tra thủ công nội dung này."}
            </div>
          </div>

          {/* Cảnh báo & Lưu ý về nội dung gốc */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-amber-500/10 p-3.5 text-xs text-amber-700 dark:text-amber-400">
            <Info className="mt-0.5 size-4 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">Lưu ý về xem trước nội dung gốc:</p>
              <p className="leading-relaxed text-amber-800/90 dark:text-amber-300/90">
                AI Service chỉ lưu và trả về kết quả phân tích kiểm duyệt. Các nội dung đang ở trạng thái
                Chờ duyệt (PENDING) trên hệ thống hiện chưa được cấp phép truy cập công khai qua API người dùng.
              </p>
              {hasExternalId && isBlog && (
                <div className="pt-1.5">
                  <a
                    href={`/blog/${item.externalContentId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold underline hover:opacity-80"
                  >
                    Thử mở bài viết #{item.externalContentId} trong tab mới
                    <ExternalLink className="size-3" />
                  </a>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
                    (Nếu bài viết chưa được duyệt, trang có thể báo 404 không tìm thấy)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onReject(item);
            }}
            className="gap-1"
          >
            <X className="size-3.5" />
            Từ chối
          </Button>

          <Button
            type="button"
            variant="default"
            onClick={() => {
              onOpenChange(false);
              onApprove(item);
            }}
            className="gap-1"
          >
            <Check className="size-3.5" />
            Duyệt nội dung
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
