import Image from "next/image";
import { cn } from "@/frontend/lib/utils";

interface BrandLogoProps {
  /**
   * - "badge": Biểu tượng huy hiệu trong khung bo tròn + Kiểu chữ thương hiệu (Header, MobileNav, Footer)
   * - "symbol": Chỉ biểu tượng huy hiệu không kèm chữ (bảng điều khiển nhỏ, avatar)
   * - "full": Trọn vẹn logo nghệ thuật gồm cả biểu tượng và chữ (Trang đăng nhập, trang đăng ký, landing)
   */
  variant?: "badge" | "symbol" | "full";
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  variant = "badge",
  size = "md",
  showSubtitle = true,
  className,
  priority = false,
}: BrandLogoProps) {
  // Biến thể hiển thị toàn bộ Logo nghệ thuật
  if (variant === "full") {
    const dimensions = {
      sm: { width: 140, height: 111, className: "h-14 w-auto" },
      md: { width: 180, height: 143, className: "h-20 w-auto" },
      lg: { width: 240, height: 191, className: "h-28 w-auto" },
    }[size];

    return (
      <div className={cn("inline-flex items-center justify-center", className)}>
        {/* Bản cho theme sáng */}
        <Image
          src="/logo.png"
          alt="HUMG English Exit"
          width={dimensions.width}
          height={dimensions.height}
          priority={priority}
          className={cn("object-contain dark:hidden drop-shadow-sm", dimensions.className)}
        />
        {/* Bản cho theme tối */}
        <Image
          src="/logo-dark.png"
          alt="HUMG English Exit"
          width={dimensions.width}
          height={dimensions.height}
          priority={priority}
          className={cn("object-contain hidden dark:block drop-shadow-sm", dimensions.className)}
        />
      </div>
    );
  }

  // Cấu hình kích cỡ khung biểu tượng
  const iconSizes = {
    sm: "h-9 w-9",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }[size];

  const imageSizes = {
    sm: { width: 28, height: 28, className: "h-6 w-6" },
    md: { width: 34, height: 34, className: "h-7 w-7" },
    lg: { width: 44, height: 44, className: "h-9 w-9" },
  }[size];

  const titleSizes = {
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
  }[size];

  // Chỉ hiển thị biểu tượng huy hiệu
  if (variant === "symbol") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 shadow-sm shrink-0 overflow-hidden",
          iconSizes,
          className
        )}
      >
        <Image
          src="/logo-icon.png"
          alt="HUMG English Exit Emblem"
          width={imageSizes.width}
          height={imageSizes.height}
          priority={priority}
          className={cn("object-contain drop-shadow-sm", imageSizes.className)}
        />
      </div>
    );
  }

  // Biến thể mặc định: Badge biểu tượng + Typography thương hiệu
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-sky-50/85 dark:bg-sky-950/40 border border-sky-100/90 dark:border-sky-900/60 shadow-sm shrink-0 overflow-hidden transition-transform duration-200 group-hover:scale-105",
          iconSizes
        )}
      >
        <Image
          src="/logo-icon.png"
          alt="HUMG English Exit Emblem"
          width={imageSizes.width}
          height={imageSizes.height}
          priority={priority}
          className={cn("object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-110", imageSizes.className)}
        />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-none",
            titleSizes
          )}
        >
          HUMG English Exit
        </span>
        {showSubtitle && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline-block mt-0.5">
            Chuẩn đầu ra Tiếng Anh HUMG
          </span>
        )}
      </div>
    </div>
  );
}
