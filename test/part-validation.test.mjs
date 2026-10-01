import test from "node:test";
import assert from "node:assert/strict";
import { createPartSchema, updatePartSchema, validatePartForPublish } from "./helpers/part.schema.mjs";

test("createPartSchema - chặn partNo không hợp lệ (ngoài khoảng 1-14)", () => {
  const result = createPartSchema.safeParse({
    partNo: 15,
    skill: "READING_WRITING",
    questionType: "MATCH_POOL",
    title: "Bài luyện Test",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Đọc và nối",
    status: "DRAFT",
    questions: [],
  });

  assert.equal(result.success, false);
});

test("createPartSchema - chặn tiêu đề rỗng", () => {
  const result = createPartSchema.safeParse({
    partNo: 1,
    skill: "READING_WRITING",
    questionType: "MATCH_POOL",
    title: "",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Đọc và nối",
    status: "DRAFT",
    questions: [],
  });

  assert.equal(result.success, false);
});

test("createPartSchema - hợp lệ với dữ liệu bản nháp (DRAFT)", () => {
  const result = createPartSchema.safeParse({
    partNo: 1,
    skill: "READING_WRITING",
    questionType: "MATCH_POOL",
    title: "Bài luyện KET 5 - Test 1",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Nối câu với biển báo phù hợp",
    status: "DRAFT",
    passageText: "A: Notice A\nB: Notice B",
    poolOptions: [
      { letter: "A", text: "Notice A" },
      { letter: "B", text: "Notice B" },
    ],
    questions: [
      {
        orderNumber: 1,
        prompt: "Câu hỏi 1",
        correctAnswer: "A",
        explanation: "Giải thích 1",
      },
    ],
  });

  assert.equal(result.success, true);
});

test("validatePartForPublish - chặn công khai nếu số câu hỏi chưa đủ chuẩn KET", () => {
  // Part 1 theo chuẩn Cambridge KET cần đúng 5 câu hỏi
  const input = {
    partNo: 1,
    skill: "READING_WRITING",
    questionType: "MATCH_POOL",
    title: "Bài luyện Part 1",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Nối biển báo",
    status: "PUBLISHED",
    passageText: "Nội dung bài đọc",
    poolOptions: [
      { letter: "A", text: "A" },
      { letter: "B", text: "B" },
      { letter: "C", text: "C" },
      { letter: "D", text: "D" },
      { letter: "E", text: "E" },
    ],
    questions: [
      { orderNumber: 1, prompt: "Q1", correctAnswer: "A" },
      { orderNumber: 2, prompt: "Q2", correctAnswer: "B" },
    ], // Chỉ có 2 câu thay vì 5 câu
  };

  const issues = validatePartForPublish(input);
  assert.equal(issues.length > 0, true);
  assert.equal(issues.some((issue) => issue.field === "questions"), true);
});

test("validatePartForPublish - chặn công khai nếu có câu hỏi thiếu đáp án đúng", () => {
  const input = {
    partNo: 2,
    skill: "READING_WRITING",
    questionType: "MCQ3",
    title: "Bài luyện Part 2",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Chọn từ đúng",
    status: "PUBLISHED",
    questions: [
      { orderNumber: 1, prompt: "Q1", correctAnswer: "A" },
      { orderNumber: 2, prompt: "Q2", correctAnswer: "" }, // Thiếu đáp án đúng
      { orderNumber: 3, prompt: "Q3", correctAnswer: "C" },
      { orderNumber: 4, prompt: "Q4", correctAnswer: "B" },
      { orderNumber: 5, prompt: "Q5", correctAnswer: "A" },
    ],
  };

  const issues = validatePartForPublish(input);
  assert.equal(issues.length > 0, true);
  assert.equal(issues.some((issue) => issue.message.includes("câu 2")), true);
});

test("validatePartForPublish - chặn công khai bài Listening nếu thiếu audioUrl", () => {
  const input = {
    partNo: 10,
    skill: "LISTENING",
    questionType: "MCQ3_IMAGE",
    title: "Bài nghe Part 10",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Nghe và chọn tranh",
    status: "PUBLISHED",
    audioUrl: "", // Rỗng
    questions: [
      { orderNumber: 1, prompt: "Q1", correctAnswer: "A" },
      { orderNumber: 2, prompt: "Q2", correctAnswer: "B" },
      { orderNumber: 3, prompt: "Q3", correctAnswer: "C" },
      { orderNumber: 4, prompt: "Q4", correctAnswer: "A" },
      { orderNumber: 5, prompt: "Q5", correctAnswer: "B" },
    ],
  };

  const issues = validatePartForPublish(input);
  assert.equal(issues.length > 0, true);
  assert.equal(issues.some((issue) => issue.field === "audioUrl"), true);
});

