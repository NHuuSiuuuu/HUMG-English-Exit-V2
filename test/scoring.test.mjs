import test from "node:test";
import assert from "node:assert/strict";

// Hàm logic chấm điểm (kiểm thử thuần)
function calculateScore(userAnswers, answerKeys) {
  const questionIds = Object.keys(answerKeys);
  const totalQuestions = questionIds.length;
  let correctCount = 0;

  const details = questionIds.map((qId) => {
    const userAnswer = (userAnswers[qId] || "").trim().toLowerCase();
    const correctKey = answerKeys[qId];

    let isCorrect = false;
    if (Array.isArray(correctKey)) {
      isCorrect = correctKey.some((k) => k.trim().toLowerCase() === userAnswer);
    } else if (typeof correctKey === "string") {
      isCorrect = correctKey.trim().toLowerCase() === userAnswer;
    }

    if (isCorrect) correctCount++;
    return { questionId: qId, isCorrect, userAnswer: userAnswers[qId] };
  });

  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  return { totalQuestions, correctCount, scorePercentage, details };
}

test("calculateScore - chấm đúng trắc nghiệm đơn và điền từ", () => {
  const keys = { q1: "A", q2: "B", q3: "center" };
  const user = { q1: "A", q2: "c", q3: "CENTER " };

  const result = calculateScore(user, keys);
  assert.equal(result.totalQuestions, 3);
  assert.equal(result.correctCount, 2);
  assert.equal(result.scorePercentage, 67);
  assert.equal(result.details[0].isCorrect, true);
  assert.equal(result.details[1].isCorrect, false);
  assert.equal(result.details[2].isCorrect, true);
});

test("calculateScore - chấp nhận nhiều đáp án đúng (accepted_answers)", () => {
  const keys = { q1: ["theatre", "theater"] };
  const user1 = { q1: "theater" };
  const user2 = { q1: "theatre" };

  assert.equal(calculateScore(user1, keys).correctCount, 1);
  assert.equal(calculateScore(user2, keys).correctCount, 1);
});
