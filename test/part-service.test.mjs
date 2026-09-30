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
