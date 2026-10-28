// Cấu hình bản đồ quán chay. File thuần (không import "@/") để test bằng node:test.

// Chợ Bến Thành, TP.HCM — tâm dùng khi người dùng từ chối hoặc không có định vị.
export const DEFAULT_LOCATION = { lat: 10.7725, lng: 106.698 };

// BE giới hạn bán kính tối đa 10 km.
export const RADIUS_OPTIONS_KM = [1, 3, 5, 10];
export const DEFAULT_RADIUS_KM = 5;
export const MAX_RADIUS_KM = 10;

export const MARKER_COLORS = {
  light: { brand: "#1d9d5a", text: "#ffffff", stroke: "#ffffff" },
  dark: { brand: "#34c37c", text: "#06170e", stroke: "#10231a" },
};

export function zoomForRadius(radiusKm) {
  if (!(radiusKm > 0)) return 12;
  const zoom = 14.8 - Math.log2(radiusKm);
  return Math.round(Math.min(15, Math.max(9, zoom)) * 10) / 10;
}

export function circleGeoJSON({ lat, lng }, radiusKm, steps = 64) {
  const dLat = radiusKm / 111.32;
  const dLng = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const ring = [];
  for (let i = 0; i < steps; i += 1) {
    const angle = (2 * Math.PI * i) / steps;
    ring.push([lng + dLng * Math.cos(angle), lat + dLat * Math.sin(angle)]);
  }
  ring.push(ring[0]);
  return {
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [ring] },
    properties: {},
  };
}
