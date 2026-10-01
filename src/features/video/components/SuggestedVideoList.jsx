import { Sparkles } from "lucide-react";

import { suggestedVideos } from "@/features/video/data/mockVideo";
import VideoFilterTabs from "@/features/video/components/VideoFilterTabs";

export default function SuggestedVideoList() {
  return (
    <section className="flex flex-col gap-4">
      <VideoFilterTabs />

      <div className="flex flex-col gap-4">
        {suggestedVideos.map((video) => (
          <article key={video.id} className="flex gap-3">
            <div
              className={`relative h-24 w-40 shrink-0 overflow-hidden rounded-xl ${video.thumbClass}`}
            >
              <span className="absolute left-2 top-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {video.tag}
              </span>
              <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {video.duration}
              </span>
              <span className="grid h-full w-full place-items-center text-3xl">
                {video.emoji}
              </span>
            </div>

            <div className="flex min-w-0 flex-col gap-1">
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink">
                {video.title}
              </h3>
              <p className="text-xs text-subtle">{video.channel}</p>
              <p className="text-xs text-subtle">
                {video.views} • {video.uploadedAgo}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
