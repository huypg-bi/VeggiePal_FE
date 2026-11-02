import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  FileText,
  Info,
  MessageSquare,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  Video,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MOCK_MODERATION_HISTORY } from "@/features/admin/moderation/data/mockModerationData";
import { useModerationHistory } from "@/features/admin/moderation/hooks/useModeration";
import { formatDateTime, toIsoDateTime } from "@/features/admin/monitoring/utils/monitoringFormat";
import { cn } from "@/lib/utils";
import SelectField from "@/shared/components/SelectField";
import UserDisplayName from "@/shared/components/UserDisplayName";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

const PAGE_SIZE = 20;

const CONTENT_TYPE_OPTIONS = [
  { value: "", label: "Mọi loại nội dung" },
  { value: "BLOG", label: "Bài viết" },
  { value: "VIDEO", label: "Video" },
  { value: "COMMENT", label: "Bình luận" },
];

const DECISION_OPTIONS = [
  { value: "", label: "Mọi quyết định" },
  { value: "APPROVED", label: "Đã duyệt (APPROVED)" },
  { value: "REJECTED", label: "Từ chối (REJECTED)" },
  { value: "DISMISSED", label: "Bỏ qua (DISMISSED)" },
  { value: "REVIEW_REQUIRED", label: "Chờ duyệt (REVIEW_REQUIRED)" },
];

const REVIEWER_OPTIONS = [
  { value: "", label: "Mọi người duyệt" },
  { value: "AI", label: "Hệ thống AI" },
  { value: "ADMIN", label: "Quản trị viên (Admin)" },
];

