import { validatePartForPublish } from "./part.schema.mjs";

export class PartValidationError extends Error {
  constructor(message, issues) {
    super(message);
    this.name = "PartValidationError";
    this.issues = issues;
  }
}

export function createPartService(dbClient) {
  return {
    checkPartCompleteness(input) {
      return validatePartForPublish(input);
    },

    async createPart(input, _adminId) {
      if (input.status === "PUBLISHED") {
        const issues = validatePartForPublish(input);
        if (issues.length > 0) {
          throw new PartValidationError("Nội dung Part chưa đủ điều kiện để công khai", issues);
        }
      }

      return dbClient.part.create({
        data: {
          partNo: input.partNo,
          skill: input.skill,
          title: input.title,
          sourceLabel: input.sourceLabel,
          groupSet: input.groupSet,
          instructions: input.instructions,
          exampleRow: input.exampleRow || null,
          difficulty: input.difficulty || "MEDIUM",
          status: input.status,
          questionGroups: {
            create: [
              {
                type: input.questionType,
                order: 1,
                passageText: input.passageText || null,
                passageImageUrl: input.passageImageUrl || null,
                audioUrl: input.audioUrl || null,
                maxPlays: input.maxPlays || 2,
                transcript: input.transcript || null,
                poolOptions: input.poolOptions || null,
                writingRequirements: input.writingRequirements || null,
                minWords: input.minWords || (input.questionType === "WRITING" ? 25 : null),
                maxWords: input.maxWords || (input.questionType === "WRITING" ? 35 : null),
                sampleWriting: input.sampleWriting || null,
                questions: {
                  create: input.questions.map((q, idx) => ({
                    orderNumber: q.orderNumber || idx + 1,
                    prompt: q.prompt,
                    options: q.options || null,
                    correctAnswer: q.correctAnswer,
                    acceptedAnswers: q.acceptedAnswers || null,
                    explanation: q.explanation || null,
                    firstLetterHint: q.firstLetterHint || null,
                    charCountHint: q.charCountHint || null,
                    formFieldLabel: q.formFieldLabel || null,
                  })),
                },
              },
            ],
          },
        },
      });
    },

    async getPartById(id) {
      const part = await dbClient.part.findUnique({
        where: { id },
        include: {
          questionGroups: {
            include: {
              questions: true,
            },
          },
        },
      });

      if (!part) return null;

      const firstGroup = part.questionGroups?.[0];
      return {
        id: part.id,
        partNo: part.partNo,
        skill: part.skill,
        questionType: firstGroup?.type || "MCQ3",
        title: part.title,
        sourceLabel: part.sourceLabel,
        groupSet: part.groupSet,
        instructions: part.instructions,
        exampleRow: part.exampleRow || null,
        difficulty: part.difficulty,
        status: part.status,
        createdAt: part.createdAt instanceof Date ? part.createdAt.toISOString() : String(part.createdAt),
        updatedAt: part.updatedAt instanceof Date ? part.updatedAt.toISOString() : String(part.updatedAt),
        passageText: firstGroup?.passageText || null,
        passageImageUrl: firstGroup?.passageImageUrl || null,
        audioUrl: firstGroup?.audioUrl || null,
        maxPlays: firstGroup?.maxPlays || 2,
        transcript: firstGroup?.transcript || null,
        poolOptions: firstGroup?.poolOptions || null,
        writingRequirements: firstGroup?.writingRequirements || null,
        minWords: firstGroup?.minWords || null,
        maxWords: firstGroup?.maxWords || null,
        sampleWriting: firstGroup?.sampleWriting || null,
        questions: firstGroup?.questions || [],
      };
    },

    async updatePart(input, _adminId) {
      const existing = await dbClient.part.findUnique({ where: { id: input.id } });
      if (!existing) {
        throw new Error("Không tìm thấy Part cần cập nhật");
      }

      if (input.status === "PUBLISHED") {
        const issues = validatePartForPublish(input);
        if (issues.length > 0) {
          throw new PartValidationError("Nội dung Part chưa đủ điều kiện để công khai", issues);
        }
      }

      if (dbClient.$transaction) {
        return dbClient.$transaction(async (tx) => {
          await tx.part.update({
            where: { id: input.id },
            data: { ...input },
          });
          return { id: input.id, ...input };
        });
      }

      if (dbClient.part.update) {
        await dbClient.part.update({
          where: { id: input.id },
          data: { ...input },
        });
      }

      return { id: input.id, ...input };
    },

    async updatePartStatus(id, status) {
      const part = await this.getPartById(id);
      if (!part) {
        throw new Error("Không tìm thấy Part cần đổi trạng thái");
      }

      if (status === "PUBLISHED") {
        const issues = validatePartForPublish(part);
        if (issues.length > 0) {
          throw new PartValidationError("Nội dung Part chưa đủ điều kiện để công khai", issues);
        }
      }

      if (dbClient.part.update) {
        await dbClient.part.update({
          where: { id },
          data: { status },
        });
      }

      return { id, status };
    },
  };
}
