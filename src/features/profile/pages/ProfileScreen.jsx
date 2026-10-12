import { useState } from "react";
import { Loader2, ArrowLeft, Settings2 } from "lucide-react";

import AppHeader from "@/shared/components/AppHeader";
import AppFooter from "@/shared/components/AppFooter";
import Reveal from "@/shared/components/Reveal";
import { useProfile } from "@/features/profile/hooks/useProfile";

// Các form chỉnh sửa và nghiệp vụ cũ sẵn có
import ProfileHeader from "@/features/profile/components/ProfileHeader";

import ProfileInfoForm from "@/features/profile/components/ProfileInfoForm";
import ChangePasswordForm from "@/features/profile/components/ChangePasswordForm";
import HealthRecordSection from "@/features/profile/components/HealthRecordSection";
import AllergySection from "@/features/profile/components/AllergySection";
import Reveal from "@/shared/components/Reveal";


// Các component giao diện tổng quan mới theo thiết kế
import ProfileBanner from "@/features/profile/components/ProfileBanner";
import ProfileTabs from "@/features/profile/components/ProfileTabs";
import DailyNutritionCard from "@/features/profile/components/DailyNutritionCard";
import FavoritesCard from "@/features/profile/components/FavoritesCard";
import GreenBadgesCard from "@/features/profile/components/GreenBadgesCard";
import CreatePostBox from "@/features/profile/components/CreatePostBox";
import RecipeFeedCard from "@/features/profile/components/RecipeFeedCard";
import BmiTrackerCard from "@/features/profile/components/BmiTrackerCard";

/**
 * 
/**
 * Trang hồ sơ cá nhân (/profile).
 * - Header + footer dùng chung layout app
 * - Load GET /users/me (qua useProfile)
 * - Các section: thông tin, mật khẩu, sức khỏe, dị ứng
 * 
 * 
 * Trang hồ sơ cá nhân (/profile).
 * - AppHeader & AppFooter giữ nguyên chuẩn layout
 * - Chế độ Mặc định: Hiển thị giao diện tổng quan 2 cột theo thiết kế
 * - Chế độ Sửa (isEditing): Hiển thị các form chỉnh sửa thông tin, mật khẩu, sức khỏe, dị ứng
 */
export default function ProfileScreen() {
  const { profile, loading, error } = useProfile();

  // State điều khiển chế độ xem tổng quan hoặc chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="min-h-dvh bg-[#FBF8F2]">
      {/* Giữ nguyên Header ứng dụng */}
      <AppHeader />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-subtle">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            Đang tải hồ sơ…
          </div>
        ) : (
          <>
            {error && !profile && (
              <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            {/* Banner hồ sơ trên cùng (Truyền profile thật và nút mở chỉnh sửa) */}
            <Reveal>
              <ProfileBanner
                profile={profile}
                onEditClick={() => setIsEditing(!isEditing)}
                isEditing={isEditing}
              />
            </Reveal>

            {/* CHẾ ĐỘ 1: BẤM "SỬA HỒ SƠ" -> HIỆN CÁC FORM CŨ ĐỂ NHẬP LIỆU */}
            {isEditing ? (
              <Reveal>
                <div className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-5 w-5 text-emerald-600" />
                      <h2 className="text-lg font-bold text-stone-800">
                        Cài đặt & Chỉnh sửa hồ sơ
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1.5 rounded-xl bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-200"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Quay lại trang cá nhân
                    </button>
                  </div>

                  {/* Form thông tin cá nhân & đổi mật khẩu */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <ProfileInfoForm profile={profile} />
                    <ChangePasswordForm />
                  </div>

                  {/* Bản ghi sức khỏe & dị ứng */}
                  <div className="space-y-6 pt-4">
                    <HealthRecordSection />
                    <AllergySection />
                  </div>
                </div>
              </Reveal>
            ) : (
              /* CHẾ ĐỘ 2: MẶC ĐỊNH -> HIỆN GIAO DIỆN TỔNG QUAN THEO ẢNH THIẾT KẾ */
              <>
                {/* Thanh điều hướng Tab */}
                <Reveal>
                  <ProfileTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                </Reveal>

                {/* Bố cục 2 cột */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                  {/* CỘT TRÁI (4/12): Dinh dưỡng hôm nay, Bộ sưu tập, Huy hiệu */}
                  <div className="space-y-5 lg:col-span-4">
                    <Reveal>
                      <DailyNutritionCard />
                    </Reveal>
                    <Reveal>
                      <FavoritesCard />
                    </Reveal>
                    <Reveal>
                      <GreenBadgesCard />
                    </Reveal>
                  </div>

                  {/* CỘT PHẢI (8/12): Khung đăng bài, Bài đăng món ăn, Biểu đồ BMI */}
                  <div className="space-y-5 lg:col-span-8">
                    <Reveal>
                      <CreatePostBox />
                    </Reveal>
                    <Reveal>
                      <RecipeFeedCard />
                    </Reveal>
                    <Reveal>
                      <BmiTrackerCard />
                    </Reveal>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Giữ nguyên Footer ứng dụng */}
      <AppFooter />
    </div>
  );
}