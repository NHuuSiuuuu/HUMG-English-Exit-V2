import test from "node:test";
import assert from "node:assert/strict";
import {
  slugify,
  createArticleSchema,
  validateArticleForPublish,
} from "./helpers/article.schema.mjs";

test("slugify - chuyển đổi tiếng Việt có dấu thành slug chuẩn URL", () => {
  const result = slugify("Chiến thuật làm 9 Phần Reading & Writing không bị thiếu thời gian!");
  assert.equal(result, "chien-thuat-lam-9-phan-reading-writing-khong-bi-thieu-thoi-gian");
});

test("slugify - xử lý ký tự đ và khoảng trắng thừa", () => {
  const result = slugify("   Quy định Đề thi   tiếng Anh HUMG   ");
  assert.equal(result, "quy-dinh-de-thi-tieng-anh-humg");
});

test("createArticleSchema - chặn bài viết có tiêu đề dưới 5 ký tự", () => {
  const result = createArticleSchema.safeParse({
    title: "Mẹo",
    content: "Nội dung bài viết mẫu dài hơn 20 ký tự để kiểm tra.",
    category: "Mẹo làm bài thi KET",
    status: "DRAFT",
  });

  assert.equal(result.success, false);
});

test("createArticleSchema - hợp lệ với dữ liệu bản nháp (DRAFT)", () => {
  const result = createArticleSchema.safeParse({
    title: "Tổng hợp toàn bộ quy định Chuẩn đầu ra Ngoại ngữ HUMG",
    excerpt: "Tóm tắt ngắn gọn các quy định mới nhất.",
    content: "Chi tiết toàn bộ quy định chuẩn đầu ra áp dụng cho toàn thể sinh viên HUMG năm học 2026...",
    category: "Quy định & Lịch thi HUMG",
    coverImageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    status: "DRAFT",
    tags: ["HUMG", "KET"],
  });

  assert.equal(result.success, true);
});

test("validateArticleForPublish - chặn xuất bản nếu nội dung dưới 50 ký tự", () => {
  const input = {
    title: "Bài viết ngắn",
    content: "Nội dung quá ngắn",
    category: "Mẹo thi",
    status: "PUBLISHED",
  };

  const issues = validateArticleForPublish(input);
  assert.equal(issues.length > 0, true);
  assert.equal(issues.some((i) => i.field === "content"), true);
});

test("validateArticleForPublish - hợp lệ khi đạt đầy đủ tiêu chuẩn xuất bản", () => {
  const input = {
    title: "Bí quyết chinh phục 5 câu nghe chọn tranh Part 10 Cambridge KET",
    excerpt: "Phân tích cấu trúc dạng tranh ảnh và các bẫy thường gặp trong đề thi.",
    content:
      "Dạng bài Part 10 trong đề thi Cambridge KET yêu cầu thí sinh lắng nghe 5 đoạn hội thoại ngắn và chọn 1 trong 3 bức tranh A/B/C tương ứng. Bài viết này hướng dẫn chi tiết từng bước...",
    category: "Kỹ năng Listening",
    status: "PUBLISHED",
  };

  const issues = validateArticleForPublish(input);
  assert.equal(issues.length, 0);
});
