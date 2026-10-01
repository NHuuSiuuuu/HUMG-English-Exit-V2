import * as React from "react";
import Link from "next/link";
import { BrandLogo } from "@/frontend/components/layout/brand-logo";
import { RegisterForm } from "@/frontend/components/auth/register-form";

export const metadata = {
  title: "Đăng ký tài khoản — HUMG English Exit",
  description: "Tạo tài khoản miễn phí để ôn luyện và thi thử chuẩn đầu ra tiếng Anh HUMG",
};

export default function RegisterPage() {
  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center p-4 sm:p-6 bg-transparent">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-6 transition-all duration-300 ease-in-out">
          <div className="text-center space-y-2.5">
            <div className="flex justify-center">
              <BrandLogo variant="symbol" size="lg" priority />
            </div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Đăng ký tài khoản
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Tạo tài khoản miễn phí để ôn luyện và thi thử chuẩn đầu ra
            </p>
          </div>

          <React.Suspense fallback={<div className="py-6 text-center text-xs text-slate-400">Đang tải biểu mẫu...</div>}>
            <RegisterForm />
          </React.Suspense>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Đã có tài khoản?{" "}
            <Link
              href="/dang-nhap"
              className="font-semibold text-[#0095F6] hover:underline"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
