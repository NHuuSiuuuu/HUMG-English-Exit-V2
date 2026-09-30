import test from "node:test";
import assert from "node:assert/strict";
import { createExamSchema, validateExamForPublish } from "./helpers/exam.schema.mjs";

test("createExamSchema - chặn mã đề chứa ký tự không hợp lệ", () => {
  const result = createExamSchema.safeParse({
    code: "KET 2026 T1!", // chứa khoảng trắng và dấu !
    title: "Đề thi thử 01",
    status: "DRAFT",
    partSelections: [],
  });

  assert.equal(result.success, false);
});

test("createExamSchema - hợp lệ với dữ liệu bản nháp (DRAFT) khi chưa đủ 14 parts", () => {
  const result = createExamSchema.safeParse({
    code: "KET-2026-T1",
    title: "Đề thi thử số 01",
    durationMinutes: 60,
    status: "DRAFT",
    partSelections: [
      { partNo: 1, partId: "part-1-id" },
      { partNo: 2, partId: "part-2-id" },
    ],
  });

  assert.equal(result.success, true);
});

test("validateExamForPublish - chặn công khai nếu chưa đủ 14 phần", () => {
  const input = {
    code: "KET-2026-T1",
    title: "Đề thi thử số 01",
    status: "PUBLISHED",
    partSelections: [
      { partNo: 1, partId: "part-1-id" },
      { partNo: 2, partId: "part-2-id" },
      { partNo: 3, partId: "part-3-id" },
    ],
  };

  const issues = validateExamForPublish(input);
  assert.equal(issues.length > 0, true);
  assert.equal(issues.some((issue) => issue.message.includes("chưa đủ 14 phần")), true);
});

test("validateExamForPublish - chặn công khai nếu bị trùng lặp Part", () => {
  const input = {
    code: "KET-2026-T1",
    title: "Đề thi thử số 01",
    status: "PUBLISHED",
    partSelections: [
      { partNo: 1, partId: "part-1a" },
      { partNo: 1, partId: "part-1b" }, // Trùng Part 1
      { partNo: 2, partId: "part-2" },
      { partNo: 3, partId: "part-3" },
      { partNo: 4, partId: "part-4" },
      { partNo: 5, partId: "part-5" },
      { partNo: 6, partId: "part-6" },
      { partNo: 7, partId: "part-7" },
      { partNo: 8, partId: "part-8" },
      { partNo: 9, partId: "part-9" },
      { partNo: 10, partId: "part-10" },
      { partNo: 11, partId: "part-11" },
      { partNo: 12, partId: "part-12" },
      { partNo: 13, partId: "part-13" },
      { partNo: 14, partId: "part-14" },
    ],
  };

  const issues = validateExamForPublish(input);
  assert.equal(issues.length > 0, true);
  assert.equal(issues.some((issue) => issue.message.includes("trùng lặp Part 1")), true);
});

test("validateExamForPublish - hợp lệ khi đủ chuẩn 14 phần từ Part 1 đến Part 14", () => {
  const input = {
    code: "KET-2026-T1",
    title: "Đề thi thử Chuẩn đầu ra số 01",
    status: "PUBLISHED",
    partSelections: Array.from({ length: 14 }, (_, i) => ({
      partNo: i + 1,
      partId: `part-${i + 1}-id`,
    })),
  };

  const issues = validateExamForPublish(input);
  assert.equal(issues.length, 0);
});
