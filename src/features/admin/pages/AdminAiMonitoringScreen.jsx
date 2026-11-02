import { useState } from "react";

import ModelsLimitsSection from "@/features/admin/monitoring/components/ModelsLimitsSection";
import UsageLogsSection from "@/features/admin/monitoring/components/UsageLogsSection";
import UsageSummarySection from "@/features/admin/monitoring/components/UsageSummarySection";
import { DAY_OPTIONS } from "@/features/admin/monitoring/utils/monitoringFormat";
import { cn } from "@/lib/utils";

export default function AdminAiMonitoringScreen() {
  const [days, setDays] = useState(7);


  return (
    <div className="flex flex-col gap-8">


      {/* Khoảng thời gian và thẻ thống kê */}
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
        </div>

        <UsageSummarySection days={days} />
      </div>

      <ModelsLimitsSection />

      <UsageLogsSection />
    </div>
  );
}
