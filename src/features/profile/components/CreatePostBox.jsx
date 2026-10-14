import { useNavigate } from 'react-router-dom';
import { Video, ScanLine, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=10b981&color=fff&size=256';

export default function CreatePostBox({ profile }) {
  const navigate = useNavigate();

  const displayName = profile?.fullName?.trim();
  const avatarUrl = profile?.avatarUrl || DEFAULT_AVATAR;

  const placeholderText = displayName
    ? `${displayName} ơi, hôm nay bạn có công thức thơm lành nào muốn chia sẻ? 🥬`
    : 'Hôm nay bạn có công thức nào muốn chia sẻ?';

  return (
    <div className="bg-card rounded-3xl p-5 shadow-sm border border-border mb-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-surface shrink-0">
          <img
            src={avatarUrl}
            alt={displayName || 'User'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
        </div>
        <input
          type="text"
          readOnly
          onClick={() => navigate('/recipes/new')}
          placeholder={placeholderText}
          className="flex-1 bg-surface border border-border rounded-full px-4 py-2.5 text-xs text-body focus:outline-none focus:border-brand cursor-pointer placeholder:text-subtle"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          {/* Nút Đăng video -> điều hướng /videos */}
          <button
            type="button"
            onClick={() => navigate('/videos')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-body hover:bg-surface cursor-pointer transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-brand" /> Đăng video
          </button>

          {/* Hai nút còn lại giữ nguyên */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-body hover:bg-surface transition-colors"
          >
            <ScanLine className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> AI quét nguyên liệu
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-body hover:bg-surface transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-warning" /> Ghim thực đơn
          </button>
        </div>

        {/* Nút Chia sẻ công thức -> điều hướng /recipes/new */}
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => navigate('/recipes/new')}
          className="rounded-full text-xs font-semibold shadow-xs cursor-pointer px-5"
        >
          Chia sẻ công thức
        </Button>
      </div>
    </div>
  );
}