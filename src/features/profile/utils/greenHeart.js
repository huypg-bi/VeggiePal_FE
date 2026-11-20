// Huy hiệu hoàn thành thử thách 7 ngày (hiện thành trái tim cạnh tên người dùng).
export const GREEN_HEART_BADGE_TYPE = "ACHIEVEMENT";

// `badges` của GET /users/me là danh sách huy hiệu; bỏ huy hiệu đã bị thu hồi.
export function hasGreenHeartBadge(badges) {
  return (badges ?? []).some((b) => b?.type === GREEN_HEART_BADGE_TYPE && !b.revokedAt);
}

// `badgeTypes` là danh sách loại huy hiệu còn hiệu lực của người dùng công khai (task B18 ở BE).
export function hasGreenHeartType(badgeTypes) {
  return Array.isArray(badgeTypes) && badgeTypes.includes(GREEN_HEART_BADGE_TYPE);
}
