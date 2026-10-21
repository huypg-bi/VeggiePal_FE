import { useState } from "react";
import { CalendarX2, ChevronLeft, ChevronRight, Heart, Loader2, Sparkles, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import EditMealDialog from "@/features/meal-planner/components/EditMealDialog";
import HealthUpdateButton from "@/features/meal-planner/components/HealthUpdateButton";
import MealCard from "@/features/meal-planner/components/MealCard";
import PlanVersionsButton from "@/features/meal-planner/components/PlanVersionsButton";
import { useDayRecipes } from "@/features/meal-planner/hooks/useDayRecipes";
import { useReplaceMeal, useSetPlanFavorite } from "@/features/meal-planner/hooks/useMealPlanMutations";
import {
  dayKeyOf,
  dayLabel,
  dayTargetDeviations,
  formatDayMonth,
  isSameDate,
  mealLabel,
  mealTime,
  normalizeDay,
  planDayDate,
  sortedMeals,
  toRounded,
} from "@/features/meal-planner/utils/mealPlan";
import { cn } from "@/lib/utils";
import Reveal from "@/shared/components/Reveal";
import SelectField from "@/shared/components/SelectField";

// Icon trái tim đã tô đỏ dùng làm `icon` của option trong SelectField (nhận className từ SelectField).
function FavoriteHeart({ className }) {
  return <Heart className={cn(className, "fill-danger text-danger")} />;
}

/**
 * Thực đơn theo ngày của thực đơn đang xem.
 * - plans / plan: các thực đơn đã lưu (mới nhất trước) và cái đang xem.
 * - days: các ngày của thực đơn đang xem, đã sắp T2 -> CN; activeDay: ngày đang chọn.
 * Thực đơn AI chỉ có 3 bữa sáng / trưa / tối (BE không có bữa phụ).
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
  const [replacingKey, setReplacingKey] = useState(null);
  // Bữa đang tự chỉnh bằng hộp thoại (meal của plan), null khi không mở.
  const [editingMeal, setEditingMeal] = useState(null);
  const replaceMeal = useReplaceMeal();
  const setFavorite = useSetPlanFavorite();

  const meals = sortedMeals(activeDay);
  const recipes = useDayRecipes(meals.map((meal) => meal.recipeId));

  const planIndex = plan ? plans.findIndex((item) => item.id === plan.id) : -1;
  const olderPlan = planIndex >= 0 ? plans[planIndex + 1] : undefined;
  const newerPlan = planIndex > 0 ? plans[planIndex - 1] : undefined;
  // Thực đơn yêu thích có trái tim (cùng icon với nút "Yêu thích") trước tên trong danh sách chọn.
  const planOptions = plans.map((item) => ({
    value: item.id,
    label: item.name,
    icon: item.isFavorite ? FavoriteHeart : undefined,
  }));

  const activeKey = normalizeDay(activeDay?.day);
  // Ngày cụ thể của thứ đang chọn (theo tuần chứa ngày tạo thực đơn). "Hôm Nay" chỉ khi đúng là hôm nay,
  // tránh gọi nhầm thứ Năm của một thực đơn tuần trước. Thiếu ngày thì so theo tên thứ như trước.
  const activeDate = activeDay ? planDayDate(plan, activeDay.day) : null;
  const isToday = activeDate ? isSameDate(activeDate, new Date()) : activeKey === dayKeyOf();
  const dayName = activeDay ? (isToday ? "Hôm Nay" : dayLabel(activeDay).long) : "Hôm Nay";
  const dayTitle = activeDate ? `${dayName} (${formatDayMonth(activeDate)})` : dayName;
  const missedTargets = dayTargetDeviations(activeDay);

  // Yêu thích theo cả thực đơn (BE: POST/DELETE /ai/meal-plans/:id/favorite), không theo từng món.
  const handleToggleFavorite = async () => {
    const next = !plan.isFavorite;
    try {
      await setFavorite.mutateAsync({ planId: plan.id, favorite: next });
      toast.success(next ? "Đã thêm thực đơn vào yêu thích" : "Đã bỏ thực đơn khỏi yêu thích");
    } catch (err) {
      toast.error(err.message);
    }
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

    const cards = meals.map((meal) => {
      const key = `${activeKey}-${normalizeDay(meal.mealType)}`;
      return (
        <MealCard
          key={key}
          meal={toCardMeal(meal)}
          onReplace={() => handleReplace(meal)}
          onEdit={() => setEditingMeal(meal)}
          replacing={replacingKey === key}
          replaceDisabled={replacingKey !== null}
        />
      );
    });

    return (
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
          <h2 className="text-xl font-bold text-ink sm:text-2xl">Thực Đơn 3 Bữa {dayTitle} 🌱</h2>
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
              const missed = dayTargetDeviations(day).length > 0;
              const date = planDayDate(plan, day.day);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectDay(key)}
                  aria-pressed={key === activeKey}
                  aria-label={missed ? `${dayLabel(day).long} (chưa đạt mục tiêu dinh dưỡng)` : dayLabel(day).long}
                  title={date ? `${dayLabel(day).long} (${formatDayMonth(date)})` : undefined}
                  className={cn(
                    "relative grid size-9 place-items-center rounded-full text-sm font-semibold transition",
                    key === activeKey ? "bg-brand text-brand-foreground" : "text-subtle hover:bg-surface hover:text-ink",
                  )}
                >
                  {dayLabel(day).short}
                  {missed && <span className="absolute right-1 top-1 size-2 rounded-full bg-warning" aria-hidden="true" />}
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
          <SelectField
            id="meal-plan-select"
            options={planOptions}
            value={plan.id}
            onValueChange={onSelectPlan}
            className="h-9 max-w-full px-3"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={Boolean(plan.isFavorite)}
            disabled={setFavorite.isPending}
            onClick={handleToggleFavorite}
          >
            {setFavorite.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Heart className={cn("size-4", plan.isFavorite && "fill-danger text-danger")} />
            )}
            {plan.isFavorite ? "Đã yêu thích" : "Yêu thích"}
          </Button>
          <HealthUpdateButton plan={plan} />
          <PlanVersionsButton plan={plan} />
          {plan.goal &&<span className="line-clamp-1 text-xs">Mục tiêu: {plan.goal}</span>}
        </div>
      )}

      {missedTargets.length > 0 && (
        <div
          role="status"
          className="mt-4 flex items-start gap-3 rounded-2xl bg-warning/10 px-4 py-3 text-sm text-body ring-1 ring-warning/30"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
          <div>
            <p className="font-semibold text-ink">Ngày này chưa đạt mục tiêu dinh dưỡng bạn đặt</p>
            <ul className="mt-1 list-inside list-disc text-subtle">
              {missedTargets.map((item) => (
                <li key={item.key}>
                  {item.label}: {item.actual.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} {item.unit}
                  {item.range && ` (mục tiêu ${item.range})`}
                </li>
              ))}
            </ul>
            <p className="mt-1 text-xs text-subtle">
              Các món hiện có chưa ghép được ngày này đúng khoảng đó. Bạn có thể đổi món hoặc nới khoảng mục tiêu rồi lên
              thực đơn lại.
            </p>
          </div>
        </div>
      )}

      {renderBody()}

      {editingMeal && plan && activeDay && (
        <EditMealDialog
          // key theo ngày + bữa để hộp thoại dựng lại với state mới mỗi lần mở.
          key={`${plan.id}-${activeKey}-${normalizeDay(editingMeal.mealType)}`}
          plan={plan}
          day={activeDay}
          meal={editingMeal}
          current={{
            title: toCardMeal(editingMeal).title,
            image: toCardMeal(editingMeal).image,
          }}
          usedRecipeIds={meals.filter((m) => m !== editingMeal).map((m) => m.recipeId)}
          onClose={() => setEditingMeal(null)}
        />
      )}
    </section>
  );
}

function MealSkeletons() {
  return (
    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Đang tải thực đơn">
      {Array.from({ length: 3 }, (_, index) => (
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
