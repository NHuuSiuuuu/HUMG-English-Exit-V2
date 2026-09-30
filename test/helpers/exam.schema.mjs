import { z } from "zod";

export const examPartAssignmentSchema = z.object({
  partNo: z.number().int().min(1).max(14, "Mỗi Part trong đề thi phải từ 1 đến 14"),
  partId: z.string().min(1, "Vui lòng chọn bài từ kho phần"),
});

export const createExamSchema = z.object({
  code: z
    .string()
    .min(3, "Mã đề thi phải có ít nhất 3 ký tự")
    .max(50, "Mã đề thi không được quá 50 ký tự")
    .regex(/^[A-Za-z0-9_-]+$/, "Mã đề thi chỉ chứa chữ cái, số, dấu gạch nối hoặc gạch dưới"),
  title: z
    .string()
    .min(3, "Tên đề thi phải có ít nhất 3 ký tự")
    .max(255, "Tên đề thi không vượt quá 255 ký tự"),
  description: z.string().nullable().optional(),
  durationMinutes: z.number().int().min(10, "Thời lượng tối thiểu 10 phút").max(180).default(60),
  difficulty: z.string().default("MEDIUM"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  partSelections: z.array(examPartAssignmentSchema).default([]),
});

export function validateExamForPublish(input) {
  const issues = [];

  if (!input.code || input.code.trim().length < 3) {
    issues.push({
      field: "code",
      message: "Mã đề thi bắt buộc phải có ít nhất 3 ký tự",
      severity: "error",
    });
  }

  if (!input.title || input.title.trim().length < 3) {
    issues.push({
      field: "title",
      message: "Tên đề thi bắt buộc phải có ít nhất 3 ký tự",
      severity: "error",
    });
  }

  const selections = input.partSelections || [];
  const assignedPartNos = new Set();
  const duplicatePartNos = new Set();

  selections.forEach((sel) => {
    if (assignedPartNos.has(sel.partNo)) {
      duplicatePartNos.add(sel.partNo);
    }
    assignedPartNos.add(sel.partNo);
  });

  if (duplicatePartNos.size > 0) {
    issues.push({
      field: "partSelections",
      message: `Đề thi bị trùng lặp Part ${Array.from(duplicatePartNos).join(", ")}. Mỗi Part chỉ được gắn một bài duy nhất.`,
      severity: "error",
    });
  }

  const missingParts = [];
  for (let p = 1; p <= 14; p++) {
    if (!assignedPartNos.has(p)) {
      missingParts.push(p);
    }
  }

  if (missingParts.length > 0) {
    issues.push({
      field: "partSelections",
      message: `Đề thi chưa đủ 14 phần theo chuẩn Cambridge KET. Còn thiếu Part: ${missingParts.join(", ")}`,
      severity: "error",
    });
  }

  return issues;
}
