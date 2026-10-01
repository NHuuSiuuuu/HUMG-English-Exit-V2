import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Hàm logic thuần chấm điểm toàn bộ bài thi 14 phần
function calculateExamScore(examParts, userAnswers) {
  let readingCorrect = 0;
  let readingTotal = 0;
  let listeningCorrect = 0;
  let listeningTotal = 0;

  const partResults = [];
  let writingEvaluation = null;

  for (const part of examParts) {
    const isListening = part.partNo >= 10 || part.skill === "LISTENING";
    const group = part.questionGroup;
    const questions = group.questions || [];

    if (group.type === "WRITING" || part.partNo === 9) {
      // Part 9 Writing: Tách riêng, không tính vào điểm trắc nghiệm khách quan
      const q = questions[0];
      const userAnswer = q ? (userAnswers[q.id] || "").trim() : "";
      const wordCount = userAnswer ? userAnswer.split(/\s+/).filter(Boolean).length : 0;
      const minWords = group.minWords || 25;
      const maxWords = group.maxWords || 35;
      const isWordCountValid = wordCount >= minWords && wordCount <= maxWords;

      writingEvaluation = {
        questionId: q?.id,
        userAnswer,
        wordCount,
        minWords,
        maxWords,
        isWordCountValid,
        sampleWriting: group.sampleWriting || "",
      };

      partResults.push({
        partNo: part.partNo,
        title: part.title,
        skill: part.skill,
        isObjective: false,
        writing: writingEvaluation,
      });
      continue;
    }

    let partCorrect = 0;
    const questionDetails = [];

    for (const q of questions) {
      const userAnswer = (userAnswers[q.id] || "").trim();
      const correctKey = (q.correctAnswer || "").trim();
      const acceptedAnswers = Array.isArray(q.acceptedAnswers) ? q.acceptedAnswers : [];

      let isCorrect = false;

      if (group.type === "SHORT_TEXT") {
        const normalizedUser = userAnswer.toLowerCase();
        if (normalizedUser.length > 0) {
          const allOptions = [correctKey, ...acceptedAnswers].map((k) => k.trim().toLowerCase());
          isCorrect = allOptions.includes(normalizedUser);
        }
      } else {
        isCorrect = userAnswer.length > 0 && userAnswer.toUpperCase() === correctKey.toUpperCase();
      }

      if (isCorrect) {
        partCorrect++;
        if (isListening) {
          listeningCorrect++;
        } else {
          readingCorrect++;
        }
      }

      if (isListening) {
        listeningTotal++;
      } else {
        readingTotal++;
      }

      questionDetails.push({
        questionId: q.id,
        orderNumber: q.orderNumber,
        userAnswer,
        correctAnswer: correctKey,
        isCorrect,
        explanation: q.explanation || "",
      });
    }

    partResults.push({
      partNo: part.partNo,
      title: part.title,
      skill: part.skill,
      isObjective: true,
      totalQuestions: questions.length,
      correctCount: partCorrect,
      scorePercent: questions.length > 0 ? Math.round((partCorrect / questions.length) * 100) : 0,
      details: questionDetails,
      transcript: group.transcript || null,
    });
  }

  const totalCorrect = readingCorrect + listeningCorrect;
  const totalQuestions = readingTotal + listeningTotal;
  const overallScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const readingScore = readingTotal > 0 ? Math.round((readingCorrect / readingTotal) * 100) : 0;
  const listeningScore = listeningTotal > 0 ? Math.round((listeningCorrect / listeningTotal) * 100) : 0;
  const isPassed = overallScore >= 50;

  return {
    readingCorrect,
    readingTotal,
    readingScore,
    listeningCorrect,
    listeningTotal,
    listeningScore,
    totalCorrect,
    totalQuestions,
    overallScore,
    isPassed,
    writingEvaluation,
    partResults,
  };
}

