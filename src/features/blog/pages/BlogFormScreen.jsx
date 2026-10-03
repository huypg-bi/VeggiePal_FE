import { Link, useParams } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/authStore";
import BlogForm from "@/features/blog/components/BlogForm";
import { useCategories } from "@/features/blog/hooks/useCategories";
import { useBlog } from "@/features/blog/hooks/useBlogs";
import { flattenCategories } from "@/features/blog/utils/feedFilters";
import AppFooter from "@/shared/components/AppFooter";
import AppHeader from "@/shared/components/AppHeader";

// Trang viết bài mới (/blog/new) và sửa bài (/blog/:blogId/edit), cần đăng nhập.
// BE chưa có endpoint cho chủ bài đọc lại bài chưa đăng, nên chế độ sửa nạp bài qua
// GET /blogs/:id (chỉ bài đã đăng) — bản nháp/chờ duyệt/bị từ chối hiện chưa mở lại để sửa được.
export default function BlogFormScreen() {
  const { blogId } = useParams();
  const isEdit = blogId !== undefined;
  const id = /^[1-9]\d*$/.test(blogId ?? "") ? Number(blogId) : null;

  const user = useAuthStore((s) => s.user);
  const { data: categoryTree, isPending: categoriesPending, isError: categoriesError } =
    useCategories();
  const { data: blog, isPending: blogPending, isError: blogError } = useBlog(isEdit ? id : null);

  const canEdit = blog && (blog.authorId === user?.id || user?.role === "ADMIN");

  let body;
  if (isEdit && (id === null || blogError)) {
    body = (
      <Notice title="Không mở được bài viết này để sửa">
        Hiện chỉ sửa được bài đã đăng. Bản nháp, bài đang chờ duyệt hoặc bị từ chối chưa thể mở lại
        để chỉnh sửa.
      </Notice>
    );
  } else if (isEdit && !blogPending && !canEdit) {
    body = (
      <Notice title="Bạn không có quyền sửa bài viết này">
        Chỉ tác giả hoặc quản trị viên mới sửa được bài viết.
      </Notice>
    );
  } else if (categoriesError) {
    body = <Notice title="Không tải được danh mục">Vui lòng tải lại trang và thử lại.</Notice>;
  } else if (categoriesPending || (isEdit && blogPending)) {
    // Form chỉ dựng sau khi có danh mục + bài, vì <select> cần đủ <option> để nhận giá trị ban đầu.
    body = <FormSkeleton />;
  } else {
    body = <BlogForm blog={isEdit ? blog : undefined} categories={flattenCategories(categoryTree)} />;
  }

  return (
    <div className="min-h-dvh">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-6">
        <h1 className="font-heading text-3xl font-bold text-ink">
          {isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}
        </h1>
        {body}
      </main>

      <AppFooter />
    </div>
  );
}

function Notice({ title, children }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
      <h2 className="font-heading text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm text-subtle">{children}</p>
      <Link
        to="/my-content"
        className="mt-4 inline-block rounded-full bg-brand px-5 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90"
      >
        Về bài viết của tôi
      </Link>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div
      aria-hidden
      className="animate-pulse space-y-5 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="h-11 w-full rounded-xl bg-surface" />
      <div className="h-11 w-full rounded-xl bg-surface" />
      <div className="aspect-[16/6] w-full rounded-2xl bg-surface" />
      <div className="h-56 w-full rounded-xl bg-surface" />
    </div>
  );
}
