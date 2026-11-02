import { useMemo, useState } from "react";

import ContentSearchBox from "@/features/admin/content/components/ContentSearchBox";
import ContentTable from "@/features/admin/content/components/ContentTable";
import { CONTENT_PAGE_SIZE, useAdminVideos } from "@/features/admin/content/hooks/useAdminContent";
import { formatCount } from "@/features/admin/content/utils/contentFormat";
import { useDeleteVideo } from "@/features/video/hooks/useVideoMutations";
import { textIncludes } from "@/shared/utils/text";

const COLUMNS = [
  { key: "category", label: "Danh mục", render: (video) => video.categoryName ?? "—" },
  { key: "views", label: "Lượt xem", align: "right", render: (video) => formatCount(video.viewCount) },
  { key: "votes", label: "Điểm", align: "right", render: (video) => formatCount(video.voteScore) },
];

const getAuthorId = (video) => video.authorId;
const getViewPath = (video) => `/videos/${video.id}`;
const getPublishedAt = (video) => video.publishedAt ?? video.createdAt;

// Tab "Video": video đã đăng (GET /videos); BE chưa có tìm kiếm nên lọc tiêu đề và phân trang ở FE.
export default function VideoContentSection() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const { data: videos, isPending, isFetching, isError, error } = useAdminVideos();
  const deleteVideo = useDeleteVideo();

  const filtered = useMemo(
    () => (videos ?? []).filter((video) => textIncludes(video.title, keyword)),
    [videos, keyword]
  );
  const totalPages = Math.max(Math.ceil(filtered.length / CONTENT_PAGE_SIZE), 1);
  // Xóa hết video ở trang cuối thì tự lùi về trang trước.
  const currentPage = Math.min(page, totalPages - 1);
  const items = useMemo(
    () => filtered.slice(currentPage * CONTENT_PAGE_SIZE, (currentPage + 1) * CONTENT_PAGE_SIZE),
    [filtered, currentPage]
  );

  return (
    <section aria-label="Quản lý video" className="flex flex-col gap-4">
      <ContentSearchBox
        placeholder="Tìm video theo tiêu đề..."
        ariaLabel="Tìm video"
        onChange={(value) => {
          setKeyword(value);
          setPage(0);
        }}
      />
      <ContentTable
        items={items}
        columns={COLUMNS}
        noun="video"
        deleteNote="sẽ bị gỡ khỏi trang công khai và không thể khôi phục."
        getAuthorId={getAuthorId}
        getViewPath={getViewPath}
        getPublishedAt={getPublishedAt}
        deleteMutation={deleteVideo}
        page={currentPage}
        totalPages={totalPages}
        totalElements={filtered.length}
        onPageChange={setPage}
        isPending={isPending}
        isFetching={isFetching}
        isError={isError}
        error={error}
        emptyText={keyword ? "Không có video nào khớp từ khóa." : "Chưa có video nào được đăng."}
      />
    </section>
  );
}
