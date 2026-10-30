import { useState } from "react";
import { Activity, RefreshCw } from "lucide-react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import ModelsLimitsSection from "@/features/admin/monitoring/components/ModelsLimitsSection";
import UsageLogsSection from "@/features/admin/monitoring/components/UsageLogsSection";
import UsageSummarySection from "@/features/admin/monitoring/components/UsageSummarySection";
import { monitoringKeys } from "@/features/admin/monitoring/queryKeys";
import { DAY_OPTIONS } from "@/features/admin/monitoring/utils/monitoringFormat";
import { cn } from "@/lib/utils";

export default function AdminAiMonitoringScreen() {
  const [days, setDays] = useState(7);
  const [includeModeration, setIncludeModeration] = useState(false);
  const queryClient = useQueryClient();
  const fetching = useIsFetching({ queryKey: monitoringKeys.all }) > 0;

  const excludeFeature = includeModeration ? null : "MODERATION";

  return (
    <div className="flex flex-col gap-8">
      {/* Tiêu đề & giới thiệu chức năng */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <Activity className="size-6 text-brand" />
            <h1 className="font-heading text-3xl font-bold text-ink">Giám sát AI</h1>
          </div>
          <p className="mt-1 text-sm text-subtle">
            Theo dõi lượt dùng, token, độ trễ và lỗi của các tính năng AI (chatbot, thực đơn, kiểm duyệt, gợi ý, video).
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={fetching}
          onClick={() => queryClient.invalidateQueries({ queryKey: monitoringKeys.all })}
          className="gap-2 rounded-xl border-border px-3.5 shadow-2xs hover:bg-surface cursor-pointer"
        >
          <RefreshCw className={cn("size-3.5", fetching && "animate-spin")} />
          Làm mới
        </Button>
      </div>

      {/* Khoảng thời gian, ô bật/tắt và thẻ thống kê */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label="Khoảng thời gian tổng hợp" className="flex items-center gap-2">
            {DAY_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={days === value}
                onClick={() => setDays(value)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer shadow-2xs",
                  days === value
                    ? "bg-brand text-brand-foreground shadow-xs"
                    : "border border-border bg-card text-subtle hover:text-ink hover:bg-surface",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-subtle cursor-pointer select-none rounded-xl border border-border bg-card px-3 py-1.5 shadow-2xs transition hover:bg-surface hover:text-ink">
            <input
              type="checkbox"
              checked={includeModeration}
              onChange={(e) => setIncludeModeration(e.target.checked)}
              className="size-4 rounded border-border accent-brand cursor-pointer"
            />
            Hiện cả kiểm duyệt
          </label>
        </div>

        <UsageSummarySection days={days} excludeFeature={excludeFeature} />
      </div>

      <ModelsLimitsSection />

      <UsageLogsSection
        includeModeration={includeModeration}
        onToggleModeration={setIncludeModeration}
      />
    </div>
  );
}
