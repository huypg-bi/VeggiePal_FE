export const PENDING_ORDER_STORAGE_KEY = "veggiepal_pending_order_id";

/**
 * Định dạng số tiền VNĐ (vd: 29.000đ).
 */
export function formatVnd(amount) {
  if (amount == null) return "0đ";
  return `${Number(amount).toLocaleString("vi-VN")}đ`;
}

/**
 * Định dạng ngày giờ chuẩn Việt Nam (vd: 14:30 21/10/2026).
 */
export function formatDateTime(isoString) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "—";
  }
}

/**
 * Định dạng ngày (vd: 21/10/2026).
 */
export function formatDate(isoString) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
    }).format(d);
  } catch {
    return "—";
  }
}

/**
 * Thông tin trạng thái đơn hàng:
 * Nhãn tiếng Việt và màu sắc dịu nhẹ (đặc biệt PENDING là "Chưa thanh toán" không quá gay gắt).
 */
export function getPaymentStatusInfo(status) {
  switch (status) {
    case "PAID":
      return {
        label: "Đã thanh toán",
        variant: "success",
        className:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      };
    case "PENDING":
      return {
        label: "Chưa thanh toán",
        variant: "pending",
        className:
          "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
      };
    case "FAILED":
      return {
        label: "Thất bại",
        variant: "failed",
        className:
          "border-destructive/30 bg-destructive/10 text-destructive",
      };
    default:
      return {
        label: status || "Không rõ",
        variant: "unknown",
        className: "border-border bg-surface text-subtle",
      };
  }
}

/**
 * Tên và badge hiển thị của các gói.
 */
export const PLAN_DETAILS = {
  FREE: {
    name: "Gói Khám Phá",
    code: "FREE",
    badgeLabel: "Miễn phí",
    popular: false,
    gradient: "from-slate-500 to-slate-700",
  },
  PLUS: {
    name: "Gói Plus",
    code: "PLUS",
    badgeLabel: "Phổ biến nhất",
    popular: true,
    gradient: "from-brand to-brand-2",
  },
  PRO: {
    name: "Gói Pro Chuyên Sâu",
    code: "PRO",
    badgeLabel: "Toàn năng",
    popular: false,
    gradient: "from-amber-500 to-orange-600",
  },
};
