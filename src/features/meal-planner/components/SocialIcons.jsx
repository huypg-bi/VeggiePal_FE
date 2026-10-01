// Lucide bỏ icon thương hiệu (Facebook/Instagram/Youtube/TikTok) vì lý do bản quyền,
// nên vẽ tay bộ icon mạng xã hội tối giản dùng riêng cho footer.

const base = "h-4 w-4";

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={base} {...props}>
      <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.57c0-.86.24-1.44 1.47-1.44h1.57V4.5c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.17H8V13.4h2.46V21h3.04Z" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={base} {...props}>
      <path d="M14.5 3h2.1c.2 1.6 1.2 2.9 2.9 3.3v2.2c-1.1 0-2.1-.3-3-.9v6.1c0 3-2.4 5.3-5.4 5.3S5.7 16.7 5.7 13.7c0-2.9 2.2-5.1 5.1-5.3v2.2c-1.6.2-2.9 1.5-2.9 3.1 0 1.7 1.4 3.1 3.1 3.1s3.1-1.4 3.1-3.1V3Z" />
    </svg>
  );
}

export function PinterestIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={base} {...props}>
      <path d="M12 2C6.48 2 2 6.29 2 11.6c0 3.9 2.29 7.26 5.6 8.79-.08-.75-.14-1.9.03-2.72.16-.75 1.02-4.79 1.02-4.79s-.26-.54-.26-1.33c0-1.24.7-2.17 1.58-2.17.74 0 1.1.57 1.1 1.26 0 .77-.48 1.92-.73 2.98-.21.89.43 1.61 1.28 1.61 1.54 0 2.72-1.66 2.72-4.06 0-2.12-1.5-3.61-3.65-3.61-2.49 0-3.95 1.9-3.95 3.86 0 .76.28 1.58.63 2.02a.26.26 0 0 1 .06.25c-.07.28-.21.89-.24 1.01-.04.16-.13.2-.29.12-1.07-.51-1.74-2.1-1.74-3.38 0-2.75 1.96-5.28 5.65-5.28 2.97 0 5.28 2.15 5.28 5.03 0 3-1.85 5.41-4.42 5.41-.87 0-1.68-.46-1.96-1l-.53 2.07c-.19.75-.71 1.69-1.06 2.26.8.25 1.63.38 2.51.38 5.29 0 9.58-4.31 9.58-9.63S17.29 2 12 2Z" />
    </svg>
  );
}

export function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={base} {...props}>
      <path d="M4 4l6.4 8.4L4.2 20h2.3l5-5.9 4 5.9H20l-6.7-8.8L19.6 4h-2.3l-4.6 5.4L8.9 4H4Zm2.9 1.6h2l8.2 12.8h-2L6.9 5.6Z" />
    </svg>
  );
}
