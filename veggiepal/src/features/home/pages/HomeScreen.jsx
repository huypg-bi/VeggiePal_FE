import heroVideo from "@/assets/video/video_homepage.mp4";
import HomeHeader from "@/features/meal-planner/components/HomeHeader";
import LandingHero from "@/features/home/components/LandingHero";
import TrendingRecipesSection from "@/features/home/components/TrendingRecipesSection";
import NutritionLookupSection from "@/features/home/components/NutritionLookupSection";

export default function HomeScreen() {
  return (
    <div className="relative bg-background">
      <div className="fixed inset-x-0 top-3 z-50">
        <HomeHeader />
      </div>

      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div aria-hidden className="absolute inset-0 bg-black/40" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-black/70 sm:h-28"
        />

        <div className="relative z-10 h-full font-landing-sans">
          <LandingHero />
        </div>
      </section>

      <TrendingRecipesSection />
      <NutritionLookupSection />
    </div>
  );
}
