import { test } from "node:test";
import assert from "node:assert/strict";

import {
  circleGeoJSON,
  MAX_RADIUS_KM,
  RADIUS_OPTIONS_KM,
  zoomForRadius,
} from "./mapConfig.js";

test("zoomForRadius: bán kính càng lớn thì zoom càng nhỏ", () => {
  assert.equal(zoomForRadius(1), 14.8);
  assert.equal(zoomForRadius(5), 12.5);
  assert.equal(zoomForRadius(10), 11.5);
  assert.ok(zoomForRadius(3) > zoomForRadius(5));
});

test("zoomForRadius: giá trị lạ không làm hỏng bản đồ", () => {
  assert.equal(zoomForRadius(0), 12);
  assert.equal(zoomForRadius(NaN), 12);
  assert.equal(zoomForRadius(0.01), 15);
});

test("các lựa chọn bán kính không vượt giới hạn 10 km của BE", () => {
  assert.ok(RADIUS_OPTIONS_KM.every((r) => r > 0 && r <= MAX_RADIUS_KM));
});

test("circleGeoJSON: vòng khép kín, điểm đông cách tâm đúng bán kính", () => {
  const center = { lat: 10.7725, lng: 106.698 };
  const ring = circleGeoJSON(center, 5, 64).geometry.coordinates[0];
  assert.equal(ring.length, 65);
  assert.deepEqual(ring[0], ring[64]);

  // ring[0] nằm thẳng hướng đông: cùng vĩ độ, lệch kinh độ ≈ 5 km.
  const [lng0, lat0] = ring[0];
  assert.equal(lat0, center.lat);
  const eastKm = (lng0 - center.lng) * 111.32 * Math.cos((center.lat * Math.PI) / 180);
  assert.ok(Math.abs(eastKm - 5) < 0.001);
});
