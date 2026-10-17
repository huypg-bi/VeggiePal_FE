import { useState } from "react";
import { ChevronDown, Lightbulb, Loader2 } from "lucide-react";

import iconAiSummary from "@/assets/img/icon_video_page_1.png";
import { useAiSummary } from "@/features/video/hooks/useAiSummary";
import { cn } from "@/lib/utils";

// Thu gọn: chỉ hiện vài bước đầu; "Hiện thêm" mới mở hết các bước và mẹo nhỏ.
const COLLAPSED_STEPS = 2;

export default function AiSummaryCard({ videoId }) {
  const [expanded, setExpanded] = useState(false);
  const { data, isPending, error } = useAiSummary(videoId);

  const steps = data?.steps ?? [];
  const canToggle = steps.length > COLLAPSED_STEPS;
  const showAll = expanded || !canToggle;
  const visibleSteps = showAll ? steps : steps.slice(0, COLLAPSED_STEPS);

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2.5">
        <img src={iconAiSummary} alt="" className="h-9 w-9 shrink-0" />
        <h2 className="text-sm font-bold text-ink sm:text-base">
          Tóm tắt công thức nấu ăn (AI Summary)
        </h2>
      </div>

      {isPending ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-subtle">
          <Loader2 className="h-4 w-4 animate-spin text-brand" />
          Đang tóm tắt công thức…
        </div>
      ) : error ? (
        <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error.message || "Không lấy được tóm tắt công thức"}
        </p>
      ) : (
        <>
          <ol className="mt-4 flex flex-col gap-3">
            {visibleSteps.map((step, index) => (
              <li key={index} className="flex gap-2.5 text-sm leading-relaxed text-body">
                <span className="shrink-0 font-bold text-ink">Bước {index + 1}:</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          {showAll && data.tip && (
            <div className="mt-4 flex gap-2.5 rounded-2xl bg-[#FFF7E6] px-4 py-3 text-sm text-[#8A5A00] dark:bg-[#3a2c0d] dark:text-[#f0c674]">
              <Lightbulb className="h-4 w-4 shrink-0 translate-y-0.5" />
              <p>
                <span className="font-bold">Mẹo nhỏ:</span> {data.tip}
              </p>
            </div>
          )}

          {canToggle && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="mt-4 flex items-center gap-1 text-xs font-semibold text-subtle transition hover:text-ink"
            >
              {expanded ? "Ẩn bớt" : `Hiện thêm (${steps.length - COLLAPSED_STEPS} bước và mẹo nhỏ)`}
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")}
              />
            </button>
          )}
        </>
      )}
    </section>
  );
}
