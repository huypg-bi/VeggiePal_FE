import { useState } from "react";
import { Bookmark, Heart, History, Home, Timer, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

const SUB_NAV_ITEMS = [
  { id: "home", label: "Trang chủ", icon: Home },
  { id: "saved", label: "Đã lưu", icon: Bookmark },
  { id: "your-channels", label: "Kênh của bạn", icon: UserRound },
  { id: "watched", label: "Video đã xem", icon: History },
  { id: "liked", label: "Video đã thích", icon: Heart },
];

export default function VideoSubNav() {
  const [active, setActive] = useState("home");

  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
      {SUB_NAV_ITEMS.map(({ id, label, icon: Icon, count }) => (
        <button
          key={id}
          type="button"
          onClick={() => setActive(id)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition",
            active === id
              ? "bg-[#E8F5E9] text-brand dark:bg-[#16301f]"
              : "text-subtle hover:bg-surface hover:text-ink"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
          {typeof count === "number" && (
            <span className="text-xs text-subtle">({count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
