import * as React from "react";
import Link from "next/link";
import { KeyRound, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

export const metadata = {
  title: "Quên mật khẩu — HUMG English Exit",
  description: "Khôi phục mật khẩu tài khoản ôn luyện tiếng Anh HUMG",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex items-center justify-center p-4 sm:p-6 bg-transparent">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] space-y-6 transition-all duration-300 ease-in-out">
          <div className="text-center space-y-2.5">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-[#0095F6] shadow-sm">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Quên mật khẩu
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Nhập email sinh viên của bạn để nhận hướng dẫn khôi phục mật khẩu
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email đã đăng ký
              </label>
              <input
                type="email"
                placeholder="sinhvien@humg.edu.vn"
                className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#0095F6] focus:border-transparent transition-all duration-300 ease-in-out min-h-[44px]"
              />
            </div>

            <Button
              type="button"
              variant="primary"
              className="w-full justify-center gap-2 mt-2 min-h-[44px] hover:-translate-y-0.5 transition-all duration-300 ease-in-out shadow-[0_4px_12px_rgba(0,149,246,0.25)]"
            >
              <Send className="h-4 w-4" />
              <span>Gửi hướng dẫn khôi phục</span>
            </Button>
          </form>

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
