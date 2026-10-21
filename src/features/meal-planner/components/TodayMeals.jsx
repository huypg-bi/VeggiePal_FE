import { useState } from "react";
import { CalendarX2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import MealCard from "@/features/meal-planner/components/MealCard";
import { mockSnack } from "@/features/meal-planner/data/mockMealPlanner";
import { useDayRecipes } from "@/features/meal-planner/hooks/useDayRecipes";
import { useReplaceMeal } from "@/features/meal-planner/hooks/useMealPlanMutations";
import {
  dayKeyOf,
  dayLabel,
  mealLabel,
  mealTime,
  normalizeDay,
  sortedMeals,
  toRounded,
} from "@/features/meal-planner/utils/mealPlan";
import { cn } from "@/lib/utils";
import Reveal from "@/shared/components/Reveal";

const selectClass =
  "h-9 max-w-full rounded-full border border-border bg-card px-3 text-sm font-medium text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15";

function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

/**
 * Thực đơn theo ngày của thực đơn đang xem.
 * - plans / plan: các thực đơn đã lưu (mới nhất trước) và cái đang xem.
 * - days: các ngày của thực đơn đang xem, đã sắp T2 -> CN; activeDay: ngày đang chọn.
 * Bữa Phụ vẫn là dữ liệu mẫu vì BE chưa có (thực đơn AI chỉ có sáng / trưa / tối).
 */
export default function TodayMeals({
  plans,
  plan,
  days,
  activeDay,
  isLoading,
  error,
  onRetry,
  onSelectPlan,
  onSelectDay,
}) {
  const [likedMeals, setLikedMeals] = useState(() => new Set());
  const [replacingKey, setReplacingKey] = useState(null);
  const replaceMeal = useReplaceMeal();

  const meals = sortedMeals(activeDay);
  const recipes = useDayRecipes(meals.map((meal) => meal.recipeId));

  const planIndex = plan ? plans.findIndex((item) => item.id === plan.id) : -1;
  const olderPlan = planIndex >= 0 ? plans[planIndex + 1] : undefined;
  const newerPlan = planIndex > 0 ? plans[planIndex - 1] : undefined;

  const activeKey = normalizeDay(activeDay?.day);
  const isToday = activeKey === dayKeyOf();
  const dayTitle = activeDay ? (isToday ? "Hôm Nay" : dayLabel(activeDay).long) : "Hôm Nay";

  const toggleLike = (id) => {
    setLikedMeals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReplace = async (meal) => {
    const key = `${activeKey}-${normalizeDay(meal.mealType)}`;
    setReplacingKey(key);
    try {
      await replaceMeal.mutateAsync({
        planId: plan.id,
        day: activeDay.day,
        mealType: meal.mealType,
        currentRecipeId: meal.recipeId,
      });
      toast.success("Đã đổi sang món mới cho bạn");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setReplacingKey(null);
    }
  };

  const toCardMeal = (meal) => {
    const { recipe, isPending, isError } = recipes.get(meal.recipeId) ?? {};
    const totalMinutes = (Number(recipe?.prepTime) || 0) + (Number(recipe?.cookTime) || 0);
    return {
      label: mealLabel(meal.mealType),
      time: mealTime(meal.mealType),
      title: recipe?.title ?? (isPending ? "Đang tải món..." : isError ? `Món #${meal.recipeId}` : ""),
      description: meal.note || recipe?.description || "",
      image: recipe?.imageUrl,
      prepMinutes: totalMinutes,
      kcal: toRounded(meal.nutrition?.calories),
      protein: toRounded(meal.nutrition?.protein),
      carb: toRounded(meal.nutrition?.carbohydrate),
      fat: toRounded(meal.nutrition?.fat),
      href: recipe ? `/recipes/${meal.recipeId}` : undefined,
      servingMultiplier: Number(meal.servingMultiplier) || null,
    };
  };

  const renderBody = () => {
    if (isLoading) return <MealSkeletons />;
    if (error) {
      return (
        <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl bg-card p-8 text-center shadow-md">
          <p className="text-sm text-destructive">{error.message}</p>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Thử lại
          </Button>
        </div>
      );
    }
    if (!plan || !activeDay) return <EmptyState />;

    const cards = [];
    meals.forEach((meal) => {
      const key = `${activeKey}-${normalizeDay(meal.mealType)}`;
      cards.push(
        <MealCard
          key={key}
          meal={toCardMeal(meal)}
          liked={likedMeals.has(key)}
          onToggleLike={() => toggleLike(key)}
          onReplace={() => handleReplace(meal)}
          replacing={replacingKey === key}
          replaceDisabled={replacingKey !== null}
        />,
      );
      // Bữa phụ mẫu nằm giữa bữa trưa và bữa tối.
      if (normalizeDay(meal.mealType) === "LUNCH") {
        cards.push(
          <MealCard
            key="snack"
            meal={{ ...mockSnack, label: mockSnack.meal }}
            liked={likedMeals.has("snack")}
            onToggleLike={() => toggleLike("snack")}
            onReplace={() => {}}
            replaceDisabled
            replaceHint="Bữa phụ sẽ được hỗ trợ sau"
          />,
        );
      }
    });

    return (
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <Reveal key={card.key} delay={index * 80}>
            {card}
          </Reveal>
        ))}
      </div>
    );
  };

  return (
    <section id="today-meals" className="scroll-mt-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink sm:text-2xl">Thực Đơn 4 Bữa {dayTitle} 🌱</h2>
          <p className="mt-1 text-sm text-subtle">Lên kế hoạch năng lượng từng bữa, cùng sống xanh mỗi ngày!</p>
        </div>

        {plan && (
          <div className="flex items-center gap-1 self-start sm:self-auto">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Thực đơn cũ hơn"
              title="Thực đơn cũ hơn"
              disabled={!olderPlan}
              onClick={() => olderPlan && onSelectPlan(olderPlan.id)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {days.map((day) => {
              const key = normalizeDay(day.day);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectDay(key)}
                  aria-pressed={key === activeKey}
                  aria-label={dayLabel(day).long}
                  className={cn(
                    "grid size-9 place-items-center rounded-full text-sm font-semibold transition",
                    key === activeKey ? "bg-brand text-brand-foreground" : "text-subtle hover:bg-surface hover:text-ink",
                  )}
                >
                  {dayLabel(day).short}
                </button>
              );
            })}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Thực đơn mới hơn"
              title="Thực đơn mới hơn"
              disabled={!newerPlan}
              onClick={() => newerPlan && onSelectPlan(newerPlan.id)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {plan && plans.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-subtle">
          <label htmlFor="meal-plan-select" className="font-medium">
            Thực đơn đang xem:
          </label>
          <select
            id="meal-plan-select"
            value={plan.id}
            onChange={(event) => onSelectPlan(Number(event.target.value))}
            className={selectClass}
          >
            {plans.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
                {formatDate(item.createdAt) ? ` (${formatDate(item.createdAt)})` : ""}
              </option>
            ))}
          </select>
          {plan.goal && <span className="line-clamp-1 text-xs">Mục tiêu: {plan.goal}</span>}
        </div>
      )}

      {renderBody()}
    </section>
  );
}

function MealSkeletons() {
  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true" aria-label="Đang tải thực đơn">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-80 animate-pulse rounded-2xl bg-card shadow-md" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl bg-card p-10 text-center shadow-md">
      <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand">
        <CalendarX2 className="size-6" />
      </span>
      <h3 className="text-base font-bold text-ink">Bạn chưa có thực đơn nào</h3>
      <p className="max-w-md text-sm text-subtle">
        Chọn nguyên liệu, đặt mục tiêu rồi nhờ Bé Bông Cải lên thực đơn 7 ngày cho bạn nhé.
      </p>
      <a
        href="#ai-suggestion"
        className="mt-1 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand/90"
      >
        <Sparkles className="size-4" />
        Lên thực đơn ngay
      </a>
    </div>
  );
}
