import { useMemo, useState } from "react";

import ContentSearchBox from "@/features/admin/content/components/ContentSearchBox";
import ContentStatusFilter from "@/features/admin/content/components/ContentStatusFilter";
import ContentTable from "@/features/admin/content/components/ContentTable";
import { useAdminBlogs, useChangeBlogStatus } from "@/features/admin/content/hooks/useAdminContent";
import { formatCount } from "@/features/admin/content/utils/contentFormat";
import { useDeleteBlog } from "@/features/blog/hooks/useBlogMutations";
import { BLOG_STATUS_FILTERS, getBlogStatusInfo } from "@/features/my-content/utils/statusInfo";

const COLUMNS = [
  { key: "category", label: "Danh mục", render: (blog) => blog.categoryName ?? "—" },
  { key: "views", label: "Lượt xem", align: "right", render: (blog) => formatCount(blog.viewCount) },
  { key: "votes", label: "Điểm", align: "right", render: (blog) => formatCount(blog.voteScore) },
];

const getAuthorId = (blog) => blog.authorId;
const getViewHref = (blog) => `/blog/${blog.id}`;
const getPublishedAt = (blog) => blog.publishedAt ?? blog.createdAt;

// Tab "Bài viết": bài ở mọi trạng thái (GET /admin/blogs), lọc trạng thái và tìm từ khóa ở BE; duyệt / từ chối bài chờ.
export default function BlogContentSection() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const { data, isPending, isFetching, isError, error } = useAdminBlogs({ status, keyword, page });
  const deleteBlog = useDeleteBlog();
  const changeStatus = useChangeBlogStatus();
  const items = useMemo(() => data?.items ?? [], [data]);

  // Xóa hết bài ở trang cuối thì lùi về trang trước (đặt lại theo dữ liệu mới, không dùng effect).
  if (data && page > 0 && page >= data.totalPages) setPage(Math.max(data.totalPages - 1, 0));

  return (
    <section aria-label="Quản lý bài viết" className="flex flex-col gap-4">
      <ContentSearchBox
        placeholder="Tìm bài viết theo tiêu đề hoặc nội dung..."
        ariaLabel="Tìm bài viết"
        onChange={(value) => {
          setKeyword(value);
          setPage(0);
        }}
      />
      <ContentStatusFilter
        options={BLOG_STATUS_FILTERS}
        value={status}
        onChange={(value) => {
          setStatus(value);
          setPage(0);
        }}
      />
      <ContentTable
        items={items}
        columns={COLUMNS}
        noun="bài viết"
        deleteNote="sẽ bị gỡ khỏi trang công khai và không thể khôi phục."
        getAuthorId={getAuthorId}
        getViewHref={getViewHref}
        getPublishedAt={getPublishedAt}
        getStatusInfo={getBlogStatusInfo}
        deleteMutation={deleteBlog}
        reviewMutation={changeStatus}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        onPageChange={setPage}
        isPending={isPending}
        isFetching={isFetching}
        isError={isError}
        error={error}
        emptyText={keyword || status ? "Không có bài viết nào khớp bộ lọc." : "Chưa có bài viết nào."}
      />
    </section>
  );
}
