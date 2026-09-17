import { useAuthStore } from "@/features/auth/store/authStore";
import AdviceCard from "@/features/home/components/AdviceCard";
import AiMealSuggestion from "@/features/home/components/AiMealSuggestion";
import HeroBanner from "@/features/home/components/HeroBanner";
import HomeFooter from "@/features/home/components/HomeFooter";
import HomeHeader from "@/features/home/components/HomeHeader";
import MacroBalanceCard from "@/features/home/components/MacroBalanceCard";
import StatsGrid from "@/features/home/components/StatsGrid";
import TodayMeals from "@/features/home/components/TodayMeals";

// Trang chủ / thực đơn hôm nay. Hiện là UI demo với dữ liệu tĩnh trong
// features/home/data/mockHome.js — thay bằng dữ liệu thật khi BE sẵn sàng.
export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.fullName?.trim().split(" ").at(-1) || "Thuận";

  return (
    <div className="min-h-dvh">
      <HomeHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-6">
        <HeroBanner userName={firstName} />
        <StatsGrid />
        <AiMealSuggestion />
        <TodayMeals />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MacroBalanceCard />
          <AdviceCard />
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
