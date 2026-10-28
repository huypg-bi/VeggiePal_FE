import { useEffect, useRef, useState } from "react";

// rootMargin đáy: khối phải vào sâu thêm ngần này px so với mép dưới màn hình mới tính là "đã thấy".
const BOTTOM_MARGIN_PX = 60;

/**
 * Khi nào một khối được coi là đã vào màn hình để hiện ra.
 * Bình thường là khi `threshold` (tỉ lệ chiều cao) của khối nằm trong màn hình. Nhưng khối rất cao (vd danh sách
 * bài viết đã có sẵn trong cache) có thể cao hơn nhiều lần màn hình nên `threshold` của nó không bao giờ đạt, khối
 * sẽ ẩn mãi. Khối như vậy được hiện ngay khi vừa chạm vào màn hình.
 */
export function shouldReveal({ intersectionRatio, blockHeight, viewportHeight }, threshold) {
  if (intersectionRatio >= threshold) return true;
  const visibleNeeded = blockHeight * threshold;
  return visibleNeeded > (viewportHeight - BOTTOM_MARGIN_PX) * 0.5;
}

export function useRevealOnScroll({ threshold = 0.15 } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const reveal = shouldReveal(
          {
            intersectionRatio: entry.intersectionRatio,
            blockHeight: entry.boundingClientRect.height,
            viewportHeight: entry.rootBounds?.height ?? window.innerHeight,
          },
          threshold
        );
        if (reveal) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      // Có mốc 0 để biết ngay lúc khối vừa chạm vào màn hình (cần cho khối rất cao, xem shouldReveal).
      { threshold: [0, threshold], rootMargin: `0px 0px -${BOTTOM_MARGIN_PX}px 0px` }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}
