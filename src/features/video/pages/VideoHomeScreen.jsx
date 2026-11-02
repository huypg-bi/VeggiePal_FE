import { useSearchParams } from "react-router-dom";

import { useCategories } from "@/features/blog/hooks/useCategories";
import { flattenCategories } from "@/features/blog/utils/feedFilters";
import TrendingVideoGrid from "@/features/video/components/TrendingVideoGrid";
import VideoBanner from "@/features/video/components/VideoBanner";
import VideoChannelBar from "@/features/video/components/VideoChannelBar";
import { useVideoFeed } from "@/features/video/hooks/useVideos";
import { useMyVideoVotes } from "@/features/video/hooks/useVideoVotes";
import AppHeader from "@/shared/components/AppHeader";
import Reveal from "@/shared/components/Reveal";
import { usePublicUsers } from "@/shared/hooks/usePublicUsers";

export default function VideoHomeScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const activeCategoryId =
    categoryParam && /^[1-9]\d*$/.test(categoryParam)
      ? Number(categoryParam)
      : null;

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

  const { data: authors } = usePublicUsers(videos.map((v) => v.authorId));
  const { data: myVotes } = useMyVideoVotes(videos.map((v) => v.id));

  const setCategory = (id) => {
    if (!id) {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ category: String(id) }, { replace: true });
    }
  };

  return (
    <div className="min-h-dvh">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-6">
        <Reveal>
          <VideoBanner />
        </Reveal>

        <Reveal>
          <VideoChannelBar />
        </Reveal>

        <TrendingVideoGrid
          videos={videos}
          authors={authors}
          myVotes={myVotes}
          isPending={isPending}
          isError={isError}
          error={error}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          hasFilter={activeCategoryId !== null}
          onClearFilter={() => setCategory(null)}
          categories={categories}
          activeCategoryId={activeCategoryId}
          onCategoryChange={setCategory}
        />
      </main>
    </div>
  );
}
