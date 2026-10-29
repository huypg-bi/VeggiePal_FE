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
    className: "border-emerald-200 bg-emerald-50/90 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  PENDING: {
    label: "Chờ xác thực OTP",
    className: "border-amber-200 bg-amber-50/90 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-400",
  },
  INACTIVE: {
    label: "Ngừng hoạt động",
    className: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400",
  },
  BLOCKED: {
    label: "Đã khóa",
    className: "border-rose-200 bg-rose-50/90 text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-400",
  },
};

export const ROLE_CONFIG = {
  ADMIN: {
    label: "Quản trị viên",
    className: "border-purple-200 bg-purple-50/90 text-purple-700 dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-300",
  },
  USER: {
    label: "Người dùng",
    className: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300",
  },
};

// Định dạng thời gian chuẩn theo múi giờ địa phương Việt Nam (HH:mm DD/MM/YYYY).
export function formatDateTime(isoString) {
  if (!isoString) return "—";
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch {
    return "—";
  }
}
