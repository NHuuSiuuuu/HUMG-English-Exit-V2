"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KeyRound, Eye, EyeOff, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = React.useState(false);

  if (!token) {
    return (
      <div className="space-y-4 text-center py-4">
        <div className="flex items-center justify-center p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60 text-xs sm:text-sm">
          <span>Mã đặt lại mật khẩu không tồn tại hoặc liên kết không đúng.</span>
        </div>
        <Link href="/quen-mat-khau" className="inline-block mt-2">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Yêu cầu liên kết mới</span>
          </Button>
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!password || password.length < 8) {
      errors.password = "Mật khẩu mới phải có tối thiểu 8 ký tự";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      toast.success("Đặt lại mật khẩu thành công!");
    } catch {
      toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-sm">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
            Đặt lại mật khẩu thành công!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Mật khẩu mới của bạn đã được cập nhật thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/dang-nhap">
            <Button variant="primary" className="w-full justify-center gap-2">
              <span>Đăng nhập ngay</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Mật khẩu mới */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
          Mật khẩu mới <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
            }}
            placeholder="Tối thiểu 8 ký tự"
            disabled={isLoading}
            required
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 pl-3.5 pr-11 py-2.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#0095F6] focus:border-transparent transition-all duration-200 min-h-[44px] disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-xs text-rose-500 dark:text-rose-400">{fieldErrors.password}</p>
        )}
      </div>

      {/* Xác nhận mật khẩu mới */}
      <div className="space-y-1.5">
        <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
          Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
        </label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirmPassword)
              setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          placeholder="Nhập lại mật khẩu mới"
          disabled={isLoading}
          required
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3.5 py-2.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#0095F6] focus:border-transparent transition-all duration-200 min-h-[44px] disabled:opacity-60"
        />
        {fieldErrors.confirmPassword && (
          <p className="text-xs text-rose-500 dark:text-rose-400">{fieldErrors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full justify-center gap-2 mt-2 min-h-[44px] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_12px_rgba(0,149,246,0.25)]"
      >
        <KeyRound className="h-4 w-4" />
        <span>Lưu mật khẩu mới</span>
      </Button>
    </form>
  );
}
