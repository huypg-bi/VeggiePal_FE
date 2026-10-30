import { Cpu, ShieldCheck } from "lucide-react";
import { useAiLimits, useAiModels } from "@/features/admin/monitoring/hooks/useMonitoring";
import {
  LIMIT_LABELS,
  MODEL_LABELS,
  formatNumber,
} from "@/features/admin/monitoring/utils/monitoringFormat";

// Model đang cấu hình và giới hạn sử dụng. Chỉ xem: BE đọc từ biến môi trường, không sửa được qua API.
export default function ModelsLimitsSection() {
  const models = useAiModels();
  const limits = useAiLimits();

  return (
    <section aria-label="Cấu hình AI" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <InfoCard
        icon={Cpu}
        title="Model đang dùng"
        query={models}
        rows={Object.entries(MODEL_LABELS).map(([key, label]) => [label, models.data?.[key] ?? "—"])}
        mono
      />
      <InfoCard
        icon={ShieldCheck}
        title="Giới hạn sử dụng"
        query={limits}
        rows={Object.entries(LIMIT_LABELS).map(([key, [label, unit]]) => [
          label,
          limits.data?.[key] == null ? "—" : `${formatNumber(limits.data[key])} ${unit}`,
        ])}
      />
    </section>
  );
}

function InfoCard({ icon: Icon, title, query, rows, mono }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="size-5 text-brand" />}
        <h2 className="font-heading text-lg font-bold text-ink">{title}</h2>
      </div>
      {query.isError ? (
        <p className="mt-4 rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">{query.error.message}</p>
      ) : query.isPending ? (
        <div aria-hidden className="mt-4 h-36 animate-pulse rounded-2xl bg-surface" />
      ) : (
        <dl className="mt-4 divide-y divide-border text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-subtle font-medium text-xs">{label}</dt>
              <dd
                className={
                  mono
                    ? "break-all text-right font-mono text-xs font-semibold text-ink"
                    : "text-right font-semibold tabular-nums text-xs text-ink"
                }
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      <p className="mt-3 text-[11px] text-subtle italic">Chỉ xem, được cấu hình trên máy chủ.</p>
    </div>
  );
}
