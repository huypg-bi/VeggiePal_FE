import { Loader2 } from "lucide-react";

import HomeHeader from "@/features/home/components/HomeHeader";
import HomeFooter from "@/features/home/components/HomeFooter";
import { useProfile } from "@/features/profile/hooks/useProfile";

import ProfileHeader from "@/features/profile/components/ProfileHeader";
import ProfileInfoForm from "@/features/profile/components/ProfileInfoForm";
import ChangePasswordForm from "@/features/profile/components/ChangePasswordForm";
import HealthRecordSection from "@/features/profile/components/HealthRecordSection";
import AllergySection from "@/features/profile/components/AllergySection";

/**
 * Trang hồ sơ cá nhân (/profile).
 * - Header + footer dùng chung layout home
 * - Load GET /users/me (qua useProfile)
 * - Các section: thông tin, mật khẩu, sức khỏe, dị ứng
 */
export default function ProfileScreen() {
  const { profile, loading, error, updateProfile } = useProfile();

  return (
    <div className="min-h-dvh bg-canvas">
      <HomeHeader />

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

            {profile && (
              <>
                <ProfileHeader
                  profile={profile}
                  onAvatarUpdated={updateProfile}
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <ProfileInfoForm
                    profile={profile}
                    onUpdated={updateProfile}
                  />
                  <ChangePasswordForm />
                </div>

                <HealthRecordSection />
                <AllergySection />
              </>
            )}
          </>
        )}
      </main>

      <HomeFooter />
    </div>
  );
}
