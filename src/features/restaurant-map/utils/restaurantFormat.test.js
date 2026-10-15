import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildDirectionsUrl,
  buildTelUrl,
  filterRestaurants,
  formatDistance,
  formatRating,
  normalizeText,
  SORT_NEAREST,
  SORT_RATING,
  sortRestaurants,
  toGeoJSON,
  veganLabel,
} from "./restaurantFormat.js";

test("formatDistance: dưới 1 km hiện mét, từ 1 km hiện km một chữ số thập phân", () => {
  assert.equal(formatDistance(0.53), "530 m");
  assert.equal(formatDistance(0.65), "650 m");
  assert.equal(formatDistance(0), "0 m");
  assert.equal(formatDistance(1), "1 km");
  assert.equal(formatDistance(1.14), "1.1 km");
  assert.equal(formatDistance(7.14), "7.1 km");
});

test("formatDistance: sát 1 km không hiện '1000 m'", () => {
  assert.equal(formatDistance(0.9996), "1 km");
});

test("formatDistance: giá trị không hợp lệ trả chuỗi rỗng", () => {
  assert.equal(formatDistance(undefined), "");
  assert.equal(formatDistance(null), "");
  assert.equal(formatDistance(NaN), "");
  assert.equal(formatDistance(-1), "");
});

test("formatRating và veganLabel", () => {
  assert.equal(formatRating(4.7), "4.7");
  assert.equal(formatRating(5), "5.0");
  assert.equal(formatRating(null), "—");
  assert.equal(veganLabel(true), "Thuần chay 100%");
  assert.equal(veganLabel(false), "Quán chay");
});

test("normalizeText bỏ dấu tiếng Việt và đ", () => {
  assert.equal(normalizeText("  Phở Chay Đặc Biệt "), "pho chay dac biet");
  assert.equal(normalizeText(null), "");
});

test("filterRestaurants lọc theo tên hoặc địa chỉ, không phân biệt dấu", () => {
  const list = [
    { id: 1, name: "Phương Mai Chay Quán", address: "Võ Thị Sáu, Quận 1" },
    { id: 2, name: "Shamballa", address: "Lý Tự Trọng, Quận 1" },
    { id: 3, name: "Mộc", address: null },
  ];
  assert.deepEqual(filterRestaurants(list, "phuong mai").map((r) => r.id), [1]);
  assert.deepEqual(filterRestaurants(list, "LÝ TỰ").map((r) => r.id), [2]);
  assert.deepEqual(filterRestaurants(list, "moc").map((r) => r.id), [3]);
  assert.deepEqual(filterRestaurants(list, "xyz"), []);
  assert.equal(filterRestaurants(list, "  "), list);
});

test("sortRestaurants: nearest giữ thứ tự, rating xếp giảm dần và không đổi mảng gốc", () => {
  const list = [
    { id: 1, rating: 4.2, distanceKm: 0.5 },
    { id: 2, rating: 4.9, distanceKm: 2 },
    { id: 3, rating: 4.9, distanceKm: 1 },
    { id: 4, rating: null, distanceKm: 0.1 },
  ];
  assert.deepEqual(sortRestaurants(list, SORT_NEAREST).map((r) => r.id), [1, 2, 3, 4]);
  assert.deepEqual(sortRestaurants(list, SORT_RATING).map((r) => r.id), [3, 2, 1, 4]);
  assert.deepEqual(list.map((r) => r.id), [1, 2, 3, 4]);
});

test("buildDirectionsUrl và buildTelUrl", () => {
  assert.equal(
    buildDirectionsUrl({ latitude: 10.7768, longitude: 106.7001 }),
    "https://www.google.com/maps/dir/?api=1&destination=10.7768,106.7001",
  );
  assert.equal(buildTelUrl("028 7309 3899"), "tel:02873093899");
  assert.equal(buildTelUrl("+84 917 876 788"), "tel:+84917876788");
  assert.equal(buildTelUrl(""), null);
  assert.equal(buildTelUrl(null), null);
});

test("toGeoJSON đặt tọa độ theo [kinh độ, vĩ độ]", () => {
  const geo = toGeoJSON([
    { id: 2, name: "Shamballa", latitude: 10.7768, longitude: 106.7001 },
  ]);
  assert.equal(geo.type, "FeatureCollection");
  assert.equal(geo.features.length, 1);
  assert.equal(geo.features[0].id, 2);
  assert.deepEqual(geo.features[0].geometry.coordinates, [106.7001, 10.7768]);
  assert.equal(geo.features[0].properties.name, "Shamballa");
  assert.deepEqual(toGeoJSON([]).features, []);
});
