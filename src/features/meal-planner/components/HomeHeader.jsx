import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Broccoli,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CircleUserRound,
  Home,
  LogOut,
  MessageSquareWarning,
  Map,
  Search,
  SquarePlay,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";

import logo from "@/assets/img/logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore, selectIsAuthenticated } from "@/features/auth/store/authStore";
import ThemeToggle from "@/shared/components/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "home", label: "Trang Chủ", icon: Home, to: "/" },
  { id: "utensils-crossed", label: "Thực Đơn", icon: UtensilsCrossed, to: "/meal-planner" },
  { id: "square-play", label: "Khám Phá Video", icon: SquarePlay, to: "/videos" },
  { id: "map", label: "Bản Đồ Xanh", icon: Map, to: "/map" },
  { id: "broccoli", label: "Trợ Lý Bông Cải", icon: Broccoli, to: "/chatbot" },
];

const PROFILE_MENU_ITEMS = [
  { id: "help", label: "Trợ giúp và hỗ trợ", icon: CircleHelp },
  { id: "report", label: "Báo cáo sự cố", icon: MessageSquareWarning },
];

export default function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  const displayName = user?.fullName?.trim();
  const displayEmail = user?.email;

  return (
    <header className="sticky top-4 z-30 mb-4 px-6 sm:px-8">
      <div className="mx-auto flex w-full max-w-[1560px] items-center gap-4 rounded-full border border-border bg-card/90 px-6 py-1 shadow-sm backdrop-blur">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="VeggiePal" className="h-15 w-auto" />
        </Link>

        <label className="relative hidden max-w-xl flex-1 items-center md:flex">
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-subtle" />
          <input
            type="search"
            placeholder="Tìm kiếm món ăn, công thức, nguyên liệu..."
            className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-subtle focus:border-brand/30 focus:bg-card focus:ring-2 focus:ring-brand/10"
          />
        </label>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map(({ id, label, icon: Icon, to }) => (
            <Link
              key={id}
              to={to}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-2 font-display-serif text-base font-medium transition",
                location.pathname === to
                  ? "bg-brand-soft text-brand"
                  : "text-subtle hover:bg-surface hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-2">

          {isAuthenticated && (
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Thông báo"
              className="relative"
            >
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#EF6461]" />
            </Button>
          )}

          <ThemeToggle />

          {!isAuthenticated && (
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/login"
                className="hidden text-sm font-medium text-subtle transition hover:text-ink sm:block"
              >
                Đăng Nhập
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-brand-foreground transition hover:opacity-90"
              >
                Đăng Ký
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger
                aria-label="Menu tài khoản"
                className="relative grid size-9 place-items-center rounded-full bg-brand text-brand-foreground outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand/50"
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
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-80 rounded-2xl p-3 shadow-xl"
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

                <DropdownMenuItem
                  render={<Link to="/profile" />}
                  className="mt-3 cursor-pointer justify-center gap-2 rounded-full bg-[#E8ECFB] px-4 py-2.5 font-medium text-ink focus:bg-[#DEE3FA] dark:bg-brand-soft dark:focus:bg-[#1c3d27]"
                >
                  <CircleUserRound className="h-4 w-4 text-brand" />
                  Xem tất cả trang cá nhân
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-3" />

                {PROFILE_MENU_ITEMS.map(({ id, label, icon: Icon }) => (
                  <DropdownMenuItem
                    key={id}
                    className="cursor-pointer gap-3 rounded-xl px-1 py-2"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#E8ECFB] text-ink dark:bg-brand-soft">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 text-sm font-medium text-ink">
                      {label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-subtle" />
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="my-3" />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={logout}
                  className="cursor-pointer gap-3 rounded-xl px-1 py-2"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#FDECEC] text-[#D5443B] dark:bg-[#3a1616] dark:text-[#ff8a80]">
                    <LogOut className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-[#D5443B] dark:text-[#ff8a80]">
                    Đăng xuất
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
