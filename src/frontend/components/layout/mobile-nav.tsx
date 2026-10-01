"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  BookOpen,
  Clock,
  FileText,
  Search,
  LogIn,
  UserPlus,
  User,
  Shield,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { BrandLogo } from "@/frontend/components/layout/brand-logo";
import { useTheme } from "next-themes";
import { useAuth } from "@/frontend/providers/auth-provider";
import { cn } from "@/frontend/lib/utils";

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Đóng drawer khi đổi trang
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Khóa cuộn trang khi drawer mở
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navItems = [
    { href: "/on-luyen", label: "Ôn luyện", icon: BookOpen },
    { href: "/thi-thu", label: "Thi thử", icon: Clock },
    { href: "/bai-viet", label: "Bài viết", icon: FileText },
    { href: "/tra-cuu", label: "Tra cứu điểm", icon: Search },
  ];

  return (
    <div className="md:hidden">
      {/* Nút Hamburger trên Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Đóng danh mục" : "Mở danh mục"}
        aria-expanded={isOpen}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all duration-200"
      >
        <span
          className={cn(
            "transition-transform duration-200 ease-in-out flex items-center justify-center",
            isOpen && "rotate-90"
          )}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </span>
      </button>

      {/* Dùng React Portal đưa Drawer ra document.body */}
      {mounted &&
        createPortal(
          <div
            className={cn(
              "fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
              isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setIsOpen(false)}
            aria-hidden={!isOpen}
          >
            {/* Menu Drawer trượt vào từ mép phải */}
            <div
              className={cn(
                "fixed inset-y-0 right-0 z-[10000] w-full max-w-[320px] h-full bg-white dark:bg-slate-900 p-6 shadow-2xl border-l border-slate-100 dark:border-slate-800 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out will-change-transform",
                isOpen ? "translate-x-0" : "translate-x-full"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Tiêu đề Drawer */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
                  <BrandLogo variant="badge" size="sm" showSubtitle={false} />
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Đóng menu"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Nếu đã đăng nhập: khối người dùng trên mobile */}
                {user && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0095F6] text-white font-bold text-sm uppercase">
                        {user.fullName.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.fullName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {user.role === "ADMIN" && (
                      <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                        <Shield className="w-3 h-3" />
                        <span>Quản trị viên</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Danh sách các liên kết điều hướng */}
                <nav className="mt-5 flex flex-col space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && (pathname?.startsWith(item.href) ?? false));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ease-in-out active:scale-[0.98] min-h-[44px]",
                          isActive
                            ? "bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] dark:text-sky-300 font-bold shadow-sm"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-transform duration-200",
                            isActive
                              ? "text-[#0095F6] dark:text-sky-300 scale-110"
                              : "text-slate-400 dark:text-slate-500"
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  {user && (
                    <>
                      <Link
                        href="/tai-khoan"
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ease-in-out min-h-[44px]",
                          pathname === "/tai-khoan"
                            ? "bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] dark:text-sky-300 font-bold"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                        )}
                      >
                        <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                        <span>Hồ sơ tài khoản</span>
                      </Link>

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ease-in-out min-h-[44px]",
                            (pathname?.startsWith("/admin") ?? false)
                              ? "bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] dark:text-sky-300 font-bold"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                          )}
                        >
                          <Shield className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          <span>Khu quản trị</span>
                        </Link>
                      )}
                    </>
                  )}
                </nav>
              </div>

              {/* Chân Drawer: Giao diện Sáng/Tối & Đăng xuất / Đăng nhập */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-3 mt-auto">
                {/* Chuyển theme trong Mobile Drawer */}
                {mounted && (
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Giao diện</span>
                    <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 w-36">
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={cn(
                          "flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          theme === "light"
                            ? "bg-white text-amber-600 shadow-sm"
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Sáng</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={cn(
                          "flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          theme === "dark"
                            ? "bg-slate-900 text-sky-400 shadow-sm"
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      >
                        <Moon className="w-3.5 h-3.5 text-sky-400" />
                        <span>Tối</span>
                      </button>
                    </div>
                  </div>
                )}

                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#ff4d4f] hover:bg-[#f5383a] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_3px_0_0_#c92a2a] active:translate-y-[2px] active:shadow-[0_1px_0_0_#c92a2a] transition-all duration-150 select-none cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </button>
                ) : (
                  <>
                    <Link
                      href="/dang-nhap"
                      onClick={() => setIsOpen(false)}
                      className="w-full"
                    >
                      <button
                        type="button"
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold flex items-center justify-center gap-2 shadow-[0_3px_0_0_#cbd5e1] dark:shadow-[0_3px_0_0_#334155] active:translate-y-[2px] active:shadow-[0_1px_0_0_#cbd5e1] transition-all duration-150 select-none cursor-pointer"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Đăng nhập</span>
                      </button>
                    </Link>
                    <Link
                      href="/dang-ky"
                      onClick={() => setIsOpen(false)}
                      className="w-full"
                    >
                      <button
                        type="button"
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0095F6] hover:bg-[#008be5] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_3.5px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba] transition-all duration-150 select-none cursor-pointer"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Đăng ký</span>
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
