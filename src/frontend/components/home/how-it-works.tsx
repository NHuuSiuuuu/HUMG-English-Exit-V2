"use client";

import * as React from "react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { Target, Timer, TrendingUp } from "lucide-react";
import { Badge } from "@/frontend/components/ui/badge";

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Target,
      step: t("landing.howItWorks.step1.step", "Bước 01"),
      title: t("landing.howItWorks.step1.title", "Luyện kỹ năng theo từng Part"),
      desc: t(
        "landing.howItWorks.step1.desc",
        "Tự chọn những phần còn yếu để ôn luyện chuyên sâu. Đọc kỹ phần giải thích chi tiết để tích lũy từ vựng và ngữ pháp trọng tâm."
      ),
      accent: "text-primary border-primary/30 bg-primary/10",
    },
    {
      icon: Timer,
      step: t("landing.howItWorks.step2.step", "Bước 02"),
      title: t("landing.howItWorks.step2.title", "Thi thử 60 phút tính giờ"),
      desc: t(
        "landing.howItWorks.step2.desc",
        "Thử sức với bộ đề hoàn chỉnh 14 phần dưới áp lực đồng hồ đếm ngược. Hệ thống tự động sao lưu bài làm liên tục."
      ),
      accent: "text-secondary border-secondary/30 bg-secondary/15",
    },
    {
      icon: TrendingUp,
      step: t("landing.howItWorks.step3.step", "Bước 03"),
      title: t("landing.howItWorks.step3.title", "Phân tích điểm & Cải thiện"),
      desc: t(
        "landing.howItWorks.step3.desc",
        "Xem bảng phân tích chi tiết câu đúng/sai, nghe lại audio có transcript phụ đề và theo dõi tiến độ cải thiện từng ngày."
      ),
      accent: "text-accent border-accent/30 bg-accent/10",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <Badge variant="default" className="px-3 py-1 font-heading">
            {t("landing.howItWorks.tag", "Phương pháp học")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
            {t("landing.howItWorks.title", "3 bước nâng cao điểm số chuẩn đầu ra")}
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            {t(
              "landing.howItWorks.subtitle",
              "Lộ trình ôn tập rõ ràng giúp sinh viên nắm vững cấu trúc và tự tin bước vào kỳ thi chính thức."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col p-6 sm:p-8 rounded-lg border border-border bg-surface shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-lg border ${item.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-muted px-2.5 py-1 rounded bg-surface-raised border border-border">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
