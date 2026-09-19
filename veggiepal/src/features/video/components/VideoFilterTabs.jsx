import { useState } from "react";

import { suggestedFilterTabs } from "@/features/video/data/mockVideo";
import { cn } from "@/lib/utils";

export default function VideoFilterTabs() {
  const [active, setActive] = useState(suggestedFilterTabs[0].id);

  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
      {suggestedFilterTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActive(tab.id)}
          className={cn(
            "shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition",
            active === tab.id
              ? "bg-ink text-white"
              : "bg-[#F5F8F3] text-ink hover:bg-[#E8F5E9]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
