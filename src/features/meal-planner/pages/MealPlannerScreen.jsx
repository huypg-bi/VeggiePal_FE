import { useAuthStore } from "@/features/auth/store/authStore";
import AdviceCard from "@/features/meal-planner/components/AdviceCard";
import AiMealSuggestion from "@/features/meal-planner/components/AiMealSuggestion";
import HeroBanner from "@/features/meal-planner/components/HeroBanner";
import AppFooter from "@/shared/components/AppFooter";
import AppHeader from "@/shared/components/AppHeader";
import MacroBalanceCard from "@/features/meal-planner/components/MacroBalanceCard";
import StatsGrid from "@/features/meal-planner/components/StatsGrid";
import TodayMeals from "@/features/meal-planner/components/TodayMeals";
import Reveal from "@/shared/components/Reveal";

// Trang chủ / thực đơn hôm nay. Hiện là UI demo với dữ liệu tĩnh trong
// features/meal-planner/data/mockMealPlanner.js — thay bằng dữ liệu thật khi BE sẵn sàng.
export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.fullName?.trim().split(" ").at(-2);
  const secondName = user?.fullName?.trim().split(" ").at(-1);

  return (
    <div className="min-h-dvh">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 py-8">
        <HeroBanner userName={firstName + " " + secondName} />
        {/* StatsGrid và TodayMeals tự có <Reveal> cho từng thẻ nên không bọc thêm ở đây. */}
        <StatsGrid />
        <Reveal>
          <AiMealSuggestion />
        </Reveal>
        <TodayMeals />

        <Reveal>
          <section id="macro-balance" className="grid scroll-mt-28 grid-cols-1 gap-6 lg:grid-cols-2">
            <MacroBalanceCard />
            <AdviceCard />
          </section>
        </Reveal>
      </main>

      <AppFooter />
    </div>
  );
}
