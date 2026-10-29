import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRequireLogin } from "@/features/auth/hooks/useRequireLogin";
import { selectIsAuthenticated, useAuthStore } from "@/features/auth/store/authStore";
import { formatCompactNumber, formatTimeAgo, getInitials } from "@/features/blog/utils/blogFormat";
import { useVideoRecipe } from "@/features/video/hooks/useVideoRecipe";
import { useVoteVideo } from "@/features/video/hooks/useVideoVotes";
import { cn } from "@/lib/utils";
import FallbackImage from "@/shared/components/FallbackImage";

const scrollToAiCard = () => {
  document.getElementById("ai-summary-card")?.scrollIntoView({ behavior: "smooth" });
};

export default function VideoMetaHeader({ video, author, myVote }) {
  const [descExpanded, setDescExpanded] = useState(false);
  const recipe = useVideoRecipe(video);
  const { requireLogin } = useRequireLogin();
  const userId = useAuthStore((s) => s.user?.id);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const voteMutation = useVoteVideo();

  if (!video) {
    return (
      <div aria-hidden className="flex animate-pulse flex-col gap-4">
        <div className="h-7 w-3/4 rounded-lg bg-surface" />
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-surface" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 rounded bg-surface" />
            <div className="h-3 w-20 rounded bg-surface" />
          </div>
        </div>
      </div>
    );
  }

  const authorName = author?.fullName ?? "Thành viên VeggiePal";
  const isOwnVideo = isAuthenticated && userId === video.authorId;
  const liked = myVote === 1;
  const disliked = myVote === -1;
  const score = video.voteScore ?? 0;

  const handleVote = (value) => {
    if (!requireLogin()) return;
    if (isOwnVideo) {
      toast.info("Bạn không thể bình chọn video của chính mình");
      return;
    }
    voteMutation.mutate(
      { videoId: video.id, value },
      { onError: (error) => toast.error(error.message) }
    );
  };

  // Nút AI theo trạng thái công thức của video: đã có thì cuộn tới thẻ AI, chưa thì bóc tách.
  const aiStatus = recipe.status;
  const aiBusy = aiStatus === "processing";
  const aiDisabled = aiBusy || aiStatus === "loading" || aiStatus === "unsupported";
  const aiLabel =
    aiStatus === "ready" ? "Xem công thức AI" : aiBusy ? "Đang bóc tách…" : "Bóc tách công thức AI";

  const handleAiClick = () => {
    if (aiStatus === "login") {
      requireLogin();
      return;
    }
    if ((aiStatus === "none" || aiStatus === "failed") && !recipe.noQuota) recipe.run();
    scrollToAiCard();
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold leading-snug text-ink sm:text-2xl">
        {video.title}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Thông tin tác giả */}
        <div className="flex items-center gap-3">
          <FallbackImage
            src={author?.avatarUrl}
            alt={authorName}
            className="size-11 shrink-0 rounded-full object-cover"
            draggable={false}
            fallback={
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                {getInitials(authorName)}
              </span>
            }
          />
          <div>
            <span className="text-sm font-bold text-ink">{authorName}</span>
            <p className="text-xs text-subtle">
              {video.categoryName ? `Chuyên mục: ${video.categoryName}` : "Thành viên cộng đồng"}
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleAiClick}
            disabled={aiDisabled}
            title={aiStatus === "unsupported" ? "Chưa hỗ trợ bóc tách video YouTube" : undefined}
            className="ml-2 gap-1.5 shadow-sm"
          >
            {aiBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
            {aiLabel}
          </Button>
        </div>

        {/* Nút thích / không thích */}
        <div className="flex items-center rounded-full border border-border bg-card">
          <button
            type="button"
            onClick={() => handleVote(1)}
            disabled={voteMutation.isPending}
            title={
              isOwnVideo
                ? "Bạn không thể bình chọn video của chính mình"
                : liked
                  ? "Bỏ thích video"
                  : "Thích video"
            }
            aria-pressed={liked}
            className={cn(
              "flex items-center gap-1.5 rounded-l-full px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:bg-surface disabled:opacity-60",
              liked && "bg-brand-soft font-bold text-brand"
            )}
          >
            <ThumbsUp className={cn("size-3.5", liked && "fill-current text-brand")} />
            {score > 0 ? formatCompactNumber(score) : "Thích"}
          </button>
          <div className="h-4 w-px bg-border" />
          <button
            type="button"
            onClick={() => handleVote(-1)}
            disabled={voteMutation.isPending}
            title={
              isOwnVideo
                ? "Bạn không thể bình chọn video của chính mình"
                : disliked
                  ? "Bỏ không thích"
                  : "Không thích"
            }
            aria-pressed={disliked}
            aria-label="Không thích"
            className={cn(
              "rounded-r-full px-3 py-1.5 text-ink transition hover:bg-surface disabled:opacity-60",
              disliked && "bg-destructive/10 font-bold text-destructive"
            )}
          >
            <ThumbsDown className={cn("size-3.5", disliked && "fill-current text-destructive")} />
          </button>
        </div>
      </div>

      {/* Thông số lượt xem và thời gian */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-subtle">
        <span className="font-medium text-ink">
          {formatCompactNumber(video.viewCount)} lượt xem
        </span>
        <span>•</span>
        <span>{formatTimeAgo(video.publishedAt ?? video.createdAt)}</span>
        <span>•</span>
        <span className="rounded-full bg-brand-soft px-2 py-0.5 font-medium text-brand">
          {video.sourceType === "YOUTUBE" ? "Nguồn YouTube" : "Video độc quyền"}
        </span>
      </div>

      {/* Mô tả video */}
      {video.description && (
        <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-body">
          <p className={descExpanded ? "whitespace-pre-line" : "line-clamp-3 whitespace-pre-line"}>
            {video.description}
          </p>
          {video.description.length > 180 && (
            <button
              type="button"
              onClick={() => setDescExpanded((v) => !v)}
              className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              {descExpanded ? (
                <>
                  Thu gọn <ChevronUp className="size-3" />
                </>
              ) : (
                <>
                  Xem thêm mô tả <ChevronDown className="size-3" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
