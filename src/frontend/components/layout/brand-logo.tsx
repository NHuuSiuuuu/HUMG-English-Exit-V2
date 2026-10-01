import Image from "next/image";
import { cn } from "@/frontend/lib/utils";

interface BrandLogoProps {
  /**
   * - "badge": Biểu tượng logo + Kiểu chữ thương hiệu (Header, MobileNav, Footer)
   * - "symbol": Chỉ biểu tượng không kèm chữ (bảng điều khiển nhỏ, avatar, form)
   * - "full": Trọn vẹn logo nghệ thuật gồm cả biểu tượng và chữ
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
      sm: { width: 160, height: 127, className: "h-16 w-auto" },
      md: { width: 220, height: 175, className: "h-24 w-auto" },
      lg: { width: 280, height: 223, className: "h-32 w-auto" },
    }[size];

    return (
      <div className={cn("inline-flex items-center justify-center bg-transparent", className)}>
        {/* Bản cho theme sáng */}
        <Image
          src="/logo.png"
          alt="HUMG English Exit"
          width={dimensions.width}
          height={dimensions.height}
          priority={priority}
          className={cn("object-contain dark:hidden", dimensions.className)}
        />
        {/* Bản cho theme tối */}
        <Image
          src="/logo-dark.png"
          alt="HUMG English Exit"
          width={dimensions.width}
          height={dimensions.height}
          priority={priority}
          className={cn("object-contain hidden dark:block", dimensions.className)}
        />
      </div>
    );
  }

  // Kích thước biểu tượng to rõ, bg trong suốt, không viền, không scale hover
  const iconBoxSizes = {
    sm: "h-10 w-10",
    md: "h-11 w-11 sm:h-12 sm:w-12",
    lg: "h-16 w-16",
  }[size];

  const imageSizes = {
    sm: { width: 40, height: 40, className: "h-9 w-9" },
    md: { width: 50, height: 50, className: "h-10 w-10 sm:h-11 sm:w-11" },
    lg: { width: 64, height: 64, className: "h-14 w-14" },
  }[size];

  const titleSizes = {
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg lg:text-xl",
    lg: "text-xl sm:text-2xl",
  }[size];

  // Chỉ hiển thị biểu tượng
  if (variant === "symbol") {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-transparent shrink-0 overflow-hidden",
          iconBoxSizes,
          className
        )}
      >
        <Image
          src="/logo-icon.png"
          alt="HUMG English Exit Logo"
          width={imageSizes.width}
          height={imageSizes.height}
          priority={priority}
          className={cn("object-contain", imageSizes.className)}
        />
      </div>
    );
  }

  // Biến thể mặc định: Logo biểu tượng to + Typography thương hiệu
  return (
    <div className={cn("flex items-center gap-2.5 sm:gap-3 bg-transparent", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center bg-transparent shrink-0 overflow-hidden",
          iconBoxSizes
        )}
      >
        <Image
          src="/logo-icon.png"
          alt="HUMG English Exit Logo"
          width={imageSizes.width}
          height={imageSizes.height}
          priority={priority}
          className={cn("object-contain", imageSizes.className)}
        />
      </div>
      <div className="flex flex-col justify-center">
        <span
          className={cn(
            "font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight",
            titleSizes
          )}
        >
          HUMG English Exit
        </span>
        {showSubtitle && (
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline-block mt-0.5 leading-none">
            Chuẩn đầu ra Tiếng Anh HUMG
          </span>
        )}
      </div>
    </div>
  );
}
