import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit3, CheckCircle, Video, Users, Bookmark, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProfileStats } from "@/features/profile/hooks/useProfileStats";
import { bmiInfo } from "@/features/profile/utils/editProfileHelpers";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=256";

export default function ProfileBanner({ profile }) {
  const navigate = useNavigate();
  const stats = useProfileStats();

  const displayName = profile?.fullName?.trim() || "Người dùng VeggiePal";
  const avatarUrl = profile?.avatarUrl || DEFAULT_AVATAR;

  const { latest } = stats;
  const bmi = bmiInfo(latest?.bmi);
  const totalPosts = stats.loading ? "…" : stats.blogTotal + stats.recipeTotal;

  return (
    <div className="mb-2">
      {/* Cover Image — Giữ nguyên theo P3 */}
      <div className="relative h-52 w-full overflow-hidden rounded-3xl shadow-sm sm:h-64 md:h-72">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80"
          alt="Nature Cottage Cover"
          className="h-full w-full object-cover"
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
                <CheckCircle className="h-5 w-5 fill-brand text-brand-foreground" />
                {/* Danh hiệu — Giữ nguyên theo P3 */}
                <span className="rounded-full border border-brand/30 bg-brand-soft px-3 py-0.5 text-xs font-semibold text-brand">
                  Đầu Bếp Chay Sáng Tạo
                </span>
              </div>
              {/* @username: chỉ hiển thị khi có trường username */}
              {profile?.username && (
                <p className="mb-2 text-xs font-medium text-subtle">
                  @{profile.username}
                </p>
              )}
              {/* Bio — Giữ nguyên theo P3 */}
              <p className="max-w-xl text-xs leading-relaxed text-body sm:text-sm">
                • Đam mê sáng tạo món chay mục dưỡng WFPB &amp; ứng dụng AI nấu nướng 🌿 • Đồng hành cùng thói quen sống xanh không rác thải.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {/* Nút Tạo Blog & Video Mới -> điều hướng sang /blog/new */}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => navigate("/blog/new")}
              className="rounded-full gap-2 cursor-pointer font-semibold shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Tạo Blog &amp; Video Mới
            </Button>

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
          </div>
        </div>

        {/* 4 Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 md:grid-cols-4">
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

          {/* 2. Followers — Giữ nguyên theo P3 */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-ink">3.8k</div>
              <div className="text-xs text-subtle">Người theo dõi</div>
            </div>
          </div>

          {/* 3. Lượt lưu — Giữ nguyên theo P3 */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-ink">12.4k</div>
              <div className="text-xs text-subtle">Lượt lưu công thức</div>
            </div>
          </div>

          {/* 4. Thẻ BMI: lấy từ health record mới nhất */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-ink">
                {latest?.bmi != null ? Number(latest.bmi).toFixed(1) : "—"}{" "}
                <span className="text-xs font-normal text-subtle">BMI</span>
              </div>
              <div className={`text-xs font-medium ${latest ? bmi.textClass : "text-subtle"}`}>
                {latest ? `Chỉ số BMI ${bmi.text.toLowerCase()}` : "Chưa có chỉ số"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}