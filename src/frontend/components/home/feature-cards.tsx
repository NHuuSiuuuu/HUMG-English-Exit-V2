"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Clock, Search, ArrowRight } from "lucide-react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";

export function FeatureCards() {
  const { t } = useLanguage();

  const features = [
    {
      icon: BookOpen,
      iconBg: "bg-primary/10 text-primary",
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
      iconBg: "bg-secondary/15 text-secondary",
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
      iconBg: "bg-accent/10 text-accent",
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
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-primary">
            {t("landing.features.tag", "Tính năng trọng tâm")}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
            {t("landing.features.title", "Mọi công cụ bạn cần để vượt qua chuẩn đầu ra")}
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
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
              <Card
                key={idx}
                className={`flex flex-col justify-between hover:shadow-md hover:border-primary/40 transition-all ${
                  item.highlight ? "ring-1 ring-primary/30" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-3 rounded-lg ${item.iconBg}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-surface-raised text-muted border border-border">
                      {item.badge}
                    </span>
                  </div>
                  <CardTitle className="text-xl pt-2">{item.title}</CardTitle>
                  <CardDescription className="text-sm pt-1">{item.desc}</CardDescription>
                </CardHeader>

                <CardFooter className="pt-2">
                  <Link href={item.href} className="w-full">
                    <Button
                      variant={item.highlight ? "primary" : "outline"}
                      className="w-full justify-between group"
                    >
                      <span>{item.action}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
