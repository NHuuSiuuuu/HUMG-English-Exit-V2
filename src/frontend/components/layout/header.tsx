"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogIn } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { ThemeToggle } from "@/frontend/components/layout/theme-toggle";
import { MobileNav } from "@/frontend/components/layout/mobile-nav";
import { cn } from "@/frontend/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navLinks = [
    { href: "/on-luyen", label: t("common.nav.practice", "Ôn luyện") },
    { href: "/thi-thu", label: t("common.nav.mockExam", "Thi thử") },
    { href: "/bai-viet", label: t("common.nav.articles", "Bài viết") },
    { href: "/tra-cuu", label: t("common.nav.checkScore", "Tra cứu điểm") },
    { href: "/admin", label: t("common.nav.admin", "Quản trị") },
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
                  "px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out min-h-[38px] flex items-center",
                  isActive
                    ? "text-[#0095F6] bg-sky-50 dark:bg-sky-950/50 dark:text-sky-300"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls: Theme, Auth, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/dang-nhap"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 ease-in-out flex items-center gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Đăng nhập</span>
            </Link>
            <Link
              href="/dang-ky"
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#0095F6] hover:bg-sky-600 text-white shadow-[0_2px_8px_rgba(0,149,246,0.25)] transition-all duration-300 ease-in-out"
            >
              Đăng ký
            </Link>
          </div>

          {/* Mobile Drawer Button */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
