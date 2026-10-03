import { FALLBACK_AUTHOR_NAME, getInitials } from "@/features/blog/utils/blogFormat";
import { cn } from "@/lib/utils";

// Avatar tác giả: ảnh nếu có, không thì chữ cái đầu của tên trên nền brand nhạt.
// `author` là { fullName, avatarUrl } từ usePublicUsers, có thể undefined.

export default function AuthorAvatar({ author, className = "size-11 text-sm" }) {
  const name = author?.fullName ?? FALLBACK_AUTHOR_NAME;

  if (author?.avatarUrl) {
    return (
      <img
        src={author.avatarUrl}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover", className)}
        draggable={false}
      />
    );
  }

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-brand-soft font-bold text-brand",
        className
      )}
    >
      {getInitials(name)}
    </span>
  );
}
