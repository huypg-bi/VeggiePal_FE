import HomeFooter from "@/features/home/components/HomeFooter";
import HomeHeader from "@/features/home/components/HomeHeader";
import MapBanner from "@/features/restaurant-map/components/MapBanner";
import MapPanel from "@/features/restaurant-map/components/MapPanel";
import MapSearchBar from "@/features/restaurant-map/components/MapSearchBar";
import RestaurantList from "@/features/restaurant-map/components/RestaurantList";

// Trang Bản đồ quán chay. UI demo với dữ liệu tĩnh trong
// features/restaurant-map/data/mockRestaurantMap.js — khung bản đồ bên phải
// đang để trống, chờ BE cung cấp API bản đồ thật.
export default function RestaurantMapScreen() {
  return (
    <div className="min-h-dvh bg-[#FAFBF8]">
      <HomeHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-6">
        <MapBanner />
        <MapSearchBar />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RestaurantList />
          <MapPanel />
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
