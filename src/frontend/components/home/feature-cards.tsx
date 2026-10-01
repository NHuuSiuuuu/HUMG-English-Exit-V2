"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Clock, Search, ArrowRight } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";

export function FeatureCards() {
  const { t } = useLanguage();

  const features = [
    {
      icon: BookOpen,
      iconColor: "text-[#0095F6]",
      iconBg: "bg-sky-50 dark:bg-sky-950/60",
      btnClass: "bg-[#0095F6] hover:bg-[#008be5] text-white shadow-[0_3.5px_0_0_#0275ba] active:translate-y-[2px] active:shadow-[0_1px_0_0_#0275ba]",
      title: t("landing.features.practice.title", "Ôn luyện từng phần"),
      desc: t(
        "landing.features.practice.desc",
        "Tập trung rèn luyện 14 dạng bài độc lập (Biển báo, Đoán từ, Điền form, Nghe tranh...). Không giới hạn thời gian, có đáp án và giải thích cặn kẽ."
      ),
      action: t("landing.features.practice.action", "Xem các dạng bài"),
      href: "/on-luyen",
      badge: "14 Dạng bài",
    },
    {
      icon: Clock,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
      btnClass: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_3.5px_0_0_#047857] active:translate-y-[2px] active:shadow-[0_1px_0_0_#047857]",
      title: t("landing.features.exam.title", "Thi thử mô phỏng 60 phút"),
      desc: t(
        "landing.features.exam.desc",
        "Trải nghiệm bài thi hoàn chỉnh 14 phần với đồng hồ đếm ngược máy chủ. Rèn phản xạ căn giờ và đối mặt với áp lực phòng thi thật."
      ),
      action: t("landing.features.exam.action", "Vào thi thử ngay"),
      href: "/thi-thu",
      badge: "Chuẩn 60 phút",
      highlight: true,
    },
    {
      icon: Search,
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-50 dark:bg-purple-950/60",
      btnClass: "bg-[#a855f7] hover:bg-[#9333ea] text-white shadow-[0_3.5px_0_0_#7e22ce] active:translate-y-[2px] active:shadow-[0_1px_0_0_#7e22ce]",
      title: t("landing.features.score.title", "Tra cứu điểm & Lịch thi"),
      desc: t(
        "landing.features.score.desc",
        "Tích hợp giao diện tra cứu trực tiếp từ Trung tâm Ngoại ngữ - Tin học CFI HUMG, giúp sinh viên cập nhật điểm số và số báo danh nhanh chóng."
      ),
      action: t("landing.features.score.action", "Tra cứu kết quả"),
      href: "/tra-cuu",
      badge: "CFI HUMG",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0095F6]">
            {t("landing.features.tag", "Tính năng trọng tâm")}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("landing.features.title", "Mọi công cụ bạn cần để vượt qua chuẩn đầu ra")}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            {t(
              "landing.features.subtitle",
              "Được thiết kế tối ưu cho thói quen học tập và cấu trúc bài thi thực tế của sinh viên Mỏ - Địa chất."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${item.iconBg} ${item.iconColor} shadow-sm`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    href={item.href}
                    className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-150 select-none cursor-pointer ${item.btnClass}`}
                  >
                    <span>{item.action}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
