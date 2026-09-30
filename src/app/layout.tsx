import type { Metadata } from "next";
import { Nunito_Sans, Open_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/frontend/providers/theme-provider";
import { LanguageProvider } from "@/frontend/providers/language-provider";
import { LOCALE_COOKIE_NAME, type Locale } from "@/shared/types/i18n";
import "@/frontend/styles/globals.css";

// Font Nunito Sans cho tiêu đề, nút bấm, điều hướng theo DESIGN.md
const fontHeading = Nunito_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

// Font Open Sans cho nội dung bài đọc, câu hỏi và văn bản dài theo DESIGN.md
const fontSans = Open_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HUMG English Exit — Ôn luyện & Thi thử Chuẩn đầu ra Tiếng Anh",
  description:
    "Hệ thống ôn luyện và thi thử chuẩn đầu ra tiếng Anh dành riêng cho sinh viên Trường Đại học Mỏ - Địa chất. Cấu trúc chuẩn 14 phần Cambridge KET A2, tính giờ 60 phút và tra cứu điểm chính thức.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const savedLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value as Locale | undefined;
  const initialLocale: Locale = savedLocale === "en" ? "en" : "vi";

  return (
    <html lang={initialLocale} suppressHydrationWarning className={`${fontHeading.variable} ${fontSans.variable}`}>
      <body className="min-h-screen w-full bg-background bg-grid-pattern text-foreground antialiased flex flex-col font-sans transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLocale={initialLocale}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
