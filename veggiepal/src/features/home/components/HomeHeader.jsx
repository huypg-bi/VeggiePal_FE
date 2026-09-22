import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Bot,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CircleUserRound,
  LogOut,
  MessageSquareWarning,
  Map,
  Search,
  SquarePlay,
  UserRound,
  UtensilsCrossed,
  Users,
} from "lucide-react";

import logo from "@/assets/img/logo.png";
import { useAuthStore } from "@/features/auth/store/authStore";
import ThemeToggle from "@/shared/components/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "utensils-crossed", label: "Thực Đơn", icon: UtensilsCrossed, to: "/" },
  { id: "square-play", label: "Video", icon: SquarePlay, to: "/videos" },
  { id: "map", label: "Bản đồ", icon: Map, to: "/map" },
  { id: "bot", label: "Trợ lí AI", icon: Bot },
];

const PROFILE_MENU_ITEMS = [
  { id: "help", label: "Trợ giúp và hỗ trợ", icon: CircleHelp },
  { id: "report", label: "Báo cáo sự cố", icon: MessageSquareWarning },
];

export default function HomeHeader() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  const displayName = user?.fullName?.trim();
  const displayEmail = user?.email;

  return (
    <header className="sticky top-4 z-30 mb-4 px-6 sm:px-8">
      <div className="mx-auto flex w-full max-w-[1230px] items-center gap-4 rounded-3xl border border-border bg-card/90 px-6 py-1 shadow-sm backdrop-blur">
        <a href="/" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="VeggiePal" className="h-20 w-auto" />
        </a>

        <label className="relative hidden max-w-md flex-1 items-center md:flex">
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-subtle" />
          <input
            type="search"
            placeholder="Tìm kiếm món ăn, công thức, nguyên liệu..."
            className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/30 focus:bg-card focus:ring-2 focus:ring-brand/10"
          />
        </label>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map(({ id, label, icon: Icon, to }) => {
            const isActive = to ? location.pathname === to : active === id;
            const itemClassName = cn(
              "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition",
              isActive
                ? "bg-[#E8F5E9] text-brand dark:bg-[#16301f]"
                : "text-subtle hover:bg-surface hover:text-ink"
            );

            if (to) {
              return (
                <Link key={id} to={to} className={itemClassName}>
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            }

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={itemClassName}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-2">
          <button
            type="button"
            aria-label="Thông báo"
            className="relative grid size-9 shrink-0 place-items-center rounded-full text-subtle transition hover:bg-surface hover:text-ink"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#EF6461]" />
          </button>

          <ThemeToggle />

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="relative grid size-9 place-items-center rounded-full bg-brand text-brand-foreground transition hover:opacity-90"
            >
              <UserRound className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-card text-ink shadow ring-1 ring-border">
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    menuOpen && "rotate-180"
                  )}
                />
              </span>
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  aria-label="Đóng menu"
                  onClick={() => setMenuOpen(false)}
                  className="fixed inset-0 z-30 cursor-default"
                />
                <div
                  role="menu"
                  className="absolute right-0 top-12 z-40 w-80 rounded-2xl border border-border bg-card p-3 shadow-xl"
                >
                  <div className="flex items-center gap-3 px-1 py-1.5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
                      <UserRound className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-bold text-ink">
                        {displayName}
                      </p>
                      <p className="truncate text-sm text-subtle">
                        {displayEmail}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#E8ECFB] px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-[#DEE3FA] dark:bg-[#16301f] dark:hover:bg-[#1c3d27]"
                  >
                    <CircleUserRound className="h-4 w-4 text-brand" />
                    <a href="/profile">Xem tất cả trang cá nhân</a>
                  </button>

                  <div className="my-3 h-px bg-border" />

                  <div className="flex flex-col">
                    {PROFILE_MENU_ITEMS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        className="flex items-center gap-3 rounded-xl px-1 py-2 text-left transition hover:bg-surface"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#E8ECFB] text-ink dark:bg-[#16301f]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1 text-sm font-medium text-ink">
                          {label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-subtle" />
                      </button>
                    ))}
                  </div>

                  <div className="my-3 h-px bg-border" />

                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-1 py-2 text-left transition hover:bg-[#FDECEC] dark:hover:bg-[#3a1616]"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#FDECEC] text-[#D5443B] dark:bg-[#3a1616] dark:text-[#ff8a80]">
                      <LogOut className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-[#D5443B] dark:text-[#ff8a80]">
                      Đăng xuất
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
