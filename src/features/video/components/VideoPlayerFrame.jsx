import { Play, Share2, Bookmark } from "lucide-react";

// Khung trống cho trình phát video — chờ BE cung cấp nguồn video thật.
export default function VideoPlayerFrame() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-[#0B0F0C]">
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid size-16 place-items-center rounded-full bg-white/10 text-white/70">
          <Play className="h-7 w-7 translate-x-0.5 fill-current" />
        </span>
      </div>

      <div className="absolute right-4 top-4 flex items-center gap-2">
        <button
          type="button"
          aria-label="Lưu video"
          className="grid size-9 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
        >
          <Bookmark className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Chia sẻ video"
          className="grid size-9 place-items-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
