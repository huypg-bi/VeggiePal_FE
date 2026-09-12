import { Sparkles, Camera, CirclePlay, Star } from "lucide-react";

import mascot from "@/assets/img/veggiepal-mascot.png";

// Cột trái của màn đăng nhập: giới thiệu thương hiệu + 3 điểm nổi bật.
// Thuần trình bày, không có logic.
const FEATURES = [
  {
    icon: Sparkles,
    tint: "bg-[rgb(110_186_131_/_0.3)] text-brand",
    title: "Trợ lý AI phân tích dinh dưỡng & BMI",
    desc: "Tính toán tự động hàm lượng đạm thực vật, vi chất và cá nhân hóa lộ trình calo.",
  },
  {
    icon: Camera,
    tint: "bg-[rgb(160_213_253_/_0.45)] text-brand-blue",
    title: "Nhận diện nguyên liệu tủ lạnh qua CV",
    desc: "Chỉ cần chụp ảnh ngăn bếp, hệ thống lập tức đề xuất thực đơn chay ngon miệng không lãng phí.",
  },
  {
    icon: CirclePlay,
    tint: "bg-[rgb(235_147_123_/_0.3)] text-brand-clay",
    title: "Khám phá video & công thức tóm tắt tự động",
    desc: "Xem clip nấu ăn thịnh hành với bản chiết xuất bước làm và thời gian chuẩn xác.",
  },
];

const AVATARS = [
  { label: "VN", className: "bg-brand" },
  { label: "AL", className: "bg-brand-blue" },
  { label: "TK", className: "bg-brand-clay" },
];

export default function BrandPanel() {
  return (
    <div className="flex flex-col gap-6">
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.05em] text-brand">
        <Sparkles className="size-3.5" />
        Trợ lý dinh dưỡng thuần chay thế hệ mới
      </span>

      <div className="flex flex-col gap-2">
        <div className="flex size-36 items-center justify-center rounded-2xl bg-brand-soft p-2 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <img
            src={mascot}
            alt="VeggiePal"
            className="max-h-full w-full object-contain"
          />
        </div>

        <h1 className="text-[clamp(2.25rem,4vw,3rem)] font-bold leading-[1.16] tracking-[-0.02em] text-ink">
          Ẩm thực xanh
          <br />
          <span className="text-brand">Thấu hiểu bởi AI</span>
        </h1>

        <p className="max-w-[576px] text-[18px] leading-7 text-body">
          Đồng hành cùng lối sống xanh lành mạnh và ẩm thực chay thông minh hỗ trợ
          bởi AI. Chăm sóc từng bữa ăn, tối ưu năng lượng trọn vẹn mỗi ngày.
        </p>
      </div>

      <ul className="flex flex-col gap-3 pt-2">
        {FEATURES.map(({ icon: Icon, tint, title, desc }) => (
          <li
            key={title}
            className="flex items-start gap-4 rounded-xl border border-white/60 bg-white/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm"
          >
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-full ${tint}`}
            >
              <Icon className="size-5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-[20px] font-semibold leading-7 text-ink">
                {title}
              </p>
              <p className="text-[14px] leading-5 text-body">{desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-6 pt-2">
        <div className="flex">
          {AVATARS.map((a) => (
            <span
              key={a.label}
              className={`-ml-2 flex size-8 items-center justify-center rounded-full text-[12px] font-bold tracking-[0.02em] text-white ring-2 ring-canvas first:ml-0 ${a.className}`}
            >
              {a.label}
            </span>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="size-3.5 fill-brand-blue text-brand-blue"
              />
            ))}
            <span className="pl-1 text-[14px] font-bold text-ink">4.9/5</span>
          </div>
          <p className="text-[11px] font-medium tracking-[0.03em] text-body">
            Hơn 45.000 tín đồ thuần chay tin cậy tại Việt Nam
          </p>
        </div>
      </div>
    </div>
  );
}
