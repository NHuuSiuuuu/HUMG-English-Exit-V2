"use client";

import * as React from "react";
import { cn } from "@/frontend/lib/utils";

// Context xác định khu vực Admin để tự động chuyển sang phong cách nút bấm phẳng, tối giản
const AdminButtonContext = React.createContext<boolean>(false);

export function AdminButtonProvider({
  children,
  isAdmin = true,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) {
  return (
    <AdminButtonContext.Provider value={isAdmin}>
      {children}
    </AdminButtonContext.Provider>
  );
}

export function useAdminButton() {
  return React.useContext(AdminButtonContext);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "ai" | "purple";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  /** Ép buộc sử dụng kiểu nút bấm phẳng, tối giản (không hiệu ứng 3D) */
  isFlat?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      isFlat,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isContextAdmin = useAdminButton();
    const useFlat = isFlat !== undefined ? isFlat : isContextAdmin;

    // Phong cách 3D xúc giác hiện đại (dành cho người dùng / client)
    const clientBaseStyles =
      "inline-flex items-center justify-center font-heading font-bold rounded-xl transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0095F6] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 select-none cursor-pointer";

    const clientVariantStyles = {
      primary:
        "bg-[#0095F6] hover:bg-[#008be5] text-white shadow-[0_3.5px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba]",
      secondary:
        "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_3.5px_0_0_#047857] active:translate-y-[2px] active:shadow-[0_1px_0_0_#047857]",
      danger:
        "bg-[#ff4d4f] hover:bg-[#f5383a] text-white shadow-[0_3.5px_0_0_#c92a2a] active:translate-y-[2px] active:shadow-[0_1px_0_0_#c92a2a]",
      outline:
        "border-2 border-[#0095F6] dark:border-sky-400 bg-white dark:bg-slate-900 text-[#0095F6] dark:text-sky-400 shadow-[0_3.5px_0_0_#0095F6] dark:shadow-[0_3.5px_0_0_#38bdf8] hover:bg-sky-50/40 dark:hover:bg-sky-950/30 active:translate-y-[2px] active:shadow-[0_1px_0_0_#0095F6] dark:active:shadow-[0_1px_0_0_#38bdf8]",
      ghost:
        "border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-[0_3px_0_0_#cbd5e1] dark:shadow-[0_3px_0_0_#334155] hover:bg-slate-50 dark:hover:bg-slate-800 active:translate-y-[2px] active:shadow-[0_1px_0_0_#cbd5e1] dark:active:shadow-[0_1px_0_0_#334155]",
      ai:
        "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-[0_3.5px_0_0_#3730a3] active:translate-y-[2px] active:shadow-[0_1px_0_0_#3730a3]",
      purple:
        "bg-[#a855f7] hover:bg-[#9333ea] text-white shadow-[0_3.5px_0_0_#7e22ce] active:translate-y-[2px] active:shadow-[0_1px_0_0_#7e22ce]",
    };

    const clientSizeStyles = {
      sm: "h-9 px-4 text-sm font-bold min-h-[38px]",
      md: "h-11 px-5 text-sm sm:text-base font-bold min-h-[44px]",
      lg: "h-12 px-6 text-base sm:text-lg font-bold min-h-[48px]",
      icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-2",
    };

    // Phong cách phẳng, tối giản, sạch sẽ và dễ nhìn (dành cho trang /admin)
    const adminBaseStyles =
      "inline-flex items-center justify-center font-heading font-semibold rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0095F6]/40 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer shadow-none translate-y-0 active:translate-y-0";

    const adminVariantStyles = {
      primary:
        "bg-[#0095F6] hover:bg-[#008be5] text-white active:bg-[#007ccf] shadow-none",
      secondary:
        "bg-emerald-600 hover:bg-emerald-700 text-white active:bg-emerald-800 shadow-none",
      danger:
        "bg-[#ff4d4f] hover:bg-[#f5383a] text-white active:bg-[#d92b2e] shadow-none",
      outline:
        "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 active:bg-slate-100 dark:active:bg-slate-800 shadow-none",
      ghost:
        "border-0 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 active:bg-slate-200/80 dark:active:bg-slate-700/80 shadow-none",
      ai:
        "bg-indigo-600 hover:bg-indigo-700 text-white active:bg-indigo-800 shadow-none",
      purple:
        "bg-[#a855f7] hover:bg-[#9333ea] text-white active:bg-[#7e22ce] shadow-none",
    };

    const adminSizeStyles = {
      sm: "h-8 px-3 text-xs font-semibold rounded-md",
      md: "h-9 px-4 text-sm font-semibold rounded-lg",
      lg: "h-10 px-5 text-sm sm:text-base font-semibold rounded-lg",
      icon: "h-9 w-9 p-1.5 rounded-lg",
    };

    const baseClass = useFlat ? adminBaseStyles : clientBaseStyles;
    const variantClass = useFlat ? adminVariantStyles[variant] : clientVariantStyles[variant];
    const sizeClass = useFlat ? adminSizeStyles[size] : clientSizeStyles[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseClass, variantClass, sizeClass, className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
