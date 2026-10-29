// Tiện ích định dạng thông tin và nhãn hiển thị cho quản lý người dùng admin.

export const USER_STATUS_LABELS = {
  ACTIVE: "Hoạt động",
  PENDING: "Chờ xác thực OTP",
  INACTIVE: "Ngừng hoạt động",
  BLOCKED: "Đã khóa",
};

export const USER_ROLE_LABELS = {
  USER: "Người dùng",
  ADMIN: "Quản trị viên",
};

export const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "Hoạt động" },
  { value: "PENDING", label: "Chờ xác thực OTP" },
  { value: "INACTIVE", label: "Ngừng hoạt động" },
  { value: "BLOCKED", label: "Đã khóa" },
];

export const ROLE_OPTIONS = [
  { value: "", label: "Tất cả vai trò" },
  { value: "USER", label: "Người dùng" },
  { value: "ADMIN", label: "Quản trị viên" },
];

export const STATUS_CONFIG = {
  ACTIVE: {
    label: "Hoạt động",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  PENDING: {
    label: "Chờ xác thực OTP",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  INACTIVE: {
    label: "Ngừng hoạt động",
    className: "border-border bg-surface text-subtle",
  },
  BLOCKED: {
    label: "Đã khóa",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
};

export const ROLE_CONFIG = {
  ADMIN: {
    label: "Quản trị viên",
    className: "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-400",
  },
  USER: {
    label: "Người dùng",
    className: "border-border bg-surface text-ink",
  },
};

// Định dạng thời gian chuẩn theo múi giờ địa phương Việt Nam.
export function formatDateTime(isoString) {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  } catch {
    return "—";
  }
}
