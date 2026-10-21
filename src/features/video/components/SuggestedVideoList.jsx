import { Link } from "react-router-dom";
import { PlaySquare } from "lucide-react";

import { formatCompactNumber, formatTimeAgo } from "@/features/blog/utils/blogFormat";
import { suggestedVideos } from "@/features/video/data/mockVideo";
import { useVideoFeed } from "@/features/video/hooks/useVideos";
import FallbackImage from "@/shared/components/FallbackImage";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

export default function SuggestedVideoList({ currentVideoId, categoryId }) {
  // Lấy các video khác đã xuất bản: ưu tiên cùng chuyên mục, nếu ít thì lấy thêm từ nguồn chung
  const { videos: catVideos } = useVideoFeed({ categoryId: categoryId ?? undefined, size: 8 });
  const { videos: allVideos } = useVideoFeed({ categoryId: undefined, size: 8 });

  const filteredCat = catVideos.filter((v) => v.id !== Number(currentVideoId));
  const filteredAll = allVideos.filter((v) => v.id !== Number(currentVideoId));
  const otherRealVideos = filteredCat.length > 0 ? filteredCat : filteredAll;

  const { data: authors } = usePublicUsers(otherRealVideos.map((v) => v.authorId));

  const hasRealVideos = otherRealVideos.length > 0;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-ink sm:text-base">
          Video gợi ý tiếp theo
        </h2>
        {!hasRealVideos && (
          <span className="text-[11px] font-medium text-subtle">
            (Dữ liệu mẫu)
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3.5">
        {hasRealVideos ? (
          otherRealVideos.slice(0, 5).map((v) => {
            const author = authors?.get(v.authorId);
            return (
              <Link
                key={v.id}
                to={`/videos/${v.id}`}
                className="group flex gap-3 rounded-2xl p-1.5 transition hover:bg-surface"
              >
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-surface">
                  <FallbackImage
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="size-full object-cover transition duration-300 group-hover:scale-105"
                    fallback={
                      <span className="grid size-full place-items-center bg-surface text-subtle">
                        <PlaySquare className="size-6 text-subtle" />
                      </span>
                    }
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-medium text-white">
                    {v.sourceType === "YOUTUBE" ? "YouTube" : "Video"}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                  <h3 className="line-clamp-2 text-xs font-bold leading-snug text-ink transition group-hover:text-brand">
                    {v.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px]">
                    {author?.fullName && (
                      <span className="truncate text-subtle">{author.fullName}</span>
                    )}
                    {v.categoryName && (
                      <span className="shrink-0 text-brand">{v.categoryName}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-subtle">
                    {formatCompactNumber(v.viewCount)} lượt xem •{" "}
                    {formatTimeAgo(v.publishedAt ?? v.createdAt)}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          suggestedVideos.slice(0, 4).map((video) => (
            <article key={video.id} className="flex gap-3 p-1.5">
              <div
                className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-xl ${video.thumbClass}`}
              >
                <span className="absolute left-1.5 top-1.5 rounded bg-black/50 px-1 py-0.5 text-[9px] font-semibold text-white">
                  {video.tag}
                </span>
                <span className="absolute right-1.5 bottom-1.5 rounded bg-black/70 px-1 py-0.5 text-[9px] font-medium text-white">
                  {video.duration}
                </span>
                <span className="grid size-full place-items-center text-2xl">
                  {video.emoji}
                </span>
              </div>

              <div className="flex min-w-0 flex-col justify-center gap-1">
                <h3 className="line-clamp-2 text-xs font-bold leading-snug text-ink">
                  {video.title}
                </h3>
                <p className="text-[11px] text-subtle">{video.channel}</p>
                <p className="text-[11px] text-subtle">
                  {video.views} • {video.uploadedAgo}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
