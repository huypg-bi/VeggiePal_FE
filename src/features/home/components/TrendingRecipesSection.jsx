import { Bookmark, ChevronRight, Clock, Flame, TrendingUp } from "lucide-react";

import { trendingRecipes } from "@/features/home/data/landingData";
import Reveal from "@/shared/components/Reveal";

export default function TrendingRecipesSection() {
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

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trendingRecipes.map((recipe, index) => (
            <Reveal key={recipe.id} delay={index * 100}>
              <RecipeCard recipe={recipe} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecipeCard({ recipe }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-48 w-full object-cover"
          draggable={false}
        />
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          <Clock className="h-3 w-3" />
          {recipe.minutes} phút
        </span>
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
            {recipe.kcal} kcal • {recipe.protein}g Đạm
          </span>

        <h3 className="mt-2 text-base font-semibold text-ink">{recipe.title}</h3>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <img
              src={recipe.authorAvatar}
              alt={recipe.author}
              className="size-7 rounded-full object-cover"
              draggable={false}
            />
            <span className="text-sm text-subtle">{recipe.author}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-subtle" />
        </div>
      </div>
    </article>
  );
}
