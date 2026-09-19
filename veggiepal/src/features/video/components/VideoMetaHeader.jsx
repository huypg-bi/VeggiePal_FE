import { CheckCircle2, ChevronDown, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

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

          <button
            type="button"
            className="ml-2 flex items-center gap-1 rounded-full border border-black/10 py-1.5 pl-3 pr-2 text-xs font-semibold text-ink transition hover:bg-[#F5F8F3]"
          >
            Đã đăng ký
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-[#1D6C3D] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#17542F]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Bóc tách công thức AI
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-black/10">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-l-full px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-[#F5F8F3]"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {likes}
          </button>
          <div className="h-4 w-px bg-black/10" />
          <button
            type="button"
            aria-label="Không thích"
            className="rounded-r-full px-3 py-1.5 text-ink transition hover:bg-[#F5F8F3]"
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
        <span className="flex items-center gap-1 font-medium text-[#1D6C3D]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {approvedBadge}
        </span>
      </div>
    </div>
  );
}
