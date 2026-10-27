import { useState } from "react";

import { useAuthStore } from "@/features/auth/store/authStore";
import AdviceCard from "@/features/meal-planner/components/AdviceCard";
import AiMealSuggestion from "@/features/meal-planner/components/AiMealSuggestion";
import HeroBanner from "@/features/meal-planner/components/HeroBanner";
import AppFooter from "@/shared/components/AppFooter";
import AppHeader from "@/shared/components/AppHeader";
import MacroBalanceCard from "@/features/meal-planner/components/MacroBalanceCard";
import StatsGrid from "@/features/meal-planner/components/StatsGrid";
import TodayMeals from "@/features/meal-planner/components/TodayMeals";
import { useDiary } from "@/features/meal-planner/hooks/useDiary";
import { useMealPlans } from "@/features/meal-planner/hooks/useMealPlans";
import {
  dayKeyOf,
  dayLabel,
  isFutureDate,
  normalizeDay,
  planDayDate,
  sortedDays,
  toDateKey,
} from "@/features/meal-planner/utils/mealPlan";
import Reveal from "@/shared/components/Reveal";

const EMPTY_PLANS = [];

export default function MealPlannerScreen() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.fullName?.trim().split(" ").at(-2);
  const secondName = user?.fullName?.trim().split(" ").at(-1);

  const { data, isPending, error, refetch } = useMealPlans();
  const plans = data ?? EMPTY_PLANS;

  // Mặc định xem thực đơn mới nhất và ngày hôm nay (nếu thực đơn có ngày đó).
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedDayKey, setSelectedDayKey] = useState(null);

  const plan = plans.find((item) => item.id === selectedPlanId) ?? plans[0] ?? null;
  const days = sortedDays(plan);
  const activeDay =
    days.find((day) => normalizeDay(day.day) === selectedDayKey) ??
    days.find((day) => normalizeDay(day.day) === dayKeyOf()) ??
    days[0] ??
    null;

  // Nhật ký theo ngày cụ thể của ngày đang xem; không có thực đơn thì xem nhật ký hôm nay.
  const diaryDay = (plan && activeDay ? planDayDate(plan, activeDay.day) : null) ?? new Date();
  const diaryDate = toDateKey(diaryDay);
  const isFutureDay = isFutureDate(diaryDay);
  const { data: diary } = useDiary(diaryDate);

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    setSelectedDayKey(null);
  };

  const handleCreated = (created) => {
    handleSelectPlan(created.id);
    document.getElementById("today-meals")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-dvh">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 py-8">
        <HeroBanner userName={firstName + " " + secondName} />
        {/* StatsGrid và TodayMeals tự có <Reveal> cho từng thẻ nên không bọc thêm ở đây. */}
        <StatsGrid
          diary={diary}
          diaryDate={diaryDate}
          isFutureDay={isFutureDay}
          dayTotals={activeDay?.nutritionTotals ?? null}
          target={plan?.plan?.constraints?.dailyNutritionTarget ?? null}
          dayLong={activeDay ? dayLabel(activeDay).long : undefined}
        />
        <Reveal>
          <AiMealSuggestion onCreated={handleCreated} />
        </Reveal>
        <TodayMeals
          plans={plans}
          plan={plan}
          days={days}
          activeDay={activeDay}
          isLoading={isPending}
          error={data ? null : error}
          onRetry={refetch}
          onSelectPlan={handleSelectPlan}
          onSelectDay={setSelectedDayKey}
          diary={diary}
          diaryDate={diaryDate}
          isFutureDay={isFutureDay}
        />

        <Reveal>
          <section id="macro-balance" className="grid scroll-mt-28 grid-cols-1 gap-6 lg:grid-cols-2">
            <MacroBalanceCard totals={activeDay?.nutritionTotals ?? null} />
            <AdviceCard />
          </section>
        </Reveal>
      </main>

      <AppFooter />
    </div>
  );
}
