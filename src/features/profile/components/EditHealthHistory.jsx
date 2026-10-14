import { Clock } from "lucide-react";

import { formatDt } from "@/features/profile/utils/editProfileHelpers";

/** Lịch sử ghi nhận gần đây; chỉ báo "chưa có bản ghi" khi danh sách rỗng. */
export default function EditHealthHistory({ history }) {
  return (
    <div className="text-[11px] text-subtle pt-2 border-t border-border">
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        <span>
          {history.length === 0 ? "Lịch sử gần đây: Chưa có bản ghi nào." : "Lịch sử gần đây:"}
        </span>
      </div>
      {history.length > 0 && (
        <ul className="mt-2 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {history.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 bg-surface/50 px-3.5 py-2.5 text-xs"
            >
              <span className="text-subtle">{formatDt(r.recordedAt)}</span>
              <span className="font-medium text-ink">
                {r.heightCm} cm · {r.weightKg} kg · BMI{" "}
                {r.bmi != null ? Number(r.bmi).toFixed(1) : "—"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
