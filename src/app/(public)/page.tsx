import * as React from "react";
import { HeroSection } from "@/frontend/components/home/hero-section";
import { FeatureCards } from "@/frontend/components/home/feature-cards";
import { ExamStructure } from "@/frontend/components/home/exam-structure";
import { StatsSection } from "@/frontend/components/home/stats-section";
import { HowItWorks } from "@/frontend/components/home/how-it-works";
import { LatestArticles } from "@/frontend/components/home/latest-articles";
import { FAQSection } from "@/frontend/components/home/faq-section";

// Trang chủ (Landing page) - ghép các khối giao diện theo thứ tự quy định trong docs/PAGES.md
export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero: tiêu đề, mô tả ngắn, CTA kép, mockup bài thi */}
      <HeroSection />

      {/* 2. Ba thẻ chức năng: Ôn luyện từng phần · Thi thử mô phỏng · Tra cứu điểm */}
      <FeatureCards />

      {/* 3. Cấu trúc đề thi: 2 khối Reading & Writing và Listening (14 Parts) */}
      <ExamStructure />

      {/* 4. Số liệu tổng quan nổi bật */}
      <StatsSection />

      {/* 5. Cách hoạt động: 3 bước ôn luyện */}
      <HowItWorks />

      {/* 6. Bài viết mới nhất & cẩm nang */}
      <LatestArticles />

      {/* 7. Câu hỏi thường gặp (FAQ Accordion) */}
      <FAQSection />
    </div>
  );
}
