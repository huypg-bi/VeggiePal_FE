import { useState } from "react";

import { usePaymentRevenue } from "@/features/admin/payments/hooks/useAdminPayments";
import {
  GROUP_OPTIONS,
  formatNumber,
  formatPeriod,
  formatVnd,
} from "@/features/admin/payments/utils/adminPaymentFormat";
import { cn } from "@/lib/utils";

const SVG_WIDTH = 500;
const SVG_HEIGHT = 120;
const PADDING_X = 24;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 22;

// Tính toán tọa độ và đường cong SVG cho biểu đồ theo chuẩn biểu đồ BMI (BmiTrackerCard).
function calcRevenueChartData(points) {
  if (!points || points.length === 0) return null;

  if (points.length === 1) {
    const p = points[0];
    const y = PADDING_TOP + 15;
    const chartPoints = [
      {
        ...p,
        x: SVG_WIDTH / 2,
        y,
        isLast: true,
      },
    ];
    const linePath = `M ${PADDING_X} ${y} L ${SVG_WIDTH - PADDING_X} ${y}`;
    const areaPath = `${linePath} L ${SVG_WIDTH - PADDING_X} ${SVG_HEIGHT} L ${PADDING_X} ${SVG_HEIGHT} Z`;
    return { chartPoints, linePath, areaPath };
  }

  const values = points.map((p) => Number(p.revenue) || 0);
  const minVal = 0;
  const maxVal = Math.max(...values, 1) * 1.15; // 15% khoảng đệm trên đỉnh
  const usableHeight = SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const chartPoints = points.map((p, i) => {
    const x = PADDING_X + (i * (SVG_WIDTH - PADDING_X * 2)) / (points.length - 1);
    const val = Number(p.revenue) || 0;
    const y = PADDING_TOP + ((maxVal - val) / (maxVal - minVal)) * usableHeight;
    return {
      ...p,
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
      isLast: i === points.length - 1,
    };
  });

  const linePath = chartPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${SVG_HEIGHT} L ${chartPoints[0].x} ${SVG_HEIGHT} Z`;

  return { chartPoints, linePath, areaPath };
}

// Doanh thu theo ngày/tháng, vẽ dạng biểu đồ Area & Line tương tự biểu đồ BMI của User.
export default function RevenueChartSection({ filters, enabled }) {
  const [groupBy, setGroupBy] = useState("DAY");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { data, isPending, isError, error } = usePaymentRevenue(filters, groupBy, { enabled });

  const points = data?.points ?? [];
  const chartData = calcRevenueChartData(points);

  return (
    <section aria-label="Doanh thu" className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-heading text-xl font-bold text-ink">Doanh thu</h2>
          {data && (
            <p className="mt-1 text-xs text-subtle">
              Tổng <span className="font-semibold text-ink">{formatVnd(data.totalRevenue)}</span> từ{" "}
              <span className="font-semibold text-ink">{formatNumber(data.paidTransactions)}</span> đơn đã thanh toán
            </p>
          )}
        </div>
        <div role="group" aria-label="Nhóm doanh thu" className="flex items-center bg-surface p-1 rounded-full">
          {GROUP_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={groupBy === value}
              onClick={() => setGroupBy(value)}
              className={cn(
                "rounded-full px-3.5 py-1 text-xs font-semibold transition cursor-pointer",
                groupBy === value
                  ? "bg-brand text-brand-foreground shadow-2xs"
                  : "text-subtle hover:text-ink",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error.message}</p>
      ) : isPending ? (
        <div aria-hidden className="mt-4 h-48 animate-pulse rounded-2xl bg-surface" />
      ) : points.length === 0 || !chartData ? (
        <p className="mt-4 text-sm text-subtle">Chưa có doanh thu trong khoảng đã chọn.</p>
      ) : (
        <div className="mt-3">
          {/* Vùng biểu đồ SVG + các điểm tròn HTML tròn chuẩn 100% */}
          <div className="w-full h-44 relative mb-2">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="revenueTrackerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    className="text-brand"
                    stopColor="currentColor"
                    stopOpacity="0.25"
                  />
                  <stop
                    offset="100%"
                    className="text-brand"
                    stopColor="currentColor"
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Vùng mờ bên dưới đường biểu đồ */}
              <path d={chartData.areaPath} fill="url(#revenueTrackerGradient)" />

              {/* Đường line biểu đồ */}
              <path
                d={chartData.linePath}
                fill="none"
                stroke="currentColor"
                className="text-brand"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Các điểm đo hiển thị dạng HTML để đảm bảo luôn tròn trịa 100%, không bị dẹt do co dãn SVG */}
            {chartData.chartPoints.map((p, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div
                  key={p.period}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 flex items-center justify-center size-8"
                  style={{
                    left: `${(p.x / SVG_WIDTH) * 100}%`,
                    top: `${(p.y / SVG_HEIGHT) * 100}%`,
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Chấm tròn chuẩn kích thước hình học */}
                  <div
                    className={cn(
                      "rounded-full transition-all duration-200 ring-2 ring-card shadow-xs",
                      isHovered
                        ? "size-4 bg-brand ring-[3px]"
                        : p.isLast
                        ? "size-3.5 bg-brand"
                        : "size-3 bg-brand/85"
                    )}
                  />

                  {/* Tooltip nổi ngay sát phía trên nút khi di chuột */}
                  {isHovered && (
                    <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 rounded-xl border border-border bg-card px-2.5 py-1.5 shadow-lg transition-all">
                      <p className="font-bold text-xs text-ink whitespace-nowrap text-center">
                        {formatVnd(p.revenue)}
                      </p>
                      <p className="text-[10px] text-subtle whitespace-nowrap text-center mt-0.5">
                        {formatPeriod(p.period)} • {formatNumber(p.transactionCount)} đơn
                      </p>
                      {/* Mũi tên chỉ xuống nút */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px size-0 border-x-4 border-x-transparent border-t-4 border-t-card" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nhãn số liệu và thời gian bên dưới biểu đồ */}
          <div
            className={cn(
              "flex gap-2 text-subtle px-2 pt-2.5 border-t border-border/50 text-[11px]",
              chartData.chartPoints.length === 1 ? "justify-center" : "justify-between"
            )}
          >
            {chartData.chartPoints.map((p, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div
                  key={p.period}
                  className={cn(
                    "flex flex-col items-center transition-colors cursor-pointer",
                    isHovered ? "text-brand" : "text-subtle"
                  )}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span
                    className={cn(
                      "tabular-nums text-xs font-semibold transition-colors",
                      isHovered ? "text-brand" : "text-ink"
                    )}
                  >
                    {formatVnd(p.revenue)}
                  </span>
                  <span className="tabular-nums text-[10px] text-subtle mt-0.5">
                    {formatPeriod(p.period)} ({formatNumber(p.transactionCount)} đơn)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
