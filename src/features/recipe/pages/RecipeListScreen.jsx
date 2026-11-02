import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import RecipeCard, { RecipeCardSkeleton } from "@/features/recipe/components/RecipeCard";
import RecipeBanner from "@/features/recipe/components/RecipeBanner";
import { useRecipeNutrition } from "@/features/recipe/hooks/useRecipeNutrition";
import { useRecipeFeed } from "@/features/recipe/hooks/useRecipes";
import AppHeader from "@/shared/components/AppHeader";
import Reveal from "@/shared/components/Reveal";
import SelectField from "@/shared/components/SelectField";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 400;
const SORT_OPTIONS = [
  { value: undefined, label: "Mới nhất" },
  { value: "popular", label: "Được lưu nhiều nhất" },
];

export default function RecipeListScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = (searchParams.get("q") ?? "").trim();
  const sort = searchParams.get("sort") === "popular" ? "popular" : undefined;

  const [text, setText] = useState(keyword);
  const timerRef = useRef(undefined);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const pushKeyword = (value) => {
    clearTimeout(timerRef.current);
    const next = value.trim();
    // replace: gõ tìm kiếm không nên làm đầy lịch sử trình duyệt; giữ nguyên kiểu sắp xếp đang chọn.
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next) params.set("q", next);
        else params.delete("q");
        return params;
      },
      { replace: true },
    );
  };

  const handleSortChange = (value) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (value) params.set("sort", value);
        else params.delete("sort");
        return params;
      },
      { replace: true },
    );
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setText(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => pushKeyword(value), SEARCH_DEBOUNCE_MS);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    pushKeyword(text);
  };

  const handleClear = () => {
    setText("");
    pushKeyword("");
  };

  const { recipes, isPending, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useRecipeFeed({ keyword, sort, size: PAGE_SIZE });
  const { nutritionById } = useRecipeNutrition(recipes);
  const { data: authors } = usePublicUsers(recipes.map((r) => r.userId));

  return (
    <div className="min-h-dvh">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-6">
        <Reveal>
          <RecipeBanner />
        </Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSubmit} role="search" className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              value={text}
              onChange={handleChange}
              placeholder="Tìm công thức theo tên hoặc mô tả..."
              aria-label="Tìm công thức"
              className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-10 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/40 focus:ring-2 focus:ring-brand/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {text && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Xóa từ khóa"
                className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-subtle transition hover:bg-surface hover:text-ink"
              >
                <X className="size-4" />
              </button>
            )}
          </form>
          <SelectField
            aria-label="Sắp xếp công thức"
            options={SORT_OPTIONS}
            value={sort}
            onValueChange={handleSortChange}
            active={sort !== undefined}
          />
        </div>

        {isError ? (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error.message}
          </p>
        ) : isPending ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-6 text-sm text-subtle">
            {keyword ? (
              <>
                <p>Không tìm thấy công thức nào phù hợp với “{keyword}”.</p>
                <Button type="button" variant="outline" size="sm" className="mt-3" onClick={handleClear}>
                  Xóa từ khóa
                </Button>
              </>
            ) : (
              <p>Chưa có công thức nào được đăng.</p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <Reveal key={recipe.id}>
                  <RecipeCard
                    recipe={recipe}
                    nutrition={nutritionById.get(recipe.id)}
                    author={authors?.get(recipe.userId)}
                  />
                </Reveal>
              ))}
            </div>

            {hasNextPage && (
              <Button
                type="button"
                variant="outline"
                className="self-center"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  "Xem thêm công thức"
                )}
              </Button>
            )}
          </>
        )}
      </main>
    </div>
  );
}
