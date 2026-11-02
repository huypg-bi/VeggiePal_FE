// Kh?a cache React Query cho t?nh n?ng ki?m duy?t n?i dung (ai-service).
export const moderationKeys = {
  all: ["admin", "moderation"],
  pending: ["admin", "moderation", "pending"],
  history: (filters) => ["admin", "moderation", "history", filters],
};
