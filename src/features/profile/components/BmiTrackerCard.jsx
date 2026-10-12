import React from 'react';
import { TrendingDown, ChevronRight, ThumbsUp } from 'lucide-react';

export default function BmiTrackerCard() {
  const points = [
    { label: 'Tháng 10 (BMI 22.8)', y: 80 },
    { label: 'Tháng 11', y: 65 },
    { label: 'Tháng 12', y: 55 },
    { label: 'Tháng 01', y: 48 },
    { label: 'Tháng 02', y: 42 },
    { label: 'Hiện tại (21.4) 🎯', y: 40 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-stone-800">Theo Dõi Thể Trạng & BMI 6 Tháng</h3>
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">Thuật toán AI đề xuất giúp duy trì thể trạng 21.4 (Chuẩn)</p>
        </div>

        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-[11px] font-semibold text-stone-600">
          <button className="px-3 py-1 bg-white rounded-lg shadow-2xs text-stone-800">BMI</button>
          <button className="px-3 py-1 hover:text-stone-900">Cân nặng (kg)</button>
        </div>
      </div>

      {/* Chart SVG */}
      <div className="w-full h-44 relative mb-4">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bmiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path
            d="M 10 80 Q 100 65, 200 55 T 300 48 T 400 42 T 490 40 L 490 120 L 10 120 Z"
            fill="url(#bmiGradient)"
          />

          {/* Curve line */}
          <path
            d="M 10 80 Q 100 65, 200 55 T 300 48 T 400 42 T 490 40"
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Points */}
          <circle cx="10" cy="80" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <circle cx="106" cy="67" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <circle cx="203" cy="55" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <circle cx="300" cy="48" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <circle cx="397" cy="42" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <circle cx="490" cy="40" r="5.5" fill="#047857" stroke="#ffffff" strokeWidth="2" />
        </svg>

        {/* Labels below chart */}
        <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-medium">
          {points.map((p, i) => (
            <span key={i}>{p.label}</span>
          ))}
        </div>
      </div>

      {/* Recommendation Bottom Bar */}
      <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs text-stone-700">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[11px] leading-tight">
            <strong>Chỉ số giảm đều -1.4 điểm:</strong> Hiệu quả rõ rệt sau 45 ngày áp dụng thực đơn thuần WFPB
          </span>
        </div>
        <button className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 shrink-0">
          Xem chi tiết phân tích AI <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}