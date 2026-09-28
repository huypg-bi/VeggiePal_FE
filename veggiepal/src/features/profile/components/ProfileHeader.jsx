import { useRef, useState } from "react";
import { Camera, Loader2, Sparkles, Mail, Phone, Calendar } from "lucide-react";

import { uploadAvatar } from "@/features/profile/api/profileApi";
import { cn } from "@/lib/utils";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=256";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

/**
 * Banner + avatar + meta cơ bản của user.
 * Avatar có nút upload gọi POST /users/me/avatar.
 */
export default function ProfileHeader({ profile, onAvatarUpdated }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const avatarSrc = profile?.avatarUrl || DEFAULT_AVATAR;
  const displayName = profile?.fullName?.trim() || "Người dùng VeggiePal";

  const handlePick = () => {
    if (uploading) return;
    fileRef.current?.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Chỉ chấp nhận JPEG, PNG hoặc WEBP");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Ảnh tối đa 2MB");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const updated = await uploadAvatar(file);
      onAvatarUpdated?.(updated);
    } catch (err) {
      setError(err.message || "Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-card shadow-sm">
      {/* Cover */}
      <div className="relative h-40 w-full overflow-hidden bg-emerald-900 sm:h-52">
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>VeggiePal Profile</span>
        </div>
      </div>

      {/* Meta */}
      <div className="relative px-5 pb-6 pt-0 sm:px-8">
        <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
          {/* Avatar */}
          <div className="relative -mt-14 sm:-mt-16">
            <img
              src={avatarSrc}
              alt={displayName}
              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md sm:h-32 sm:w-32"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
            <button
              type="button"
              onClick={handlePick}
              disabled={uploading}
              aria-label="Đổi ảnh đại diện"
              className={cn(
                "absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white shadow transition hover:bg-emerald-700",
                uploading && "opacity-70"
              )}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFile}
            />
          </div>

          <div className="min-w-0 flex-1 pb-1">
            <h1 className="truncate text-2xl font-bold text-ink sm:text-3xl">
              {displayName}
            </h1>
            <p className="mt-0.5 text-sm text-subtle">
              {profile?.role === "ADMIN" ? "Quản trị viên" : "Thành viên VeggiePal"}
              {profile?.emailVerified ? " · Email đã xác thực" : ""}
            </p>
          </div>
        </div>

        {error && (
          <p className="mb-3 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-body">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-emerald-600" />
            {profile?.email || "—"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-emerald-600" />
            {profile?.phone || "Chưa cập nhật SĐT"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-emerald-600" />
            {profile?.dateOfBirth
              ? `Sinh ngày ${formatDate(profile.dateOfBirth)}`
              : "Chưa cập nhật ngày sinh"}
          </span>
        </div>
      </div>
    </section>
  );
}
