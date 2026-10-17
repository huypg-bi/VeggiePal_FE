import { useQuery } from "@tanstack/react-query";

import { selectIsAuthenticated, useAuthStore } from "@/features/auth/store/authStore";
import { getRecommendations } from "@/features/home/api/recommendationApi";
import { recommendationKeys } from "@/features/home/queryKeys";

const STALE_MS = 5 * 60 * 1000; // 5 phút

// Dữ liệu mẫu minh họa chuẩn cấu trúc trả về từ BE ai-service
const SAMPLE_RECOMMENDATIONS = [
  {
    type: "RECIPE",
    id: 1,
    reason: "Gợi ý vì món giàu chất đạm thực vật từ đậu hũ non và nấm đông cô, ít calo phù hợp bữa trưa.",
    content: {
      id: 1,
      title: "Đậu hũ non sốt nấm đông cô chua ngọt",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    },
  },
  {
    type: "BLOG",
    id: 2,
    reason: "Bài viết chia sẻ bí quyết giữ trọn vitamin trong rau củ luộc, rất hữu ích cho người mới ăn chay.",
    content: {
      id: 2,
      title: "Cách chế biến rau củ chay giữ trọn 95% vitamin và khoáng chất",
      thumbnailUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    },
  },
  {
    type: "RECIPE",
    id: 3,
    reason: "Thanh mát giải nhiệt, cung cấp lượng lớn chất xơ tự nhiên và chất chống oxy hóa từ củ dền.",
    content: {
      id: 3,
      title: "Canh củ sen hầm táo đỏ và củ dền thanh ngọt",
      imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
    },
  },
];

/**
 * Hook lấy gợi ý nội dung từ AI (GET /ai/recommendations).
 * Ưu tiên gọi API thật; nếu BE chưa chạy hoặc chưa có bài viết, tự động dùng dữ liệu mẫu để test hiển thị UI.
 */
export function useRecommendations({ interest, limit = 6 } = {}) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return useQuery({
    queryKey: recommendationKeys.list({ interest, limit }),
    queryFn: async () => {
      try {
        const data = await getRecommendations({ interest, limit });
        if (data && data.length > 0) return data;
      } catch {
        // BE chưa bật hoặc lỗi kết nối -> fallback dữ liệu mẫu để test UI
      }
      return SAMPLE_RECOMMENDATIONS;
    },
    enabled: isAuthenticated,
    staleTime: STALE_MS,
  });
}
