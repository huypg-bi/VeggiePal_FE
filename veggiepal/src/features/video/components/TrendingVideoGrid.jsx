import { Link } from "react-router-dom";

import { trendingVideos } from "@/features/video/data/mockVideo";

export default function TrendingVideoGrid() {
  return (
    <section>
      <h2 className="text-xl font-bold text-ink sm:text-2xl">
        Thịnh hành hôm nay cho bạn
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {trendingVideos.map((video) => (
          <Link
            key={video.id}
            to={`/videos/${video.id}`}
            className="flex flex-col overflow-hidden rounded-2xl border border-black/15 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:shadow-md"
          >
            <div className={`relative h-44 w-full ${video.thumbClass}`}>
              <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white">
                {video.badge}
              </span>
              <span className="absolute bottom-3 right-3 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
                {video.duration}
              </span>
              <span className="grid h-full w-full place-items-center text-5xl">
                {video.emoji}
              </span>

              {typeof video.progress === "number" && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
                  <div
                    className="h-full bg-[#1D6C3D]"
                    style={{ width: `${video.progress}%` }}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-1 gap-2.5 p-4">
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ${video.avatarClass}`}
              >
                {video.initials}
              </span>
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink">
                  {video.title}
                </h3>
                <p className="mt-1 text-xs text-subtle">{video.channel}</p>
                <p className="text-xs text-subtle">
                  {video.views} • {video.uploadedAgo}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