describe("Logic Chấm Điểm Toàn Bộ Đề Thi 14 Phần (TDD)", () => {
  const mockExamParts = [
    // Reading Part 1: Trắc nghiệm/ghép kho
    {
      partNo: 1,
      skill: "READING_WRITING",
      title: "Biển báo",
      questionGroup: {
        type: "MATCH_POOL",
        questions: [
          { id: "q1_1", orderNumber: 1, correctAnswer: "A", explanation: "Biển A nói về đỗ xe" },
          { id: "q1_2", orderNumber: 2, correctAnswer: "B", explanation: "Biển B thông báo giảm giá" },
        ],
      },
    },
    // Reading Part 6: Điền từ ngắn
    {
      partNo: 6,
      skill: "READING_WRITING",
      title: "Đoán từ",
      questionGroup: {
        type: "SHORT_TEXT",
        questions: [
          { id: "q6_1", orderNumber: 36, correctAnswer: "passport", acceptedAnswers: ["a passport"], explanation: "Hộ chiếu" },
        ],
      },
    },
    // Part 9: Writing
    {
      partNo: 9,
      skill: "READING_WRITING",
      title: "Viết note",
      questionGroup: {
        type: "WRITING",
        minWords: 25,
        maxWords: 35,
        sampleWriting: "Hi Tom, I am so happy to visit you tomorrow...",
        questions: [
          { id: "q9_1", orderNumber: 56, correctAnswer: "", explanation: "Bài viết mẫu" },
        ],
      },
    },
    // Listening Part 10: Trắc nghiệm ảnh
    {
      partNo: 10,
      skill: "LISTENING",
      title: "Listening 1",
      questionGroup: {
        type: "MCQ3_IMAGE",
        transcript: "Boy: Where is the clock? Girl: It is on the desk.",
        questions: [
          { id: "q10_1", orderNumber: 1, correctAnswer: "C", explanation: "Đáp án C" },
        ],
      },
    },
    // Listening Part 13: Điền form nghe
    {
      partNo: 13,
      skill: "LISTENING",
      title: "Listening 4",
      questionGroup: {
        type: "SHORT_TEXT",
        transcript: "The bus arrives at 9:30.",
        questions: [
          { id: "q13_1", orderNumber: 16, correctAnswer: "9:30", acceptedAnswers: ["9.30", "half past nine"], explanation: "9 giờ 30" },
        ],
      },
    },
  ];

  it("phân tách chính xác điểm Reading và Listening, loại trừ Writing khỏi tổng điểm trắc nghiệm", () => {
    const userAnswers = {
      q1_1: "A", // Đúng
      q1_2: "C", // Sai (Đáp án là B)
      q6_1: " Passport ", // Đúng (chữ hoa/khoảng trắng thừa)
      q9_1: "Hi Tom, I would love to meet you at the university library this Friday afternoon. We can study English together and then have some coffee.", // 24 từ
      q10_1: "C", // Đúng
      q13_1: "half past nine", // Đúng (accepted answer)
    };

    const result = calculateExamScore(mockExamParts, userAnswers);

    // Reading: q1_1 (đúng), q1_2 (sai), q6_1 (đúng) -> 2/3 câu
    assert.equal(result.readingCorrect, 2);
    assert.equal(result.readingTotal, 3);
    assert.equal(result.readingScore, 67);

    // Listening: q10_1 (đúng), q13_1 (đúng) -> 2/2 câu
    assert.equal(result.listeningCorrect, 2);
    assert.equal(result.listeningTotal, 2);
    assert.equal(result.listeningScore, 100);

    // Tổng quan trắc nghiệm: 4/5 câu = 80% -> Đạt
    assert.equal(result.totalCorrect, 4);
    assert.equal(result.totalQuestions, 5);
    assert.equal(result.overallScore, 80);
    assert.equal(result.isPassed, true);

    // Writing tách riêng
    assert.ok(result.writingEvaluation);
    assert.equal(result.writingEvaluation.wordCount, 25);
    assert.equal(result.writingEvaluation.isWordCountValid, true);
    assert.ok(result.writingEvaluation.sampleWriting.length > 0);
  });

  it("xử lý trường hợp nộp bài để trống hoàn toàn", () => {
    const result = calculateExamScore(mockExamParts, {});
    assert.equal(result.totalCorrect, 0);
    assert.equal(result.overallScore, 0);
    assert.equal(result.isPassed, false);
    assert.equal(result.writingEvaluation.wordCount, 0);
    assert.equal(result.writingEvaluation.isWordCountValid, false);
  });
});
