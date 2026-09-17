import { LocateFixed, MapPin, Minus, Plus, RotateCcw } from "lucide-react";

// Khung bản đồ đang để trống chờ tích hợp API bản đồ từ BE.
// Khi BE sẵn sàng, thay phần placeholder bên trong bằng component bản đồ thật.
export default function MapPanel() {
  return (
    <section className="relative h-[420px] overflow-hidden rounded-3xl border border-black/15 bg-[#EAF3EA] sm:h-[520px] lg:sticky lg:top-28 lg:h-[calc(100vh-160px)]">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-white/80 text-[#1D6C3D] shadow-sm">
          <MapPin className="h-6 w-6" />
        </span>
        <p className="text-sm font-semibold text-ink">
          Bản đồ sẽ hiển thị tại đây
        </p>
        <p className="max-w-[220px] text-xs leading-relaxed text-subtle">
          Khu vực này đang chờ kết nối API bản đồ từ hệ thống.
        </p>
      </div>

      <button
        type="button"
        className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-sm transition hover:bg-[#F5F8F3]"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Đặt lại bản đồ
      </button>

      <div className="absolute right-4 top-16 flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
        <button
          type="button"
          aria-label="Phóng to"
          className="grid size-10 place-items-center text-ink transition hover:bg-[#F5F8F3]"
        >
          <Plus className="h-4 w-4" />
        </button>
        <div className="h-px bg-black/5" />
        <button
          type="button"
          aria-label="Thu nhỏ"
          className="grid size-10 place-items-center text-ink transition hover:bg-[#F5F8F3]"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        aria-label="Vị trí của tôi"
        className="absolute bottom-6 right-4 grid size-10 place-items-center rounded-full bg-white text-[#1D6C3D] shadow-sm transition hover:bg-[#F5F8F3]"
      >
        <LocateFixed className="h-4 w-4" />
      </button>
    </section>
  );
}
