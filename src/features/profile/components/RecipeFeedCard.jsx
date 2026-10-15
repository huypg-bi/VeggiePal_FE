import { Link } from "react-router-dom";
import { CheckCircle, ImageOff, Loader2 } from "lucide-react";

import { useMyBlogs } from "@/features/blog/hooks/useMyBlogs";
import { useMyRecipes } from "@/features/recipe/hooks/useMyRecipes";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { formatTimeAgo } from "@/features/blog/utils/blogFormat";
import FallbackImage from "@/shared/components/FallbackImage";
import {
  getStatusBadgeText,
  mergeAndSortContent,
} from "@/features/profile/utils/feedHelpers";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=256";

export default function RecipeFeedCard() {
  const { profile } = useProfile();
  const blogsQuery = useMyBlogs({ size: 10 });
  const recipesQuery = useMyRecipes({ size: 10 });

  const loading = blogsQuery.isPending || recipesQuery.isPending;
  const error = blogsQuery.error || recipesQuery.error;

  const displayName = profile?.fullName?.trim() || "Người dùng VeggiePal";
  const avatarUrl = profile?.avatarUrl || DEFAULT_AVATAR;

  const items = mergeAndSortContent(blogsQuery.posts, recipesQuery.recipes);

  if (loading) {
    return (
      <div className="bg-card rounded-3xl p-8 shadow-sm border border-border mb-5 flex items-center justify-center gap-2 text-xs text-subtle">
        <Loader2 className="w-4 h-4 animate-spin text-brand" />
        Đang tải bài viết &amp; công thức…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-destructive/10 p-5 text-xs text-destructive mb-5">
        {error.message || "Không tải được danh sách bài viết & công thức"}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-card rounded-3xl p-8 shadow-sm border border-dashed border-border mb-5 text-center text-xs text-subtle">
        Bạn chưa có bài viết hoặc công thức nào. Hãy chia sẻ món ăn thuần chay đầu tiên của bạn!
      </div>
    );
  }

  return (
    <div className="space-y-5 mb-5">
      {items.map((item) => {
        const totalMinutes =
          (item.prepTime || 0) + (item.cookTime || 0);

        return (
          <div
            key={item.id}
            className="bg-card rounded-3xl p-6 shadow-sm border border-border"
          >
            {/* Header: Author + Time + Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface shrink-0">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-ink">
                      {displayName}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 fill-brand text-brand-foreground" />
                  </div>
                  <span className="text-[11px] text-subtle">
                    {formatTimeAgo(item.date)} • Chế độ: Công khai
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-brand-soft text-brand">
                {getStatusBadgeText(item.status)}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-base font-bold text-ink mb-2 leading-snug">
              <Link to={item.link} className="hover:text-brand transition-colors">
                {item.title}
              </Link>
            </h2>

            {/* Description (nếu có) */}
            {item.description && (
              <p className="text-xs text-body leading-relaxed mb-3">
                {item.description}
              </p>
            )}

            {/* Macro/Metadata Pills (chỉ hiện khi có dữ liệu thật) */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold">
              {item.categoryName && (
                <span className="px-2.5 py-1 rounded-lg bg-warning/10 text-warning">
                  🏷️ {item.categoryName}
                </span>
              )}
              {item.servings != null && (
                <span className="px-2.5 py-1 rounded-lg bg-brand-soft text-brand">
                  🌱 {item.servings} khẩu phần
                </span>
              )}
              {totalMinutes > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                  ⚡ {totalMinutes} phút
                </span>
              )}
              {item.viewCount != null && (
                <span className="px-2.5 py-1 rounded-lg bg-surface text-body">
                  👁️ {item.viewCount} lượt xem
                </span>
              )}
              {item.voteScore != null && (
                <span className="px-2.5 py-1 rounded-lg bg-brand-soft text-brand">
                  👍 {item.voteScore} điểm
                </span>
              )}
            </div>

            {/* Image (nếu có ảnh thực tế) */}
            {item.imageUrl && (
              <div className="rounded-2xl overflow-hidden mb-4 relative aspect-video max-h-80 bg-surface">
                <FallbackImage
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  fallback={
                    <div className="grid h-full w-full place-items-center text-subtle">
                      <ImageOff className="size-8" />
                    </div>
                  }
                />
              </div>
            )}

            {/* Nguyên liệu chính (chỉ hiện khi recipe có dữ liệu nguyên liệu) */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="p-3 bg-surface rounded-xl mb-4 text-[11px] text-body flex flex-wrap items-center gap-2">
                <strong className="text-ink">Nguyên liệu chính:</strong>
                {item.ingredients.map((ing, idx) => (
                  <span key={idx}>
                    • {ing.quantity ? `${ing.quantity} ` : ""}
                    {ing.unit ? `${ing.unit} ` : ""}
                    {ing.ingredientName || ing.name}
                  </span>
                ))}
              </div>
            )}

            {/* Footer hành động */}
            <div className="flex items-center justify-between text-xs text-subtle pt-3 border-t border-border">
              <Link
                to={item.link}
                className="text-xs font-semibold text-brand hover:underline"
              >
                Xem chi tiết →
              </Link>
              <span className="text-[11px] text-subtle">
                {item.type === "blog" ? "Bài viết cộng đồng" : "Công thức nấu chay"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}