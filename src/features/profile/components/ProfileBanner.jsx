import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit3, CheckCircle, Video, Users, Bookmark, Activity } from "lucide-react";

export default function ProfileBanner({ profile }) {
  const navigate = useNavigate();

  const displayName = profile?.fullName || profile?.username || "Minh Thuận";
  const username = profile?.username || "minhthuan_vegaschef";
  const avatarUrl =
    profile?.avatarUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="mb-2">
      {/* Cover Image */}
      <div className="relative h-52 w-full overflow-hidden rounded-3xl shadow-sm sm:h-64 md:h-72">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80"
          alt="Nature Cottage Cover"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Profile Card Container */}
      <div className="relative z-10 -mt-16 mx-2 rounded-3xl border border-stone-100 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:-mt-20 sm:mx-6 sm:p-7">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-emerald-50 shadow-md dark:border-stone-800 dark:bg-stone-800 sm:h-28 sm:w-28">
              <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
            </div>

            <div>
              <div className="mb-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{displayName}</h1>
                <CheckCircle className="h-5 w-5 fill-emerald-500 text-white" />
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Đầu Bếp Chay Sáng Tạo
                </span>
              </div>
              <p className="mb-2 text-xs font-medium text-stone-400 dark:text-stone-500">@{username}</p>
              <p className="max-w-xl text-xs leading-relaxed text-stone-600 dark:text-stone-300 sm:text-sm">
                • Đam mê sáng tạo món chay mục dưỡng WFPB & ứng dụng AI nấu nướng 🌿 • Đồng hành cùng thói quen sống xanh không rác thải.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all sm:text-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Tạo Blog & Video Mới
            </button>

            {/* NÚT ĐIỀU HƯỚNG ĐẾN TRANG /profile/edit */}
            <button
              type="button"
              onClick={() => navigate("/profile/edit")}
              className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 transition-all sm:text-sm cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
              Sửa hồ sơ
            </button>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-stone-100 pt-5 dark:border-stone-800 md:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-800/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-stone-800 dark:text-stone-100">142</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">Bài viết & Video</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-800/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-stone-800 dark:text-stone-100">3.8k</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">Người theo dõi</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-800/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-stone-800 dark:text-stone-100">12.4k</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">Lượt lưu công thức</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50/70 p-3 dark:border-stone-800 dark:bg-stone-800/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-stone-800 dark:text-stone-100">
                20.8 <span className="text-xs font-normal text-stone-500 dark:text-stone-400">Tỷ lệ Veg</span>
              </div>
              <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Chỉ số BMI chuẩn</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}