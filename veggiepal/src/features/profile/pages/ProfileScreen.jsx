import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import HomeHeader from "@/features/home/components/HomeHeader";
import HomeFooter from "@/features/home/components/HomeFooter";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getProfile } from "@/features/profile/api/profileApi";

import ProfileHeader from "@/features/profile/components/ProfileHeader";
import ProfileInfoForm from "@/features/profile/components/ProfileInfoForm";
import ChangePasswordForm from "@/features/profile/components/ChangePasswordForm";
import HealthRecordSection from "@/features/profile/components/HealthRecordSection";
import AllergySection from "@/features/profile/components/AllergySection";

/**
 * Trang hồ sơ cá nhân (/profile).
 * - Header + footer dùng chung layout home
 * - Load GET /users/me
 * - Các section: thông tin, mật khẩu, sức khỏe, dị ứng
 */
export default function ProfileScreen() {
  const authUser = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const syncAuthUser = useCallback(
    (p) => {
      if (!p || !token) return;
      // Giữ token, cập nhật user trong store (fullName / avatar hiển thị header)
      setAuth({
        token,
        user: {
          id: p.id,
          email: p.email,
          fullName: p.fullName,
          role: p.role,
          avatarUrl: p.avatarUrl,
        },
      });
    },
    [setAuth, token]
  );

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProfile();
      setProfile(data);
      syncAuthUser(data);
    } catch (err) {
      setError(err.message || "Không tải được hồ sơ");
      // fallback nhẹ từ auth store nếu API lỗi
      if (authUser) {
        setProfile({
          id: authUser.id,
          email: authUser.email,
          fullName: authUser.fullName,
          role: authUser.role,
          phone: null,
          avatarUrl: authUser.avatarUrl || null,
          dateOfBirth: null,
          emailVerified: false,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [authUser, syncAuthUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileUpdated = (updated) => {
    setProfile(updated);
    syncAuthUser(updated);
  };

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
                  onAvatarUpdated={handleProfileUpdated}
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <ProfileInfoForm
                    profile={profile}
                    onUpdated={handleProfileUpdated}
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
