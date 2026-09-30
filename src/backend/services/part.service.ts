import "server-only";

import { db } from "@/backend/lib/db";
import { Prisma } from "@prisma/client";
import type { CreatePartInput, PartCompletenessIssue } from "@/shared/types/part";
import { validatePartForPublish } from "@/shared/schemas/part.schema";

export class PartValidationError extends Error {
  issues: PartCompletenessIssue[];

  constructor(message: string, issues: PartCompletenessIssue[]) {
    super(message);
    this.name = "PartValidationError";
    this.issues = issues;
  }
}

/**
 * Kiểm tra tính đầy đủ của Part trước khi công khai.
 */
export function checkPartCompleteness(input: CreatePartInput): PartCompletenessIssue[] {
  return validatePartForPublish(input);
}

/**
 * Tạo mới một Part cùng toàn bộ nhóm câu hỏi và câu hỏi liên quan trong PostgreSQL.
 */
export async function createPart(input: CreatePartInput, _adminId?: string) {
  // Nếu lưu với trạng thái PUBLISHED: bắt buộc thẩm định đạt chuẩn
  if (input.status === "PUBLISHED") {
    const issues = checkPartCompleteness(input);
    if (issues.length > 0) {
      throw new PartValidationError("Nội dung Part chưa đủ điều kiện để công khai", issues);
    }
  }

  // Thực hiện ghi quan hệ lồng nhau (nested write) an toàn
  const newPart = await db.part.create({
    data: {
      partNo: input.partNo,
      skill: input.skill,
      title: input.title,
      sourceLabel: input.sourceLabel,
      groupSet: input.groupSet,
      instructions: input.instructions,
      exampleRow: input.exampleRow ? (input.exampleRow as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
      difficulty: input.difficulty ?? "MEDIUM",
      status: input.status,
      questionGroups: {
        create: [
          {
            type: input.questionType,
            order: 1,
            passageText: input.passageText || null,
            audioUrl: input.audioUrl || null,
            maxPlays: input.maxPlays ?? 2,
            transcript: input.transcript || null,
            poolOptions: input.poolOptions ? (input.poolOptions as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
            writingRequirements: input.writingRequirements ? (input.writingRequirements as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
            minWords: input.minWords ?? (input.questionType === "WRITING" ? 25 : null),
            maxWords: input.maxWords ?? (input.questionType === "WRITING" ? 35 : null),
            sampleWriting: input.sampleWriting || null,
            questions: {
              create: input.questions.map((q, idx) => ({
                orderNumber: q.orderNumber || idx + 1,
                prompt: q.prompt,
                options: q.options ? (q.options as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
                correctAnswer: q.correctAnswer,
                acceptedAnswers: q.acceptedAnswers ? (q.acceptedAnswers as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
                explanation: q.explanation || null,
                firstLetterHint: q.firstLetterHint || null,
                charCountHint: q.charCountHint ?? null,
                formFieldLabel: q.formFieldLabel || null,
              })),
            },
          },
        ],
      },
    },
    include: {
      questionGroups: {
        include: {
          questions: true,
        },
      },
    },
  });

  return newPart;
}

export const partService = {
  createPart,
  checkPartCompleteness,
};
