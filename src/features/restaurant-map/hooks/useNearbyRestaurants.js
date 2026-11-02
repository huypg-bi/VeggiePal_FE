import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getNearbyRestaurants } from "@/features/restaurant-map/api/restaurantApi";
import { restaurantKeys } from "@/features/restaurant-map/queryKeys";

export function useNearbyRestaurants({ lat, lng, radiusKm, veganOnly = false }) {
  const query = useQuery({
    queryKey: restaurantKeys.nearby({ lat, lng, radiusKm, veganOnly }),
    queryFn: () => getNearbyRestaurants({ lat, lng, radiusKm, veganOnly }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  return { ...query, restaurants: query.data ?? [] };
}
