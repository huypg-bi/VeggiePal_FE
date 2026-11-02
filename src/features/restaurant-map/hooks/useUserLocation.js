import { useCallback, useEffect, useState } from "react";

import { DEFAULT_LOCATION } from "@/features/restaurant-map/utils/mapConfig";

const GEO_OPTIONS = { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 };

const isSupported = () =>
  typeof navigator !== "undefined" && "geolocation" in navigator;

function readPosition(update) {
  navigator.geolocation.getCurrentPosition(
    (pos) =>
      update({
        status: "granted",
        position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
      }),
    (err) =>
      update((prev) => ({
        status: err.code === 1 ? "denied" : "unavailable",
        position: prev.position,
      })),
    GEO_OPTIONS,
  );
}

export function useUserLocation() {
  const [state, setState] = useState(() => ({
    status: isSupported() ? "loading" : "unsupported",
    position: null,
  }));

  useEffect(() => {
    if (isSupported()) readPosition(setState);
  }, []);

  const request = useCallback(() => {
    if (!isSupported()) return;
    setState((prev) => ({ ...prev, status: "loading" }));
    readPosition(setState);
  }, []);

  // Bỏ vị trí thật để xem quán quanh tâm mặc định (người dùng đang ở xa khu vực có quán).
  const resetToDefault = useCallback(
    () => setState((prev) => ({ ...prev, position: null })),
    [],
  );

  return {
    location: state.position ?? DEFAULT_LOCATION,
    isDefaultLocation: state.position == null,
    status: state.status,
    request,
    resetToDefault,
  };
}
