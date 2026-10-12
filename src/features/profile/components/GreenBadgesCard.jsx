import React from 'react';
import { Award, Calendar, Droplets, Sparkles } from 'lucide-react';

export default function GreenBadgesCard() {
  const badges = [
    {
      title: '100 Ngày Ăn Xanh Liên Tiếp',
      desc: 'Không bỏ lỡ bữa thuần chay nào kể từ ngày tham gia',
      icon: Calendar,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Bếp Trưởng Zero-Waste',
      desc: 'Tái chế vỏ rau củ làm nước dùng thanh ngọt',
      icon: Droplets,
      color: 'bg-sky-50 text-sky-600',
    },
    {
      title: 'AI Master Chef',
      desc: 'Tối ưu 50+ công thức đạt chuẩn gợi ý dinh dưỡng từ AI',
      icon: Sparkles,
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-stone-800 text-sm">Huy Hiệu Xanh</h3>
        </div>
        <span className="text-[11px] text-stone-400">3 đạt được</span>
      </div>

      <div className="space-y-3">
        {badges.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div key={idx} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-stone-50 transition-colors">
              <div className={`w-9 h-9 rounded-xl ${b.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-800">{b.title}</h4>
                <p className="text-[11px] text-stone-500 leading-tight mt-0.5">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}