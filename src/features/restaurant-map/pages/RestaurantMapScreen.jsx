import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, Utensils } from "lucide-react";
import { toast } from "sonner";

import AppHeader from "@/shared/components/AppHeader";
import MapBanner from "@/features/restaurant-map/components/MapBanner";
import MapFrame from "@/features/restaurant-map/components/MapFrame";
import MapSearchBar from "@/features/restaurant-map/components/MapSearchBar";
import RestaurantList from "@/features/restaurant-map/components/RestaurantList";
import { useNearbyRestaurants } from "@/features/restaurant-map/hooks/useNearbyRestaurants";
import { useSearchRestaurants } from "@/features/restaurant-map/hooks/useSearchRestaurants";
import { useUserLocation } from "@/features/restaurant-map/hooks/useUserLocation";
import { DEFAULT_RADIUS_KM } from "@/features/restaurant-map/utils/mapConfig";
import {
  SORT_NEAREST,
  filterRestaurants,
  getSearchTerm,
  sortRestaurants,
} from "@/features/restaurant-map/utils/restaurantFormat";
import Reveal from "@/shared/components/Reveal";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { cn } from "@/lib/utils";

// Mapbox nặng nên chỉ tải khi vào trang này, không làm phình bundle của các trang khác.
const MapPanel = lazy(
  () => import("@/features/restaurant-map/components/MapPanel"),
);

// Chờ người dùng gõ xong rồi mới gọi BE tìm theo tên.
const SEARCH_DEBOUNCE_MS = 400;

const LOCATION_FAILED_MESSAGES = {
  denied:
    "Bạn chưa cho phép truy cập vị trí. Đang dùng vị trí mặc định (Quận 1, TP.HCM).",
  unavailable:
    "Không xác định được vị trí của bạn. Đang dùng vị trí mặc định (Quận 1, TP.HCM).",
  unsupported:
    "Trình duyệt không hỗ trợ định vị. Đang dùng vị trí mặc định (Quận 1, TP.HCM).",
};

export default function RestaurantMapScreen() {
  const { location, isDefaultLocation, status, request, resetToDefault } =
    useUserLocation();
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState(SORT_NEAREST);
  const [selectedId, setSelectedId] = useState(null);
  const [mobileView, setMobileView] = useState("list");

  const nearby = useNearbyRestaurants({
    lat: location.lat,
    lng: location.lng,
    radiusKm,
  });

  // Từ khóa đủ 2 ký tự thì BE tìm theo tên trên toàn bản đồ (tối đa 20 quán, không theo bán kính); ngắn hơn thì chỉ lọc danh sách quanh đây.
  const debouncedKeyword = useDebouncedValue(keyword, SEARCH_DEBOUNCE_MS);
  const searchTerm =
    getSearchTerm(keyword) === null ? null : getSearchTerm(debouncedKeyword);
  const search = useSearchRestaurants({
    q: searchTerm,
    lat: location.lat,
    lng: location.lng,
  });
  const { isLoading, isError, error, refetch, isFetching } = searchTerm
    ? search
    : nearby;

  const visible = useMemo(
    () =>
      sortRestaurants(
        searchTerm
          ? search.restaurants
          : filterRestaurants(nearby.restaurants, keyword),
        sort,
      ),
    [searchTerm, search.restaurants, nearby.restaurants, keyword, sort],
  );

  // Mỗi lần kết quả hiển thị đổi (vị trí, bán kính, từ khóa, cách xếp) danh sách quay về 10 quán đầu.
  const resetKey = `${location.lat},${location.lng},${radiusKm},${keyword},${sort}`;

  const handleSelect = (id) => {
    setSelectedId(id);
    // Khi chọn quán trên màn hình hẹp, tự chuyển sang xem bản đồ để định vị nhanh.
    if (id) setMobileView("map");
  };

  useEffect(() => {
    const message = LOCATION_FAILED_MESSAGES[status];
    if (message) toast.info(message, { id: "restaurant-map-location" });
  }, [status]);

  return (
    <div className="min-h-dvh">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 sm:px-6 py-6">
        <MapBanner />
        <Reveal>
          <MapSearchBar keyword={keyword} onKeywordChange={setKeyword} />
        </Reveal>

        {/* Bộ chuyển đổi chế độ xem danh sách / bản đồ trên màn hình dưới lg (< 1024px). */}
        <div className="flex items-center justify-center lg:hidden">
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setMobileView("list")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition",
                mobileView === "list"
                  ? "bg-brand text-brand-foreground shadow-xs"
                  : "text-subtle hover:text-ink"
              )}
            >
              <Utensils className="size-3.5" />
              Danh sách ({visible.length})
            </button>
            <button
              type="button"
              onClick={() => setMobileView("map")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition",
                mobileView === "map"
                  ? "bg-brand text-brand-foreground shadow-xs"
                  : "text-subtle hover:text-ink"
              )}
            >
              <MapPin className="size-3.5" />
              Bản đồ
            </button>
          </div>
        </div>

        {/* RestaurantList tự có <Reveal> cho từng quán. Không bọc MapPanel vì nó dùng sticky. */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={cn("min-w-0", mobileView === "map" && "hidden lg:block")}>
            <RestaurantList
              restaurants={visible}
              isLoading={isLoading}
              isRefreshing={isFetching && !isLoading}
              errorMessage={isError ? error.message : null}
              onRetry={refetch}
              resetKey={resetKey}
              radiusKm={radiusKm}
              onRadiusChange={setRadiusKm}
              sort={sort}
              onSortChange={setSort}
              selectedId={selectedId}
              onSelect={handleSelect}
              isDefaultLocation={isDefaultLocation}
              onResetLocation={resetToDefault}
              hasKeyword={keyword.trim() !== ""}
              searchTerm={searchTerm}
            />
          </div>

          <div className={cn("min-w-0", mobileView === "list" && "hidden lg:block")}>
            <Suspense
              fallback={
                <MapFrame>
                  <div className="absolute inset-0 grid place-items-center">
                    <Loader2 className="size-6 animate-spin text-brand" />
                  </div>
                </MapFrame>
              }
            >
              <MapPanel
                restaurants={visible}
                location={location}
                isDefaultLocation={isDefaultLocation}
                radiusKm={radiusKm}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onLocate={request}
                locating={status === "loading"}
                searchMode={searchTerm !== null}
              />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}
