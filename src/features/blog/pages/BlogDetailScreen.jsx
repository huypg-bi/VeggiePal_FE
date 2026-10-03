import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, ImageOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import AuthorAvatar from "@/features/blog/components/AuthorAvatar";
import CommentSection from "@/features/blog/components/CommentSection";
import RelatedBlogs from "@/features/blog/components/RelatedBlogs";
import VoteButton from "@/features/blog/components/VoteButton";
import { useMyVotes } from "@/features/blog/hooks/useBlogVotes";
import { useBlog } from "@/features/blog/hooks/useBlogs";
import {
  FALLBACK_AUTHOR_NAME,
  formatCompactNumber,
  formatTimeAgo,
} from "@/features/blog/utils/blogFormat";
import AppFooter from "@/shared/components/AppFooter";
import AppHeader from "@/shared/components/AppHeader";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

// Trang đọc một bài (route /blog/:blogId), công khai. Nội dung BE lưu là text thuần,
// nên hiển thị bằng text (giữ xuống dòng) chứ không render HTML.
export default function BlogDetailScreen() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Id không phải số nguyên dương thì không gọi API, hiện luôn "không tìm thấy".
  const id = /^[1-9]\d*$/.test(blogId ?? "") ? Number(blogId) : null;
  const { data: blog, isPending, isError } = useBlog(id);
  const { data: authors } = usePublicUsers(blog ? [blog.authorId] : []);
  const author = blog ? authors?.get(blog.authorId) : undefined;
  const { data: myVotes } = useMyVotes(blog ? [blog.id] : []);

  // Có lịch sử trong app thì quay lại (giữ nguyên bộ lọc của feed), mở thẳng link thì về /blog.
  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/blog"));

  return (
    <div className="min-h-dvh">
      <AppHeader />

      {/* 3 cột như trang Cộng đồng: trái để trống (dành cho phát triển thêm), bài chính ở giữa,
          bài liên quan bên phải. Hai cột bên rộng gần bằng nhau nên bài luôn nằm đúng giữa trang,
          kể cả khi chưa có bài liên quan. Dưới lg chỉ còn 1 cột: bài trước, bài liên quan sau. */}
      <main className="mx-auto w-full max-w-[1280px] px-6 py-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)_300px]">
          <aside aria-hidden className="hidden lg:block" />

          <div className="flex min-w-0 flex-col gap-6">
            <div>
              <Button type="button" variant="ghost" size="sm" onClick={goBack}>
                <ArrowLeft className="size-4" />
                Quay lại Cộng đồng
              </Button>
            </div>

            {id === null || isError ? (
              <NotFound />
            ) : isPending ? (
              <ArticleSkeleton />
            ) : (
              <>
                <article className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
                  {blog.categoryName && (
                    <span className="inline-block rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand">
                      {blog.categoryName}
                    </span>
                  )}

                  <h1 className="mt-3 font-heading text-2xl font-bold leading-tight text-ink sm:text-4xl">
                    {blog.title}
                  </h1>

                  <div className="mt-4 flex items-center gap-3">
                    <AuthorAvatar author={author} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {author?.fullName ?? FALLBACK_AUTHOR_NAME}
                      </p>
                      <p className="text-xs text-subtle">
                        {formatTimeAgo(blog.publishedAt ?? blog.createdAt)}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-sm text-subtle">
                      <VoteButton blog={blog} myVote={myVotes?.get(blog.id)} />
                      <span className="flex items-center gap-1.5">
                        <Eye className="size-4" />
                        {formatCompactNumber(blog.viewCount)}
                      </span>
                    </div>
                  </div>

                  {blog.thumbnailUrl ? (
                    <img
                      src={blog.thumbnailUrl}
                      alt={blog.title}
                      className="mt-6 aspect-[16/9] w-full rounded-2xl object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="mt-6 grid aspect-[16/6] w-full place-items-center rounded-2xl bg-surface text-subtle">
                      <ImageOff className="size-8" />
                    </div>
                  )}

                  <div className="mt-6 whitespace-pre-line break-words text-base leading-relaxed text-body">
                    {blog.content}
                  </div>
                </article>

                <CommentSection blogId={blog.id} />
              </>
            )}
          </div>

          {blog && (
            <aside className="lg:sticky lg:top-24">
              <RelatedBlogs blogId={blog.id} />
            </aside>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

function NotFound() {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
      <h1 className="font-heading text-xl font-bold text-ink">Không tìm thấy bài viết</h1>
      <p className="mt-2 text-sm text-subtle">
        Bài viết không tồn tại, chưa được đăng hoặc đã bị gỡ.
      </p>
      <Link
        to="/blog"
        className="mt-4 inline-block rounded-full bg-brand px-5 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90"
      >
        Về trang Cộng đồng
      </Link>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div
      aria-hidden
      className="animate-pulse rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8"
    >
      <div className="h-5 w-24 rounded-full bg-surface" />
      <div className="mt-4 h-8 w-4/5 rounded bg-surface" />
      <div className="mt-4 flex items-center gap-3">
        <div className="size-11 rounded-full bg-surface" />
        <div className="h-4 w-40 rounded bg-surface" />
      </div>
      <div className="mt-6 aspect-[16/9] w-full rounded-2xl bg-surface" />
      <div className="mt-6 space-y-3">
        <div className="h-4 w-full rounded bg-surface" />
        <div className="h-4 w-full rounded bg-surface" />
        <div className="h-4 w-2/3 rounded bg-surface" />
      </div>
    </div>
  );
}
