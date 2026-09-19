import HomeFooter from "@/features/home/components/HomeFooter";
import HomeHeader from "@/features/home/components/HomeHeader";
import TrendingVideoGrid from "@/features/video/components/TrendingVideoGrid";
import VideoChannelBar from "@/features/video/components/VideoChannelBar";
import VideoSubNav from "@/features/video/components/VideoSubNav";

// Trang video mặc định (route /videos). UI demo — danh sách kênh & video
// thịnh hành dùng dữ liệu tĩnh trong features/video/data/mockVideo.js.
export default function VideoHomeScreen() {
  return (
    <div className="min-h-dvh">
      <HomeHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-6">
        <VideoSubNav />
        <VideoChannelBar />
        <TrendingVideoGrid />
      </main>

      <HomeFooter />
    </div>
  );
}
