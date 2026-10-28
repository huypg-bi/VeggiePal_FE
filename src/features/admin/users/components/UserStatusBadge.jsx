import { STATUS_CONFIG } from "../utils/adminUserFormat";
import { cn } from "@/lib/utils";

// Nhãn hiển thị trạng thái người dùng với màu sắc nhận diện tương ứng.
export default function UserStatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status] || {
    label: status || "Không rõ",
    className: "border-border bg-surface text-subtle",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
