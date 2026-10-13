import React from 'react';
import { FileText, ShieldAlert, Heart } from 'lucide-react';

export default function ProfileTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <div className="inline-flex bg-white/90 dark:bg-stone-900/90 p-1.5 rounded-full shadow-sm border border-stone-200 dark:border-stone-800 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
            activeTab === 'posts'
              ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Bài viết & Video (142)
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
            activeTab === 'moderation'
              ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Trạng thái kiểm duyệt AI
          <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
            1
          </span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
            activeTab === 'favorites'
              ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          Đánh giá & Yêu thích
        </button>
      </div>
    </div>
  );
}