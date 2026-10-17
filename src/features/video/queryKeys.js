// Khóa cache React Query của feature video.
export const videoKeys = {
  all: ["videos"],
  feed: ({ categoryId, size } = {}) => [
    "videos",
    "feed",
    { categoryId: categoryId || undefined, size },
  ],
  detail: (id) => ["videos", "detail", id],
  mine: (status, size) => ["videos", "mine", { status: status || undefined, size }],
  aiSummary: (videoId) => ["videos", videoId, "ai-summary"],
};
