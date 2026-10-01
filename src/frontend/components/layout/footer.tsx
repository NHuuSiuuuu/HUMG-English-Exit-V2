"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Heart, MessageSquare } from "lucide-react";
import { BrandLogo } from "@/frontend/components/layout/brand-logo";
import { useLanguage } from "@/frontend/providers/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-slate-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="md:col-span-2 space-y-3.5">
            <BrandLogo variant="badge" size="md" showSubtitle={false} />
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed font-normal">
              Website ôn luyện và thi thử chuẩn đầu ra tiếng Anh dành riêng cho sinh viên Trường Đại học Mỏ - Địa chất (HUMG).
            </p>
            <p className="text-xs text-slate-400 max-w-md italic">
              Lưu ý: Website hỗ trợ ôn tập phi thương mại cho sinh viên HUMG. Mọi thông tin thi chính thức thuộc thẩm quyền nhà trường.
            </p>
          </div>

          {/* Cột 2: Điều hướng nhanh */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/on-luyen" className="hover:text-[#0095F6] transition-colors py-1 inline-block">
                  Ôn luyện từng phần
                </Link>
              </li>
              <li>
                <Link href="/thi-thu" className="hover:text-[#0095F6] transition-colors py-1 inline-block">
                  Thi thử 60 phút
                </Link>
              </li>
              <li>
                <Link href="/bai-viet" className="hover:text-[#0095F6] transition-colors py-1 inline-block">
                  Bài viết hướng dẫn
                </Link>
              </li>
              <li>
                <Link href="/tra-cuu" className="hover:text-[#0095F6] transition-colors py-1 inline-block">
                  Tra cứu kết quả thi
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Cổng CFI HUMG & Góp ý */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Hệ thống CFI HUMG
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Cổng tra cứu điểm & lịch thi chính thức của Trung tâm Ngoại ngữ - Tin học CFI
            </p>
            <a
              href="https://kqt.cfi.humg.edu.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0095F6] hover:underline py-1"
            >
              kqt.cfi.humg.edu.vn
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <div className="pt-1">
              <a
                href="mailto:contact@humg-english.site"
                className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Góp ý & Báo lỗi</span>
              </a>
            </div>
          </div>
        </div>

        {/* Chân footer */}
        <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 HUMG English Exit. Phát triển vì cộng đồng sinh viên HUMG.</p>
          <div className="flex items-center gap-1 text-xs">
            <span>Xây dựng với</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>cho sinh viên HUMG</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
