import { validatePartForPublish } from "../../shared/schemas/part.schema.mjs";

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
  };
}
