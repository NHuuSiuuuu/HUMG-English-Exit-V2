"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogIn, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/frontend/components/layout/theme-toggle";
import { MobileNav } from "@/frontend/components/layout/mobile-nav";
import { useAuth } from "@/frontend/providers/auth-provider";
import { cn } from "@/frontend/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Đóng dropdown khi chuyển trang
  React.useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/on-luyen", label: "Ôn luyện" },
    { href: "/thi-thu", label: "Thi thử" },
    { href: "/bai-viet", label: "Bài viết" },
    { href: "/tra-cuu", label: "Tra cứu điểm" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo và Tên thương hiệu */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none rounded-xl p-1"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0095F6] text-white shadow-sm transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
              HUMG English Exit
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block mt-0.5">
              Chuẩn đầu ra Tiếng Anh HUMG
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ease-in-out min-h-[38px] flex items-center",
                  isActive
                    ? "text-[#0095F6] bg-sky-50 dark:bg-sky-950/50 dark:text-sky-300 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls: Theme, Auth State, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Desktop Auth State */}
          <div className="hidden md:flex items-center space-x-2">
            {isLoading ? (
              <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0095F6] text-white text-xs font-bold uppercase">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{user.fullName}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", dropdownOpen && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {user.email}
                      </p>
                      {user.role === "ADMIN" && (
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                          <Shield className="w-3 h-3" />
                          <span>Quản trị viên</span>
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        href="/tai-khoan"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Hồ sơ tài khoản</span>
                      </Link>

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                          <Shield className="w-4 h-4 text-slate-400" />
                          <span>Khu quản trị</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/dang-nhap"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 flex items-center gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  href="/dang-ky"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#0095F6] hover:bg-sky-600 text-white shadow-[0_2px_8px_rgba(0,149,246,0.25)] transition-all duration-200"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile Drawer Button */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
