import AppFooter from "@/shared/components/AppFooter";
import AppHeader from "@/shared/components/AppHeader";
import TrendingVideoGrid from "@/features/video/components/TrendingVideoGrid";
import VideoChannelBar from "@/features/video/components/VideoChannelBar";
import VideoSubNav from "@/features/video/components/VideoSubNav";
import Reveal from "@/shared/components/Reveal";

// Trang video mặc định (route /videos). UI demo — danh sách kênh & video
// thịnh hành dùng dữ liệu tĩnh trong features/video/data/mockVideo.js.
export default function VideoHomeScreen() {
  return (
    <div className="min-h-dvh">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-6">
        <VideoSubNav />
        <Reveal>
          <VideoChannelBar />
        </Reveal>
        {/* TrendingVideoGrid tự có <Reveal> cho từng video. */}
        <TrendingVideoGrid />
      </main>

      <AppFooter />
    </div>
  );
}
