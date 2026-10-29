import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { searchRestaurants } from "@/features/restaurant-map/api/restaurantApi";
import { restaurantKeys } from "@/features/restaurant-map/queryKeys";

/** Tìm quán theo tên (GET /restaurants/search); `q` null thì không gọi. lat / lng để BE tính khoảng cách. */
export function useSearchRestaurants({ q, lat, lng, veganOnly = false }) {
  const query = useQuery({
    queryKey: restaurantKeys.search({ q, lat, lng, veganOnly }),
    queryFn: () => searchRestaurants({ q, lat, lng, veganOnly }),
    enabled: q != null,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  return { ...query, restaurants: query.data ?? [] };
}
