"use client";

import * as React from "react";
import { BookOpen, Clock, Zap, Laptop } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      value: "14",
      label: "Dạng bài ôn luyện chuẩn KET",
      icon: BookOpen,
      iconBg: "bg-sky-50 dark:bg-sky-950/60 text-[#0095F6]",
    },
    {
      value: "60",
      suffix: "phút",
      label: "Phút thi thử mô phỏng thực tế",
      icon: Clock,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
    },
    {
      value: "100%",
      label: "Chấm điểm & giải thích tức thì",
      icon: Zap,
      iconBg: "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
    },
    {
      value: "24/7",
      label: "Luyện tập linh hoạt mọi thiết bị",
      icon: Laptop,
      iconBg: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.03)] hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <div className={`p-3 rounded-2xl mb-3 ${item.iconBg} shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span className="text-xs sm:text-sm font-semibold text-slate-400">{item.suffix}</span>
                  )}
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
