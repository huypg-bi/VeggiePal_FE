import { ArrowUpDown } from "lucide-react";

import { currentVideo } from "@/features/video/data/mockVideo";

export default function CommentsHeader() {
  return (
    <div className="flex items-center justify-between border-t border-border pt-5">
      <h2 className="text-sm font-bold text-ink">
        {currentVideo.commentsCount} bình luận
      </h2>
      <button
        type="button"
        className="flex items-center gap-1.5 text-xs font-medium text-subtle transition hover:text-ink"
      >
        <ArrowUpDown className="h-3.5 w-3.5" />
        Sắp xếp theo
      </button>
    </div>
  );
}
