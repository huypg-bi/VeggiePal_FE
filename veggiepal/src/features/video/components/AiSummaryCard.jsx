import { useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";

import iconAiSummary from "@/assets/img/icon_video_page_1.png";
import { aiSummary } from "@/features/video/data/mockVideo";
import { cn } from "@/lib/utils";

export default function AiSummaryCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="rounded-3xl border border-black/15 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2.5">
        <img src={iconAiSummary} alt="" className="h-9 w-9 shrink-0" />
        <h2 className="text-sm font-bold text-ink sm:text-base">
          Tóm tắt công thức nấu ăn (AI Summary)
        </h2>
      </div>

      <ol className="mt-4 flex flex-col gap-3">
        {aiSummary.steps.map((step, index) => (
          <li key={index} className="flex gap-2.5 text-sm leading-relaxed text-body">
            <span className="shrink-0 font-bold text-ink">Bước {index + 1}:</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex gap-2.5 rounded-2xl bg-[#FFF7E6] px-4 py-3 text-sm text-[#8A5A00]">
        <Lightbulb className="h-4 w-4 shrink-0 translate-y-0.5" />
        <p>
          <span className="font-bold">Mẹo nhỏ:</span> {aiSummary.tip}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 flex items-center gap-1 text-xs font-semibold text-subtle transition hover:text-ink"
      >
        {expanded ? "Ẩn bớt" : "Hiện thêm"}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")}
        />
      </button>
    </section>
  );
}
