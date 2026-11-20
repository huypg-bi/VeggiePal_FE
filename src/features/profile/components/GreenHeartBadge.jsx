import { Heart } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/authStore";
import { CHALLENGE_BADGE_NAME } from "@/features/blog/utils/challenge";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { hasGreenHeartBadge, hasGreenHeartType } from "@/features/profile/utils/greenHeart";
import { cn } from "@/lib/utils";

// Trái tim cạnh tên (kiểu tick xanh): của mình đọc từ cache hồ sơ, của người khác đọc `badgeTypes` của user công khai.
export default function GreenHeartBadge({ userId, user, className }) {
  const myId = useAuthStore((s) => s.user?.id);
  // enabled=false: chỉ đọc cache hồ sơ (AppHeader đã tải), không gọi thêm API và khách không bị gọi /users/me.
  const { profile } = useProfile({ enabled: false });

  const isMe = userId != null && myId != null && Number(userId) === Number(myId);
  const show = (isMe && hasGreenHeartBadge(profile?.badges)) || hasGreenHeartType(user?.badgeTypes);
  if (!show) return null;

  return (
    <span
      role="img"
      aria-label={CHALLENGE_BADGE_NAME}
      title={CHALLENGE_BADGE_NAME}
      className="inline-flex shrink-0 self-center text-chart-4"
    >
      <Heart className={cn("size-4 fill-current", className)} />
    </span>
  );
}
