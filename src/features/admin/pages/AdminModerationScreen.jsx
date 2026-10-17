import { useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Percent,
  RefreshCw,
  ShieldAlert,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import ReviewDecisionDialog from "@/features/admin/moderation/components/ReviewDecisionDialog";
import {
  usePendingModerationCases,
  useReviewModeration,
} from "@/features/admin/moderation/hooks/useModeration";
import { moderationKeys } from "@/features/admin/moderation/queryKeys";
import { cn } from "@/lib/utils";

// Nhãn và badge tương ứng cho loại nội dung (BLOG, VIDEO, COMMENT)
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
      dateStyle: "short",
      timeStyle: "short",
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Trang kiểm duyệt nội dung của Admin (/admin/moderation):
 * - Hàng đợi các case cần duyệt (REVIEW_REQUIRED, cũ nhất trước).
 * - Hiển thị: caseId, loại nội dung (BLOG, VIDEO, COMMENT), categories, reason, confidence.
 * - Nút Duyệt và Từ chối kèm lý do, tự động làm mới danh sách sau khi quyết định.
 */
export default function AdminModerationScreen() {
  const queryClient = useQueryClient();
  const { data: cases = [], isPending, isError, error, isFetching } = usePendingModerationCases();
  const reviewMutation = useReviewModeration();

  const [activeModal, setActiveModal] = useState({
    item: null,
    decision: null, // "APPROVED" | "REJECTED"
  });

  const handleReviewConfirm = ({ id, decision, reason }) => {
    reviewMutation.mutate(
      { id, decision, reason },
      {
        onSuccess: () => {
          toast.success(
            decision === "APPROVED"
              ? `Đã duyệt thành công case #${id}`
              : `Đã từ chối thành công case #${id}`
          );
          setActiveModal({ item: null, decision: null });
        },
        onError: (err) => {
          toast.error(err.message || "Có lỗi xảy ra khi cập nhật quyết định");
        },
      }
    );
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: moderationKeys.all });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold text-ink">Kiểm duyệt nội dung</h1>
            {cases.length > 0 && (
              <span className="flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-semibold text-warning">
                {cases.length} chờ duyệt
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-subtle">
            Hàng đợi các nội dung nghi ngờ vi phạm hoặc cần con người kiểm duyệt (từ AI Moderation).
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isFetching}
          onClick={handleRefresh}
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
          Làm mới
        </Button>
      </div>

      {/* Trạng thái lỗi */}
      {isError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertTriangle className="size-5 shrink-0" />
          <p>{error?.message || "Không thể tải danh sách kiểm duyệt. Vui lòng thử lại sau."}</p>
        </div>
      )}

      {/* Trạng thái đang tải */}
      {isPending ? (
        <div aria-hidden className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl border border-border bg-card" />
          ))}
        </div>
      ) : cases.length === 0 ? (
        /* Trạng thái rỗng */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
            <CheckCircle2 className="size-6" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-bold text-ink">Hàng đợi đang trống</h3>
          <p className="mt-1 max-w-md text-sm text-subtle">
            Tuyệt vời! Hiện tại không có nội dung nào cần kiểm duyệt thủ công. Các bài viết, video và bình luận đều đã được AI xử lý hoặc duyệt.
          </p>
        </div>
      ) : (
        /* Bảng danh sách hàng đợi */
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface text-xs font-semibold text-subtle">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Mã Case</th>
                  <th scope="col" className="px-5 py-3.5">Loại nội dung</th>
                  <th scope="col" className="px-5 py-3.5">Danh mục vi phạm</th>
                  <th scope="col" className="px-5 py-3.5">Lý do từ AI</th>
                  <th scope="col" className="px-5 py-3.5 text-center">Độ tin cậy</th>
                  <th scope="col" className="px-5 py-3.5">Thời gian gửi</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cases.map((c) => {
                  const typeMeta = CONTENT_TYPE_MAP[c.contentType] || {
                    label: c.contentType || "Nội dung",
                    icon: ShieldAlert,
                    className: "bg-surface text-subtle",
                  };
                  const Icon = typeMeta.icon;

                  return (
                    <tr key={c.caseId} className="transition hover:bg-surface/50">
                      {/* Case ID */}
                      <td className="px-5 py-4 font-mono font-semibold text-ink">
                        #{c.caseId}
                      </td>

                      {/* Loại nội dung */}
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            typeMeta.className
                          )}
                        >
                          <Icon className="size-3.5" />
                          {typeMeta.label}
                        </span>
                      </td>

                      {/* Categories */}
                      <td className="px-5 py-4">
                        {c.categories && c.categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {c.categories.map((cat) => (
                              <span
                                key={cat}
                                className="inline-block rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-subtle">Không có</span>
                        )}
                      </td>

                      {/* Reason */}
                      <td className="max-w-xs px-5 py-4">
                        <p className="line-clamp-2 text-xs text-body" title={c.reason}>
                          {c.reason || "Cần quản trị viên kiểm tra và đưa ra quyết định."}
                        </p>
                      </td>

                      {/* Confidence */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-0.5 font-mono text-xs font-medium text-ink">
                          <Percent className="size-3 text-subtle" />
                          {formatConfidence(c.confidence)}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-subtle">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5 text-subtle" />
                          {formatDateTime(c.createdAt)}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="default"
                            onClick={() =>
                              setActiveModal({
                                item: c,
                                decision: "APPROVED",
                              })
                            }
                            className="h-8 gap-1 rounded-xl px-3"
                          >
                            <Check className="size-3.5" />
                            Duyệt
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              setActiveModal({
                                item: c,
                                decision: "REJECTED",
                              })
                            }
                            className="h-8 gap-1 rounded-xl px-3"
                          >
                            <X className="size-3.5" />
                            Từ chối
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialog xác nhận duyệt / từ chối */}
      <ReviewDecisionDialog
        open={Boolean(activeModal.item && activeModal.decision)}
        item={activeModal.item}
        decision={activeModal.decision}
        loading={reviewMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setActiveModal({ item: null, decision: null });
        }}
        onConfirm={handleReviewConfirm}
      />
    </div>
  );
}
