import { useMemo, useState } from "react";

import ContentSearchBox from "@/features/admin/content/components/ContentSearchBox";
import ContentStatusFilter from "@/features/admin/content/components/ContentStatusFilter";
import ContentTable from "@/features/admin/content/components/ContentTable";
import { useAdminVideos, useChangeVideoStatus } from "@/features/admin/content/hooks/useAdminContent";
import { formatCount } from "@/features/admin/content/utils/contentFormat";
import { getVideoStatusInfo, VIDEO_STATUS_FILTERS } from "@/features/my-content/utils/statusInfo";
import { useDeleteVideo } from "@/features/video/hooks/useVideoMutations";

const COLUMNS = [
  { key: "category", label: "Danh mục", render: (video) => video.categoryName ?? "—" },
  { key: "views", label: "Lượt xem", align: "right", render: (video) => formatCount(video.viewCount) },
  { key: "votes", label: "Điểm", align: "right", render: (video) => formatCount(video.voteScore) },
];

const getAuthorId = (video) => video.authorId;
// Trang xem công khai chỉ mở được video đã đăng; video khác mở thẳng nguồn video để admin xem trước khi duyệt.
const getViewHref = (video) => (video.status === "PUBLISHED" ? `/videos/${video.id}` : video.videoUrl);
const getPublishedAt = (video) => video.publishedAt ?? video.createdAt;

// Tab "Video": video ở mọi trạng thái (GET /admin/videos), lọc trạng thái và tìm từ khóa ở BE; duyệt / từ chối video chờ.
export default function VideoContentSection() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const { data, isPending, isFetching, isError, error } = useAdminVideos({ status, keyword, page });
  const deleteVideo = useDeleteVideo();
  const changeStatus = useChangeVideoStatus();
  const items = useMemo(() => data?.items ?? [], [data]);

  // Xóa hết video ở trang cuối thì lùi về trang trước (đặt lại theo dữ liệu mới, không dùng effect).
  if (data && page > 0 && page >= data.totalPages) setPage(Math.max(data.totalPages - 1, 0));

  return (
    <section aria-label="Quản lý video" className="flex flex-col gap-4">
      <ContentSearchBox
        placeholder="Tìm video theo tiêu đề hoặc mô tả..."
        ariaLabel="Tìm video"
        onChange={(value) => {
          setKeyword(value);
          setPage(0);
        }}
      />
      <ContentStatusFilter
        options={VIDEO_STATUS_FILTERS}
        value={status}
        onChange={(value) => {
          setStatus(value);
          setPage(0);
        }}
      />
      <ContentTable
        items={items}
        columns={COLUMNS}
        noun="video"
        deleteNote="sẽ bị gỡ khỏi trang công khai và không thể khôi phục."
        getAuthorId={getAuthorId}
        getViewHref={getViewHref}
        getPublishedAt={getPublishedAt}
        getStatusInfo={getVideoStatusInfo}
        deleteMutation={deleteVideo}
        reviewMutation={changeStatus}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        onPageChange={setPage}
        isPending={isPending}
        isFetching={isFetching}
        isError={isError}
        error={error}
        emptyText={keyword || status ? "Không có video nào khớp bộ lọc." : "Chưa có video nào."}
      />
    </section>
  );
}
