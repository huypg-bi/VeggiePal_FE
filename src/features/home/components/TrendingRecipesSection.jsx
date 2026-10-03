import { Bookmark, ChefHat, ChevronRight, Clock, Flame, TrendingUp, User } from "lucide-react";

import { useRecipeNutrition } from "@/features/recipe/hooks/useRecipeNutrition";
import { useRecipes } from "@/features/recipe/hooks/useRecipes";
import { totalMinutes } from "@/features/recipe/utils/recipeNutrition";
import Reveal from "@/shared/components/Reveal";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

// Số công thức hiển thị ở trang chủ (BE chưa có xếp hạng "được yêu thích" nên lấy mới nhất).
const TRENDING_COUNT = 3;

export default function TrendingRecipesSection() {
  const { data, isPending, isError, error } = useRecipes({ size: TRENDING_COUNT });
  const recipes = data?.content;

  const { nutritionById, loading: nutritionLoading } = useRecipeNutrition(recipes);
  const { data: authors } = usePublicUsers(recipes?.map((r) => r.userId));

  return (
    <section className="bg-background px-6 py-16 font-sans md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand">
            <TrendingUp className="h-3.5 w-3.5" />
            Xu Hướng Tuần Này
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
            Món chay được yêu thích nhất
          </h2>
        </Reveal>

        {isError ? (
          <p className="mt-8 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error.message}
          </p>
        ) : isPending ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: TRENDING_COUNT }, (_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <p className="mt-8 text-sm text-subtle">Chưa có công thức nào được đăng.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe, index) => (
              <Reveal key={recipe.id} delay={index * 100}>
                <RecipeCard
                  recipe={recipe}
                  nutrition={nutritionById.get(recipe.id)}
                  nutritionLoading={nutritionLoading}
                  author={authors?.get(recipe.userId)}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RecipeCard({ recipe, nutrition, nutritionLoading, author }) {
  const minutes = totalMinutes(recipe);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-48 w-full object-cover"
            draggable={false}
          />
        ) : (
          // Công thức chưa có ảnh -> khung nền nhạt cùng kích thước để lưới không lệch.
          <div className="grid h-48 w-full place-items-center bg-brand-soft text-brand">
            <ChefHat className="size-10" />
          </div>
        )}
        {minutes > 0 && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <Clock className="h-3 w-3" />
            {minutes} phút
          </span>
        )}
        <button
          type="button"
          aria-label="Lưu công thức"
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <span className="flex items-center gap-1.5 text-xs text-subtle">
          <Flame className="h-3.5 w-3.5 text-brand" />
          {nutrition
            ? `${nutrition.kcal} kcal • ${nutrition.protein}g Đạm`
            : nutritionLoading
              ? "Đang tính dinh dưỡng..."
              : "Chưa có thông tin dinh dưỡng"}
        </span>

        <h3 className="mt-2 text-base font-semibold text-ink">{recipe.title}</h3>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            {author?.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={author.fullName}
                className="size-7 rounded-full object-cover"
                draggable={false}
              />
            ) : (
              <span className="grid size-7 place-items-center rounded-full bg-brand-soft text-brand">
                <User className="size-4" />
              </span>
            )}
            <span className="text-sm text-subtle">
              {author?.fullName ?? "Người dùng VeggiePal"}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-subtle" />
        </div>
      </div>
    </article>
  );
}

function RecipeCardSkeleton() {
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
