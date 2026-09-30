"use client";

import * as React from "react";
import { Accordion, AccordionItem } from "@/frontend/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      q: "Cấu trúc bài thi chuẩn đầu ra Tiếng Anh HUMG gồm những phần nào?",
      a: "Bài thi chuẩn đầu ra tiếng Anh tại HUMG áp dụng theo định dạng Cambridge KET (A2 Key) gồm 14 phần: 9 phần Reading & Writing (50 câu trắc nghiệm/điền từ và 1 bài viết note ngắn 25-35 từ) cùng 5 phần Listening (25 câu chọn tranh và điền thông tin). Tổng thời gian làm bài là 60 phút.",
      isOpenDefault: true,
    },
    {
      q: "Tôi có thể luyện tập trên điện thoại di động được không?",
      a: "Hoàn toàn được. Website được tối ưu hóa hiển thị responsive trên mọi kích thước màn hình từ điện thoại (375px), máy tính bảng đến máy tính để bàn. Vùng chạm và cỡ chữ được thiết kế chuẩn để bạn thao tác mượt mà.",
    },
    {
      q: "Khi thi thử, nếu mất mạng hoặc tải lại trang thì có mất bài không?",
      a: "Hệ thống có cơ chế tự động lưu nháp liên tục (autosave). Khi bạn tải lại trang hoặc đổi thiết bị, đáp án đã chọn và thời gian còn lại sẽ được khôi phục chính xác từ máy chủ.",
    },
    {
      q: "Tra cứu điểm thi trên trang có chính xác không?",
      a: "Trang tra cứu nhúng trực tiếp cổng thông tin kết quả thi chính thức của Trung tâm Ngoại ngữ - Tin học CFI HUMG (kqt.cfi.humg.edu.vn). Dữ liệu được tải trực tiếp từ nhà trường mà không lưu lại qua máy chủ trung gian.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-transparent">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0095F6]">
            Giải đáp thắc mắc
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Câu hỏi thường gặp về chuẩn đầu ra Tiếng Anh
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Những thông tin cần biết để chuẩn bị tốt nhất cho kỳ thi tại Trường Đại học Mỏ - Địa chất.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.04)]">
          <Accordion>
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} title={faq.q} isOpenDefault={faq.isOpenDefault}>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {faq.a}
                </p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
