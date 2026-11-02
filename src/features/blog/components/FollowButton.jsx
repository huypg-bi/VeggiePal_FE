import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useRequireLogin } from "@/features/auth/hooks/useRequireLogin";
import { useFollowingIds, useSetFollow } from "@/features/blog/hooks/useFollow";

/**
 * Nút Theo dõi / Đang theo dõi một tác giả. Không hiện ở bài của chính mình.
 * Trạng thái lấy từ danh sách id đang theo dõi (một lần gọi cho cả feed); khách bấm thì dẫn tới đăng nhập.
 */
export default function FollowButton({ userId, className }) {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { isAuthenticated, requireLogin } = useRequireLogin();
  const { data: followingIds, isPending: isLoadingIds } = useFollowingIds();
  const { mutate, isPending } = useSetFollow();

  if (userId == null || userId === currentUserId) return null;

  const following = followingIds?.has(userId) ?? false;

  const handleClick = () => {
    if (!requireLogin()) return;
    mutate({ userId, follow: !following }, { onError: (error) => toast.error(error.message) });
  };

  return (
    <Button
      type="button"
      size="xs"
      variant={following ? "outline" : "soft"}
      className={className}
      // Chưa biết đã theo dõi hay chưa thì chưa cho bấm, tránh PUT nhầm lên người đã theo dõi.
      disabled={isPending || (isAuthenticated && isLoadingIds)}
      aria-pressed={following}
      onClick={handleClick}
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : following ? (
        <UserCheck />
      ) : (
        <UserPlus />
      )}
      {following ? "Đang theo dõi" : "Theo dõi"}
    </Button>
  );
}
