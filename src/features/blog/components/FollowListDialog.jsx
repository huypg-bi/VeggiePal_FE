import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AuthorAvatar from "@/features/blog/components/AuthorAvatar";
import FollowButton from "@/features/blog/components/FollowButton";
import { useFollowList } from "@/features/blog/hooks/useFollow";
import { cn } from "@/lib/utils";

const TABS = [
  { kind: "following", label: "Đang theo dõi" },
  { kind: "followers", label: "Người theo dõi" },
];

/**
 * Danh sách đang theo dõi / người theo dõi của `userId` ("me" = chính tôi), mỗi dòng có nút theo dõi.
 * `title` là tên hiện trên tiêu đề (vd "Tác giả Huy"); bỏ trống thì dùng "Danh sách theo dõi của bạn".
 */
export default function FollowListDialog({ userId = "me", title, initialKind = "following", onClose }) {
  const [kind, setKind] = useState(initialKind);

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? "Danh sách theo dõi của bạn"}</DialogTitle>
          <DialogDescription>
            Chỉ hiện các tài khoản đang hoạt động. Bấm nút bên phải mỗi dòng để theo dõi hoặc bỏ theo dõi.
          </DialogDescription>
        </DialogHeader>

        <div role="tablist" className="flex items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.kind}
              type="button"
              role="tab"
              aria-selected={kind === tab.kind}
              onClick={() => setKind(tab.kind)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                kind === tab.kind ? "bg-brand text-brand-foreground" : "bg-surface text-subtle hover:text-ink"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* key để đổi tab thì dựng lại danh sách với query mới. */}
        <FollowList key={`${userId}-${kind}`} userId={userId} kind={kind} />
      </DialogContent>
    </Dialog>
  );
}

function FollowList({ userId, kind }) {
  const { users, total, isPending, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useFollowList({ userId, kind });

  if (isPending) {
    return (
      <p className="flex items-center gap-2 py-6 text-sm text-subtle">
        <Loader2 className="size-4 animate-spin" />
        Đang tải...
      </p>
    );
  }
  if (isError) {
    return <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error.message}</p>;
  }
  if (users.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-subtle">
        {kind === "following" ? "Chưa theo dõi ai." : "Chưa có ai theo dõi."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-subtle">{total.toLocaleString("vi-VN")} tài khoản</p>
      <ul className="flex max-h-80 flex-col gap-1.5 overflow-y-auto pr-1">
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-3 rounded-xl bg-surface px-3 py-2">
            <AuthorAvatar author={user} className="size-9 text-xs" />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{user.fullName}</span>
            <FollowButton userId={user.id} className="shrink-0" />
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-center"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage && <Loader2 className="size-4 animate-spin" />}
          Xem thêm
        </Button>
      )}
    </div>
  );
}
