import { z } from "zod";

export const KET_PART_QUESTION_COUNTS = {
  1: 5,
  2: 5,
  3: 5,
  4: 7,
  5: 8,
  6: 5,
  7: 10,
  8: 5,
  9: 1,
  10: 5,
  11: 5,
  12: 5,
  13: 5,
  14: 5,
};

export const questionOptionSchema = z.object({
  key: z.string().min(1, "Thiếu ký hiệu lựa chọn (A, B, C)"),
  text: z.string(),
  imageUrl: z.string().optional().or(z.literal("")),
});

export const questionInputItemSchema = z.object({
  id: z.string().optional(),
  orderNumber: z.number().int().min(1),
  prompt: z.string().min(1, "Nội dung câu hỏi không được để trống"),
  options: z.array(questionOptionSchema).optional(),
  correctAnswer: z.string(),
  acceptedAnswers: z.array(z.string()).optional(),
  explanation: z.string().optional().or(z.literal("")),
  firstLetterHint: z.string().optional().or(z.literal("")),
  charCountHint: z.number().optional(),
  formFieldLabel: z.string().optional().or(z.literal("")),
});

export const poolOptionSchema = z.object({
  letter: z.string().min(1),
  text: z.string().min(1, "Nội dung lựa chọn không được để trống"),
});

export const exampleRowSchema = z.object({
  question: z.string().min(1),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional().or(z.literal("")),
});

export const createPartSchema = z.object({
  partNo: z.number().int().min(1, "Part tối thiểu là 1").max(14, "Part tối đa là 14"),
  skill: z.enum(["READING_WRITING", "LISTENING"], {
    errorMap: () => ({ message: "Kỹ năng phải là READING_WRITING hoặc LISTENING" }),
  }),
  questionType: z.enum([
    "MATCH_POOL",
    "MCQ3",
    "MCQ3_IMAGE",
    "CLOZE_MCQ",
    "SHORT_TEXT",
    "WRITING",
  ], {
    errorMap: () => ({ message: "Dạng câu hỏi không hợp lệ" }),
  }),
  title: z.string().min(3, "Tiêu đề bài luyện phải có ít nhất 3 ký tự").max(200, "Tiêu đề quá dài"),
  sourceLabel: z.string().min(1, "Vui lòng nhập nhãn nguồn đề (VD: KET 5 · Test 1)"),
  groupSet: z.string().min(1, "Vui lòng nhập nhóm bộ đề (VD: KET 5)"),
  instructions: z.string().min(1, "Vui lòng nhập hướng dẫn làm bài"),
  exampleRow: exampleRowSchema.nullable().optional(),
  difficulty: z.string().default("MEDIUM"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),

  // Stimulus
  passageText: z.string().nullable().optional(),
  audioUrl: z.string().nullable().optional(),
  maxPlays: z.number().int().min(1).max(3).default(2),
  transcript: z.string().nullable().optional(),
  poolOptions: z.array(poolOptionSchema).nullable().optional(),
  writingRequirements: z.array(z.string()).nullable().optional(),
  minWords: z.number().int().optional(),
  maxWords: z.number().int().optional(),
  sampleWriting: z.string().nullable().optional(),

  // Danh sách câu hỏi
  questions: z.array(questionInputItemSchema),
});

export function validatePartForPublish(input) {
  const issues = [];
  const partNo = input.partNo ?? 1;
  const expectedCount = KET_PART_QUESTION_COUNTS[partNo] ?? 5;
  const questions = input.questions ?? [];

  if (questions.length !== expectedCount) {
    issues.push({
      field: "questions",
      message: `Part ${partNo} yêu cầu đúng ${expectedCount} câu hỏi (hiện tại có ${questions.length} câu)`,
      severity: "error",
    });
  }

  questions.forEach((q, idx) => {
    if (!q.correctAnswer || q.correctAnswer.trim() === "") {
      issues.push({
        field: `questions[${idx}].correctAnswer`,
        message: `Vui lòng chọn hoặc nhập đáp án đúng cho câu ${q.orderNumber || idx + 1}`,
        severity: "error",
      });
    }
  });

  if (input.skill === "LISTENING") {
    if (!input.audioUrl || input.audioUrl.trim() === "") {
      issues.push({
        field: "audioUrl",
        message: "Bài thi Listening bắt buộc phải có đường dẫn file Audio (MP3 URL)",
        severity: "error",
      });
    }
  }

  if ([4, 5, 7, 8].includes(partNo)) {
    if (!input.passageText || input.passageText.trim() === "") {
      issues.push({
        field: "passageText",
        message: `Part ${partNo} bắt buộc phải có nội dung văn bản bài đọc hoặc đoạn văn khuyết`,
        severity: "error",
      });
    }
  }

  if (input.questionType === "MATCH_POOL" || [1, 11].includes(partNo)) {
    const pool = input.poolOptions ?? [];
    if (pool.length < 5) {
      issues.push({
        field: "poolOptions",
        message: "Dạng bài nối kho đáp án yêu cầu tối thiểu 5 phương án trong bảng A-H",
        severity: "error",
      });
    }
  }

  return issues;
}
