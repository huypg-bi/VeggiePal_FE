import { AlertCircle, ChevronDown, ChevronUp, Loader2, Save, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ACTIVITY_LEVEL_OPTIONS,
  GENDER_OPTIONS,
  accordionBodyClass,
  accordionHeaderClass,
  cardClass,
  errorBoxClass,
  errorTextClass,
  iconBoxClass,
  inputClass,
  labelClass,
  successBoxClass,
} from "@/features/profile/utils/editProfileConstants";

/** Accordion "Thông tin cá nhân" (họ tên, số điện thoại) — nhận form từ usePersonalInfoForm. */
export default function EditPersonalInfoCard({ personal }) {
  const { form, profile, updateProfile, open, toggleOpen, saving, profileLoading } = personal;
  const { errors, isDirty } = form.formState;

  const [birthDate, gender, activityLevel] = form.watch([
    "birthDate",
    "gender",
    "activityLevel",
  ]);

  const missingBirthDate = highlightMissing && !birthDate;
  const missingGender = highlightMissing && !gender;
  const missingActivity = highlightMissing && !activityLevel;
  const hasMissingMealPlanFields = missingBirthDate || missingGender || missingActivity;

  return (
    <div
      id="personal-info-card"
      className={cn(
        cardClass,
        "overflow-hidden transition-all scroll-mt-24",
        highlightMissing && hasMissingMealPlanFields && "ring-2 ring-warning/60 border-warning/50 shadow-md",
      )}
    >
      <button type="button" onClick={toggleOpen} className={accordionHeaderClass}>
        <div className="flex items-center gap-3">
          <div className={cn(iconBoxClass, highlightMissing && hasMissingMealPlanFields && "bg-warning/15 text-warning")}>
            <User className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-ink">
              Thông tin cá nhân
            </h4>
            <p className="text-[10px] text-subtle">Họ tên, số điện thoại</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-subtle" />
        ) : (
          <ChevronDown className="h-4 w-4 text-subtle" />
        )}
      </button>

      {open && (
        <form onSubmit={form.handleSubmit(personal.onSubmit)} className={accordionBodyClass}>
          {highlightMissing && hasMissingMealPlanFields && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-warning/40 bg-warning/10 p-3.5 text-xs text-ink">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-warning" />
              <div>
                <p className="font-semibold text-warning">
                  Hồ sơ chưa đủ thông tin cho Thực đơn AI
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-subtle">
                  Bé Bông Cải cần ngày sinh, giới tính và mức vận động để tính chính xác nhu cầu calo (TDEE).
                  Vui lòng điền các mục được đánh dấu viền vàng bên dưới rồi bấm <b>Lưu thay đổi</b>.
                </p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="edit-fullName" className={labelClass}>
              Họ và tên
            </label>
            <input
              id="edit-fullName"
              type="text"
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
              className={inputClass}
              {...form.register("fullName")}
            />
            {errors.fullName && <span className={errorTextClass}>{errors.fullName.message}</span>}
          </div>

          <div>
            <label htmlFor="edit-phone" className={labelClass}>
              Số điện thoại
            </label>
            <input
              id="edit-phone"
              type="text"
              autoComplete="tel"
              placeholder="Để trống nếu muốn xóa"
              aria-invalid={Boolean(errors.phone)}
              className={inputClass}
              {...form.register("phone")}
            />
            {errors.phone && <span className={errorTextClass}>{errors.phone.message}</span>}
          </div>

          {/* Ngày sinh */}
          <div>
            <label htmlFor="edit-email" className={labelClass}>
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              value={profile?.email || ""}
              readOnly
              disabled
              className="w-full rounded-2xl border border-border bg-surface/80 px-3.5 py-2.5 text-xs text-subtle cursor-not-allowed"
            />
            <span className="text-[10px] text-subtle mt-1 block">
              Email không thể thay đổi tại đây
            </span>
          </div>

          {errors.root && <p className={errorBoxClass}>{errors.root.message}</p>}
          {updateProfile.isSuccess && !errors.root && !isDirty && (
            <p className={successBoxClass}>Đã cập nhật thông tin cá nhân thành công.</p>
          )}

          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={saving || profileLoading}
            className="rounded-xl gap-1.5 font-semibold cursor-pointer"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </Button>
        </form>
      )}
    </div>
  );
}
