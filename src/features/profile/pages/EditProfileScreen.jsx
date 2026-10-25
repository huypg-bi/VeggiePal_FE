import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import AppHeader from "@/shared/components/AppHeader";
import AppFooter from "@/shared/components/AppFooter";
import Reveal from "@/shared/components/Reveal";

import EditProfileHeader from "@/features/profile/components/EditProfileHeader";
import EditAvatarCard from "@/features/profile/components/EditAvatarCard";
import EditPersonalInfoCard from "@/features/profile/components/EditPersonalInfoCard";
import EditPasswordCard from "@/features/profile/components/EditPasswordCard";
import EditQuoteCard from "@/features/profile/components/EditQuoteCard";
import EditHealthCard from "@/features/profile/components/EditHealthCard";
import EditAllergyCard from "@/features/profile/components/EditAllergyCard";
import EditActionBar from "@/features/profile/components/EditActionBar";
import { usePersonalInfoForm } from "@/features/profile/hooks/usePersonalInfoForm";
import { useAllergyDraft } from "@/features/profile/hooks/useAllergyDraft";
import { useEditProfileActions } from "@/features/profile/hooks/useEditProfileActions";

export default function EditProfileScreen() {
  const [searchParams] = useSearchParams();
  // Chuyển tới từ lỗi 6020 PROFILE_INCOMPLETE khi tạo thực đơn AI:
  // URL dạng /profile/edit?from=6020 hoặc ?highlight=profile_incomplete
  const isFromIncompleteProfile =
    searchParams.get("from") === "6020" ||
    searchParams.get("incomplete") === "1" ||
    searchParams.get("highlight") === "profile_incomplete";

  // Form cá nhân + lựa chọn dị ứng nằm ở đây vì nút "Lưu thông tin" cuối trang lưu cả hai.
  const personal = usePersonalInfoForm();
  const allergy = useAllergyDraft();
  const actions = useEditProfileActions({ personal, allergy });

  useEffect(() => {
    if (isFromIncompleteProfile) {
      personal.openSection();
      const el = document.getElementById("personal-info-card");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      toast.warning(
        "Hồ sơ của bạn chưa đủ ngày sinh, giới tính hoặc mức vận động để tính mục tiêu calo cho Thực đơn AI. Vui lòng bổ sung các trường được làm nổi bật bên dưới nhé!",
        { id: "profile-incomplete-toast", duration: 7000 },
      );
    }
  }, [isFromIncompleteProfile]);

  return (
    <div className="min-h-dvh bg-canvas transition-colors duration-200">
      <AppHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-6 text-ink">
        <Reveal>
          <EditProfileHeader profile={personal.profile} />
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cột trái (4/12) */}
          <div className="lg:col-span-4 space-y-5">
            <Reveal>
              <EditAvatarCard
                profile={personal.profile}
                loading={personal.profileLoading}
                error={personal.profileError}
              />
            </Reveal>

            <span className="block text-[11px] font-bold tracking-wider text-subtle uppercase ml-2">
              Giới thiệu
            </span>

            <Reveal>
              <EditPersonalInfoCard
                personal={personal}
                highlightMissing={isFromIncompleteProfile}
              />
            </Reveal>
            <Reveal><EditPasswordCard /></Reveal>
            <Reveal><EditQuoteCard /></Reveal>
          </div>

          {/* Cột phải (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            <Reveal><EditHealthCard /></Reveal>
            <Reveal><EditAllergyCard allergy={allergy} /></Reveal>
          </div>
        </div>

        <Reveal>
          <EditActionBar
            status={actions.status}
            saving={actions.saving}
            onSave={actions.saveAll}
            onCancel={actions.cancel}
          />
        </Reveal>
      </main>

      <AppFooter />
    </div>
  );
}
