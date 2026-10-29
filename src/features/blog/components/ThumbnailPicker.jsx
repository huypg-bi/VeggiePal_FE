import { useEffect, useRef, useState } from "react";
import { ImageOff, ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { THUMBNAIL_TYPES, validateThumbnail } from "@/features/blog/utils/blogForm";
import FallbackImage from "@/shared/components/FallbackImage";

/** Chọn ảnh (xem trước, đổi, bỏ). Mặc định là ảnh bìa blog; công thức truyền `acceptTypes`, `validate`, `label`, `hint` riêng. */
export default function ThumbnailPicker({
  currentUrl,
  onChange,
  acceptTypes = THUMBNAIL_TYPES,
  validate = validateThumbnail,
  label = "Ảnh bìa",
  hint = "JPEG, PNG hoặc WEBP, tối đa 5MB",
}) {
  const inputRef = useRef(null);
  const previewRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  // Giải phóng URL tạm của ảnh xem trước khi rời trang.
  useEffect(() => () => previewRef.current && URL.revokeObjectURL(previewRef.current), []);

  const setPreviewUrl = (url) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = url;
    setPreview(url);
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // cho phép chọn lại đúng file vừa bỏ
    if (!file) return;

    const message = validate(file);
    setError(message ?? "");
    if (message) return;

    setPreviewUrl(URL.createObjectURL(file));
    onChange(file);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setError("");
    onChange(null);
  };

  const shown = preview ?? currentUrl;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={acceptTypes.join(",")}
        onChange={handleFile}
        className="sr-only"
        tabIndex={-1}
        aria-label={`Chọn ${label.toLowerCase()}`}
      />

      {shown ? (
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <FallbackImage
            src={shown}
            alt={label}
            className="aspect-[16/9] w-full object-cover"
            // Ảnh hiện có bị hỏng -> khung trống, vẫn bấm "Đổi ảnh" được.
            fallback={
              <div className="grid aspect-[16/9] w-full place-items-center bg-surface text-subtle">
                <ImageOff className="size-8" />
              </div>
            }
          />
          <div className="absolute right-3 top-3 flex gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
              Đổi ảnh
            </Button>
            {preview && (
              <Button type="button" size="sm" variant="secondary" onClick={handleRemove}>
                Bỏ ảnh mới
              </Button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[16/6] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-surface text-subtle transition hover:border-brand/40 hover:text-brand"
        >
          <ImagePlus className="size-7" />
          <span className="text-sm font-medium">Chọn {label.toLowerCase()}</span>
          <span className="text-xs">{hint}</span>
        </button>
      )}

      {error && (
        <p className="mt-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
