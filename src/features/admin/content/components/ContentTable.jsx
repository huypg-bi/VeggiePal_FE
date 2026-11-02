import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/variants/button-variants";
import { formatDate } from "@/features/payment/utils/paymentFormat";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import UserDisplayName from "@/shared/components/UserDisplayName";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

// Bảng nội dung đã đăng dùng chung cho bài viết / công thức / video: xem ở tab mới và xóa có xác nhận.
// columns: [{ key, label, align?, render(item) }] là các cột số liệu riêng của từng loại, nằm giữa tác giả và ngày đăng.
export default function ContentTable({
  items,
  columns,
  noun,
  deleteNote,
  getAuthorId,
  getViewPath,
  getPublishedAt,
  deleteMutation,
  page,
  totalPages,
  totalElements,
  onPageChange,
  isPending,
  isFetching,
  isError,
  error,
  emptyText,
}) {
  const [target, setTarget] = useState(null);
  const userIds = useMemo(() => items.map(getAuthorId).filter(Boolean), [items, getAuthorId]);
  const { data: userMap } = usePublicUsers(userIds);

  const handleDelete = () =>
    deleteMutation.mutate(target.id, {
      onSuccess: () => {
        setTarget(null);
        toast.success(`Đã xóa ${noun}`);
      },
      onError: (err) => toast.error(err.message),
    });

  if (isError) {
    return (
      <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error.message}</p>
    );
  }
  if (isPending) {
    return <div aria-hidden className="h-64 animate-pulse rounded-3xl border border-border bg-card" />;
  }
  if (items.length === 0) {
    return (
      <p className="rounded-3xl border border-border bg-card p-6 text-sm text-subtle">{emptyText}</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-subtle">
            <tr>
              <th className="px-4 py-3 font-semibold">Tiêu đề</th>
              <th className="px-3 py-3 font-semibold">Tác giả</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3 py-3 font-semibold ${col.align === "right" ? "text-right" : ""}`}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-3 py-3 font-semibold">Ngày đăng</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className="text-body">
                <td className="max-w-xs px-4 py-3 font-medium text-ink">
                  <span className="line-clamp-2">{item.title}</span>
                </td>
                <td className="px-3 py-3">
                  <UserDisplayName userId={getAuthorId(item)} userMap={userMap} />
                </td>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap px-3 py-3 tabular-nums ${col.align === "right" ? "text-right" : ""}`}
                  >
                    {col.render(item)}
                  </td>
                ))}
                <td className="whitespace-nowrap px-3 py-3 tabular-nums">{formatDate(getPublishedAt(item))}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={getViewPath(item)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Xem ${noun} “${item.title}”`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      <ExternalLink className="size-3.5" />
                      Xem
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      aria-label={`Xóa ${noun} “${item.title}”`}
                      className="text-destructive"
                      onClick={() => setTarget(item)}
                    >
                      <Trash2 className="size-3.5" />
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-subtle">
        <span>
          {totalElements.toLocaleString("vi-VN")} {noun} • Trang {page + 1}/{Math.max(totalPages, 1)}
          {isFetching && " • Đang cập nhật..."}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page <= 0 || isFetching}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" />
            Trước
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page + 1 >= totalPages || isFetching}
            onClick={() => onPageChange(page + 1)}
          >
            Sau
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title={`Xóa ${noun}?`}
        description={`“${target?.title ?? ""}” ${deleteNote}`}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
