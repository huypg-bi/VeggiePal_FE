import { useMemo, useState } from "react";

import ContentSearchBox from "@/features/admin/content/components/ContentSearchBox";
import ContentTable from "@/features/admin/content/components/ContentTable";
import { useAdminBlogs } from "@/features/admin/content/hooks/useAdminContent";
import { formatCount } from "@/features/admin/content/utils/contentFormat";
import { useDeleteBlog } from "@/features/blog/hooks/useBlogMutations";

const COLUMNS = [
  { key: "category", label: "Danh mục", render: (blog) => blog.categoryName ?? "—" },
  { key: "views", label: "Lượt xem", align: "right", render: (blog) => formatCount(blog.viewCount) },
  { key: "votes", label: "Điểm", align: "right", render: (blog) => formatCount(blog.voteScore) },
];

const getAuthorId = (blog) => blog.authorId;
const getViewPath = (blog) => `/blog/${blog.id}`;
const getPublishedAt = (blog) => blog.publishedAt ?? blog.createdAt;

// Tab "Bài viết": bài đã đăng (GET /blogs), tìm theo từ khóa ở BE.
export default function BlogContentSection() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const { data, isPending, isFetching, isError, error } = useAdminBlogs({ keyword, page });
  const deleteBlog = useDeleteBlog();
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
      <ContentTable
        items={items}
        columns={COLUMNS}
        noun="bài viết"
        deleteNote="sẽ bị gỡ khỏi trang công khai và không thể khôi phục."
        getAuthorId={getAuthorId}
        getViewPath={getViewPath}
        getPublishedAt={getPublishedAt}
        deleteMutation={deleteBlog}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        onPageChange={setPage}
        isPending={isPending}
        isFetching={isFetching}
        isError={isError}
        error={error}
        emptyText={keyword ? "Không có bài viết nào khớp từ khóa." : "Chưa có bài viết nào được đăng."}
      />
    </section>
  );
}
