import HomeFooter from "@/features/home/components/HomeFooter";
import HomeHeader from "@/features/home/components/HomeHeader";
import AiSummaryCard from "@/features/video/components/AiSummaryCard";
import CommentsHeader from "@/features/video/components/CommentsHeader";
import NutritionFactsCard from "@/features/video/components/NutritionFactsCard";
import SuggestedVideoList from "@/features/video/components/SuggestedVideoList";
import VideoMetaHeader from "@/features/video/components/VideoMetaHeader";
import VideoPlayerFrame from "@/features/video/components/VideoPlayerFrame";

// Trang xem video. UI demo với dữ liệu tĩnh trong
// features/video/data/mockVideo.js — khung phát video đang để trống,
// chờ BE cung cấp nguồn video thật.
export default function VideoWatchScreen() {
  return (
    <div className="min-h-dvh">
      <HomeHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <VideoPlayerFrame />
            <VideoMetaHeader />
            <AiSummaryCard />
            <CommentsHeader />
          </div>

          <div className="flex flex-col gap-6">
            <NutritionFactsCard />
            <SuggestedVideoList />
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
