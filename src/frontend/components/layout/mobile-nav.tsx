"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X, BookOpen, Clock, FileText, Search, LogIn, UserPlus } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { cn } from "@/frontend/lib/utils";

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

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
    { href: "/on-luyen", label: t("common.nav.practice", "Ôn luyện"), icon: BookOpen },
    { href: "/thi-thu", label: t("common.nav.mockExam", "Thi thử"), icon: Clock },
    { href: "/bai-viet", label: t("common.nav.articles", "Bài viết"), icon: FileText },
    { href: "/tra-cuu", label: t("common.nav.checkScore", "Tra cứu điểm"), icon: Search },
    { href: "/admin", label: t("common.nav.admin", "Quản trị"), icon: LogIn },
  ];

  return (
    <div className="md:hidden">
      {/* Nút Hamburger trên Header với hiệu ứng xoay và nhún mượt */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Đóng danh mục" : "Mở danh mục"}
        aria-expanded={isOpen}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all duration-300"
      >
        <span className={cn("transition-transform duration-300 ease-in-out flex items-center justify-center", isOpen && "rotate-90")}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </span>
      </button>

      {/* Dùng React Portal đưa Drawer ra document.body với transition 2 chiều mượt mà */}
      {mounted && createPortal(
        <div
          className={cn(
            "fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsOpen(false)}
          aria-hidden={!isOpen}
        >
          {/* Menu Drawer trượt vào từ mép phải với transition transform mượt mà */}
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
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0095F6] text-white shadow-sm transition-transform duration-300 hover:scale-105">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <span className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                    HUMG English Exit
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Đóng menu"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:rotate-90 active:scale-90"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Danh sách các liên kết điều hướng */}
              <nav className="mt-5 flex flex-col space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
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
                      <Icon className={cn("h-5 w-5 transition-transform duration-200", isActive ? "text-[#0095F6] dark:text-sky-300 scale-110" : "text-slate-400 dark:text-slate-500")} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Các nút Đăng nhập / Đăng ký ở chân Drawer */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2.5 mt-auto">
              <Link href="/dang-nhap" onClick={() => setIsOpen(false)} className="w-full">
                <button
                  type="button"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ease-in-out"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t("common.nav.login", "Đăng nhập")}</span>
                </button>
              </Link>
              <Link href="/dang-ky" onClick={() => setIsOpen(false)} className="w-full">
                <button
                  type="button"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0095F6] hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,149,246,0.25)] active:scale-[0.98] transition-all duration-300 ease-in-out"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{t("common.nav.register", "Đăng ký")}</span>
                </button>
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
