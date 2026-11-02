import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

/**
 * Hiển thị tên người dùng nếu tài khoản đang ACTIVE (lấy từ GET /users/batch).
 * Nếu tài khoản chưa active (hoặc bị khóa/không tìm thấy), tự động fallback hiển thị #{userId}.
 */
export default function UserDisplayName({ userId, userMap, className, fallback = "—" }) {
  const singleQuery = usePublicUsers(userMap ? [] : (userId != null ? [userId] : []));
  const resolvedMap = userMap ?? singleQuery.data;

  if (userId == null) return fallback;

  const numId = Number(userId);
  const user = resolvedMap?.get(numId) ?? resolvedMap?.get(String(userId));
  
  // Tài khoản active sẽ được backend trả về và có fullName
  const isUserActive = Boolean(user?.fullName?.trim());
  const displayText = isUserActive ? user.fullName : `#${userId}`;

  return (
    <span
      className={className}
      title={isUserActive ? `${user.fullName} (ID: #${userId})` : `Người dùng #${userId} (Chưa kích hoạt / Khóa)`}
    >
      {displayText}
    </span>
  );
}

export { UserDisplayName };
