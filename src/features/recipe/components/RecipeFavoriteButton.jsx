import { Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRequireLogin } from "@/features/auth/hooks/useRequireLogin";
import { useFavoriteRecipeIds, useSetRecipeFavorite } from "@/features/recipe/hooks/useRecipeFavorites";
import { cn } from "@/lib/utils";

/**
 * Nút lưu / bỏ lưu công thức. variant="overlay": nút tròn đè lên ảnh thẻ; "full": nút có chữ + số lượt lưu ở trang chi tiết.
 * Trạng thái lấy từ danh sách id đã lưu (một lần gọi cho cả danh sách); khách bấm thì dẫn tới đăng nhập.
 */
export default function RecipeFavoriteButton({ recipe, variant = "overlay" }) {
  const { isAuthenticated, requireLogin } = useRequireLogin();
  const { data: favoriteIds, isPending: isLoadingIds } = useFavoriteRecipeIds();
  const { mutate, isPending } = useSetRecipeFavorite();

  // BE chỉ cho lưu công thức đã đăng.
  if (recipe.status && recipe.status !== "PUBLISHED") return null;

  const saved = favoriteIds?.has(recipe.id) ?? false;
  const count = recipe.favoriteCount ?? 0;
  const label = saved ? "Bỏ lưu công thức" : "Lưu công thức";

  const handleClick = () => {
    if (!requireLogin()) return;
    mutate(
      { recipeId: recipe.id, favorite: !saved },
      {
        onSuccess: () => toast.success(saved ? "Đã bỏ lưu công thức" : "Đã lưu công thức"),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  // Chưa biết đã lưu hay chưa thì chưa cho bấm, tránh POST nhầm lên công thức đã lưu.
  const disabled = isPending || (isAuthenticated && isLoadingIds);

  if (variant === "full") {
    return (
      <Button
        type="button"
        size="sm"
        variant={saved ? "soft" : "outline"}
        disabled={disabled}
        aria-pressed={saved}
        onClick={handleClick}
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <Bookmark className={cn("size-4", saved && "fill-current")} />}
        {saved ? "Đã lưu" : "Lưu công thức"}
        {count > 0 && <span className="text-xs text-subtle">{count}</span>}
      </Button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={saved}
      disabled={disabled}
      onClick={handleClick}
      className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 disabled:opacity-60"
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : <Bookmark className={cn("size-4", saved && "fill-current")} />}
    </button>
  );
}