test("validatePartForPublish - hợp lệ khi đáp ứng đủ tất cả tiêu chuẩn", () => {
  const input = {
    partNo: 1,
    skill: "READING_WRITING",
    questionType: "MATCH_POOL",
    title: "Bài luyện Part 1",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Nối biển báo",
    status: "PUBLISHED",
    passageText: "A: ...\nB: ...",
    poolOptions: [
      { letter: "A", text: "Biển A" },
      { letter: "B", text: "Biển B" },
      { letter: "C", text: "Biển C" },
      { letter: "D", text: "Biển D" },
      { letter: "E", text: "Biển E" },
    ],
    questions: [
      { orderNumber: 1, prompt: "Q1", correctAnswer: "A" },
      { orderNumber: 2, prompt: "Q2", correctAnswer: "B" },
      { orderNumber: 3, prompt: "Q3", correctAnswer: "C" },
      { orderNumber: 4, prompt: "Q4", correctAnswer: "D" },
      { orderNumber: 5, prompt: "Q5", correctAnswer: "E" },
    ],
  };

  const issues = validatePartForPublish(input);
  assert.equal(issues.length, 0);
});

test("validatePartForPublish - Part 4: chặn công khai nếu thiếu cả passageText và passageImageUrl", () => {
  const input = {
    partNo: 4,
    skill: "READING_WRITING",
    questionType: "MCQ3",
    title: "Bài đọc hiểu Part 4",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Đọc bài đọc và chọn đáp án",
    status: "PUBLISHED",
    passageText: "",
    passageImageUrl: "",
    questions: [
      { orderNumber: 1, prompt: "Q1", correctAnswer: "A" },
      { orderNumber: 2, prompt: "Q2", correctAnswer: "B" },
      { orderNumber: 3, prompt: "Q3", correctAnswer: "C" },
      { orderNumber: 4, prompt: "Q4", correctAnswer: "A" },
      { orderNumber: 5, prompt: "Q5", correctAnswer: "B" },
      { orderNumber: 6, prompt: "Q6", correctAnswer: "C" },
      { orderNumber: 7, prompt: "Q7", correctAnswer: "A" },
    ],
  };

  const issues = validatePartForPublish(input);
  assert.equal(issues.length > 0, true);
  assert.equal(issues.some((issue) => issue.field === "passageImageUrl"), true);
});

test("validatePartForPublish - Part 4: chấp nhận công khai khi chỉ có passageImageUrl (dùng ảnh bài đọc)", () => {
  const input = {
    partNo: 4,
    skill: "READING_WRITING",
    questionType: "MCQ3",
    title: "Bài đọc hiểu Part 4 (dùng ảnh)",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Đọc bài đọc theo ảnh và chọn đáp án",
    status: "PUBLISHED",
    passageText: "", // Rỗng
    passageImageUrl: "https://example.com/ket5-reading-p4.png", // Có link ảnh
    questions: [
      { orderNumber: 1, prompt: "Q1", correctAnswer: "A" },
      { orderNumber: 2, prompt: "Q2", correctAnswer: "B" },
      { orderNumber: 3, prompt: "Q3", correctAnswer: "C" },
      { orderNumber: 4, prompt: "Q4", correctAnswer: "A" },
      { orderNumber: 5, prompt: "Q5", correctAnswer: "B" },
      { orderNumber: 6, prompt: "Q6", correctAnswer: "C" },
      { orderNumber: 7, prompt: "Q7", correctAnswer: "A" },
    ],
  };

  const issues = validatePartForPublish(input);
  assert.equal(issues.length, 0);
});

test("validatePartForPublish - Part 8: chấp nhận công khai khi có passageImageUrl (ảnh form đề thi)", () => {
  const input = {
    partNo: 8,
    skill: "READING_WRITING",
    questionType: "FILL_IN",
    title: "Bài điền form Part 8 (dùng ảnh scan form)",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Đọc thông tin và điền vào mẫu đơn",
    status: "PUBLISHED",
    passageText: null,
    passageImageUrl: "https://example.com/ket5-part8-form.png",
    questions: [
      { orderNumber: 1, prompt: "Name:", correctAnswer: "John" },
      { orderNumber: 2, prompt: "Age:", correctAnswer: "16" },
      { orderNumber: 3, prompt: "Day:", correctAnswer: "Tuesday" },
      { orderNumber: 4, prompt: "Time:", correctAnswer: "4:30 pm" },
      { orderNumber: 5, prompt: "Price:", correctAnswer: "12 pounds" },
    ],
  };

  const issues = validatePartForPublish(input);
  assert.equal(issues.length, 0);
});

test("updatePartSchema - chặn cập nhật khi thiếu id", () => {
  const result = updatePartSchema.safeParse({
    partNo: 1,
    skill: "READING_WRITING",
    questionType: "MATCH_POOL",
    title: "Tiêu đề Part",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Nối biển báo",
    status: "DRAFT",
    questions: [
      { orderNumber: 1, prompt: "Q1", correctAnswer: "A" },
    ],
  });

  assert.equal(result.success, false);
});

test("updatePartSchema - hợp lệ khi có đầy đủ id và thông tin hợp lệ", () => {
  const result = updatePartSchema.safeParse({
    id: "part-123",
    partNo: 1,
    skill: "READING_WRITING",
    questionType: "MATCH_POOL",
    title: "Tiêu đề Part cập nhật",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Nối biển báo",
    status: "DRAFT",
    questions: [
      { orderNumber: 1, prompt: "Q1", correctAnswer: "A" },
    ],
  });

  assert.equal(result.success, true);
  assert.equal(result.data.id, "part-123");
});

