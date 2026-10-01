import test from "node:test";
import assert from "node:assert/strict";
import { createPartService } from "./helpers/part.service.mjs";

test("createPart - ném lỗi nếu lưu trạng thái PUBLISHED mà chưa đạt thẩm định", async () => {
  const mockDb = {
    part: {
      create: async () => assert.fail("Không được gọi db.create khi chưa đạt thẩm định"),
    },
  };

  const service = createPartService(mockDb);

  const invalidInput = {
    partNo: 1,
    skill: "READING_WRITING",
    questionType: "MATCH_POOL",
    title: "Part 1 thiếu câu",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Nối biển báo",
    status: "PUBLISHED",
    questions: [
      { orderNumber: 1, prompt: "Q1", correctAnswer: "A" },
    ], // Part 1 cần 5 câu
  };

  await assert.rejects(
    async () => {
      await service.createPart(invalidInput);
    },
    (err) => {
      assert.match(err.message, /chưa đủ điều kiện để công khai/);
      assert.equal(Array.isArray(err.issues), true);
      return true;
    }
  );
});

test("createPart - lưu thành công bản nháp (DRAFT) với nested write vào database", async () => {
  let createdData = null;

  const mockDb = {
    part: {
      create: async ({ data }) => {
        createdData = data;
        return {
          id: "part-test-123",
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
    },
  };

  const service = createPartService(mockDb);

  const draftInput = {
    partNo: 1,
    skill: "READING_WRITING",
    questionType: "MATCH_POOL",
    title: "Bản nháp Part 1",
    sourceLabel: "KET 5 · Test 1",
    groupSet: "KET 5",
    instructions: "Nối biển báo",
    status: "DRAFT",
    passageText: "A: ...\nB: ...",
    poolOptions: [
      { letter: "A", text: "Biển A" },
    ],
    questions: [
      { orderNumber: 1, prompt: "Câu 1", correctAnswer: "A" },
    ],
  };

  const result = await service.createPart(draftInput);

  assert.equal(result.id, "part-test-123");
  assert.equal(createdData.partNo, 1);
  assert.equal(createdData.status, "DRAFT");
  assert.equal(createdData.questionGroups.create.length, 1);
  assert.equal(createdData.questionGroups.create[0].type, "MATCH_POOL");
  assert.equal(createdData.questionGroups.create[0].questions.create.length, 1);
  assert.equal(createdData.questionGroups.create[0].questions.create[0].prompt, "Câu 1");
});

test("getPartById - trả về chi tiết đầy đủ khi tìm thấy Part", async () => {
  const mockDb = {
    part: {
      findUnique: async ({ where }) => {
        if (where.id !== "part-exist") return null;
        return {
          id: "part-exist",
          partNo: 2,
          skill: "READING_WRITING",
          title: "Part 2 MCQ3",
          sourceLabel: "KET 5 · Test 1",
          groupSet: "KET 5",
          instructions: "Chọn A/B/C",
          exampleRow: null,
          difficulty: "MEDIUM",
          status: "DRAFT",
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-02"),
          questionGroups: [
            {
              type: "MCQ3",
              questions: [
                { id: "q1", orderNumber: 1, prompt: "Prompt 1", correctAnswer: "A" },
              ],
            },
          ],
        };
      },
    },
  };

  const service = createPartService(mockDb);
  const part = await service.getPartById("part-exist");

  assert.ok(part);
  assert.equal(part.id, "part-exist");
  assert.equal(part.partNo, 2);
  assert.equal(part.questionType, "MCQ3");
  assert.equal(part.questions.length, 1);
});

test("getPartById - trả về null khi không tìm thấy Part", async () => {
  const mockDb = {
    part: {
      findUnique: async () => null,
    },
  };

  const service = createPartService(mockDb);
  const part = await service.getPartById("non-existent-id");
  assert.equal(part, null);
});

test("updatePart - ném lỗi nếu không tìm thấy Part theo id", async () => {
  const mockDb = {
    part: {
      findUnique: async () => null,
    },
  };

  const service = createPartService(mockDb);
  await assert.rejects(
    async () => {
      await service.updatePart({
        id: "not-found",
        partNo: 1,
        skill: "READING_WRITING",
        questionType: "MATCH_POOL",
        title: "Test",
        sourceLabel: "KET 5",
        groupSet: "KET 5",
        instructions: "Test",
        status: "DRAFT",
        questions: [],
      });
    },
    (err) => {
      assert.match(err.message, /Không tìm thấy Part cần cập nhật/);
      return true;
    }
  );
});

test("updatePart - ném lỗi nếu chuyển sang PUBLISHED mà chưa đạt thẩm định", async () => {
  const mockDb = {
    part: {
      findUnique: async () => ({ id: "part-1" }),
    },
  };

  const service = createPartService(mockDb);
  await assert.rejects(
    async () => {
      await service.updatePart({
        id: "part-1",
        partNo: 1,
        skill: "READING_WRITING",
        questionType: "MATCH_POOL",
        title: "Part 1 thiếu câu",
        sourceLabel: "KET 5",
        groupSet: "KET 5",
        instructions: "Test",
        status: "PUBLISHED",
        questions: [{ orderNumber: 1, prompt: "Q1", correctAnswer: "A" }],
      });
    },
    (err) => {
      assert.match(err.message, /chưa đủ điều kiện để công khai/);
      assert.equal(Array.isArray(err.issues), true);
      return true;
    }
  );
});

test("updatePart - cập nhật thành công bản nháp", async () => {
  let updatedPayload = null;
  const mockDb = {
    part: {
      findUnique: async () => ({ id: "part-1" }),
      update: async ({ data }) => {
        updatedPayload = data;
        return { id: "part-1", ...data };
      },
    },
  };

  const service = createPartService(mockDb);
  const input = {
    id: "part-1",
    partNo: 1,
    skill: "READING_WRITING",
    questionType: "MATCH_POOL",
    title: "Tiêu đề đã sửa",
    sourceLabel: "KET 5",
    groupSet: "KET 5",
    instructions: "Hướng dẫn mới",
    status: "DRAFT",
    questions: [{ orderNumber: 1, prompt: "Q1", correctAnswer: "B" }],
  };

  const result = await service.updatePart(input);
  assert.equal(result.id, "part-1");
  assert.equal(updatedPayload.title, "Tiêu đề đã sửa");
});
