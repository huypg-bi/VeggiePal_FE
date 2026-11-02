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
import StatusBadge from "@/features/my-content/components/StatusBadge";
import UserDisplayName from "@/shared/components/UserDisplayName";

const MAX_REASON = 1000;

// Hộp thoại duyệt (PUBLISHED) hoặc từ chối (REJECTED) một bài / video; BE bắt buộc có lý do và lưu lại ai quyết định.
// Mở lại cho mục khác thì cha đổi `key` để xóa lý do đã gõ.
export default function ContentStatusDialog({
  item,
  decision,
  noun,
  authorId,
  statusInfo,
  open,
  onOpenChange,
  loading = false,
  onConfirm,
}) {
  const [reason, setReason] = useState("");
  const isApprove = decision === "PUBLISHED";
  const trimmed = reason.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <DialogTitle>{isApprove ? `Duyệt ${noun}` : `Từ chối ${noun}`}</DialogTitle>
          </div>
          <DialogDescription>
            {isApprove
              ? `${noun[0].toUpperCase()}${noun.slice(1)} sẽ được đăng công khai và tác giả thấy đã được duyệt.`
              : `${noun[0].toUpperCase()}${noun.slice(1)} sẽ bị ẩn khỏi trang công khai, tác giả thấy lý do từ chối.`}
          </DialogDescription>
        </DialogHeader>

        {item && (
          <div className="space-y-1.5 rounded-2xl border border-border bg-surface p-3 text-xs text-subtle">
            <p className="line-clamp-2 text-sm font-semibold text-ink">{item.title}</p>
            <div className="flex items-center justify-between">
              <span>Tác giả:</span>
              <span className="font-semibold text-ink">
                <UserDisplayName userId={authorId} />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Trạng thái hiện tại:</span>
              <StatusBadge info={statusInfo} />
            </div>
            {item.description && (
              <p className="line-clamp-3 border-t border-border/60 pt-1.5 text-body">{item.description}</p>
            )}
            {item.moderationReason && (
              <p className="border-t border-border/60 pt-1.5 italic text-body">
                Lý do đã ghi: {item.moderationReason}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 py-1">
          <label htmlFor="content-status-reason" className="text-xs font-semibold text-ink">
            Lý do quyết định (bắt buộc)
          </label>
          <textarea
            id="content-status-reason"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={MAX_REASON}
            placeholder={isApprove ? "Vd: nội dung phù hợp, AI chặn nhầm..." : "Nêu rõ lý do vi phạm..."}
            className="w-full rounded-2xl border border-border bg-surface p-3 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
          <span className="text-right text-[11px] text-subtle">
            {reason.length}/{MAX_REASON} ký tự
          </span>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" disabled={loading} onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            type="button"
            variant={isApprove ? "default" : "destructive"}
            disabled={loading || trimmed.length === 0}
            onClick={() => onConfirm({ id: item.id, status: decision, reason: trimmed })}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {isApprove ? "Xác nhận duyệt" : "Xác nhận từ chối"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
