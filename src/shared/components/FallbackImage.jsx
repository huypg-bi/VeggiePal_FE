import { useState } from "react";

export default function FallbackImage({ src, fallback = null, alt = "", ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) return fallback;

  return <img src={src} alt={alt} onError={() => setFailedSrc(src)} {...props} />;
}
