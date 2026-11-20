import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Edit3,
  Video,
  Users,
  UserCheck,
  Bookmark,
  Activity,
  Crown,
  History,
} from "lucide-react";

import profileBg from "@/assets/img/profile_bg.jpg";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/authStore";
import FollowListDialog from "@/features/blog/components/FollowListDialog";
import { useFollowStats } from "@/features/blog/hooks/useFollow";
import GreenHeartBadge from "@/features/profile/components/GreenHeartBadge";
import { useFavoriteRecipes } from "@/features/recipe/hooks/useRecipeFavorites";
import { useProfileStats } from "@/features/profile/hooks/useProfileStats";
import { useMySubscription } from "@/features/payment/hooks/useMySubscription";
import { formatDate } from "@/features/payment/utils/paymentFormat";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=256";

export default function ProfileBanner({ profile }) {
  const navigate = useNavigate();
  const stats = useProfileStats();
  const { subscription } = useMySubscription();
  const [followDialogKind, setFollowDialogKind] = useState(null);

  const authUser = useAuthStore((s) => s.user);
  const userId = profile?.id ?? authUser?.id;
  const { data: followStats, isLoading: isFollowStatsLoading } = useFollowStats(userId);
  // Chỉ cần tổng số nên xin 1 mục.
  const { data: favoritePage, isPending: isFavoritesPending } = useFavoriteRecipes({ size: 1 });

  const displayName = profile?.fullName?.trim() || "Người dùng VeggiePal";
  const avatarUrl = profile?.avatarUrl || DEFAULT_AVATAR;

  const { latest } = stats;
  const totalPosts = stats.loading ? "…" : stats.blogTotal + stats.recipeTotal;
  const followersCount = isFollowStatsLoading && !followStats ? "…" : (followStats?.followers ?? 0).toLocaleString("vi-VN");
  const savedRecipesCount = isFavoritesPending ? "…" : (favoritePage?.totalElements ?? 0).toLocaleString("vi-VN");
  const followingCount = isFollowStatsLoading && !followStats ? "…" : (followStats?.following ?? 0).toLocaleString("vi-VN");

  return (
    <div className="mb-2">
      {/* Ảnh bìa: căn lệch lên trên để thấy núi và mặt hồ, phần dưới bị thẻ hồ sơ che */}
      <div className="relative h-52 w-full overflow-hidden rounded-3xl shadow-sm sm:h-64 md:h-72">
        <img
          src={profileBg}
          alt="Ảnh bìa hồ sơ"
          className="h-full w-full object-cover object-[center_40%]"
        />
      </div>

      {/* Profile Card Container */}
      <div className="relative z-10 -mt-16 mx-2 rounded-3xl border border-border bg-card p-5 shadow-sm sm:-mt-20 sm:mx-6 sm:p-7">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-card bg-surface shadow-md sm:h-28 sm:w-28">
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            </div>

            <div>
              <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-bold text-ink">{displayName}</h1>
                {/* Trái tim thử thách 7 ngày: chỉ icon, tên huy hiệu nằm ở tooltip */}
                <GreenHeartBadge userId={userId} className="size-5" />
              </div>
              {/* @username: chỉ hiển thị khi có trường username */}
              {profile?.username && (
                <p className="mb-2 text-xs font-medium text-subtle">
                  @{profile.username}
                </p>
              )}
              {/* Bio cố định (chưa có trường bio ở BE) */}
              <p className="max-w-xl text-xs leading-relaxed text-body sm:text-sm">
                • Đam mê sáng tạo món chay giàu dinh dưỡng &amp; ứng dụng AI vào nấu nướng 🌿
                <br />
                • Đồng hành cùng thói quen sống xanh và ăn uống lành mạnh 🥗
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-2 md:items-end">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Nút Sửa hồ sơ -> điều hướng sang /profile/edit */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile/edit")}
                className="rounded-full gap-2 cursor-pointer font-semibold"
              >
                <Edit3 className="h-4 w-4" />
                Sửa hồ sơ
              </Button>

              {/* Nút Lịch sử thanh toán */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate("/payment/history")}
                className="rounded-full gap-1.5 cursor-pointer font-medium text-subtle hover:text-ink"
              >
                <History className="h-4 w-4" />
                Lịch sử gói
              </Button>
            </div>
            {/* Gói thành viên hiện tại, nằm dưới hai nút */}
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-700 transition hover:opacity-85 dark:text-amber-400"
            >
              <Crown className="size-3.5 text-amber-500" />
              Gói {subscription?.planCode || "FREE"}
              {subscription?.expiresAt && ` (Hạn: ${formatDate(subscription.expiresAt)})`}
            </Link>
          </div>
        </div>

        {/* 5 Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 sm:grid-cols-3 lg:grid-cols-5">
          {/* 1. Bài viết & Video lấy từ tổng thực tế /blogs/me và /recipes/me */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-ink">{totalPosts}</div>
              <div className="text-xs text-subtle">Bài viết &amp; Video</div>
            </div>
          </div>

          {/* 2. Người theo dõi: lấy từ GET /users/{id}/follow-stats, bấm mở danh sách */}
          <button
            type="button"
            onClick={() => setFollowDialogKind("followers")}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left transition hover:border-brand/40 hover:bg-surface/80 cursor-pointer"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-ink">{followersCount}</div>
              <div className="text-xs text-subtle">Người theo dõi</div>
            </div>
          </button>

          {/* 3. Đang theo dõi: lấy từ GET /users/{id}/follow-stats, bấm mở danh sách */}
          <button
            type="button"
            onClick={() => setFollowDialogKind("following")}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left transition hover:border-brand/40 hover:bg-surface/80 cursor-pointer"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-ink">{followingCount}</div>
              <div className="text-xs text-subtle">Đang theo dõi</div>
            </div>
          </button>

          {/* 4. Công thức đã lưu: tổng số trong GET /recipes/favorites */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-ink">{savedRecipesCount}</div>
              <div className="text-xs text-subtle">Công thức đã lưu</div>
            </div>
          </div>

          {/* 5. Thẻ BMI: lấy từ health record mới nhất */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 col-span-2 sm:col-span-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-ink">
                {latest?.bmi != null ? Number(latest.bmi).toFixed(1) : "—"}
              </div>
              <div className="text-xs font-normal text-subtle">BMI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hộp thoại danh sách người theo dõi / đang theo dõi */}
      {followDialogKind && (
        <FollowListDialog
          userId={userId ?? "me"}
          initialKind={followDialogKind}
          onClose={() => setFollowDialogKind(null)}
        />
      )}
    </div>
  );
}
