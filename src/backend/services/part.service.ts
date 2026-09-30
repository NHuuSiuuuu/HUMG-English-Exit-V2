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

/**
 * Lấy danh sách Part trong kho kèm bộ lọc (tìm kiếm, kỹ năng, partNo, trạng thái)
 */
export async function getParts(filters?: import("@/shared/types/part").PartFilterOptions) {
  const where: Prisma.PartWhereInput = {};

  if (filters?.skill) {
    where.skill = filters.skill;
  }

  if (filters?.partNo) {
    where.partNo = filters.partNo;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.search && filters.search.trim() !== "") {
    const s = filters.search.trim();
    where.OR = [
      { title: { contains: s, mode: "insensitive" } },
      { sourceLabel: { contains: s, mode: "insensitive" } },
      { groupSet: { contains: s, mode: "insensitive" } },
    ];
  }

  const parts = await db.part.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      questionGroups: {
        include: {
          questions: {
            select: { id: true },
          },
        },
      },
    },
  });

  return parts.map((p) => {
    const firstGroup = p.questionGroups[0];
    const totalQuestions = p.questionGroups.reduce(
      (sum, g) => sum + g.questions.length,
      0
    );

    return {
      id: p.id,
      partNo: p.partNo,
      skill: p.skill,
      title: p.title,
      sourceLabel: p.sourceLabel,
      groupSet: p.groupSet,
      difficulty: p.difficulty,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      questionType: firstGroup?.type || "MCQ3",
      totalQuestions,
    };
  });
}

/**
 * Lấy số liệu thống kê tổng quan của Kho phần
 */
export async function getPartStats() {
  const allParts = await db.part.findMany({
    select: {
      id: true,
      partNo: true,
      status: true,
    },
  });

  const totalParts = allParts.length;
  let publishedCount = 0;
  let draftCount = 0;
  const countsByPartNo: Record<number, number> = {};

  for (let i = 1; i <= 14; i++) {
    countsByPartNo[i] = 0;
  }

  for (const p of allParts) {
    if (p.status === "PUBLISHED") publishedCount++;
    if (p.status === "DRAFT") draftCount++;
    countsByPartNo[p.partNo] = (countsByPartNo[p.partNo] || 0) + 1;
  }

  const coveredPartTypesCount = Object.values(countsByPartNo).filter(
    (c) => c > 0
  ).length;

  return {
    totalParts,
    publishedCount,
    draftCount,
    coveredPartTypesCount,
    countsByPartNo,
  };
}

/**
 * Xóa một Part khỏi cơ sở dữ liệu
 */
export async function deletePart(id: string) {
  try {
    await db.part.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

export const partService = {
  createPart,
  checkPartCompleteness,
  getParts,
  getPartStats,
  deletePart,
};

