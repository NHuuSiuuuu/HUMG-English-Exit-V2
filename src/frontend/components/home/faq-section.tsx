"use client";

import * as React from "react";
import { useLanguage } from "@/frontend/providers/language-provider";
import { Accordion, AccordionItem } from "@/frontend/components/ui/accordion";
import { Badge } from "@/frontend/components/ui/badge";

export function FAQSection() {
  const { t } = useLanguage();

  const faqs = [
    {
      q: t("landing.faq.q1", "Cấu trúc bài thi chuẩn đầu ra Tiếng Anh HUMG gồm những phần nào?"),
      a: t(
        "landing.faq.a1",
        "Bài thi chuẩn đầu ra tiếng Anh tại HUMG áp dụng theo định dạng Cambridge KET (A2 Key) gồm 14 phần: 9 phần Reading & Writing (50 câu trắc nghiệm/điền từ và 1 bài viết note ngắn 25-35 từ) cùng 5 phần Listening (25 câu chọn tranh và điền thông tin). Tổng thời gian làm bài là 60 phút."
      ),
      isOpenDefault: true,
    },
    {
      q: t("landing.faq.q2", "Tôi có thể luyện tập trên điện thoại di động được không?"),
      a: t(
        "landing.faq.a2",
        "Hoàn toàn được. Website được tối ưu hóa hiển thị responsive trên mọi kích thước màn hình từ điện thoại (375px), máy tính bảng đến máy tính để bàn. Vùng chạm và cỡ chữ được thiết kế chuẩn để bạn thao tác mượt mà."
      ),
    },
    {
      q: t("landing.faq.q3", "Khi thi thử, nếu mất mạng hoặc tải lại trang thì có mất bài không?"),
      a: t(
        "landing.faq.a3",
        "Hệ thống có cơ chế tự động lưu nháp liên tục (autosave). Khi bạn tải lại trang hoặc đổi thiết bị, đáp án đã chọn và thời gian còn lại sẽ được khôi phục chính xác từ máy chủ."
      ),
    },
    {
      q: t("landing.faq.q4", "Tra cứu điểm thi trên trang có chính xác không?"),
      a: t(
        "landing.faq.a4",
        "Trang tra cứu nhúng trực tiếp cổng thông tin kết quả thi chính thức của Trung tâm Ngoại ngữ - Tin học CFI HUMG (kqt.cfi.humg.edu.vn). Dữ liệu được tải trực tiếp từ nhà trường mà không lưu lại qua máy chủ trung gian."
      ),
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background border-t border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <Badge variant="default" className="px-3 py-1 font-heading">
            {t("landing.faq.tag", "Giải đáp thắc mắc")}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
            {t("landing.faq.title", "Câu hỏi thường gặp về chuẩn đầu ra Tiếng Anh")}
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            {t(
              "landing.faq.subtitle",
              "Những thông tin cần biết để chuẩn bị tốt nhất cho kỳ thi tại Trường Đại học Mỏ - Địa chất."
            )}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-sm">
          <Accordion>
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} title={faq.q} isOpenDefault={faq.isOpenDefault}>
                <p>{faq.a}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
