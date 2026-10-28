import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ListChecks, Loader2, Rss, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { selectIsAuthenticated, useAuthStore } from "@/features/auth/store/authStore";
import AskBroccoliCard from "@/features/blog/components/AskBroccoliCard";
import BlogFilterBar from "@/features/blog/components/BlogFilterBar";
import BlogPostCard from "@/features/blog/components/BlogPostCard";
import CommunityHero from "@/features/blog/components/CommunityHero";
import FollowListDialog from "@/features/blog/components/FollowListDialog";
import LeaderboardCard from "@/features/blog/components/LeaderboardCard";
import TrendingTopicsCard from "@/features/blog/components/TrendingTopicsCard";
import WeeklyChallengeCard from "@/features/blog/components/WeeklyChallengeCard";
import { useMyVotes } from "@/features/blog/hooks/useBlogVotes";
import { useBlogFeed, useFollowingFeed } from "@/features/blog/hooks/useBlogs";
import {
  hasActiveFilters,
  parseFeedFilters,
  toFeedSearchParams,
} from "@/features/blog/utils/feedFilters";
import { cn } from "@/lib/utils";
import AppFooter from "@/shared/components/AppFooter";
import AppHeader from "@/shared/components/AppHeader";
import Reveal from "@/shared/components/Reveal";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

export default function BlogScreen() {
  // Bộ lọc nằm trên URL (?q=&sort=&category=) để quay lại từ trang chi tiết vẫn giữ nguyên.
  // Tab "Đang theo dõi" là ?tab=following (chỉ khi đã đăng nhập, BE bắt đăng nhập) và không có bộ lọc.
  const [searchParams, setSearchParams] = useSearchParams();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isFollowingTab = isAuthenticated && searchParams.get("tab") === "following";
  const filters = parseFeedFilters(searchParams);
  // Tăng khi xóa bộ lọc để remount thanh lọc, xóa luôn chữ đang gõ trong ô tìm kiếm.
  const [filterBarKey, setFilterBarKey] = useState(0);
  const [showFollowList, setShowFollowList] = useState(false);

  const updateFilters = (patch) =>
    setSearchParams(
      (prev) => toFeedSearchParams({ ...parseFeedFilters(prev), ...patch }),
      { replace: true }
    );

  const showFollowingTab = (following) =>
    setSearchParams(following ? { tab: "following" } : {}, { replace: true });

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setFilterBarKey((k) => k + 1);
  };

  const allFeed = useBlogFeed({ ...filters, size: 10, enabled: !isFollowingTab });
  const followingFeed = useFollowingFeed({ size: 10, enabled: isFollowingTab });
  const {
    posts,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = isFollowingTab ? followingFeed : allFeed;

  // BE chỉ trả authorId -> gom id của mọi bài đang hiển thị rồi lấy tên + avatar một lượt.
  const { data: authors } = usePublicUsers(posts.map((p) => p.authorId));
  // Phủ vote của tôi lên feed (chỉ gọi khi đã đăng nhập).
  const { data: myVotes } = useMyVotes(posts.map((p) => p.id));

  return (
    <div className="min-h-dvh">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-6">
        <Reveal>
          <CommunityHero />
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)_300px]">
          <aside className="order-2 flex flex-col gap-6 lg:order-1 lg:sticky lg:top-24">
            <LeaderboardCard />
            <TrendingTopicsCard />
          </aside>

          <div className="order-1 flex flex-col gap-6 lg:order-2">
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <div role="tablist" className="flex items-center gap-2">
                  {[
                    { following: false, label: "Tất cả", icon: Rss },
                    { following: true, label: "Đang theo dõi", icon: Users },
                  ].map(({ following, label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      role="tab"
                      aria-selected={isFollowingTab === following}
                      onClick={() => showFollowingTab(following)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition",
                        isFollowingTab === following
                          ? "bg-brand text-brand-foreground"
                          : "bg-surface text-subtle hover:text-ink"
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                    </button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setShowFollowList(true)}
                >
                  <ListChecks className="size-4" />
                  Danh sách theo dõi
                </Button>
              </div>
            )}

            {!isFollowingTab && (
              <BlogFilterBar key={filterBarKey} filters={filters} onChange={updateFilters} />
            )}

            {isError ? (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error.message}
              </p>
            ) : isPending ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : posts.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-6 text-sm text-subtle">
                {isFollowingTab ? (
                  <>
                    <p>
                      Chưa có bài viết nào từ những người bạn theo dõi. Bấm “Theo dõi” cạnh tên tác giả
                      bạn thích ở tab Tất cả để thấy bài của họ ở đây.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => showFollowingTab(false)}
                    >
                      Xem tất cả bài viết
                    </Button>
                  </>
                ) : hasActiveFilters(filters) ? (
                  <>
                    <p>Không tìm thấy bài viết phù hợp với bộ lọc hiện tại.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={clearFilters}
                    >
                      Xóa bộ lọc
                    </Button>
                  </>
                ) : (
                  <p>Chưa có bài viết nào được đăng.</p>
                )}
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <Reveal key={post.id}>
                    <BlogPostCard
                      post={post}
                      author={authors?.get(post.authorId)}
                      myVote={myVotes?.get(post.id)}
                    />
                  </Reveal>
                ))}

                {hasNextPage && (
                  <Button
                    type="button"
                    variant="outline"
                    className="self-center"
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      "Xem thêm bài viết"
                    )}
                  </Button>
                )}
              </>
            )}
          </div>

          <aside className="order-3 flex flex-col gap-6 lg:sticky lg:top-24">
            <WeeklyChallengeCard />
            <AskBroccoliCard />
          </aside>
        </div>
      </main>

      {showFollowList && <FollowListDialog onClose={() => setShowFollowList(false)} />}

      <AppFooter />
    </div>
  );
}

function PostSkeleton() {
  return (
    <div
      aria-hidden
      className="animate-pulse rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-full bg-surface" />
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-surface" />
          <div className="h-3 w-20 rounded bg-surface" />
        </div>
      </div>
      <div className="mt-4 h-6 w-4/5 rounded bg-surface" />
      <div className="mt-4 aspect-[16/10] w-full rounded-2xl bg-surface" />
    </div>
  );
}
