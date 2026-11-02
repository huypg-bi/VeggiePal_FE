// Bộ sưu tập công thức đã lưu (GET /recipes/favorites), mới lưu trước
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ChefHat, Loader2 } from "lucide-react";

import { useFavoriteRecipes } from "@/features/recipe/hooks/useRecipeFavorites";
import FallbackImage from "@/shared/components/FallbackImage";

const PREVIEW_SIZE = 6;
const EXPANDED_SIZE = 30;

export default function FavoritesCard() {
  const [expanded, setExpanded] = useState(false);
  const { data, isPending, isError, isFetching, refetch } = useFavoriteRecipes({
    size: expanded ? EXPANDED_SIZE : PREVIEW_SIZE,
  });

  const recipes = data?.items ?? [];
  const total = data?.totalElements ?? 0;

  return (
    <div className="bg-card rounded-3xl p-5 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-brand" />
          <h3 className="font-bold text-ink text-sm">Công Thức Đã Lưu</h3>
          {total > 0 && <span className="text-xs text-subtle">({total})</span>}
        </div>
        {total > PREVIEW_SIZE && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="text-[11px] font-semibold text-brand hover:underline cursor-pointer"
          >
            {expanded ? "Thu gọn" : "Xem tất cả"}
          </button>
        )}
      </div>

      {isPending ? (
        <p className="flex items-center gap-2 py-4 text-xs text-subtle">
          <Loader2 className="size-4 animate-spin" />
          Đang tải công thức đã lưu...
        </p>
      ) : isError ? (
        <div className="flex flex-col items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2">
          <p className="text-xs text-destructive">Không lấy được công thức đã lưu.</p>
          <button type="button" onClick={() => refetch()} className="text-xs font-semibold text-brand hover:underline">
            Thử lại
          </button>
        </div>
      ) : recipes.length === 0 ? (
        <p className="rounded-xl bg-surface px-3 py-4 text-center text-xs text-subtle">
          Bạn chưa lưu công thức nào.{" "}
          <Link to="/recipes" className="font-semibold text-brand hover:underline">
            Khám phá công thức
          </Link>
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2.5">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                aria-label={`Xem công thức ${recipe.title}`}
                className="group relative rounded-2xl overflow-hidden aspect-square"
              >
                <FallbackImage
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  draggable={false}
                  fallback={
                    <div className="grid h-full w-full place-items-center bg-brand-soft text-brand">
                      <ChefHat className="size-6" />
                    </div>
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium line-clamp-1">{recipe.title}</span>
                </div>
              </Link>
            ))}
          </div>
          {expanded && isFetching && <p className="mt-2 text-center text-[11px] text-subtle">Đang tải thêm...</p>}
          {expanded && total > EXPANDED_SIZE && (
            <p className="mt-2 text-center text-[11px] text-subtle">Đang hiển thị {EXPANDED_SIZE} công thức mới lưu gần nhất.</p>
          )}
        </>
      )}
    </div>
  );
}
