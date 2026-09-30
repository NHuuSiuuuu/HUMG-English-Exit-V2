import * as React from "react";
import Link from "next/link";
import { GraduationCap, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-background">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Link>

        <div className="rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-foreground">
              Đăng nhập tài khoản
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              Lưu tiến độ ôn luyện và theo dõi lịch sử thi thử của bạn
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Email</label>
              <input
                type="email"
                placeholder="sinhvien@humg.edu.vn"
                className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Mật khẩu</label>
                <Link href="/quen-mat-khau" className="text-xs text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
              />
            </div>

            <Button type="button" variant="primary" className="w-full justify-center gap-2 mt-2">
              <LogIn className="h-4 w-4" />
              <span>Đăng nhập</span>
            </Button>
          </form>

          <div className="border-t border-border pt-4 text-center text-xs text-muted">
            Chưa có tài khoản?{" "}
            <Link href="/dang-ky" className="font-semibold text-primary hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
