import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Dialog xác nhận quyết định duyệt (APPROVED) hoặc từ chối (REJECTED) case kiểm duyệt.
 * Yêu cầu/cho phép admin nhập lý do quyết định trước khi gửi request PUT /ai/admin/moderation/{id}.
 */
export default function ReviewDecisionDialog({
  item,
  decision, // "APPROVED" | "REJECTED"
  open,
  onOpenChange,
  loading = false,
  onConfirm,
}) {
  const [reason, setReason] = useState("");

  const isApprove = decision === "APPROVED";

  const handleConfirm = () => {
    onConfirm({
      id: item?.caseId,
      decision,
      reason: reason?.trim() || null,
    });
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      setReason("");
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span
              className={
                isApprove
                  ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"
                  : "flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
              }
            >
              {isApprove ? <Check className="size-4" /> : <X className="size-4" />}
            </span>
            <DialogTitle>
              {isApprove ? "Duyệt nội dung" : "Từ chối nội dung"} #{item?.caseId}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isApprove
              ? "Nội dung sẽ được đánh dấu đã phê duyệt và công khai trên hệ thống."
              : "Nội dung sẽ bị từ chối và gỡ bỏ/ẩn khỏi nền tảng theo chính sách kiểm duyệt."}
          </DialogDescription>
        </DialogHeader>

        {/* Thông tin tóm tắt của case */}
        {item && (
          <div className="rounded-2xl border border-border bg-surface p-3 text-xs text-subtle space-y-1">
            <div className="flex justify-between">
              <span>Loại nội dung:</span>
              <span className="font-semibold text-ink">{item.contentType || "Chưa xác định"}</span>
            </div>
            {item.externalContentId != null && (
              <div className="flex justify-between">
                <span>Mã nội dung gốc:</span>
                <span className="font-mono font-semibold text-ink">#{item.externalContentId}</span>
              </div>
            )}
            {item.reason && (
              <div className="pt-1 border-t border-border/60">
                <span className="block text-[11px] text-subtle">Lý do từ AI:</span>
                <p className="line-clamp-2 italic text-body">{item.reason}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 py-1">
          <label htmlFor="moderation-reason" className="text-xs font-semibold text-ink">
            Lý do quyết định {isApprove ? "(tùy chọn)" : "(khuyến khích)"}
          </label>
          <textarea
            id="moderation-reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              isApprove
                ? "Ghi chú thêm về lý do duyệt..."
                : "Nêu rõ lý do vi phạm (spam, ngôn từ kích động, v.v.)..."
            }
            maxLength={1000}
            className="w-full rounded-2xl border border-border bg-surface p-3 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
          <span className="text-right text-[11px] text-subtle">
            {reason.length}/1000 ký tự
          </span>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant={isApprove ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {isApprove ? "Xác nhận duyệt" : "Xác nhận từ chối"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
