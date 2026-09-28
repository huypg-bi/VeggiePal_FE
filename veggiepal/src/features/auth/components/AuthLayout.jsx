import ThemeToggle from "@/shared/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function AuthLayout({ className, children }) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh items-center justify-center bg-gradient-to-br from-[#9AFF8D] via-[white] to-[#9AFF8D] dark:from-[#0d2a1c] dark:via-[#0a140f] dark:to-[#0d1f1a]",
        className
      )}
    >
      <ThemeToggle className="absolute right-6 top-6 z-10 bg-white/80 hover:bg-white dark:bg-black/30 dark:hover:bg-black/50" />
      {children}
    </div>
  );
}
