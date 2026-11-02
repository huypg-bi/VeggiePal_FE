import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Info, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import UsageSummarySection from "@/features/admin/monitoring/components/UsageSummarySection";
import { useAiModels, useUsageLogs } from "@/features/admin/monitoring/hooks/useMonitoring";
import {
  DAY_OPTIONS,
  describeCaller,
  formatDateTime,
  formatNumber,
  STATUS_LABELS,
  toIsoDateTime,
} from "@/features/admin/monitoring/utils/monitoringFormat";
import { cn } from "@/lib/utils";
import SelectField from "@/shared/components/SelectField";
import UserDisplayName from "@/shared/components/UserDisplayName";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

const PAGE_SIZE = 10;
const USER_DEBOUNCE_MS = 400;

const STATUS_OPTIONS = [
  { value: "", label: "Mọi trạng thái" },
  { value: "SUCCESS", label: "Thành công" },
  { value: "FAILED", label: "Thất bại" },
];

const fieldClass =
  "h-10 rounded-full border border-border bg-surface px-3.5 text-sm text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15";

// Khối nhật ký kiểm duyệt hiển thị các lượt gọi AI kiểm duyệt nội dung.
export default function ModerationLogsSection() {
  const [status, setStatus] = useState("");
  const [userText, setUserText] = useState("");
  const [userId, setUserId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const [days, setDays] = useState(7);
  const timerRef = useRef(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const rangeInvalid = Boolean(fromDate && toDate && fromDate > toDate);

  const { data, isPending, isError, error, isFetching } = useUsageLogs(
    {
      feature: "MODERATION",
      status: status || undefined,
      userId: userId || undefined,
      from: toIsoDateTime(fromDate),
      to: toIsoDateTime(toDate, true),
      page,
      size: PAGE_SIZE,
    },
    { enabled: !rangeInvalid },
  );

  const handleSelectStatus = (value) => {
    setStatus(value);
    setPage(0);
  };

  const handleDateChange = (setter) => (event) => {
    setter(event.target.value);
    setPage(0);
  };

  const handleUserChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    setUserText(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setUserId(value);
      setPage(0);
    }, USER_DEBOUNCE_MS);
  };

  const handleResetFilters = () => {
    setStatus("");
    setUserText("");
    setUserId("");
    setFromDate("");
    setToDate("");
    setPage(0);
  };

  const hasActiveFilters = Boolean(status || userId || fromDate || toDate);
  const items = useMemo(() => data?.items ?? [], [data]);
  const userIds = useMemo(() => items.map((l) => l.userId).filter(Boolean), [items]);
  const { data: userMap } = usePublicUsers(userIds);
  const { data: models } = useAiModels();

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Khoảng thời gian tổng hợp" className="flex items-center gap-2">
        {DAY_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={days === value}
            onClick={() => setDays(value)}
            className={cn(
              "cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold shadow-2xs transition",
              days === value
                ? "bg-brand text-brand-foreground shadow-xs"
                : "border border-border bg-card text-subtle hover:bg-surface hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <UsageSummarySection days={days} feature="MODERATION" />

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-xs text-subtle shadow-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-brand" />
        <div className="space-y-1">
          <p className="font-semibold text-ink">Nhật ký thực thi AI kiểm duyệt (Audit Logs):</p>
          {models?.moderation && (
            <p className="leading-relaxed">
              • Model đang dùng: <span className="font-mono font-semibold text-ink">{models.moderation}</span>
            </p>
          )}
          <p className="leading-relaxed">
            • Tab này hiển thị nhật ký các lượt gọi AI kiểm duyệt tự động (thời gian, tác giả, model, token, độ trễ và trạng thái).
          </p>
          <p className="leading-relaxed">
            • Để xem lịch sử các ca kiểm duyệt hoàn chỉnh (kèm quyết định, lý do, độ tin cậy và người duyệt), vui lòng chuyển sang tab <strong className="text-ink">Đã xử lý</strong>.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-card p-3.5 shadow-xs">
        <SelectField
          aria-label="Lọc theo trạng thái"
          options={STATUS_OPTIONS}
          value={status}
          onValueChange={handleSelectStatus}
          className="h-10 min-w-40"
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={userText}
          onChange={handleUserChange}
          placeholder="ID tác giả"
          aria-label="Lọc theo ID tác giả"
          className={cn(fieldClass, "w-36 placeholder:text-subtle")}
        />
        <div className="flex items-center gap-1.5 text-xs text-subtle font-medium">
          <span>Từ</span>
          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={handleDateChange(setFromDate)}
            aria-label="Từ ngày"
            className="h-10 rounded-full border border-border bg-surface px-3 text-xs text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-subtle font-medium">
          <span>Đến</span>
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={handleDateChange(setToDate)}
            aria-label="Đến ngày"
            className="h-10 rounded-full border border-border bg-surface px-3 text-xs text-ink outline-none transition focus:border-brand/40 focus:ring-2 focus:ring-brand/15"
          />
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-subtle hover:text-ink cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            Đặt lại
          </Button>
        )}
      </div>

      {rangeInvalid ? (
        <div className="rounded-2xl border border-warning/30 bg-warning/15 px-4 py-3 text-sm text-warning">
          Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error.message || "Không thể tải nhật ký AI kiểm duyệt"}
        </div>
      ) : isPending ? (
        <div aria-hidden className="h-72 animate-pulse rounded-3xl border border-border bg-card" />
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-subtle">
          Không có lượt gọi AI kiểm duyệt nào khớp bộ lọc hiện tại.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm border-collapse">
              <thead className="border-b border-border bg-surface/75 text-xs uppercase tracking-wider text-subtle font-semibold">
                <tr className="divide-x divide-border">
                  <th className="px-6 py-3.5 text-center">Thời gian</th>
                  <th className="px-4 py-3.5 text-center">Tác giả</th>
                  <th className="px-4 py-3.5 text-center">Model AI</th>
                  <th className="px-4 py-3.5 text-center">Token (Vào / Ra)</th>
                  <th className="px-4 py-3.5 text-center">Độ trễ</th>
                  <th className="px-4 py-3.5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((log) => (
                  <tr
                    key={log.id}
                    className="divide-x divide-border text-body transition-colors hover:bg-surface/50"
                  >
                    {/* Thời gian */}
                    <td className="whitespace-nowrap px-6 py-4 text-center tabular-nums text-xs text-subtle font-medium">
                      {formatDateTime(log.createdAt)}
                    </td>

                    {/* Tác giả */}
                    <td className="px-4 py-4 text-center text-xs font-semibold text-ink">
                      {log.userId != null ? (
                        <UserDisplayName userId={log.userId} userMap={userMap} />
                      ) : (
                        describeCaller(log, userMap)
                      )}
                    </td>

                    {/* Model AI */}
                    <td className="px-4 py-4 text-center font-mono text-xs text-subtle whitespace-nowrap">
                      {log.model}
                    </td>

                    {/* Token */}
                    <td className="whitespace-nowrap px-4 py-4 text-center tabular-nums text-xs font-medium text-ink">
                      {formatNumber(log.promptTokens)}{" "}
                      <span className="text-subtle font-normal">/</span>{" "}
                      {formatNumber(log.completionTokens)}
                    </td>

                    {/* Độ trễ */}
                    <td className="whitespace-nowrap px-4 py-4 text-center tabular-nums text-xs font-medium text-ink">
                      <span className={cn(log.latencyMs > 3000 ? "text-amber-600 dark:text-amber-400 font-semibold" : "")}>
                        {formatNumber(log.latencyMs)} ms
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
                            log.status === "FAILED"
                              ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
                          )}
                        >
                          {STATUS_LABELS[log.status] ?? log.status}
                        </span>
                        {log.errorMessage && (
                          <p className="max-w-xs break-words text-[11px] text-destructive">{log.errorMessage}</p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card px-6 py-3.5 text-sm text-subtle">
            <span className="font-medium text-xs sm:text-sm">
              {formatNumber(data.totalElements)} lượt • Trang {data.page + 1}/{Math.max(data.totalPages, 1)}
              {isFetching && " • Đang cập nhật..."}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={data.page <= 0 || isFetching}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                className="rounded-xl border-border px-3 text-xs font-medium hover:bg-surface cursor-pointer"
              >
                <ChevronLeft className="size-4" />
                Trước
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={data.page + 1 >= data.totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border-border px-3 text-xs font-medium hover:bg-surface cursor-pointer"
              >
                Sau
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
