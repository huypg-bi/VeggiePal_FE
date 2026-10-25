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

/** Accordion "Thông tin cá nhân" — nhận form từ usePersonalInfoForm. */
export default function EditPersonalInfoCard({ personal, highlightMissing = false }) {
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
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-ink">
                Thông tin cá nhân
              </h4>
              {highlightMissing && hasMissingMealPlanFields && (
                <span className="inline-flex items-center rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning">
                  Cần bổ sung
                </span>
              )}
            </div>
            <p className="text-[10px] text-subtle">
              Họ tên, ngày sinh, giới tính, mức vận động
            </p>
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
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="edit-birthDate" className="block font-semibold text-body">
                Ngày sinh
              </label>
              {missingBirthDate && (
                <span className="text-[10px] font-semibold text-warning">
                  * Bắt buộc cho Thực đơn AI
                </span>
              )}
            </div>
            <input
              id="edit-birthDate"
              type="date"
              autoComplete="bday"
              aria-invalid={Boolean(errors.birthDate)}
              className={cn(
                inputClass,
                missingBirthDate && "border-warning/80 bg-warning/5 ring-2 ring-warning/25 focus:border-warning",
              )}
              {...form.register("birthDate")}
            />
            {errors.birthDate && <span className={errorTextClass}>{errors.birthDate.message}</span>}
          </div>

          {/* Giới tính */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="edit-gender" className="block font-semibold text-body">
                Giới tính
              </label>
              {missingGender && (
                <span className="text-[10px] font-semibold text-warning">
                  * Bắt buộc cho Thực đơn AI
                </span>
              )}
            </div>
            <select
              id="edit-gender"
              aria-invalid={Boolean(errors.gender)}
              className={cn(
                inputClass,
                missingGender && "border-warning/80 bg-warning/5 ring-2 ring-warning/25 focus:border-warning",
              )}
              {...form.register("gender")}
            >
              <option value="">-- Chọn giới tính --</option>
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.gender && <span className={errorTextClass}>{errors.gender.message}</span>}
          </div>

          {/* Mức vận động */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="edit-activityLevel" className="block font-semibold text-body">
                Mức vận động
              </label>
              {missingActivity && (
                <span className="text-[10px] font-semibold text-warning">
                  * Bắt buộc cho Thực đơn AI
                </span>
              )}
            </div>
            <select
              id="edit-activityLevel"
              aria-invalid={Boolean(errors.activityLevel)}
              className={cn(
                inputClass,
                missingActivity && "border-warning/80 bg-warning/5 ring-2 ring-warning/25 focus:border-warning",
              )}
              {...form.register("activityLevel")}
            >
              <option value="">-- Chọn mức độ vận động --</option>
              {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.activityLevel && (
              <span className={errorTextClass}>{errors.activityLevel.message}</span>
            )}
          </div>

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
