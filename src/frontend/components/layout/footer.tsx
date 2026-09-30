"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, ExternalLink, Heart, MessageSquare } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-border bg-surface text-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Cột 1: Thông tin thương hiệu */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-heading font-extrabold text-lg text-foreground">
                HUMG English Exit
              </span>
            </div>
            <p className="text-sm text-muted max-w-md leading-relaxed">
              {t(
                "common.footer.desc",
                "Website ôn luyện và thi thử chuẩn đầu ra tiếng Anh dành riêng cho sinh viên Trường Đại học Mỏ - Địa chất (HUMG)."
              )}
            </p>
            <p className="text-xs text-muted/80 max-w-md italic">
              {t(
                "common.footer.disclaimer",
                "Lưu ý: Website hỗ trợ ôn tập phi thương mại cho sinh viên HUMG. Mọi thông tin thi chính thức thuộc thẩm quyền nhà trường."
              )}
            </p>
          </div>

          {/* Cột 2: Điều hướng nhanh */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground">
              {t("common.footer.quickLinks", "Liên kết nhanh")}
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/on-luyen" className="hover:text-primary transition-colors py-1 inline-block">
                  {t("common.nav.practice", "Ôn luyện từng phần")}
                </Link>
              </li>
              <li>
                <Link href="/thi-thu" className="hover:text-primary transition-colors py-1 inline-block">
                  {t("common.nav.mockExam", "Thi thử 60 phút")}
                </Link>
              </li>
              <li>
                <Link href="/bai-viet" className="hover:text-primary transition-colors py-1 inline-block">
                  {t("common.nav.articles", "Bài viết hướng dẫn")}
                </Link>
              </li>
              <li>
                <Link href="/tra-cuu" className="hover:text-primary transition-colors py-1 inline-block">
                  {t("common.nav.checkScore", "Tra cứu kết quả thi")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Cổng CFI HUMG & Góp ý */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-foreground">
              {t("common.footer.cfiPortal", "Hệ thống CFI HUMG")}
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              {t(
                "common.footer.cfiPortalDesc",
                "Cổng tra cứu điểm & lịch thi chính thức của Trung tâm Ngoại ngữ - Tin học CFI"
              )}
            </p>
            <a
              href="https://kqt.cfi.humg.edu.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline py-1"
            >
              kqt.cfi.humg.edu.vn
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <div className="pt-2">
              <a
                href="mailto:contact@humg-english.site"
                className="inline-flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors p-1 rounded-sm"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {t("common.footer.feedback", "Góp ý & Báo lỗi")}
              </a>
            </div>
          </div>
        </div>

        {/* Chân footer */}
        <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>{t("common.footer.copyright", "© 2026 HUMG English Exit. Phát triển vì cộng đồng sinh viên HUMG.")}</p>
          <div className="flex items-center gap-1 text-xs">
            <span>Xây dựng với</span>
            <Heart className="h-3.5 w-3.5 text-accent fill-accent" />
            <span>cho sinh viên HUMG</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
