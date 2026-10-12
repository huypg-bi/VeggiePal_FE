import React from 'react';
import { Video, ScanLine, Clock } from 'lucide-react';

export default function CreatePostBox() {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 mb-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-50 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <input
          type="text"
          placeholder="Thuận ơi, hôm nay bạn có công thức thơm lành nào muốn chia sẻ? 🥬"
          className="flex-1 bg-stone-50 border border-stone-200 rounded-full px-4 py-2.5 text-xs text-stone-700 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100">
            <Video className="w-3.5 h-3.5 text-emerald-600" /> Đăng video
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100">
            <ScanLine className="w-3.5 h-3.5 text-sky-600" /> AI quét nguyên liệu
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:bg-stone-100">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Ghim thực đơn
          </button>
        </div>

        <button className="px-5 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs">
          Chia sẻ công thức
        </button>
      </div>
    </div>
  );
}