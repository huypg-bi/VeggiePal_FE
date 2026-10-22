import { Heart, Loader2, Sprout } from "lucide-react";

import {
  useHealthRecordHistory,
  useLatestHealthRecord,
} from "@/features/profile/hooks/useHealthRecords";
import EditHealthSummary from "@/features/profile/components/EditHealthSummary";
import EditHealthForm from "@/features/profile/components/EditHealthForm";
import EditHealthHistory from "@/features/profile/components/EditHealthHistory";
import { errorBoxClass } from "@/features/profile/utils/editProfileConstants";

/** Box "Chỉ số sức khỏe": tải dữ liệu rồi ghép summary + form + lịch sử. */
export default function EditHealthCard() {
  const latestQuery = useLatestHealthRecord();
  const historyQuery = useHealthRecordHistory({ size: 5 });

  const latest = latestQuery.data ?? null;
  const history = historyQuery.data ?? [];
  const loading = latestQuery.isPending || historyQuery.isPending;
  const loadError = latestQuery.error || historyQuery.error;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">
              Chỉ số sức khỏe
            </h3>
            <p className="text-[11px] text-subtle">
              Theo dõi chiều cao, cân nặng và thể trạng cơ thể chuẩn khoa học
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold text-brand border border-brand/30">
          <Sprout className="size-3" /> Cá nhân hóa
        </span>
      </div>

      {loading && (
        <div className="mb-3 flex items-center gap-2 text-xs text-subtle">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
          Đang tải chỉ số sức khỏe…
        </div>
      )}
      {loadError && (
        <p className={`mb-3 ${errorBoxClass}`}>
          {loadError.message || "Không tải được dữ liệu sức khỏe"}
        </p>
      )}

      <EditHealthSummary latest={latest} />
      <EditHealthForm latest={latest} />
      <EditHealthHistory history={history} />
    </div>
  );
}
