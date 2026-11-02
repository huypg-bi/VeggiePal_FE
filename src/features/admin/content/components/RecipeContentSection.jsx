import { useMemo, useState } from "react";

import ContentSearchBox from "@/features/admin/content/components/ContentSearchBox";
import ContentStatusFilter from "@/features/admin/content/components/ContentStatusFilter";
import ContentTable from "@/features/admin/content/components/ContentTable";
import { useAdminRecipes } from "@/features/admin/content/hooks/useAdminContent";
import { formatCount } from "@/features/admin/content/utils/contentFormat";
import { getRecipeStatusInfo, RECIPE_STATUS_FILTERS } from "@/features/my-content/utils/statusInfo";
import { useDeleteRecipe } from "@/features/recipe/hooks/useRecipeMutations";

const COLUMNS = [
  { key: "servings", label: "Khẩu phần", align: "right", render: (recipe) => formatCount(recipe.servings) },
  { key: "favorites", label: "Lượt lưu", align: "right", render: (recipe) => formatCount(recipe.favoriteCount) },
];

const getAuthorId = (recipe) => recipe.userId;
const getViewHref = (recipe) => `/recipes/${recipe.id}`;
const getPublishedAt = (recipe) => recipe.publishedAt ?? recipe.createdAt;

// Tab "Công thức": công thức ở mọi trạng thái (GET /admin/recipes), lọc trạng thái và tìm từ khóa ở BE; BE chưa có duyệt công thức nên chỉ xem và xóa.
export default function RecipeContentSection() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const { data, isPending, isFetching, isError, error } = useAdminRecipes({ status, keyword, page });
  const deleteRecipe = useDeleteRecipe();
  const items = useMemo(() => data?.items ?? [], [data]);

  // Xóa hết công thức ở trang cuối thì lùi về trang trước (đặt lại theo dữ liệu mới, không dùng effect).
  if (data && page > 0 && page >= data.totalPages) setPage(Math.max(data.totalPages - 1, 0));

  return (
    <section aria-label="Quản lý công thức" className="flex flex-col gap-4">
      <ContentSearchBox
        placeholder="Tìm công thức theo tên..."
        ariaLabel="Tìm công thức"
        onChange={(value) => {
          setKeyword(value);
          setPage(0);
        }}
      />
      <ContentStatusFilter
        options={RECIPE_STATUS_FILTERS}
        value={status}
        onChange={(value) => {
          setStatus(value);
          setPage(0);
        }}
      />
      <ContentTable
        items={items}
        columns={COLUMNS}
        noun="công thức"
        deleteNote="sẽ bị gỡ khỏi trang công khai và không thể khôi phục."
        getAuthorId={getAuthorId}
        getViewHref={getViewHref}
        getPublishedAt={getPublishedAt}
        getStatusInfo={getRecipeStatusInfo}
        deleteMutation={deleteRecipe}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        onPageChange={setPage}
        isPending={isPending}
        isFetching={isFetching}
        isError={isError}
        error={error}
        emptyText={keyword || status ? "Không có công thức nào khớp bộ lọc." : "Chưa có công thức nào."}
      />
    </section>
  );
}
