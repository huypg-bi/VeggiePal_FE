const round = (n) => Math.round(n * 1e4) / 1e4;

export const restaurantKeys = {
  all: ["restaurants"],
  nearby: ({ lat, lng, radiusKm, veganOnly }) => [
    "restaurants",
    "nearby",
    { lat: round(lat), lng: round(lng), radiusKm, veganOnly },
  ],
};
