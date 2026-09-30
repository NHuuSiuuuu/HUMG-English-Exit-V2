"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  FileQuestion,
  FileText,
  FolderArchive,
  Users,
  Settings,
  GraduationCap,
  ArrowLeft,
  X,
} from "lucide-react";
import { cn } from "@/frontend/lib/utils";
import { Button } from "@/frontend/components/ui/button";

interface AdminSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({ isMobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
    { href: "/admin/part-bank", label: "Kho phần (Part bank)", icon: Database },
    { href: "/admin/de-thi", label: "Đề thi thử (14 Parts)", icon: FileQuestion },
    { href: "/admin/bai-viet", label: "Quản lý bài viết", icon: FileText },
    { href: "/admin/tai-lieu", label: "Tài liệu & Audio", icon: FolderArchive },
    { href: "/admin/nguoi-dung", label: "Người dùng & Điểm", icon: Users },
    { href: "/admin/cai-dat", label: "Cài đặt hệ thống", icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between border-r border-border bg-surface text-foreground w-64 p-4">
      <div className="space-y-6">
        {/* Logo và Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-sm tracking-tight leading-none text-foreground">
                HUMG English
              </span>
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider mt-1">
                Khu quản trị Admin
              </span>
            </div>
          </Link>
          {onMobileClose && (
            <Button variant="ghost" size="icon" onClick={onMobileClose} className="md:hidden">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Menu Điều hướng */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-heading font-semibold transition-colors min-h-[44px]",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted hover:text-foreground hover:bg-surface-raised"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Nút quay về trang người dùng */}
      <div className="pt-4 border-t border-border">
        <Link href="/">
          <Button variant="outline" size="sm" className="w-full justify-center gap-2 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Về website sinh viên</span>
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in-50"
          onClick={onMobileClose}
        >
          <div
            className="fixed inset-y-0 left-0 z-50 w-64 bg-surface shadow-xl border-r border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
