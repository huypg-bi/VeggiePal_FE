import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useCategories } from "@/features/blog/hooks/useCategories";
import { flattenCategories } from "@/features/blog/utils/feedFilters";
import TrendingVideoGrid from "@/features/video/components/TrendingVideoGrid";
import VideoBanner from "@/features/video/components/VideoBanner";
import VideoSearchBar from "@/features/video/components/VideoSearchBar";
import { useVideoFeed } from "@/features/video/hooks/useVideos";
import { useMyVideoVotes } from "@/features/video/hooks/useVideoVotes";
import AppHeader from "@/shared/components/AppHeader";
import Reveal from "@/shared/components/Reveal";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";
import { textIncludes } from "@/shared/utils/text";

export default function VideoHomeScreen() {
  // Danh mục (?category=) và từ khóa (?q=) nằm trên URL để quay lại từ trang chi tiết vẫn giữ nguyên.
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const activeCategoryId =
    categoryParam && /^[1-9]\d*$/.test(categoryParam)
      ? Number(categoryParam)
      : null;
  const keyword = (searchParams.get("q") ?? "").trim();
  // Tăng khi xóa bộ lọc để remount ô tìm kiếm, xóa luôn chữ đang gõ.
  const [searchBarKey, setSearchBarKey] = useState(0);

  const { data: categoryTree } = useCategories({ activeOnly: true });
  const categories = flattenCategories(categoryTree);

  const {
    videos,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useVideoFeed({ categoryId: activeCategoryId, size: 12 });

  // BE chưa có tham số tìm kiếm cho video nên lọc theo tiêu đề ở FE; khi đang tìm thì tải nốt các trang còn lại.
  useEffect(() => {
    if (keyword && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [keyword, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const visibleVideos = useMemo(
    () => (keyword ? videos.filter((v) => textIncludes(v.title, keyword)) : videos),
    [videos, keyword]
  );
  // Còn trang chưa tải mà chưa có kết quả thì vẫn hiện khung chờ, tránh báo "không tìm thấy" quá sớm.
  const isSearching = Boolean(keyword) && hasNextPage && visibleVideos.length === 0;

  const { data: authors } = usePublicUsers(visibleVideos.map((v) => v.authorId));
  const { data: myVotes } = useMyVideoVotes(visibleVideos.map((v) => v.id));

  const updateParams = (patch) => {
    const category = "category" in patch ? patch.category : activeCategoryId;
    const q = "q" in patch ? patch.q : keyword;
    const next = {};
    if (category) next.category = String(category);
    if (q) next.q = q;
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setSearchBarKey((k) => k + 1);
  };

  return (
    <div className="min-h-dvh">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-6">
        <Reveal>
          <VideoBanner />
        </Reveal>

        <Reveal>
          <VideoSearchBar
            key={searchBarKey}
            keyword={keyword}
            onChange={(q) => updateParams({ q })}
          />
        </Reveal>

        <TrendingVideoGrid
          videos={visibleVideos}
          authors={authors}
          myVotes={myVotes}
          isPending={isPending || isSearching}
          isError={isError}
          error={error}
          hasNextPage={hasNextPage && !keyword}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          keyword={keyword}
          hasFilter={activeCategoryId !== null || Boolean(keyword)}
          onClearFilter={clearFilters}
          categories={categories}
          activeCategoryId={activeCategoryId}
          onCategoryChange={(category) => updateParams({ category })}
        />
      </main>
    </div>
  );
}
