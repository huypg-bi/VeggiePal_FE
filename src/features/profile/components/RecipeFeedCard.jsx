import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark, CheckCircle, Play } from 'lucide-react';

export default function RecipeFeedCard() {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border border-stone-100 dark:border-stone-800 mb-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-50 dark:bg-stone-800">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Author"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-stone-800 dark:text-stone-100">Minh Thuận</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 text-white" />
            </div>
            <span className="text-[11px] text-stone-400">2 giờ trước • Chế độ: Công khai</span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
          #đã_giao
        </span>
      </div>

      <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-2 leading-snug">
        Súp Bí Đỏ Hạt Sen & Nước Cốt Dừa Tươi: Giữ Ấm Dạ Dày Ngày Se Lạnh 🎃✨
      </h2>
      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-3">
        Bí đỏ hạt sen ngọt bùi tự nhiên, hấp chín rồi xay nhuyễn cùng sữa hạt điều, béo ngậy mà không hề dùng đường tinh luyện. Một bữa tối ấm áp, dồi dào Beta-carotene cho thị lực sáng ngời! Đã qua AI kiểm định cân bằng Macro.
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold">
        <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">🎃 280 Kcal</span>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">🌱 12g Protein</span>
        <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">⚡ 42g Carbs Chậm</span>
        <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">#Chất béo tốt</span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 rounded-2xl overflow-hidden mb-4 relative">
        <div className="md:col-span-4 bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
            alt="Step detail"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:col-span-8 rounded-xl overflow-hidden relative group aspect-video">
          <img
            src="https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=800&q=80"
            alt="Main dish soup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <button className="w-12 h-12 rounded-full bg-white/90 dark:bg-stone-900/90 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-emerald-800 dark:fill-emerald-400 ml-0.5" />
            </button>
          </div>
          <span className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
            04:25 • 4K 60fps
          </span>
        </div>
      </div>

      <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl mb-4 text-[11px] text-stone-600 dark:text-stone-300 flex flex-wrap items-center gap-2">
        <strong className="text-stone-800 dark:text-stone-100">Nguyên liệu chính:</strong>
        <span>• 300g Bí đỏ hạt sen</span>
        <span>• 50g Hạt sen tươi</span>
        <span>• 100ml Cốt dừa non</span>
        <span>• 1 Muỗng muối Himalaya</span>
      </div>

      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-3 border-t border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 hover:text-rose-500">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="font-semibold text-stone-700 dark:text-stone-200">1,248</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-stone-700 dark:hover:text-stone-200">
            <MessageCircle className="w-4 h-4" /> 46 Bình luận
          </button>
          <button className="flex items-center gap-1.5 hover:text-stone-700 dark:hover:text-stone-200">
            <Share2 className="w-4 h-4" /> 217
          </button>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60">
          <Bookmark className="w-3.5 h-3.5" /> Lưu vào sổ tay
        </button>
      </div>
    </div>
  );
}