import { extractYouTubeId } from "@/features/video/utils/videoForm";

export default function VideoPlayerFrame({ video }) {
  if (!video) {
    return (
      <div className="relative aspect-video w-full animate-pulse overflow-hidden rounded-3xl bg-surface" />
    );
  }

  const embedUrl = (() => {
    if (video.sourceType !== "YOUTUBE" || !video.videoUrl) return "";
    if (video.videoUrl.includes("/embed/")) return video.videoUrl;
    const yId = extractYouTubeId(video.videoUrl);
    return yId ? `https://www.youtube.com/embed/${yId}?enablejsapi=1` : video.videoUrl;
  })();

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-lg">
      {video.sourceType === "YOUTUBE" ? (
        <iframe
          src={embedUrl}
          title={video.title}
          className="size-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <video
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          controls
          playsInline
          className="size-full object-contain"
        >
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      )}
    </div>
  );
}
