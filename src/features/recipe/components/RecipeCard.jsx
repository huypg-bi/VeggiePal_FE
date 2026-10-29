import { Link } from "react-router-dom";
import { Bookmark, ChefHat, ChevronRight, Clock, Flame, User } from "lucide-react";

import RecipeFavoriteButton from "@/features/recipe/components/RecipeFavoriteButton";

import { totalMinutes } from "@/features/recipe/utils/recipeNutrition";
import FallbackImage from "@/shared/components/FallbackImage";

export default function RecipeCard({ recipe, nutrition, author }) {
  const minutes = totalMinutes(recipe);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative">
        <Link to={`/recipes/${recipe.id}`} aria-label={`Xem công thức ${recipe.title}`} className="block">
          <FallbackImage
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-48 w-full object-cover"
            draggable={false}
            // Công thức chưa có ảnh (hoặc ảnh lỗi) -> khung nền nhạt cùng kích thước để lưới không lệch.
            fallback={
              <div className="grid h-48 w-full place-items-center bg-brand-soft text-brand">
                <ChefHat className="size-10" />
              </div>
            }
          />
        </Link>
        {minutes > 0 && (
          <span className="pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <Clock className="h-3 w-3" />
            {minutes} phút
          </span>
        )}
        <RecipeFavoriteButton recipe={recipe} />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-subtle">
          <span className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-brand" />
            {nutrition
              ? `${nutrition.kcal} kcal • ${nutrition.protein}g Đạm`
              : "Chưa có thông tin dinh dưỡng"}
          </span>
          {recipe.favoriteCount > 0 && (
            <span className="flex shrink-0 items-center gap-1" title="Lượt lưu">
              <Bookmark className="size-3.5" />
              {recipe.favoriteCount}
            </span>
          )}
        </div>

        <h3 className="mt-2 text-base font-semibold text-ink">
          <Link to={`/recipes/${recipe.id}`} className="transition hover:text-brand">
            {recipe.title}
          </Link>
        </h3>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <FallbackImage
              src={author?.avatarUrl}
              alt={author?.fullName}
              className="size-7 rounded-full object-cover"
              draggable={false}
              fallback={
                <span className="grid size-7 place-items-center rounded-full bg-brand-soft text-brand">
                  <User className="size-4" />
                </span>
              }
            />
            <span className="text-sm text-subtle">
              {author?.fullName ?? "Người dùng VeggiePal"}
            </span>
          </div>
          <Link to={`/recipes/${recipe.id}`} aria-label="Xem chi tiết công thức" className="text-subtle transition hover:text-brand">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div
      aria-hidden
      className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="h-48 w-full bg-surface" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/2 rounded bg-surface" />
        <div className="h-4 w-4/5 rounded bg-surface" />
        <div className="h-7 w-2/3 rounded bg-surface" />
      </div>
    </div>
  );
}
