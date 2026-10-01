import { useParams } from "react-router-dom";

import HomeFooter from "@/features/meal-planner/components/HomeFooter";
import HomeHeader from "@/features/meal-planner/components/HomeHeader";
import AiSummaryCard from "@/features/video/components/AiSummaryCard";
import CommentsHeader from "@/features/video/components/CommentsHeader";
import NutritionFactsCard from "@/features/video/components/NutritionFactsCard";
import SuggestedVideoList from "@/features/video/components/SuggestedVideoList";
import VideoMetaHeader from "@/features/video/components/VideoMetaHeader";
import VideoPlayerFrame from "@/features/video/components/VideoPlayerFrame";
import Reveal from "@/shared/components/Reveal";

// Trang xem video. UI demo với dữ liệu tĩnh trong
// features/video/data/mockVideo.js — khung phát video đang để trống,
// chờ BE cung cấp nguồn video thật.
export default function VideoWatchScreen() {
  const { videoId } = useParams();

  return (
    <div className="min-h-dvh">
      <HomeHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <VideoPlayerFrame />
            <Reveal>
              <VideoMetaHeader />
            </Reveal>
            <Reveal>
              <AiSummaryCard videoId={videoId} />
            </Reveal>
            <Reveal>
              <CommentsHeader />
            </Reveal>
          </div>

          <div className="flex flex-col gap-6">
            <Reveal>
              <NutritionFactsCard />
            </Reveal>
            <Reveal>
              <SuggestedVideoList />
            </Reveal>
          </div>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}
