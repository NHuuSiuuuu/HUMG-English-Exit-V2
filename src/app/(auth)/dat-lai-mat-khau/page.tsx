import * as React from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft } from "lucide-react";
import { ResetPasswordForm } from "@/frontend/components/auth/reset-password-form";

export const metadata = {
  title: "Đặt lại mật khẩu — HUMG English Exit",
  description: "Thiết lập mật khẩu mới cho tài khoản ôn luyện tiếng Anh HUMG",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center p-4 sm:p-6 bg-transparent">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-6 transition-all duration-300 ease-in-out">
          <div className="text-center space-y-2.5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] shadow-sm">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Đặt lại mật khẩu
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          <React.Suspense
            fallback={
              <div className="py-8 text-center text-xs text-slate-400">
                Đang tải biểu mẫu...
              </div>
            }
          >
            <ResetPasswordForm />
          </React.Suspense>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            <Link
              href="/dang-nhap"
              className="inline-flex items-center gap-1.5 font-semibold text-[#0095F6] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
