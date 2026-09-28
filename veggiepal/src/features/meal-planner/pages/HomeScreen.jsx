import { useAuthStore } from "@/features/auth/store/authStore";
import AdviceCard from "@/features/meal-planner/components/AdviceCard";
import AiMealSuggestion from "@/features/meal-planner/components/AiMealSuggestion";
import HeroBanner from "@/features/meal-planner/components/HeroBanner";
import HomeFooter from "@/features/meal-planner/components/HomeFooter";
import HomeHeader from "@/features/meal-planner/components/HomeHeader";
import MacroBalanceCard from "@/features/meal-planner/components/MacroBalanceCard";
import StatsGrid from "@/features/meal-planner/components/StatsGrid";
import TodayMeals from "@/features/meal-planner/components/TodayMeals";
import Reveal from "@/shared/components/Reveal";

// Trang chủ / thực đơn hôm nay. Hiện là UI demo với dữ liệu tĩnh trong
// features/home/data/mockHome.js — thay bằng dữ liệu thật khi BE sẵn sàng.
export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.fullName?.trim().split(" ").at(-2);
  const secondName = user?.fullName?.trim().split(" ").at(-1);

  return (
    <div className="min-h-dvh">
      <HomeHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 py-8">
        <HeroBanner userName={firstName + " " + secondName} />
        <Reveal>
          <StatsGrid />
        </Reveal>
        <Reveal>
          <AiMealSuggestion />
        </Reveal>
        <Reveal>
          <TodayMeals />
        </Reveal>

        <Reveal>
          <section id="macro-balance" className="grid scroll-mt-28 grid-cols-1 gap-6 lg:grid-cols-2">
            <MacroBalanceCard />
            <AdviceCard />
          </section>
        </Reveal>
      </main>

      <HomeFooter />
    </div>
  );
}
