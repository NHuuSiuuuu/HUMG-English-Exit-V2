"use client";

import * as React from "react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { Target, Timer, TrendingUp } from "lucide-react";

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Target,
      step: "Bước 01",
      title: "Luyện kỹ năng theo từng Part",
      desc: "Tự chọn những phần còn yếu để ôn luyện chuyên sâu. Đọc kỹ phần giải thích chi tiết để tích lũy từ vựng và ngữ pháp trọng tâm.",
      iconColor: "text-[#0095F6]",
      iconBg: "bg-sky-50 dark:bg-sky-950/60",
    },
    {
      icon: Timer,
      step: "Bước 02",
      title: "Thi thử 60 phút tính giờ",
      desc: "Thử sức với bộ đề hoàn chỉnh 14 phần dưới áp lực đồng hồ đếm ngược. Hệ thống tự động sao lưu bài làm liên tục.",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
    },
    {
      icon: TrendingUp,
      step: "Bước 03",
      title: "Phân tích điểm & Cải thiện",
      desc: "Xem bảng phân tích chi tiết câu đúng/sai, nghe lại audio có transcript phụ đề và theo dõi tiến độ cải thiện từng ngày.",
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-50 dark:bg-purple-950/60",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/50 dark:bg-[#0B1120]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0095F6]">
            Phương pháp học
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            3 bước nâng cao điểm số chuẩn đầu ra
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Lộ trình ôn tập rõ ràng giúp sinh viên nắm vững cấu trúc và tự tin bước vào kỳ thi chính thức.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800/80 hover:shadow-soft-lg hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${item.iconBg} ${item.iconColor} shadow-sm`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
