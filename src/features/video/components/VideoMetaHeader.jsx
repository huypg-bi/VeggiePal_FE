import { CheckCircle2, ChevronDown, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { currentVideo } from "@/features/video/data/mockVideo";

export default function VideoMetaHeader() {
  const { title, channel, views, uploadedAgo, approvedBadge, likes } = currentVideo;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold leading-snug text-ink sm:text-2xl">{title}</h1>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${channel.avatarClass}`}
          >
            {channel.avatarText}
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-ink">{channel.name}</span>
              {channel.verified && (
                <CheckCircle2 className="h-4 w-4 fill-[#1D6C3D] text-white" />
              )}
            </div>
            <p className="text-xs text-subtle">{channel.subscribers}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="ml-2 gap-1 bg-transparent pl-3 pr-2 font-semibold"
          >
            Đã đăng ký
            <ChevronDown className="size-3.5" />
          </Button>

          <Button type="button" size="sm" className="px-4 shadow-sm">
            <Sparkles className="size-3.5" />
            Bóc tách công thức AI
          </Button>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-l-full px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-surface"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {likes}
          </button>
          <div className="h-4 w-px bg-border" />
          <button
            type="button"
            aria-label="Không thích"
            className="rounded-r-full px-3 py-1.5 text-ink transition hover:bg-surface"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
        <span>{views}</span>
        <span>•</span>
        <span>{uploadedAgo}</span>
        <span>•</span>
        <span className="flex items-center gap-1 font-medium text-brand">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {approvedBadge}
        </span>
      </div>
    </div>
  );
}