const CONTENT_TYPE_MAP = {
  BLOG: { label: "Bài viết", icon: FileText, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  VIDEO: { label: "Video", icon: Video, className: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  COMMENT: { label: "Bình luận", icon: MessageSquare, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
};

const DECISION_MAP = {
  APPROVED: {
    label: "Đã duyệt",
    icon: Check,
    className: "border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  REJECTED: {
    label: "Từ chối",
    icon: X,
    className: "border-rose-200 bg-rose-50/80 text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300",
  },
  DISMISSED: {
    label: "Bỏ qua",
    icon: Ban,
    className: "border-border bg-surface text-subtle",
  },
  REVIEW_REQUIRED: {
    label: "Chờ duyệt",
    icon: AlertTriangle,
    className: "border-amber-200 bg-amber-50/80 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300",
  },
};

export default function ModerationHistorySection({ onViewDetail, isMockMode = false }) {
  const [contentType, setContentType] = useState("");
  const [decision, setDecision] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const [useMockFallback, setUseMockFallback] = useState(false);

  const rangeInvalid = Boolean(fromDate && toDate && fromDate > toDate);

  const shouldFetch = !isMockMode && !useMockFallback && !rangeInvalid;

  const { data: realData, isPending, isError, error, isFetching } = useModerationHistory(
    {
      contentType: contentType || undefined,
      decision: decision || undefined,
      reviewer: reviewer || undefined,
      from: toIsoDateTime(fromDate),
      to: toIsoDateTime(toDate, true),
      page,
      size: PAGE_SIZE,
    },
    { enabled: shouldFetch }
  );

  const isDemo = isMockMode || useMockFallback;

  // Lọc mock data trên client nếu đang ở mock mode
  const filteredMockData = useMemo(() => {
    if (!isDemo) return { items: [], totalElements: 0, totalPages: 1 };
    let list = [...MOCK_MODERATION_HISTORY];
    if (contentType) list = list.filter((i) => i.contentType === contentType);
    if (decision) list = list.filter((i) => i.decision === decision);
    if (reviewer === "AI") list = list.filter((i) => i.reviewedBy == null);
    if (reviewer === "ADMIN") list = list.filter((i) => i.reviewedBy != null);
    if (fromDate) list = list.filter((i) => (i.reviewedAt || i.createdAt) >= `${fromDate}T00:00:00`);
    if (toDate) list = list.filter((i) => (i.reviewedAt || i.createdAt) <= `${toDate}T23:59:59`);

    const start = page * PAGE_SIZE;
    const items = list.slice(start, start + PAGE_SIZE);
    return {
      items,
      totalElements: list.length,
      totalPages: Math.max(Math.ceil(list.length / PAGE_SIZE), 1),
    };
  }, [isDemo, contentType, decision, reviewer, fromDate, toDate, page]);

  const items = isDemo ? filteredMockData.items : (realData?.items ?? []);
  const totalElements = isDemo ? filteredMockData.totalElements : (realData?.totalElements ?? 0);
  const totalPages = isDemo ? filteredMockData.totalPages : Math.max(realData?.totalPages ?? 1, 1);

  const handleSelect = (setter) => (value) => {
    setter(value);
    setPage(0);
  };

  const handleDateChange = (setter) => (event) => {
    setter(event.target.value);
    setPage(0);
  };

  const handleResetFilters = () => {
    setContentType("");
    setDecision("");
    setReviewer("");
    setFromDate("");
    setToDate("");
    setPage(0);
  };

  const hasActiveFilters = Boolean(contentType || decision || reviewer || fromDate || toDate);

  // Lấy toàn bộ userId (authorId và reviewedBy) để truy vấn batch tên người dùng
  const userIds = useMemo(() => {
    const ids = new Set();
    items.forEach((item) => {
      if (item.authorId != null) ids.add(item.authorId);
      if (item.reviewedBy != null) ids.add(item.reviewedBy);
    });
    return Array.from(ids);
  }, [items]);

  const { data: userMap } = usePublicUsers(userIds);

  return (
    <div className="flex flex-col gap-4">
      {/* Thông tin giới thiệu */}
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-xs text-subtle shadow-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-brand" />
        <div className="space-y-1">
          <p className="font-semibold text-ink">Lịch sử kiểm duyệt nội dung (Đã xử lý):</p>
          <p className="leading-relaxed">
            • Danh sách toàn bộ các ca kiểm duyệt đã có kết luận phê duyệt, từ chối hoặc bỏ qua từ AI hoặc Quản trị viên (sắp xếp mới nhất trước).
          </p>
          <p className="leading-relaxed">
            • Hỗ trợ lọc chi tiết theo loại nội dung, quyết định, người duyệt và khoảng thời gian.
          </p>
        </div>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-card p-3.5 shadow-xs">
        <SelectField
          aria-label="Lọc loại nội dung"
          options={CONTENT_TYPE_OPTIONS}
          value={contentType}
          onValueChange={handleSelect(setContentType)}
          className="h-10 min-w-44"
        />

        <SelectField
          aria-label="Lọc quyết định"
          options={DECISION_OPTIONS}
          value={decision}
          onValueChange={handleSelect(setDecision)}
          className="h-10 min-w-48"
        />

        <SelectField
          aria-label="Lọc người duyệt"
          options={REVIEWER_OPTIONS}
          value={reviewer}
          onValueChange={handleSelect(setReviewer)}
          className="h-10 min-w-44"
        />

        <div className="flex items-center gap-1.5 text-xs text-subtle font-medium">
          <span>Từ:</span>
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
          <span>Đến:</span>
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

      {/* Trạng thái lỗi / loading / bảng */}
      {rangeInvalid ? (
        <div className="rounded-2xl border border-warning/30 bg-warning/15 px-4 py-3 text-sm text-warning">
          Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.
        </div>
      ) : !isDemo && isError ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertTriangle className="size-5 shrink-0" />
          <div className="flex-1">
            <p>{error?.message || "Không thể tải lịch sử kiểm duyệt từ Backend."}</p>
            <p className="mt-1 text-xs text-destructive/80">
              Bạn có thể nhấn nút <strong>"Dữ liệu mẫu (Demo)"</strong> để kiểm tra giao diện và chức năng lọc.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setUseMockFallback(true)}
            className="shrink-0 gap-1 bg-card text-xs text-ink cursor-pointer"
          >
            <Sparkles className="size-3.5 text-amber-500" />
            Bật dữ liệu mẫu
          </Button>
        </div>
      ) : !isDemo && isPending ? (
        <div aria-hidden className="h-72 animate-pulse rounded-3xl border border-border bg-card" />
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-8 text-center text-sm text-subtle">
          Không tìm thấy ca kiểm duyệt nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-sm border-collapse">
              <thead className="border-b border-border bg-surface/75 text-xs uppercase tracking-wider text-subtle font-semibold">
                <tr className="divide-x divide-border">
                  <th className="px-4 py-3.5 text-center">Mã Case</th>
                  <th className="px-4 py-3.5 text-center">Loại</th>
                  <th className="px-4 py-3.5 text-center">Tác giả</th>
                  <th className="px-6 py-3.5 text-left">Nội dung bị gắn cờ</th>
                  <th className="px-4 py-3.5 text-center">Quyết định</th>
                  <th className="px-4 py-3.5 text-center">Độ tin cậy</th>
                  <th className="px-4 py-3.5 text-center">Người duyệt</th>
                  <th className="px-4 py-3.5 text-center">Thời gian</th>
                  <th className="px-4 py-3.5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => {
                  const typeMeta = CONTENT_TYPE_MAP[item.contentType] || {
                    label: item.contentType || "Chưa phân loại",
                    icon: ShieldAlert,
                    className: "bg-surface text-subtle",
                  };
                  const TypeIcon = typeMeta.icon;

                  const decisionMeta = DECISION_MAP[item.decision] || {
                    label: item.decision || "—",
                    icon: Info,
                    className: "border-border bg-surface text-subtle",
                  };
                  const DecisionIcon = decisionMeta.icon;

                  const isAI = item.reviewedBy == null;
                  const confidenceNum = item.confidence != null ? Number(item.confidence) : null;

                  return (
                    <tr
                      key={item.caseId}
                      className="divide-x divide-border text-body transition-colors hover:bg-surface/50"
                    >
                      {/* Mã Case & ID gốc */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-mono font-semibold text-ink text-xs">
                            #{item.caseId}
                          </span>
                          {item.externalContentId != null && (
                            item.contentType === "BLOG" ? (
                              <a
                                href={`/blog/${item.externalContentId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] text-brand hover:underline"
                                title="Mở bài viết gốc"
                              >
                                #{item.externalContentId}
                                <ExternalLink className="size-2.5" />
                              </a>
                            ) : (
                              <span className="mt-0.5 font-mono text-[11px] text-subtle" title="Mã nội dung gốc">
                                #{item.externalContentId}
                              </span>
                            )
                          )}
                        </div>
                      </td>

                      {/* Loại nội dung */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            typeMeta.className
                          )}
                        >
                          <TypeIcon className="size-3.5" />
                          {typeMeta.label}
                        </span>
                      </td>

                      {/* Tác giả */}
                      <td className="px-4 py-4 text-center text-xs font-semibold text-ink">
                        {item.authorId != null ? (
                          <UserDisplayName userId={item.authorId} userMap={userMap} />
                        ) : (
                          <span className="text-subtle">—</span>
                        )}
                      </td>

                      {/* Nội dung bị gắn cờ & lý do */}
                      <td className="max-w-xs px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {item.content ? (
                            <p className="line-clamp-2 text-xs italic text-body" title={item.content}>
                              "{item.content}"
                            </p>
                          ) : (
                            <span className="text-xs text-subtle italic">Không có nội dung văn bản</span>
                          )}
                          {item.reason && (
                            <p className="line-clamp-1 text-[11px] text-subtle" title={item.reason}>
                              <span className="font-medium text-ink">Lý do:</span> {item.reason}
                            </p>
                          )}
                          {item.categories && item.categories.length > 0 && (
                            <div className="mt-0.5 flex flex-wrap gap-1">
                              {item.categories.map((cat) => (
                                <span
                                  key={cat}
                                  className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Quyết định */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-2xs whitespace-nowrap",
                            decisionMeta.className
                          )}
                        >
                          <DecisionIcon className="size-3.5" />
                          {decisionMeta.label}
                        </span>
                      </td>

                      {/* Độ tin cậy */}
                      <td className="px-4 py-4 text-center tabular-nums text-xs font-semibold">
                        {confidenceNum != null ? (
                          <span
                            className={cn(
                              confidenceNum >= 0.8
                                ? "text-emerald-700 dark:text-emerald-300"
                                : confidenceNum >= 0.5
                                  ? "text-amber-700 dark:text-amber-300"
                                  : "text-subtle"
                            )}
                          >
                            {Math.round(confidenceNum * 100)}%
                          </span>
                        ) : (
                          <span className="text-subtle">—</span>
                        )}
                      </td>

                      {/* Người duyệt */}
                      <td className="px-4 py-4 text-center">
                        {isAI ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50/80 px-2.5 py-1 text-xs font-semibold text-purple-700 shadow-2xs dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-300">
                            <Bot className="size-3.5" />
                            AI
                          </span>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/80 px-2 py-0.5 text-[11px] font-semibold text-blue-700 shadow-2xs dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300">
                              <Shield className="size-3" />
                              Admin
                            </span>
                            <span className="text-xs font-semibold text-ink">
                              <UserDisplayName userId={item.reviewedBy} userMap={userMap} />
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Thời gian */}
                      <td className="whitespace-nowrap px-4 py-4 text-center tabular-nums text-xs text-subtle font-medium">
                        <span title={`Ngày quyết định: ${formatDateTime(item.reviewedAt || item.createdAt)}`}>
                          {formatDateTime(item.reviewedAt || item.createdAt)}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="px-4 py-4 text-center">
                        {onViewDetail && (
                          <button
                            type="button"
                            onClick={() => onViewDetail(item)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand/40 hover:bg-brand-soft/40 hover:text-brand shadow-2xs cursor-pointer"
                            title="Xem chi tiết ca kiểm duyệt"
                          >
                            <Eye className="size-3.5 text-subtle" />
                            Chi tiết
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card px-6 py-3.5 text-sm text-subtle">
            <span className="font-medium text-xs sm:text-sm">
              {totalElements} ca • Trang {page + 1}/{totalPages}
              {!isDemo && isFetching && " • Đang cập nhật..."}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={page <= 0 || (!isDemo && isFetching)}
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
                disabled={page + 1 >= totalPages || (!isDemo && isFetching)}
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
