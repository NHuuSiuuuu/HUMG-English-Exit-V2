"use client";

import * as React from "react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { BookOpen, Clock, Zap, Laptop } from "lucide-react";

export function StatsSection() {
  const { t } = useLanguage();

  const stats = [
    {
      value: t("landing.stats.item1Value", "14"),
      label: t("landing.stats.item1Label", "Dạng bài ôn luyện chuẩn"),
      icon: BookOpen,
      color: "text-primary",
    },
    {
      value: t("landing.stats.item2Value", "60"),
      suffix: "phút",
      label: t("landing.stats.item2Label", "Phút thi thử mô phỏng"),
      icon: Clock,
      color: "text-secondary",
    },
    {
      value: t("landing.stats.item3Value", "100%"),
      label: t("landing.stats.item3Label", "Chấm điểm tự động tức thì"),
      icon: Zap,
      color: "text-accent",
    },
    {
      value: t("landing.stats.item4Value", "24/7"),
      label: t("landing.stats.item4Label", "Luyện tập mọi lúc trên mọi thiết bị"),
      icon: Laptop,
      color: "text-primary",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-surface-raised/50 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-surface border border-border shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className={`p-2.5 rounded-md bg-surface-raised mb-3 ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground">
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span className="text-sm font-semibold text-muted">{item.suffix}</span>
                  )}
                </div>
                <p className="mt-2 text-xs sm:text-sm text-muted font-medium">
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
