import { useEffect, useState } from "react";

/** Giá trị `value` sau khi đứng yên `delayMs` mili giây (dùng để không gọi API theo từng ký tự gõ). */
export function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
