import { useEffect, useMemo, useRef, useState } from "react";

import { usePaymentRevenue } from "@/features/admin/payments/hooks/useAdminPayments";
import {
  GROUP_OPTIONS,
  formatNumber,
  formatPeriod,
  formatVnd,
} from "@/features/admin/payments/utils/adminPaymentFormat";
import { cn } from "@/lib/utils";

const SVG_HEIGHT = 120;
const PADDING_X = 48;
const PADDING_TOP = 24;
const PADDING_BOTTOM = 22;
const MIN_POINT_SPACING = 76; // Khoảng cách tối thiểu giữa 2 điểm để nhãn ngày/đơn hàng không đè lên nhau

// Tính toán tọa độ và đường cong SVG cho biểu đồ theo chuẩn biểu đồ BMI (BmiTrackerCard).
function calcRevenueChartData(points, chartWidth) {
  if (!points || points.length === 0) return null;

  if (points.length === 1) {
    const p = points[0];
    const y = PADDING_TOP + 15;
    const chartPoints = [
      {
        ...p,
        x: chartWidth / 2,
        y,
        isLast: true,
      },
    ];
    const linePath = `M ${PADDING_X} ${y} L ${chartWidth - PADDING_X} ${y}`;
    const areaPath = `${linePath} L ${chartWidth - PADDING_X} ${SVG_HEIGHT} L ${PADDING_X} ${SVG_HEIGHT} Z`;
    return { chartPoints, linePath, areaPath };
  }

  const values = points.map((p) => Number(p.revenue) || 0);
  const minVal = 0;
  const maxVal = Math.max(...values, 1) * 1.15; // 15% khoảng đệm trên đỉnh
  const usableHeight = SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const chartPoints = points.map((p, i) => {
    const x = PADDING_X + (i * (chartWidth - PADDING_X * 2)) / (points.length - 1);
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
  const scrollContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const { data, isPending, isError, error } = usePaymentRevenue(filters, groupBy, { enabled });

  const points = useMemo(() => data?.points ?? [], [data]);

  // Tự động đo kích thước khung hiển thị biểu đồ
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const updateWidth = () => {
      setContainerWidth(el.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);

    return () => observer.disconnect();
  }, [isPending, isError, data]);

  // Chiều rộng cần thiết dựa trên số lượng mốc thời gian để tránh co cụm dữ liệu
  const minRequiredWidth =
    points.length > 1 ? (points.length - 1) * MIN_POINT_SPACING + PADDING_X * 2 : 0;
  const chartWidth = Math.max(containerWidth || 600, minRequiredWidth);
  const isScrollable = containerWidth > 0 && chartWidth > containerWidth;

  const chartData = useMemo(() => calcRevenueChartData(points, chartWidth), [points, chartWidth]);

  // Tự động cuộn sang mốc thời gian mới nhất (bên phải) khi biểu đồ có nhiều dữ liệu và có thanh cuộn ngang
  useEffect(() => {
    if (isScrollable && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [isScrollable, groupBy, data]);

  return (
    <section
      aria-label="Doanh thu"
      className="min-w-0 rounded-3xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-ink">Doanh thu</h2>
            {isScrollable && (
              <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-subtle">
                Cuộn ngang để xem thêm
              </span>
            )}
          </div>
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
        <div
          ref={scrollContainerRef}
          className="mt-3 w-full overflow-x-auto overflow-y-hidden pb-3 custom-scrollbar focus:outline-none"
        >
          {/* Khung nội dung biểu đồ với chiều rộng tính toán cố định khi nhiều dữ liệu */}
          <div style={{ width: `${chartWidth}px`, minWidth: "100%" }}>
            {/* Vùng biểu đồ SVG + các điểm tròn HTML tròn chuẩn 100% */}
            <div className="relative h-44 mb-2" style={{ width: `${chartWidth}px` }}>
              <svg
                className="w-full h-full overflow-visible"
                viewBox={`0 0 ${chartWidth} ${SVG_HEIGHT}`}
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
                      left: `${p.x}px`,
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

            {/* Nhãn số liệu và thời gian bên dưới biểu đồ được căn chuẩn xác theo tọa độ từng điểm */}
            <div
              className="relative h-14 border-t border-border/50 text-[11px]"
              style={{ width: `${chartWidth}px` }}
            >
              {chartData.chartPoints.map((p, i) => {
                const isHovered = hoveredIndex === i;
                return (
                  <div
                    key={p.period}
                    className={cn(
                      "absolute -translate-x-1/2 flex flex-col items-center transition-colors cursor-pointer pt-2 whitespace-nowrap",
                      isHovered ? "text-brand" : "text-subtle"
                    )}
                    style={{ left: `${p.x}px` }}
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
        </div>
      )}
    </section>
  );
}
