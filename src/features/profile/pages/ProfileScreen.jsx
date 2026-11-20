import AppHeader from "@/shared/components/AppHeader";
import Reveal from "@/shared/components/Reveal";
import { useProfile } from "@/features/profile/hooks/useProfile";

import ProfileBanner from "@/features/profile/components/ProfileBanner";
import DailyNutritionCard from "@/features/profile/components/DailyNutritionCard";
import FavoritesCard from "@/features/profile/components/FavoritesCard";
import GreenBadgesCard from "@/features/profile/components/GreenBadgesCard";
import CreatePostBox from "@/features/profile/components/CreatePostBox";
import RecipeFeedCard from "@/features/profile/components/RecipeFeedCard";
import BmiTrackerCard from "@/features/profile/components/BmiTrackerCard";

export default function ProfileScreen() {
  const { profile } = useProfile();

  return (
    <div className="min-h-dvh bg-canvas transition-colors duration-200">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Reveal>
          <ProfileBanner profile={profile} />
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Cột trái (4/12) */}
          <div className="space-y-5 lg:sticky lg:top-24 lg:col-span-4 lg:-mx-1 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:px-1 lg:pb-1">
            <Reveal><DailyNutritionCard /></Reveal>
            <Reveal><FavoritesCard /></Reveal>
            <Reveal><GreenBadgesCard /></Reveal>
          </div>

          {/* Cột phải (8/12) */}
          <div className="space-y-5 lg:col-span-8">
            <Reveal><CreatePostBox profile={profile} /></Reveal>
            <Reveal><BmiTrackerCard /></Reveal>
            <Reveal><RecipeFeedCard /></Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}
