import React from 'react';
import { Activity } from 'lucide-react';

export default function DailyNutritionCard() {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-emerald-600" />
        <h3 className="font-bold text-stone-800 text-sm">Dinh Dưỡng Hôm Nay</h3>
      </div>

      {/* Circle Progress Indicator */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-stone-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-500"
              strokeDasharray="78, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-sm font-extrabold text-stone-800">1,640</span>
            <span className="text-[9px] text-stone-400">kcal</span>
          </div>
        </div>

        <div className="text-xs space-y-1">
          <p className="font-semibold text-stone-700">Mục tiêu: 2,100 kcal</p>
          <p className="text-emerald-600 text-[11px]">Còn 460 kcal cho bữa tối</p>
          <p className="text-stone-400 text-[10px]">Đã cháy 420 kcal vận động</p>
        </div>
      </div>

      {/* Macro Bars */}
      <div className="space-y-3 text-xs">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-stone-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Carbs (Tinh bột Phức, Tinh chất)
            </span>
            <span className="font-semibold text-stone-700">210g / 260g (80%)</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-stone-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              Protein thuần thực vật (Nutrient)
            </span>
            <span className="font-semibold text-stone-700">65g / 75g (87%)</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: '87%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-stone-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Chất béo tốt (Bơ hạt, Hạt chia)
            </span>
            <span className="font-semibold text-stone-700">46g / 55g (75%)</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}